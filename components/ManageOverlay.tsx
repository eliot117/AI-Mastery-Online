import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Edit2, FolderPlus, LayoutGrid, List, Upload, GripVertical, Check, LogOut } from 'lucide-react';
import { AITool } from '../types';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ManageOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Record<string, AITool[]>;
  onAddApp: (app: Omit<AITool, 'id'>) => Promise<void>;
  onUpdateApp: (id: string, app: Partial<AITool>) => Promise<void>;
  onDeleteApp: (id: string) => Promise<void>;
  onAddFolder: (name: string) => Promise<void>;
  onDeleteFolder: (name: string) => Promise<void>;
  onRenameFolder: (oldName: string, newName: string) => Promise<void>;
  onReorderTools: (folderName: string, newTools: AITool[]) => void;
  onSignOut: () => void;
}

// ─── Drag handle style helper ─────────────────────────────────────────────
const getDomain = (url: string) => {
  try { return url ? new URL(url).hostname : 'system'; }
  catch { return 'invalid-url'; }
};

// ─── Sortable App Row ─────────────────────────────────────────────────────
interface SortableAppProps {
  tool: AITool;
  onEdit: (tool: AITool) => void;
  onDelete: (id: string) => void;
}

const SortableAppRow: React.FC<SortableAppProps> = ({ tool, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: tool.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.07]"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
            className="cursor-grab active:cursor-grabbing touch-none p-1 -m-1 rounded-lg text-gray-700 hover:text-gray-400 transition-colors"
          >
            <GripVertical size={16} />
          </div>
          <div className="w-11 h-11 rounded-[16px] bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
            {tool.logoUrl ? (
              <img src={tool.logoUrl} className="w-full h-full object-contain" alt="" />
            ) : (
              <span className="text-xl font-tech font-bold text-white/40">{(tool.name || 'A').charAt(0)}</span>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-[12px] font-sans font-black text-white tracking-wide uppercase">{tool.name || 'Unnamed'}</h4>
          <p className="text-[10px] font-sans font-bold text-gray-500 truncate max-w-[180px]">{getDomain(tool.url)}</p>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(tool)} className="p-2.5 hover:bg-white/10 rounded-[14px] text-gray-500 hover:text-blue-400 transition-all"><Edit2 size={16} /></button>
        <button onClick={() => onDelete(tool.id)} className="p-2.5 hover:bg-white/10 rounded-[14px] text-gray-500 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
      </div>
    </div>
  );
};

// Ghost card shown while dragging an app
const AppDragGhost: React.FC<{ tool: AITool }> = ({ tool }) => (
  <div className="flex items-center justify-between p-5 bg-white/10 rounded-[24px] border border-purple-500/50 shadow-[0_20px_60px_rgba(139,92,246,0.3)] scale-[1.03] backdrop-blur-xl">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <GripVertical size={16} className="text-purple-400" />
        <div className="w-11 h-11 rounded-[16px] bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
          {tool.logoUrl ? <img src={tool.logoUrl} className="w-full h-full object-contain" alt="" /> : <span className="text-xl font-tech font-bold text-white/40">{(tool.name || 'A').charAt(0)}</span>}
        </div>
      </div>
      <div>
        <h4 className="text-[12px] font-sans font-black text-white tracking-wide uppercase">{tool.name || 'Unnamed'}</h4>
        <p className="text-[10px] font-sans font-bold text-gray-500 truncate max-w-[180px]">{getDomain(tool.url)}</p>
      </div>
    </div>
  </div>
);

// ─── Sortable Folder Card ──────────────────────────────────────────────────
interface SortableFolderProps {
  name: string;
  tools: AITool[];
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
}

const SortableFolderCard: React.FC<SortableFolderProps> = ({ name, tools, isEditing, onEdit, onDelete, onRename }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: name });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group p-8 bg-white/5 rounded-[32px] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[160px]"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
            className="cursor-grab active:cursor-grabbing touch-none flex-shrink-0 p-1 -m-1 rounded-lg text-gray-700 group-hover:text-gray-500 transition-colors"
          >
            <GripVertical size={16} />
          </div>
          {isEditing ? (
            <input
              autoFocus
              defaultValue={name}
              onBlur={(e) => onRename(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onRename(e.currentTarget.value)}
              className="bg-transparent border-b border-purple-500 focus:outline-none text-white font-sans font-black text-xl uppercase tracking-widest w-full mr-4 rounded-[24px] px-2"
            />
          ) : (
            <h4 className="text-xl font-sans font-black text-white tracking-widest uppercase truncate leading-none">{name}</h4>
          )}
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={onEdit} className="p-2 hover:bg-white/10 rounded-[14px] text-gray-500 hover:text-white transition-all"><Edit2 size={16} /></button>
          <button onClick={onDelete} className="p-2 hover:bg-white/10 rounded-[14px] text-gray-500 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
        </div>
      </div>
      <div className="flex items-center justify-between mt-8">
        <div className="flex -space-x-3">
          {tools.slice(0, 5).map(t => (
            <div key={t.id} className="w-10 h-10 rounded-[14px] bg-black border border-white/10 flex items-center justify-center overflow-hidden ring-4 ring-black">
              {t.logoUrl ? <img src={t.logoUrl} className="w-full h-full object-contain" alt="" /> : <span className="text-sm font-tech font-bold text-white/40">{(t.name || 'A').charAt(0)}</span>}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-sans font-black text-white leading-none">{tools.length}</span>
          <span className="text-[9px] font-sans font-bold text-purple-500/60 uppercase tracking-widest">TOOLS</span>
        </div>
      </div>
    </div>
  );
};

// Ghost card shown while dragging a folder
const FolderDragGhost: React.FC<{ name: string; tools: AITool[] }> = ({ name, tools }) => (
  <div className="p-8 bg-white/10 rounded-[32px] border border-purple-500/50 shadow-[0_20px_60px_rgba(139,92,246,0.3)] scale-[1.03] backdrop-blur-xl flex flex-col justify-between min-h-[160px]">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <GripVertical size={16} className="text-purple-400" />
        <h4 className="text-xl font-sans font-black text-white tracking-widest uppercase truncate leading-none">{name}</h4>
      </div>
    </div>
    <div className="flex items-center justify-between mt-8">
      <div className="flex -space-x-3">
        {tools.slice(0, 5).map(t => (
          <div key={t.id} className="w-10 h-10 rounded-[14px] bg-black border border-white/10 flex items-center justify-center overflow-hidden ring-4 ring-black">
            {t.logoUrl ? <img src={t.logoUrl} className="w-full h-full object-contain" alt="" /> : <span className="text-sm font-tech font-bold text-white/40">{(t.name || 'A').charAt(0)}</span>}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-end">
        <span className="text-3xl font-sans font-black text-white leading-none">{tools.length}</span>
        <span className="text-[9px] font-sans font-bold text-purple-500/60 uppercase tracking-widest">TOOLS</span>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────
export const ManageOverlay: React.FC<ManageOverlayProps> = ({
  isOpen,
  onClose,
  folders,
  onAddApp,
  onUpdateApp,
  onDeleteApp,
  onAddFolder,
  onDeleteFolder,
  onRenameFolder,
  onReorderTools,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'folders'>('apps');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [direction, setDirection] = useState(0);

  const [editingApp, setEditingApp] = useState<AITool | null>(null);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'app' | 'folder'; id: string } | null>(null);

  const [newAppName, setNewAppName] = useState('');
  const [newAppUrl, setNewAppUrl] = useState('');
  const [newAppLogo, setNewAppLogo] = useState<string | null>(null);
  const [newAppFolder, setNewAppFolder] = useState(Object.keys(folders)[0] || 'Agents');
  const [newFolderName, setNewFolderName] = useState('');

  // Drag state
  const [activeDragAppId, setActiveDragAppId] = useState<string | null>(null);
  const [activeDragFolderName, setActiveDragFolderName] = useState<string | null>(null);

  // Folder order state (maintained locally for smooth reorder UX)
  const [folderOrder, setFolderOrder] = useState<string[]>(() => Object.keys(folders));

  // Keep folderOrder in sync when folders prop changes (new folders added/removed)
  useEffect(() => {
    const incoming = Object.keys(folders);
    setFolderOrder(prev => {
      const next = prev.filter(n => incoming.includes(n));
      incoming.forEach(n => { if (!next.includes(n)) next.push(n); });
      return next;
    });
  }, [folders]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ((editingApp || editingFolder) && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [editingApp, editingFolder]);

  useEffect(() => {
    if (!newAppFolder && Object.keys(folders).length > 0) {
      setNewAppFolder(Object.keys(folders)[0]);
    }
  }, [folders]);

  // dnd-kit sensors — require 5px movement before drag starts so clicks still work
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // ── App drag handlers ──
  const handleAppDragStart = (event: DragStartEvent) => {
    setActiveDragAppId(String(event.active.id));
  };

  const handleAppDragEnd = (event: DragEndEvent, folderName: string, tools: AITool[]) => {
    setActiveDragAppId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tools.findIndex(t => t.id === active.id);
    const newIndex = tools.findIndex(t => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorderTools(folderName, arrayMove(tools, oldIndex, newIndex));
  };

  // ── Folder drag handlers ──
  const handleFolderDragStart = (event: DragStartEvent) => {
    setActiveDragFolderName(String(event.active.id));
  };

  const handleFolderDragEnd = (event: DragEndEvent) => {
    setActiveDragFolderName(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setFolderOrder(prev => {
      const oldIndex = prev.indexOf(String(active.id));
      const newIndex = prev.indexOf(String(over.id));
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        if (editingApp) setEditingApp({ ...editingApp, logoUrl: b64 });
        else setNewAppLogo(b64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim() || !newAppUrl.trim() || !newAppFolder) return;
    await onAddApp({
      name: newAppName.trim(),
      url: newAppUrl.trim(),
      description: 'Added via Admin Command Center',
      category: newAppFolder,
      icon: newAppName.charAt(0).toUpperCase(),
      logoUrl: newAppLogo || undefined,
      clickCount: 0,
    });
    setNewAppName('');
    setNewAppUrl('');
    setNewAppLogo(null);
  };

  const handleUpdateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    const { id, ...data } = editingApp;
    await onUpdateApp(id, data);
    setEditingApp(null);
  };

  const handleDeleteApp = async (id: string) => {
    await onDeleteApp(id);
    setConfirmDelete(null);
  };

  const handleAddFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || folders[newFolderName.trim()]) return;
    await onAddFolder(newFolderName.trim());
    setNewFolderName('');
  };

  const handleDeleteFolder = async (name: string) => {
    await onDeleteFolder(name);
    setConfirmDelete(null);
  };

  const handleRenameFolder = async (oldName: string, newName: string) => {
    if (!newName.trim() || folders[newName.trim()]) return;
    await onRenameFolder(oldName, newName.trim());
    setEditingFolder(null);
  };

  const switchTab = (tab: 'apps' | 'folders') => {
    if (activeTab === tab) return;
    setDirection(tab === 'folders' ? 1 : -1);
    setActiveTab(tab);
  };

  const switchViewMode = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    if (activeTab !== 'apps') switchTab('apps');
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '50%' : '-50%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-50%' : '50%', opacity: 0 }),
  };

  const actionButtonClass =
    'w-44 bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl rounded-[24px] font-sans font-black text-[10px] tracking-widest uppercase transition-all text-white flex-shrink-0 h-11 flex items-center justify-center';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 md:p-10"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-7xl h-[85vh] glass-heavy rounded-[32px] border border-white/10 flex flex-col overflow-hidden relative"
          >
            {/* Header */}
            <div className="p-8 pb-4 grid grid-cols-1 md:grid-cols-3 items-center border-b border-white/5">
              <div className="flex items-center min-w-0">
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-2 px-6 h-11 bg-white/5 hover:bg-white/10 border border-white/5 rounded-[24px] font-sans text-[10px] font-bold tracking-widest uppercase transition-all text-gray-400 hover:text-white"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>

              <div className="flex justify-center order-3 md:order-2">
                <nav className="flex items-center bg-white/5 rounded-[24px] p-1 relative overflow-hidden w-[280px] h-11">
                  <button
                    onClick={() => switchTab('apps')}
                    className={`relative z-10 w-1/2 h-full rounded-[20px] font-sans text-[10px] tracking-widest uppercase transition-all font-bold flex items-center justify-center ${activeTab === 'apps' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                  >
                    Applications
                  </button>
                  <button
                    onClick={() => switchTab('folders')}
                    className={`relative z-10 w-1/2 h-full rounded-[20px] font-sans text-[10px] tracking-widest uppercase transition-all font-bold flex items-center justify-center ${activeTab === 'folders' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                  >
                    Folders
                  </button>
                  <motion.div
                    className="absolute h-[calc(100%-8px)] bg-purple-600 rounded-[20px] shadow-lg shadow-purple-600/30"
                    initial={false}
                    animate={{ left: activeTab === 'apps' ? 4 : 'calc(50% + 0px)', width: 'calc(50% - 4px)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                </nav>
              </div>

              <div className="flex justify-end items-center gap-4 order-2 md:order-3">
                <div className="flex items-center gap-1 bg-white/5 rounded-[24px] p-1 px-2">
                  <button
                    onClick={() => switchViewMode('grid')}
                    className={`p-1.5 rounded-[16px] transition-all flex items-center gap-2 px-4 ${viewMode === 'grid' && activeTab === 'apps' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-white'}`}
                  >
                    <LayoutGrid size={14} />
                    <span className="text-[9px] font-sans font-bold uppercase tracking-widest">GRID</span>
                  </button>
                  <button
                    onClick={() => switchViewMode('list')}
                    className={`p-1.5 rounded-[16px] transition-all flex items-center gap-2 px-4 ${viewMode === 'list' && activeTab === 'apps' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-white'}`}
                  >
                    <List size={14} />
                    <span className="text-[9px] font-sans font-bold uppercase tracking-widest">LIST</span>
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-[24px] transition-all text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 relative overflow-hidden bg-black/10">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  key={activeTab}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: 'spring', stiffness: 350, damping: 35 }, opacity: { duration: 0.3 } }}
                  className="absolute inset-0 overflow-y-auto p-8 custom-scrollbar"
                  ref={scrollContainerRef}
                >
                  {/* ─── APPS TAB ─────────────────────────────────────── */}
                  {activeTab === 'apps' ? (
                    <div className="space-y-12">
                      {viewMode === 'grid' && (
                        <section className="bg-white/5 p-4 rounded-[24px] border border-white/5">
                          <h3 className="text-[10px] font-sans font-black text-purple-400 tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                            <Plus size={14} /> {editingApp ? 'RECONFIGURE TOOL' : 'ADD AI APP OR TOOL'}
                          </h3>
                          <form onSubmit={editingApp ? handleUpdateApp : handleAddApp} className="flex flex-col md:flex-row gap-2 items-center w-full">
                            <div className="flex-1 w-full">
                              <input
                                type="text"
                                placeholder="Name"
                                className="w-full bg-white/5 border border-white/10 rounded-[24px] px-5 py-3 text-sm font-sans focus:outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-gray-600 h-11"
                                value={editingApp ? editingApp.name : newAppName}
                                onChange={(e) => editingApp ? setEditingApp({ ...editingApp, name: e.target.value }) : setNewAppName(e.target.value)}
                              />
                            </div>
                            <div className="flex-1 w-full">
                              <input
                                type="text"
                                placeholder="URL"
                                className="w-full bg-white/5 border border-white/10 rounded-[24px] px-5 py-3 text-sm font-sans focus:outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-gray-600 h-11"
                                value={editingApp ? editingApp.url : newAppUrl}
                                onChange={(e) => editingApp ? setEditingApp({ ...editingApp, url: e.target.value }) : setNewAppUrl(e.target.value)}
                              />
                            </div>
                            <div className="flex-1 w-full flex gap-2">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-[24px] px-4 py-3 text-xs font-sans font-bold text-gray-400 hover:text-white transition-all h-11"
                              >
                                {(editingApp?.logoUrl || newAppLogo) ? <Check size={14} className="text-green-500" /> : <Upload size={14} />}
                                {(editingApp?.logoUrl || newAppLogo) ? 'Logo Set' : 'Logo'}
                              </button>
                              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                              <select
                                className="w-2/5 bg-white/5 border border-white/10 rounded-[24px] px-4 py-3 text-xs font-sans font-bold appearance-none focus:outline-none focus:border-purple-500/50 transition-all text-white cursor-pointer h-11 text-center"
                                value={editingApp ? editingApp.category : newAppFolder}
                                onChange={(e) => editingApp ? setEditingApp({ ...editingApp, category: e.target.value }) : setNewAppFolder(e.target.value)}
                              >
                                {Object.keys(folders).map(f => <option key={f} value={f} className="bg-[#0f172a]">{f}</option>)}
                              </select>
                            </div>
                            <div className="flex gap-2 items-center justify-end">
                              <button type="submit" className={actionButtonClass}>{editingApp ? 'SAVE' : 'ADD'}</button>
                              {(editingApp || newAppLogo) && (
                                <button
                                  type="button"
                                  onClick={() => editingApp ? setEditingApp(null) : setNewAppLogo(null)}
                                  className="px-4 bg-white/10 hover:bg-white/20 rounded-[24px] transition-all text-white h-11 flex items-center justify-center"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                          </form>
                        </section>
                      )}

                      <div className="space-y-12">
                        {(Object.entries(folders) as [string, AITool[]][]).map(([folderName, tools]) => (
                          <div key={folderName} className="space-y-6">
                            <div className="flex flex-col items-center gap-4 px-2">
                              <h3 className="text-3xl font-sans font-black text-white uppercase tracking-tighter leading-none text-center">{folderName}</h3>
                              <div className="h-[1px] w-1/4 bg-white/10" />
                              <span className="text-4xl font-sans font-black text-purple-600/40 leading-none">{tools.length}</span>
                            </div>

                            {viewMode === 'grid' ? (
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleAppDragStart}
                                onDragEnd={(e) => handleAppDragEnd(e, folderName, tools)}
                              >
                                <SortableContext items={tools.map(t => t.id)} strategy={rectSortingStrategy}>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {tools.map(tool => (
                                      <SortableAppRow
                                        key={tool.id}
                                        tool={tool}
                                        onEdit={setEditingApp}
                                        onDelete={(id) => setConfirmDelete({ type: 'app', id })}
                                      />
                                    ))}
                                  </div>
                                </SortableContext>
                                <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                                  {activeDragAppId ? (
                                    <AppDragGhost tool={tools.find(t => t.id === activeDragAppId) || tools[0]} />
                                  ) : null}
                                </DragOverlay>
                              </DndContext>
                            ) : (
                              <div className="space-y-1 pl-4 text-center">
                                {tools.map(tool => (
                                  <div key={tool.id} className="text-sm font-sans font-medium text-gray-400 hover:text-white transition-colors py-1 cursor-default uppercase tracking-widest">
                                    {tool.name || 'Unnamed'}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* ─── FOLDERS TAB ───────────────────────────────────── */
                    <div className="space-y-12">
                      <section className="bg-white/5 p-4 rounded-[24px] border border-white/5">
                        <h3 className="text-[10px] font-sans font-black text-purple-400 tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                          <FolderPlus size={14} /> NEW SECTOR
                        </h3>
                        <form onSubmit={handleAddFolder} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Sector Identity"
                            className="flex-1 bg-white/5 border border-white/10 rounded-[24px] px-5 py-3 text-sm font-sans focus:outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-gray-600 h-11"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                          />
                          <button type="submit" className={actionButtonClass}>CREATE</button>
                        </form>
                      </section>

                      <div className="space-y-6">
                        <h3 className="text-[10px] font-sans font-black text-blue-400 tracking-[0.3em] uppercase mb-4">ORBITAL SECTORS</h3>
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragStart={handleFolderDragStart}
                          onDragEnd={handleFolderDragEnd}
                        >
                          <SortableContext items={folderOrder} strategy={rectSortingStrategy}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {folderOrder.map(name => (
                                folders[name] !== undefined ? (
                                  <SortableFolderCard
                                    key={name}
                                    name={name}
                                    tools={folders[name]}
                                    isEditing={editingFolder === name}
                                    onEdit={() => setEditingFolder(name)}
                                    onDelete={() => setConfirmDelete({ type: 'folder', id: name })}
                                    onRename={(newName) => handleRenameFolder(name, newName)}
                                  />
                                ) : null
                              ))}
                            </div>
                          </SortableContext>
                          <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                            {activeDragFolderName && folders[activeDragFolderName] ? (
                              <FolderDragGhost name={activeDragFolderName} tools={folders[activeDragFolderName]} />
                            ) : null}
                          </DragOverlay>
                        </DndContext>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Confirm Delete Dialog */}
            <AnimatePresence>
              {confirmDelete && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[110]"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#0f172a] p-10 rounded-[32px] border border-white/10 max-w-sm text-center shadow-2xl"
                  >
                    <Trash2 size={40} className="text-red-500 mx-auto mb-6" />
                    <h3 className="text-xl font-sans font-black uppercase tracking-tight mb-2">PURGE SEQUENCE?</h3>
                    <p className="text-sm text-gray-400 font-sans font-bold mb-8 leading-relaxed">REMOVE {confirmDelete.type.toUpperCase()} FROM SYSTEM PERMANENTLY?</p>
                    <div className="flex gap-4">
                      <button onClick={() => setConfirmDelete(null)} className="flex-1 px-6 py-4 rounded-[24px] bg-white/5 hover:bg-white/10 font-sans font-black text-[10px] tracking-widest uppercase transition-all text-white">ABORT</button>
                      <button
                        onClick={() => confirmDelete.type === 'app' ? handleDeleteApp(confirmDelete.id) : handleDeleteFolder(confirmDelete.id)}
                        className="flex-1 px-6 py-4 rounded-[24px] bg-red-600 hover:bg-red-500 font-sans font-black text-[10px] tracking-widest uppercase transition-all shadow-lg shadow-red-600/20 text-white"
                      >
                        PURGE
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
