import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const letterText = `My Dearest Valentine,

From the moment you walked into my life, something quietly changed inside me. You became my comfort on hard days, my laughter in the middle of chaos, and my peace when everything feels overwhelming. With you, even the simplest moments feel special.

I don't know what the future holds, but I know I want you in it — in the small everyday things and in the big dreams we haven't dreamed yet. Thank you for being my safe place, my favorite smile, and the reason my heart feels so full.

If love had a home, it would look a lot like us. ❤️

Forever & Always,
Your Person 💕`;

const LoveLetterSection = () => {
  const [displayedText, setDisplayedText] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= letterText.length) {
        setDisplayedText(letterText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 10);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="py-20 px-6 relative">
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-center mb-4 text-foreground"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        A Letter From My Heart 💌
      </motion.h2>
      <motion.p
        className="text-script text-xl text-rose-soft text-center mb-12 glow-text"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        Written just for you
      </motion.p>

      <motion.div
        className="max-w-2xl mx-auto glass-card glow-border p-8 sm:p-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-foreground/90 text-lg leading-relaxed font-body whitespace-pre-line min-h-[300px]">
          {displayedText}
          {displayedText.length < letterText.length && (
            <motion.span
              className="text-primary"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              |
            </motion.span>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default LoveLetterSection;
