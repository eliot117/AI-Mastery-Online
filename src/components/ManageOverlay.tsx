import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  FolderPlus,
  LayoutGrid,
  List,
  GripVertical,
  LogOut,
  Loader2,
  CornerDownRight,
  FolderInput,
} from 'lucide-react';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
  defaultDropAnimation,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { Folder, NewTool, Tool } from '../types';
import { getHostname, monogramDataUri, resolveLogoSrc } from '../lib/safeUrl';

// ─── Sortable app row ────────────────────────────────────────────────────

const SortableAppItem: React.FC<{
  tool: Tool;
  isDragging?: boolean;
  onEdit: (tool: Tool) => void;
  onDelete: (tool: Tool) => void;
}> = ({ tool, isDragging, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } =
    useSortable({ id: tool.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center justify-between rounded-[24px] border border-white/5 bg-white/5 p-5 transition-all hover:border-white/10 hover:bg-white/[0.07]"
    >
      <div className="flex min-w-0 items-center gap-4">
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none rounded p-1 text-gray-600 transition-colors hover:text-purple-300 focus:outline-none active:cursor-grabbing"
          aria-label={`Drag ${tool.name} to reorder or move to another folder`}
          tabIndex={-1}
        >
          <GripVertical size={16} />
        </button>
        <div className="flex min-w-0 items-center gap-3">
          <h4 className="truncate font-sans text-lg font-black uppercase tracking-wide text-white">
            {tool.name}
          </h4>
          <p className="max-w-[180px] truncate font-sans text-xs font-bold italic text-gray-500">
            {getHostname(tool.url)}
          </p>
        </div>
      </div>
      <div className="flex flex-shrink-0 gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
        <button
          onClick={() => onEdit(tool)}
          aria-label={`Edit ${tool.name}`}
          className="rounded-[14px] p-2.5 text-gray-500 transition-all hover:bg-white/10 hover:text-blue-400"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(tool)}
          aria-label={`Delete ${tool.name}`}
          className="rounded-[14px] p-2.5 text-gray-500 transition-all hover:bg-white/10 hover:text-red-400"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

const AppDragGhost: React.FC<{ tool: Tool }> = ({ tool }) => (
  <div className="flex scale-[1.03] items-center gap-4 rounded-[24px] border border-purple-500/50 bg-[#1a1a2e] p-5 opacity-95 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.25)]">
    <GripVertical size={16} className="text-purple-400" />
    <h4 className="font-sans text-lg font-black uppercase tracking-wide text-white">{tool.name}</h4>
    <p className="max-w-[180px] truncate font-sans text-xs font-bold italic text-gray-500">
      {getHostname(tool.url)}
    </p>
  </div>
);

// ─── Droppable folder section (Applications tab) ─────────────────────────

const FolderDropSection: React.FC<{
  folder: Folder;
  label: string;
  isSub: boolean;
  tools: Tool[];
  viewMode: 'grid' | 'list';
  draggingToolId: string | null;
  draggingFromFolderId: string | null;
  onEdit: (tool: Tool) => void;
  onDelete: (tool: Tool) => void;
}> = ({
  folder,
  label,
  isSub,
  tools,
  viewMode,
  draggingToolId,
  draggingFromFolderId,
  onEdit,
  onDelete,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: folder.id });

  const isDragActive = draggingToolId !== null;
  // Highlighting the folder a tool already lives in would be misleading —
  // dropping there is a reorder, not a move.
  const isMoveTarget = isDragActive && draggingFromFolderId !== folder.id;
  const isActiveTarget = isMoveTarget && isOver;

  return (
    <section
      ref={setNodeRef}
      className={`space-y-6 rounded-[28px] border-2 p-5 transition-all duration-150 ${
        isActiveTarget
          ? 'border-purple-400 bg-purple-500/10 shadow-[0_0_40px_rgba(139,92,246,0.35)]'
          : isMoveTarget
            ? 'border-dashed border-white/20 bg-white/[0.02]'
            : 'border-transparent'
      } ${isSub ? 'md:ml-8' : ''}`}
    >
      <div className="flex flex-col items-center gap-3 px-2">
        <div className="flex items-center gap-2">
          {isSub && <CornerDownRight size={18} className="text-purple-400/70" />}
          <h3
            className={`text-center font-sans font-black uppercase leading-none tracking-tighter text-white ${
              isSub ? 'text-xl' : 'text-3xl'
            }`}
          >
            {label}
          </h3>
        </div>
        <div className="h-[1px] w-1/4 bg-white/10" />
        <span
          className={`font-sans font-black leading-none text-purple-600/40 ${
            isSub ? 'text-2xl' : 'text-4xl'
          }`}
        >
          {tools.length}
        </span>

        <AnimatePresence>
          {isActiveTarget && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-2 rounded-full bg-purple-500 px-4 py-1.5 shadow-lg shadow-purple-500/40"
            >
              <FolderInput size={13} className="text-white" />
              <span className="font-sans text-[10px] font-black uppercase tracking-widest text-white">
                Drop to move into {folder.name}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {tools.length === 0 ? (
        <p
          className={`rounded-2xl border border-dashed py-6 text-center font-sans text-xs uppercase tracking-widest transition-colors ${
            isMoveTarget ? 'border-purple-400/40 text-purple-300/70' : 'border-white/5 text-gray-600'
          }`}
        >
          {isMoveTarget ? `Drop here to add to ${folder.name}` : 'Empty'}
        </p>
      ) : viewMode === 'grid' ? (
        <SortableContext items={tools.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {tools.map((tool) => (
              <SortableAppItem
                key={tool.id}
                tool={tool}
                isDragging={draggingToolId === tool.id}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>
      ) : (
        <div className="space-y-1 pl-4 text-center">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="cursor-default py-1 font-sans text-sm font-medium uppercase tracking-widest text-gray-400 transition-colors hover:text-white"
            >
              {tool.name}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// ─── Sortable folder card (Folders tab) ──────────────────────────────────

const SortableFolderItem: React.FC<{
  folder: Folder;
  tools: Tool[];
  subFolders: Folder[];
  subFolderToolCount: (id: string) => number;
  isDragging?: boolean;
  editingId: string | null;
  onBeginEdit: (id: string) => void;
  onDelete: (folder: Folder) => void;
  onRename: (id: string, name: string) => void;
  onAddSubFolder: (parent: Folder) => void;
}> = ({
  folder,
  tools,
  subFolders,
  subFolderToolCount,
  isDragging,
  editingId,
  onBeginEdit,
  onDelete,
  onRename,
  onAddSubFolder,
}) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } =
    useSortable({ id: folder.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const renameField = (target: Folder, isSubRow: boolean) => (
    <input
      autoFocus
      defaultValue={target.name}
      onBlur={(e) => onRename(target.id, e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onRename(target.id, e.currentTarget.value);
        if (e.key === 'Escape') onRename(target.id, target.name);
      }}
      className={`w-full rounded-lg border-b border-purple-500 bg-transparent px-2 font-sans font-black uppercase tracking-widest text-white focus:outline-none ${
        isSubRow ? 'text-sm' : 'mr-4 text-xl'
      }`}
    />
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex min-h-[160px] flex-col justify-between rounded-[32px] border border-white/5 bg-white/5 p-8 transition-all hover:border-white/10"
    >
      <div className="flex items-start justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            className="flex-shrink-0 cursor-grab touch-none rounded p-1 text-gray-700 transition-colors focus:outline-none active:cursor-grabbing group-hover:text-gray-500"
            aria-label={`Reorder ${folder.name}`}
            tabIndex={-1}
          >
            <GripVertical size={16} />
          </button>
          {editingId === folder.id ? (
            renameField(folder, false)
          ) : (
            <h4 className="truncate font-sans text-xl font-black uppercase leading-none tracking-widest text-white">
              {folder.name}
            </h4>
          )}
        </div>
        <div className="ml-2 flex flex-shrink-0 gap-1">
          <button
            onClick={() => onBeginEdit(folder.id)}
            aria-label={`Rename ${folder.name}`}
            className="rounded-[14px] p-2 text-gray-500 transition-all hover:bg-white/10 hover:text-white"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(folder)}
            aria-label={`Delete ${folder.name}`}
            className="rounded-[14px] p-2 text-gray-500 transition-all hover:bg-white/10 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Sub-folders are managed here, alongside the parent they belong to. */}
      <div className="mt-6 space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="font-sans text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
            Sub-folders
          </span>
          <button
            onClick={() => onAddSubFolder(folder)}
            className="flex items-center gap-1 rounded-full px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-widest text-purple-300 transition-all hover:bg-purple-500/15 hover:text-purple-200"
          >
            <Plus size={11} /> Add
          </button>
        </div>

        {subFolders.length === 0 ? (
          <p className="px-1 font-sans text-[10px] italic text-gray-600">None yet</p>
        ) : (
          subFolders.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-black/20 px-2.5 py-1.5"
            >
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <CornerDownRight size={12} className="flex-shrink-0 text-purple-400/70" />
                {editingId === sub.id ? (
                  renameField(sub, true)
                ) : (
                  <span className="truncate font-sans text-[11px] font-bold uppercase tracking-widest text-gray-300">
                    {sub.name}
                  </span>
                )}
              </div>
              <span className="flex-shrink-0 font-sans text-[10px] font-bold text-purple-400/60">
                {subFolderToolCount(sub.id)}
              </span>
              <div className="flex flex-shrink-0 gap-0.5">
                <button
                  onClick={() => onBeginEdit(sub.id)}
                  aria-label={`Rename ${sub.name}`}
                  className="rounded-lg p-1 text-gray-600 transition-all hover:bg-white/10 hover:text-white"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => onDelete(sub)}
                  aria-label={`Delete ${sub.name}`}
                  className="rounded-lg p-1 text-gray-600 transition-all hover:bg-white/10 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex -space-x-3">
          {tools.slice(0, 5).map((t) => {
            const src = resolveLogoSrc(t.logo_url, t.url) ?? monogramDataUri(t.name);
            return (
              <div
                key={t.id}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[14px] border border-white/10 bg-black ring-4 ring-black"
              >
                <img
                  src={src}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = monogramDataUri(t.name);
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex flex-col items-end">
          <span className="font-sans text-3xl font-black leading-none text-white">
            {tools.length}
          </span>
          <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-purple-500/60">
            Tools
          </span>
        </div>
      </div>
    </div>
  );
};

const FolderDragGhost: React.FC<{ folder: Folder; count: number }> = ({ folder, count }) => (
  <div className="flex min-h-[160px] scale-[1.03] flex-col justify-between rounded-[32px] border border-purple-500/40 bg-[#1a1a2e] p-8 opacity-95 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.15)]">
    <div className="flex items-center gap-3">
      <GripVertical size={16} className="text-purple-400" />
      <h4 className="truncate font-sans text-xl font-black uppercase leading-none tracking-widest text-white">
        {folder.name}
      </h4>
    </div>
    <div className="mt-8 flex items-center justify-end">
      <span className="font-sans text-3xl font-black leading-none text-white">{count}</span>
    </div>
  </div>
);

// ─── Main overlay ────────────────────────────────────────────────────────

interface ManageOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  tools: Tool[];
  busy: boolean;
  error: string | null;
  onCreateTool: (input: NewTool) => Promise<void>;
  onUpdateTool: (id: string, patch: Partial<Tool>) => Promise<void>;
  onDeleteTool: (id: string) => Promise<void>;
  onReorderTools: (orderedIds: string[]) => Promise<void>;
  onMoveTool: (toolId: string, folderId: string, position: number) => Promise<void>;
  onCreateFolder: (name: string, parentId: string | null) => Promise<void>;
  onRenameFolder: (id: string, name: string) => Promise<void>;
  onDeleteFolder: (id: string) => Promise<void>;
  onReorderFolders: (orderedIds: string[]) => Promise<void>;
  onSignOut: () => void;
}

export const ManageOverlay: React.FC<ManageOverlayProps> = ({
  isOpen,
  onClose,
  folders,
  tools,
  busy,
  error,
  onCreateTool,
  onUpdateTool,
  onDeleteTool,
  onReorderTools,
  onMoveTool,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onReorderFolders,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'folders'>('apps');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [direction, setDirection] = useState(0);

  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<
    { type: 'app' | 'folder'; id: string; label: string; extra?: string } | null
  >(null);

  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newLogo, setNewLogo] = useState('');
  const [newToolFolderId, setNewToolFolderId] = useState('');

  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParent, setNewFolderParent] = useState('');

  const [draggingToolId, setDraggingToolId] = useState<string | null>(null);
  const [draggingFolderId, setDraggingFolderId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const folderNameRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // ── Derived ──────────────────────────────────────────────────────────

  const foldersById = useMemo(() => new Map(folders.map((f) => [f.id, f])), [folders]);

  const topLevelFolders = useMemo(
    () =>
      folders.filter((f) => f.parent_folder_id === null).sort((a, b) => a.position - b.position),
    [folders],
  );

  const subFoldersByParent = useMemo(() => {
    const map = new Map<string, Folder[]>();
    for (const f of folders) {
      if (!f.parent_folder_id) continue;
      const list = map.get(f.parent_folder_id);
      if (list) list.push(f);
      else map.set(f.parent_folder_id, [f]);
    }
    for (const list of map.values()) list.sort((a, b) => a.position - b.position);
    return map;
  }, [folders]);

  const toolsByFolder = useMemo(() => {
    const map = new Map<string, Tool[]>();
    for (const t of tools) {
      const list = map.get(t.folder_id);
      if (list) list.push(t);
      else map.set(t.folder_id, [t]);
    }
    for (const list of map.values()) list.sort((a, b) => a.position - b.position);
    return map;
  }, [tools]);

  const toolsIn = (id: string) => toolsByFolder.get(id) ?? [];

  /** Parent-then-children, so the Applications tab reads as a tree. */
  const orderedFolders = useMemo(() => {
    const out: { folder: Folder; isSub: boolean; label: string }[] = [];
    for (const top of topLevelFolders) {
      out.push({ folder: top, isSub: false, label: top.name });
      for (const sub of subFoldersByParent.get(top.id) ?? []) {
        out.push({ folder: sub, isSub: true, label: `${top.name} / ${sub.name}` });
      }
    }
    return out;
  }, [topLevelFolders, subFoldersByParent]);

  const draggingTool = draggingToolId ? (tools.find((t) => t.id === draggingToolId) ?? null) : null;
  const draggingFolder = draggingFolderId ? (foldersById.get(draggingFolderId) ?? null) : null;

  useEffect(() => {
    if (!newToolFolderId && orderedFolders.length) {
      setNewToolFolderId(orderedFolders[0].folder.id);
    }
  }, [orderedFolders, newToolFolderId]);

  useEffect(() => {
    if (editingTool && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [editingTool]);

  // ── Handlers ─────────────────────────────────────────────────────────

  const switchTab = (tab: 'apps' | 'folders') => {
    if (activeTab === tab) return;
    setDirection(tab === 'folders' ? 1 : -1);
    setActiveTab(tab);
  };

  const resetToolForm = () => {
    setNewName('');
    setNewUrl('');
    setNewLogo('');
    setEditingTool(null);
  };

  const submitTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTool) {
      await onUpdateTool(editingTool.id, {
        name: editingTool.name,
        url: editingTool.url,
        logo_url: editingTool.logo_url,
        folder_id: editingTool.folder_id,
      });
      setEditingTool(null);
      return;
    }

    if (!newName.trim() || !newUrl.trim() || !newToolFolderId) return;
    await onCreateTool({
      folder_id: newToolFolderId,
      name: newName,
      url: newUrl,
      logo_url: newLogo.trim() || null,
      position: toolsIn(newToolFolderId).length,
    });
    resetToolForm();
  };

  const submitFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    await onCreateFolder(newFolderName, newFolderParent || null);
    setNewFolderName('');
    setNewFolderParent('');
  };

  /** Jumps to the create form with the parent pre-selected and focused. */
  const startSubFolder = (parent: Folder) => {
    setNewFolderParent(parent.id);
    setNewFolderName('');
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    window.setTimeout(() => folderNameRef.current?.focus(), 200);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    if (foldersById.has(id)) setDraggingFolderId(id);
    else setDraggingToolId(id);
  };

  /** `over` can be a folder container or another tool — resolve either. */
  const resolveTargetFolderId = (overId: string): string | null => {
    if (foldersById.has(overId)) return overId;
    return tools.find((t) => t.id === overId)?.folder_id ?? null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id as string;
    const wasTool = draggingToolId !== null;

    setDraggingToolId(null);
    setDraggingFolderId(null);

    if (!over) return;
    const overId = over.id as string;

    // Reordering top-level folder cards.
    if (!wasTool) {
      if (activeId === overId) return;
      const ids = topLevelFolders.map((f) => f.id);
      const from = ids.indexOf(activeId);
      const to = ids.indexOf(overId);
      if (from === -1 || to === -1) return;
      void onReorderFolders(arrayMove(ids, from, to));
      return;
    }

    const tool = tools.find((t) => t.id === activeId);
    if (!tool) return;

    const targetFolderId = resolveTargetFolderId(overId);
    if (!targetFolderId) return;

    if (targetFolderId === tool.folder_id) {
      // Same folder: a reorder.
      if (activeId === overId) return;
      const siblings = toolsIn(tool.folder_id);
      const from = siblings.findIndex((t) => t.id === activeId);
      const to = siblings.findIndex((t) => t.id === overId);
      if (from === -1 || to === -1) return;
      void onReorderTools(arrayMove(siblings, from, to).map((t) => t.id));
      return;
    }

    // Different folder: a move, appended to the end of the destination.
    void onMoveTool(activeId, targetFolderId, toolsIn(targetFolderId).length);
  };

  const requestDeleteFolder = (folder: Folder) => {
    const subs = subFoldersByParent.get(folder.id) ?? [];
    const toolCount =
      toolsIn(folder.id).length + subs.reduce((sum, s) => sum + toolsIn(s.id).length, 0);
    const parts: string[] = [];
    if (subs.length) parts.push(`${subs.length} sub-folder${subs.length > 1 ? 's' : ''}`);
    if (toolCount) parts.push(`${toolCount} tool${toolCount > 1 ? 's' : ''}`);
    setConfirmDelete({
      type: 'folder',
      id: folder.id,
      label: folder.name,
      extra: parts.length ? parts.join(' and ') : undefined,
    });
  };

  const confirmDeleteNow = async () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === 'app') await onDeleteTool(confirmDelete.id);
    else await onDeleteFolder(confirmDelete.id);
    setConfirmDelete(null);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '50%' : '-50%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-50%' : '50%', opacity: 0 }),
  };

  const actionButtonClass =
    'h-11 w-44 flex flex-shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-r from-purple-600 to-blue-600 font-sans text-[10px] font-black uppercase tracking-widest text-white transition-all hover:shadow-xl disabled:opacity-50';
  const inputClass =
    'h-11 w-full rounded-[24px] border border-white/10 bg-white/5 px-5 py-3 font-sans text-sm text-white transition-all placeholder:text-gray-600 focus:border-purple-500/50 focus:outline-none';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-2xl md:p-10"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-label="Manage your library"
            className="glass-heavy relative flex h-[85vh] w-full max-w-7xl flex-col overflow-hidden rounded-[32px] border border-white/10"
          >
            {/* Header */}
            <div className="grid grid-cols-1 items-center border-b border-white/5 p-8 pb-4 md:grid-cols-3">
              <div className="flex min-w-0 items-center gap-3 pr-12">
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 font-sans text-[10px] uppercase tracking-widest text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
                >
                  <LogOut size={12} />
                  <span>Sign out</span>
                </button>
                {busy && (
                  <Loader2 size={14} className="animate-spin text-purple-400" aria-label="Saving" />
                )}
              </div>

              <div className="order-3 flex justify-center md:order-2">
                <nav className="relative flex h-11 w-[280px] items-center overflow-hidden rounded-[24px] bg-white/5 p-1">
                  <button
                    onClick={() => switchTab('apps')}
                    className={`relative z-10 flex h-full w-1/2 items-center justify-center rounded-[20px] font-sans text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'apps' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                  >
                    Applications
                  </button>
                  <button
                    onClick={() => switchTab('folders')}
                    className={`relative z-10 flex h-full w-1/2 items-center justify-center rounded-[20px] font-sans text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'folders' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                  >
                    Folders
                  </button>
                  <motion.div
                    className="absolute h-[calc(100%-8px)] rounded-[20px] bg-purple-600 shadow-lg shadow-purple-600/30"
                    initial={false}
                    animate={{
                      left: activeTab === 'apps' ? 4 : 'calc(50%)',
                      width: 'calc(50% - 4px)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                </nav>
              </div>

              <div className="order-2 flex items-center justify-end gap-4 md:order-3">
                <div className="flex items-center gap-1 rounded-[24px] bg-white/5 p-1 px-2">
                  <button
                    onClick={() => {
                      setViewMode('grid');
                      if (activeTab !== 'apps') switchTab('apps');
                    }}
                    className={`flex items-center gap-2 rounded-[16px] px-4 py-1.5 transition-all ${viewMode === 'grid' && activeTab === 'apps' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-white'}`}
                  >
                    <LayoutGrid size={14} />
                    <span className="font-sans text-[9px] font-bold uppercase tracking-widest">
                      Grid
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('list');
                      if (activeTab !== 'apps') switchTab('apps');
                    }}
                    className={`flex items-center gap-2 rounded-[16px] px-4 py-1.5 transition-all ${viewMode === 'list' && activeTab === 'apps' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-white'}`}
                  >
                    <List size={14} />
                    <span className="font-sans text-[9px] font-bold uppercase tracking-widest">
                      List
                    </span>
                  </button>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-[24px] bg-white/5 p-3 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="border-b border-red-500/20 bg-red-500/10 px-8 py-3 font-sans text-xs text-red-300"
              >
                {error}
              </div>
            )}

            {/* Content */}
            <div className="relative flex-1 overflow-hidden bg-black/10">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  key={activeTab}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 350, damping: 35 },
                    opacity: { duration: 0.3 },
                  }}
                  className="absolute inset-0 overflow-y-auto p-8"
                  ref={scrollRef}
                >
                  {activeTab === 'apps' ? (
                    <div className="space-y-10">
                      {viewMode === 'grid' && (
                        <section className="rounded-[24px] border border-white/5 bg-white/5 p-4">
                          <h3 className="mb-4 flex items-center gap-2 font-sans text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">
                            <Plus size={14} /> {editingTool ? 'Edit tool' : 'Add an AI app or tool'}
                          </h3>
                          <form
                            onSubmit={submitTool}
                            className="flex w-full flex-col items-center gap-2 md:flex-row"
                          >
                            <input
                              type="text"
                              placeholder="Name"
                              aria-label="Tool name"
                              className={`${inputClass} flex-1`}
                              value={editingTool ? editingTool.name : newName}
                              onChange={(e) =>
                                editingTool
                                  ? setEditingTool({ ...editingTool, name: e.target.value })
                                  : setNewName(e.target.value)
                              }
                            />
                            <input
                              type="text"
                              inputMode="url"
                              placeholder="Web address"
                              aria-label="Tool web address"
                              className={`${inputClass} flex-1`}
                              value={editingTool ? editingTool.url : newUrl}
                              onChange={(e) =>
                                editingTool
                                  ? setEditingTool({ ...editingTool, url: e.target.value })
                                  : setNewUrl(e.target.value)
                              }
                            />
                            <input
                              type="text"
                              inputMode="url"
                              placeholder="Logo link (optional)"
                              aria-label="Logo image link, optional"
                              className={`${inputClass} flex-1`}
                              value={editingTool ? (editingTool.logo_url ?? '') : newLogo}
                              onChange={(e) =>
                                editingTool
                                  ? setEditingTool({
                                      ...editingTool,
                                      logo_url: e.target.value || null,
                                    })
                                  : setNewLogo(e.target.value)
                              }
                            />
                            <select
                              aria-label="Folder"
                              className={`${inputClass} w-full cursor-pointer md:w-56`}
                              value={editingTool ? editingTool.folder_id : newToolFolderId}
                              onChange={(e) =>
                                editingTool
                                  ? setEditingTool({ ...editingTool, folder_id: e.target.value })
                                  : setNewToolFolderId(e.target.value)
                              }
                            >
                              {orderedFolders.map(({ folder, label, isSub }) => (
                                <option key={folder.id} value={folder.id} className="bg-[#0f172a]">
                                  {isSub ? `↳ ${label}` : label}
                                </option>
                              ))}
                            </select>
                            <div className="flex items-center justify-end gap-2">
                              <button type="submit" disabled={busy} className={actionButtonClass}>
                                {editingTool ? 'Save' : 'Add'}
                              </button>
                              {editingTool && (
                                <button
                                  type="button"
                                  onClick={resetToolForm}
                                  aria-label="Cancel editing"
                                  className="flex h-11 items-center justify-center rounded-[24px] bg-white/10 px-4 text-white transition-all hover:bg-white/20"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                          </form>
                          <p className="mt-3 px-2 font-sans text-[11px] leading-relaxed text-gray-500">
                            Leave the logo blank and we'll fetch the site's own icon automatically.
                          </p>
                        </section>
                      )}

                      <div className="flex items-center gap-2 rounded-2xl border border-purple-500/20 bg-purple-500/5 px-4 py-3">
                        <FolderInput size={14} className="flex-shrink-0 text-purple-400" />
                        <p className="font-sans text-[11px] leading-relaxed text-gray-400">
                          Drag a tool by its handle onto any folder below — including
                          <span className="text-purple-300"> sub-folders</span> — to move it there.
                          Drop it among a folder's own tools to reorder instead.
                        </p>
                      </div>

                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="space-y-6">
                          {orderedFolders.map(({ folder, isSub, label }) => (
                            <FolderDropSection
                              key={folder.id}
                              folder={folder}
                              label={label}
                              isSub={isSub}
                              tools={toolsIn(folder.id)}
                              viewMode={viewMode}
                              draggingToolId={draggingToolId}
                              draggingFromFolderId={draggingTool?.folder_id ?? null}
                              onEdit={setEditingTool}
                              onDelete={(tool) =>
                                setConfirmDelete({ type: 'app', id: tool.id, label: tool.name })
                              }
                            />
                          ))}
                        </div>

                        <DragOverlay dropAnimation={defaultDropAnimation}>
                          {draggingTool ? <AppDragGhost tool={draggingTool} /> : null}
                        </DragOverlay>
                      </DndContext>
                    </div>
                  ) : (
                    <div className="space-y-12">
                      <section className="rounded-[24px] border border-white/5 bg-white/5 p-4">
                        <h3 className="mb-4 flex items-center gap-2 font-sans text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">
                          <FolderPlus size={14} />{' '}
                          {newFolderParent
                            ? `New sub-folder in ${foldersById.get(newFolderParent)?.name ?? ''}`
                            : 'New folder'}
                        </h3>
                        <form
                          onSubmit={submitFolder}
                          className="flex flex-col items-center gap-2 md:flex-row"
                        >
                          <input
                            ref={folderNameRef}
                            type="text"
                            placeholder="Folder name"
                            aria-label="Folder name"
                            className={`${inputClass} flex-1`}
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                          />
                          <select
                            aria-label="Nest inside"
                            className={`${inputClass} w-full cursor-pointer md:w-64`}
                            value={newFolderParent}
                            onChange={(e) => setNewFolderParent(e.target.value)}
                          >
                            <option value="" className="bg-[#0f172a]">
                              Top level
                            </option>
                            {topLevelFolders.map((f) => (
                              <option key={f.id} value={f.id} className="bg-[#0f172a]">
                                {`↳ Inside ${f.name}`}
                              </option>
                            ))}
                          </select>
                          <button type="submit" disabled={busy} className={actionButtonClass}>
                            Create
                          </button>
                        </form>
                      </section>

                      <div className="space-y-6">
                        <h3 className="mb-4 font-sans text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
                          Your folders
                        </h3>

                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCorners}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext
                            items={topLevelFolders.map((f) => f.id)}
                            strategy={rectSortingStrategy}
                          >
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                              {topLevelFolders.map((folder) => (
                                <SortableFolderItem
                                  key={folder.id}
                                  folder={folder}
                                  tools={toolsIn(folder.id)}
                                  subFolders={subFoldersByParent.get(folder.id) ?? []}
                                  subFolderToolCount={(id) => toolsIn(id).length}
                                  isDragging={draggingFolderId === folder.id}
                                  editingId={editingFolderId}
                                  onBeginEdit={setEditingFolderId}
                                  onDelete={requestDeleteFolder}
                                  onRename={(id, name) => {
                                    setEditingFolderId(null);
                                    const current = foldersById.get(id);
                                    if (name.trim() && current && name !== current.name) {
                                      void onRenameFolder(id, name);
                                    }
                                  }}
                                  onAddSubFolder={startSubFolder}
                                />
                              ))}
                            </div>
                          </SortableContext>
                          <DragOverlay dropAnimation={defaultDropAnimation}>
                            {draggingFolder ? (
                              <FolderDragGhost
                                folder={draggingFolder}
                                count={toolsIn(draggingFolder.id).length}
                              />
                            ) : null}
                          </DragOverlay>
                        </DndContext>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Delete confirmation */}
            <AnimatePresence>
              {confirmDelete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    role="alertdialog"
                    aria-modal="true"
                    className="max-w-sm rounded-[32px] border border-white/10 bg-[#0f172a] p-10 text-center shadow-2xl"
                  >
                    <Trash2 size={40} className="mx-auto mb-6 text-red-500" />
                    <h3 className="mb-2 font-sans text-xl font-black uppercase tracking-tight">
                      Delete {confirmDelete.type === 'app' ? 'tool' : 'folder'}?
                    </h3>
                    <p className="mb-8 font-sans text-sm leading-relaxed text-gray-400">
                      <span className="font-bold text-white">{confirmDelete.label}</span> will be
                      removed from your library.
                      {confirmDelete.extra && (
                        <>
                          {' '}
                          Its{' '}
                          <span className="font-bold text-red-300">{confirmDelete.extra}</span> will
                          be deleted too.
                        </>
                      )}{' '}
                      This can't be undone.
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="flex-1 rounded-[24px] bg-white/5 px-6 py-4 font-sans text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDeleteNow}
                        disabled={busy}
                        className="flex-1 rounded-[24px] bg-red-600 px-6 py-4 font-sans text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-500 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
