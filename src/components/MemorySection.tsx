import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import firstChatImg from "@/assets/timeline-first-chat.jpg";
import firstMeetingImg from "@/assets/timeline-first-meeting.jpg";
import cuteMomentsImg from "@/assets/timeline-cute-moments.jpg";
import presentDayImg from "@/assets/timeline-present-day.jpg";

const memories = [
  {
    title: "The Day It All Began",
    date: "Our First Chat 💬",
    description:
      "A simple hello turned into hours of conversation. That's when I knew something magical was beginning.",
    image: firstChatImg,
  },
  {
    title: "Our First Meeting",
    date: "Butterflies & Smiles 🦋",
    description:
      "My heart raced, my palms were sweaty, but your smile made everything feel like home.",
    image: firstMeetingImg,
  },
  {
    title: "Those Cute Little Moments",
    date: "The In-Betweens 💕",
    description:
      "Late night calls, inside jokes, random voice notes — the little things that mean everything.",
    image: cuteMomentsImg,
  },
  {
    title: "Present Day",
    date: "Still Falling For You 🌹",
    description:
      "Every day with you feels like a new adventure. And I wouldn't trade it for anything in the world.",
    image: presentDayImg,
  },
];

const LOVE_SYMBOLS = ["♥", "💕", "✨", "💗", "🌹", "💫", "♡"];

const FloatingLoveSymbols = () => {
  const symbols = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        emoji: LOVE_SYMBOLS[i % LOVE_SYMBOLS.length],
        left: `${5 + Math.random() * 90}%`,
        top: `${Math.random() * 100}%`,
        size: 14 + Math.random() * 18,
        delay: `${Math.random() * 8}s`,
        duration: `${6 + Math.random() * 6}s`,
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {symbols.map((s) => (
        <span
          key={s.id}
          className="absolute animate-float opacity-[0.08]"
          style={{
            left: s.left,
            top: s.top,
            fontSize: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  );
};

const MemorySection = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <FloatingLoveSymbols />

      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-center mb-4 text-foreground relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Our Journey 💝
      </motion.h2>
      <motion.p
        className="text-script text-xl text-rose-soft text-center mb-16 glow-text relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        Every chapter written with love
      </motion.p>

      {/* Timeline */}
      <div className="relative max-w-4xl mx-auto z-10">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-primary/20" />

        <div className="space-y-24">
          {memories.map((memory, i) => (
            <TimelineItem key={i} memory={memory} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TimelineItem = ({
  memory,
  index,
}: {
  memory: (typeof memories)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative flex items-center">
      {/* Dot on the line */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-primary z-10 shadow-[0_0_12px_hsl(345,100%,59%/0.5)]"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
      />

      {/* Content — alternating sides */}
      <motion.div
        className={`w-[calc(50%-28px)] flex ${isLeft ? "mr-auto flex-row-reverse gap-4 text-right pr-2" : "ml-auto flex-row gap-4 text-left pl-2"}`}
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {/* Photo */}
        <motion.div
          className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-border overflow-hidden shadow-[0_4px_20px_hsl(345,100%,59%/0.12)]"
          whileHover={{ scale: 1.08, rotate: 3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={memory.image}
            alt={memory.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-2xl font-display font-bold text-foreground mb-1">
            {memory.title}
          </h3>
          <p className="text-script text-sm sm:text-base text-rose-soft mb-2">
            {memory.date}
          </p>
          <p className="text-foreground/70 text-sm sm:text-base leading-relaxed font-body">
            {memory.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MemorySection;
