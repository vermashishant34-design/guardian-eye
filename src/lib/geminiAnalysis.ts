/**
 * GEMINI AI INTEGRATION
 * 
 * This module handles communication with Google Gemini API via Lovable Cloud
 * edge function. Gemini is used for:
 * 1. Analyzing webcam frames to confirm/deny shoulder surfing threats
 * 2. Generating human-like alert messages
 * 3. Providing contextual reasoning for each detection
 * 4. Generating activity summary reports
 * 
 * This is the core AI integration point for the hackathon.
 */

const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-threat`;

export interface GeminiAnalysis {
  isThreat: boolean;
  confidence: number;
  message: string;
  reasoning: string;
}

/**
 * Send a captured frame to Gemini for intelligent threat analysis.
 * Gemini examines spatial positioning, gaze direction, and context
 * to determine if a detected face represents a genuine shoulder surfing threat.
 */
export async function analyzeWithGemini(
  frameBase64: string,
  faceCount: number
): Promise<GeminiAnalysis> {
  try {
    const resp = await fetch(ANALYZE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ frame: frameBase64, faceCount }),
    });

    if (!resp.ok) {
      console.warn("Gemini analysis unavailable, using fallback");
      return fallbackAnalysis(faceCount);
    }

    return await resp.json();
  } catch {
    return fallbackAnalysis(faceCount);
  }
}

/**
 * Fallback when Gemini API is unavailable — provides basic rule-based analysis.
 */
function fallbackAnalysis(faceCount: number): GeminiAnalysis {
  if (faceCount > 1) {
    return {
      isThreat: true,
      confidence: 0.7,
      message: `Warning: ${faceCount} faces detected. Someone may be looking at your screen.`,
      reasoning: `Multiple faces (${faceCount}) detected in frame. This indicates a potential shoulder surfing attempt. AI analysis unavailable — using heuristic detection.`,
    };
  }
  return {
    isThreat: false,
    confidence: 0.9,
    message: "Environment appears secure.",
    reasoning: "Single face detected — likely the authorized user.",
  };
}

/**
 * Generate an AI-powered summary report of detection events.
 * Uses Gemini to analyze patterns and provide security insights.
 */
export async function generateSummary(
  events: Array<{ timestamp: Date; faceCount: number; threatLevel: string }>
): Promise<string> {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-summary`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ events }),
      }
    );
    if (!resp.ok) throw new Error();
    const data = await resp.json();
    return data.summary;
  } catch {
    const threats = events.filter((e) => e.threatLevel !== "safe").length;
    return `Session Summary: ${events.length} total events, ${threats} threat(s) detected. AI summary unavailable — connect Lovable Cloud for full Gemini-powered reports.`;
  }
}
