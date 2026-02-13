import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProposalSectionProps {
  onYes: () => void;
}

const noTexts = [
  "No 💔",
  "Are you sure? 🥺",
  "Think again 😏",
  "Pretty please? 🌹",
  "Don't break my heart 💗",
  "I'll cry 😢",
  "One more chance? 🥹",
  "Really really?? 😭",
];

const ProposalSection = ({ onYes }: ProposalSectionProps) => {
  const [noIndex, setNoIndex] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);
  const [noRotation, setNoRotation] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const [typedText, setTypedText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const fullText = "Will You Be My Valentine?";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleNo = useCallback(() => {
    setNoIndex((prev) => Math.min(prev + 1, noTexts.length - 1));
    setYesScale((prev) => prev + 0.2);
    setNoScale((prev) => Math.max(prev - 0.08, 0.5));
    setNoRotation((prev) => prev + (Math.random() > 0.5 ? 15 : -15));

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setNoPos({
        x: (Math.random() - 0.5) * (rect.width - 160),
        y: (Math.random() - 0.5) * (rect.height * 0.3),
      });
    }
  }, []);

  return (
    <motion.section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Spotlight effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="relative z-10 text-center">
        {/* Typewriter text */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-4 glow-text min-h-[1.5em]">
          {typedText}
          <motion.span
            className="text-primary"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            |
          </motion.span>
        </h2>

        <motion.p
          className="text-script text-xl text-rose-soft mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          Choose wisely... 💕
        </motion.p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-6 relative min-h-[80px]">
          <motion.button
            onClick={onYes}
            className="px-10 py-4 rounded-full font-display font-bold text-primary-foreground gradient-rose neon-glow"
            animate={{ scale: yesScale }}
            whileHover={{ scale: yesScale * 1.05 }}
            whileTap={{ scale: yesScale * 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            YES ❤️
          </motion.button>

          <motion.button
            onClick={handleNo}
            className="px-8 py-4 rounded-full font-display font-semibold border border-border bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            animate={{
              x: noPos.x,
              y: noPos.y,
              scale: noScale,
              rotate: noRotation,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {noTexts[noIndex]}
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

export default ProposalSection;
