import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react";

interface MusicContextType {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Create a single audio element that persists across the app
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.4;
    // Will be set when the MP3 is available
    try {
      // Dynamic import for the music file
      import("@/assets/golden-hour.mp3").then((mod) => {
        audio.src = mod.default;
      }).catch(() => {
        console.warn("Music file not found yet. Upload golden-hour.mp3 to src/assets/");
      });
    } catch {
      console.warn("Music file not found yet.");
    }
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  return (
    <MusicContext.Provider value={{ isPlaying, play, pause, toggle }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
};
