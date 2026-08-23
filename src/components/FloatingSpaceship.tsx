import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Ambient spaceship that drifts across the sky on a long, wandering loop.
 *
 * Ported from the abandoned online prototype, where it was written against
 * anime.js and a `/spaceship.png` that was never added to the repo — so it
 * never actually rendered. Rebuilt here on framer-motion (already a
 * dependency) with an inline SVG ship, so it has no external assets to
 * go missing.
 */

const POINTS = 12;

function useViewport() {
  const [size, setSize] = useState(() => ({
    width: typeof window === 'undefined' ? 1440 : window.innerWidth,
    height: typeof window === 'undefined' ? 900 : window.innerHeight,
  }));

  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
}

export const FloatingSpaceship: React.FC = () => {
  const { width, height } = useViewport();
  const prefersReducedMotion = useReducedMotion();

  const { xs, ys, rotations, duration } = useMemo(() => {
    const startX = -160;
    const endX = width + 160;
    const centerY = Math.min(height * 0.32, 300);
    const yRange = Math.min(height * 0.22, 140);

    const xs: number[] = [];
    const ys: number[] = [];

    for (let i = 0; i <= POINTS; i++) {
      const t = i / POINTS;
      xs.push(startX + (endX - startX) * t);

      // Layered sines give a wander that never repeats too obviously.
      const wander =
        Math.sin(t * Math.PI * 2.3) * (yRange * 0.5) +
        Math.sin(t * Math.PI * 3.7 + 1.2) * (yRange * 0.3) +
        Math.sin(t * Math.PI * 5.1 + 0.8) * (yRange * 0.15) +
        Math.cos(t * Math.PI * 4.2 + 2.1) * (yRange * 0.05);

      ys.push(centerY + wander);
    }

    // Nose follows the direction of travel, damped and clamped so the ship
    // banks gently rather than spinning.
    const rotations = xs.map((_, i) => {
      const j = Math.min(i, xs.length - 2);
      const dx = xs[j + 1] - xs[j];
      const dy = ys[j + 1] - ys[j];
      const angle = 20 + (Math.atan2(dy, dx) * 180) / Math.PI * 0.3;
      return Math.max(-15, Math.min(45, angle));
    });

    return { xs, ys, rotations, duration: 22 + width / 100 };
  }, [width, height]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.9, 0.9, 0] }}
      transition={{
        duration,
        times: [0, 0.12, 0.82, 1],
        repeat: Infinity,
        ease: 'linear',
        delay: 1.5,
      }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute"
        style={{ width: 110, willChange: 'transform' }}
        animate={{ x: xs, y: ys, rotate: rotations }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 6px 20px rgba(59,130,246,0.5))' }}
        >
          <svg viewBox="0 0 120 60" className="h-auto w-full">
            <defs>
              <linearGradient id="ship-hull" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e9ecff" />
                <stop offset="55%" stopColor="#9aa6d8" />
                <stop offset="100%" stopColor="#5b6592" />
              </linearGradient>
              <linearGradient id="ship-glass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="ship-thrust" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Engine wash */}
            <ellipse cx="26" cy="34" rx="26" ry="4.5" fill="url(#ship-thrust)" />

            {/* Hull */}
            <path
              d="M40 34c0-9 14-19 38-21 18-1.5 30 3 34 9 -4 6 -16 12.5 -34 14 -24 2 -38 -3 -38 -2z"
              fill="url(#ship-hull)"
            />
            {/* Wing */}
            <path d="M56 36c8 7 20 10 30 8-6 4-20 5-30-3z" fill="#4b5478" opacity="0.85" />
            {/* Canopy */}
            <path
              d="M78 20c9-.8 16 .6 19 4-3 2.6-9.5 4.6-18 5.2-2.5.2-4-1.2-3.6-4.6.3-2.8 1.3-4.4 2.6-4.6z"
              fill="url(#ship-glass)"
            />
            <circle cx="107" cy="24" r="2" fill="#fff" opacity="0.9" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
