"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Workflow, Brain, Cpu } from "lucide-react";

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

function BrandMark({ className = "" }: { className?: string }) {
  // Match the Products module title gradient (Co-Pilot / Digital Worker / Digital Twin)
  return (
    <span
      className={cx(
        "text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-sky-200 to-amber-200",
        "drop-shadow-[0_0_16px_rgba(251,191,36,0.10)]",
        className
      )}
    >
      GolemAI
    </span>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();

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

/**
 * Moving dot particles background (Canvas-based for performance).
 */
function DotParticles({ reducedMotion }: { reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      a: number;
    }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const count = Math.max(55, Math.floor((w * h) / 36000));
      const arr: typeof particlesRef.current = [];

      for (let i = 0; i < count; i++) {
        const r = Math.random() < 0.14 ? 1.8 : 1.2;
        const speed = (Math.random() * 0.18 + 0.05) * (Math.random() < 0.5 ? -1 : 1);
        const angle = Math.random() * Math.PI * 2;
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          a: Math.random() * 0.55 + 0.15,
        });
      }
      particlesRef.current = arr;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      for (const p of particlesRef.current) {
        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 237, 255, ${Math.min(0.85, p.a)})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 pointer-events-none opacity-100" />;
}

function QuantumGrid({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.05),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.085)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40" />

      {!reducedMotion ? (
        <div className="absolute inset-0 q-scan will-change-transform" style={{ mixBlendMode: "screen" as any }} />
      ) : null}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.55))]" />
    </div>
  );
}

function DotPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-[12px] bg-white/6 px-4 py-2 text-xs text-white/80 ring-1 ring-white/10">
      <span className="h-2 w-2 rounded-[12px] bg-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.45)]" />
      <span>{children}</span>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cx(
        "relative inline-flex items-center justify-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold",
        "bg-white/10 ring-1 ring-white/15 backdrop-blur-xl",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_30px_120px_-50px_rgba(56,189,248,0.55)]",
        "hover:bg-white/14 transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
        className
      )}
    >
      <span className="absolute inset-0 rounded-[12px] bg-[radial-gradient(circle_at_35%_35%,rgba(56,189,248,0.30),transparent_55%)] opacity-0 hover:opacity-100 transition" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/85 ring-1 ring-white/10 hover:bg-white/8 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
    >
      {children}
    </button>
  );
}

function AnimatedTerminal({ reducedMotion }: { reducedMotion: boolean }) {
  const lines = useMemo(
    () => [
      { k: "query", v: "Stockout risk this week?" },
      { k: "golem", v: "Three SKUs at risk today - [..]" },
      { k: "query", v: "Next best action?" },
      { k: "golem", v: "Expedite PO 1842, [..]" },
      { k: "query", v: "Any delays today?" },
      { k: "golem", v: "Supplier B delayed four days [..]" },
    ],
    []
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const t = setInterval(() => setIndex((p) => (p + 1) % lines.length), 2400);
    return () => clearInterval(t);
  }, [reducedMotion, lines.length]);

  return (
    <div className="relative overflow-hidden rounded-[16px] bg-black/45 ring-1 ring-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
          <div className="h-2 w-2 rounded-[12px] bg-emerald-300" />
          <span className="inline-flex items-baseline gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-sky-200 to-emerald-200">
              Golem
            </span>
            <span className="text-white/70">Terminal</span>
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-3 text-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              layout="position"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={reducedMotion ? {} : { opacity: 1 }}
              exit={reducedMotion ? {} : { opacity: 0 }}
              transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
              className="leading-relaxed will-change-transform transform-gpu"
            >
              <span
                className={cx(
                  "mr-2 inline-flex items-center rounded-[12px] px-2 py-1 text-[11px] font-semibold ring-1",
                  lines[index].k === "query"
                    ? "bg-sky-400/15 text-sky-200 ring-sky-300/20"
                    : "bg-emerald-400/15 text-emerald-200 ring-emerald-300/20"
                )}
              >
                {lines[index].k === "query" ? "Store Manager (user)" : "Golem"}
              </span>
              <span className="text-white/80">{lines[index].v}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-5 rounded-[12px] bg-white/5 p-4 ring-1 ring-white/10">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[10px] bg-white/5 p-3 ring-1 ring-white/10">
              <div className="text-[11px] font-semibold text-white/55">Service Level</div>
              <div className="mt-1 text-xl font-semibold text-white">98.1%</div>
            </div>
            <div className="rounded-[10px] bg-white/5 p-3 ring-1 ring-white/10">
              <div className="text-[11px] font-semibold text-white/55">Lead Time Drift</div>
              <div className="mt-1 text-xl font-semibold text-white">+4d</div>
            </div>
            <div className="rounded-[10px] bg-white/5 p-3 ring-1 ring-white/10">
              <div className="text-[11px] font-semibold text-white/55">Forecasted Demand</div>
              <div className="mt-1 text-xl font-semibold text-white">+15%</div>
            </div>
          </div>
        </div>
      </div>

      {/* scanline (no vertical motion) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(to_bottom,rgba(56,189,248,0.0),rgba(56,189,248,0.08),rgba(56,189,248,0.0))]"
        initial={{ opacity: 0.22 }}
        animate={reducedMotion ? {} : { opacity: [0.16, 0.32, 0.16] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ mixBlendMode: "screen" as any }}
      />
    </div>
  );
}

function HowItWorksSection({ reducedMotion }: { reducedMotion: boolean }) {
  const steps = useMemo(
    () => [
      {
        tag: "APIs + Connectors",
        title: "Connect",
        desc: "Plug into POS, inventory, e-commerce, and compliance systems. Golem maps your data into a live operational graph.",
      },
      {
        tag: "Grounded Insights",
        title: "Understand",
        desc: "Golem reads sales, demand signals, product velocity, and customer behavior, then explains what matters in plain English.",
      },
      {
        tag: "Scenario Engine",
        title: "Simulate",
        desc: "Run a Digital Twin sandbox to test promos, reorder policies, labor schedules, and wholesale decisions before you commit.",
      },
      {
        tag: "Closed-Loop Ops",
        title: "Execute",
        desc: "Approve actions and let Golem automate safe, reversible moves with audit logs, confidence thresholds, and rollback.",
      },
      {
        tag: "Continuous Optimization",
        title: "Prove",
        desc: "Measure outcomes and continuously learn. What works gets reinforced; what fails gets aborted and remembered.",
      },
    ],
    []
  );

  return (
    <section id="how" className="relative mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-3 flex items-center justify-center">
          <span className="inline-flex items-center rounded-[12px] bg-white/6 px-4 py-2 text-xs font-semibold text-white/75 ring-1 ring-white/10">
            How it works
          </span>
        </div>

        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Closed-loop intelligence. Grounded and auditable.
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
          Connect, understand, simulate, execute, prove. <br />
          Everything can be approved, audited, and rolled back.
        </p>
      </div>

      <div className="relative mx-auto mt-12 max-w-6xl">
        {/* center line (desktop) */}
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/10 lg:block" />

        <div className="space-y-7">
          {steps.map((s, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={s.title}
                initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="relative grid gap-6 lg:grid-cols-[1fr_72px_1fr] lg:items-start"
              >
                {/* spacer (desktop) */}
                <div className={cx("hidden lg:block", isLeft ? "lg:col-start-3" : "lg:col-start-1")} />

                {/* center column spacer (keeps the timeline gutter width) */}
                <div className="hidden lg:block lg:col-start-2" aria-hidden />

                {/* card (same feel as product cards, no icons, no extra outer frame divs) */}
                <div className={cx("relative", isLeft ? "lg:col-start-1" : "lg:col-start-3")}>
                  <div
                    className={cx(
                      "pointer-events-none absolute top-1/2 hidden -translate-y-1/2 lg:block",
                      isLeft ? "right-[-60px] translate-x-1/2" : "left-[-60px] -translate-x-1/2"
                    )}
                    aria-hidden
                  >
                    <div className="h-3 w-3 rounded-[12px] bg-emerald-300 shadow-[0_0_0_10px_rgba(16,185,129,0.10),0_0_30px_rgba(16,185,129,0.22)]" />
                  </div>
                  <div className="group relative overflow-hidden rounded-[16px] bg-white/6 p-7 ring-1 ring-white/10 backdrop-blur-xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.12),transparent_60%)] opacity-0 transition group-hover:opacity-100" />
                    <div className="relative z-10">
                      <div className="inline-flex items-center rounded-[12px] bg-white/6 px-3 py-1 text-[11px] font-semibold text-white/65 ring-1 ring-white/10">
                        {s.tag}
                      </div>
                      <h3 className="mt-3 text-xl font-semibold">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-sky-200 to-sky-100">
                          {s.title}
                        </span>
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">{s.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyGolemSection({ reducedMotion }: { reducedMotion: boolean }) {
  const items = useMemo(
    () => [
      {
  title: "Live Operational Graph / GPT",
  // Change "desc" from a string to a JSX Fragment
  desc: (
    <>
      Your POS, inventory, e-com, and compliance data normalized into a single
      source of truth for reasoning. Leverage a &apos;live&apos; GPT that is
      informed in real-time &amp; is powered/trained by Golem&apos;s federated
      live-learning models.
      <br />
      <br />
      <span className="text-emerald-300 font-mono text-xs tracking-widest opacity-80">
        ▶︎ •၊၊||၊|။||||۔‌‌‌‌‌၊|၊၊||၊|။||||۔‌‌‌‌‌၊|• 0:10
      </span>
    </>
  ),
},,
      {
        title: "Digital Twin Sandbox",
        desc: "Simulate promos, reorders, and workflows before going live. Reduce exposure with reversible micro-actions. We love the idea of superintelligence. But what we are also after, beyond abstract mathematics and formalism, is 'expanding' artificial intelligence with the 'human' and 'socio' of your business' design to solve EPs (Explainability Pitfalls). Inherent in our system design is a large learning model that expands with these seams.",
      },
      {
        title: "Audit + Control",
        desc: "Every recommendation includes evidence, confidence, abort conditions, and rollback windows. We also support Blockchain-ready ledgers. A seamless design will tell you the wi-fi is weak. A seamful one will answer you 'where'. A seamful design (as opposed to existing 'seamless' designs AI systems suffer from) means Golem's AI is designed not to conceal, but expand upon its 'seams' to reveal potential blindspots and reduce information bloat.",
      },
    ],
    []
  );

  return (
    <section id="why" className="relative mx-auto max-w-6xl px-6 py-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.10),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,rgba(56,189,248,0.10),transparent_62%)]" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-3 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-[12px] bg-white/6 px-4 py-2 text-xs font-semibold text-white/75 ring-1 ring-white/10">
            Why Golem
          </span>
        </div>

        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          From dashboards to survivability: your operations become a living organism
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
          We combine AI, simulation, and blockchain-ready auditability to reduce stockouts, protect margins, and compress
          operational risk.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-3">
        {items.map((c, idx) => (
          <motion.div
            key={c.title}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: idx * 0.05 }}
            className="relative overflow-hidden rounded-[16px] bg-white/6 p-7 ring-1 ring-white/10 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.10),transparent_60%)] opacity-60" />
            <div className="relative z-10">
              <h3 className="mt-1 text-lg font-semibold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-sky-200 to-sky-100">
                  {c.title}
                </span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{c.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-6xl">
        <div className="relative overflow-hidden rounded-[16px] bg-white/6 p-8 ring-1 ring-white/10 backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(56,189,248,0.10),transparent_60%)]" />
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Designed for trust, compliance, and speed</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
                Whether you need an immutable audit trail or simply enterprise-grade tracking, Golem’s action layer is
                built for secure execution in regulated industries.
              </p>
            </div>

            <a
              href="#cta"
              className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-white/8 px-5 py-2.5 text-sm font-semibold text-white/85 ring-1 ring-white/12 hover:bg-white/12 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              Talk to us <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "What is Golem AI?",
      a: "Golem is an AI operations layer for your inventory management/supply-chain optimization. It connects to your systems, models reality with digital twins, then recommends safe, evidence-grounded actions.",
    },
    {
      q: "How do integrations work?",
      a: "We integrate via secure APIs and webhooks across ERP, WMS, inventory, and commerce systems. Data is normalized into an operational graph for consistent reasoning.",
    },
    {
      q: "Can actions be controlled and audited?",
      a: "Yes. Recommendations include evidence, confidence, abort conditions, and rollback windows. Execution can be approval-based with full audit logging.",
    },
    {
      q: "Is this meant to replace our tools?",
      a: "No. Golem sits on top of your current stack to coordinate decisions, simulations, and approved actions without forcing a rip-and-replace.",
    },
  ];

  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="divide-y divide-white/10 overflow-hidden rounded-[16px] bg-white/6 ring-1 ring-white/10 backdrop-blur-xl">
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

function DemoForm() {
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

  const inputClass =
    "appearance-none bg-black/35 text-white placeholder:text-white/35 ring-1 ring-white/10 outline-none " +
    "focus:ring-2 focus:ring-white/20 w-full rounded-[12px] px-4 py-3 text-sm";

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
          className={inputClass}
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
          className={inputClass}
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
          className={inputClass}
          placeholder="Company name"
        />
      </div>

      <PrimaryButton type="submit" className={cx("w-full", isBusy && "opacity-70")}>
        {status === "loading" ? "Submitting…" : status === "success" ? "Request received ✓" : "Submit"}
      </PrimaryButton>

      <div aria-live="polite" className="min-h-[16px]">
        {status === "error" ? (
          <div className="text-[11px] text-rose-200/80">Something went wrong. Please try again.</div>
        ) : null}
        {status === "success" ? (
          <div className="text-[11px] text-emerald-200/80">Thanks, we’ll reach out shortly. (Demo mode)</div>
        ) : null}
      </div>

      <div className="mt-1 text-[11px] text-white/50">By submitting, you agree to be contacted by Golem AI.</div>
    </form>
  );
}

function Footer() {
  return (
    <footer className="py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <BrandMark className="text-sm font-semibold text-white" />
        </div>
        <div className="text-xs text-white/55">© {new Date().getFullYear()} Golem AI. All rights reserved.</div>
      </div>
    </footer>
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
        <style>{`
          /* Seamless scan: animate background-position so the loop never “snaps” */
          @keyframes qScan {
            from { background-position: 0px -260px; }
            to   { background-position: 0px 260px; }
          }
          .q-scan {
            background-image: linear-gradient(to bottom, transparent, rgba(16,185,129,0.03), transparent);
            background-size: 100% 260px;
            background-repeat: repeat-y;
            animation: qScan 10s linear infinite;
            will-change: background-position;
          }
        `}</style>
        <DotParticles reducedMotion={reducedMotion} />
        <QuantumGrid reducedMotion={reducedMotion} />

        {/* No purple. Only teal/cyan accents + black depth */}
        <div className="absolute -left-40 -top-56 h-[620px] w-[620px] rounded-[12px] bg-emerald-400/2 blur-3xl" />
        <div className="absolute -right-44 top-10 h-[640px] w-[640px] rounded-[12px] bg-sky-400/2 blur-3xl" />
        <div className="absolute left-10 bottom-[-320px] h-[780px] w-[780px] rounded-[12px] bg-black/85 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-b from-black/70 via-black/35 to-black/0 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-6 px-6 py-4">
          <div className="flex items-center gap-3">
            <BrandMark className="text-sm font-semibold" />
          </div>

          <nav className="hidden items-center justify-center gap-8 text-sm text-white/70 md:flex">
            <button onClick={() => scrollTo("products")} className="hover:text-white transition">
              Three Modules
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

          <div className="flex items-center justify-end gap-3">
            <GhostButton onClick={() => {}}>Sign in</GhostButton>
            <PrimaryButton onClick={() => scrollTo("cta")}>
              Request demo <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-14 sm:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <DotPill>Built for modern commerce </DotPill>
                <DotPill>Secure by design</DotPill>
                <DotPill>Audit-ready execution</DotPill>
              </div>

              <motion.h1
                initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mt-7 text-balance text-4xl font-semibold tracking-tight sm:text-6xl"
              >
                Next-Gen Ops/Retail{" "} <span className="italic text-gray-500">Seed → Sale</span> in “Natural
                Language ▶︎ •၊၊||၊|။||||۔‌‌‌‌‌၊|•  powered by{" "}
                <BrandMark className="whitespace-nowrap" />
              </motion.h1>

              <motion.p
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg"
              >
                Golem is an AI operations layer. Our custom context protocols connect to your systems and help sand-box/execute safe, evidence-grounded realities.
              </motion.p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <PrimaryButton onClick={() => scrollTo("cta")}>
                  Get in touch <ArrowRight className="h-4 w-4" />
                </PrimaryButton>

                <GhostButton onClick={() => scrollTo("how")}>
                  See how it works <ChevronDown className="h-4 w-4" />
                </GhostButton>
              </div>

              <div className="mt-9 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "POs drafted", value: "Auto" },
                  { label: "Alerts handled", value: "Instant" },
                  { label: "Approvals + rollback", value: "Built-in" },
                ].map((s) => (
                  <div key={s.label} className="rounded-[16px] bg-white/6 p-5 ring-1 ring-white/10 backdrop-blur-xl">
                    <div className="text-xs font-semibold text-white/55">{s.label}</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="relative"
            >
              <AnimatedTerminal reducedMotion={reducedMotion} />
            </motion.div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="relative mx-auto max-w-6xl px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 flex items-center justify-center">
              <span className="inline-flex items-center rounded-[12px] bg-white/6 px-4 py-2 text-xs font-semibold text-white/75 ring-1 ring-white/10">
                Products
              </span>
            </div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Three modules. One unified intelligence layer.
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
              Simulate reality with Digital Twin, execute with a Digital Worker that lives in your workflow, build a
              living operations system powered by an intel that evolves with your customer.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-3">
            {[
              {
                title: "Co-Pilot",
                subtitle: "The Control Room",
                icon: Workflow,
                bullets: [
                  "Daily brief: top risks and top actions",
                  "Guided workflows and operator-in-the-loop approvals",
                  "Ask, simulate, and execute without leaving your stack",
                ],
              },
              {
                title: "Digital Worker",
                subtitle: "Inventory + Supply Chain Worker",
                icon: Brain,
                bullets: [
                  "Monitors stockout risk, lead times, and supplier performance",
                  "Drafts POs, reconciles inbound, and flags exceptions early",
                  "Executes approved actions with confidence gating and rollback",
                ],
              },
              {
                title: "Digital Twin",
                subtitle: "Enterprise Digital Twins",
                icon: Cpu,
                bullets: [
                  "Model inventory, warehousing, and fulfillment in real time",
                  "Run what-if simulations and plan ahead",
                  "Stress-test reorder policies and supply risk before changes go live",
                ],
              },
            ].map((p, idx) => {
              return (
                <motion.div
                  key={p.title}
                  initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, delay: idx * 0.05 }}
                  className="group relative overflow-hidden rounded-[16px] bg-white/6 p-7 ring-1 ring-white/10 backdrop-blur-xl"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.12),transparent_60%)] opacity-0 transition group-hover:opacity-100" />
                  {/* Framer-like multi-frame edges */}
                  <div className="pointer-events-none absolute inset-0 rounded-[16px] ring-1 ring-white/10" />
                  <div className="pointer-events-none absolute inset-3 rounded-[12px] ring-1 ring-white/10 opacity-60" />

                  <div className="relative z-10">
                    <div className="flex items-start gap-4">
                      <div>
                        <h3 className="text-2xl font-semibold">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A6E2EF] via-[#B1E7D8] to-[#CDECBB] drop-shadow-[0_0_18px_rgba(166,226,239,0.22)]">
                            {p.title}
                          </span>
                        </h3>
                        <p className="mt-1 text-sm text-white/70">{p.subtitle}</p>
                      </div>
                    </div>

                    <ul className="mt-6 space-y-3">
                      {p.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-sm text-white/78">
                          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-[12px] bg-sky-200/95 shadow-[0_0_0_6px_rgba(56,189,248,0.10),0_0_22px_rgba(56,189,248,0.35)]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <HowItWorksSection reducedMotion={reducedMotion} />

        <WhyGolemSection reducedMotion={reducedMotion} />

        {/* FAQ */}
        <section id="faq" className="relative mx-auto max-w-6xl px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 flex items-center justify-center">
              <span className="inline-flex items-center rounded-[12px] bg-white/6 px-4 py-2 text-xs font-semibold text-white/75 ring-1 ring-white/10">
                FAQ
              </span>
            </div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Everything you need to know
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
              Built for teams who want an impressive, modern ops layer, not another dashboard.
            </p>
          </div>

          <FAQ />
        </section>

        {/* CTA */}
        <section id="cta" className="relative mx-auto max-w-6xl px-6 pb-24 pt-10">
          <div className="relative overflow-hidden rounded-[16px] bg-white/6 p-10 border border-white/10 backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.06),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(56,189,248,0.09),transparent_55%)]" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <h3 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-sky-200 to-emerald-200 drop-shadow-[0_0_18px_rgba(56,189,248,0.18)]">
                    Ready to deploy a Digital Worker and Digital Twin?
                  </span>
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                  We’re onboarding beta partners. If you run inventory and supply chain operations, we’ll help you connect,
                  simulate, and automate in weeks.
                </p>
              </div>

              <div className="rounded-[16px] bg-black/35 p-6 border border-white/10 backdrop-blur-xl">
                <div className="text-sm font-semibold text-white">Request a demo</div>
                <p className="mt-1 text-xs text-white/55">Leave details and we'll reach out...</p>
                <DemoForm />
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

