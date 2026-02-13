import { useEffect, useRef } from "react";

const MAX_PARTICLES = 80;

const HeartCursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Array<{ x: number; y: number; alpha: number; size: number; vx: number; vy: number }>>([]);
  const lastMove = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMove.current < 20) return; // throttle to ~50fps input
      lastMove.current = now;

      if (particles.current.length >= MAX_PARTICLES) particles.current.shift();
      particles.current.push({
        x: e.clientX,
        y: e.clientY,
        alpha: 0.8,
        size: 6 + Math.random() * 6,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.8,
      });
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const arr = particles.current;
      let writeIdx = 0;
      for (let i = 0; i < arr.length; i++) {
        const p = arr[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        p.size *= 0.98;
        if (p.alpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = "hsl(345, 100%, 59%)";
          ctx.font = `${p.size}px serif`;
          ctx.fillText("♥", p.x, p.y);
          ctx.restore();
          arr[writeIdx++] = p;
        }
      }
      arr.length = writeIdx;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
  );
};

export default HeartCursorTrail;
