import React, { useState, useEffect, useMemo } from 'react';
import { Starfield } from './components/Starfield';
import { GalaxyEntity } from './components/GalaxyEntity';
import { GALAXY_FOLDERS } from './data';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState<string>("Agents");
  const [orbitRadius, setOrbitRadius] = useState(400);

  // Responsive Orbit Radius calculation with collision prevention
  useEffect(() => {
    const handleResize = () => {
      const minDimension = Math.min(window.innerWidth, window.innerHeight);
      // Multiplier ensures large orbital buttons don't collide
      setOrbitRadius(minDimension * 0.52);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentApps = useMemo(() => GALAXY_FOLDERS[activeFolder] || [], [activeFolder]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex flex-col items-center justify-center select-none text-white">
      {/* COSMIC BACKGROUND SYSTEM */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Starfield />
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-600/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-600/5 blur-[200px] rounded-full" />
      </div>

      {/* BRANDING: TOP-LEFT LOGO ASSET */}
      <div className="fixed top-10 left-10 z-[60] pointer-events-none">
        <motion.div 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative w-20 h-20 flex items-center justify-center pointer-events-auto"
        >
          {/* Nebula halo effect for logo depth */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#8b5cf6] to-[#3b82f6] rounded-2xl blur-[15px] opacity-25 animate-pulse" />
          
          {/* Unified Branding Logo Container */}
          <div className="relative z-10 w-full h-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.2)]">
             <img 
               src="/image_57b8a1.jpg" 
               alt="AI Mastery Logo" 
               className="w-full h-full object-cover brightness-110 contrast-110"
             />
          </div>
        </motion.div>
      </div>

      {/* CENTRAL COSMIC INTERFACE */}
      <div className="fixed top-12 left-0 right-0 z-[60] flex justify-center pointer-events-none">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl md:text-3xl font-tech font-black tracking-[0.8em] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[length:200%_auto] animate-gradient text-glow"
        >
          AI MASTERY
        </motion.h1>
      </div>

      {/* SEARCH & FOLDER CONTROLS */}
      <div className="relative z-50 flex flex-col items-center w-full max-w-lg px-8">
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
              onClick={() => setActiveFolder(folderName)}
              className={`
                px-4 py-1.5 rounded-full text-[9px] font-tech font-bold uppercase tracking-[0.3em] transition-all border backdrop-blur-md
                ${activeFolder === folderName 
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
        <motion.div
          key={activeFolder}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{
            opacity: { duration: 0.8 },
            scale: { duration: 0.8, type: "spring" },
            rotate: { duration: 100, repeat: Infinity, ease: "linear" }
          }}
          className="relative w-1 h-1 flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {currentApps.map((tool, idx) => (
              <GalaxyEntity 
                key={tool.id} 
                tool={tool} 
                index={idx} 
                total={currentApps.length} 
                radius={orbitRadius}
                searchQuery={searchQuery}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

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