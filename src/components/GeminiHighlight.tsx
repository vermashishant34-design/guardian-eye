import { motion } from "framer-motion";
import { Brain, Sparkles, ShieldCheck, FileText } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Intelligent Threat Analysis",
    desc: "Gemini analyzes webcam frames to confirm real threats, dramatically reducing false positives from face detection alone.",
  },
  {
    icon: Sparkles,
    title: "Human-Like Alerts",
    desc: "Instead of generic warnings, Gemini generates context-aware, natural-language alert messages explaining what it sees.",
  },
  {
    icon: ShieldCheck,
    title: "Contextual Reasoning",
    desc: "Each alert includes AI reasoning — why it was triggered, confidence level, and recommended action.",
  },
  {
    icon: FileText,
    title: "Smart Event Summaries",
    desc: "Gemini reviews activity logs and generates intelligent summary reports of suspicious events over time.",
  },
];

export default function GeminiHighlight() {
  return (
    <section id="gemini" className="py-24 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6">
            <Brain className="h-3.5 w-3.5" />
            Powered by Google Gemini API
          </div>
          <h2 className="text-4xl font-bold mb-4">
            How <span className="text-gradient-primary">Gemini AI</span> Elevates Detection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Raw face detection catches faces — but Gemini understands <em>intent</em>.
            It analyzes spatial relationships, gaze patterns, and context to determine if someone is actually shoulder surfing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
