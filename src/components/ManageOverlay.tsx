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
  RotateCcw,
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
      className="group flex items-center gap-4 overflow-hidden rounded-[24px] border border-white/5 bg-white/5 p-5 transition-all hover:border-white/10 hover:bg-white/[0.07]"
    >
      <button
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab touch-none rounded p-1 text-gray-600 transition-colors hover:text-purple-300 focus:outline-none active:cursor-grabbing"
        aria-label={`Drag ${tool.name} to reorder or move to another folder`}
        tabIndex={-1}
      >
        <GripVertical size={16} />
      </button>

      <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={resolveLogoSrc(tool.logo_url, tool.url) ?? monogramDataUri(tool.name)}
          alt=""
          referrerPolicy="no-referrer"
          className="h-full w-full object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = monogramDataUri(tool.name);
          }}
        />
      </div>

      <h4 className="min-w-0 flex-1 truncate font-sans text-lg font-black uppercase tracking-wide text-white">
        {tool.name}
      </h4>

      {/* URL and the edit/delete buttons share one transform: both rest
          translated right, both slide to their place on hover, same
          distance and speed. Only the buttons additionally fade in --
          the URL stays fully visible throughout. */}
      <div className="flex flex-shrink-0 items-center gap-3">
        <p className="translate-x-3 whitespace-nowrap font-sans text-xs font-bold italic text-gray-400 transition-transform duration-200 ease-out group-hover:translate-x-0">
          {getHostname(tool.url)}
        </p>
        <div className="flex flex-shrink-0 translate-x-3 gap-1 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100">
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
  onAddTool: (folderId: string) => void;
  onRequestReset: (folder: Folder) => void;
  onViewAsList: (folderId: string) => void;
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
  onAddTool,
  onRequestReset,
  onViewAsList,
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
      id={`mgr-folder-${folder.id}`}
      className={`space-y-5 rounded-[28px] border-2 p-5 transition-all duration-150 ${
        isActiveTarget
          ? 'border-purple-400 bg-purple-500/10 shadow-[0_0_40px_rgba(139,92,246,0.35)]'
          : isMoveTarget
            ? 'border-dashed border-white/20 bg-white/[0.02]'
            : 'border-transparent'
      } ${isSub ? 'md:ml-8' : ''}`}
    >
      <div className="relative min-h-[64px] px-1">
        <div className="absolute left-0 top-1/2 z-10 flex -translate-y-1/2 items-center gap-3">
          <button
            onClick={() => onAddTool(folder.id)}
            aria-label={`Add a tool to ${folder.name}`}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-white transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]"
          >
            <Plus size={19} />
            <span className="font-sans text-xs font-black uppercase tracking-widest">Add</span>
          </button>
          {folder.origin_folder_id && (
            <button
              onClick={() => onRequestReset(folder)}
              aria-label={`Reset ${folder.name} to the default template`}
              title="Reset to default"
              className="rounded-full p-2 text-purple-400 transition-all hover:bg-purple-400/10"
            >
              <RotateCcw size={17} />
            </button>
          )}
        </div>

        {/* pointer-events-none: purely decorative label, must never steal
            clicks from the buttons/count sharing this row */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center gap-2 px-40">
          {isSub && <CornerDownRight size={22} className="flex-shrink-0 text-purple-400/70" />}
          <h3
            className={`truncate font-sans font-black uppercase leading-none tracking-tighter text-white ${
              isSub ? 'text-2xl' : 'text-4xl'
            }`}
          >
            {label}
          </h3>
        </div>

        <button
          onClick={() => onViewAsList(folder.id)}
          aria-label={`View ${folder.name} as a list`}
          title="View as list"
          className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-2xl px-2 font-sans font-black leading-none tabular-nums text-purple-600/40 transition-colors hover:text-purple-400 ${
            isSub ? 'text-2xl' : 'text-4xl'
          }`}
        >
          {tools.length}
        </button>
      </div>

      <AnimatePresence>
        {isActiveTarget && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mx-auto flex w-fit items-center gap-2 rounded-full bg-purple-500 px-4 py-1.5 shadow-lg shadow-purple-500/40"
          >
            <FolderInput size={13} className="text-white" />
            <span className="font-sans text-[10px] font-black uppercase tracking-widest text-white">
              Drop to move into {folder.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

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

const FolderRenameField: React.FC<{
  target: Folder;
  large?: boolean;
  onRename: (id: string, name: string) => void;
}> = ({ target, large, onRename }) => (
  <input
    autoFocus
    defaultValue={target.name}
    onBlur={(e) => onRename(target.id, e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') onRename(target.id, e.currentTarget.value);
      if (e.key === 'Escape') onRename(target.id, target.name);
    }}
    className={`w-full rounded-lg border-b border-purple-500 bg-transparent px-2 font-sans font-black uppercase tracking-widest text-white focus:outline-none ${
      large ? 'mr-4 text-xl' : 'text-sm'
    }`}
  />
);

const SortableFolderItem: React.FC<{
  folder: Folder;
  tools: Tool[];
  isDragging?: boolean;
  isEditing: boolean;
  onBeginEdit: (id: string) => void;
  onDelete: (folder: Folder) => void;
  onRename: (id: string, name: string) => void;
  onAddSubFolder: (parent: Folder) => void;
}> = ({ folder, tools, isDragging, isEditing, onBeginEdit, onDelete, onRename, onAddSubFolder }) => {
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
      className="group flex h-28 w-full items-center justify-between gap-6 overflow-hidden rounded-[32px] border border-white/5 bg-white/5 px-8 transition-all hover:border-white/10"
    >
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
        {isEditing ? (
          <FolderRenameField target={folder} large onRename={onRename} />
        ) : (
          <h4 className="truncate font-sans text-xl font-black uppercase leading-none tracking-widest text-white">
            {folder.name}
          </h4>
        )}
      </div>

      {/* Fixed-width columns: the logo stack and count always start at the
          same x regardless of how many tools/logos are in this folder, so
          every row in the list lines up. Both share the identical
          translate-x used by the buttons, so the whole cluster reads as
          one synchronized slide on hover -- only the buttons additionally
          fade in, since the logos/count must stay visible at rest. */}
      <div className="grid flex-shrink-0 grid-cols-[170px_44px_auto] items-center">
        <div className="flex translate-x-3 -space-x-3 transition-transform duration-200 ease-out group-hover:translate-x-0">
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
        <span className="translate-x-3 font-sans text-3xl font-black leading-none text-purple-600/40 transition-transform duration-200 ease-out group-hover:translate-x-0">
          {tools.length}
        </span>
        <div className="flex translate-x-3 justify-end gap-1 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100">
          <button
            onClick={() => onAddSubFolder(folder)}
            aria-label={`Add a sub-folder to ${folder.name}`}
            title="Add a sub-folder"
            className="rounded-[14px] p-2 text-purple-400 transition-all hover:bg-purple-400/10"
          >
            <FolderPlus size={16} />
          </button>
          <button
            onClick={() => onBeginEdit(folder.id)}
            aria-label={`Rename ${folder.name}`}
            className="rounded-[14px] p-2 text-gray-500 transition-all hover:bg-white/10 hover:text-blue-400"
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
    </div>
  );
};

/** Same content as the parent card (minus "add sub-folder", since nesting
 * is only one level deep) at a slightly shorter height, so the two are
 * visually distinguishable while everything still lines up column-for-column. */
const SubFolderCard: React.FC<{
  folder: Folder;
  tools: Tool[];
  isEditing: boolean;
  onBeginEdit: (id: string) => void;
  onDelete: (folder: Folder) => void;
  onRename: (id: string, name: string) => void;
}> = ({ folder, tools, isEditing, onBeginEdit, onDelete, onRename }) => (
  <div className="group flex h-24 w-full items-center justify-between gap-6 overflow-hidden rounded-[32px] border border-white/5 bg-white/5 px-8 transition-all hover:border-white/10">
    <div className="flex min-w-0 flex-1 items-center gap-2.5">
      <CornerDownRight size={20} className="flex-shrink-0 text-purple-400/70" />
      {isEditing ? (
        <FolderRenameField target={folder} large onRename={onRename} />
      ) : (
        <h4 className="truncate font-sans text-xl font-black uppercase leading-none tracking-widest text-white">
          {folder.name}
        </h4>
      )}
    </div>

    <div className="grid flex-shrink-0 grid-cols-[170px_44px_auto] items-center">
      <div className="flex translate-x-3 -space-x-3 transition-transform duration-200 ease-out group-hover:translate-x-0">
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
      <span className="translate-x-3 font-sans text-3xl font-black leading-none text-purple-600/40 transition-transform duration-200 ease-out group-hover:translate-x-0">
        {tools.length}
      </span>
      <div className="flex translate-x-3 justify-end gap-1 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100">
        <button
          onClick={() => onBeginEdit(folder.id)}
          aria-label={`Rename ${folder.name}`}
          className="rounded-[14px] p-2 text-gray-500 transition-all hover:bg-white/10 hover:text-blue-400"
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
  </div>
);

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

// ─── Add / edit tool popup ────────────────────────────────────────────────

interface ToolFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  busy: boolean;
  name: string;
  url: string;
  logoUrl: string;
  folderId: string;
  folderOptions: { folder: Folder; label: string; isSub: boolean }[];
  onNameChange: (v: string) => void;
  onUrlChange: (v: string) => void;
  onLogoChange: (v: string) => void;
  onFolderChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const ToolFormModal: React.FC<ToolFormModalProps> = ({
  isOpen,
  isEditing,
  busy,
  name,
  url,
  logoUrl,
  folderId,
  folderOptions,
  onNameChange,
  onUrlChange,
  onLogoChange,
  onFolderChange,
  onSubmit,
  onClose,
}) => {
  const fieldClass =
    'h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-5 font-sans text-sm text-white transition-all placeholder:text-gray-600 focus:border-purple-500/50 focus:outline-none';
  const labelClass = 'mb-2 block font-sans text-[10px] font-black uppercase tracking-widest text-gray-500';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 16, opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={isEditing ? 'Edit tool' : 'Add a tool'}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-[32px] border border-white/10 bg-[#12131a] p-8 shadow-2xl"
          >
            <div className="mb-7 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-sans text-lg font-black uppercase tracking-wide text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
                  <Plus size={16} className="text-white" />
                </span>
                {isEditing ? 'Edit tool' : 'Add a tool'}
              </h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-2 text-gray-500 transition-all hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. ChatGPT"
                  aria-label="Tool name"
                  className={fieldClass}
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Web address</label>
                <input
                  type="text"
                  inputMode="url"
                  placeholder="https://..."
                  aria-label="Tool web address"
                  className={fieldClass}
                  value={url}
                  onChange={(e) => onUrlChange(e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Logo link (optional)</label>
                <input
                  type="text"
                  inputMode="url"
                  placeholder="Leave blank to auto-fetch the site's icon"
                  aria-label="Logo image link, optional"
                  className={fieldClass}
                  value={logoUrl}
                  onChange={(e) => onLogoChange(e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Folder</label>
                <select
                  aria-label="Folder"
                  className={`${fieldClass} cursor-pointer`}
                  value={folderId}
                  onChange={(e) => onFolderChange(e.target.value)}
                >
                  {folderOptions.map(({ folder, label, isSub }) => (
                    <option key={folder.id} value={folder.id} className="bg-[#0f172a]">
                      {isSub ? `↳ ${label}` : label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-2xl bg-white/5 py-3.5 font-sans text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-3.5 font-sans text-[11px] font-black uppercase tracking-widest text-white transition-all hover:shadow-lg hover:shadow-purple-600/30 disabled:opacity-50"
                >
                  {isEditing ? 'Save changes' : 'Add tool'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Add-folder popup ─────────────────────────────────────────────────────

interface FolderFormModalProps {
  isOpen: boolean;
  busy: boolean;
  name: string;
  parentId: string;
  topLevelFolders: Folder[];
  onNameChange: (v: string) => void;
  onParentChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const FolderFormModal: React.FC<FolderFormModalProps> = ({
  isOpen,
  busy,
  name,
  parentId,
  topLevelFolders,
  onNameChange,
  onParentChange,
  onSubmit,
  onClose,
}) => {
  const fieldClass =
    'h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-5 font-sans text-sm text-white transition-all placeholder:text-gray-600 focus:border-purple-500/50 focus:outline-none';
  const labelClass = 'mb-2 block font-sans text-[10px] font-black uppercase tracking-widest text-gray-500';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 16, opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={parentId ? 'New sub-folder' : 'New folder'}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-[32px] border border-white/10 bg-[#12131a] p-8 shadow-2xl"
          >
            <div className="mb-7 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-sans text-lg font-black uppercase tracking-wide text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
                  <FolderPlus size={16} className="text-white" />
                </span>
                {parentId ? 'New sub-folder' : 'New folder'}
              </h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-2 text-gray-500 transition-all hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. Automation"
                  aria-label="Folder name"
                  className={fieldClass}
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Nest inside</label>
                <select
                  aria-label="Nest inside"
                  className={`${fieldClass} cursor-pointer`}
                  value={parentId}
                  onChange={(e) => onParentChange(e.target.value)}
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
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-2xl bg-white/5 py-3.5 font-sans text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-3.5 font-sans text-[11px] font-black uppercase tracking-widest text-white transition-all hover:shadow-lg hover:shadow-purple-600/30 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

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
  onResetFolder: (folderId: string) => Promise<void>;
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
  onResetFolder,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'folders'>('apps');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [direction, setDirection] = useState(0);

  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [addToolFolderId, setAddToolFolderId] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<
    { type: 'app' | 'folder'; id: string; label: string; extra?: string } | null
  >(null);
  const [confirmReset, setConfirmReset] = useState<Folder | null>(null);
  const [resetting, setResetting] = useState(false);

  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newLogo, setNewLogo] = useState('');
  const [newToolFolderId, setNewToolFolderId] = useState('');

  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParent, setNewFolderParent] = useState('');
  const [folderModalOpen, setFolderModalOpen] = useState(false);

  const [draggingToolId, setDraggingToolId] = useState<string | null>(null);
  const [draggingFolderId, setDraggingFolderId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

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

  /** orderedFolders split into one array per top-level folder (itself + its subs), for the divider between main folders. */
  const folderGroups = useMemo(() => {
    const groups: { folder: Folder; isSub: boolean; label: string }[][] = [];
    for (const entry of orderedFolders) {
      if (!entry.isSub) groups.push([entry]);
      else groups[groups.length - 1]?.push(entry);
    }
    return groups;
  }, [orderedFolders]);

  const draggingTool = draggingToolId ? (tools.find((t) => t.id === draggingToolId) ?? null) : null;
  const draggingFolder = draggingFolderId ? (foldersById.get(draggingFolderId) ?? null) : null;

  useEffect(() => {
    if (!newToolFolderId && orderedFolders.length) {
      setNewToolFolderId(orderedFolders[0].folder.id);
    }
  }, [orderedFolders, newToolFolderId]);

  // ── Handlers ─────────────────────────────────────────────────────────

  const switchTab = (tab: 'apps' | 'folders') => {
    if (activeTab === tab) return;
    setDirection(tab === 'folders' ? 1 : -1);
    setActiveTab(tab);
  };

  /** Switches to list view without losing the reader's place on the folder they clicked from. */
  const viewFolderAsList = (folderId: string) => {
    setViewMode('list');
    requestAnimationFrame(() => {
      document
        .getElementById(`mgr-folder-${folderId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const isToolModalOpen = addToolFolderId !== null || editingTool !== null;

  const closeToolModal = () => {
    setAddToolFolderId(null);
    setEditingTool(null);
    setNewName('');
    setNewUrl('');
    setNewLogo('');
  };

  const openAddTool = (folderId: string) => {
    setEditingTool(null);
    setNewName('');
    setNewUrl('');
    setNewLogo('');
    setNewToolFolderId(folderId);
    setAddToolFolderId(folderId);
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
      closeToolModal();
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
    closeToolModal();
  };

  const confirmResetNow = async () => {
    if (!confirmReset) return;
    setResetting(true);
    try {
      await onResetFolder(confirmReset.id);
      setConfirmReset(null);
    } finally {
      setResetting(false);
    }
  };

  const closeFolderModal = () => {
    setFolderModalOpen(false);
    setNewFolderName('');
    setNewFolderParent('');
  };

  const openNewFolder = () => {
    setNewFolderName('');
    setNewFolderParent('');
    setFolderModalOpen(true);
  };

  const openNewSubFolder = (parent: Folder) => {
    setNewFolderName('');
    setNewFolderParent(parent.id);
    setFolderModalOpen(true);
  };

  const submitFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    await onCreateFolder(newFolderName, newFolderParent || null);
    closeFolderModal();
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
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="space-y-6">
                          {folderGroups.map((group, groupIndex) => (
                            <React.Fragment key={group[0].folder.id}>
                              {group.map(({ folder, isSub, label }) => (
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
                                  onAddTool={openAddTool}
                                  onRequestReset={setConfirmReset}
                                  onViewAsList={viewFolderAsList}
                                />
                              ))}
                              {groupIndex < folderGroups.length - 1 && (
                                <div className="mx-auto h-px w-2/3 bg-white/10" aria-hidden="true" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>

                        <DragOverlay dropAnimation={defaultDropAnimation}>
                          {draggingTool ? <AppDragGhost tool={draggingTool} /> : null}
                        </DragOverlay>
                      </DndContext>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <button
                        onClick={openNewFolder}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 text-white transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                      >
                        <Plus size={19} />
                        <span className="font-sans text-xs font-black uppercase tracking-widest">
                          New folder
                        </span>
                      </button>

                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={topLevelFolders.map((f) => f.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="mx-auto max-w-4xl space-y-3">
                            {topLevelFolders.map((folder) => {
                              const subs = subFoldersByParent.get(folder.id) ?? [];
                              return (
                                <div key={folder.id} className="relative">
                                  <SortableFolderItem
                                    folder={folder}
                                    tools={toolsIn(folder.id)}
                                    isDragging={draggingFolderId === folder.id}
                                    isEditing={editingFolderId === folder.id}
                                    onBeginEdit={setEditingFolderId}
                                    onDelete={requestDeleteFolder}
                                    onRename={(id, name) => {
                                      setEditingFolderId(null);
                                      const current = foldersById.get(id);
                                      if (name.trim() && current && name !== current.name) {
                                        void onRenameFolder(id, name);
                                      }
                                    }}
                                    onAddSubFolder={openNewSubFolder}
                                  />

                                  {subs.length > 0 && (
                                    <div className="relative ml-14 mt-3">
                                      {/* One element: a single vertical line, centered in the
                                          gutter between the parent's and sub-folders' left
                                          edges, spanning exactly from the top of the first
                                          sub-folder card to the bottom of the last one. */}
                                      <div
                                        className="pointer-events-none absolute inset-y-0 z-0 w-1 rounded-full bg-purple-500/40"
                                        style={{ left: -28 }}
                                        aria-hidden="true"
                                      />

                                      <div className="relative z-10 space-y-3">
                                        {subs.map((sub) => (
                                          <SubFolderCard
                                            key={sub.id}
                                            folder={sub}
                                            tools={toolsIn(sub.id)}
                                            isEditing={editingFolderId === sub.id}
                                            onBeginEdit={setEditingFolderId}
                                            onDelete={requestDeleteFolder}
                                            onRename={(id, name) => {
                                              setEditingFolderId(null);
                                              const current = foldersById.get(id);
                                              if (name.trim() && current && name !== current.name) {
                                                void onRenameFolder(id, name);
                                              }
                                            }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
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

            {/* Reset-to-default confirmation */}
            <AnimatePresence>
              {confirmReset && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    role="alertdialog"
                    aria-modal="true"
                    className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[#12131a] p-6 text-center shadow-2xl"
                  >
                    <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
                      <RotateCcw size={24} className="text-white" />
                    </span>
                    <h3 className="mb-2 font-sans text-lg font-black uppercase tracking-tight text-white">
                      Reset {confirmReset.name}?
                    </h3>
                    <p className="mb-6 font-sans text-sm leading-relaxed text-gray-400">
                      Discards your changes and restores the default version. Can't be undone.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setConfirmReset(null)}
                        className="flex-1 rounded-2xl bg-white/5 py-3.5 font-sans text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/10"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmResetNow}
                        disabled={resetting}
                        className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-3.5 font-sans text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-purple-600/20 transition-all hover:shadow-purple-600/40 disabled:opacity-50"
                      >
                        Reset
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <ToolFormModal
            isOpen={isToolModalOpen}
            isEditing={editingTool !== null}
            busy={busy}
            name={editingTool ? editingTool.name : newName}
            url={editingTool ? editingTool.url : newUrl}
            logoUrl={editingTool ? (editingTool.logo_url ?? '') : newLogo}
            folderId={editingTool ? editingTool.folder_id : (addToolFolderId ?? newToolFolderId)}
            folderOptions={orderedFolders}
            onNameChange={(v) =>
              editingTool ? setEditingTool({ ...editingTool, name: v }) : setNewName(v)
            }
            onUrlChange={(v) =>
              editingTool ? setEditingTool({ ...editingTool, url: v }) : setNewUrl(v)
            }
            onLogoChange={(v) =>
              editingTool ? setEditingTool({ ...editingTool, logo_url: v || null }) : setNewLogo(v)
            }
            onFolderChange={(v) =>
              editingTool ? setEditingTool({ ...editingTool, folder_id: v }) : setNewToolFolderId(v)
            }
            onSubmit={submitTool}
            onClose={closeToolModal}
          />

          <FolderFormModal
            isOpen={folderModalOpen}
            busy={busy}
            name={newFolderName}
            parentId={newFolderParent}
            topLevelFolders={topLevelFolders}
            onNameChange={setNewFolderName}
            onParentChange={setNewFolderParent}
            onSubmit={submitFolder}
            onClose={closeFolderModal}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
