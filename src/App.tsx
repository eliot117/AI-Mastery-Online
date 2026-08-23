import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { Search, Settings, Loader2 } from 'lucide-react';

import { Starfield } from './components/Starfield';
import { FloatingSpaceship } from './components/FloatingSpaceship';
import { GalaxyEntity } from './components/GalaxyEntity';
import { ManageOverlay } from './components/ManageOverlay';
import { SignIn } from './components/SignIn';

import { useAuth } from './hooks/useAuth';
import * as api from './lib/api';
import type { Folder, NewTool, OrbitItem, Tool } from './types';
import { monogramDataUri, resolveLogoSrc } from './lib/safeUrl';

const Booting: React.FC<{ label: string }> = ({ label }) => (
  <div className="relative flex h-screen w-screen items-center justify-center bg-black text-white">
    <Starfield />
    <div className="relative z-10 flex flex-col items-center gap-4">
      <Loader2 size={22} className="animate-spin text-purple-400" />
      <p className="font-tech text-[10px] uppercase tracking-[0.3em] text-gray-500">{label}</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const { user, initializing, signOut } = useAuth();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [activeSubFolderId, setActiveSubFolderId] = useState<string | null>(null);
  const [orbitRadius, setOrbitRadius] = useState(400);
  const [launching, setLaunching] = useState<Tool | null>(null);
  const [isManageOpen, setIsManageOpen] = useState(false);

  const globalRotation = useMotionValue(0);

  // ── Load ───────────────────────────────────────────────────────────────

  const reload = useCallback(async () => {
    const library = await api.fetchLibrary();
    setFolders(library.folders);
    setTools(library.tools);
    return library;
  }, []);

  useEffect(() => {
    if (!user) {
      setLoadingLibrary(false);
      return;
    }
    let active = true;
    setLoadingLibrary(true);
    reload()
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : 'Could not load your library.');
      })
      .finally(() => {
        if (active) setLoadingLibrary(false);
      });
    return () => {
      active = false;
    };
  }, [user, reload]);

  // ── Ambient orbit rotation ─────────────────────────────────────────────

  useEffect(() => {
    const controls = animate(globalRotation, 360, {
      duration: 100,
      repeat: Infinity,
      ease: 'linear',
    });
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

  // ── Derived structure ──────────────────────────────────────────────────

  const topLevelFolders = useMemo(
    () =>
      folders
        .filter((f) => f.parent_folder_id === null)
        .sort((a, b) => a.position - b.position),
    [folders],
  );

  useEffect(() => {
    if (!activeFolderId && topLevelFolders.length) {
      setActiveFolderId(topLevelFolders[0].id);
    }
    if (activeFolderId && !folders.some((f) => f.id === activeFolderId)) {
      setActiveFolderId(topLevelFolders[0]?.id ?? null);
      setActiveSubFolderId(null);
    }
  }, [topLevelFolders, activeFolderId, folders]);

  const subFoldersOf = useCallback(
    (parentId: string) =>
      folders
        .filter((f) => f.parent_folder_id === parentId)
        .sort((a, b) => a.position - b.position),
    [folders],
  );

  const toolsIn = useCallback(
    (folderId: string) =>
      tools.filter((t) => t.folder_id === folderId).sort((a, b) => a.position - b.position),
    [tools],
  );

  const currentItems: OrbitItem[] = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      return tools
        .filter(
          (t) =>
            t.name.toLowerCase().includes(query) ||
            (t.description ?? '').toLowerCase().includes(query),
        )
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((tool): OrbitItem => ({ kind: 'tool', tool }));
    }

    if (activeSubFolderId) {
      const parent = folders.find((f) => f.id === activeSubFolderId)?.parent_folder_id;
      const parentName = folders.find((f) => f.id === parent)?.name ?? 'Back';
      return [
        { kind: 'folder', name: parentName, target: null },
        ...toolsIn(activeSubFolderId).map((tool): OrbitItem => ({ kind: 'tool', tool })),
      ];
    }

    if (!activeFolderId) return [];

    return [
      ...toolsIn(activeFolderId).map((tool): OrbitItem => ({ kind: 'tool', tool })),
      ...subFoldersOf(activeFolderId).map(
        (sub): OrbitItem => ({ kind: 'folder', name: sub.name, target: sub.id }),
      ),
    ];
  }, [searchQuery, tools, activeSubFolderId, activeFolderId, folders, toolsIn, subFoldersOf]);

  // ── Mutations (optimistic, resync on failure) ──────────────────────────

  const run = useCallback(
    async (fn: () => Promise<void>) => {
      setBusy(true);
      setError(null);
      try {
        await fn();
      } catch (e) {
        setError(
          e instanceof Error ? e.message : 'That change did not save. Please try again.',
        );
        await reload().catch(() => undefined);
      } finally {
        setBusy(false);
      }
    },
    [reload],
  );

  const handleCreateTool = useCallback(
    (input: NewTool) =>
      run(async () => {
        const created = await api.createTool(input);
        setTools((prev) => [...prev, created]);
      }),
    [run],
  );

  const handleUpdateTool = useCallback(
    (id: string, patch: Partial<Tool>) =>
      run(async () => {
        const updated = await api.updateTool(id, patch);
        setTools((prev) => prev.map((t) => (t.id === id ? updated : t)));
      }),
    [run],
  );

  const handleDeleteTool = useCallback(
    (id: string) =>
      run(async () => {
        setTools((prev) => prev.filter((t) => t.id !== id));
        await api.deleteTool(id);
      }),
    [run],
  );

  const handleReorderTools = useCallback(
    (orderedIds: string[]) =>
      run(async () => {
        setTools((prev) => {
          const pos = new Map(orderedIds.map((id, i) => [id, i]));
          return prev.map((t) => (pos.has(t.id) ? { ...t, position: pos.get(t.id)! } : t));
        });
        await api.reorderTools(orderedIds);
      }),
    [run],
  );

  const handleMoveTool = useCallback(
    (toolId: string, folderId: string, position: number) =>
      run(async () => {
        setTools((prev) =>
          prev.map((t) => (t.id === toolId ? { ...t, folder_id: folderId, position } : t)),
        );
        const updated = await api.moveToolToFolder(toolId, folderId, position);
        setTools((prev) => prev.map((t) => (t.id === toolId ? updated : t)));
      }),
    [run],
  );

  const handleCreateFolder = useCallback(
    (name: string, parentId: string | null) =>
      run(async () => {
        const siblings = parentId
          ? folders.filter((f) => f.parent_folder_id === parentId)
          : topLevelFolders;
        const created = await api.createFolder({
          name,
          parent_folder_id: parentId,
          position: siblings.length,
        });
        setFolders((prev) => [...prev, created]);
      }),
    [run, folders, topLevelFolders],
  );

  const handleRenameFolder = useCallback(
    (id: string, name: string) =>
      run(async () => {
        const updated = await api.renameFolder(id, name);
        setFolders((prev) => prev.map((f) => (f.id === id ? updated : f)));
      }),
    [run],
  );

  const handleDeleteFolder = useCallback(
    (id: string) =>
      run(async () => {
        // Cascades server-side; mirror it locally so the UI matches.
        const doomed = new Set([id, ...folders.filter((f) => f.parent_folder_id === id).map((f) => f.id)]);
        setFolders((prev) => prev.filter((f) => !doomed.has(f.id)));
        setTools((prev) => prev.filter((t) => !doomed.has(t.folder_id)));
        await api.deleteFolder(id);
      }),
    [run, folders],
  );

  const handleReorderFolders = useCallback(
    (orderedIds: string[]) =>
      run(async () => {
        setFolders((prev) => {
          const pos = new Map(orderedIds.map((id, i) => [id, i]));
          return prev.map((f) => (pos.has(f.id) ? { ...f, position: pos.get(f.id)! } : f));
        });
        await api.reorderFolders(orderedIds);
      }),
    [run],
  );

  /**
   * The anchor itself opens the destination in a new tab — this only logs
   * the click and plays a brief flourish, so popup blockers never see a
   * scripted window open and the tab stays on AI Mastery.
   */
  const handleLaunch = useCallback((tool: Tool) => {
    void api.recordClick(tool.id);
    setLaunching(tool);
    window.setTimeout(() => setLaunching(null), 850);
  }, []);

  const handleLogoClick = () => {
    if (activeSubFolderId) setActiveSubFolderId(null);
    else {
      setActiveFolderId(topLevelFolders[0]?.id ?? null);
      setSearchQuery('');
    }
  };

  // ── Gates ──────────────────────────────────────────────────────────────

  if (initializing) return <Booting label="Restoring session" />;
  if (!user) return <SignIn />;
  if (loadingLibrary) return <Booting label="Loading your galaxy" />;

  const launchingSrc = launching
    ? (resolveLogoSrc(launching.logo_url, launching.url) ?? monogramDataUri(launching.name))
    : null;

  return (
    <div className="relative flex h-screen w-screen select-none flex-col items-center justify-center overflow-hidden bg-black text-white">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <Starfield />
        <motion.div
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-1/4 top-1/4 h-3/4 w-3/4 rounded-full bg-purple-600/10 blur-[240px]"
        />
        <motion.div
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -right-1/4 bottom-1/4 h-3/4 w-3/4 rounded-full bg-blue-600/10 blur-[240px]"
        />
      </div>

      <FloatingSpaceship />

      <div className="relative z-50 flex w-full max-w-lg flex-col items-center px-8">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={handleLogoClick}
          className="pointer-events-auto mb-10 flex cursor-pointer flex-col items-center text-center"
        >
          <span className="animate-gradient bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[length:200%_auto] bg-clip-text font-tech text-7xl font-black leading-[0.85] tracking-tighter text-transparent text-glow md:text-8xl">
            AI
          </span>
          <span className="animate-gradient mr-[-0.4em] mt-2 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[length:200%_auto] bg-clip-text font-tech text-3xl font-bold tracking-[0.4em] text-transparent opacity-90 text-glow md:text-4xl">
            MASTERY
          </span>
        </motion.h1>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="group relative w-full"
        >
          <div className="absolute inset-0 rounded-full bg-purple-500/5 blur-[100px] transition-all group-focus-within:bg-purple-500/20" />
          <div className="relative flex items-center rounded-full border border-white/10 bg-white/5 p-1 pl-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-[60px] transition-all focus-within:border-purple-500/50">
            <Search className="text-purple-400 opacity-60" size={18} strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search your galaxy..."
              aria-label="Search tools"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-none bg-transparent px-4 py-3 font-tech text-base font-light tracking-[0.05em] text-white placeholder:text-gray-700 focus:outline-none"
            />
            <button
              onClick={() => setIsManageOpen(true)}
              aria-label="Manage your library"
              className="group/btn mr-1 flex items-center gap-2 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 px-4 py-2 transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]"
            >
              <Settings
                size={18}
                className="text-white transition-transform duration-500 group-hover/btn:rotate-90"
              />
              <span className="hidden font-tech text-[10px] font-bold uppercase tracking-widest text-white md:block">
                Manage
              </span>
            </button>
          </div>
        </motion.div>

        <motion.nav
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex flex-wrap justify-center gap-2 px-4"
        >
          {topLevelFolders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => {
                setActiveFolderId(folder.id);
                setSearchQuery('');
                setActiveSubFolderId(null);
              }}
              className={`rounded-full border px-4 py-1.5 font-tech text-[9px] font-bold uppercase tracking-[0.3em] backdrop-blur-md transition-all ${
                activeFolderId === folder.id && !searchQuery
                  ? 'border-purple-500/60 bg-white/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                  : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/20 hover:text-white'
              }`}
            >
              {folder.name}
            </button>
          ))}
        </motion.nav>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-10">
          <ellipse
            cx="50%"
            cy="50%"
            rx={orbitRadius}
            ry={orbitRadius * 0.75}
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
        </svg>

        <motion.div
          key={`${activeFolderId}-${activeSubFolderId ?? ''}-${searchQuery ? 'search' : 'browse'}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ opacity: { duration: 0.8 }, scale: { duration: 0.8, type: 'spring' } }}
          className="relative flex h-1 w-1 items-center justify-center"
        >
          <AnimatePresence mode="popLayout">
            {currentItems.map((item, idx) => (
              <GalaxyEntity
                key={item.kind === 'tool' ? item.tool.id : `folder-${item.target ?? 'back'}`}
                item={item}
                index={idx}
                total={currentItems.length}
                radius={orbitRadius}
                searchQuery={searchQuery}
                globalRotation={globalRotation}
                onLaunch={handleLaunch}
                onOpenFolder={(target) => setActiveSubFolderId(target)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {currentItems.length === 0 && !searchQuery && (
        <p className="pointer-events-none absolute bottom-16 z-20 font-tech text-[10px] uppercase tracking-[0.3em] text-gray-600">
          This folder is empty — add a tool from Manage
        </p>
      )}

      <ManageOverlay
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        folders={folders}
        tools={tools}
        busy={busy}
        error={error}
        onCreateTool={handleCreateTool}
        onUpdateTool={handleUpdateTool}
        onDeleteTool={handleDeleteTool}
        onReorderTools={handleReorderTools}
        onMoveTool={handleMoveTool}
        onCreateFolder={handleCreateFolder}
        onRenameFolder={handleRenameFolder}
        onDeleteFolder={handleDeleteFolder}
        onReorderFolders={handleReorderFolders}
        onSignOut={() => void signOut()}
      />

      <AnimatePresence>
        {launching && launchingSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.1, opacity: 1, filter: 'brightness(1) blur(0px)' }}
              animate={{
                scale: 15,
                opacity: [1, 1, 0],
                filter: [
                  'brightness(1) blur(0px)',
                  'brightness(3) blur(10px)',
                  'brightness(10) blur(40px)',
                ],
              }}
              transition={{ duration: 0.8, ease: 'easeIn' }}
              className="relative flex h-40 w-40 items-center justify-center"
            >
              <img
                src={launchingSrc}
                alt=""
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 rounded-full bg-white opacity-50 mix-blend-screen blur-2xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
