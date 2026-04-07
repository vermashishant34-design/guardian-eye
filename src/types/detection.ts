export interface AlertEvent {
  id: string;
  timestamp: Date;
  faceCount: number;
  threatLevel: "safe" | "warning" | "danger";
  aiMessage?: string;
  aiReasoning?: string;
  screenshot?: string;
  confirmed?: boolean;
}

export interface AppSettings {
  sensitivity: number;
  soundEnabled: boolean;
  privacyMode: boolean;
  autoScreenshot: boolean;
}
