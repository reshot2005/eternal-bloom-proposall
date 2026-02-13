import { useMemo } from "react";

const FloatingHearts = () => {
  const hearts = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: 10 + Math.random() * 16,
        delay: `${Math.random() * 12}s`,
        duration: `${12 + Math.random() * 10}s`,
        opacity: 0.06 + Math.random() * 0.1,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute text-primary animate-drift"
          style={{
            left: h.left,
            bottom: "-20px",
            fontSize: h.size,
            opacity: h.opacity,
            animationDelay: h.delay,
            animationDuration: h.duration,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
};

export default FloatingHearts;
