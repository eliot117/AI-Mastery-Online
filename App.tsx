import React, { useState, useEffect, useMemo } from 'react';
import { Starfield } from './components/Starfield';
import { GalaxyEntity } from './components/GalaxyEntity';
import { GALAXY_FOLDERS as INITIAL_DATA } from './data';
import { ManageOverlay } from './components/ManageOverlay';
import { Auth } from './components/Auth';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { Search, Settings, LogOut, User as UserIcon, Loader2 } from 'lucide-react';
import { AITool } from './types';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { getFirestore, collection, onSnapshot, query, orderBy, writeBatch, doc } from 'firebase/firestore';

// Environment-safe global variables (No .env)
declare global {
  const __firebase_config: string;
  const __app_id: string | undefined;
  const __initial_auth_token: string | undefined;
}

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
// STRICT FALLBACK: Ensure appId is never null
const appId = (typeof __app_id !== 'undefined' && __app_id) ? __app_id : 'master-galaxy';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { appId };

const STORAGE_KEY = 'ai_mastery_data_v3';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false); // Synchronization state
  const [searchQuery, setSearchQuery] = useState('');
  const [folders, setFolders] = useState<Record<string, AITool[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const folderNames = useMemo(() => Object.keys(folders), [folders]);
  const [activeFolder, setActiveFolder] = useState<string>(folderNames[0] || "Agents");
  const [orbitRadius, setOrbitRadius] = useState(400);
  const [navigatingTo, setNavigatingTo] = useState<AITool | null>(null);
  const [isManageOpen, setIsManageOpen] = useState(false);

  const globalRotation = useMotionValue(0);

  useEffect(() => {
    // Hardware-Level Persistence: Ensure session survives restarts
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    // Auth Listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsSyncing(true); // Show local loading until cloud data 'pops'
      }
      setLoading(false);
    });

    // Auto-Login Sequence (Strict Persistence Rule)
    const initAuth = async () => {
      try {
        const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        if (token) {
          await signInWithCustomToken(auth, token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
        setLoading(false);
      }
    };

    initAuth();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    const controls = animate(globalRotation, 360, {
      duration: 100,
      repeat: Infinity,
      ease: "linear"
    });
    return () => controls.stop();
  }, [globalRotation]);

  // Firestore Sync Logic - Strictly Gated by User
  useEffect(() => {
    if (!user) return;

    // The Auth-to-Firestore Bridge: Construction of requested Path
    const userPath = `artifacts/${appId}/users/${user.uid}/dashboard`;

    const appsRef = collection(db, `${userPath}/apps`);
    const foldersRef = collection(db, `${userPath}/folders`);

    let appsLoaded = false;
    let foldersLoaded = false;

    const checkSyncComplete = () => {
      if (appsLoaded && foldersLoaded) {
        setIsSyncing(false); // Synchronization complete
      }
    };

    // Sync Apps: Merging Firestore apps with DEFAULT_APPS
    const unsubApps = onSnapshot(query(appsRef, orderBy('position', 'asc')), (snapshot) => {
      const userApps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AITool));

      setFolders(prev => {
        const next = { ...prev };
        userApps.forEach(app => {
          const cat = app.category;
          if (!next[cat]) next[cat] = [];

          // Merge logic: ID-based overwrite or append
          const existingIdx = next[cat].findIndex(t => t.id === app.id);
          if (existingIdx !== -1) {
            next[cat][existingIdx] = app;
          } else {
            next[cat].push(app);
          }
        });

        // Ensure positional integrity remains valid after merge
        for (const cat in next) {
          next[cat].sort((a, b) => (a.position || 0) - (b.position || 0));
        }
        return next;
      });

      appsLoaded = true;
      checkSyncComplete();
    }, (err) => {
      console.error("Apps sync error:", err);
      appsLoaded = true;
      checkSyncComplete();
    });

    // Sync Folders
    const unsubFolders = onSnapshot(query(foldersRef, orderBy('position', 'asc')), (snapshot) => {
      setFolders(prev => {
        const next = { ...prev };
        snapshot.docs.forEach(doc => {
          const folderName = doc.id;
          if (!next[folderName]) next[folderName] = [];
        });
        return next;
      });

      foldersLoaded = true;
      checkSyncComplete();
    }, (err) => {
      console.error("Folders sync error:", err);
      foldersLoaded = true;
      checkSyncComplete();
    });

    return () => {
      unsubApps();
      unsubFolders();
    };
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      const minDimension = Math.min(window.innerWidth, window.innerHeight);
      setOrbitRadius(minDimension * 0.52);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentApps = useMemo(() => {
    let tools: AITool[] = [];
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [...(folders[activeFolder] || [])];
    } else {
      tools = (Object.values(folders).flat() as AITool[]).filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      );
      return tools.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [activeFolder, searchQuery, folders]);

  const handleLaunch = (tool: AITool) => {
    setFolders(prev => {
      const next = { ...prev };
      for (const cat in next) {
        const idx = next[cat].findIndex(t => t.id === tool.id);
        if (idx !== -1) {
          next[cat] = [...next[cat]];
          next[cat][idx] = { ...next[cat][idx], clickCount: (next[cat][idx].clickCount || 0) + 1 };
          break;
        }
      }
      return next;
    });

    setNavigatingTo(tool);
    setTimeout(() => {
      window.location.href = tool.url;
    }, 700);
  };

  const handleReorder = async (folderName: string, newTools: AITool[]) => {
    setFolders(prev => ({ ...prev, [folderName]: newTools }));
    if (user) {
      try {
        const batch = writeBatch(db);
        newTools.forEach((tool, idx) => {
          const appRef = doc(db, `artifacts/${appId}/users/${user.uid}/dashboard/apps`, tool.id);
          batch.update(appRef, { position: idx });
        });
        await batch.commit();
      } catch (err) {
        console.error("Reorder tools failed:", err);
      }
    }
  };

  const handleReorderFolders = async (newFolderOrder: string[]) => {
    setFolders(prev => {
      const next: Record<string, AITool[]> = {};
      newFolderOrder.forEach(name => {
        next[name] = prev[name];
      });
      return next;
    });

    if (user) {
      try {
        const batch = writeBatch(db);
        newFolderOrder.forEach((folderName, idx) => {
          const folderRef = doc(db, `artifacts/${appId}/users/${user.uid}/dashboard/folders`, folderName);
          batch.set(folderRef, { name: folderName, position: idx }, { merge: true });
        });
        await batch.commit();
      } catch (err) {
        console.error("Reorder folders failed:", err);
      }
    }
  };

  // LOAD STATES
  if (loading || (user && isSyncing)) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-purple-500" size={48} />
        {isSyncing && (
          <p className="text-xs font-tech font-bold text-purple-400 tracking-[0.3em] uppercase animate-pulse">
            Synchronizing with Galaxy...
          </p>
        )}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-black flex flex-col items-center justify-center select-none text-white">
        <Starfield />
        <div className="relative z-50 flex flex-col items-center">
          <Auth onAuthComplete={() => { }} />
        </div>
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
          <ellipse
            cx="50%" cy="50%"
            rx={orbitRadius}
            ry={orbitRadius * 0.75}
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
        </svg>

        <motion.div
          key={activeFolder + (searchQuery ? '_search' : '_browse') + folderNames.length}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            opacity: { duration: 0.8 },
            scale: { duration: 0.8, type: "spring" }
          }}
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
        onUpdateFolders={setFolders}
        onReorderTools={handleReorder}
        onReorderFolders={handleReorderFolders}
        onSignOut={() => firebaseSignOut(auth)}
        user={user}
      />
      <AnimatePresence>
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
                src={navigatingTo.logoUrl || `https://icon.horse/icon/${new URL(navigatingTo.url).hostname.replace(/^www\./, '')}`}
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
    </div >
  );
};

export default App;