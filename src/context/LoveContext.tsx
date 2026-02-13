import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface LoveState {
  loveProgress: number;
  xoxCompleted: boolean;
  tileMatchCompleted: boolean;
  qaCompleted: boolean;
  currentStage: number;
  unlockedSecrets: string[];
  activeSecret: string | null;
}

interface LoveContextType extends LoveState {
  completeXOX: () => void;
  completeTileMatch: () => void;
  completeQA: () => void;
  dismissSecret: () => void;
}

const LoveContext = createContext<LoveContextType | null>(null);

const SECRETS = [
  "I smiled for 20 minutes after our first chat. 😊",
  "That trip meant more to me than you know. 🌅",
  "I knew I loved you before you realized it. 💕",
];

export const LoveProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<LoveState>({
    loveProgress: 0,
    xoxCompleted: false,
    tileMatchCompleted: false,
    qaCompleted: false,
    currentStage: 1,
    unlockedSecrets: [],
    activeSecret: null,
  });

  const completeXOX = useCallback(() => {
    setState((s) => ({
      ...s,
      xoxCompleted: true,
      loveProgress: 33,
      currentStage: 2,
      unlockedSecrets: [...s.unlockedSecrets, SECRETS[0]],
      activeSecret: SECRETS[0],
    }));
  }, []);

  const completeTileMatch = useCallback(() => {
    setState((s) => ({
      ...s,
      tileMatchCompleted: true,
      loveProgress: 66,
      currentStage: 3,
      unlockedSecrets: [...s.unlockedSecrets, SECRETS[1]],
      activeSecret: SECRETS[1],
    }));
  }, []);

  const completeQA = useCallback(() => {
    setState((s) => ({
      ...s,
      qaCompleted: true,
      loveProgress: 100,
      currentStage: 4,
      unlockedSecrets: [...s.unlockedSecrets, SECRETS[2]],
      activeSecret: SECRETS[2],
    }));
  }, []);

  const dismissSecret = useCallback(() => {
    setState((s) => ({ ...s, activeSecret: null }));
  }, []);

  return (
    <LoveContext.Provider value={{ ...state, completeXOX, completeTileMatch, completeQA, dismissSecret }}>
      {children}
    </LoveContext.Provider>
  );
};

export const useLove = () => {
  const ctx = useContext(LoveContext);
  if (!ctx) throw new Error("useLove must be used within LoveProvider");
  return ctx;
};
