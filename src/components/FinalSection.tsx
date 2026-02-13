import { motion } from "framer-motion";

const FinalSection = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Massive background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full bg-primary/10 blur-[150px]" />
      </div>

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="text-6xl mb-8 animate-heartbeat"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          💖
        </motion.div>

        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 glow-text leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          So… This Is Just The Beginning
          <br />
          <span className="text-primary">Of Our Forever ❤️</span>
        </motion.h2>

        <motion.p
          className="text-script text-2xl sm:text-3xl text-rose-soft glow-text mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
        >
          I Love You, endlessly and always 🌹
        </motion.p>

      </motion.div>

      {/* Bottom floating hearts */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/20"
          style={{
            bottom: -20,
            left: `${10 + i * 12}%`,
            fontSize: 20 + Math.random() * 20,
          }}
          animate={{ y: [-20, -100, -20], opacity: [0.1, 0.3, 0.1] }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          ♥
        </motion.div>
      ))}
    </section>
  );
};

export default FinalSection;
