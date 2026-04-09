import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { DetectedFace } from "@/hooks/useFaceDetection";

interface Props {
  faces: DetectedFace[];
  isThreat: boolean;
  isRunning: boolean;
  privacyMode: boolean;
}

/**
 * Demo camera feed: renders a simulated surveillance view
 * with animated face bounding boxes — no real camera needed.
 */
export default function DemoCameraFeed({ faces, isThreat, isRunning, privacyMode }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 640;
    canvas.height = 480;

    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark background with grid
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = "rgba(245, 158, 11, 0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < 640; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 480);
        ctx.stroke();
      }
      for (let y = 0; y < 480; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(640, y);
        ctx.stroke();
      }

      // Simulated silhouettes
      if (isRunning) {
        faces.forEach((face, i) => {
          const [x1, y1] = face.topLeft;
          const [x2, y2] = face.bottomRight;
          const w = x2 - x1;
          const h = y2 - y1;
          const cx = x1 + w / 2;
          const cy = y1 + h / 2;

          // Silhouette circle (head)
          const headR = Math.min(w, h) * 0.35;
          ctx.beginPath();
          ctx.arc(cx, cy - h * 0.1, headR, 0, Math.PI * 2);
          ctx.fillStyle = i === 0 ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)";
          ctx.fill();

          // Body shape
          ctx.beginPath();
          ctx.ellipse(cx, cy + h * 0.3, w * 0.35, h * 0.25, 0, 0, Math.PI * 2);
          ctx.fill();

          // Bounding box
          const color = i === 0 ? "#22c55e" : "#ef4444";
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.strokeRect(x1, y1, w, h);
          ctx.setLineDash([]);

          // Corner brackets
          const bLen = 15;
          ctx.lineWidth = 3;
          ctx.strokeStyle = color;
          // Top-left
          ctx.beginPath(); ctx.moveTo(x1, y1 + bLen); ctx.lineTo(x1, y1); ctx.lineTo(x1 + bLen, y1); ctx.stroke();
          // Top-right
          ctx.beginPath(); ctx.moveTo(x2 - bLen, y1); ctx.lineTo(x2, y1); ctx.lineTo(x2, y1 + bLen); ctx.stroke();
          // Bottom-left
          ctx.beginPath(); ctx.moveTo(x1, y2 - bLen); ctx.lineTo(x1, y2); ctx.lineTo(x1 + bLen, y2); ctx.stroke();
          // Bottom-right
          ctx.beginPath(); ctx.moveTo(x2 - bLen, y2); ctx.lineTo(x2, y2); ctx.lineTo(x2, y2 - bLen); ctx.stroke();

          // Label
          const label = i === 0 ? "USER" : `INTRUDER #${i}`;
          ctx.font = "bold 12px monospace";
          ctx.fillStyle = color;
          ctx.fillText(label, x1 + 4, y1 - 8);

          // Confidence
          ctx.font = "10px monospace";
          ctx.fillStyle = "rgba(255,255,255,0.5)";
          ctx.fillText(`${(face.probability * 100).toFixed(0)}%`, x1 + 4, y2 + 14);
        });

        // HUD overlay text
        const now = new Date();
        ctx.font = "11px monospace";
        ctx.fillStyle = "rgba(245, 158, 11, 0.6)";
        ctx.fillText(`SHIELDEYE v2.0  |  ${now.toLocaleTimeString()}  |  DEMO MODE`, 12, 20);
        ctx.fillText(`FACES: ${faces.length}  |  STATUS: ${isThreat ? "⚠ THREAT" : "✓ SAFE"}`, 12, 468);
      }

      if (isRunning) animId = requestAnimationFrame(draw);
    };

    if (isRunning) {
      draw();
    } else {
      // Idle state
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, 640, 480);
      ctx.font = "14px monospace";
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.textAlign = "center";
      ctx.fillText("DEMO MODE — Click Start to begin simulation", 320, 240);
      ctx.textAlign = "start";
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [faces, isThreat, isRunning]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-border bg-card">
      {isRunning && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="absolute inset-x-0 h-1 bg-primary/30 animate-scan-line" />
        </div>
      )}

      {isThreat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 z-20 pointer-events-none rounded-xl border-2 border-destructive glow-danger"
        />
      )}

      <canvas
        ref={canvasRef}
        className={`w-full aspect-video object-cover ${privacyMode && isThreat ? "blur-xl" : ""}`}
      />

      {isRunning && (
        <div className="absolute top-3 right-3 z-30 px-2 py-1 rounded bg-primary/20 border border-primary/40">
          <span className="text-[10px] font-mono text-primary font-bold tracking-wider">DEMO</span>
        </div>
      )}
    </div>
  );
}
