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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import GeminiHighlight from "@/components/GeminiHighlight";

const features = [
  { icon: Camera, title: "Webcam Monitoring", desc: "Continuous real-time face detection using TensorFlow.js BlazeFace model" },
  { icon: Brain, title: "Gemini AI Analysis", desc: "Google Gemini confirms threats and generates intelligent, contextual alerts" },
  { icon: Bell, title: "Instant Alerts", desc: "Visual and audio notifications the moment a threat is detected" },
  { icon: Lock, title: "Privacy Mode", desc: "Automatically blurs screen content when shoulder surfing is detected" },
  { icon: Eye, title: "Bounding Boxes", desc: "Visual face tracking with user/intruder classification overlays" },
  { icon: BarChart3, title: "Activity Dashboard", desc: "Complete event log with AI-generated security summary reports" },
];

const trustLogos = ["Okta", "Palo Alto", "CrowdStrike", "Datadog", "Atlassian"];

export default function Landing() {
  return (
    <div className="min-h-screen gradient-dark grid-cyber">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-8">
              <Shield className="h-3.5 w-3.5" />
              AI-Powered Privacy Protection
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Defend your screen
              <br />
              <span className="text-gradient-primary">from prying eyes</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Built on TensorFlow.js and{" "}
              <span className="text-primary font-medium">Google Gemini AI</span>,
              ShieldEye detects shoulder surfing in real-time and protects your
              privacy with unmatched precision.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 font-semibold text-primary-foreground glow-primary hover:opacity-90 transition-opacity"
              >
                <ArrowRight className="h-4 w-4" />
                Get Started
              </Link>
              <a
                href="#gemini"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>

        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      </section>

      {/* Trust bar */}
      <section className="border-y border-border/50 py-8">
        <div className="container flex items-center justify-center gap-12 flex-wrap">
          {trustLogos.map((name) => (
            <span
              key={name}
              className="text-sm font-semibold text-muted-foreground/50 tracking-wider uppercase"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Six layers of protection working together to keep your screen private.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4 group-hover:glow-primary transition-shadow">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
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
            className="rounded-2xl border border-primary/20 gradient-card p-12 max-w-3xl mx-auto"
          >
            <Zap className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-3">Ready to protect your privacy?</h2>
            <p className="text-muted-foreground mb-8">
              Start monitoring in seconds. No installation required.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl gradient-primary px-8 py-3.5 font-semibold text-primary-foreground glow-primary hover:opacity-90 transition-opacity"
            >
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>ShieldEye — AI-Powered Shoulder Surfing Detector</span>
          </div>
          <span>Built with Google Gemini API</span>
        </div>
      </footer>
    </div>
  );
}
