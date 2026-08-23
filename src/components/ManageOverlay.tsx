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
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
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
  onDelete: (id: string) => void;
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
          className="cursor-grab touch-none rounded p-1 text-gray-700 transition-colors hover:text-gray-400 focus:outline-none active:cursor-grabbing"
          aria-label={`Reorder ${tool.name}`}
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
      <div className="flex flex-shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <button
          onClick={() => onEdit(tool)}
          aria-label={`Edit ${tool.name}`}
          className="rounded-[14px] p-2.5 text-gray-500 transition-all hover:bg-white/10 hover:text-blue-400"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(tool.id)}
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
  <div className="flex scale-[1.03] items-center justify-between rounded-[24px] border border-purple-500/40 bg-[#1a1a2e] p-5 opacity-95 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.15)]">
    <div className="flex items-center gap-4">
      <GripVertical size={16} className="text-purple-400" />
      <h4 className="font-sans text-lg font-black uppercase tracking-wide text-white">
        {tool.name}
      </h4>
      <p className="max-w-[180px] truncate font-sans text-xs font-bold italic text-gray-500">
        {getHostname(tool.url)}
      </p>
    </div>
  </div>
);

// ─── Sortable folder card ────────────────────────────────────────────────

const SortableFolderItem: React.FC<{
  folder: Folder;
  tools: Tool[];
  subFolders: Folder[];
  isDragging?: boolean;
  isEditing: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}> = ({ folder, tools, subFolders, isDragging, isEditing, onEdit, onDelete, onRename }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } =
    useSortable({ id: folder.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

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
            className="flex-shrink-0 cursor-grab touch-none rounded p-1 text-gray-700 transition-colors group-hover:text-gray-500 focus:outline-none active:cursor-grabbing"
            aria-label={`Reorder ${folder.name}`}
            tabIndex={-1}
          >
            <GripVertical size={16} />
          </button>
          {isEditing ? (
            <input
              autoFocus
              defaultValue={folder.name}
              onBlur={(e) => onRename(folder.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onRename(folder.id, e.currentTarget.value);
                if (e.key === 'Escape') onRename(folder.id, folder.name);
              }}
              className="mr-4 w-full rounded-[24px] border-b border-purple-500 bg-transparent px-2 font-sans text-xl font-black uppercase tracking-widest text-white focus:outline-none"
            />
          ) : (
            <h4 className="truncate font-sans text-xl font-black uppercase leading-none tracking-widest text-white">
              {folder.name}
            </h4>
          )}
        </div>
        <div className="ml-2 flex flex-shrink-0 gap-1">
          <button
            onClick={() => onEdit(folder.id)}
            aria-label={`Rename ${folder.name}`}
            className="rounded-[14px] p-2 text-gray-500 transition-all hover:bg-white/10 hover:text-white"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(folder.id)}
            aria-label={`Delete ${folder.name}`}
            className="rounded-[14px] p-2 text-gray-500 transition-all hover:bg-white/10 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {subFolders.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {subFolders.map((sf) => (
            <span
              key={sf.id}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-widest text-gray-400"
            >
              {sf.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
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
    { type: 'app' | 'folder'; id: string; label: string } | null
  >(null);

  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newLogo, setNewLogo] = useState('');
  const [newToolFolderId, setNewToolFolderId] = useState('');

  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParent, setNewFolderParent] = useState('');

  const [activeDragAppId, setActiveDragAppId] = useState<string | null>(null);
  const [activeDragFolderId, setActiveDragFolderId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const topLevelFolders = useMemo(
    () => folders.filter((f) => f.parent_folder_id === null),
    [folders],
  );

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

  const subFoldersByParent = useMemo(() => {
    const map = new Map<string, Folder[]>();
    for (const f of folders) {
      if (!f.parent_folder_id) continue;
      const list = map.get(f.parent_folder_id);
      if (list) list.push(f);
      else map.set(f.parent_folder_id, [f]);
    }
    return map;
  }, [folders]);

  /** "Build / Web Apps" — makes the folder picker unambiguous when nested. */
  const folderLabel = useMemo(() => {
    const byId = new Map(folders.map((f) => [f.id, f]));
    return (f: Folder) => {
      const parent = f.parent_folder_id ? byId.get(f.parent_folder_id) : null;
      return parent ? `${parent.name} / ${f.name}` : f.name;
    };
  }, [folders]);

  const orderedFolderOptions = useMemo(() => {
    const out: Folder[] = [];
    for (const top of topLevelFolders) {
      out.push(top);
      for (const sub of subFoldersByParent.get(top.id) ?? []) out.push(sub);
    }
    return out;
  }, [topLevelFolders, subFoldersByParent]);

  useEffect(() => {
    if (!newToolFolderId && orderedFolderOptions.length) {
      setNewToolFolderId(orderedFolderOptions[0].id);
    }
  }, [orderedFolderOptions, newToolFolderId]);

  useEffect(() => {
    if (editingTool && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [editingTool]);

  // ── Handlers ───────────────────────────────────────────────────────────

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
    const siblings = toolsByFolder.get(newToolFolderId) ?? [];
    await onCreateTool({
      folder_id: newToolFolderId,
      name: newName,
      url: newUrl,
      logo_url: newLogo.trim() || null,
      position: siblings.length,
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

  const handleAppDragEnd = (event: DragEndEvent, folderTools: Tool[]) => {
    setActiveDragAppId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = folderTools.findIndex((t) => t.id === active.id);
    const newIndex = folderTools.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    void onReorderTools(arrayMove(folderTools, oldIndex, newIndex).map((t) => t.id));
  };

  const handleFolderDragEnd = (event: DragEndEvent) => {
    setActiveDragFolderId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const ids = topLevelFolders.map((f) => f.id);
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    void onReorderFolders(arrayMove(ids, oldIndex, newIndex));
  };

  const switchTab = (tab: 'apps' | 'folders') => {
    if (activeTab === tab) return;
    setDirection(tab === 'folders' ? 1 : -1);
    setActiveTab(tab);
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
    'w-44 h-11 flex flex-shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-r from-purple-600 to-blue-600 font-sans text-[10px] font-black uppercase tracking-widest text-white transition-all hover:shadow-xl disabled:opacity-50';
  const inputClass =
    'h-11 w-full rounded-[24px] border border-white/10 bg-white/5 px-5 py-3 font-sans text-sm text-white transition-all placeholder:text-gray-600 focus:border-purple-500/50 focus:outline-none';

  const activeDragTool = activeDragAppId
    ? (tools.find((t) => t.id === activeDragAppId) ?? null)
    : null;
  const activeDragFolder = activeDragFolderId
    ? (folders.find((f) => f.id === activeDragFolderId) ?? null)
    : null;

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
                    <div className="space-y-12">
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
                              value={
                                editingTool ? (editingTool.logo_url ?? '') : newLogo
                              }
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
                              {orderedFolderOptions.map((f) => (
                                <option key={f.id} value={f.id} className="bg-[#0f172a]">
                                  {folderLabel(f)}
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
                            Leave the logo blank and we'll fetch the site's own icon
                            automatically.
                          </p>
                        </section>
                      )}

                      <div className="space-y-12">
                        {orderedFolderOptions.map((folder) => {
                          const folderTools = toolsByFolder.get(folder.id) ?? [];
                          return (
                            <div key={folder.id} className="space-y-6">
                              <div className="flex flex-col items-center gap-4 px-2">
                                <h3 className="text-center font-sans text-3xl font-black uppercase leading-none tracking-tighter text-white">
                                  {folderLabel(folder)}
                                </h3>
                                <div className="h-[1px] w-1/4 bg-white/10" />
                                <span className="font-sans text-4xl font-black leading-none text-purple-600/40">
                                  {folderTools.length}
                                </span>
                              </div>

                              {folderTools.length === 0 ? (
                                <p className="text-center font-sans text-xs uppercase tracking-widest text-gray-600">
                                  Empty
                                </p>
                              ) : viewMode === 'grid' ? (
                                <DndContext
                                  sensors={sensors}
                                  collisionDetection={closestCenter}
                                  onDragStart={(e: DragStartEvent) =>
                                    setActiveDragAppId(e.active.id as string)
                                  }
                                  onDragEnd={(e) => handleAppDragEnd(e, folderTools)}
                                >
                                  <SortableContext
                                    items={folderTools.map((t) => t.id)}
                                    strategy={verticalListSortingStrategy}
                                  >
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                      {folderTools.map((tool) => (
                                        <SortableAppItem
                                          key={tool.id}
                                          tool={tool}
                                          isDragging={activeDragAppId === tool.id}
                                          onEdit={setEditingTool}
                                          onDelete={(id) =>
                                            setConfirmDelete({
                                              type: 'app',
                                              id,
                                              label: tool.name,
                                            })
                                          }
                                        />
                                      ))}
                                    </div>
                                  </SortableContext>
                                  <DragOverlay dropAnimation={defaultDropAnimation}>
                                    {activeDragTool &&
                                    folderTools.some((t) => t.id === activeDragTool.id) ? (
                                      <AppDragGhost tool={activeDragTool} />
                                    ) : null}
                                  </DragOverlay>
                                </DndContext>
                              ) : (
                                <div className="space-y-1 pl-4 text-center">
                                  {folderTools.map((tool) => (
                                    <div
                                      key={tool.id}
                                      className="cursor-default py-1 font-sans text-sm font-medium uppercase tracking-widest text-gray-400 transition-colors hover:text-white"
                                    >
                                      {tool.name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-12">
                      <section className="rounded-[24px] border border-white/5 bg-white/5 p-4">
                        <h3 className="mb-4 flex items-center gap-2 font-sans text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">
                          <FolderPlus size={14} /> New folder
                        </h3>
                        <form onSubmit={submitFolder} className="flex flex-col items-center gap-2 md:flex-row">
                          <input
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
                                Inside {f.name}
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
                          collisionDetection={closestCenter}
                          onDragStart={(e: DragStartEvent) =>
                            setActiveDragFolderId(e.active.id as string)
                          }
                          onDragEnd={handleFolderDragEnd}
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
                                  tools={toolsByFolder.get(folder.id) ?? []}
                                  subFolders={subFoldersByParent.get(folder.id) ?? []}
                                  isDragging={activeDragFolderId === folder.id}
                                  isEditing={editingFolderId === folder.id}
                                  onEdit={setEditingFolderId}
                                  onDelete={(id) =>
                                    setConfirmDelete({
                                      type: 'folder',
                                      id,
                                      label: folder.name,
                                    })
                                  }
                                  onRename={(id, name) => {
                                    setEditingFolderId(null);
                                    if (name.trim() && name !== folder.name) {
                                      void onRenameFolder(id, name);
                                    }
                                  }}
                                />
                              ))}
                            </div>
                          </SortableContext>
                          <DragOverlay dropAnimation={defaultDropAnimation}>
                            {activeDragFolder ? (
                              <FolderDragGhost
                                folder={activeDragFolder}
                                count={(toolsByFolder.get(activeDragFolder.id) ?? []).length}
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
                      {confirmDelete.type === 'folder' &&
                        ' Everything inside it goes too.'}{' '}
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
