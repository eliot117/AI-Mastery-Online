
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { X, Plus, Trash2, Edit2, FolderPlus, LayoutGrid, List, Upload, GripVertical, Check } from 'lucide-react';
import { AITool } from '../types';

interface ManageOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Record<string, AITool[]>;
  onUpdateFolders: React.Dispatch<React.SetStateAction<Record<string, AITool[]>>>;
  onReorderTools: (folderName: string, newTools: AITool[]) => void;
}

export const ManageOverlay: React.FC<ManageOverlayProps> = ({ 
  isOpen, 
  onClose, 
  folders, 
  onUpdateFolders, 
  onReorderTools
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
  const [newAppIcon, setNewAppIcon] = useState('🚀');
  const [newAppFolder, setNewAppFolder] = useState(Object.keys(folders)[0] || '');

  const [newFolderName, setNewFolderName] = useState('');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      icon: newAppIcon,
      logoUrl: newAppLogo || undefined,
      clickCount: 0
    };

    onUpdateFolders(prev => ({
      ...prev,
      [newAppFolder]: [...(prev[newAppFolder] || []), newApp]
    }));

    setNewAppName('');
    setNewAppUrl('');
    setNewAppLogo(null);
    setNewAppIcon('🚀');
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
    setConfirmDelete(null);
  };

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName || folders[newFolderName]) return;
    onUpdateFolders(prev => ({ ...prev, [newFolderName]: [] }));
    setNewFolderName('');
  };

  const handleDeleteFolder = (name: string) => {
    onUpdateFolders(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setConfirmDelete(null);
  };

  const handleRenameFolder = (oldName: string, newName: string) => {
    if (!newName || folders[newName]) return;
    onUpdateFolders(prev => {
      const next = { ...prev };
      next[newName] = next[oldName].map(app => ({ ...app, category: newName }));
      delete next[oldName];
      return next;
    });
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
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  };

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
            {/* Header: Centered Navigation */}
            <div className="p-8 pb-4 grid grid-cols-1 md:grid-cols-3 items-center border-b border-white/5 gap-4">
              <div className="flex items-center">
                <h2 className="text-3xl font-tech font-black tracking-tighter text-glow uppercase leading-none">ADMIN COMMAND CENTER</h2>
              </div>

              <div className="flex justify-center order-3 md:order-2">
                <nav className="flex items-center gap-1 bg-white/5 rounded-[24px] p-1">
                  <button 
                    onClick={() => switchTab('apps')}
                    className={`px-6 py-2 rounded-[20px] font-sans text-[10px] tracking-widest uppercase transition-all font-bold ${activeTab === 'apps' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-gray-500 hover:text-white'}`}
                  >
                    Applications
                  </button>
                  <button 
                    onClick={() => switchTab('folders')}
                    className={`px-6 py-2 rounded-[20px] font-sans text-[10px] tracking-widest uppercase transition-all font-bold ${activeTab === 'folders' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-gray-500 hover:text-white'}`}
                  >
                    Folders
                  </button>
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

            {/* Sliding Content Body */}
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  key={activeTab}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0 overflow-y-auto p-8 custom-scrollbar"
                  ref={scrollContainerRef}
                >
                  {activeTab === 'apps' ? (
                    <div className="space-y-12">
                      {/* COMPACT FORM */}
                      {viewMode === 'grid' && (
                        <section className="bg-white/5 p-5 rounded-[24px] border border-white/5">
                          <h3 className="text-xs font-sans font-black text-purple-400 tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                            <Plus size={14} /> {editingApp ? 'RECONFIGURE TOOL' : 'ADD AI APP OR TOOL'}
                          </h3>
                          <form onSubmit={editingApp ? handleUpdateApp : handleAddApp} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="md:col-span-1">
                              <input 
                                type="text" 
                                placeholder="Name"
                                className="w-full bg-white/5 border border-white/10 rounded-[24px] px-5 py-3 text-sm font-sans focus:outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-gray-600"
                                value={editingApp ? editingApp.name : newAppName}
                                onChange={(e) => editingApp ? setEditingApp({...editingApp, name: e.target.value}) : setNewAppName(e.target.value)}
                              />
                            </div>
                            <div className="md:col-span-1">
                              <input 
                                type="text" 
                                placeholder="URL"
                                className="w-full bg-white/5 border border-white/10 rounded-[24px] px-5 py-3 text-sm font-sans focus:outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-gray-600"
                                value={editingApp ? editingApp.url : newAppUrl}
                                onChange={(e) => editingApp ? setEditingApp({...editingApp, url: e.target.value}) : setNewAppUrl(e.target.value)}
                              />
                            </div>
                            <div className="md:col-span-1 flex gap-2">
                              <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-[24px] px-4 py-3 text-xs font-sans font-bold text-gray-400 hover:text-white transition-all"
                              >
                                {(editingApp?.logoUrl || newAppLogo) ? <Check size={14} className="text-green-500" /> : <Upload size={14} />}
                                {(editingApp?.logoUrl || newAppLogo) ? 'Logo Set' : 'Logo'}
                              </button>
                              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                              <select 
                                className="w-2/5 bg-white/5 border border-white/10 rounded-[24px] px-4 py-3 text-xs font-sans font-bold appearance-none focus:outline-none focus:border-purple-500/50 transition-all text-white cursor-pointer"
                                value={editingApp ? editingApp.category : newAppFolder}
                                onChange={(e) => editingApp ? setEditingApp({...editingApp, category: e.target.value}) : setNewAppFolder(e.target.value)}
                              >
                                {Object.keys(folders).map(f => <option key={f} value={f} className="bg-[#0f172a]">{f}</option>)}
                              </select>
                            </div>
                            <div className="md:col-span-1 flex gap-2">
                              <button 
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl py-3 rounded-[24px] font-sans font-black text-[10px] tracking-widest uppercase transition-all text-white"
                              >
                                {editingApp ? 'SAVE' : 'ADD'}
                              </button>
                              {(editingApp || newAppLogo) && (
                                <button 
                                  type="button"
                                  onClick={() => editingApp ? setEditingApp(null) : setNewAppLogo(null)}
                                  className="px-4 bg-white/10 hover:bg-white/20 rounded-[24px] transition-all text-white"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                          </form>
                        </section>
                      )}

                      {/* Directory Section */}
                      <div className="space-y-12">
                        {(Object.entries(folders) as [string, AITool[]][]).map(([folderName, tools]) => (
                          <div key={folderName} className="space-y-6">
                            <div className="flex items-center gap-4 px-2">
                               <h3 className="text-3xl font-sans font-black text-white uppercase tracking-tighter leading-none">{folderName}</h3>
                               <div className="h-[1px] flex-1 bg-white/10" />
                               <span className="text-4xl font-sans font-black text-purple-600/40 leading-none">{tools.length}</span>
                            </div>
                            
                            {viewMode === 'grid' ? (
                              <Reorder.Group 
                                axis="y" 
                                values={tools} 
                                onReorder={(newOrder) => onReorderTools(folderName, newOrder)}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                              >
                                {tools.map(tool => (
                                  <Reorder.Item 
                                    key={tool.id} 
                                    value={tool}
                                    className="group flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.07]"
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-3">
                                        <GripVertical size={16} className="text-gray-700 group-hover:text-gray-400 cursor-grab active:cursor-grabbing" />
                                        <div className="w-11 h-11 rounded-[16px] bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden">
                                          {tool.logoUrl ? (
                                            <img src={tool.logoUrl} className="w-full h-full object-contain" />
                                          ) : (
                                            <span className="text-xl">{tool.icon}</span>
                                          )}
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="text-[12px] font-sans font-black text-white tracking-wide uppercase">{tool.name}</h4>
                                        <p className="text-[10px] font-sans font-bold text-gray-500 truncate max-w-[180px]">{new URL(tool.url).hostname}</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => setEditingApp(tool)} className="p-2.5 hover:bg-white/10 rounded-[14px] text-gray-500 hover:text-blue-400 transition-all"><Edit2 size={16}/></button>
                                      <button onClick={() => setConfirmDelete({type: 'app', id: tool.id})} className="p-2.5 hover:bg-white/10 rounded-[14px] text-gray-500 hover:text-red-400 transition-all"><Trash2 size={16}/></button>
                                    </div>
                                  </Reorder.Item>
                                ))}
                              </Reorder.Group>
                            ) : (
                              <div className="space-y-1 pl-4">
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
                      <section className="bg-white/5 p-5 rounded-[24px] border border-white/5">
                        <h3 className="text-xs font-sans font-black text-purple-400 tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                          <FolderPlus size={14} /> NEW SECTOR
                        </h3>
                        <form onSubmit={handleAddFolder} className="flex gap-3">
                          <input 
                            type="text" 
                            placeholder="Sector Identity"
                            className="flex-1 bg-white/5 border border-white/10 rounded-[24px] px-5 py-3 text-sm font-sans focus:outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-gray-600"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                          />
                          <button 
                            type="submit"
                            className="px-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl py-3 rounded-[24px] font-sans font-black text-[10px] tracking-widest uppercase transition-all text-white"
                          >
                            CREATE
                          </button>
                        </form>
                      </section>

                      <div className="space-y-6">
                         <h3 className="text-xs font-sans font-black text-blue-400 tracking-[0.3em] uppercase mb-4">ORBITAL SECTORS</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(Object.entries(folders) as [string, AITool[]][]).map(([name, tools]) => (
                               <div key={name} className="group p-8 bg-white/5 rounded-[32px] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[160px]">
                                  <div className="flex items-start justify-between">
                                     <div className="flex items-center gap-3">
                                        <GripVertical size={16} className="text-gray-700 group-hover:text-gray-500" />
                                        {editingFolder === name ? (
                                           <input 
                                              autoFocus
                                              defaultValue={name}
                                              onBlur={(e) => handleRenameFolder(name, e.target.value)}
                                              onKeyDown={(e) => e.key === 'Enter' && handleRenameFolder(name, e.currentTarget.value)}
                                              className="bg-transparent border-b border-purple-500 focus:outline-none text-white font-sans font-black text-xl uppercase tracking-widest w-full mr-4 rounded-[24px] px-2"
                                           />
                                        ) : (
                                           <h4 className="text-xl font-sans font-black text-white tracking-widest uppercase truncate leading-none">{name}</h4>
                                        )}
                                     </div>
                                     <div className="flex gap-1">
                                        <button onClick={() => setEditingFolder(name)} className="p-2 hover:bg-white/10 rounded-[14px] text-gray-500 hover:text-white transition-all"><Edit2 size={16}/></button>
                                        <button onClick={() => setConfirmDelete({type: 'folder', id: name})} className="p-2 hover:bg-white/10 rounded-[14px] text-gray-500 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                                     </div>
                                  </div>
                                  <div className="flex items-center justify-between mt-8">
                                     <div className="flex -space-x-3">
                                        {tools.slice(0, 5).map(t => (
                                           <div key={t.id} className="w-10 h-10 rounded-[14px] bg-black border border-white/10 flex items-center justify-center overflow-hidden ring-4 ring-black">
                                              {t.logoUrl ? <img src={t.logoUrl} className="w-full h-full object-contain" /> : <span className="text-sm">{t.icon}</span>}
                                           </div>
                                        ))}
                                     </div>
                                     <div className="flex flex-col items-end">
                                        <span className="text-3xl font-sans font-black text-white leading-none">{tools.length}</span>
                                        <span className="text-[9px] font-sans font-bold text-purple-500/60 uppercase tracking-widest">TOOLS</span>
                                     </div>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Confirmation Overlay */}
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
