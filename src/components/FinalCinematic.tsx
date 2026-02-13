import { motion } from "framer-motion";
import { useMemo } from "react";

const FinalCinematic = () => {
  const hearts = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${8 + Math.random() * 6}s`,
        size: 12 + Math.random() * 16,
      })),
    []
  );

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[800px] h-[800px] rounded-full bg-primary/10 blur-[150px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      {/* Falling hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {hearts.map((h) => (
          <span
            key={h.id}
            className="absolute text-primary/15 animate-drift"
            style={{ left: h.left, bottom: -20, fontSize: h.size, animationDelay: h.delay, animationDuration: h.duration }}
          >
            ♥
          </span>
        ))}
      </div>

      <motion.div
        className="relative z-10 text-center max-w-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="text-6xl mb-6 animate-heartbeat"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          💖
        </motion.div>

        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-6 glow-text leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          You completed every stage…
          <br />
          <span className="text-primary">which means you're officially stuck with me forever ❤️</span>
        </motion.h2>

        <motion.p
          className="text-script text-2xl text-rose-soft glow-text mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          I Love You, endlessly and always 🌹
        </motion.p>

      </motion.div>
    </section>
  );
};

export default FinalCinematic;
