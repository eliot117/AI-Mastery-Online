import { supabase } from './supabase';
import type { Folder, NewFolder, NewTool, Tool } from '../types';
import { normalizeUserUrl } from './safeUrl';

/**
 * Row-Level Security is the access-control boundary: the database only ever
 * returns rows the signed-in user is entitled to. Reads here additionally
 * scope to `owner_id = <me>` for a different reason -- correctness, not
 * security.
 *
 * The RLS SELECT policy also exposes the shared base template
 * (`owner_id IS NULL`) to admins, since an admin must be able to manage it.
 * Without an explicit owner filter an admin's own library would come back
 * with the template merged in, showing every folder twice. Personal library
 * reads are therefore always owner-scoped; the template is fetched
 * deliberately via `fetchBaseTemplate`.
 */

export interface Library {
  folders: Folder[];
  tools: Tool[];
}

/**
 * Reads the signed-in user's id from the local session — no network call.
 * `getUser()` would re-verify the token against the Auth server every time,
 * which is an extra network dependency at exactly the moment it's least
 * reliable (right after an OAuth redirect). Not a security trade-off: every
 * query is re-checked against the real token by Postgres RLS regardless of
 * what id we read here, so a stale/forged local value can never grant access
 * -- it can only ever cause a request to be correctly rejected.
 */
async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.user) throw new Error('Not signed in');
  return data.session.user.id;
}

/** The signed-in user's own library. Never includes the base template. */
export async function fetchLibrary(): Promise<Library> {
  const ownerId = await requireUserId();

  const [foldersRes, toolsRes] = await Promise.all([
    supabase.from('folders').select('*').eq('owner_id', ownerId).order('position'),
    supabase.from('tools').select('*').eq('owner_id', ownerId).order('position'),
  ]);

  if (foldersRes.error) throw foldersRes.error;
  if (toolsRes.error) throw toolsRes.error;

  return {
    folders: (foldersRes.data ?? []) as Folder[],
    tools: (toolsRes.data ?? []) as Tool[],
  };
}

/**
 * The shared starter library every new account is cloned from. Admin-only at
 * the database level; kept separate from `fetchLibrary` so template rows can
 * never leak into a personal galaxy view.
 */
export async function fetchBaseTemplate(): Promise<Library> {
  const [foldersRes, toolsRes] = await Promise.all([
    supabase.from('folders').select('*').is('owner_id', null).order('position'),
    supabase.from('tools').select('*').is('owner_id', null).order('position'),
  ]);

  if (foldersRes.error) throw foldersRes.error;
  if (toolsRes.error) throw toolsRes.error;

  return {
    folders: (foldersRes.data ?? []) as Folder[],
    tools: (toolsRes.data ?? []) as Tool[],
  };
}

// ─── Tools ───────────────────────────────────────────────────────────────

export async function createTool(input: NewTool): Promise<Tool> {
  const owner_id = await requireUserId();
  const url = normalizeUserUrl(input.url);
  if (!url) throw new Error('Enter a valid http(s) web address.');

  const { data, error } = await supabase
    .from('tools')
    .insert({
      owner_id,
      folder_id: input.folder_id,
      name: input.name.trim(),
      url,
      description: input.description?.trim() || null,
      icon: input.icon ?? input.name.trim().charAt(0).toUpperCase(),
      logo_url: input.logo_url ? normalizeUserUrl(input.logo_url) : null,
      position: input.position ?? 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Tool;
}

export async function updateTool(
  id: string,
  patch: Partial<Pick<Tool, 'name' | 'url' | 'description' | 'icon' | 'logo_url' | 'folder_id' | 'position'>>,
): Promise<Tool> {
  const payload: Record<string, unknown> = { ...patch };

  if (patch.url !== undefined) {
    const url = normalizeUserUrl(patch.url);
    if (!url) throw new Error('Enter a valid http(s) web address.');
    payload.url = url;
  }
  if (patch.logo_url !== undefined) {
    payload.logo_url = patch.logo_url ? normalizeUserUrl(patch.logo_url) : null;
  }
  if (patch.name !== undefined) payload.name = patch.name.trim();

  const { data, error } = await supabase
    .from('tools')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Tool;
}

export async function deleteTool(id: string): Promise<void> {
  const { error } = await supabase.from('tools').delete().eq('id', id);
  if (error) throw error;
}

/**
 * Moves a tool into another folder and appends it to the end of that
 * folder's order. The database enforces that the destination folder has the
 * same owner, so a tool can never be parked in someone else's folder.
 */
export async function moveToolToFolder(
  toolId: string,
  folderId: string,
  position: number,
): Promise<Tool> {
  const { data, error } = await supabase
    .from('tools')
    .update({ folder_id: folderId, position })
    .eq('id', toolId)
    .select()
    .single();

  if (error) throw error;
  return data as Tool;
}

export async function reorderTools(orderedIds: string[]): Promise<void> {
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('tools').update({ position: index }).eq('id', id),
    ),
  );
}

// ─── Folders ─────────────────────────────────────────────────────────────

export async function createFolder(input: NewFolder): Promise<Folder> {
  const owner_id = await requireUserId();

  const { data, error } = await supabase
    .from('folders')
    .insert({
      owner_id,
      parent_folder_id: input.parent_folder_id ?? null,
      name: input.name.trim(),
      position: input.position ?? 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Folder;
}

export async function renameFolder(id: string, name: string): Promise<Folder> {
  const { data, error } = await supabase
    .from('folders')
    .update({ name: name.trim() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Folder;
}

/** Cascades in the database: sub-folders and contained tools go with it. */
export async function deleteFolder(id: string): Promise<void> {
  const { error } = await supabase.from('folders').delete().eq('id', id);
  if (error) throw error;
}

export async function reorderFolders(orderedIds: string[]): Promise<void> {
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('folders').update({ position: index }).eq('id', id),
    ),
  );
}

/**
 * Discards every edit made in this exact folder (renamed, added, deleted, or
 * reordered tools) and restores it to whatever the base template currently
 * has. Nested sub-folders are untouched — each resets independently. Runs
 * as a single Postgres function so the delete-then-reclone can't be seen
 * half-done, and RLS still enforces the caller can only reset their own row.
 */
export async function resetFolderToBase(folderId: string): Promise<void> {
  const { error } = await supabase.rpc('reset_folder_to_base', { p_folder_id: folderId });
  if (error) throw error;
}

/**
 * Discards the caller's entire library -- every folder, sub-folder, and tool
 * they've ever added, renamed, deleted, or reordered -- and restores it to
 * an exact fresh clone of the current base template, as if signing up again
 * today. Runs as a single Postgres function so the wipe-then-reclone can't
 * be seen half-done, and RLS still enforces the caller can only ever touch
 * their own rows.
 */
export async function resetLibraryToBase(): Promise<void> {
  const { error } = await supabase.rpc('reset_library_to_base');
  if (error) throw error;
}

/**
 * Uploads a user-picked logo image to the `logos` storage bucket and
 * returns its public URL. Kept out of the `tools` row's logo_url text
 * column directly (no base64) so the CHECK constraint and safeUrl guards
 * that already assume "logo_url is always a real https link" keep holding.
 * Storage RLS restricts writes to a path prefixed by the caller's own id.
 */
export async function uploadLogo(file: File): Promise<string> {
  const ownerId = await requireUserId();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const path = `${ownerId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from('logos')
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
  if (error) throw error;

  return supabase.storage.from('logos').getPublicUrl(path).data.publicUrl;
}

// ─── Usage ───────────────────────────────────────────────────────────────

/**
 * Append-only click log. Deliberately not a mutable counter on `tools`:
 * per-user rows avoid write contention and keep one user's usage private.
 * Failures are swallowed — analytics must never block a launch.
 */
export async function recordClick(toolId: string): Promise<void> {
  try {
    const user_id = await requireUserId();
    await supabase.from('tool_clicks').insert({ tool_id: toolId, user_id });
  } catch {
    /* non-critical */
  }
}
