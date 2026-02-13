import React, { useState, useEffect, useMemo } from 'react';
import { Starfield } from './components/Starfield';
import { GalaxyEntity } from './components/GalaxyEntity';
import { GALAXY_FOLDERS } from './data';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { AITool } from './types';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState<string>("Agents");
  const [orbitRadius, setOrbitRadius] = useState(400);
  const [navigatingTo, setNavigatingTo] = useState<AITool | null>(null);
  
  // Driving the rotation via a MotionValue allows for high-performance elliptical math in children
  const globalRotation = useMotionValue(0);

  useEffect(() => {
    // Maintain the exact same orbital speed (100s per rotation)
    const controls = animate(globalRotation, 360, {
      duration: 100,
      repeat: Infinity,
      ease: "linear"
    });
    return () => controls.stop();
  }, [globalRotation]);

  // Responsive Orbit Radius calculation
  useEffect(() => {
    const handleResize = () => {
      const minDimension = Math.min(window.innerWidth, window.innerHeight);
      setOrbitRadius(minDimension * 0.52);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global search logic: query all individual apps across entire database if searching
  const currentApps = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return GALAXY_FOLDERS[activeFolder] || [];
    }

    // Flatten all categories to search globally
    const allTools = Object.values(GALAXY_FOLDERS).flat();
    return allTools.filter(tool => 
      tool.name.toLowerCase().includes(query) || 
      tool.description.toLowerCase().includes(query)
    );
  }, [activeFolder, searchQuery]);

  const handleLaunch = (tool: AITool) => {
    setNavigatingTo(tool);
    // Timed redirect to peak of animation
    setTimeout(() => {
      window.location.href = tool.url;
    }, 700);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex flex-col items-center justify-center select-none text-white">
      {/* COSMIC BACKGROUND SYSTEM */}
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

      {/* SEARCH & FOLDER CONTROLS CONTAINER */}
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
          
          <div className="relative flex items-center bg-white/5 backdrop-blur-[60px] rounded-full border border-white/10 p-1 pl-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)] focus-within:border-purple-500/50 transition-all">
            <Search className="text-purple-400 opacity-60" size={18} strokeWidth={1.5} />
            <input 
              type="text" 
              placeholder="Search cosmic intelligence..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none py-3 px-4 text-white focus:outline-none placeholder:text-gray-700 tracking-[0.05em] text-base font-light font-tech"
            />
            <button className="mr-1 p-2.5 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all flex items-center justify-center">
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>
        </motion.div>

        <motion.nav 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex flex-wrap justify-center gap-2 px-4"
        >
          {Object.keys(GALAXY_FOLDERS).map((folderName) => (
            <button
              key={folderName}
              onClick={() => {
                setActiveFolder(folderName);
                setSearchQuery(''); // Clear search when switching folders to reset view
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

      {/* GALAXY ORBITAL RENDERING SYSTEM */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Visual Orbital Path - Height updated to multiplier 0.75 for vertical stretch */}
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
          key={activeFolder + (searchQuery ? '_search' : '_browse')}
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

      {/* EXPLOSION & EXPAND TRANSITION OVERLAY */}
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
                src={navigatingTo.logoUrl || `https://www.google.com/s2/favicons?sz=128&domain=${new URL(navigatingTo.url).hostname}`}
                alt=""
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Fallback glow if logo fails or for extra explosion effect */}
              <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-50 mix-blend-screen" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
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