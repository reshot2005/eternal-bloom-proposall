import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoveCertificateProps {
  show: boolean;
}

const LoveCertificate = ({ show }: LoveCertificateProps) => {
  const [partnerName, setPartnerName] = useState("");
  const [yourName, setYourName] = useState("");
  const [signed, setSigned] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const certRef = useRef<HTMLDivElement>(null);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSign = useCallback(() => {
    if (!partnerName.trim() || !yourName.trim() || !hasSignature) return;
    setSigned(true);
  }, [partnerName, yourName, hasSignature]);

  const downloadCertificate = useCallback(async () => {
    const cert = certRef.current;
    if (!cert) return;

    // Dynamic import html2canvas
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(cert, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = "love-certificate.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!show) return null;

  return (
    <motion.section
      className="py-16 px-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <motion.h2
        className="text-3xl sm:text-4xl font-display font-bold text-center mb-2 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Your Love Certificate 📜
      </motion.h2>
      <p className="text-script text-lg text-rose-soft text-center mb-10 glow-text">
        Sign it together to make it official ✨
      </p>

      {/* Certificate */}
      <div className="max-w-lg mx-auto">
        <div
          ref={certRef}
          className="relative rounded-2xl overflow-hidden p-[2px]"
          style={{
            background: "linear-gradient(135deg, hsl(345 100% 70%), hsl(38 90% 65%), hsl(345 100% 59%))",
          }}
        >
          <div
            className="relative rounded-2xl p-8 sm:p-10"
            style={{
              background: "linear-gradient(160deg, hsl(345 30% 12%) 0%, hsl(340 25% 8%) 50%, hsl(345 35% 14%) 100%)",
            }}
          >
            {/* Ornamental corners */}
            <div className="absolute top-4 left-4 text-2xl opacity-30">❦</div>
            <div className="absolute top-4 right-4 text-2xl opacity-30">❦</div>
            <div className="absolute bottom-4 left-4 text-2xl opacity-30 rotate-180">❦</div>
            <div className="absolute bottom-4 right-4 text-2xl opacity-30 rotate-180">❦</div>

            {/* Inner glow */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                background: "radial-gradient(ellipse at 50% 20%, hsl(345 100% 59% / 0.08) 0%, transparent 60%)",
              }}
            />

            <div className="relative z-10 text-center">
              <motion.div
                className="text-4xl mb-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💖
              </motion.div>

              <h3
                className="font-display text-2xl sm:text-3xl font-bold mb-1"
                style={{
                  background: "linear-gradient(135deg, hsl(0 0% 100%), hsl(345 100% 80%), hsl(38 90% 75%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Certificate of Love
              </h3>
              <p className="text-xs font-display tracking-[0.3em] uppercase mb-6" style={{ color: "hsl(345 60% 60%)" }}>
                Sealed with devotion
              </p>

              <div className="space-y-1 mb-6">
                <p className="font-body text-sm" style={{ color: "hsl(345 40% 70%)" }}>
                  This certifies that
                </p>
                <p
                  className="font-display text-xl font-bold"
                  style={{
                    color: signed && partnerName ? "hsl(345 100% 85%)" : "hsl(345 30% 40%)",
                    textShadow: signed ? "0 0 15px hsl(345 100% 59% / 0.4)" : "none",
                  }}
                >
                  {signed ? partnerName : "_______________"}
                </p>
                <p className="font-body text-sm" style={{ color: "hsl(345 40% 70%)" }}>
                  &
                </p>
                <p
                  className="font-display text-xl font-bold"
                  style={{
                    color: signed && yourName ? "hsl(345 100% 85%)" : "hsl(345 30% 40%)",
                    textShadow: signed ? "0 0 15px hsl(345 100% 59% / 0.4)" : "none",
                  }}
                >
                  {signed ? yourName : "_______________"}
                </p>
              </div>

              <p className="font-script text-base mb-6" style={{ color: "hsl(345 80% 75%)" }}>
                are bound by an unbreakable bond of love, trust, and
                <br />
                endless devotion — from this day, forever and always.
              </p>

              {/* Signature area */}
              <div className="border-t border-white/10 pt-5">
                {signed ? (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-xs font-display" style={{ color: "hsl(345 40% 55%)" }}>
                      Digitally signed
                    </p>
                    <img
                      src={canvasRef.current?.toDataURL()}
                      alt="Signature"
                      className="h-12 object-contain"
                      style={{ filter: "drop-shadow(0 0 6px hsl(345 100% 59% / 0.4))" }}
                    />
                    <p className="text-xs font-display" style={{ color: "hsl(345 40% 55%)" }}>
                      {today}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs font-display" style={{ color: "hsl(345 30% 40%)" }}>
                    Awaiting signature…
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sign form */}
        <AnimatePresence>
          {!signed && (
            <motion.div
              className="mt-8 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Partner's name"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="px-4 py-3 rounded-xl font-body text-sm text-foreground placeholder:text-muted-foreground border border-pink-500/20 outline-none focus:border-primary/50 transition-colors"
                  style={{
                    background: "linear-gradient(135deg, hsl(345 30% 95% / 0.7), hsl(345 20% 90% / 0.5))",
                    boxShadow: "0 4px 20px hsl(345 100% 59% / 0.1)",
                  }}
                />
                <input
                  type="text"
                  placeholder="Your name"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  className="px-4 py-3 rounded-xl font-body text-sm text-foreground placeholder:text-muted-foreground border border-pink-500/20 outline-none focus:border-primary/50 transition-colors"
                  style={{
                    background: "linear-gradient(135deg, hsl(345 30% 95% / 0.7), hsl(345 20% 90% / 0.5))",
                    boxShadow: "0 4px 20px hsl(345 100% 59% / 0.1)",
                  }}
                />
              </div>

              {/* Signature pad */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-display text-muted-foreground">Draw your signature ✍️</p>
                  {hasSignature && (
                    <button
                      onClick={clearSignature}
                      className="text-xs text-muted-foreground hover:text-foreground font-body transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div
                  className="rounded-xl border border-pink-500/20 overflow-hidden"
                  style={{
                    boxShadow: "0 4px 20px hsl(345 100% 59% / 0.1), inset 0 0 30px hsl(345 80% 20% / 0.05)",
                    background: "linear-gradient(135deg, hsl(345 30% 97% / 0.9), hsl(345 20% 93% / 0.7))",
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={150}
                    className="w-full h-[100px] cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>
              </div>

              <motion.button
                className="w-full py-3 rounded-xl font-display font-bold text-primary-foreground disabled:opacity-40 transition-opacity"
                style={{
                  background: "linear-gradient(135deg, hsl(345 100% 59%) 0%, hsl(345 100% 70%) 50%, hsl(345 100% 59%) 100%)",
                  boxShadow: "0 0 20px hsl(345 100% 59% / 0.3), 0 4px 15px hsl(345 100% 59% / 0.2)",
                }}
                disabled={!partnerName.trim() || !yourName.trim() || !hasSignature}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSign}
              >
                Sign & Seal With Love 💌
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Download button */}
        <AnimatePresence>
          {signed && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                className="px-8 py-3 rounded-full font-display font-bold text-primary-foreground"
                style={{
                  background: "linear-gradient(135deg, hsl(345 100% 59%), hsl(38 90% 55%), hsl(345 100% 59%))",
                  boxShadow: "0 0 25px hsl(345 100% 59% / 0.4), 0 4px 20px hsl(38 90% 55% / 0.2)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadCertificate}
              >
                Download Certificate 📥
              </motion.button>
              <button
                onClick={() => { setSigned(false); clearSignature(); }}
                className="block mx-auto mt-3 text-sm text-muted-foreground hover:text-foreground font-body transition-colors"
              >
                Sign again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default LoveCertificate;
