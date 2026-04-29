import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, X } from "lucide-react";

interface Props {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}

export default function ThreatAlert({ visible, message, onDismiss }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
        >
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 backdrop-blur-xl p-5 glow-danger">
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                <ShieldAlert className="h-6 w-6 text-destructive mt-0.5" />
              </motion.div>
              <div className="flex-1">
                <p className="font-bold text-destructive">⚠ Shoulder Surfing Detected!</p>
                <p className="text-sm text-foreground mt-1">{message}</p>
              </div>
              <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
