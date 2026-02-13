import { motion } from "framer-motion";
import { Music, VolumeX } from "lucide-react";
import { useMusic } from "@/context/MusicContext";

const MusicToggle = () => {
  const { isPlaying, toggle } = useMusic();

  return (
    <motion.button
      onClick={toggle}
      className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center glow-border"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isPlaying ? "Pause music" : "Play music"}
    >
      {isPlaying ? (
        <Music className="w-5 h-5 text-primary animate-pulse" />
      ) : (
        <VolumeX className="w-5 h-5 text-muted-foreground" />
      )}
    </motion.button>
  );
};

export default MusicToggle;
