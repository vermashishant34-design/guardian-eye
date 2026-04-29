import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import CameraFeed from "@/components/CameraFeed";
import StatusIndicator from "@/components/StatusIndicator";
import ActivityLog from "@/components/ActivityLog";
import SettingsPanel from "@/components/SettingsPanel";
import ThreatAlert from "@/components/ThreatAlert";
import { useFaceDetection, type DetectionResult } from "@/hooks/useFaceDetection";
import { playAlertSound } from "@/lib/alertSound";
import type { AlertEvent, AppSettings } from "@/types/detection";

export default function Dashboard() {
  const [settings, setSettings] = useState<AppSettings>({
    sensitivity: 3,
    soundEnabled: true,
    privacyMode: true,
    autoScreenshot: true,
  });

  const [events, setEvents] = useState<AlertEvent[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const lastThreatTime = useRef(0);

  const handleThreat = useCallback(
    (result: DetectionResult) => {
      const now = Date.now();
      if (now - lastThreatTime.current < 5000) return;
      lastThreatTime.current = now;

      if (settings.soundEnabled) playAlertSound();

      const message = `⚠ ${result.faceCount} faces detected — potential shoulder surfing threat!`;

      const newEvent: AlertEvent = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        faceCount: result.faceCount,
        threatLevel: "danger",
        aiMessage: message,
      };

      setAlertMessage(message);
      setEvents((prev) => [newEvent, ...prev].slice(0, 100));
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 8000);
    },
    [settings.soundEnabled]
  );

  const {
    videoRef,
    canvasRef,
    isLoading,
    isRunning,
    lastResult,
    error,
    start,
    stop,
  } = useFaceDetection({
    sensitivity: settings.sensitivity,
    onThreatDetected: handleThreat,
  });

  const getStatus = () => {
    if (!isRunning) return "inactive" as const;
    if (lastResult.isThreat) return "danger" as const;
    return "safe" as const;
  };

  return (
    <div className="min-h-screen gradient-dark grid-cyber">
      <Navbar />
      <canvas ref={canvasRef} className="hidden" />

      <ThreatAlert
        visible={alertVisible}
        message={alertMessage}
        onDismiss={() => setAlertVisible(false)}
      />

      <main className="container pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time shoulder surfing detection using on-device face detection
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CameraFeed
              videoRef={videoRef}
              faces={lastResult.faces}
              isThreat={lastResult.isThreat}
              isRunning={isRunning}
              isLoading={isLoading}
              privacyMode={settings.privacyMode}
            />

            <div className="flex gap-3">
              {!isRunning ? (
                <Button
                  onClick={start}
                  disabled={isLoading}
                  className="gradient-primary text-primary-foreground glow-primary"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isLoading ? "Loading AI Model..." : "Start Monitoring"}
                </Button>
              ) : (
                <Button onClick={stop} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <StatusIndicator
              status={getStatus()}
              faceCount={lastResult.faceCount}
            />
          </div>

          <div className="space-y-6">
            <SettingsPanel settings={settings} onChange={setSettings} />
            <ActivityLog events={events} />
          </div>
        </div>
      </main>
    </div>
  );
}
