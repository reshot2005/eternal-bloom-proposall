import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLove } from "@/context/LoveContext";

type Cell = "❤️" | "💔" | null;
type Board = Cell[];

const WINS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

const checkWinner = (b: Board): Cell => {
  for (const [a, b2, c] of WINS) {
    if (b[a] && b[a] === b[b2] && b[a] === b[c]) return b[a];
  }
  return null;
};

const minimax = (board: Board, isMax: boolean): number => {
  const w = checkWinner(board);
  if (w === "💔") return 10;
  if (w === "❤️") return -10;
  if (board.every(Boolean)) return 0;
  const scores = board.reduce<number[]>((acc, cell, i) => {
    if (!cell) {
      board[i] = isMax ? "💔" : "❤️";
      acc.push(minimax(board, !isMax));
      board[i] = null;
    }
    return acc;
  }, []);
  return isMax ? Math.max(...scores) : Math.min(...scores);
};

const aiMove = (board: Board): number => {
  // Make AI beatable — 40% chance of random move
  const empty = board.map((c, i) => (!c ? i : -1)).filter((i) => i >= 0);
  if (Math.random() < 0.4) return empty[Math.floor(Math.random() * empty.length)];
  let best = -Infinity, bestIdx = empty[0];
  for (const i of empty) {
    board[i] = "💔";
    const score = minimax(board, false);
    board[i] = null;
    if (score > best) { best = score; bestIdx = i; }
  }
  return bestIdx;
};

const XOXGame = () => {
  const { completeXOX, xoxCompleted } = useLove();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const reset = useCallback(() => {
    setBoard(Array(9).fill(null));
    setMessage("");
    setGameOver(false);
  }, []);

  const handleClick = useCallback((i: number) => {
    if (board[i] || gameOver || xoxCompleted) return;
    const newBoard = [...board];
    newBoard[i] = "❤️";

    const playerWin = checkWinner(newBoard);
    if (playerWin) {
      setBoard(newBoard);
      setMessage("You won! 🎉");
      setGameOver(true);
      setTimeout(completeXOX, 800);
      return;
    }
    if (newBoard.every(Boolean)) {
      setBoard(newBoard);
      setMessage("It's a draw! Restarting… 🔄");
      setGameOver(true);
      setTimeout(reset, 1500);
      return;
    }

    const ai = aiMove(newBoard);
    newBoard[ai] = "💔";
    const aiWin = checkWinner(newBoard);
    if (aiWin) {
      setBoard(newBoard);
      setMessage("Hmm… try again 😏");
      setGameOver(true);
      setTimeout(reset, 1500);
      return;
    }
    if (newBoard.every(Boolean)) {
      setBoard(newBoard);
      setMessage("It's a draw! Restarting… 🔄");
      setGameOver(true);
      setTimeout(reset, 1500);
      return;
    }
    setBoard(newBoard);
  }, [board, gameOver, xoxCompleted, completeXOX, reset]);

  return (
    <section className="py-16 px-6">
      <motion.h2
        className="text-3xl sm:text-4xl font-display font-bold text-center mb-2 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Stage 1: Love XOX 💗
      </motion.h2>
      <p className="text-script text-lg text-rose-soft text-center mb-8 glow-text">
        Win to unlock the next challenge
      </p>

      {xoxCompleted ? (
        <motion.div className="text-center" initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <div className="text-5xl mb-3">✅</div>
          <p className="font-display text-xl text-primary font-bold">Completed!</p>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="grid grid-cols-3 gap-2 w-fit">
            {board.map((cell, i) => (
              <motion.button
                key={i}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-pink-500/20 bg-card/70 backdrop-blur-sm flex items-center justify-center text-3xl sm:text-4xl font-bold transition-colors hover:bg-card/80"
                style={{
                  boxShadow: "0 4px 20px hsl(345 100% 59% / 0.15), inset 0 0 30px hsl(345 80% 20% / 0.1)",
                  background: "linear-gradient(135deg, hsl(345 30% 95% / 0.7) 0%, hsl(345 20% 90% / 0.5) 100%)",
                }}
                onClick={() => handleClick(i)}
                whileHover={!cell ? { scale: 1.05 } : {}}
                whileTap={!cell ? { scale: 0.95 } : {}}
                animate={cell ? { scale: [0, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {cell}
              </motion.button>
            ))}
          </div>
          {message && (
            <motion.p
              className="font-display text-lg text-foreground font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message}
            </motion.p>
          )}
          <button
            onClick={reset}
            className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors"
          >
            Reset Board
          </button>
        </div>
      )}
    </section>
  );
};

export default XOXGame;
