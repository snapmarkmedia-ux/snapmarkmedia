import { motion } from 'framer-motion';
import React, {   useMemo as useAmbientMemo   } from 'react';
import * as Motion from 'framer-motion';
import {   useTransform as useAmbientTx   } from 'framer-motion';

/**
 * AmbientEffects.jsx
 * Decorative layer: drifting particles, light rays, and a breathing
 * radial glow. All elements are pointer-events: none and low-opacity
 * so they never distract. Parallax props shift the whole layer.
 */




const amb = motion;

function AmbientEffects({ parallax }) {
  /* ── particles (generated once) ────────────────────────────── */
  const particles = useAmbientMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1.5 + Math.random() * 2.5,
        baseOpacity: 0.12 + Math.random() * 0.28,
        dur: 8 + Math.random() * 9,
        delay: Math.random() * 6,
        dx: (Math.random() - 0.5) * 50,
        dy: (Math.random() - 0.5) * 35,
      })),
    []
  );

  /* ── parallax offsets ──────────────────────────────────────── */
  const px = parallax ? useAmbientTx(parallax.x, (v) => v * 25) : 0;
  const py = parallax ? useAmbientTx(parallax.y, (v) => v * 25) : 0;

  return (
    <amb.div
      className="absolute inset-0 overflow-hidden"
      style={{ pointerEvents: "none", x: px, y: py, willChange: "transform" }}
    >
      {/* ── Particles ───────────────────────────────────────── */}
      {particles.map((p) => (
        <amb.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: `rgba(120, 190, 255, ${p.baseOpacity})`,
            boxShadow: `0 0 ${p.size * 3}px rgba(120, 190, 255, ${p.baseOpacity * 0.5})`,
          }}
          animate={{
            x: [0, p.dx, 0],
            y: [0, p.dy, 0],
            opacity: [p.baseOpacity, p.baseOpacity * 0.25, p.baseOpacity],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* ── Light rays ──────────────────────────────────────── */}
      <amb.div
        className="absolute"
        style={{
          top: "-30%",
          left: "18%",
          width: 2,
          height: "160%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(100,180,255,0.06) 40%, transparent 100%)",
          transform: "rotate(22deg)",
          transformOrigin: "top center",
        }}
        animate={{ opacity: [0.25, 0.6, 0.25], x: [-15, 15, -15] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <amb.div
        className="absolute"
        style={{
          top: "-30%",
          right: "25%",
          width: 2,
          height: "160%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(100,180,255,0.04) 50%, transparent 100%)",
          transform: "rotate(-18deg)",
          transformOrigin: "top center",
        }}
        animate={{ opacity: [0.15, 0.45, 0.15], x: [10, -12, 10] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <amb.div
        className="absolute"
        style={{
          top: "-20%",
          left: "55%",
          width: 1.5,
          height: "140%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(140,200,255,0.035) 45%, transparent 100%)",
          transform: "rotate(12deg)",
          transformOrigin: "top center",
        }}
        animate={{ opacity: [0.1, 0.35, 0.1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Breathing glow (behind logo area) ───────────────── */}
      <amb.div
        className="absolute rounded-full"
        style={{
          top: "50%",
          left: "50%",
          width: 520,
          height: 520,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(80,160,255,0.10) 0%, rgba(80,160,255,0.02) 50%, transparent 72%)",
        }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.18, 0.35, 0.18] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </amb.div>
  );
}

export default AmbientEffects;
