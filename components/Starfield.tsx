
import React from 'react';
import { motion } from 'framer-motion';

export const Starfield: React.FC = () => {
  const stars = Array.from({ length: 250 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 0.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 10
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#000000]">
      {/* Dynamic Nebula Clouds */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-30%] left-[-20%] w-[100%] h-[100%] bg-purple-900/10 blur-[250px] rounded-full" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-30%] right-[-20%] w-[100%] h-[100%] bg-blue-900/10 blur-[250px] rounded-full" 
      />
      
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full opacity-0"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
            boxShadow: star.size > 1.5 ? '0 0 8px white' : 'none'
          }}
          animate={{
            opacity: [0, Math.random() * 0.7 + 0.3, 0],
            scale: star.size > 1.8 ? [1, 1.5, 1] : 1
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};
