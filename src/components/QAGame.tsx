import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLove } from "@/context/LoveContext";

const questions = [
  { q: "What is my comfort food?", options: ["Pizza 🍕", "Biryani 🍚", "Ice Cream 🍦", "Pasta 🍝"], answer: 1 },
  { q: "Who apologizes first?", options: ["Me 🙋", "You 🫵", "Neither 😤", "Both at once 🤝"], answer: 0 },
  { q: "What makes me overthink?", options: ["Late replies 📱", "Silence 🤫", "Mixed signals 🚦", "Everything 😅"], answer: 3 },
  { q: "My love language is?", options: ["Words 💬", "Touch 🤗", "Quality Time ⏰", "Gifts 🎁"], answer: 2 },
  { q: "Our song would be?", options: ["Something slow 🎵", "Something loud 🎸", "A Bollywood hit 🎶", "We don't need one 💕"], answer: 0 },
];

const QAGame = () => {
  const { completeQA, qaCompleted } = useLove();
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [shake, setShake] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleAnswer = useCallback((idx: number) => {
    if (qaCompleted || selectedIdx !== null) return;
    setSelectedIdx(idx);
    const isCorrect = idx === questions[currentQ].answer;

    if (isCorrect) {
      setCorrect(true);
      const newScore = score + 1;
      setScore(newScore);
      setTimeout(() => {
        if (currentQ + 1 >= questions.length) {
          completeQA();
        } else {
          setCurrentQ((q) => q + 1);
          setAttempts(0);
          setShowHint(false);
          setCorrect(false);
          setSelectedIdx(null);
        }
      }, 1000);
    } else {
      setShake(true);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 2) setShowHint(true);
      setTimeout(() => {
        setShake(false);
        setSelectedIdx(null);
      }, 600);
    }
  }, [qaCompleted, selectedIdx, currentQ, score, attempts, completeQA]);

  const q = questions[currentQ];

  return (
    <section className="py-16 px-6">
      <motion.h2
        className="text-3xl sm:text-4xl font-display font-bold text-center mb-2 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Stage 3: How Well Do You Know Me? 🧠
      </motion.h2>
      <p className="text-script text-lg text-rose-soft text-center mb-8 glow-text">
        Answer all correctly to unlock the finale
      </p>

      {qaCompleted ? (
        <motion.div className="text-center" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <div className="text-5xl mb-3">✅</div>
          <p className="font-display text-xl text-primary font-bold">
            Perfect score! {score}/{questions.length}
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="max-w-md mx-auto glass-card glow-border p-6 sm:p-8"
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between items-center mb-4 text-sm font-display text-muted-foreground">
            <span>Question {currentQ + 1}/{questions.length}</span>
            <span>Score: {score}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6 text-center">
            {q.q}
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {q.options.map((opt, i) => {
              const isSelected = selectedIdx === i;
              const isAnswer = i === q.answer;
              let btnClass = "border border-pink-500/20 text-foreground";
              let btnStyle: React.CSSProperties = {
                boxShadow: "0 4px 20px hsl(345 100% 59% / 0.15), inset 0 0 30px hsl(345 80% 20% / 0.1)",
                background: "linear-gradient(135deg, hsl(345 30% 95% / 0.7) 0%, hsl(345 20% 90% / 0.5) 100%)",
              };
              if (isSelected && correct) {
                btnClass = "border-primary text-primary";
                btnStyle = { ...btnStyle, background: "linear-gradient(135deg, hsl(345 80% 90% / 0.8), hsl(345 60% 85% / 0.6))", boxShadow: "0 4px 25px hsl(345 100% 59% / 0.3)" };
              }
              if (isSelected && !correct && selectedIdx !== null) {
                btnClass = "border-destructive text-destructive";
                btnStyle = { ...btnStyle, background: "linear-gradient(135deg, hsl(0 60% 95% / 0.7), hsl(0 40% 90% / 0.5))", boxShadow: "0 4px 20px hsl(0 80% 50% / 0.15)" };
              }

              return (
                <motion.button
                  key={i}
                  className={`px-4 py-3 rounded-xl font-body text-base text-left transition-colors ${btnClass}`}
                  style={btnStyle}
                  onClick={() => handleAnswer(i)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={isSelected && correct ? { scale: [1, 1.05, 1] } : {}}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {showHint && (
            <motion.p
              className="mt-4 text-sm text-rose-soft text-center font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              💡 Hint: Think about what we always talk about…
            </motion.p>
          )}
        </motion.div>
      )}
    </section>
  );
};

export default QAGame;
