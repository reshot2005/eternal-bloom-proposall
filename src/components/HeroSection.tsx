import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSectionProps {
  onEnter: () => void;
}

const ScratchCanvas = ({ onRevealed }: { onRevealed: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const totalPixels = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // Fill with scratch-off coating
    const gradient = ctx.createLinearGradient(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    gradient.addColorStop(0, "hsl(345, 60%, 45%)");
    gradient.addColorStop(1, "hsl(345, 80%, 35%)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Add shimmer pattern
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * canvas.offsetWidth;
      const y = Math.random() * canvas.offsetHeight;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 3 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Add "Scratch here" text
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = `${Math.min(canvas.offsetWidth / 14, 20)}px 'Dancing Script', cursive`;
    ctx.textAlign = "center";
    ctx.fillText("✨ Scratch here! ✨", canvas.offsetWidth / 2, canvas.offsetHeight / 2);

    totalPixels.current = canvas.offsetWidth * canvas.offsetHeight;
  }, []);

  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    // Check percentage scratched
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) cleared++;
    }
    const pct = cleared / (imageData.data.length / 4);
    if (pct > 0.35) onRevealed();
  }, [onRevealed]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const touch = "touches" in e ? e.touches[0] || e.changedTouches[0] : e;
    return { x: (touch as any).clientX - rect.left, y: (touch as any).clientY - rect.top };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDrawing.current = true;
    const { x, y } = getPos(e);
    scratch(x, y);
  };
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    scratch(x, y);
  };
  const handleEnd = () => { isDrawing.current = false; };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair rounded-2xl"
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    />
  );
};

const HeroSection = ({ onEnter }: HeroSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scratched, setScratched] = useState(false);

  const handleEnvelopeClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <motion.section
      className="min-h-screen flex flex-col items-center justify-center px-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Envelope container */}
        <motion.div
          className="relative cursor-pointer"
          onClick={handleEnvelopeClick}
          whileHover={!isOpen ? { scale: 1.03 } : {}}
          animate={!isOpen ? { y: [0, -12, 0] } : { y: 0 }}
          transition={!isOpen ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
          style={{ perspective: 800 }}
        >
          {/* Envelope body */}
          {/* Floating shadow beneath envelope */}
          {!isOpen && (
            <motion.div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-4 rounded-full bg-foreground/5 blur-md"
              animate={{ scaleX: [1, 0.85, 1], opacity: [0.5, 0.3, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          <div
            className="relative w-[320px] h-[220px] sm:w-[400px] sm:h-[260px] rounded-2xl border border-border overflow-hidden"
            style={{
              background: "hsl(var(--card))",
              boxShadow: "0 8px 40px hsl(var(--primary) / 0.15), 0 0 60px hsl(var(--primary) / 0.08)",
            }}
          >
            {/* Inner card content (revealed by scratching) */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10"
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                >
                  <p className="text-script text-xl sm:text-2xl text-rose-soft mb-6 glow-text text-center">
                    A journey through our love story awaits...
                  </p>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEnter();
                    }}
                    className="px-8 py-3 rounded-full text-base font-display font-semibold text-primary-foreground gradient-rose neon-glow transition-all duration-300"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Enter My Heart 💕
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scratch overlay */}
            <AnimatePresence>
              {isOpen && !scratched && (
                <motion.div
                  className="absolute inset-0 z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                >
                  <ScratchCanvas onRevealed={() => setScratched(true)} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Heart icon on sealed envelope */}
            <AnimatePresence>
              {!isOpen && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.4 }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="hsl(var(--primary) / 0.4)">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Envelope flap (triangle) */}
          <motion.div
            className="absolute top-0 left-0 w-full overflow-hidden"
            style={{
              height: "50%",
              transformOrigin: "top center",
              zIndex: isOpen ? 0 : 20,
            }}
            animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <svg
              viewBox="0 0 400 130"
              preserveAspectRatio="none"
              className="w-full h-full"
              style={{ display: "block" }}
            >
              <path
                d="M0,0 L200,130 L400,0 Z"
                fill="hsl(var(--muted))"
                stroke="hsl(var(--border))"
                strokeWidth="1"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Tap hint */}
        <AnimatePresence>
          {!isOpen && (
            <motion.p
              className="mt-8 text-muted-foreground text-sm font-body"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              exit={{ opacity: 0 }}
            >
              Tap to open 💌
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default HeroSection;
