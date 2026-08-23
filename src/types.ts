/**
 * Data shapes mirror the Supabase schema exactly.
 *
 * Ownership convention, enforced by Row-Level Security:
 *   owner_id === null  -> shared base template (admin-writable only)
 *   owner_id === uuid  -> that user's private row
 *
 * Every user gets a full personal clone of the base template on first
 * sign-in, so in practice the app only ever reads rows it owns.
 */

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Folder {
  id: string;
  owner_id: string | null;
  parent_folder_id: string | null;
  name: string;
  position: number;
}

export interface Tool {
  id: string;
  owner_id: string | null;
  folder_id: string;
  name: string;
  url: string;
  description: string | null;
  icon: string | null;
  logo_url: string | null;
  position: number;
}

/** A single renderable object on the orbit ring. */
export type OrbitItem =
  | { kind: 'tool'; tool: Tool }
  /** `target` is the folder to open, or null for the "back up a level" box. */
  | { kind: 'folder'; name: string; target: string | null };

/** Payloads for create/update, excluding server-managed columns. */
export type NewTool = Pick<Tool, 'folder_id' | 'name' | 'url'> &
  Partial<Pick<Tool, 'description' | 'icon' | 'logo_url' | 'position'>>;

export type NewFolder = Pick<Folder, 'name'> &
  Partial<Pick<Folder, 'parent_folder_id' | 'position'>>;
