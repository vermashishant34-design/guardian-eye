import { useRef, useState, useCallback, useEffect } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
import * as tf from "@tensorflow/tfjs";

export interface DetectedFace {
  topLeft: [number, number];
  bottomRight: [number, number];
  probability: number;
}

export interface DetectionResult {
  faces: DetectedFace[];
  isThreat: boolean;
  faceCount: number;
  timestamp: Date;
}

interface UseFaceDetectionOptions {
  sensitivity: number; // 1-5, higher = more sensitive
  onThreatDetected?: (result: DetectionResult) => void;
}

export function useFaceDetection({ sensitivity, onThreatDetected }: UseFaceDetectionOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<blazeface.BlazeFaceModel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<DetectionResult>({
    faces: [],
    isThreat: false,
    faceCount: 0,
    timestamp: new Date(),
  });
  const [error, setError] = useState<string | null>(null);

  // Probability threshold based on sensitivity (1=loose, 5=strict)
  const getThreshold = useCallback(() => {
    return Math.max(0.5, 1 - sensitivity * 0.1);
  }, [sensitivity]);

  const loadModel = useCallback(async () => {
    if (modelRef.current) return;

    try {
      setIsLoading(true);
      await tf.ready();
      const model = await blazeface.load();
      modelRef.current = model;
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load face detection model");
      setIsLoading(false);
    }
  }, []);

  const startCamera = useCallback(async (): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera is not available in this browser.");
        return false;
      }

      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      return true;
    } catch (err) {
      const message = err instanceof DOMException && err.name === "NotAllowedError"
        ? "Camera permission is blocked. Please allow camera access in your browser settings."
        : "Unable to start camera. Please close other camera apps and try again.";
      setError(message);
      return false;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsRunning(false);
  }, []);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.6);
  }, []);

  const detect = useCallback(async () => {
    const model = modelRef.current;
    const video = videoRef.current;
    if (!model || !video || video.readyState < 2) return;

    const predictions = await model.estimateFaces(video, false);
    const threshold = getThreshold();

    const faces: DetectedFace[] = predictions
      .filter((p) => (p.probability as unknown as number[])[0] >= threshold)
      .map((p) => ({
        topLeft: p.topLeft as unknown as [number, number],
        bottomRight: p.bottomRight as unknown as [number, number],
        probability: (p.probability as unknown as number[])[0],
      }));

    // Threat: more than 1 face detected
    const isThreat = faces.length > 1;

    const result: DetectionResult = {
      faces,
      isThreat,
      faceCount: faces.length,
      timestamp: new Date(),
    };

    setLastResult(result);

    if (isThreat && onThreatDetected) {
      onThreatDetected(result);
    }
  }, [getThreshold, onThreatDetected]);

  const detectLoop = useCallback(async () => {
    await detect();
    animFrameRef.current = requestAnimationFrame(detectLoop);
  }, [detect]);

  const start = useCallback(async () => {
    const cameraStarted = await startCamera();
    if (!cameraStarted) return;

    setIsRunning(true);
    await loadModel();
  }, [loadModel, startCamera]);

  useEffect(() => {
    if (isRunning && !isLoading && modelRef.current) {
      detectLoop();
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, isLoading, detectLoop]);

  return {
    videoRef,
    canvasRef,
    isLoading,
    isRunning,
    lastResult,
    error,
    start,
    stop: stopCamera,
    captureFrame,
  };
}
