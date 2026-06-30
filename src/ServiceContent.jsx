import { motion } from 'framer-motion';
import React, {  useState, useEffect, useRef, useMemo, useCallback  } from 'react';
import { ArrowUpRight } from './icons';
import { PlayIcon } from './icons';
import SERVICES_DATA from './ServicesData';
import * as Motion from 'framer-motion';
import {   AnimatePresence as ServiceAP,  } from 'framer-motion';






/**
 * ServiceContent.jsx
 * Left-side panel for the scroll-driven storytelling.
 * Displays the active service's title, description, highlights,
 * projects, and CTA — with smooth AnimatePresence transitions.
 */



const svc = motion;

function ServiceContent({ activeIndex, onViewWorkHover, onViewWorkClick }) {
  const services = SERVICES_DATA;
  const active = activeIndex >= 0 ? services[activeIndex] : null;

  if (!active) return null;

  return (
    <ServiceAP mode="wait">
      <svc.div
        key={active.id}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="liquid-glass-strong rounded-[1.5rem] p-6 md:p-8 border border-white/10 shadow-2xl max-w-xl flex flex-col"
        style={{
          background: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.08)",
        }}
      >
        {/* ── Kicker ──────────────────────────────────────── */}
        <svc.p
          className="mb-3 font-body text-xs font-medium uppercase tracking-[.2em] text-white/50"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          // Service {String(active.id + 1).padStart(2, "0")}
        </svc.p>

        {/* ── Title ───────────────────────────────────────── */}
        <svc.h2
          className="font-heading text-4xl italic leading-[0.95] tracking-[-2px] sm:text-5xl lg:text-6xl flex items-center gap-3 md:gap-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
        >
          <span 
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.4)] md:h-16 md:w-16"
            style={{ background: active.color }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 md:h-8 md:w-8">
              <path d={active.icon} />
            </svg>
          </span>
          <span style={{ background: active.color, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", paddingRight: "0.1em" }}>
            {active.title}
          </span>
        </svc.h2>

        {/* ── Description ─────────────────────────────────── */}
        <svc.p
          className="mt-4 max-w-md font-body text-sm font-light leading-relaxed text-white/75 md:text-base"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
        >
          {active.description}
        </svc.p>

        {/* ── Highlights ──────────────────────────────────── */}
        <div className="mt-5 flex flex-col gap-1.5">
          {active.highlights.map((h, i) => (
            <svc.div
              key={h}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.07, duration: 0.35 }}
            >
              <span className="h-1 w-1 rounded-full bg-blue-400/80" />
              <span className="font-body text-xs font-light text-white/65">
                {h}
              </span>
            </svc.div>
          ))}
        </div>

        {/* ── Featured Projects ────────────────────────────── */}
        <svc.div
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <p className="mb-2 font-body text-[10px] font-medium uppercase tracking-[.18em] text-white/40">
            Featured Projects
          </p>
          <div className="flex flex-wrap gap-2">
            {active.projects.map((p) => (
              <span
                key={p}
                className="liquid-glass rounded-full px-3 py-1.5 font-body text-[11px] text-white/80"
              >
                {p}
              </span>
            ))}
          </div>
        </svc.div>

        <svc.div
          className="mt-7 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <a
            href="#contact"
            className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium text-white"
          >
            {active.cta} <ArrowUpRight />
          </a>
          {(active.id === 0 || active.id === 1 || active.id === 2 || active.id === 3 || active.id === 4) && (
            <svc.button
              onMouseEnter={() => onViewWorkHover?.(true)}
              onMouseLeave={() => onViewWorkHover?.(false)}
              onClick={(e) => {
                e.preventDefault();
                onViewWorkClick?.();
              }}
              className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-body text-sm font-semibold text-white transition-all duration-300 cursor-pointer select-none"
              style={{
                background: "linear-gradient(90deg, rgba(255, 0, 127, 0.12) 0%, rgba(0, 240, 255, 0.12) 100%)",
                border: "1.5px solid rgba(100, 180, 255, 0.25)",
                boxShadow: "0 4px 15px rgba(0, 240, 255, 0.08)",
              }}
              whileHover={{
                scale: 1.03,
                border: "1.5px solid rgba(255, 0, 127, 0.5)",
                boxShadow: "0 6px 20px rgba(255, 0, 127, 0.2), 0 0 30px rgba(0, 240, 255, 0.15)",
                background: "linear-gradient(90deg, rgba(255, 0, 127, 0.2) 0%, rgba(0, 240, 255, 0.2) 100%)",
              }}
            >
              Past Projects <PlayIcon className="h-3.5 w-3.5 fill-current text-white" />
            </svc.button>
          )}
        </svc.div>
      </svc.div>
    </ServiceAP>
  );
}

export default ServiceContent;
