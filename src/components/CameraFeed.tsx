import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { DetectedFace } from "@/hooks/useFaceDetection";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  faces: DetectedFace[];
  isThreat: boolean;
  isRunning: boolean;
  privacyMode: boolean;
}

export default function CameraFeed({
  videoRef,
  faces,
  isThreat,
  isRunning,
  privacyMode,
}: Props) {
  const overlayRef = useRef<HTMLCanvasElement>(null);

  // Draw bounding boxes
  useEffect(() => {
    const canvas = overlayRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faces.forEach((face, i) => {
      const [x1, y1] = face.topLeft;
      const [x2, y2] = face.bottomRight;
      const w = x2 - x1;
      const h = y2 - y1;

      // First face = user (green), others = potential threat (red)
      ctx.strokeStyle = i === 0 ? "#22c55e" : "#ef4444";
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, w, h);

      // Label
      ctx.fillStyle = i === 0 ? "#22c55e" : "#ef4444";
      ctx.font = "bold 14px Inter";
      ctx.fillText(
        i === 0 ? "You" : `Intruder #${i}`,
        x1,
        y1 - 6
      );
    });
  }, [faces, videoRef]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-border bg-card">
      {/* Scan line effect */}
      {isRunning && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="absolute inset-x-0 h-1 bg-primary/30 animate-scan-line" />
        </div>
      )}

      {/* Threat border glow */}
      {isThreat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 z-20 pointer-events-none rounded-xl border-2 border-destructive glow-danger"
        />
      )}

      <video
        ref={videoRef}
        muted
        playsInline
        className={`w-full aspect-video object-cover ${
          privacyMode && isThreat ? "blur-xl" : ""
        }`}
        style={{ transform: "scaleX(-1)" }}
      />
      <canvas
        ref={overlayRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ transform: "scaleX(-1)" }}
      />

      {!isRunning && (
        <div className="absolute inset-0 flex items-center justify-center bg-card">
          <p className="text-muted-foreground">Camera inactive</p>
        </div>
      )}
    </div>
  );
}
