/**
 * LogoOrbit.jsx
 * 3D rotating service ring around the SnapMark Media logo.
 *
 * Props
 * ─────
 * rotationAngle   MotionValue | number  current ring Y-rotation in degrees
 * activeIndex     number                which service is highlighted (-1 = none)
 * parallax        { x, y }             spring MotionValues from useMouseParallax
 * showRing        boolean              whether service panels are visible
 * compact         boolean              smaller sizing (for intro)
 * className       string               extra classes on outermost wrapper
 */
const {
  useRef: useOrbitRef,
  useEffect: useOrbitEffect,
  useMemo: useOrbitMemo,
  useState: useOrbitState,
} = React;
const {
  motion: orb,
  useTransform: useOrbitTx,
  useMotionValue: useOrbitMV,
} = Motion;

/* ── service icons (simple SVG paths from Material Symbols) ── */
const SERVICE_ICONS = [
  "M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z",          /* Reels editing */
  "M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4Z",                                                  /* Reels making */
  "M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10ZM12 13 3.74 7.84 12 3l8.26 4.84L12 13Z",        /* Invitations */
  "M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4Z",                                                         /* Video */
  "M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm0 16H3V5h18v14Zm-5-7 -7 4V8l7 4Z",                                                /* Thumbnails */
  "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2Zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2Z", /* Design */
  "M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z",                      /* Photo editing */
];

const SERVICE_GRADIENTS = [
  { id: "grad-0", from: "#ff007f", to: "#00f0ff", glow: "rgba(255, 0, 127, 0.4)" },
  { id: "grad-1", from: "#8b5cf6", to: "#ec4899", glow: "rgba(139, 92, 246, 0.4)" },
  { id: "grad-2", from: "#f472b6", to: "#fb7185", glow: "rgba(244, 114, 182, 0.4)" },
  { id: "grad-3", from: "#fbbf24", to: "#f87171", glow: "rgba(251, 191, 36, 0.4)" },
  { id: "grad-4", from: "#38bdf8", to: "#34d399", glow: "rgba(56, 189, 248, 0.4)" },
  { id: "grad-5", from: "#a78bfa", to: "#f472b6", glow: "rgba(167, 139, 250, 0.4)" },
  { id: "grad-6", from: "#60a5fa", to: "#c084fc", glow: "rgba(96, 165, 250, 0.4)" },
];

function LogoOrbit({
  rotationAngle,
  idleAngle = 0,
  activeIndex = -1,
  parallax,
  showRing = true,
  compact = false,
  mobileMode = false,
  className = "",
}) {
  const services = window.SERVICES_DATA;
  const count = services.length;
  const angleStep = 360 / count;

  /* ── assembly state ────────────────────────────────────────── */
  const [assembleProgress, setAssembleProgress] = useOrbitState(0);
  useOrbitEffect(() => {
    const t = setTimeout(() => {
      setAssembleProgress(1);
    }, 150);
    return () => clearTimeout(t);
  }, []);

  /* ── responsive radius ─────────────────────────────────────── */
  const [radius, setRadius] = useOrbitState(compact ? 200 : 260);
  useOrbitEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (compact) {
        setRadius(w < 640 ? 120 : w < 1024 ? 160 : 200);
      } else {
        setRadius(w < 640 ? 130 : w < 1024 ? 190 : 260);
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [compact]);

  /* ── parallax offsets ──────────────────────────────────────── */
  const ringPx = parallax ? useOrbitTx(parallax.x, (v) => v * 12) : 0;
  const ringPy = parallax ? useOrbitTx(parallax.y, (v) => v * 12) : 0;
  const logoPx = parallax ? useOrbitTx(parallax.x, (v) => v * 5) : 0;
  const logoPy = parallax ? useOrbitTx(parallax.y, (v) => v * 5 - 45) : -45;

  /* ── rotation value (accept both MotionValue and number) ──── */
  const isMotionVal = rotationAngle && typeof rotationAngle.get === "function";
  const angleMV = isMotionVal ? rotationAngle : null;
  const angleNum = isMotionVal ? undefined : rotationAngle || 0;

  /* build rotateY transform string (adding idleAngle separately to avoid spring jitter) */
  const idleAngleMV = idleAngle && typeof idleAngle.get === 'function'
    ? idleAngle
    : useOrbitMV(idleAngle || 0);

  const ringRotateY = angleMV
    ? useOrbitTx([angleMV, idleAngleMV], ([v, idle]) => v + idle)
    : useOrbitTx(idleAngleMV, (idle) => angleNum + idle);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* ── Logo (center, barely moves) ─────────────────────── */}
      <orb.div
        className="absolute z-20 flex items-center justify-center"
        style={{ x: logoPx, y: logoPy }}
      >
        <orb.div
          className="relative flex items-center justify-center rounded-[1.5rem] overflow-hidden"
          whileHover={{ scale: 1.06, rotate: [0, -2, 2, 0] }}
          transition={{ duration: 0.3 }}
          style={{
            width: compact ? 80 : 100,
            height: compact ? 80 : 100,
            padding: "1.5px",
            boxShadow: "0 0 30px rgba(80,160,255,0.1)",
          }}
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
          >
            <img
              src="assets/snapmark-logo.png"
              alt="SnapMark Media"
              style={{
                width: compact ? 56 : 72,
                height: compact ? 56 : 72,
                objectFit: "contain",
                borderRadius: "0.6rem",
              }}
            />
          </div>
        </orb.div>
      </orb.div>

      {/* ── Rotating Ring ───────────────────────────────────── */}
      {showRing && (
        <orb.div
          style={{
            x: ringPx,
            y: ringPy,
            rotateY: ringRotateY,
            rotateX: -15,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {services.map((svc, i) => {
            const panelAngle = i * angleStep;
            const isActive = i === activeIndex;
            const grad = SERVICE_GRADIENTS[i] || SERVICE_GRADIENTS[0];

            const progress = assembleProgress;
            const xLine = (i - (count - 1) / 2) * (compact ? 95 : 125);
            const zLine = -600;

            const tX = (1 - progress) * xLine;
            const tZ = (1 - progress) * zLine + progress * radius;
            const rY = progress * panelAngle;

            return (
              <div
                key={svc.id}
                className="absolute"
                style={{
                  width: compact ? 110 : 140,
                  height: compact ? 60 : 72,
                  left: compact ? -55 : -70,
                  top: compact ? -30 : -36,
                  transform: `rotateY(${rY}deg) translate3d(${tX}px, 0px, ${tZ}px)`,
                  transformStyle: "preserve-3d",
                  opacity: progress,
                  transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease",
                }}
              >
                <orb.div
                  className={`flex h-full w-full flex-col items-center justify-center rounded-[1rem] ${
                    isActive ? "service-panel-active" : ""
                  }`}
                  whileHover={{
                    scale: 1.08,
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    boxShadow: `0 0 25px ${grad.glow}, inset 0 1px 1px rgba(255,255,255,0.2)`,
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    willChange: "transform, opacity",
                    background: isActive
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(255,255,255,0.02)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: isActive
                      ? `1.5px solid ${grad.from}`
                      : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: isActive
                      ? `0 0 25px ${grad.glow}, inset 0 1px 1px rgba(255,255,255,0.12)`
                      : "inset 0 1px 1px rgba(255,255,255,0.06)",
                    transition: "background 0.3s, border 0.3s, box-shadow 0.3s",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    style={{ width: compact ? 18 : 22, height: compact ? 18 : 22 }}
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id={grad.id} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={grad.from} />
                        <stop offset="100%" stopColor={grad.to} />
                      </linearGradient>
                    </defs>
                    <path d={SERVICE_ICONS[i] || SERVICE_ICONS[0]} fill={`url(#${grad.id})`} />
                  </svg>
                  <span
                    className="mt-1.5 text-center font-body font-medium text-white/90"
                    style={{ fontSize: compact ? 8 : 10, lineHeight: 1.2, maxWidth: "90%", }}
                  >
                    {svc.title}
                  </span>
                </orb.div>
              </div>
            );
          })}
        </orb.div>
      )}
    </div>
  );
}

window.LogoOrbit = LogoOrbit;
