
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AITool } from '../types';

interface ToolCardProps {
  tool: AITool;
  isHero?: boolean;
  searchQuery: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, isHero = false, searchQuery }) => {
  const [isExpanding, setIsExpanding] = React.useState(false);
  const isMatch = useMemo(() => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q);
  }, [searchQuery, tool]);

  // Randomized drift offsets
  const driftX = useMemo(() => [0, (Math.random() - 0.5) * 20, 0], []);
  const driftY = useMemo(() => [0, (Math.random() - 0.5) * 30, 0], []);
  const duration = useMemo(() => 8 + Math.random() * 4, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpanding(true);
    setTimeout(() => {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
      setIsExpanding(false);
    }, 800);
  };

  return (
    <>
      <motion.div
        layout
        animate={{ 
          x: driftX,
          y: driftY,
          opacity: isMatch ? 1 : 0.15,
          scale: isMatch ? 1 : 0.9,
        }}
        transition={{
          x: { duration, repeat: Infinity, ease: "easeInOut" },
          y: { duration: duration * 1.2, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.5 },
          scale: { duration: 0.5 }
        }}
        whileHover={{ 
          scale: 1.15,
          z: 50,
          boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)",
          transition: { duration: 0.2 }
        }}
        onClick={handleClick}
        className={`relative group cursor-pointer ${isMatch && searchQuery ? 'search-pulse' : ''} ${isHero ? 'w-48 h-48' : 'w-36 h-36'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity" />
        
        <div className="glass-card glow-border h-full w-full rounded-3xl border border-white/10 p-4 flex flex-col items-center justify-center text-center">
          <motion.span 
            className={`${isHero ? 'text-5xl' : 'text-3xl'} mb-2`}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            {tool.icon}
          </motion.span>
          <h3 className={`font-display font-medium text-white truncate w-full ${isHero ? 'text-lg' : 'text-sm'}`}>
            {tool.name}
          </h3>
          {isHero && (
            <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-tight px-2">
              {tool.description}
            </p>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            {/* Warp effect */}
            <motion.div 
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 50, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeIn" }}
              className="w-10 h-10 bg-white rounded-full blur-2xl shadow-[0_0_100px_white]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
