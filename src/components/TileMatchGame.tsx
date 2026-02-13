import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLove } from "@/context/LoveContext";

import tileSunset from "@/assets/tile-sunset.jpg";
import tileCoffee from "@/assets/tile-coffee.jpg";
import tileGarden from "@/assets/tile-garden.jpg";
import tileStars from "@/assets/tile-stars.jpg";
import tileParis from "@/assets/tile-paris.jpg";
import tileBeach from "@/assets/tile-beach.jpg";
import tileFerris from "@/assets/tile-ferris.jpg";
import tileCabin from "@/assets/tile-cabin.jpg";

const CARD_IMAGES = [
  { src: tileSunset, label: "Sunset" },
  { src: tileCoffee, label: "Coffee" },
  { src: tileGarden, label: "Garden" },
  { src: tileStars, label: "Stars" },
  { src: tileParis, label: "Paris" },
  { src: tileBeach, label: "Beach" },
  { src: tileFerris, label: "Ferris Wheel" },
  { src: tileCabin, label: "Cabin" },
];

interface Card {
  id: number;
  pairId: number;
  src: string;
  label: string;
  flipped: boolean;
  matched: boolean;
}

const TileMatchGame = () => {
  const { completeTileMatch, tileMatchCompleted } = useLove();
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const initGame = useCallback(() => {
    const pairs = CARD_IMAGES.flatMap((img, i) => [
      { id: i * 2, pairId: i, src: img.src, label: img.label, flipped: false, matched: false },
      { id: i * 2 + 1, pairId: i, src: img.src, label: img.label, flipped: false, matched: false },
    ]).sort(() => Math.random() - 0.5);
    setCards(pairs);
    setSelected([]);
    setMoves(0);
    setTimer(0);
    setStarted(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => { initGame(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [initGame]);

  useEffect(() => {
    if (started && !tileMatchCompleted) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [started, tileMatchCompleted]);

  const handleFlip = useCallback((idx: number) => {
    if (tileMatchCompleted || selected.length >= 2) return;
    const card = cards[idx];
    if (card.flipped || card.matched) return;
    if (!started) setStarted(true);

    const newCards = cards.map((c, i) => (i === idx ? { ...c, flipped: true } : c));
    const newSelected = [...selected, idx];
    setCards(newCards);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSelected;
      if (newCards[a].pairId === newCards[b].pairId) {
        setTimeout(() => {
          setCards((prev) => {
            const updated = prev.map((c, i) =>
              i === a || i === b ? { ...c, matched: true } : c
            );
            if (updated.every((c) => c.matched)) {
              if (timerRef.current) clearInterval(timerRef.current);
              setTimeout(completeTileMatch, 600);
            }
            return updated;
          });
          setSelected([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)));
          setSelected([]);
        }, 900);
      }
    }
  }, [cards, selected, started, tileMatchCompleted, completeTileMatch]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <section className="py-16 px-6">
      <motion.h2
        className="text-3xl sm:text-4xl font-display font-bold text-center mb-2 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Stage 2: Memory Match 🧩
      </motion.h2>
      <p className="text-script text-lg text-rose-soft text-center mb-6 glow-text">
        Match all photo pairs to unlock the next stage
      </p>

      {tileMatchCompleted ? (
        <motion.div className="text-center" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <div className="text-5xl mb-3">✅</div>
          <p className="font-display text-xl text-primary font-bold">Completed in {moves} moves!</p>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6 text-sm font-display font-semibold text-foreground">
            <span>⏱ {formatTime(timer)}</span>
            <span>🎯 {moves} moves</span>
          </div>
          <div className="grid grid-cols-4 gap-2 w-fit">
            {cards.map((card, idx) => (
              <motion.button
                key={card.id}
                className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-xl border border-pink-500/20 overflow-hidden"
                onClick={() => handleFlip(idx)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: "0 4px 20px hsl(345 100% 59% / 0.15), inset 0 0 30px hsl(345 80% 20% / 0.1)",
                  perspective: 600,
                }}
              >
                <motion.div
                  className="w-full h-full relative"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Back - hidden */}
                  <div
                    className="absolute inset-0 rounded-xl backdrop-blur-sm flex items-center justify-center text-xl text-primary"
                    style={{
                      backfaceVisibility: "hidden",
                      background: "linear-gradient(135deg, hsl(345 30% 95% / 0.7) 0%, hsl(345 20% 90% / 0.5) 100%)",
                    }}
                  >
                    ♥
                  </div>
                  {/* Front - image */}
                  <div
                    className={`absolute inset-0 rounded-xl overflow-hidden ${card.matched ? "ring-2 ring-primary" : ""}`}
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <img
                      src={card.src}
                      alt={card.label}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </motion.div>
              </motion.button>
            ))}
          </div>
          <button
            onClick={initGame}
            className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors"
          >
            Restart
          </button>
        </div>
      )}
    </section>
  );
};

export default TileMatchGame;
