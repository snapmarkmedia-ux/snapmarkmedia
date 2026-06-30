import { motion } from 'framer-motion';
import AmbientEffects from './AmbientEffects';
import Hero, { rise } from './Hero';
import { PlayIcon } from './icons';
import { ClockIcon } from './icons';
import { GlobeIcon } from './icons';
import IntroSequence from './IntroSequence';
import LogoOrbit from './LogoOrbit';
import Navbar from './Navbar';
import ServiceContent from './ServiceContent';
import SERVICES_DATA from './ServicesData';
import useMouseParallax from './useMouseParallax';
import * as Motion from 'framer-motion';













const ch = motion;

/**
 * CinematicHero.jsx
 * Master orchestrator — ties IntroSequence, LogoOrbit, ServiceContent,
 * AmbientEffects, and useMouseParallax together into a scroll-driven
 * cinematic hero experience.
 *
 * Layout (after intro):
 *   ┌──────────────────────────────────────┐
 *   │  sticky viewport (100vh)             │
 *   │  ┌─────────────┬──────────────────┐  │
 *   │  │  left text   │  LogoOrbit      │  │
 *   │  │  (hero or    │  + Ambient      │  │
 *   │  │  service)    │                 │  │
 *   │  └─────────────┴──────────────────┘  │
 *   └──────────────────────────────────────┘
 *   Scroll container height = (services + 2) * 100vh
 */
import React, {  
  useState as useCHState,
  useEffect as useCHEffect,
  useRef as useCHRef,
  useCallback as useCHCb,
  useMemo as useCHMemo,
  } from 'react';

function MobileHero({ parallax, setMobileModalIndex, setViewWorkPersist }) {
  
const m = motion;
  const services = SERVICES_DATA || [];
  const [idleAngle, setIdleAngle] = React.useState(0);
  
  React.useEffect(() => {
    let last = performance.now();
    let raf;
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      const speed = 360 / 85; 
      setIdleAngle(prev => prev + speed * dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex lg:hidden flex-col w-full min-h-screen relative z-10 pt-[10vh] overflow-hidden">
      <Navbar />
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AmbientEffects parallax={parallax} />
      </div>

      <div className="flex flex-col items-center justify-center px-6 text-center mb-8 z-10">
        <m.div className="liquid-glass flex items-center gap-2 rounded-full p-1 mb-4">
          <span className="rounded-full bg-white px-3 py-1 font-body text-xs font-semibold text-black">Studio</span>
          <span className="pr-3 font-body text-xs text-white/90 sm:text-sm">Premium Creative Studio</span>
        </m.div>
        
        <h1 className="max-w-3xl font-heading text-5xl italic leading-[0.85] tracking-[-2px] text-white select-none flex flex-wrap gap-x-3 justify-center">
          {"Snapmark Media".split(" ").map((word, wIdx) => (
            <span key={wIdx} className="inline-flex overflow-hidden">
              {word.split("").map((letter, lIdx) => (
                <m.span
                  key={lIdx}
                  className={`inline-block bg-clip-text text-transparent ${
                    wIdx === 0 && lIdx >= 4
                      ? "bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600"
                      : "bg-gradient-to-b from-white via-white to-white/70"
                  }`}
                >
                  {letter}
                </m.span>
              ))}
            </span>
          ))}
        </h1>
      </div>

      <div className="flex h-[45vh] w-full items-center justify-center relative mb-8 z-10">
         <LogoOrbit 
           rotationAngle={0} 
           idleAngle={idleAngle} 
           activeIndex={-1} 
           parallax={parallax}
           compact={true}
           mobileMode={true}
         />
      </div>

      <div className="flex flex-col items-center justify-center px-6 text-center mb-16 z-10">
        <p className="max-w-lg font-body text-sm font-light leading-relaxed text-white/80">
          Transforming bold ideas into cinematic visuals. We craft premium video content, dynamic edits, and immersive designs that elevate your brand.
        </p>

        <div className="mt-8 flex flex-wrap items-stretch justify-center gap-3">
          <div className="liquid-glass flex min-h-[90px] w-[calc(50%-6px)] sm:w-[130px] flex-col rounded-[1rem] p-4 text-left">
            <ClockIcon />
            <div className="mt-auto pt-3">
              <div className="font-heading text-2xl italic leading-none tracking-[-1px] text-white">1+ Year</div>
              <div className="mt-1 font-body text-[9px] font-light text-white/60">Experience</div>
            </div>
          </div>
          <div className="liquid-glass flex min-h-[90px] w-[calc(50%-6px)] sm:w-[130px] flex-col rounded-[1rem] p-4 text-left">
            <GlobeIcon />
            <div className="mt-auto pt-3">
              <div className="font-heading text-2xl italic leading-none tracking-[-1px] text-white">7+</div>
              <div className="mt-1 font-body text-[9px] font-light text-white/60">Creative Partners</div>
            </div>
          </div>
          <div className="liquid-glass flex min-h-[90px] w-[calc(50%-6px)] sm:w-[130px] flex-col rounded-[1rem] p-4 text-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7 text-white" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
            </svg>
            <div className="mt-auto pt-3">
              <div className="font-heading text-2xl italic leading-none tracking-[-1px] text-white">100+</div>
              <div className="mt-1 font-body text-[9px] font-light text-white/60">Projects Completed</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-4 gap-8 pb-24 z-10">
         {services.map((svc, idx) => (
           <div key={idx} className="relative w-full">
             <ServiceContent 
                activeIndex={idx} 
                onViewWorkClick={() => {
                  setMobileModalIndex(idx);
                  setViewWorkPersist(true);
                }}
             />
           </div>
         ))}
      </div>
    </div>
  );
}


import {  
  useMotionValue as useCHMV,
  useScroll as useCHScroll,
  useTransform as useCHTx,
  useSpring as useCHSpring,
  AnimatePresence as CHAP,
  } from 'framer-motion';

const INTRO_KEY = "snapmark_intro_seen";

function CinematicHero() {
  const services = SERVICES_DATA;
  const count = services.length;
  const angleStep = 360 / count;

  const [mobileModalIndex, setMobileModalIndex] = useCHState(0);

  /* ── intro state ───────────────────────────────────────────── */
  const introCompleteVal = (() => {
    try { return localStorage.getItem(INTRO_KEY) === "1"; } catch { return false; }
  })();
  const [introComplete, setIntroComplete] = useCHState(introCompleteVal);
  const onIntroComplete = useCHCb(() => {
    setIntroComplete(true);
    try { localStorage.setItem(INTRO_KEY, "1"); } catch {}
  }, []);

  const [viewWorkHover, setViewWorkHover] = useCHState(false);
  const [viewWorkPersist, setViewWorkPersist] = useCHState(false);
  const showWorkModal = viewWorkHover || viewWorkPersist;

  const [idleAngle, setIdleAngle] = useCHState(0);
  const [isAssembled, setIsAssembled] = useCHState(false);

  /* Start assembly delay when intro is done */
  useCHEffect(() => {
    if (introComplete) {
      const t = setTimeout(() => {
        setIsAssembled(true);
      }, 900);
      return () => clearTimeout(t);
    }
  }, [introComplete]);

  /* lock scroll during intro */
  useCHEffect(() => {
    if (!introComplete) {
      document.body.classList.add("no-scroll");
      return () => document.body.classList.remove("no-scroll");
    }
  }, [introComplete]);

  /* ── parallax ──────────────────────────────────────────────── */
  const parallax = useMouseParallax();

  /* ── scroll engine ─────────────────────────────────────────── */
  const scrollRef = useCHRef(null);
  const { scrollYProgress } = useCHScroll({ target: scrollRef, offset: ["start start", "end end"] });

  /* map scroll to active service index (-1 = hero, 0..6 = services) */
  const totalSections = count + 1; /* 1 hero + 7 services */
  const breakpoints = useCHMemo(() => {
    const bp = [0]; /* start = hero */
    for (let i = 0; i < count; i++) {
      bp.push((i + 1) / totalSections);
    }
    bp.push(1);
    return bp;
  }, [count, totalSections]);

  const activeIndexRaw = useCHTx(
    scrollYProgress,
    breakpoints,
    [-1, ...services.map((_, i) => i), count - 1]
  );

  const [activeIndex, setActiveIndex] = useCHState(-1);
  const currentImgIdx = activeIndex === -1 ? mobileModalIndex : activeIndex;
  useCHEffect(() => {
    const unsub = activeIndexRaw.on("change", (v) => {
      const rounded = Math.floor(v);
      setActiveIndex((prev) => (prev !== rounded ? rounded : prev));
    });
    return unsub;
  }, [activeIndexRaw]);

  /* ── ring rotation ─────────────────────────────────────────── */
  const scrollTarget = useCHMV(0);
  const scrollSpring = useCHSpring(scrollTarget, { stiffness: 28, damping: 22 });

  /* scroll-driven rotation target selection */
  useCHEffect(() => {
    if (activeIndex < 0) {
      scrollTarget.set(0);
    } else {
      scrollTarget.set(-(activeIndex * angleStep));
    }
  }, [activeIndex]);

  /* constant idle rotation loop + scroll decay */
  useCHEffect(() => {
    if (!introComplete) return;

    let last = performance.now();
    let raf;
    let currentIdle = idleAngle;

    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;

      if (activeIndex < 0) {
        if (isAssembled) {
          const speed = 360 / 85; /* deg/s — one revolution per 85s */
          currentIdle += speed * dt;
          setIdleAngle(currentIdle);
        }
      } else {
        if (Math.abs(currentIdle) > 0.05) {
          currentIdle *= Math.exp(-6 * dt); // smooth decay to 0
          setIdleAngle(currentIdle);
        } else if (currentIdle !== 0) {
          currentIdle = 0;
          setIdleAngle(0);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [introComplete, activeIndex, isAssembled]);

  /* ── hero default content (before service scroll) ──────────── */
  const ringReveal = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* ── Intro overlay ────────────────────────────────────── */}
      {!introCompleteVal && !introComplete && (
        <IntroSequence onComplete={onIntroComplete} />
      )}

      {/* ── Desktop Scroll container ─────────────────────────────────── */}
      <div
        ref={scrollRef}
        id="home"
        style={{ height: `${totalSections * 65}vh` }}
        className="hidden lg:block relative"
      >
        {/* ── Sticky viewport ──────────────────────────────── */}
        <div className="sticky top-0 z-10 flex h-screen w-full flex-col overflow-hidden bg-transparent">
          <Navbar />

          {/* ambient */}
          <div className="absolute inset-0 z-0">
            <AmbientEffects parallax={parallax} />
          </div>

          {/* ── Split content ───────────────────────────────── */}
          <div className="relative z-10 flex flex-1 flex-col lg:flex-row items-center px-6 pt-24 pb-8 md:px-12 lg:px-20 gap-6 lg:gap-0">

            {/* ── Left side ─────────────────────────────────── */}
            <div className="flex flex-1 flex-col justify-center lg:max-w-[50%]">
              <CHAP mode="wait">
                {activeIndex < 0 ? (
                  /* ── Hero default content ────────────────── */
                  <ch.div
                    key="hero-default"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  >
                    <ch.div
                      {...rise}
                      transition={{ duration: 0.7, delay: introComplete ? 0.2 : 0.4, ease: "easeOut" }}
                      className="liquid-glass flex w-fit items-center gap-2 rounded-full p-1"
                    >
                      <span className="rounded-full bg-white px-3 py-1 font-body text-xs font-semibold text-black">
                        Studio
                      </span>
                      <span className="pr-3 font-body text-xs text-white/90 sm:text-sm">
                        Premium Creative Studio
                      </span>
                    </ch.div>

                    {/* Staggered interactive letter reveal */}
                    <h1 className="mt-5 max-w-3xl font-heading text-4xl italic leading-[0.85] tracking-[-2px] sm:text-6xl sm:tracking-[-3px] md:text-7xl lg:text-[5.5rem] select-none flex flex-wrap gap-x-3">
                      {"Snapmark Media".split(" ").map((word, wIdx) => (
                        <span key={wIdx} className="inline-flex overflow-hidden">
                          {word.split("").map((letter, lIdx) => (
                            <ch.span
                              key={lIdx}
                              initial={{ opacity: 0, y: 35 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 150,
                                damping: 15,
                                delay: 0.15 + (wIdx * 5 + lIdx) * 0.03,
                              }}
                              whileHover={{
                                y: -8,
                                color: "#00f0ff",
                                textShadow: "0 0 15px rgba(0, 240, 255, 0.6)",
                              }}
                              className={`inline-block cursor-pointer bg-clip-text text-transparent transition-all duration-200 ${
                                wIdx === 0 && lIdx >= 4
                                  ? "bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600"
                                  : "bg-gradient-to-b from-white via-white to-white/70"
                              }`}
                              style={{ willChange: "transform, opacity" }}
                            >
                              {letter}
                            </ch.span>
                          ))}
                        </span>
                      ))}
                    </h1>

                    <ch.p
                      {...rise}
                      transition={{ duration: 0.7, delay: introComplete ? 0.4 : 0.8, ease: "easeOut" }}
                      className="mt-4 max-w-lg font-body text-sm font-light leading-relaxed text-white/80 md:text-base"
                    >
                      We craft cinematic visuals, scroll-stopping content, and premium creative solutions that elevate brands and captivate audiences.
                    </ch.p>

                    <ch.div
                      {...rise}
                      transition={{ duration: 0.7, delay: introComplete ? 0.5 : 1.1, ease: "easeOut" }}
                      className="mt-6 flex items-center gap-5"
                    >
                      <a
                        href="#gallery"
                        className="liquid-glass-strong flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium text-white"
                      >
                        View Work <PlayIcon />
                      </a>
                    </ch.div>

                    {/* stat cards */}
                    <ch.div
                      {...rise}
                      transition={{ duration: 0.7, delay: introComplete ? 0.6 : 1.3, ease: "easeOut" }}
                      className="mt-8 flex flex-wrap items-stretch gap-3"
                    >
                      <div className="liquid-glass flex min-h-[90px] w-[calc(50%-6px)] sm:w-[130px] flex-col rounded-[1rem] p-4 text-left">
                        <ClockIcon />
                        <div className="mt-auto pt-3">
                          <div className="font-heading text-2xl italic leading-none tracking-[-1px] text-white">1+ Year</div>
                          <div className="mt-1 font-body text-[9px] font-light text-white/60">Experience</div>
                        </div>
                      </div>
                      <div className="liquid-glass flex min-h-[90px] w-[calc(50%-6px)] sm:w-[130px] flex-col rounded-[1rem] p-4 text-left">
                        <GlobeIcon />
                        <div className="mt-auto pt-3">
                          <div className="font-heading text-2xl italic leading-none tracking-[-1px] text-white">7+</div>
                          <div className="mt-1 font-body text-[9px] font-light text-white/60">Clients served</div>
                        </div>
                      </div>
                      <div className="liquid-glass flex min-h-[90px] w-[calc(50%-6px)] sm:w-[130px] flex-col rounded-[1rem] p-4 text-left">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7 text-white" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
                        </svg>
                        <div className="mt-auto pt-3">
                          <div className="font-heading text-2xl italic leading-none tracking-[-1px] text-white">100+</div>
                          <div className="mt-1 font-body text-[9px] font-light text-white/60">Projects delivered</div>
                        </div>
                      </div>
                    </ch.div>
                  </ch.div>
                ) : (
                  /* ── Active service content ─────────────── */
                  <ch.div
                    key={`service-${activeIndex}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <ServiceContent
                      activeIndex={activeIndex}
                      onViewWorkHover={setViewWorkHover}
                      onViewWorkClick={() => setViewWorkPersist((prev) => !prev)}
                    />
                  </ch.div>
                )}
              </CHAP>
            </div>

            {/* ── Right side (orbit) ────────────────────────── */}
            <div className="relative flex flex-1 items-center justify-center lg:max-w-[50%]" style={{ minHeight: 350 }}>
              <LogoOrbit
                rotationAngle={scrollSpring}
                idleAngle={idleAngle}
                activeIndex={activeIndex}
                parallax={parallax}
                showRing={introComplete}
              />
            </div>
          </div>



          {/* ── Scroll indicator ────────────────────────────── */}
          <CHAP>
            {activeIndex < 0 && introComplete && (
              <ch.div
                key="scroll-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2"
              >
                <ch.div
                  className="flex h-8 w-5 items-start justify-center rounded-full border border-white/20 p-1"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ch.div
                    className="h-1.5 w-1 rounded-full bg-white/60"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </ch.div>
              </ch.div>
            )}
          </CHAP>
        </div>
      </div>

      {/* Fullscreen Backdrop Blur Overlay for View Work Hover / Click */}
      <CHAP>
        {showWorkModal && (
          <ch.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-black/75 backdrop-blur-[15px]"
            style={{
              willChange: "opacity",
              pointerEvents: viewWorkPersist ? "auto" : "none",
            }}
            onClick={() => setViewWorkPersist(false)}
          />
        )}
      </CHAP>

      {/* Centered Hover Work Image Modal */}
      <CHAP>
        {showWorkModal && (
          <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center lg:justify-end lg:pr-24 p-6">
            <ch.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 50 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="w-[90vw] h-[55vh] lg:w-[38vw] lg:h-[65vh] max-w-[800px]"
            >
              <div
                className="liquid-glass-strong w-full h-full p-4 rounded-[1.75rem] flex items-center justify-center relative pointer-events-auto"
                style={{
                  boxShadow: "0 30px 70px rgba(0,0,0,0.85), 0 0 50px rgba(100,180,255,0.25), inset 0 1px 1px rgba(255,255,255,0.2)",
                  background: "rgba(255, 255, 255, 0.02)",
                }}
              >
                {/* Close Button (visible only when persistent modal is open) */}
                {viewWorkPersist && (
                  <button
                    onClick={() => setViewWorkPersist(false)}
                    className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border border-white/10 transition-colors duration-200 cursor-pointer"
                    aria-label="Close work showcase"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <img
                  src={currentImgIdx === 1 ? "assets/reels-making-work.jpg" : currentImgIdx === 4 ? "assets/thumbnail-work.jpg" : currentImgIdx === 2 ? "assets/invitations-work.jpg" : currentImgIdx === 3 ? "assets/invitation-videos-work.jpg" : "assets/reels-work.jpg"}
                  alt={currentImgIdx === 1 ? "Reels & Shorts Making Work Showcase" : currentImgIdx === 4 ? "YouTube Thumbnails Work Showcase" : currentImgIdx === 2 ? "Wedding Invitation Cards Work Showcase" : currentImgIdx === 3 ? "Invitation Videos Work Showcase" : "Reels & Shorts Editing Work Showcase"}
                  className="w-full h-full object-contain rounded-[1.25rem]"
                />
              </div>
            </ch.div>
          </div>
        )}
      </CHAP>

      {/* ── Mobile Flow Container ─────────────────────────────────── */}
      <MobileHero parallax={parallax} setMobileModalIndex={setMobileModalIndex} setViewWorkPersist={setViewWorkPersist} />
    </>
  );
}

export default CinematicHero;
