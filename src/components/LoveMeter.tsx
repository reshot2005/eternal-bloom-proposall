import { motion } from "framer-motion";
import { useLove } from "@/context/LoveContext";

const LoveMeter = () => {
  const { loveProgress } = useLove();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 backdrop-blur-md bg-background/60 border-b border-border">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-display font-semibold text-foreground">Love Meter</span>
          <span className="text-xs font-display font-bold text-primary">{loveProgress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full gradient-rose"
            initial={{ width: 0 }}
            animate={{ width: `${loveProgress}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {["XOX", "Match", "Q&A", "💖"].map((label, i) => (
            <span
              key={label}
              className={`text-[10px] font-body ${
                loveProgress >= (i + 1) * 25 ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoveMeter;
