import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldOff } from "lucide-react";

interface Props {
  status: "safe" | "warning" | "danger" | "inactive";
  faceCount: number;
}

const config = {
  safe: {
    icon: ShieldCheck,
    label: "Safe",
    color: "text-safe",
    bg: "bg-safe/10 border-safe/30",
    glow: "glow-safe",
  },
  warning: {
    icon: ShieldAlert,
    label: "Risk Detected",
    color: "text-warning",
    bg: "bg-warning/10 border-warning/30",
    glow: "",
  },
  danger: {
    icon: ShieldAlert,
    label: "Threat Detected!",
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/30",
    glow: "glow-danger",
  },
  inactive: {
    icon: ShieldOff,
    label: "Inactive",
    color: "text-muted-foreground",
    bg: "bg-muted border-border",
    glow: "",
  },
};

export default function StatusIndicator({ status, faceCount }: Props) {
  const c = config[status];
  const Icon = c.icon;

  return (
    <motion.div
      key={status}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`rounded-xl border p-6 ${c.bg} ${c.glow}`}
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={status === "danger" ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Icon className={`h-10 w-10 ${c.color}`} />
        </motion.div>
        <div>
          <p className={`text-2xl font-bold ${c.color}`}>{c.label}</p>
          <p className="text-sm text-muted-foreground">
            {faceCount} face{faceCount !== 1 ? "s" : ""} detected
          </p>
        </div>
      </div>
    </motion.div>
  );
}
