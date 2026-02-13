import { LoveProvider, useLove } from "@/context/LoveContext";
import FloatingHearts from "@/components/FloatingHearts";
import HeartCursorTrail from "@/components/HeartCursorTrail";
import Particles from "@/components/Particles";
import LoveMeter from "@/components/LoveMeter";
import SecretModal from "@/components/SecretModal";
import LockedOverlay from "@/components/LockedOverlay";
import XOXGame from "@/components/XOXGame";
import TileMatchGame from "@/components/TileMatchGame";
import QAGame from "@/components/QAGame";
import FinalCinematic from "@/components/FinalCinematic";
import LoveCertificate from "@/components/LoveCertificate";
import MusicToggle from "@/components/MusicToggle";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ChallengesContent = () => {
  const { activeSecret, dismissSecret, xoxCompleted, tileMatchCompleted, qaCompleted, loveProgress } = useLove();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-deep relative">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <Particles
          particleColors={["#e496d9", "#ff2e63", "#800020"]}
          particleCount={300}
          particleSpread={10}
          speed={0.15}
          particleBaseSize={200}
          moveParticlesOnHover
          alphaParticles
          disableRotation={false}
          pixelRatio={1}
        />
      </div>
      <FloatingHearts />
      <HeartCursorTrail />
      <LoveMeter />
      <MusicToggle />

      <div className="pt-20 pb-12 px-6">
        {/* Back button */}
        <motion.button
          className="mb-8 text-sm font-display text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          onClick={() => navigate("/")}
          whileHover={{ x: -4 }}
        >
          ← Back to Our Story
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-center mb-2 text-foreground">
            Let's Test Our Love 😌
          </h1>
          <p className="text-script text-xl text-rose-soft text-center mb-12 glow-text">
            Complete all challenges to unlock our forever
          </p>
        </motion.div>

        {/* Stage 1 */}
        <XOXGame />

        {/* Stage 2 */}
        <LockedOverlay locked={!xoxCompleted}>
          <TileMatchGame />
        </LockedOverlay>

        {/* Stage 3 */}
        <LockedOverlay locked={!tileMatchCompleted}>
          <QAGame />
        </LockedOverlay>

        {/* Final */}
        {loveProgress >= 100 && <FinalCinematic />}
        <LoveCertificate show={loveProgress >= 100} />
      </div>

      <SecretModal secret={activeSecret} onDismiss={dismissSecret} />
    </div>
  );
};

const Challenges = () => (
  <LoveProvider>
    <ChallengesContent />
  </LoveProvider>
);

export default Challenges;
