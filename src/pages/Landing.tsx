import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  Eye,
  Brain,
  Zap,
  Camera,
  Bell,
  Lock,
  BarChart3,
  ArrowRight,
  Fingerprint,
  Monitor,
  Cpu,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import GeminiHighlight from "@/components/GeminiHighlight";

const stats = [
  { icon: Shield, number: "99.9%", label: "THREATS BLOCKED", tag: "ACTIVE" },
  { icon: Monitor, number: "2.5M", label: "FRAMES ANALYZED", tag: null },
  { icon: Cpu, number: "35ms", label: "RESPONSE TIME", tag: null },
];

const features = [
  { icon: Camera, title: "Webcam Monitoring", desc: "Continuous real-time face detection using TensorFlow.js BlazeFace model" },
  { icon: Brain, title: "Gemini AI Analysis", desc: "Google Gemini confirms threats and generates intelligent, contextual alerts" },
  { icon: Bell, title: "Instant Alerts", desc: "Visual and audio notifications the moment a threat is detected" },
  { icon: Lock, title: "Privacy Mode", desc: "Automatically blurs screen content when shoulder surfing is detected" },
  { icon: Eye, title: "Bounding Boxes", desc: "Visual face tracking with user/intruder classification overlays" },
  { icon: BarChart3, title: "Activity Dashboard", desc: "Complete event log with AI-generated security summary reports" },
];

export default function Landing() {
  return (
    <div className="min-h-screen gradient-dark overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-12 min-h-[90vh] flex flex-col items-center justify-center">
        {/* Arc glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="arc-glow-outer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="arc-glow"
          />
        </div>

        {/* Ambient particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full bg-primary/30"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Version tag */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-6 bg-muted-foreground/30" />
              <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                Ver. 1.0.0
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] mb-8 uppercase">
              <span className="text-foreground">Shield</span>
              <br />
              <span className="text-gradient-primary">Eye</span>
            </h1>

            {/* Status badge + subtitle */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center gap-2 rounded-full border border-safe/30 bg-safe/10 px-4 py-1.5"
              >
                <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
                <span className="text-xs font-mono text-safe tracking-wider uppercase">
                  SYS_STATUS
                </span>
                <span className="text-xs font-bold text-safe">Secure</span>
              </motion.div>
              <p className="text-sm md:text-base text-muted-foreground font-medium">
                Next-Gen Shoulder Surfing Detection
              </p>
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              We leverage{" "}
              <span className="text-primary font-semibold">Google Gemini AI</span>{" "}
              to secure your screen, detect unauthorized viewers,
              and neutralize shoulder surfing threats before they succeed.
            </p>

            {/* CTA buttons */}
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-lg gradient-primary px-7 py-3.5 font-semibold text-primary-foreground glow-primary hover:opacity-90 transition-all uppercase text-sm tracking-wider"
              >
                Secure Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#gemini"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-7 py-3.5 font-semibold text-foreground hover:bg-secondary transition-colors uppercase text-sm tracking-wider"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="container relative z-10 mt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="stat-card rounded-xl p-6 relative overflow-hidden group hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    {stat.tag && (
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-safe text-safe-foreground px-2 py-0.5 rounded">
                        {stat.tag}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-muted-foreground/50">
                      0{i + 1}
                    </span>
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  {stat.number}
                </p>
                <p className="text-[10px] font-mono tracking-[0.2em] text-muted-foreground uppercase mt-1">
                  {stat.label}
                </p>
                {/* Progress bar accent */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: i === 0 ? "99%" : i === 1 ? "75%" : "60%" }}
                    transition={{ delay: 0.8 + i * 0.2, duration: 1 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="py-24 grid-cyber">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-mono tracking-[0.3em] text-primary uppercase mb-4 block">
              Protocols
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Six layers of protection working together to keep your screen private.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 transition-all group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4 group-hover:glow-primary transition-shadow">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gemini highlight section */}
      <GeminiHighlight />

      {/* CTA */}
      <section className="py-24">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border border-primary/20 gradient-card p-12 md:p-16 max-w-3xl mx-auto overflow-hidden"
          >
            {/* Subtle arc glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

            <Fingerprint className="h-10 w-10 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Ready to protect your privacy?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start monitoring in seconds. No installation required.
              Your AI-powered security shield awaits.
            </p>
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-lg gradient-primary px-8 py-3.5 font-semibold text-primary-foreground glow-primary hover:opacity-90 transition-all uppercase text-sm tracking-wider"
            >
              Launch Dashboard
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-mono tracking-wider">SHIELDEYE — AI-Powered Shoulder Surfing Detector</span>
          </div>
          <span className="font-mono tracking-wider">Built with Google Gemini API</span>
        </div>
      </footer>
    </div>
  );
}
