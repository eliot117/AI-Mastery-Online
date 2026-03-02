import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Edit2, FolderPlus, LayoutGrid, List, Upload, GripVertical, Check, LogOut } from 'lucide-react';
import { AITool } from '../types';
import { getDomain, getIconHorseUrl, getAppFallbackIcon } from '../utils/logoUtils';
import { User } from 'firebase/auth';
import { db, appId } from '../App';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  writeBatch
} from 'firebase/firestore';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * LOGO PROTOCOL: To import new logos, use a direct HTTPS URL to a CDN or brand-hosted PNG/SVG. 
 * Never use emojis. Ensure all logo containers maintain a consistent 1:1 aspect ratio with object-contain.
 */

interface ManageOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Record<string, AITool[]>;
  onUpdateFolders: React.Dispatch<React.SetStateAction<Record<string, AITool[]>>>;
  onReorderTools: (folderName: string, newTools: AITool[]) => void;
  onReorderFolders: (newFolderOrder: string[]) => void;
  onSignOut: () => void;
  user: User | null;
}

interface SortableAppItemProps {
  tool: AITool;
  onEdit: (tool: AITool) => void;
  onRequestDelete: (id: string) => void;
}

const SortableAppItem: React.FC<SortableAppItemProps> = ({ tool, onEdit, onRequestDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tool.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.07] ${isDragging ? 'z-0' : 'z-10'}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            type="button"
            className="cursor-grab active:cursor-grabbing text-gray-700 group-hover:text-gray-400 p-2 outline-none"
          >
            <GripVertical size={16} />
          </button>
          <div className="w-11 h-11 rounded-[16px] bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
            <img
              src={tool.logoUrl || getIconHorseUrl(tool.url)}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getAppFallbackIcon(tool.name);
              }}
            />
          </div>
        </div>
        <div>
          <h4 className="text-[12px] font-sans font-black text-white tracking-wide uppercase">{tool.name}</h4>
          <p className="text-[10px] font-sans font-bold text-gray-500 truncate max-w-[180px]">
            {tool.url ? new URL(tool.url).hostname : ''}
          </p>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(tool)}
          className="p-2.5 hover:bg-white/10 rounded-[14px] text-gray-500 hover:text-blue-400 transition-all"
        >
          <Edit2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => onRequestDelete(tool.id)}
          className="p-2.5 hover:bg-white/10 rounded-[14px] text-gray-500 hover:text-red-400 transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

interface SortableFolderItemProps {
  name: string;
  tools: AITool[];
  isEditing: boolean;
  onBeginEdit: () => void;
  onRename: (oldName: string, newName: string) => void;
  onRequestDelete: (name: string) => void;
}

const SortableFolderItem: React.FC<SortableFolderItemProps> = ({
  name,
  tools,
  isEditing,
  onBeginEdit,
  onRename,
  onRequestDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: name });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group p-8 bg-white/5 rounded-[32px] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[160px] ${isDragging ? 'z-0' : 'z-10'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            type="button"
            className="cursor-grab active:cursor-grabbing text-gray-700 group-hover:text-gray-500 p-2 outline-none"
          >
            <GripVertical size={16} />
          </button>
          {isEditing ? (
            <input
              autoFocus
              defaultValue={name}
              onBlur={(e) => onRename(name, e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onRename(name, e.currentTarget.value)}
              className="bg-transparent border-b border-purple-500 focus:outline-none text-white font-sans font-black text-xl uppercase tracking-widest w-full mr-4 rounded-[24px] px-2"
            />
          ) : (
            <h4 className="text-xl font-sans font-black text-white tracking-widest uppercase truncate leading-none">
              {name}
            </h4>
          )}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onBeginEdit}
            className="p-2 hover:bg-white/10 rounded-[14px] text-gray-500 hover:text-white transition-all"
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => onRequestDelete(name)}
            className="p-2 hover:bg-white/10 rounded-[14px] text-gray-500 hover:text-red-500 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between mt-8">
        <div className="flex -space-x-3">
          {tools.slice(0, 5).map((t) => (
            <div
              key={t.id}
              className="w-10 h-10 rounded-[14px] bg-black border border-white/10 flex items-center justify-center overflow-hidden ring-4 ring-black"
            >
              <img
                src={t.logoUrl || getIconHorseUrl(t.url)}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getAppFallbackIcon(t.name);
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-sans font-black text-white leading-none">{tools.length}</span>
          <span className="text-[9px] font-sans font-bold text-purple-500/60 uppercase tracking-widest">
            TOOLS
          </span>
        </div>
      </div>
    </div>
  );
};

export const ManageOverlay: React.FC<ManageOverlayProps> = ({
  isOpen,
  onClose,
  folders,
  onUpdateFolders,
  onReorderTools,
  onReorderFolders,
  onSignOut,
  user
}) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'folders'>('apps');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [direction, setDirection] = useState(0); // 1 for right-to-left, -1 for left-to-right

  const [editingApp, setEditingApp] = useState<AITool | null>(null);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'app' | 'folder', id: string } | null>(null);

  const [newAppName, setNewAppName] = useState('');
  const [newAppUrl, setNewAppUrl] = useState('');
  const [newAppLogo, setNewAppLogo] = useState<string | null>(null);
  const [newAppIcon, setNewAppIcon] = useState('A');
  const [newAppFolder, setNewAppFolder] = useState(Object.keys(folders)[0] || '');

  const [newFolderName, setNewFolderName] = useState('');

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<AITool | null>(null);
  const [activeFolderName, setActiveFolderName] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    if ((editingApp || editingFolder) && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [editingApp, editingFolder]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (editingApp) {
          setEditingApp({ ...editingApp, logoUrl: base64String });
        } else {
          setNewAppLogo(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName || !newAppUrl || !newAppFolder) return;

    const newApp: AITool = {
      id: Math.random().toString(36).substr(2, 9),
      name: newAppName,
      url: newAppUrl,
      description: 'Added via Admin Command Center',
      category: newAppFolder,
      icon: newAppName.charAt(0).toUpperCase(),
      logoUrl: newAppLogo || undefined,
      clickCount: 0,
      position: (folders[newAppFolder]?.length || 0)
    };

    onUpdateFolders(prev => ({
      ...prev,
      [newAppFolder]: [...(prev[newAppFolder] || []), newApp]
    }));

    if (user) {
      const appRef = doc(db, `artifacts/${appId}/users/${user.uid}/dashboard/apps`, newApp.id);
      setDoc(appRef, newApp).catch(console.error);
    }

    setNewAppName('');
    setNewAppUrl('');
    setNewAppLogo(null);
    setNewAppIcon('A');
  };

  const handleUpdateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    onUpdateFolders(prev => {
      const next = { ...prev };
      for (const cat in next) {
        next[cat] = next[cat].filter(t => t.id !== editingApp.id);
      }
      const targetCategory = editingApp.category;
      next[targetCategory] = [...(next[targetCategory] || []), editingApp];
      return next;
    });

    if (user) {
      const appRef = doc(db, `artifacts/${appId}/users/${user.uid}/dashboard/apps`, editingApp.id);
      setDoc(appRef, editingApp).catch(console.error);
    }

    setEditingApp(null);
  };

  const handleDeleteApp = (id: string) => {
    onUpdateFolders(prev => {
      const next = { ...prev };
      for (const cat in next) {
        next[cat] = next[cat].filter(t => t.id !== id);
      }
      return next;
    });

    if (user) {
      const appRef = doc(db, `artifacts/${appId}/users/${user.uid}/dashboard/apps`, id);
      deleteDoc(appRef).catch(console.error);
    }

    setConfirmDelete(null);
  };

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName || folders[newFolderName]) return;

    onUpdateFolders(prev => ({ ...prev, [newFolderName]: [] }));

    if (user) {
      const folderRef = doc(db, `artifacts/${appId}/users/${user.uid}/dashboard/folders`, newFolderName);
      setDoc(folderRef, {
        name: newFolderName,
        position: Object.keys(folders).length
      }).catch(console.error);
    }

    setNewFolderName('');
  };

  const handleDeleteFolder = (name: string) => {
    onUpdateFolders(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });

    if (user) {
      const folderRef = doc(db, `artifacts/${appId}/users/${user.uid}/dashboard/folders`, name);
      deleteDoc(folderRef).catch(console.error);
    }

    setConfirmDelete(null);
  };

  const handleRenameFolder = async (oldName: string, newName: string) => {
    if (!newName || folders[newName]) return;

    onUpdateFolders(prev => {
      const next = { ...prev };
      next[newName] = next[oldName].map(app => ({ ...app, category: newName }));
      delete next[oldName];
      return next;
    });

    if (user) {
      try {
        const batch = writeBatch(db);
        const newFolderRef = doc(db, `artifacts/${appId}/users/${user.uid}/dashboard/folders`, newName);
        batch.set(newFolderRef, { name: newName, position: 0 });
        const oldFolderRef = doc(db, `artifacts/${appId}/users/${user.uid}/dashboard/folders`, oldName);
        batch.delete(oldFolderRef);
        const toolsInFolder = folders[oldName] || [];
        toolsInFolder.forEach(tool => {
          const appRef = doc(db, `artifacts/${appId}/users/${user.uid}/dashboard/apps`, tool.id);
          batch.update(appRef, { category: newName });
        });
        await batch.commit();
      } catch (err) {
        console.error("Rename failed:", err);
      }
    }

    setEditingFolder(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    if (activeTab === 'apps') {
      const tool = (Object.values(folders).flat() as AITool[]).find(t => t.id === active.id);
      if (tool) setActiveTool(tool);
    } else {
      setActiveFolderName(active.id as string);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveTool(null);
    setActiveFolderName(null);

    if (over && active.id !== over.id) {
      if (activeTab === 'apps') {
        const activeTool = (Object.values(folders).flat() as AITool[]).find(t => t.id === active.id);
        if (!activeTool) return;
        const folderName = activeTool.category;
        const items = folders[folderName];
        const oldIndex = items.findIndex(t => t.id === active.id);
        const newIndex = items.findIndex(t => t.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          onReorderTools(folderName, arrayMove(items, oldIndex, newIndex));
        }
      } else {
        const items = Object.keys(folders);
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        if (oldIndex !== -1 && newIndex !== -1) {
          onReorderFolders(arrayMove(items, oldIndex, newIndex));
        }
      }
    }
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
    enter: (direction: number) => ({
      x: direction > 0 ? '50%' : '-50%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-50%' : '50%',
      opacity: 0,
    })
  };

  const actionButtonClass = "w-44 bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl rounded-[24px] font-sans font-black text-[10px] tracking-widest uppercase transition-all text-white flex-shrink-0 h-11 flex items-center justify-center";

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
            <div className="p-8 pb-4 grid grid-cols-1 md:grid-cols-3 items-center border-b border-white/5">
              <div className="flex items-center min-w-0 pr-12">
                {user && (
                  <button
                    onClick={onSignOut}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 font-sans text-[10px] tracking-widest uppercase transition-all"
                  >
                    <LogOut size={12} />
                    <span>Signal Lost</span>
                  </button>
                )}
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
                    animate={{
                      left: activeTab === 'apps' ? 4 : 'calc(50% + 0px)',
                      width: 'calc(50% - 4px)'
                    }}
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

            <div className="flex-1 relative overflow-hidden bg-black/10">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  key={activeTab}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 350, damping: 35 },
                    opacity: { duration: 0.3 }
                  }}
                  className="absolute inset-0 overflow-y-auto p-8 custom-scrollbar"
                  ref={scrollContainerRef}
                >
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
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
                                <button
                                  type="submit"
                                  className={actionButtonClass}
                                >
                                  {editingApp ? 'SAVE' : 'ADD'}
                                </button>
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
                                <SortableContext
                                  items={tools.map(t => t.id)}
                                  strategy={verticalListSortingStrategy}
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {tools.map((tool) => (
                                      <SortableAppItem
                                        key={tool.id}
                                        tool={tool}
                                        onEdit={(t) => setEditingApp(t)}
                                        onRequestDelete={(id) =>
                                          setConfirmDelete({
                                            type: 'app',
                                            id,
                                          })
                                        }
                                      />
                                    ))}
                                  </div>
                                </SortableContext>
                              ) : (
                                <div className="space-y-1 pl-4 text-center">
                                  {tools.map(tool => (
                                    <div key={tool.id} className="text-sm font-sans font-medium text-gray-400 hover:text-white transition-colors py-1 cursor-default uppercase tracking-widest">
                                      {tool.name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
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
                            <button
                              type="submit"
                              className={actionButtonClass}
                            >
                              CREATE
                            </button>
                          </form>
                        </section>

                        <div className="space-y-6">
                          <h3 className="text-[10px] font-sans font-black text-blue-400 tracking-[0.3em] uppercase mb-4">
                            ORBITAL SECTORS
                          </h3>
                          <SortableContext
                            items={Object.keys(folders)}
                            strategy={rectSortingStrategy}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {(Object.entries(folders) as [string, AITool[]][]).map(([name, tools]) => (
                                <SortableFolderItem
                                  key={name}
                                  name={name}
                                  tools={tools}
                                  isEditing={editingFolder === name}
                                  onBeginEdit={() => setEditingFolder(name)}
                                  onRename={handleRenameFolder}
                                  onRequestDelete={(folderName) =>
                                    setConfirmDelete({
                                      type: 'folder',
                                      id: folderName,
                                    })
                                  }
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </div>
                      </div>
                    )}

                    <DragOverlay dropAnimation={{
                      sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                          active: {
                            opacity: '0.4',
                          },
                        },
                      }),
                    }}>
                      {activeId ? (
                        activeTab === 'apps' && activeTool ? (
                          <div className="flex items-center justify-between p-5 bg-white/10 rounded-[24px] border border-white/20 shadow-2xl scale-[1.03] z-[100] backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-3">
                                <GripVertical size={16} className="text-gray-400" />
                                <div className="w-11 h-11 rounded-[16px] bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                                  <img
                                    src={activeTool.logoUrl || getIconHorseUrl(activeTool.url)}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = getAppFallbackIcon(activeTool.name);
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <h4 className="text-[12px] font-sans font-black text-white tracking-wide uppercase">{activeTool.name}</h4>
                                <p className="text-[10px] font-sans font-bold text-gray-500 truncate max-w-[180px]">
                                  {activeTool.url ? new URL(activeTool.url).hostname : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : activeFolderName ? (
                          <div className="p-8 bg-white/10 rounded-[32px] border border-white/20 shadow-2xl scale-[1.03] z-[100] backdrop-blur-xl flex flex-col justify-between min-h-[160px] w-full">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <GripVertical size={16} className="text-gray-500" />
                                <h4 className="text-xl font-sans font-black text-white tracking-widest uppercase truncate leading-none">
                                  {activeFolderName}
                                </h4>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-8">
                              <div className="flex -space-x-3">
                                {folders[activeFolderName]?.slice(0, 5).map((t) => (
                                  <div
                                    key={t.id}
                                    className="w-10 h-10 rounded-[14px] bg-black border border-white/10 flex items-center justify-center overflow-hidden ring-4 ring-black"
                                  >
                                    <img
                                      src={t.logoUrl || getIconHorseUrl(t.url)}
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = getAppFallbackIcon(t.name);
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-3xl font-sans font-black text-white leading-none">{folders[activeFolderName]?.length || 0}</span>
                                <span className="text-[9px] font-sans font-bold text-purple-500/60 uppercase tracking-widest">
                                  TOOLS
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : null
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {confirmDelete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[110]"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#0f172a] p-10 rounded-[32px] border border-white/10 max-w-sm text-center shadow-2xl"
                  >
                    <Trash2 size={40} className="text-red-500 mx-auto mb-6" />
                    <h3 className="text-xl font-sans font-black uppercase tracking-tight mb-2">PURGE SEQUENCE?</h3>
                    <p className="text-sm text-gray-400 font-sans font-bold mb-8 leading-relaxed">REMOVE {confirmDelete.type.toUpperCase()} FROM SYSTEM PERMANENTLY?</p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="flex-1 px-6 py-4 rounded-[24px] bg-white/5 hover:bg-white/10 font-sans font-black text-[10px] tracking-widest uppercase transition-all text-white"
                      >
                        ABORT
                      </button>
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
