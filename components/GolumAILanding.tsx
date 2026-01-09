"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  Blocks,
  Brain,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Database,
  Globe,
  Lock,
  Sparkles,
  Workflow,
} from "lucide-react";

// Golum AI — Futuristic / Quantum-era landing page
// Single-file React component (Tailwind + Framer Motion). No external assets required.

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

function GlowOrb({ className = "", seed = 1 }: { className?: string; seed?: number }) {
  // Procedural glow blob (SVG) for background accents
  const r1 = 120 + (seed % 3) * 20;
  const r2 = 180 + (seed % 4) * 18;
  const hue = 155 + (seed % 6) * 18;

  return (
    <svg
      className={cx("absolute blur-3xl opacity-60", className)}
      width="560"
      height="560"
      viewBox="0 0 560 560"
      aria-hidden
    >
      <defs>
        <radialGradient id={`g-${seed}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`hsl(${hue} 95% 70% / 0.85)`} />
          <stop offset="45%" stopColor={`hsl(${hue + 40} 95% 65% / 0.35)`} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="280" cy="280" r={r2} fill={`url(#g-${seed})`} />
      <circle cx="220" cy="240" r={r1} fill={`url(#g-${seed})`} opacity="0.75" />
    </svg>
  );
}

function QuantumGrid({ className = "" }: { className?: string }) {
  // Animated grid with subtle scanline shimmer
  return (
    <div className={cx("absolute inset-0", className)} aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40" />
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(16,185,129,0.18),transparent)]"
        initial={{ y: "-60%" }}
        animate={{ y: "160%" }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
        style={{ mixBlendMode: "screen" as any }}
      />
      <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_50%_35%,black,transparent_70%)] bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.08),transparent_58%)]" />
    </div>
  );
}

function MagneticButton({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 320, damping: 20 });
  const sy = useSpring(y, { stiffness: 320, damping: 20 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        x.set(dx * 0.15);
        y.set(dy * 0.15);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      className={cx(
        "group relative inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold",
        "bg-white/10 ring-1 ring-white/15 backdrop-blur-xl",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_80px_-30px_rgba(16,185,129,0.55)]",
        "hover:bg-white/14 transition",
        className
      )}
    >
      <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.35),transparent_55%)] opacity-0 group-hover:opacity-100 transition" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

function Pill({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/6 px-4 py-2 text-xs text-white/80 ring-1 ring-white/10">
      {Icon ? <Icon className="h-4 w-4 text-emerald-300" /> : null}
      <span>{children}</span>
    </div>
  );
}

function SectionTitle({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 flex items-center justify-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/6 px-4 py-2 text-xs font-semibold text-white/75 ring-1 ring-white/10">
          <Sparkles className="h-4 w-4 text-amber-300" />
          {kicker}
        </span>
      </div>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      {subtitle ? (
        <p className="mt-4 text-pretty text-base leading-relaxed text-white/70 sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}

function HowItWorksTimeline({ reducedMotion }: { reducedMotion: boolean }) {
  const steps = useMemo(
    () => [
      {
        title: "Connect",
        icon: Blocks,
        desc: "Plug into POS, inventory, e-commerce, and compliance systems. Golum maps your data into a live operational graph.",
        tag: "APIs + Connectors",
      },
      {
        title: "Understand",
        icon: Brain,
        desc: "Dispensary-GPT reads sales, demand signals, product velocity, and customer behavior, then explains what matters in plain English.",
        tag: "Grounded Insights",
      },
      {
        title: "Simulate",
        icon: Cpu,
        desc: "Run a Digital Twin sandbox to test promos, reorder policies, labor schedules, and wholesale decisions before you commit.",
        tag: "Scenario Engine",
      },
      {
        title: "Execute",
        icon: Workflow,
        desc: "Approve actions and let Golum automate safe, reversible moves with audit logs, confidence thresholds, and rollback.",
        tag: "Closed-Loop Ops",
      },
      {
        title: "Prove",
        icon: CheckCircle2,
        desc: "Measure outcomes and continuously learn. What works gets reinforced, what fails gets aborted and remembered.",
        tag: "Continuous Optimization",
      },
    ],
    []
  );

  return (
    <div className="relative mx-auto mt-10 max-w-5xl">
      <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/10 lg:block" />

      <div className="grid gap-6 lg:gap-10">
        {steps.map((s, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={s.title}
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className={cx("relative", "grid items-stretch gap-4", "lg:grid-cols-2")}
            >
              <div className={cx(isLeft ? "lg:col-start-1" : "lg:col-start-2")}>
                <div className="group relative overflow-hidden rounded-3xl bg-white/6 p-6 ring-1 ring-white/12 backdrop-blur-xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.25),transparent_55%)] opacity-0 transition group-hover:opacity-100" />
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                      <s.icon className="h-6 w-6 text-emerald-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                        <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-semibold text-white/70 ring-1 ring-white/10">
                          {s.tag}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">{s.desc}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* center node */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
                <motion.div
                  animate={reducedMotion ? {} : { scale: [1, 1.05, 1] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  className="h-5 w-5 rounded-full bg-emerald-300/80 shadow-[0_0_0_6px_rgba(16,185,129,0.14),0_0_0_1px_rgba(255,255,255,0.25)]"
                />
              </div>

              <div className={cx(isLeft ? "lg:col-start-2" : "lg:col-start-1", "hidden lg:block")}>
                <div className="h-full rounded-3xl border border-white/10 bg-gradient-to-b from-white/4 to-transparent" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Animated flow line (mobile) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-2 mx-auto h-1 w-4/5 rounded-full bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent opacity-50 lg:hidden"
        initial={{ x: "-20%" }}
        animate={reducedMotion ? {} : { x: ["-20%", "20%", "-20%"] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function ProductCards({ reducedMotion }: { reducedMotion: boolean }) {
  const products = [
    {
      title: "Digital Twin",
      subtitle: "Simulation Sandbox",
      icon: Cpu,
      bullets: [
        "Test reorder policies & promos before going live",
        "Model demand waves, stockout risk, and margin impact",
        "What-if scenarios for labor & wholesale fulfillment",
      ],
      accent: "from-emerald-400/25 via-sky-400/15 to-amber-300/10",
    },
    {
      title: "Digital Worker",
      subtitle: "Dispensary-GPT",
      icon: Brain,
      bullets: [
        "Answers questions about inventory, sales, and customers instantly",
        "Surfaces top 3 threats + top 3 actions every day",
        "Executes approved actions with audit logs + rollback",
      ],
      accent: "from-sky-400/25 via-emerald-400/15 to-amber-300/10",
    },
  ];

  return (
    <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-2">
      {products.map((p, idx) => (
        <motion.div
          key={p.title}
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.6, delay: idx * 0.06 }}
          className="group relative overflow-hidden rounded-3xl bg-white/6 p-7 ring-1 ring-white/12 backdrop-blur-xl"
        >
          <div className={cx("absolute inset-0 opacity-70", `bg-gradient-to-br ${p.accent}`)} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.16),transparent_55%)] opacity-0 transition group-hover:opacity-100" />
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-[11px] font-semibold text-white/70 ring-1 ring-white/12">
                  <Blocks className="h-4 w-4 text-amber-300" />
                  Product
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-white">{p.title}</h3>
                <p className="mt-1 text-sm text-white/70">{p.subtitle}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <p.icon className="h-6 w-6 text-emerald-200" />
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {p.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm text-white/78">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-white/12 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/16 transition">
                See modules <ArrowRight className="h-4 w-4" />
              </button>
              <span className="text-xs text-white/55">Built for dispensaries across the USA</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AnimatedTerminal({ reducedMotion }: { reducedMotion: boolean }) {
  const lines = useMemo(
    () => [
      { k: "query", v: "How are we trending vs forecast today?" },
      {
        k: "golum",
        v: "Sales are +7% vs forecast. Basket size is down $3. VIPs are shifting to edibles (+12% WoW).",
      },
      {
        k: "golum",
        v: "Top threats: (1) Pre-rolls stockout in 9 hours. (2) Low conversion at checkout. (3) High churn risk: Loyalty Tier B.",
      },
      {
        k: "golum",
        v: "Actions: (A) Restock pre-rolls 50 units. (B) Auto-send VIP edible promo. (C) Enable 10% basket upsell at checkout.",
      },
      { k: "golum", v: "Confidence: 0.86 · Rollback window: 15 min · Audit log: enabled" },
    ],
    []
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const t = setInterval(() => setIndex((p) => (p + 1) % lines.length), 2300);
    return () => clearInterval(t);
  }, [reducedMotion, lines.length]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-black/40 ring-1 ring-white/12 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
          <div className="h-2 w-2 rounded-full bg-emerald-300" />
          Golum Terminal
        </div>
        <div className="flex items-center gap-2 text-[11px] text-white/50">
          <Lock className="h-4 w-4" />
          Evidence-grounded
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-3 text-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={reducedMotion ? {} : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="leading-relaxed"
            >
              <span
                className={cx(
                  "mr-2 inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ring-1",
                  lines[index].k === "query"
                    ? "bg-sky-400/15 text-sky-200 ring-sky-300/20"
                    : "bg-emerald-400/15 text-emerald-200 ring-emerald-300/20"
                )}
              >
                {lines[index].k === "query" ? "Manager" : "Golum"}
              </span>
              <span className="text-white/80">{lines[index].v}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-5 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <div className="text-[11px] font-semibold text-white/55">Survival Score</div>
              <div className="mt-1 text-xl font-semibold text-white">92</div>
            </div>
            <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <div className="text-[11px] font-semibold text-white/55">Top Retailer</div>
              <div className="mt-1 text-xl font-semibold text-white">GreenLeaf</div>
            </div>
            <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <div className="text-[11px] font-semibold text-white/55">Forecasted Demand</div>
              <div className="mt-1 text-xl font-semibold text-white">+15%</div>
            </div>
          </div>
        </div>
      </div>

      {/* scanline */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(to_bottom,rgba(16,185,129,0.0),rgba(16,185,129,0.14),rgba(16,185,129,0.0))]"
        initial={{ y: "-40%" }}
        animate={reducedMotion ? {} : { y: ["-40%", "120%", "-40%"] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ mixBlendMode: "screen" as any }}
      />
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Is Golum AI a chatbot or an operations system?",
      a: "Both. Golum is Dispensary-GPT for instant answers, plus a closed-loop ops layer that can recommend and execute approved actions with audit logs.",
    },
    {
      q: "How do integrations work?",
      a: "We connect via secure APIs/webhooks to POS, inventory, e-commerce, and compliance tools. Data is normalized into a live operational graph.",
    },
    {
      q: "What makes it quantum-era / futuristic?",
      a: "We use probabilistic forecasting, confidence gating, and simulation (Digital Twin) so decisions are based on probability and survivability not guesses.",
    },
    { q: "Do you support Dutchie?", a: "Yes. Digital Worker is designed to sit on top of Dutchie workflows and execute safe actions inside existing operational constraints." },
  ];

  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="divide-y divide-white/10 overflow-hidden rounded-3xl bg-white/6 ring-1 ring-white/12 backdrop-blur-xl">
        {faqs.map((f) => (
          <details key={f.q} className="group p-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
              <span className="text-base font-semibold text-white">{f.q}</span>
              <ChevronDown className="h-5 w-5 text-white/60 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 ring-1 ring-white/12">
            <Database className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Golum AI</div>
            <div className="text-xs text-white/55">Tech Solutions & Blockchain</div>
          </div>
        </div>
        <div className="text-xs text-white/55">© {new Date().getFullYear()} Golum AI. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default function GolumAILanding() {
  const reducedMotion = usePrefersReducedMotion();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#06070B] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <QuantumGrid />
        <GlowOrb seed={1} className="-left-40 -top-52" />
        <GlowOrb seed={2} className="-right-44 top-20" />
        <GlowOrb seed={3} className="left-20 bottom-[-260px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 ring-1 ring-white/12">
              <Cpu className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Golum AI</div>
              <div className="text-xs text-white/55">Tech Solutions & Blockchain</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <button onClick={() => scrollTo("products")} className="hover:text-white transition">
              Products
            </button>
            <button onClick={() => scrollTo("how")} className="hover:text-white transition">
              How it works
            </button>
            <button onClick={() => scrollTo("why")} className="hover:text-white transition">
              Why Golum
            </button>
            <button onClick={() => scrollTo("faq")} className="hover:text-white transition">
              FAQ
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="hidden rounded-2xl bg-white/8 px-4 py-2 text-sm font-semibold text-white/80 ring-1 ring-white/12 hover:bg-white/12 transition sm:inline-flex"
            >
              Sign in
            </a>
            <MagneticButton onClick={() => scrollTo("cta")}>
              Request demo <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative">
        <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-14 sm:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Pill icon={Globe}>Built for dispensaries across the USA</Pill>
                <Pill icon={Lock}>Secure by design</Pill>
                <Pill icon={Blocks}>Blockchain-ready audit layer</Pill>
              </div>

              <motion.h1
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl"
              >
                Next-Gen operations for dispensaries powered by{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-sky-200 to-amber-200">
                  Golum AI
                </span>
              </motion.h1>

              <motion.p
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg"
              >
                Golum is a Dispensary-GPT that understands your inventory, sales, customers, and wholesale flows,
                then recommends and executes safe, evidence-grounded actions.
              </motion.p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <MagneticButton onClick={() => scrollTo("cta")}>
                  Get a demo <ArrowRight className="h-4 w-4" />
                </MagneticButton>

                <a
                  href="#how"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("how");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/6 px-5 py-3 text-sm font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/10 transition"
                >
                  See how it works <ChevronDown className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Faster decisions", value: "Minutes" },
                  { label: "Confidence gating", value: "Probabilistic" },
                  { label: "Auditability", value: "End-to-end" },
                ].map((s) => (
                  <div key={s.label} className="rounded-3xl bg-white/6 p-5 ring-1 ring-white/10 backdrop-blur-xl">
                    <div className="text-xs font-semibold text-white/55">{s.label}</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="relative"
            >
              <AnimatedTerminal reducedMotion={reducedMotion} />

              <motion.div
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-emerald-300/25 blur-2xl"
                animate={reducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.35, 0.55, 0.35] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -top-10 -right-8 h-28 w-28 rounded-full bg-sky-300/25 blur-2xl"
                animate={reducedMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
                transition={{ duration: 4.9, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="relative mx-auto max-w-6xl px-6 py-16">
          <SectionTitle
            kicker="Products"
            title="Two core modules. One unified intelligence layer."
            subtitle="Build a living operations system: simulate reality with Digital Twin, then execute with a Digital Worker that lives in your workflow."
          />
          <ProductCards reducedMotion={reducedMotion} />
        </section>

        {/* How it works */}
        <section id="how" className="relative mx-auto max-w-6xl px-6 py-16">
          <SectionTitle
            kicker="How it works"
            title="A closed-loop intelligence system which is grounded, safe and auditable"
            subtitle="Golum turns raw data into actions using simulation, probabilistic forecasting, and confidence gating. Everything can be approved, audited, and rolled back."
          />
          <HowItWorksTimeline reducedMotion={reducedMotion} />
        </section>

        {/* Why Golum */}
        <section id="why" className="relative mx-auto max-w-6xl px-6 py-16">
          <SectionTitle
            kicker="Why Golum"
            title="From dashboards to survivability - your operations become a living organism"
            subtitle="We combine AI, simulation, and blockchain-ready auditability to reduce stockouts, protect margins, and compress operational risk."
          />

          <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-3">
            {[
              {
                icon: Database,
                title: "Operational Graph",
                desc: "Your POS, inventory, e-com, and compliance data normalized into a single source of truth for reasoning.",
              },
              {
                icon: Cpu,
                title: "Digital Twin Sandbox",
                desc: "Simulate promos, reorders, and workflows before going live. Reduce exposure with reversible micro-actions.",
              },
              {
                icon: Lock,
                title: "Audit + Control",
                desc: "Every recommendation includes evidence, confidence, abort conditions, and rollback windows. Blockchain-ready ledger if needed.",
              },
            ].map((c) => (
              <motion.div
                key={c.title}
                initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="group relative overflow-hidden rounded-3xl bg-white/6 p-7 ring-1 ring-white/12 backdrop-blur-xl"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.2),transparent_60%)] opacity-0 transition group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                    <c.icon className="h-6 w-6 text-emerald-200" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-6xl rounded-3xl bg-white/6 p-8 ring-1 ring-white/12 backdrop-blur-xl">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-[11px] font-semibold text-white/70 ring-1 ring-white/12">
                  <Blocks className="h-4 w-4 text-amber-300" />
                  Tech Solutions & Blockchain
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-white">Designed for trust, compliance, and speed</h3>
                <p className="mt-2 max-w-2xl text-sm text-white/70">
                  Whether you need an immutable audit trail or simply enterprise-grade tracking, Golum’s action layer is built
                  for secure execution in regulated industries.
                </p>
              </div>
              <MagneticButton onClick={() => scrollTo("cta")}>
                Talk to us <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="relative mx-auto max-w-6xl px-6 py-16">
          <SectionTitle
            kicker="FAQ"
            title="Everything you need to know"
            subtitle="If you’re building the next generation of dispensary operations, we’re building the intelligence layer."
          />
          <FAQ />
        </section>

        {/* CTA */}
        <section id="cta" className="relative mx-auto max-w-6xl px-6 pb-24 pt-10">
          <div className="relative overflow-hidden rounded-3xl bg-white/6 p-10 ring-1 ring-white/12 backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(56,189,248,0.22),transparent_55%)]" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <h3 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Ready to deploy a Digital Worker + Digital Twin?
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                  We’re onboarding beta partners across the USA. If you run dispensary operations, we’ll help you connect,
                  simulate, and automate in weeks.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Pill icon={Lock}>Evidence-grounded answers</Pill>
                  <Pill icon={Workflow}>Approval + rollback</Pill>
                  <Pill icon={Blocks}>Audit layer</Pill>
                </div>
              </div>

              <div className="rounded-3xl bg-black/30 p-6 ring-1 ring-white/12">
                <div className="text-sm font-semibold text-white">Request a demo</div>
                <p className="mt-1 text-xs text-white/55">Leave details and we’ll reach out.</p>
                <form className="mt-5 space-y-3">
                  <input
                    className="w-full rounded-2xl bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/12 outline-none focus:ring-2 focus:ring-emerald-300/40"
                    placeholder="Name"
                  />
                  <input
                    className="w-full rounded-2xl bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/12 outline-none focus:ring-2 focus:ring-emerald-300/40"
                    placeholder="Email"
                    type="email"
                  />
                  <input
                    className="w-full rounded-2xl bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/12 outline-none focus:ring-2 focus:ring-emerald-300/40"
                    placeholder="Company"
                  />
                  <button
                    type="button"
                    className="w-full rounded-2xl bg-white/14 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/14 hover:bg-white/18 transition"
                  >
                    Submit
                  </button>
                </form>
                <div className="mt-4 text-[11px] text-white/50">
                  By submitting, you agree to be contacted by Golum AI.
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

