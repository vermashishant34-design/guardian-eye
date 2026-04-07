import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle, ShieldCheck, Brain } from "lucide-react";
import type { AlertEvent } from "@/types/detection";

interface Props {
  events: AlertEvent[];
}

export default function ActivityLog({ events }: Props) {
  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="rounded-xl border border-border bg-card p-4 h-[400px] overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">Activity Log</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {events.length} events
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence initial={false}>
          {events.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">
              No events yet. Start monitoring to begin.
            </p>
          )}
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`rounded-lg border p-3 text-xs ${
                event.threatLevel === "danger"
                  ? "border-destructive/30 bg-destructive/5"
                  : event.threatLevel === "warning"
                  ? "border-warning/30 bg-warning/5"
                  : "border-safe/30 bg-safe/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {event.threatLevel === "safe" ? (
                  <ShieldCheck className="h-3.5 w-3.5 text-safe" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                )}
                <span className="font-medium">{formatTime(event.timestamp)}</span>
                <span className="text-muted-foreground">
                  {event.faceCount} face{event.faceCount !== 1 ? "s" : ""}
                </span>
              </div>
              {event.aiMessage && (
                <div className="flex items-start gap-1.5 mt-1.5 text-muted-foreground">
                  <Brain className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                  <span>{event.aiMessage}</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
