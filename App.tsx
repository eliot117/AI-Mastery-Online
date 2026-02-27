import React, { useState, useEffect, useMemo } from 'react';
import { Starfield } from './components/Starfield';
import { GalaxyEntity } from './components/GalaxyEntity';
import { ManageOverlay } from './components/ManageOverlay';
import { Auth } from './components/Auth';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { Search, Settings, Loader2 } from 'lucide-react';
import { AITool } from './types';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, query, where, orderBy, getDocs, serverTimestamp
} from 'firebase/firestore';
import {
  getAuth, signInAnonymously, onAuthStateChanged, signOut as firebaseSignOut,
  setPersistence, browserLocalPersistence
} from 'firebase/auth';
import { KIMI_AI_LOGO } from './data';

// Global Configs
const firebaseConfig = (window as any).__firebase_config || {};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Persistence: Use browserLocalPersistence to stay active on tab switch
setPersistence(auth, browserLocalPersistence).catch(console.error);

// Public Fallback Assets (Always visible during loading)
const DEFAULT_APPS: AITool[] = [
  { id: 'fallback-1', name: 'Zero GPT', url: 'https://www.zerogpt.com/', description: 'AI Detector', category: 'Agents', icon: 'Z' },
  { id: 'fallback-2', name: 'Kimi AI', url: 'https://www.kimi.com/', description: 'Long-context AI', category: 'Agents', icon: 'K', logoUrl: 'https://statics.moonshot.cn/kimi-chat/logo.png' }
];

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Public Fallback: Initialize with defaults immediately so screen isn't empty
  const [folders, setFolders] = useState<Record<string, AITool[]>>({
    "Agents": DEFAULT_APPS
  });

  const folderNames = useMemo(() => Object.keys(folders), [folders]);
  const [activeFolder, setActiveFolder] = useState<string>("Agents");
  const [orbitRadius, setOrbitRadius] = useState(400);
  const [navigatingTo, setNavigatingTo] = useState<AITool | null>(null);
  const [isManageOpen, setIsManageOpen] = useState(false);

  const globalRotation = useMotionValue(0);

  // Explicit Sync Bridge Fix: Forced global path strictly for apps
  const getPaths = () => {
    if (!user?.uid) return null;
    const rootPath = `artifacts/master-galaxy/users/${user.uid}`;
    return {
      userApps: `${rootPath}/apps`,
      userFolders: `${rootPath}/folders`,
      publicApps: `artifacts/master-galaxy/public/data/apps`
    };
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        console.log("ACTIVE_ID:", firebaseUser.uid);
      }
      if (!firebaseUser) {
        signInAnonymously(auth).catch(console.error);
      }
      setLoading(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const paths = getPaths();
    if (!paths) return;

    // Bridge Logic: Explicit logs to confirm shared pathing
    console.log('ACTIVE_ID:', user.uid);
    console.log('PATH_USED:', paths.userApps);

    const qPublic = collection(db, paths.publicApps);
    const qPrivate = collection(db, paths.userApps);
    // Order by createdAt asc so new folders always append to the bottom
    const qFolders = query(collection(db, paths.userFolders), orderBy('createdAt', 'asc'));

    let publicAppsData: AITool[] = [];
    let privateAppsData: AITool[] = [];
    let foldersData: string[] = [];

    const updateState = () => {
      const combined: Record<string, AITool[]> = {};
      foldersData.forEach(name => { combined[name] = []; });
      if (!combined["Agents"]) combined["Agents"] = [];

      let appsToGroup = [...publicAppsData, ...privateAppsData];

      // Merge with DEFAULT_APPS to ensure they are always visible
      DEFAULT_APPS.forEach(defaultApp => {
        if (!appsToGroup.find(a => a.id === defaultApp.id)) {
          appsToGroup.push(defaultApp);
        }
      });

      appsToGroup.forEach(app => {
        const cat = app.category || "Agents";
        if (!combined[cat]) combined[cat] = [];
        if (!combined[cat].find(a => a.id === app.id)) {
          combined[cat].push(app);
        }
      });

      setFolders(combined);
    };

    const unsubPublic = onSnapshot(qPublic, (snap) => {
      publicAppsData = snap.docs.map(d => ({ id: d.id, ...d.data() } as AITool));
      updateState();
    });

    const unsubPrivate = onSnapshot(qPrivate, (snap) => {
      privateAppsData = snap.docs.map(d => ({ id: d.id, ...d.data() } as AITool));
      updateState();
    });

    const unsubFolders = onSnapshot(qFolders, (snap) => {
      foldersData = snap.docs.map(d => d.data().name);
      updateState();
    });

    return () => {
      unsubPublic();
      unsubPrivate();
      unsubFolders();
    };
  }, [user]);

  const currentApps = useMemo(() => {
    let tools: AITool[] = [];
    const queryStr = searchQuery.trim().toLowerCase();
    if (!queryStr) {
      return [...(folders[activeFolder] || [])];
    } else {
      tools = (Object.values(folders).flat() as AITool[]).filter(tool =>
        (tool.name || '').toLowerCase().includes(queryStr) ||
        (tool.description || '').toLowerCase().includes(queryStr)
      );
      return tools.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
  }, [activeFolder, searchQuery, folders]);

  const handleLaunch = async (tool: AITool) => {
    const paths = getPaths();
    if (paths && tool.id && !tool.id.startsWith('fallback-')) {
      const docRef = doc(db, paths.userApps, tool.id);
      try {
        await updateDoc(docRef, { clickCount: (tool.clickCount || 0) + 1, updatedAt: serverTimestamp() });
      } catch (e) { }
    }
    setNavigatingTo(tool);
    setTimeout(() => {
      window.location.href = tool.url || '#';
    }, 700);
  };

  const handleAddApp = async (appData: Omit<AITool, 'id'>) => {
    if (!auth.currentUser?.uid) return;
    if (!appData.name.trim() || !appData.url.trim()) return;

    const paths = getPaths();
    if (!paths) return;

    await addDoc(collection(db, paths.userApps), {
      ...appData,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  };

  const handleUpdateApp = async (id: string, appData: Partial<AITool>) => {
    const paths = getPaths();
    if (!paths) return;
    await updateDoc(doc(db, paths.userApps, id), {
      ...appData,
      updatedAt: serverTimestamp()
    });
  };

  const handleDeleteApp = async (id: string) => {
    const paths = getPaths();
    if (!paths) return;
    await deleteDoc(doc(db, paths.userApps, id));
  };

  const handleAddFolder = async (name: string) => {
    if (!auth.currentUser?.uid || !name.trim()) return;
    const paths = getPaths();
    if (!paths) return;
    await addDoc(collection(db, paths.userFolders), {
      name: name.trim(),
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  };

  const handleDeleteFolder = async (name: string) => {
    const paths = getPaths();
    if (!paths) return;
    const snap = await getDocs(query(collection(db, paths.userFolders), where('name', '==', name)));
    snap.forEach(async (d) => await deleteDoc(doc(db, paths.userFolders, d.id)));
  };

  const handleRenameFolder = async (oldName: string, newName: string) => {
    if (!newName.trim()) return;
    const paths = getPaths();
    if (!paths) return;
    const snap = await getDocs(query(collection(db, paths.userFolders), where('name', '==', oldName)));
    snap.forEach(async (d) => await updateDoc(doc(db, paths.userFolders, d.id), { name: newName.trim(), updatedAt: serverTimestamp() }));

    const snapApps = await getDocs(query(collection(db, paths.userApps), where('category', '==', oldName)));
    snapApps.forEach(async (d) => await updateDoc(doc(db, paths.userApps, d.id), { category: newName.trim(), updatedAt: serverTimestamp() }));
  };

  const handleReorder = (folderName: string, newTools: AITool[]) => {
    setFolders(prev => ({ ...prev, [folderName]: newTools }));
  };

  useEffect(() => {
    const controls = animate(globalRotation, 360, { duration: 100, repeat: Infinity, ease: "linear" });
    return () => controls.stop();
  }, [globalRotation]);

  useEffect(() => {
    const handleResize = () => {
      const minDimension = Math.min(window.innerWidth, window.innerHeight);
      setOrbitRadius(minDimension * 0.52);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex flex-col items-center justify-center select-none text-white">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Starfield />
        <motion.div
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-1/4 w-3/4 h-3/4 bg-purple-600/10 blur-[240px] rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 -right-1/4 w-3/4 h-3/4 bg-blue-600/10 blur-[240px] rounded-full"
        />
      </div>

      <div className="relative z-50 flex flex-col items-center w-full max-w-lg px-8">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center mb-10 text-center pointer-events-none"
        >
          <span className="text-7xl md:text-8xl font-tech font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[length:200%_auto] animate-gradient text-glow leading-[0.85]">
            AI
          </span>
          <span className="text-3xl md:text-4xl font-tech font-bold tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[length:200%_auto] animate-gradient text-glow opacity-90 mt-2 mr-[-0.4em]">
            MASTERY
          </span>
        </motion.h1>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full relative group"
        >
          <div className="absolute inset-0 bg-purple-500/5 blur-[100px] group-focus-within:bg-purple-500/20 transition-all rounded-full" />
          <div className="relative flex items-center bg-white/5 backdrop-blur-[60px] rounded-full border border-white/10 p-1 shadow-[0_20px_60px_rgba(0,0,0,0.7)] focus-within:border-purple-500/50 transition-all">
            <Search className="absolute left-6 text-purple-400 opacity-60 pointer-events-none" size={24} strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search the galaxy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none py-3 pl-16 pr-4 text-white focus:outline-none placeholder:text-gray-700 tracking-[0.05em] text-base font-light font-tech"
            />
            <button
              onClick={() => setIsManageOpen(true)}
              className="mr-1 px-4 py-2 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all flex items-center gap-2 group/btn"
            >
              <Settings size={18} className="text-white group-hover/btn:rotate-90 transition-transform duration-500" />
              <span className="text-[10px] font-tech font-bold tracking-widest uppercase text-white hidden md:block">Manage</span>
            </button>
          </div>
        </motion.div>

        <motion.nav
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex flex-wrap justify-center gap-2 px-4"
        >
          {folderNames.map((folderName) => (
            <button
              key={folderName}
              onClick={() => {
                setActiveFolder(folderName);
                setSearchQuery('');
              }}
              className={`
                px-4 py-1.5 rounded-full text-[9px] font-tech font-bold uppercase tracking-[0.3em] transition-all border backdrop-blur-md
                ${activeFolder === folderName && !searchQuery
                  ? 'bg-white/10 border-purple-500/60 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                  : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:border-white/20'}
              `}
            >
              {folderName}
            </button>
          ))}
        </motion.nav>
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
          <ellipse cx="50%" cy="50%" rx={orbitRadius} ry={orbitRadius * 0.75} fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 8" />
        </svg>

        <motion.div
          key={activeFolder + (searchQuery ? '_search' : '_browse') + folderNames.length}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ opacity: { duration: 0.8 }, scale: { duration: 0.8, type: "spring" } }}
          className="relative w-1 h-1 flex items-center justify-center"
        >
          <AnimatePresence mode="popLayout">
            {currentApps.map((tool, idx) => (
              <GalaxyEntity
                key={tool.id}
                tool={tool}
                index={idx}
                total={currentApps.length}
                radius={orbitRadius}
                searchQuery={searchQuery}
                globalRotation={globalRotation}
                onLaunch={handleLaunch}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ManageOverlay
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        folders={folders}
        onAddApp={handleAddApp}
        onUpdateApp={handleUpdateApp}
        onDeleteApp={handleDeleteApp}
        onAddFolder={handleAddFolder}
        onDeleteFolder={handleDeleteFolder}
        onRenameFolder={handleRenameFolder}
        onReorderTools={handleReorder}
        onSignOut={() => setShowAuth(true)}
      />

      <AnimatePresence>
        {showAuth && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuth(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <Auth onAuthComplete={() => setShowAuth(false)} />
          </div>
        )}

        {navigatingTo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.1, opacity: 1, filter: 'brightness(1) blur(0px)' }}
              animate={{
                scale: 15,
                opacity: [1, 1, 0],
                filter: ['brightness(1) blur(0px)', 'brightness(3) blur(10px)', 'brightness(10) blur(40px)']
              }}
              transition={{ duration: 0.8, ease: "easeIn" }}
              className="relative w-40 h-40 flex items-center justify-center"
            >
              <img
                src={navigatingTo.logoUrl || (navigatingTo.url ? `https://www.google.com/s2/favicons?sz=128&domain=${new URL(navigatingTo.url).hostname}` : '')}
                alt=""
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-50 mix-blend-screen" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 5s ease infinite;
        }
      `}} />
    </div>
  );
};

export default App;