import { useState, useCallback, useRef, useEffect } from "react";
import type { DetectedFace, DetectionResult } from "./useFaceDetection";

/**
 * Demo mode hook: simulates face detection for environments
 * where camera access is unavailable (e.g., iframes, no webcam).
 * Cycles through scenarios: safe → threat → safe to showcase the app.
 */

interface DemoScenario {
  faces: DetectedFace[];
  isThreat: boolean;
  duration: number; // ms
  message?: string;
  reasoning?: string;
}

const SCENARIOS: DemoScenario[] = [
  // Safe: 1 face (user)
  {
    faces: [
      { topLeft: [180, 100], bottomRight: [340, 300], probability: 0.95 },
    ],
    isThreat: false,
    duration: 6000,
  },
  // Threat: 2 faces — shoulder surfer over right shoulder
  {
    faces: [
      { topLeft: [180, 100], bottomRight: [340, 300], probability: 0.95 },
      { topLeft: [400, 80], bottomRight: [540, 260], probability: 0.88 },
    ],
    isThreat: true,
    duration: 8000,
    message: "⚠ Shoulder surfer detected over your right shoulder.",
    reasoning:
      "Gemini AI: A second face is positioned behind and to the right of the primary user, with gaze oriented toward the screen. Classic over-the-shoulder observation pattern.",
  },
  // Safe again
  {
    faces: [
      { topLeft: [200, 110], bottomRight: [350, 310], probability: 0.93 },
    ],
    isThreat: false,
    duration: 5000,
  },
  // Threat: 3 faces — crowded environment
  {
    faces: [
      { topLeft: [160, 90], bottomRight: [320, 280], probability: 0.96 },
      { topLeft: [380, 70], bottomRight: [510, 240], probability: 0.82 },
      { topLeft: [50, 130], bottomRight: [150, 290], probability: 0.75 },
    ],
    isThreat: true,
    duration: 7000,
    message: "⚠ Multiple observers detected — high-risk environment.",
    reasoning:
      "Gemini AI: Three distinct faces identified. User flanked on both sides — public space pattern. Recommend immediate privacy screen or relocation.",
  },
  // Safe — user alone
  {
    faces: [
      { topLeft: [190, 105], bottomRight: [345, 305], probability: 0.97 },
    ],
    isThreat: false,
    duration: 6000,
  },
  // Threat: 2 faces — close peeker from side
  {
    faces: [
      { topLeft: [180, 100], bottomRight: [340, 300], probability: 0.94 },
      { topLeft: [10, 120], bottomRight: [160, 290], probability: 0.79 },
    ],
    isThreat: true,
    duration: 8000,
    message: "⚠ Side observer detected — someone is peeking from the left.",
    reasoning:
      "Gemini AI: Secondary face detected at the left periphery, oriented toward screen at close range. Indicates intentional viewing of your display.",
  },
];

interface UseDemoModeOptions {
  onThreatDetected?: (result: DetectionResult) => void;
}

export function useDemoMode({ onThreatDetected }: UseDemoModeOptions) {
  const [isRunning, setIsRunning] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [lastResult, setLastResult] = useState<DetectionResult>({
    faces: [],
    isThreat: false,
    faceCount: 0,
    timestamp: new Date(),
  });
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const threatFiredRef = useRef<Set<number>>(new Set());

  const advanceScenario = useCallback(() => {
    setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const scenario = SCENARIOS[scenarioIndex];

    // Add slight random jitter to face positions for realism
    const jitteredFaces = scenario.faces.map((f) => {
      const jx = (Math.random() - 0.5) * 10;
      const jy = (Math.random() - 0.5) * 10;
      return {
        topLeft: [f.topLeft[0] + jx, f.topLeft[1] + jy] as [number, number],
        bottomRight: [f.bottomRight[0] + jx, f.bottomRight[1] + jy] as [number, number],
        probability: f.probability,
      };
    });

    const result: DetectionResult = {
      faces: jitteredFaces,
      isThreat: scenario.isThreat,
      faceCount: jitteredFaces.length,
      timestamp: new Date(),
    };

    setLastResult(result);

    if (scenario.isThreat && onThreatDetected && !threatFiredRef.current.has(scenarioIndex)) {
      threatFiredRef.current.add(scenarioIndex);
      // Attach scenario message/reasoning so Dashboard can show varied alerts
      (result as DetectionResult & { _demoMessage?: string; _demoReasoning?: string })._demoMessage = scenario.message;
      (result as DetectionResult & { _demoMessage?: string; _demoReasoning?: string })._demoReasoning = scenario.reasoning;
      onThreatDetected(result);
    }

    timerRef.current = setTimeout(advanceScenario, scenario.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, scenarioIndex, onThreatDetected, advanceScenario]);

  const start = useCallback(() => {
    threatFiredRef.current.clear();
    setScenarioIndex(0);
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setLastResult({ faces: [], isThreat: false, faceCount: 0, timestamp: new Date() });
  }, []);

  return { isRunning, lastResult, start, stop, isDemo: true };
}
