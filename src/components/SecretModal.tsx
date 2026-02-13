import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SecretModalProps {
  secret: string | null;
  onDismiss: () => void;
}

const SecretModal = ({ secret, onDismiss }: SecretModalProps) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!secret) { setDisplayed(""); return; }
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      if (i <= secret.length) {
        setDisplayed(secret.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [secret]);

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 4 + Math.random() * 8,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
      })),
    []
  );

  const confetti = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: ["hsl(345,100%,59%)", "hsl(345,100%,77%)", "hsl(38,90%,65%)", "hsl(345,80%,85%)", "hsl(0,0%,100%)"][i % 5],
        size: 6 + Math.random() * 6,
        delay: Math.random() * 1.5,
        duration: 2 + Math.random() * 2,
        swayX: (Math.random() - 0.5) * 80,
        rotation: Math.random() * 720 - 360,
      })),
    []
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 80}%`,
        delay: Math.random() * 1.5,
      })),
    []
  );

  return (
    <AnimatePresence>
      {secret && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
        >
          {/* Dark overlay with animated gradient */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at 50% 50%, hsl(345 80% 20% / 0.9) 0%, hsl(340 30% 6% / 0.95) 70%)",
            }}
            animate={{
              background: [
                "radial-gradient(circle at 50% 50%, hsl(345 80% 20% / 0.9) 0%, hsl(340 30% 6% / 0.95) 70%)",
                "radial-gradient(circle at 40% 60%, hsl(345 80% 25% / 0.9) 0%, hsl(340 30% 6% / 0.95) 70%)",
                "radial-gradient(circle at 60% 40%, hsl(345 80% 20% / 0.9) 0%, hsl(340 30% 6% / 0.95) 70%)",
                "radial-gradient(circle at 50% 50%, hsl(345 80% 20% / 0.9) 0%, hsl(340 30% 6% / 0.95) 70%)",
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          {/* Floating light orbs */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                background: `radial-gradient(circle, hsl(345 100% 70% / 0.8), hsl(345 100% 59% / 0))`,
                boxShadow: `0 0 ${p.size * 2}px hsl(345 100% 59% / 0.4)`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, -15, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Sparkle stars */}
          {sparkles.map((s) => (
            <motion.div
              key={`s-${s.id}`}
              className="absolute text-yellow-200/60"
              style={{ left: s.left, top: s.top, fontSize: 12 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], rotate: [0, 180, 360] }}
              transition={{ duration: 2, repeat: Infinity, delay: s.delay }}
            >
              ✦
            </motion.div>
          ))}

          {/* Confetti rain */}
          {confetti.map((c) => (
            <motion.div
              key={`c-${c.id}`}
              className="absolute rounded-sm"
              style={{
                left: c.left,
                top: -10,
                width: c.size,
                height: c.size * 1.5,
                backgroundColor: c.color,
              }}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{
                y: ["0vh", "100vh"],
                x: [0, c.swayX, 0],
                rotate: [0, c.rotation],
                opacity: [1, 1, 0.6],
              }}
              transition={{
                duration: c.duration,
                repeat: Infinity,
                delay: c.delay,
                ease: "linear",
              }}
            />
          ))}

          {/* Card */}
          <motion.div
            className="relative max-w-md w-full text-center overflow-hidden rounded-2xl border border-white/10"
            style={{
              background: "linear-gradient(135deg, hsl(345 60% 15% / 0.9) 0%, hsl(340 40% 10% / 0.95) 50%, hsl(345 50% 18% / 0.9) 100%)",
              boxShadow: "0 0 60px hsl(345 100% 59% / 0.3), 0 0 120px hsl(345 100% 59% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.1)",
            }}
            initial={{ scale: 0.5, opacity: 0, rotateX: -15 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateX: 15 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Inner glow */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, hsl(345 100% 59% / 0.15) 0%, transparent 60%)",
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Shimmer line */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.08) 45%, hsl(0 0% 100% / 0.12) 50%, hsl(0 0% 100% / 0.08) 55%, transparent 60%)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />

            <div className="relative z-10 p-8 sm:p-10">
              {/* Animated emoji */}
              <motion.div
                className="text-4xl mb-5"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🤫
              </motion.div>

              <motion.h3
                className="font-display text-2xl font-bold mb-5"
                style={{
                  background: "linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(345 100% 80%) 50%, hsl(38 90% 75%) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Secret Unlocked ✨
              </motion.h3>

              <p
                className="text-xl font-script min-h-[2.5em] leading-relaxed"
                style={{
                  color: "hsl(345 100% 85%)",
                  textShadow: "0 0 20px hsl(345 100% 70% / 0.5), 0 0 40px hsl(345 100% 59% / 0.3)",
                }}
              >
                "{displayed}"
                {displayed.length < (secret?.length || 0) && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    |
                  </motion.span>
                )}
              </p>

              <motion.button
                className="mt-8 px-8 py-3 rounded-full font-display text-sm font-bold relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, hsl(345 100% 59%) 0%, hsl(345 100% 70%) 50%, hsl(345 100% 59%) 100%)",
                  color: "white",
                  boxShadow: "0 0 20px hsl(345 100% 59% / 0.4), 0 4px 15px hsl(345 100% 59% / 0.3)",
                }}
                whileHover={{ scale: 1.08, boxShadow: "0 0 30px hsl(345 100% 59% / 0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onDismiss}
              >
                Continue ❤️
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SecretModal;
