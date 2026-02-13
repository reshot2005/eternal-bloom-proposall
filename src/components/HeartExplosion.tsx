import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeartExplosionProps {
  active: boolean;
  onComplete: () => void;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; alpha: number; rotation: number; rotationV: number;
  emoji: string;
}

const EMOJIS = ["❤️", "💕", "💖", "💗", "💝", "🌹", "✨", "🥰"];
const PARTICLE_COUNT = 30;

const HeartExplosion = ({ active, onComplete }: HeartExplosionProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const startedRef = useRef(false);

  const initParticles = useCallback(() => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 18 + Math.random() * 28,
        alpha: 1,
        rotation: Math.random() * 360,
        rotationV: (Math.random() - 0.5) * 8,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      };
    });
  }, []);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      for (const p of particlesRef.current) {
        if (p.alpha <= 0.01) continue;
        alive++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.alpha -= 0.008;
        p.rotation += p.rotationV;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();
      }
      if (alive > 0) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    rafRef.current = requestAnimationFrame(draw);

    const timer = setTimeout(onComplete, 2500);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timer);
    };
  }, [active, onComplete, initParticles]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Quick flash */}
      <motion.div
        className="absolute inset-0 bg-primary/15"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />

      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Center text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h2 className="text-5xl sm:text-7xl font-display font-bold text-primary glow-text">
          You Said Yes! 🥰
        </h2>
      </motion.div>
    </div>
  );
};

export default HeartExplosion;
