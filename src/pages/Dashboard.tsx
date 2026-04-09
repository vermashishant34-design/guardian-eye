import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Square, FileText, Brain, Monitor, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import CameraFeed from "@/components/CameraFeed";
import DemoCameraFeed from "@/components/DemoCameraFeed";
import StatusIndicator from "@/components/StatusIndicator";
import ActivityLog from "@/components/ActivityLog";
import SettingsPanel from "@/components/SettingsPanel";
import ThreatAlert from "@/components/ThreatAlert";
import { useFaceDetection, type DetectionResult } from "@/hooks/useFaceDetection";
import { useDemoMode } from "@/hooks/useDemoMode";
import { analyzeWithGemini, generateSummary } from "@/lib/geminiAnalysis";
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
  const [alertReasoning, setAlertReasoning] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [useDemo, setUseDemo] = useState(true);
  const lastThreatTime = useRef(0);

  const handleThreat = useCallback(
    async (result: DetectionResult) => {
      const now = Date.now();
      if (now - lastThreatTime.current < 5000) return;
      lastThreatTime.current = now;

      if (settings.soundEnabled) playAlertSound();

      const frame = !useDemo ? captureFrame() : null;

      const eventId = crypto.randomUUID();
      const newEvent: AlertEvent = {
        id: eventId,
        timestamp: new Date(),
        faceCount: result.faceCount,
        threatLevel: "danger",
        screenshot: frame || undefined,
      };

      /**
       * GEMINI AI INTEGRATION:
       * Analyze frame to confirm threat and generate contextual alerts.
       */
      if (frame) {
        const analysis = await analyzeWithGemini(frame, result.faceCount);
        newEvent.aiMessage = analysis.message;
        newEvent.aiReasoning = analysis.reasoning;
        newEvent.confirmed = analysis.isThreat;
        newEvent.threatLevel = analysis.isThreat ? "danger" : "warning";
        setAlertMessage(analysis.message);
        setAlertReasoning(analysis.reasoning);
      } else {
        const msg = `⚠ ${result.faceCount} faces detected — potential shoulder surfing threat!`;
        setAlertMessage(msg);
        setAlertReasoning(
          `Gemini AI: ${result.faceCount} distinct faces identified in frame. ` +
          `Multiple faces in viewing angle indicate unauthorized observation.`
        );
        newEvent.aiMessage = msg;
        newEvent.aiReasoning = "Demo mode — simulated Gemini analysis.";
      }

      setEvents((prev) => [newEvent, ...prev].slice(0, 100));
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 8000);
    },
    [settings.soundEnabled, useDemo]
  );

  // Real camera detection
  const {
    videoRef,
    canvasRef,
    isLoading,
    isRunning: realIsRunning,
    lastResult: realResult,
    error,
    start: realStart,
    stop: realStop,
    captureFrame,
  } = useFaceDetection({
    sensitivity: settings.sensitivity,
    onThreatDetected: handleThreat,
  });

  // Demo mode detection
  const {
    isRunning: demoIsRunning,
    lastResult: demoResult,
    start: demoStart,
    stop: demoStop,
  } = useDemoMode({ onThreatDetected: handleThreat });

  const isRunning = useDemo ? demoIsRunning : realIsRunning;
  const lastResult = useDemo ? demoResult : realResult;

  const handleStart = () => (useDemo ? demoStart() : realStart());
  const handleStop = () => (useDemo ? demoStop() : realStop());

  const getStatus = () => {
    if (!isRunning) return "inactive" as const;
    if (lastResult.isThreat) return "danger" as const;
    if (lastResult.faceCount === 1) return "safe" as const;
    return "safe" as const;
  };

  const handleGenerateSummary = async () => {
    const s = await generateSummary(
      events.map((e) => ({
        timestamp: e.timestamp,
        faceCount: e.faceCount,
        threatLevel: e.threatLevel,
      }))
    );
    setSummary(s);
  };

  return (
    <div className="min-h-screen gradient-dark grid-cyber">
      <Navbar />
      <canvas ref={canvasRef} className="hidden" />

      <ThreatAlert
        visible={alertVisible}
        message={alertMessage}
        reasoning={alertReasoning}
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
            Real-time shoulder surfing detection powered by{" "}
            <span className="text-primary font-medium">Google Gemini AI</span>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Mode toggle */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={useDemo ? "default" : "outline"}
                onClick={() => { if (!isRunning) setUseDemo(true); }}
                disabled={isRunning}
                className={useDemo ? "gradient-primary text-primary-foreground" : ""}
              >
                <Monitor className="h-3.5 w-3.5 mr-1.5" />
                Demo Mode
              </Button>
              <Button
                size="sm"
                variant={!useDemo ? "default" : "outline"}
                onClick={() => { if (!isRunning) setUseDemo(false); }}
                disabled={isRunning}
                className={!useDemo ? "gradient-primary text-primary-foreground" : ""}
              >
                <Camera className="h-3.5 w-3.5 mr-1.5" />
                Live Camera
              </Button>
            </div>

            {/* Camera / Demo Feed */}
            {useDemo ? (
              <DemoCameraFeed
                faces={lastResult.faces}
                isThreat={lastResult.isThreat}
                isRunning={isRunning}
                privacyMode={settings.privacyMode}
              />
            ) : (
              <CameraFeed
                videoRef={videoRef}
                faces={lastResult.faces}
                isThreat={lastResult.isThreat}
                isRunning={isRunning}
                privacyMode={settings.privacyMode}
              />
            )}

            <div className="flex gap-3">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  disabled={!useDemo && isLoading}
                  className="gradient-primary text-primary-foreground glow-primary"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {!useDemo && isLoading ? "Loading AI Model..." : "Start Monitoring"}
                </Button>
              ) : (
                <Button onClick={handleStop} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleGenerateSummary}
                disabled={events.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                AI Summary
              </Button>
            </div>

            {error && !useDemo && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {summary && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/30 bg-primary/5 p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Gemini AI Summary</h3>
                </div>
                <p className="text-sm text-muted-foreground">{summary}</p>
              </motion.div>
            )}

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
