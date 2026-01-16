"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import type { LucideIcon } from "lucide-react";
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

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();

    // Modern browsers
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }

    // Safari fallback (older WebKit)
    const legacyMq = mq as MediaQueryList & {
      addListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => void;
      removeListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => void;
    };

    legacyMq.addListener?.(update as any);
    return () => legacyMq.removeListener?.(update as any);
  }, []);

  return reduced;
}

function GlowOrb({ className = "", seed = 1 }: { className?: string; seed?: number }) {
  // Procedural glow blob (SVG) for background accents (teal/cyan)
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

function QuantumGrid({ className = "", reducedMotion }: { className?: string; reducedMotion: boolean }) {
  return (
    <div className={cx("absolute inset-0", className)} aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40" />
      {!reducedMotion ? (
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(16,185,129,0.18),transparent)]"
          initial={{ y: "-60%" }}
          animate={{ y: "160%" }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
          style={{ mixBlendMode: "screen" }}
        />
      ) : null}
      <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_50%_35%,black,transparent_70%)] bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.05),transparent_58%)]" />
    </div>
  );
}

/**
 * Cursor orb that tracks the real cursor 1:1 (no spring smoothing).
 * Uses rAF to avoid flooding updates.
 */
function CursorOrb({ reducedMotion }: { reducedMotion: boolean }) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    if (reducedMotion) return;

    let raf = 0;
    let px = 0;
    let py = 0;

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;

      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        x.set(px);
        y.set(py);
        raf = 0;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [reducedMotion, x, y]);

  if (reducedMotion) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] -translate-x-1/2 -translate-y-1/2"
      style={{ x, y }}
    >
      <div className="h-2.5 w-2.5 rounded-full bg-sky-200/95 shadow-[0_0_0_6px_rgba(56,189,248,0.12),0_0_26px_rgba(56,189,248,0.35)]" />
    </motion.div>
  );
}

function MagneticButton({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cx(
        "group relative inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold",
        "bg-white/10 ring-1 ring-white/15 backdrop-blur-xl",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_80px_-30px_rgba(16,185,129,0.55)]",
        "hover:bg-white/14 transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60",
        disabled && "opacity-60 cursor-not-allowed hover:bg-white/10",
        className
      )}
    >
      <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.35),transparent_55%)] opacity-0 group-hover:opacity-100 transition" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

function Pill({ children, icon: Icon }: { children: React.ReactNode; icon?: LucideIcon }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/6 px-4 py-2 text-xs text-white/80 ring-1 ring-white/10">
      {Icon ? <Icon className="h-4 w-4 text-emerald-300" /> : null}
      <span>{children}</span>
    </div>
  );
}

function SectionTitle({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 flex items-center justify-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/6 px-4 py-2 text-xs font-semibold text-white/75 ring-1 ring-white/10">
          <Sparkles className="h-4 w-4 text-amber-300" />
          {kicker}
        </span>
      </div>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-pretty text-base leading-relaxed text-white/70 sm:text-lg">{subtitle}</p> : null}
    </div>
  );
}

function HowItWorksTimeline({ reducedMotion }: { reducedMotion: boolean }) {
  const steps = useMemo(
    () => [
      {
        title: "Connect",
        icon: Blocks,
        desc: "Connect to inventory, ERP, WMS, e-commerce, and fulfillment systems. Golem maps your data into a live operational graph.",
        tag: "APIs + Connectors",
      },
      {
        title: "Understand",
        icon: Brain,
        desc: "Golem reads inventory, inbound supply, lead times, and fulfillment signals—then explains what matters in plain English.",
        tag: "Grounded Insights",
      },
      {
        title: "Simulate",
        icon: Cpu,
        desc: "Run Digital Twin scenarios inspired by big-tech deployments—capacity, routing, service levels, and supply risk—before you commit.",
        tag: "Scenario Engine",
      },
      {
        title: "Execute",
        icon: Workflow,
        desc: "Approve actions and let Golem automate safe, reversible moves with audit logs, confidence thresholds, and rollback.",
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
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.22),transparent_55%)] opacity-0 transition group-hover:opacity-100" />
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

              <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
                {!reducedMotion ? (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    className="h-5 w-5 rounded-full bg-emerald-300/80 shadow-[0_0_0_6px_rgba(16,185,129,0.14),0_0_0_1px_rgba(255,255,255,0.25)]"
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-emerald-300/70 shadow-[0_0_0_6px_rgba(16,185,129,0.12),0_0_0_1px_rgba(255,255,255,0.25)]" />
                )}
              </div>

              <div className={cx(isLeft ? "lg:col-start-2" : "lg:col-start-1", "hidden lg:block")}>
                <div className="h-full rounded-3xl border border-white/10 bg-gradient-to-b from-white/4 to-transparent" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {!reducedMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-2 mx-auto h-1 w-4/5 rounded-full bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent opacity-50 lg:hidden"
          initial={{ x: "-20%" }}
          animate={{ x: ["-20%", "20%", "-20%"] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
    </div>
  );
}

function ProductCards({ reducedMotion }: { reducedMotion: boolean }) {
  const products = useMemo(
    () => [
      {
        title: "Digital Twin",
        subtitle: "Enterprise Digital Twins",
        icon: Cpu,
        bullets: [
          "Build a real-time twin of inventory, warehousing, and fulfillment",
          "Run what-if simulations inspired by big-tech digital twin programs (capacity, routing, supply risk)",
          "Stress-test reorder policies and promotions before you ship changes",
        ],
        accent: "from-emerald-400/22 via-sky-400/12 to-amber-300/8",
      },
      {
        title: "Digital Worker",
        subtitle: "Inventory + Supply Chain Worker",
        icon: Brain,
        bullets: [
          "Monitors stockout risk, lead times, and supplier performance continuously",
          "Drafts POs, reconciles shipments, and flags exceptions before they become losses",
          "Executes approved actions with audit logs, confidence gating, and rollback",
        ],
        accent: "from-sky-400/22 via-emerald-400/12 to-amber-300/8",
      },
      {
        title: "Co-Pilot",
        subtitle: "Ops Command Center",
        icon: Workflow,
        bullets: [
          "Daily brief: top risks, top actions, and margin protection opportunities",
          "Guided workflows with approvals, playbooks, and operator-in-the-loop control",
          "One place to ask, simulate, and execute—without leaving your stack",
        ],
        accent: "from-emerald-400/18 via-sky-400/12 to-amber-300/8",
      },
    ],
    []
  );

  return (
    <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-3">
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
              <span className="text-xs text-white/55">Designed for inventory + supply chain teams</span>
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
      { k: "query", v: "What’s our stockout risk for the next 7 days?" },
      {
        k: "golem",
        v: "High risk on 3 SKUs: (1) Fast-movers: 2.1 days cover. (2) Long lead-time item: supplier slipping by 4 days. (3) Seasonal spike: demand +18% WoW.",
      },
      {
        k: "golem",
        v: "Top threats: (1) Inbound delay likely. (2) Safety stock below threshold. (3) Pick-pack capacity tight on Friday.",
      },
      {
        k: "golem",
        v: "Actions: (A) Expedite PO #1842. (B) Rebalance inventory across sites. (C) Enable substitution rules at checkout.",
      },
      { k: "golem", v: "Confidence: 0.84 · Rollback window: 15 min · Audit log: enabled" },
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
          Golem Terminal
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
                {lines[index].k === "query" ? "Operator" : "Golem"}
              </span>
              <span className="text-white/80">{lines[index].v}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-5 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <div className="text-[11px] font-semibold text-white/55">Service Level</div>
              <div className="mt-1 text-xl font-semibold text-white">98.1%</div>
            </div>
            <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <div className="text-[11px] font-semibold text-white/55">Lead Time Drift</div>
              <div className="mt-1 text-xl font-semibold text-white">+4d</div>
            </div>
            <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
              <div className="text-[11px] font-semibold text-white/55">Forecasted Demand</div>
              <div className="mt-1 text-xl font-semibold text-white">+15%</div>
            </div>
          </div>
        </div>
      </div>

      {!reducedMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(to_bottom,rgba(16,185,129,0.0),rgba(16,185,129,0.12),rgba(16,185,129,0.0))]"
          initial={{ y: "-40%" }}
          animate={{ y: ["-40%", "120%", "-40%"] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ mixBlendMode: "screen" }}
        />
      ) : null}
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Is Golem AI a tool or an operations system?",
      a: "Both. Golem pairs a conversational interface with a closed-loop ops layer that recommends and executes approved actions with audit logs.",
    },
    {
      q: "How do integrations work?",
      a: "We connect via secure APIs/webhooks to ERP, WMS, inventory, e-commerce, and fulfillment tools. Data is normalized into a live operational graph.",
    },
    {
      q: "What makes it futuristic?",
      a: "We use probabilistic forecasting, confidence gating, and simulation (Digital Twins) so decisions are based on survivability—not guesses.",
    },
    {
      q: "Do you support common ERPs / WMS / e-commerce tools?",
      a: "Yes. The platform is designed to sit on top of existing workflows and execute safe actions inside your operational constraints.",
    },
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
            <div className="text-sm font-semibold text-white">Golem AI</div>
            <div className="text-xs text-white/55">Tech Solutions & Blockchain</div>
          </div>
        </div>
        <div className="text-xs text-white/55">© {new Date().getFullYear()} Golem AI. All rights reserved.</div>
      </div>
    </footer>
  );
}

function DemoForm({ reducedMotion }: { reducedMotion: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [values, setValues] = useState({ name: "", email: "", company: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "success") return;
    setStatus("loading");

    try {
      await new Promise((r) => setTimeout(r, 700));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const isBusy = status === "loading" || status === "success";

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-3">
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-white/60" htmlFor="demo-name">
          Name
        </label>
        <input
          id="demo-name"
          name="name"
          autoComplete="name"
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          className="w-full rounded-2xl bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/12 outline-none focus:ring-2 focus:ring-emerald-300/40"
          placeholder="Your name"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-white/60" htmlFor="demo-email">
          Email
        </label>
        <input
          id="demo-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          className="w-full rounded-2xl bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/12 outline-none focus:ring-2 focus:ring-emerald-300/40"
          placeholder="you@company.com"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-white/60" htmlFor="demo-company">
          Company
        </label>
        <input
          id="demo-company"
          name="company"
          autoComplete="organization"
          required
          value={values.company}
          onChange={(e) => setValues((v) => ({ ...v, company: e.target.value }))}
          className="w-full rounded-2xl bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/12 outline-none focus:ring-2 focus:ring-emerald-300/40"
          placeholder="Company name"
        />
      </div>

      <MagneticButton type="submit" className="w-full" disabled={isBusy}>
        {status === "loading" ? "Submitting…" : status === "success" ? "Request received ✓" : "Submit"}
      </MagneticButton>

      <div aria-live="polite" className="min-h-[16px]">
        {status === "error" ? (
          <div className="text-[11px] text-rose-200/80">Something went wrong. Please try again.</div>
        ) : null}

        {status === "success" ? (
          <div className="text-[11px] text-emerald-200/80">
            Thanks — we’ll reach out shortly. (Demo mode: no network call was made.)
          </div>
        ) : null}
      </div>

      <div className="mt-1 text-[11px] text-white/50">By submitting, you agree to be contacted by Golem AI.</div>
    </form>
  );
}

export default function GolemAILanding() {
  const reducedMotion = usePrefersReducedMotion();

  const scrollTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    },
    [reducedMotion]
  );

  return (
    <div className="min-h-screen bg-[#06070B] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <QuantumGrid reducedMotion={reducedMotion} />
        <GlowOrb seed={1} className="-left-40 -top-52" />
        <GlowOrb seed={2} className="-right-44 top-20" />

        {/* Removed purple blob. Replaced with black depth glow */}
        <div className="absolute left-20 bottom-[-260px] h-[560px] w-[560px] rounded-full bg-black/70 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      {/* Cursor orb (fixed to real cursor, no lag) */}
      <CursorOrb reducedMotion={reducedMotion} />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 ring-1 ring-white/12">
              <Cpu className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Golem AI</div>
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
              Why Golem
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
                <Pill icon={Globe}>Built for modern commerce ops</Pill>
                <Pill icon={Lock}>Secure by design</Pill>
                <Pill icon={Blocks}>Blockchain-ready audit layer</Pill>
              </div>

              <motion.h1
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl"
              >
                Next-gen operations powered by{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-sky-200 to-amber-200">
                  Golem AI
                </span>
              </motion.h1>

              <motion.p
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg"
              >
                Golem is an AI operations layer for inventory and supply chain. It connects to your systems, models
                reality with digital twins, then recommends and executes safe, evidence-grounded actions.
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

              {!reducedMotion ? (
                <>
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-emerald-300/25 blur-2xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.55, 0.35] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -top-10 -right-8 h-28 w-28 rounded-full bg-sky-300/25 blur-2xl"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
                    transition={{ duration: 4.9, repeat: Infinity, ease: "easeInOut" }}
                  />
                </>
              ) : null}
            </motion.div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="relative mx-auto max-w-6xl px-6 py-16">
          <SectionTitle
            kicker="Products"
            title="Three modules. One unified intelligence layer."
            subtitle="Build a living operations system: simulate reality with Digital Twin, execute with a Digital Worker, and steer everything with Co-Pilot."
          />
          <ProductCards reducedMotion={reducedMotion} />
        </section>

        {/* How it works */}
        <section id="how" className="relative mx-auto max-w-6xl px-6 py-16">
          <SectionTitle
            kicker="How it works"
            title="A closed-loop intelligence system that’s grounded, safe, and auditable"
            subtitle="Golem turns raw operational data into actions using simulation, probabilistic forecasting, and confidence gating. Everything can be approved, audited, and rolled back."
          />
          <HowItWorksTimeline reducedMotion={reducedMotion} />
        </section>

        {/* Why */}
        <section id="why" className="relative mx-auto max-w-6xl px-6 py-16">
          <SectionTitle
            kicker="Why Golem"
            title="From dashboards to survivability — operations become a living system"
            subtitle="We combine AI, simulation, and auditability to reduce stockouts, protect margins, and compress operational risk."
          />

          <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-3">
            {[
              {
                icon: Database,
                title: "Operational Graph",
                desc: "ERP, WMS, inventory, e-com, and fulfillment data normalized into a single source of truth for reasoning.",
              },
              {
                icon: Cpu,
                title: "Digital Twin Sandbox",
                desc: "Simulate policies and workflows before going live. Reduce exposure with reversible micro-actions and scenario testing.",
              },
              {
                icon: Lock,
                title: "Audit + Control",
                desc: "Every recommendation includes evidence, confidence, abort conditions, and rollback windows. Ledger-ready if needed.",
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
        </section>

        {/* FAQ */}
        <section id="faq" className="relative mx-auto max-w-6xl px-6 py-16">
          <SectionTitle kicker="FAQ" title="Everything you need to know" subtitle="We’re building the intelligence layer for modern operations." />
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
                  We’re onboarding beta partners. If you run inventory and supply chain operations, we’ll help you connect,
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
                <DemoForm reducedMotion={reducedMotion} />
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

