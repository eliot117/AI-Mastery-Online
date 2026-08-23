import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const ShootingStar: React.FC<{ delay: number; top: string; left: string }> = ({
  delay,
  top,
  left,
}) => (
  <motion.div
    initial={{ x: 0, y: 0, opacity: 0, scaleX: 0 }}
    animate={{
      x: [0, 400],
      y: [0, 400],
      opacity: [0, 1, 0.8, 0],
      scaleX: [0, 1.2, 1, 0],
    }}
    transition={{
      duration: 1.2,
      repeat: Infinity,
      repeatDelay: 6 + Math.random() * 4,
      delay,
      ease: 'linear',
    }}
    className="pointer-events-none absolute z-0 h-[1px] w-[40px] origin-left rotate-45 bg-gradient-to-r from-transparent via-white to-transparent"
    style={{ top, left }}
  />
);

interface Nebula {
  id: string;
  color: string;
  size: string;
  delay: number;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
}

export const Starfield: React.FC = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 500 }).map((_, i) => {
        const p = Math.random();
        let size = 0.5 + Math.random() * 0.5; // Small: 70%
        let glow = false;

        if (p > 0.9) {
          size = 2.5 + Math.random() * 1.0; // Large: 10%
          glow = true;
        } else if (p > 0.7) {
          size = 1.5 + Math.random() * 0.5; // Medium: 20%
        }

        const colorRoll = Math.random();
        let color = '#ffffff';
        if (colorRoll > 0.9) color = '#e0f2fe';
        else if (colorRoll > 0.8) color = '#f5f3ff';

        return {
          id: i,
          size,
          x: Math.random() * 100,
          y: Math.random() * 100,
          color,
          glow,
          duration: 2 + Math.random() * 4,
          delay: Math.random() * 10,
        };
      }),
    [],
  );

  const nebulas = useMemo<Nebula[]>(
    () => [
      { id: 'n1', color: '#7c3aed', top: '-10%', left: '-5%', size: '70%', delay: 0 },
      { id: 'n2', color: '#2563eb', bottom: '-15%', right: '-10%', size: '80%', delay: 4 },
      { id: 'n3', color: '#7c3aed', top: '15%', right: '5%', size: '50%', delay: 8 },
      { id: 'n4', color: '#2563eb', bottom: '5%', left: '0%', size: '60%', delay: 12 },
    ],
    [],
  );

  const shootingStars = useMemo(
    () => [
      { id: 's1', delay: 0, top: '10%', left: '20%' },
      { id: 's2', delay: 4, top: '40%', left: '5%' },
      { id: 's3', delay: 8, top: '5%', left: '60%' },
    ],
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
      {nebulas.map((neb) => (
        <motion.div
          key={neb.id}
          animate={{ opacity: [0.02, 0.08, 0.02] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: neb.delay }}
          className="absolute rounded-full blur-[180px]"
          style={{
            backgroundColor: neb.color,
            width: neb.size,
            height: neb.size,
            top: neb.top,
            left: neb.left,
            bottom: neb.bottom,
            right: neb.right,
          }}
        />
      ))}

      {shootingStars.map((s) => (
        <ShootingStar key={s.id} delay={s.delay} top={s.top} left={s.left} />
      ))}

      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
            backgroundColor: star.color,
            boxShadow: star.glow ? `0 0 8px ${star.color}` : 'none',
          }}
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: [0.2, 1.0, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
