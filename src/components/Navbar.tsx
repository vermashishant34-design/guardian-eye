import { Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { label: "PLATFORM", path: "/dashboard" },
  { label: "PROTOCOLS", path: "/#how-it-works" },
  { label: "INTEGRITY", path: "/#gemini" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-2xl"
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="hidden md:flex items-center gap-6">
          {navItems.slice(0, 2).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-[11px] font-medium tracking-[0.15em] uppercase transition-colors hover:text-primary text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md gradient-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold tracking-tight uppercase">ShieldEye</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.slice(2).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-[11px] font-medium tracking-[0.15em] uppercase transition-colors hover:text-primary text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-md border border-foreground/80 px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] uppercase text-foreground hover:bg-foreground hover:text-background transition-all"
          >
            SECURE NOW
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
