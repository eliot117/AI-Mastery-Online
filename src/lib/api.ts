import { supabase } from './supabase';
import type { Folder, NewFolder, NewTool, Tool } from '../types';
import { normalizeUserUrl } from './safeUrl';

/**
 * Every read here is implicitly scoped by Row-Level Security: the database
 * only returns rows the signed-in user owns (plus the shared base template,
 * which only an admin can write). No client-side filtering is trusted for
 * access control.
 */

export interface Library {
  folders: Folder[];
  tools: Tool[];
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Not signed in');
  return data.user.id;
}

export async function fetchLibrary(): Promise<Library> {
  const [foldersRes, toolsRes] = await Promise.all([
    supabase.from('folders').select('*').order('position'),
    supabase.from('tools').select('*').order('position'),
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
