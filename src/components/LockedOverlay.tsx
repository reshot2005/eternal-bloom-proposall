import { ReactNode } from "react";
import { motion } from "framer-motion";

const LockedOverlay = ({ locked, children }: { locked: boolean; children: ReactNode }) => {
  return (
    <div className="relative">
      {children}
      {locked && (
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-md bg-background/50 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center px-6">
            <div className="text-4xl mb-3">🔒</div>
            <p className="font-display font-bold text-foreground text-lg">
              Complete previous challenge to unlock ❤️
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LockedOverlay;
