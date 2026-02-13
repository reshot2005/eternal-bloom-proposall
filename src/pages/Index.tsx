import { useState, useCallback, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import FloatingHearts from "@/components/FloatingHearts";
import HeartCursorTrail from "@/components/HeartCursorTrail";
import HeroSection from "@/components/HeroSection";
import ProposalSection from "@/components/ProposalSection";
import HeartExplosion from "@/components/HeartExplosion";
import MusicToggle from "@/components/MusicToggle";
import { useMusic } from "@/context/MusicContext";

const MemorySection = lazy(() => import("@/components/MemorySection"));
const LoveLetterSection = lazy(() => import("@/components/LoveLetterSection"));

type Phase = "loading" | "hero" | "proposal" | "explosion" | "story";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("loading");
  const navigate = useNavigate();
  const { play } = useMusic();

  const handleLoadingComplete = useCallback(() => setPhase("hero"), []);
  const handleEnterHeart = useCallback(() => setPhase("proposal"), []);
  const handleYes = useCallback(() => {
    play();
    setPhase("explosion");
  }, [play]);
  const handleExplosionComplete = useCallback(() => setPhase("story"), []);

  const showOverlays = phase !== "explosion";

  return (
    <div className="min-h-screen gradient-deep relative">
      {showOverlays && <FloatingHearts />}
      {showOverlays && <HeartCursorTrail />}
      {(phase === "story" || phase === "explosion") && <MusicToggle />}

      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}

        {phase === "hero" && (
          <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <HeroSection onEnter={handleEnterHeart} />
          </motion.div>
        )}

        {phase === "proposal" && (
          <motion.div key="proposal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <ProposalSection onYes={handleYes} />
          </motion.div>
        )}

        {phase === "explosion" && (
          <HeartExplosion key="explosion" active={true} onComplete={handleExplosionComplete} />
        )}

        {phase === "story" && (
          <motion.div key="story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <Suspense fallback={<div className="min-h-screen" />}>
              <div className="pt-20">
                <MemorySection />
                <LoveLetterSection />

                {/* Secrets CTA */}
                <motion.section
                  className="py-20 px-6 text-center"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="max-w-md mx-auto glass-card glow-border p-8 sm:p-10">
                    <motion.div
                      className="text-5xl mb-4"
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🤫
                    </motion.div>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">
                      Ready to Reveal Some Secrets?
                    </h2>
                    <p className="text-script text-lg text-rose-soft glow-text mb-6">
                      Complete love challenges to unlock hidden confessions…
                    </p>
                    <motion.button
                      className="px-8 py-4 rounded-full font-display font-bold text-primary-foreground gradient-rose neon-glow text-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/challenges")}
                    >
                      Unlock Secrets 🔓
                    </motion.button>
                  </div>
                </motion.section>
              </div>
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
