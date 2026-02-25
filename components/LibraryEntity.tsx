import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { AITool } from '../types';

interface GalaxyEntityProps {
  tool: AITool;
  index: number;
  total: number;
  radius: number;
  searchQuery: string;
  globalRotation: MotionValue<number>;
  onLaunch: (tool: AITool) => void;
}

export const GalaxyEntity: React.FC<GalaxyEntityProps> = ({ tool, index, total, radius, searchQuery, globalRotation, onLaunch }) => {
  const baseAngle = (index / total) * Math.PI * 2;

  // Elliptical path
  const radiusY = radius * 0.75;

  const x = useTransform(globalRotation, (rot: number) => {
    const angle = baseAngle + (rot * Math.PI / 180);
    return Math.cos(angle) * radius;
  });

  const y = useTransform(globalRotation, (rot: number) => {
    const angle = baseAngle + (rot * Math.PI / 180);
    return Math.sin(angle) * radiusY;
  });

  const domain = new URL(tool.url).hostname;
  const logoUrl = tool.logoUrl || `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

  const isMatch = !searchQuery ||
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase());

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onLaunch(tool);
  };

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isMatch ? 1 : 0.05,
        scale: isMatch ? 1 : 0.7
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 18,
        delay: index * 0.03
      }}
    >
      <div className="flex items-center justify-center">
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative group pointer-events-auto"
        >
          <motion.a
            href={tool.url}
            onClick={handleClick}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`
              w-32 h-32 md:w-36 md:h-36 rounded-lg flex flex-col items-center justify-center p-4
              bg-gray-900/60 backdrop-blur-md border border-white/10 shadow-lg
              hover:border-blue-500/50 hover:bg-gray-900/80 transition-all cursor-pointer
            `}
          >
            {/* Asset Icon Container */}
            <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 mb-3 flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden shadow-sm">
              <img
                src={logoUrl}
                alt={tool.name}
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22none%22/><text x=%2250%%22 y=%2250%%22 dy=%22.35em%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-weight=%22bold%22 font-size=%2260%22 fill=%22%236b7280%22>${tool.name.charAt(0)}</text></svg>`;
                }}
              />
            </div>

            {/* Resource Label */}
            <div className="relative z-10 w-full">
              <span className="text-[10px] font-sans font-semibold text-white/90 tracking-wider uppercase text-center line-clamp-2 leading-tight">
                {tool.name}
              </span>
              <div className="mt-1 text-[8px] text-gray-500 font-sans font-medium uppercase tracking-tighter opacity-60">
                Res: {domain.split('.')[0]}
              </div>
            </div>
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};
