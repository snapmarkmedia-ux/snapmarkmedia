
/* ─────────────────────────────────────────────────────────────
   ProfileSection.jsx  —  Premium "Meet the Creative" section
   Uses the same Motion / Framer-Motion UMD global already loaded
───────────────────────────────────────────────────────────────*/
const {
  motion: pm,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  AnimatePresence,
} = Motion;
/* ── Custom Animated Name ────────────────────────────────────── */
function AnimatedName({ name }) {
  return (
    <pm.span
      className="inline-block font-heading italic font-bold tracking-wide"
      style={{
        background: "linear-gradient(90deg, #f472b6, #c084fc, #60a5fa, #f472b6)",
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontSize: "1.25em",
        marginRight: "0.15em",
        paddingRight: "0.1em"
      }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"], y: [0, -2, 0] }}
      transition={{
        backgroundPosition: { duration: 5, repeat: Infinity, ease: "linear" },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      {name}
    </pm.span>
  );
}

/* ── Data (edit freely without touching design) ─────────────── */
const PROFILE = {
  label:       "About Snapmark Media",
  heading:     ["Meet The Creative", "Behind SnapMark"],
  description: <><AnimatedName name="Sandesh Patil" /> is the creative director at SnapMark Media, turning bold ideas into cinematic visuals. With a passion for storytelling and precision editing, he crafts premium content that connects, captivates, and converts.</>,
  designations: [
    "Creative Video Editor",
    "Reels & Shorts Specialist",
    "Digital Content Creator",
  ],
  portrait: "assets/founder-portrait.jpg",
  skills: [
    { label: "Reels Editing", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
    { label: "Shorts Editing", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { label: "Invitation Videos", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { label: "Invitation Cards", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { label: "YouTube Thumbnails", icon: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z M9.75 15.02V8.48l5.75 3.27-5.75 3.27z" },
    { label: "Photo Editing", icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" },
    { label: "Graphic Design", icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" },
    { label: "Social Media Branding", icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" },
    { label: "Color Grading", icon: "M7 21a4 4 0 01-4-4c0-1.473 1.333-3.95 4-7.427C9.667 13.05 11 15.527 11 17a4 4 0 01-4 4z" },
    { label: "Content Strategy", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  ],
  stats: [
    { label: "Experience",           value: "1+ Year" },
    { label: "Projects Completed",   value: "100+"    },
  ],
  cta: {
    heading:     "Let's Create Something Extraordinary",
    description: "Have a vision? Let's bring it to life with premium visuals, cinematic editing, and designs that make your brand unforgettable.",
    primary:     { label: "Let's Work Together", href: "#contact" },
    secondary:   { label: "View Portfolio",      href: "#gallery" },
  },
};

/* ── Skill tag colours — cycles through accent palette ──────── */
const TAG_COLORS = [
  { border: "rgba(139,92,246,0.35)",  glow: "rgba(139,92,246,0.15)"  },
  { border: "rgba(59,130,246,0.35)",  glow: "rgba(59,130,246,0.15)"  },
  { border: "rgba(236,72,153,0.35)",  glow: "rgba(236,72,153,0.15)"  },
  { border: "rgba(16,185,129,0.35)",  glow: "rgba(16,185,129,0.15)"  },
  { border: "rgba(245,158,11,0.35)",  glow: "rgba(245,158,11,0.15)"  },
  { border: "rgba(99,102,241,0.35)",  glow: "rgba(99,102,241,0.15)"  },
];

/* ── Mouse-follow tilt hook ──────────────────────────────────── */
function useTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-1, 1], [ 10, -10]), { stiffness: 80, damping: 20 });
  const rotY = useSpring(useTransform(x, [-1, 1], [-10,  10]), { stiffness: 80, damping: 20 });

  function onMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width  - 0.5) * 2);
    y.set(((e.clientY - rect.top)  / rect.height - 0.5) * 2);
  }
  function onMouseLeave() { x.set(0); y.set(0); }
  return { rotX, rotY, onMouseMove, onMouseLeave };
}

/* ── Sub-components ──────────────────────────────────────────── */

function SkillTag({ item, index }) {
  const col = TAG_COLORS[index % TAG_COLORS.length];
  return (
    <pm.span
      key={item.label}
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.05 + index * 0.04, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.08, y: -3, transition: { duration: 0.2 } }}
      className="inline-flex cursor-default select-none items-center gap-2 rounded-full px-3.5 py-1.5 font-body text-xs font-medium text-white/90 backdrop-blur-sm"
      style={{
        background: "rgba(255,255,255,0.04)",
        border:     `1px solid ${col.border}`,
        boxShadow:  `0 0 12px ${col.glow}, inset 0 1px 1px rgba(255,255,255,0.06)`,
      }}
    >
      <pm.svg 
        viewBox="0 0 24 24" 
        className="h-3.5 w-3.5" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ color: col.border.replace('0.35', '1') }}
        animate={{ rotate: [0, -12, 12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
      >
        <path d={item.icon} />
      </pm.svg>
      {item.label}
    </pm.span>
  );
}

function AnimatedCounter({ value }) {
  const valStr = value.toString();
  const numberPart = parseFloat(valStr.replace(/[^\d.-]/g, '')) || 0;
  const stringPart = valStr.replace(/[\d.-]/g, '');
  const ref = React.useRef(null);
  const inView = Motion.useInView(ref, { once: true, amount: 0.5 });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 40, damping: 15 });
  const displayValue = useTransform(springValue, (v) => Math.floor(v) + stringPart);

  React.useEffect(() => {
    if (inView) {
      motionValue.set(numberPart);
    }
  }, [inView, motionValue, numberPart]);

  return <pm.span ref={ref}>{displayValue}</pm.span>;
}

function StatCard({ stat, index }) {
  return (
    <pm.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="liquid-glass flex flex-col gap-1 rounded-[1.1rem] px-5 py-4"
    >
      <span
        className="font-heading text-3xl italic leading-none tracking-tight text-white"
        style={{ background: "linear-gradient(135deg,#fff 0%,rgba(180,180,255,0.9) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
      >
        <AnimatedCounter value={stat.value} />
      </span>
      <span className="font-body text-xs font-medium text-white/55">{stat.label}</span>
    </pm.div>
  );
}

/* Rotating glowing ring behind portrait */
function GlowRing() {
  return (
    <pm.div
      className="absolute inset-0 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      style={{
        background: "conic-gradient(from 0deg, transparent 0%, rgba(139,92,246,0.6) 20%, rgba(59,130,246,0.6) 40%, transparent 55%, rgba(236,72,153,0.4) 75%, transparent 100%)",
        filter:     "blur(6px)",
        scale:       1.08,
      }}
    />
  );
}

/* Portrait card with tilt */
function PortraitCard() {
  const { rotX, rotY, onMouseMove, onMouseLeave } = useTilt();

  return (
    <pm.div
      initial={{ opacity: 0, scale: 0.7, rotateY: -30, rotateX: 20, rotateZ: -10, x: 80 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0, rotateZ: 0, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-center"
      style={{ perspective: 1200 }}
    >
      {/* floating container */}
      <pm.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
        style={{ width: 320, height: 390 }}
      >
        {/* outer ambient glow blobs */}
        <div className="pointer-events-none absolute -inset-10 rounded-full"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,92,246,0.18) 0%, transparent 70%)", filter: "blur(20px)" }} />
        <div className="pointer-events-none absolute -inset-6 rounded-full"
          style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 70%)", filter: "blur(14px)" }} />

        {/* rotating glow ring layer */}
        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden" style={{ padding: 4 }}>
          <GlowRing />
        </div>

        {/* tiltable portrait card */}
        <pm.div
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
          className="relative h-full w-full rounded-[2.5rem] overflow-hidden"
        >
          {/* glass backing */}
          <div className="absolute inset-0 liquid-glass rounded-[2.5rem]" />

          {/* portrait image */}
          <img
            src={PROFILE.portrait}
            alt="Sandesh Patil — SnapMark Media"
            className="relative z-10 h-full w-full object-cover object-top rounded-[2.5rem]"
            style={{ filter: "brightness(0.96) contrast(1.05) grayscale(100%)" }}
          />

          {/* inner highlight overlay */}
          <div className="pointer-events-none absolute inset-0 z-20 rounded-[2.5rem]"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(139,92,246,0.06) 100%)" }} />
        </pm.div>

        {/* floating badge — designation */}
        <pm.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute -bottom-5 -left-6 liquid-glass-strong z-30 rounded-[1rem] px-4 py-2.5"
        >
          <p className="font-body text-[10px] font-semibold uppercase tracking-[.14em] text-white/50">Role</p>
          <p className="mt-0.5 font-body text-sm font-semibold text-white">Creative Editor</p>
        </pm.div>

        {/* floating badge — stat */}
        <pm.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute -right-7 top-10 liquid-glass-strong z-30 rounded-[1rem] px-4 py-2.5"
        >
          <p className="font-body text-[10px] font-semibold uppercase tracking-[.14em] text-white/50">Projects</p>
          <p className="mt-0.5 font-heading text-xl italic text-white">100+</p>
        </pm.div>
      </pm.div>
    </pm.div>
  );
}

/* ── Main Section ────────────────────────────────────────────── */
function ProfileSection() {
  return (
    <section id="profile" className="relative overflow-hidden px-8 pb-16 pt-28 md:px-16 lg:px-20">
      {/* ── decorative ambient blobs ── */}
      <div className="pointer-events-none absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="pointer-events-none absolute right-[-10%] top-[30%] h-[400px] w-[400px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)", filter: "blur(70px)" }} />
      <div className="pointer-events-none absolute bottom-[5%] left-[30%] h-[300px] w-[300px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.6) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* ── oversized bg typography ── */}
      <div className="pointer-events-none absolute inset-0 flex select-none flex-col items-center justify-center overflow-hidden">
        {["CREATIVE", "EDITOR", "SNAPMARK"].map((w, i) => (
          <span
            key={w}
            className="block font-heading italic leading-none text-white"
            style={{ fontSize: "clamp(5rem,18vw,16rem)", opacity: 0.022, letterSpacing: "-0.04em", userSelect: "none" }}
          >
            {w}
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-[1440px]">
        {/* ── Two-column grid ── */}
        <div className="grid gap-16 lg:grid-cols-[1fr_420px] lg:gap-24 xl:grid-cols-[1fr_460px]">

          {/* ────── LEFT SIDE ────── */}
          <div className="flex flex-col gap-8">

            {/* Animated label */}
            <pm.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-body text-sm text-white/70"
            >
              // {PROFILE.label}
            </pm.p>

            {/* Heading */}
            <pm.h2
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.08, ease: "easeOut" }}
              className="font-heading text-5xl italic leading-[0.9] tracking-[-3px] text-white sm:text-6xl md:text-7xl lg:text-[5rem]"
            >
              <span style={{ background: "linear-gradient(90deg, #fff 0%, #d8b4fe 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{PROFILE.heading[0]}</span><br />
              <span style={{ background: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 50%, #f472b6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {PROFILE.heading[1]}
              </span>
            </pm.h2>

            {/* Description */}
            <pm.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="max-w-xl font-body text-sm font-light leading-relaxed text-white/75 md:text-base"
            >
              {PROFILE.description}
            </pm.p>

            {/* Designation chips */}
            <pm.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-2"
            >
              {PROFILE.designations.map((d, i) => (
                <span
                  key={d}
                  className="liquid-glass-strong rounded-full px-4 py-2 font-body text-xs font-semibold text-white/90"
                  style={{
                    background: i === 0
                      ? "linear-gradient(90deg, rgba(139,92,246,0.18) 0%, rgba(59,130,246,0.12) 100%)"
                      : "rgba(255,255,255,0.03)",
                    border: i === 0 ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {d}
                </span>
              ))}
            </pm.div>

            {/* Skill tags */}
            <pm.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <p className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[.18em] text-white/40">Expertise</p>
              <div className="flex flex-wrap gap-2">
                {PROFILE.skills.map((s, i) => <SkillTag key={s.label} item={s} index={i} />)}
              </div>
            </pm.div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              {PROFILE.stats.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
            </div>

            {/* ── Contact Info ── */}
            <pm.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[.18em] text-white/40">Contact</p>
              <div className="flex flex-row flex-wrap gap-6">
                <a
                  href="mailto:sandeshpatil05062@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group transition-all duration-200"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="liquid-glass flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.55rem] transition-all duration-200 group-hover:scale-110"
                    style={{ boxShadow: `0 0 10px #60a5fa25` }}
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current text-blue-400" aria-hidden="true">
                      <path d="M2.003 5.884 10 9.882l7.997-3.998A2 2 0 0 0 16 4H4a2 2 0 0 0-1.997 1.884z M18 8.118l-8 4-8-4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.118z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-xs font-semibold text-white/90 group-hover:text-white transition-colors duration-200">sandeshpatil05062@gmail.com</p>
                    <p className="font-body text-[10px] text-white/40">Email</p>
                  </div>
                </a>
                <a
                  href="https://www.instagram.com/pix_sandesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group transition-all duration-200"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="liquid-glass flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.55rem] transition-all duration-200 group-hover:scale-110"
                    style={{ boxShadow: `0 0 10px #f472b625` }}
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current text-pink-400" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-xs font-semibold text-white/90 group-hover:text-white transition-colors duration-200">@pix_sandesh</p>
                    <p className="font-body text-[10px] text-white/40">Instagram</p>
                  </div>
                </a>
              </div>
            </pm.div>
          </div>

          {/* ────── RIGHT SIDE — Portrait ────── */}
          <div className="flex items-center justify-center lg:justify-end">
            <PortraitCard />
          </div>
        </div>

        {/* ── CTA Block ── */}
        <pm.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-24 liquid-glass rounded-[1.5rem] px-8 py-12 text-center md:px-16"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(59,130,246,0.04) 50%, rgba(236,72,153,0.04) 100%)" }}
        >
          <p className="font-body text-xs font-semibold uppercase tracking-[.18em] text-white/45">Ready to Collaborate?</p>
          <h3 className="mt-4 font-heading text-4xl italic leading-tight tracking-[-2px] text-white md:text-5xl lg:text-6xl">
            {PROFILE.cta.heading}
          </h3>
          <p className="mx-auto mt-4 max-w-lg font-body text-sm font-light leading-relaxed text-white/65">
            {PROFILE.cta.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <pm.a
              href={PROFILE.cta.primary.href}
              whileHover={{ scale: 1.05, y: -3, boxShadow: "0 0 30px rgba(139,92,246,0.5)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-body text-sm font-semibold text-white transition-all"
              style={{
                background:  "linear-gradient(90deg, #8b5cf6 0%, #3b82f6 50%, #ec4899 100%)",
                backgroundSize: "200% auto",
                boxShadow:   "0 0 20px rgba(139,92,246,0.3)",
              }}
            >
              {PROFILE.cta.primary.label}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </pm.a>
            <pm.a
              href={PROFILE.cta.secondary.href}
              whileHover={{ scale: 1.05, x: 5, color: "#d8b4fe" }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-2 font-body text-sm font-medium text-white/80 hover:text-white transition-colors duration-200"
            >
              {PROFILE.cta.secondary.label}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </pm.a>
          </div>
        </pm.div>
      </div>
    </section>
  );
}

window.ProfileSection = ProfileSection;
