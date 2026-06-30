import { motion } from 'framer-motion';
import SERVICES_DATA from './ServicesData';
import * as Motion from 'framer-motion';



import React, {  
  useState as useIntroState,
  useEffect as useIntroEffect,
  useRef as useIntroRef,
  useCallback as useIntroCb,
  } from 'react';

import {  
  AnimatePresence as IntroAP,
  useMotionValue as useIntroMV,
  } from 'framer-motion';

const SERVICE_ICONS_INTRO = [
  "M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4Z",
  "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4Z",
  "M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10ZM12 13 3.74 7.84 12 3l8.26 4.84L12 13Z",
  "M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4Z",
  "M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm0 16H3V5h18v14Zm-5-7 -7 4V8l7 4Z",
  "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2Zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2Z",
  "M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z",
];

const SERVICE_GRADIENTS_INTRO = [
  { id: "intro-grad-0", from: "#ff007f", to: "#00f0ff" },
  { id: "intro-grad-1", from: "#8b5cf6", to: "#ec4899" },
  { id: "intro-grad-2", from: "#f472b6", to: "#fb7185" },
  { id: "intro-grad-3", from: "#fbbf24", to: "#f87171" },
  { id: "intro-grad-4", from: "#38bdf8", to: "#34d399" },
  { id: "intro-grad-5", from: "#a78bfa", to: "#f472b6" },
  { id: "intro-grad-6", from: "#60a5fa", to: "#c084fc" },
];

function IntroSequence({ onComplete }) {
  const services = SERVICES_DATA;
  const count = services.length;
  const angleStep = 360 / count;
  const RADIUS = window.innerWidth < 640 ? 120 : window.innerWidth < 1024 ? 160 : 200;

  const [phase, setPhase] = useIntroState("logo");       /* logo → assembly → rotating → done */
  const [panelsIn, setPanelsIn] = useIntroState(0);       /* how many panels have flown in */
  const ringAngle = useIntroMV(0);
  const rafRef = useIntroRef(null);

  /* ── phase transitions ─────────────────────────────────────── */
  useIntroEffect(() => {
    const t1 = setTimeout(() => setPhase("assembly"), 900);
    return () => clearTimeout(t1);
  }, []);

  /* stagger panels during assembly */
  useIntroEffect(() => {
    if (phase !== "assembly") return;
    if (panelsIn >= count) {
      /* all panels in → start rotating */
      const t = setTimeout(() => setPhase("rotating"), 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPanelsIn((n) => n + 1), 140);
    return () => clearTimeout(t);
  }, [phase, panelsIn, count]);

  /* start slow rotation then fade out */
  useIntroEffect(() => {
    if (phase !== "rotating") return;
    let last = performance.now();
    let running = true;
    const speed = 360 / 50; /* deg/s */

    const tick = (now) => {
      if (!running) return;
      ringAngle.set(ringAngle.get() + speed * ((now - last) / 1000));
      last = now;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    /* after 0.8s of rotation, signal complete */
    const tDone = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 800);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(tDone);
    };
  }, [phase]);

  if (phase === "done") return null;

  /* ── fly-in origins (spread around for variety) ──────────── */
  const origins = [
    { x: -400, y: -200, rot: -45 },
    { x: 350, y: -280, rot: 30 },
    { x: -300, y: 250, rot: 55 },
    { x: 400, y: 180, rot: -35 },
    { x: -200, y: -350, rot: 25 },
    { x: 300, y: 300, rot: -50 },
    { x: 0, y: 400, rot: 40 },
  ];

  return (
    <intro.div
      className="intro-overlay flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "rotating" ? 0 : 1 }}
      transition={{ duration: 0.8, delay: phase === "rotating" ? 0.1 : 0 }}
      style={{ willChange: "opacity" }}
    >
      {/* ── ambient glow ─────────────────────────────────── */}
      <intro.div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(60,140,255,0.08) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Logo ─────────────────────────────────────────── */}
      <intro.div
        className="relative z-10"
        initial={{ scale: 0.7, opacity: 0, filter: "blur(12px)" }}
        animate={{
          scale: [0.7, 1.06, 1],
          opacity: [0, 1, 1],
          filter: ["blur(12px)", "blur(2px)", "blur(0px)"],
        }}
        transition={{ duration: 0.9, times: [0, 0.65, 1], ease: "easeOut" }}
      >
        <intro.div
          className="relative flex items-center justify-center rounded-[1.5rem] overflow-hidden"
          style={{ width: 100, height: 100, padding: "1.5px" }}
        >
          {/* Rotating colorful gradient border */}
          <div
            className="absolute inset-0 z-0 animate-spin"
            style={{
              background: "linear-gradient(90deg, #ff007f, #00f0ff, #8b5cf6, #34d399, #ff007f)",
              backgroundSize: "200% 200%",
              animation: "spin 6s linear infinite",
              borderRadius: "1.5rem",
            }}
          />
          {/* Inner content container */}
          <div
            className="absolute inset-[1.5px] z-10 bg-black/85 backdrop-blur-md rounded-[1.4rem] flex items-center justify-center"
            style={{ width: "97px", height: "97px" }}
          >
            <img
              src="assets/snapmark-logo.png"
              alt="SnapMark Media"
              style={{
                width: 72,
                height: 72,
                objectFit: "contain",
                borderRadius: "0.6rem",
              }}
            />
          </div>
        </intro.div>
      </intro.div>

      {/* ── Ring of panels ───────────────────────────────── */}
      <intro.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          perspective: 1200,
        }}
      >
        <intro.div
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            rotateY: ringAngle,
            rotateX: -8,
            width: 1,
            height: 1,
          }}
        >
          {services.map((svc, i) => {
            const visible = i < panelsIn;
            const origin = origins[i] || origins[0];
            const panelAngle = i * angleStep;
            const grad = SERVICE_GRADIENTS_INTRO[i] || SERVICE_GRADIENTS_INTRO[0];

            return (
              <div
                key={svc.id}
                className="absolute"
                style={{
                  width: 110,
                  height: 60,
                  left: -55,
                  top: -30,
                  transform: `rotateY(${panelAngle}deg) translateZ(${RADIUS}px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <intro.div
                  className="flex h-full w-full flex-col items-center justify-center rounded-[0.75rem]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.08)",
                  }}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 14,
                    mass: 0.7,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    style={{ width: 16, height: 16 }}
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id={grad.id} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={grad.from} />
                        <stop offset="100%" stopColor={grad.to} />
                      </linearGradient>
                    </defs>
                    <path d={SERVICE_ICONS_INTRO[i] || SERVICE_ICONS_INTRO[0]} fill={`url(#${grad.id})`} />
                  </svg>
                  <span className="mt-1 font-body text-[8px] font-medium text-center text-white/80 px-2 leading-tight">
                    {svc.title}
                  </span>
                </intro.div>
              </div>
            );
          })}
        </intro.div>
      </intro.div>
    </intro.div>
  );
}

export default IntroSequence;
