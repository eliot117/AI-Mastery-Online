import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

interface FloatingSpaceshipProps {
  className?: string;
}

export const FloatingSpaceship: React.FC<FloatingSpaceshipProps> = ({
  className = '',
}) => {
  const spaceshipRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!spaceshipRef.current || !containerRef.current) return;

    const spaceship = spaceshipRef.current;
    const container = containerRef.current;

    const getViewportDimensions = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    let viewport = getViewportDimensions();

    const handleResize = () => {
      viewport = getViewportDimensions();
    };
    window.addEventListener('resize', handleResize);

    const generateOrganicPath = () => {
      const points: { x: number; y: number }[] = [];
      const numPoints = 12;

      const startX = -150;
      const endX = viewport.width + 150;
      const centerY = Math.min(viewport.height * 0.35, 300);
      const yRange = Math.min(viewport.height * 0.25, 150);

      for (let i = 0; i <= numPoints; i++) {
        const progress = i / numPoints;
        const x = startX + (endX - startX) * progress;

        const wave1 = Math.sin(progress * Math.PI * 2.3) * (yRange * 0.5);
        const wave2 = Math.sin(progress * Math.PI * 3.7 + 1.2) * (yRange * 0.3);
        const wave3 = Math.sin(progress * Math.PI * 5.1 + 0.8) * (yRange * 0.15);
        const wave4 = Math.cos(progress * Math.PI * 4.2 + 2.1) * (yRange * 0.05);

        const randomVariation = (Math.random() - 0.5) * (yRange * 0.2);

        const y = centerY + wave1 + wave2 + wave3 + wave4 + randomVariation;

        points.push({ x, y });
      }

      return points;
    };

    const generateRotationPath = (path: { x: number; y: number }[]) => {
      const rotations: number[] = [];

      for (let i = 0; i < path.length - 1; i++) {
        const dx = path[i + 1].x - path[i].x;
        const dy = path[i + 1].y - path[i].y;

        const baseAngle = 20;
        const directionAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const totalRotation = baseAngle + directionAngle * 0.3;

        const clampedRotation = Math.max(-15, Math.min(45, totalRotation));

        rotations.push(clampedRotation);
      }

      rotations.push(rotations[0] ?? 20);

      return rotations;
    };

    const animateSpaceship = () => {
      const path = generateOrganicPath();
      const rotations = generateRotationPath(path);

      const baseDuration = 20000;
      const duration = baseDuration + (viewport.width / 100) * 1000;

      anime({
        targets: spaceship,
        translateX: path.map((p) => p.x),
        translateY: path.map((p) => p.y),
        rotate: rotations,
        duration,
        easing: 'easeInOutQuad',
        loop: false,
        complete: () => {
          animateSpaceship();
        },
      });

      anime({
        targets: spaceship,
        translateY: '+=8',
        direction: 'alternate',
        duration: 2800,
        easing: 'easeInOutSine',
        loop: true,
      });

      anime({
        targets: container,
        opacity: [
          { value: 0, duration: 0 },
          { value: 0.9, duration: 2500 },
          { value: 0.9, duration: duration - 5500 },
          { value: 0, duration: 3000 },
        ],
        duration,
        easing: 'linear',
        loop: false,
      });

      anime({
        targets: spaceship,
        scale: [1, 1.03, 1],
        duration: 3500,
        easing: 'easeInOutSine',
        loop: true,
      });
    };

    const startDelay = window.setTimeout(() => {
      animateSpaceship();
    }, 500);

    return () => {
      window.clearTimeout(startDelay);
      window.removeEventListener('resize', handleResize);
      anime.remove(spaceship);
      anime.remove(container);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-10 ${className}`}
      style={{ opacity: 0 }}
    >
      <img
        ref={spaceshipRef}
        src="/spaceship.png"
        alt=""
        className="absolute"
        style={{
          width: '120px',
          height: 'auto',
          filter: 'drop-shadow(0 6px 20px rgba(59, 130, 246, 0.5))',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      />
    </div>
  );
};

