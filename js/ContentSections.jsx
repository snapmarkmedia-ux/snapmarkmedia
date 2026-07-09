const { motion: sectionMotion } = Motion;

const BACKGROUND_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4";

const revealProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.7, ease: "easeOut" }
};

const iconPaths = {
  image: "M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z",
  movie: "M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z",
  light: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z"
};

function GlassIcon({ path = iconPaths.image }) {
  return (
    <div className="liquid-glass flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.75rem]">
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current text-white" aria-hidden="true"><path d={path} /></svg>
    </div>
  );
}

function SectionHeading({ kicker, lineOne, lineTwo, description }) {
  return (
    <sectionMotion.header {...revealProps} className="max-w-3xl">
      <p className="mb-6 font-body text-sm text-white/80">// {kicker}</p>
      <h2 className="font-heading text-4xl italic leading-[0.9] tracking-[-2px] text-white sm:text-6xl sm:tracking-[-3px] md:text-7xl lg:text-[6rem]">
        {lineOne}{lineTwo && <><br />{lineTwo}</>}
      </h2>
      {description && <p className="mt-6 max-w-xl font-body text-sm font-light leading-relaxed text-white/80 md:text-base">{description}</p>}
    </sectionMotion.header>
  );
}

function GlassCard({ children, className = "", transition }) {
  return (
    <sectionMotion.div
      {...revealProps}
      whileHover={{
        y: -5,
        scale: 1.01,
        boxShadow: "0 15px 35px rgba(100, 180, 255, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.18)",
        backgroundColor: "rgba(255,255,255,0.03)"
      }}
      transition={transition || { type: "spring", stiffness: 300, damping: 20 }}
      className={`liquid-glass rounded-[1.25rem] p-6 transition-colors duration-300 ${className}`}
    >
      {children}
    </sectionMotion.div>
  );
}


function ServicesSection() {
  const services = Array.from({ length: 6 }, (_, index) => ({
    title: `Service ${String(index + 1).padStart(2, "0")}`,
    text: "Service description placeholder. Add the service outcome, creative approach, and delivery details here.",
    path: [iconPaths.image, iconPaths.movie, iconPaths.light][index % 3]
  }));

  return (
    <section id="services" className="relative min-h-screen px-8 pb-16 pt-28 md:px-16 lg:px-20">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading kicker="Services" lineOne="Creative" lineTwo="capabilities" description="Section introduction placeholder. Present the studio's complete range of creative services here." />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <GlassCard key={service.title} className="flex min-h-[300px] flex-col" transition={{ ...revealProps.transition, delay: (index % 3) * 0.08 }}>
              <div className="flex items-start justify-between gap-4">
                <GlassIcon path={service.path} />
                <div className="flex flex-wrap justify-end gap-1.5">
                  {["Format", "Style", "Delivery"].map((tag) => <span key={tag} className="liquid-glass rounded-full px-3 py-1 font-body text-[11px] text-white/90">{tag}</span>)}
                </div>
              </div>
              <div className="mt-auto pt-12">
                <h3 className="font-heading text-3xl italic leading-none tracking-[-1px] text-white md:text-4xl">{service.title}</h3>
                <p className="mt-3 max-w-[34ch] font-body text-sm font-light leading-snug text-white/90">{service.text}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function getRandomNumberInRange(min, max) {
  if (min >= max) {
    throw new Error("Min value should be less than max value");
  }
  return Math.random() * (max - min) + min;
}

const cn = (...classes) => classes.filter(Boolean).join(" ");

function Photo({
  src,
  alt,
  className,
  direction,
  width,
  height,
  onClick,
  ...props
}) {
  const rotation = React.useMemo(() => {
    return getRandomNumberInRange(1, 4) * (direction === "left" ? -1 : 1);
  }, [direction]);

  const mouseX = Motion.useMotionValue(110);
  const mouseY = Motion.useMotionValue(110);

  const rotateX = Motion.useTransform(mouseY, [0, 220], [15, -15]);
  const rotateY = Motion.useTransform(mouseX, [0, 220], [-15, 15]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  const resetMouse = () => {
    mouseX.set(110);
    mouseY.set(110);
  };

  const { motion: motionGlobal } = Motion;

  return (
    <motionGlobal.div
      onClick={onClick}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
      whileTap={{ scale: 1.15 }}
      whileHover={{
        scale: 1.08,
        rotateZ: 2 * (direction === "left" ? -1 : 1),
      }}
      whileDrag={{
        scale: 1.12,
      }}
      style={{
        width,
        height,
        perspective: 600,
        rotateX,
        rotateY,
        rotateZ: rotation,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
        willChange: "transform",
      }}
      className={cn(
        className,
        "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing"
      )}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-lg border border-white/10 bg-zinc-900">
        <motionGlobal.img
          className={cn("rounded-3xl object-cover absolute inset-0 w-full h-full")}
          src={src}
          alt={alt}
          {...props}
          draggable={false}
        />
      </div>
    </motionGlobal.div>
  );
}

function GallerySection() {
  // Photo positions - horizontal layout with random y offsets
  const photos = [
    {
      id: 1,
      order: 0,
      x: "-320px",
      y: "15px",
      zIndex: 50, // Highest z-index (on top)
      direction: "left",
      src: "assets/gallery-1.jpg",
    },
    {
      id: 2,
      order: 1,
      x: "-160px",
      y: "32px",
      zIndex: 40,
      direction: "left",
      src: "assets/gallery-2.jpg",
    },
    {
      id: 3,
      order: 2,
      x: "0px",
      y: "8px",
      zIndex: 30,
      direction: "right",
      src: "assets/gallery-3.png",
    },
    {
      id: 4,
      order: 3,
      x: "160px",
      y: "22px",
      zIndex: 20,
      direction: "right",
      src: "assets/gallery-4.png",
    },
    {
      id: 5,
      order: 4,
      x: "320px",
      y: "44px",
      zIndex: 10, // Lowest z-index (at bottom)
      direction: "left",
      src: "assets/gallery-5.png",
    },
  ];

  // Animation variants for each photo
  const photoVariants = {
    hidden: {
      x: 0,
      y: 0,
      opacity: 0,
      scale: 0.8,
    },
    visible: (custom) => ({
      x: custom.x,
      y: custom.y,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        mass: 1,
        delay: custom.order * 0.12,
      },
    }),
  };

  const { motion: motionGlobal, AnimatePresence } = Motion;
  const [activePhoto, setActivePhoto] = React.useState(null);

  return (
    <section id="gallery" className="relative min-h-screen px-8 pb-16 pt-28 md:px-16 lg:px-20 overflow-hidden flex flex-col justify-center items-center">
      <div className="absolute inset-0 max-md:hidden top-[200px] -z-10 h-[300px] w-full bg-transparent bg-[linear-gradient(to_right,#57534e_1px,transparent_1px),linear-gradient(to_bottom,#57534e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      <p className="lg:text-md my-2 text-center text-xs font-light uppercase tracking-widest text-slate-400 font-body">
        A Journey Through Visual Stories
      </p>
      <h3 className="z-20 mx-auto max-w-2xl justify-center text-center text-4xl font-heading italic text-white md:text-7xl mb-8">
        Featured <span className="text-rose-500"> Work</span>
      </h3>
      <div className="relative mb-8 h-[350px] w-full items-center justify-center lg:flex">
        <motionGlobal.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="relative h-[220px] w-[220px]">
            {/* Render photos in reverse order so that higher z-index photos are rendered later in the DOM */}
            {[...photos].reverse().map((photo) => (
              <motionGlobal.div
                key={photo.id}
                className="absolute left-0 top-0"
                style={{ zIndex: photo.zIndex }} // Apply z-index directly in style
                variants={photoVariants}
                custom={{
                  x: photo.x,
                  y: photo.y,
                  order: photo.order,
                }}
                whileHover={{ zIndex: 9999 }}
                whileTap={{ zIndex: 9999 }}
              >
                <Photo
                  width={220}
                  height={220}
                  src={photo.src}
                  alt="Gallery photo"
                  direction={photo.direction}
                  onClick={() => setActivePhoto(photo.src)}
                />
              </motionGlobal.div>
            ))}
          </div>
        </motionGlobal.div>
      </div>
      <div className="flex w-full justify-center">
        <button className="flex items-center gap-2 rounded-full bg-rose-500 hover:bg-rose-600 px-6 py-2.5 font-body text-sm font-medium text-white transition-colors duration-200">
          View All Stories <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* 3D Image Modal Popup */}
      <AnimatePresence>
        {activePhoto && (
          <motionGlobal.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
          >
            <motionGlobal.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl flex items-center justify-center cursor-default"
            >
              <img
                src={activePhoto}
                alt="Enlarged Gallery Photo"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl p-2"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 border border-white/10 text-white/70 hover:text-white hover:bg-black/80 transition-colors duration-200 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </motionGlobal.div>
          </motionGlobal.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function FormField({ label, type = "text", multiline = false, select = false, options = [] }) {
  const id = `field-${label.toLowerCase().replaceAll(" ", "-")}`;
  const classes = "w-full bg-transparent px-4 py-3 font-body text-sm text-white outline-none placeholder:text-white/45";

  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block font-body text-xs font-medium text-white/70">{label}</span>
      <span className="liquid-glass block rounded-[1rem]">
        {multiline ? (
          <textarea id={id} name={id} rows="5" placeholder={`${label} placeholder`} className={`${classes} resize-none`} />
        ) : select ? (
          <select id={id} name={id} defaultValue="" className={classes}>
            <option value="" disabled className="bg-black">Select a service</option>
            {options.map((opt) => (
              <option key={opt} value={opt} className="bg-black">{opt}</option>
            ))}
          </select>
        ) : (
          <input id={id} name={id} type={type} placeholder={`${label} placeholder`} className={classes} />
        )}
      </span>
    </label>
  );
}

function ContactSection() {
  const [status, setStatus] = React.useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [validationMsg, setValidationMsg] = React.useState('');
  const [submitError, setSubmitError] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'loading') return;

    setValidationMsg('');
    setSubmitError('');

    const fullNameEl = document.getElementById('field-full-name');
    const emailEl = document.getElementById('field-email');
    const phoneEl = document.getElementById('field-phone-number');
    const serviceEl = document.getElementById('field-service-required');
    const messageEl = document.getElementById('field-message');

    const fullName = fullNameEl ? fullNameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const service = serviceEl ? serviceEl.value : '';
    const message = messageEl ? messageEl.value.trim() : '';

    // Validation
    if (!fullName) {
      setValidationMsg('Please enter your full name.');
      return;
    }
    if (!email) {
      setValidationMsg('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationMsg('Please enter a valid email address.');
      return;
    }
    if (!message) {
      setValidationMsg('Please enter a message.');
      return;
    }

    setStatus('loading');

    try {
      if (typeof window.submitContactForm !== 'function') {
        throw new Error('Contact submission service is not loaded.');
      }

      await window.submitContactForm({ fullName, email, phone, service, message });
      
      // Reset form
      if (fullNameEl) fullNameEl.value = '';
      if (emailEl) emailEl.value = '';
      if (phoneEl) phoneEl.value = '';
      if (serviceEl) serviceEl.value = '';
      if (messageEl) messageEl.value = '';

      setStatus('success');
    } catch (err) {
      console.error(err);
      setSubmitError('Something went wrong while sending your message. Please try again later.');
      setStatus('error');
    }
  };

  const channels = [
    {
      label: "WhatsApp / Phone",
      value: "9307133407",
      href: "https://wa.me/919307133407",
      color: "hover:text-emerald-400 hover:border-emerald-500/30",
      glow: "rgba(16, 185, 129, 0.2)",
      path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
    },
    {
      label: "Email Address",
      value: "snapmarkmedia@gmail.com",
      href: "mailto:snapmarkmedia@gmail.com",
      color: "hover:text-blue-400 hover:border-blue-500/30",
      glow: "rgba(59, 130, 246, 0.2)",
      path: "M2.003 5.884 10 9.882l7.997-3.998A2 2 0 0 0 16 4H4a2 2 0 0 0-1.997 1.884z M18 8.118l-8 4-8-4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.118z"
    },
    {
      label: "Instagram Profile",
      value: "@snapmarkmedia",
      href: "https://www.instagram.com/snapmarkmedia?igsh=MWVuNWxtM2hsamFvNQ==",
      color: "hover:text-pink-400 hover:border-pink-500/30",
      glow: "rgba(236, 72, 153, 0.2)",
      path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
    },
    {
      label: "YouTube Channel",
      value: "Sandesh Patil",
      href: "https://youtube.com/@sandeshpatil_96k?si=huLSSt7WSk0vXboo",
      color: "hover:text-red-500 hover:border-red-500/30",
      glow: "rgba(239, 68, 68, 0.2)",
      path: "M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.53 3.545 12 3.545 12 3.545s-7.53 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 002.11 2.11c1.858.508 9.388.508 9.388.508s7.53 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
    }
  ];

  return (
    <section id="contact" className="relative min-h-screen px-8 pb-16 pt-28 md:px-16 lg:px-20">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading kicker="Contact" lineOne="Let's create" lineTwo="something" description="Connect with us directly via your preferred social channels, or submit your project details using the contact form." />
        <div className="mt-16 grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
          <GlassCard className="flex flex-col justify-between p-6">
            <div className="space-y-4">
              {channels.map((chan, i) => (
                <sectionMotion.a
                  key={chan.label}
                  href={chan.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 border-b border-white/10 pb-5 last:border-0 last:pb-0 group select-none cursor-pointer transition-all duration-300 ${chan.color}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                  whileHover={{ x: 6 }}
                >
                  <div 
                    className="liquid-glass flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.75rem] transition-all duration-300 group-hover:scale-105"
                    style={{
                      boxShadow: `0 0 15px ${chan.glow}`
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                      <path d={chan.path} />
                    </svg>
                  </div>
                  <div>
                    <p className="font-body text-xs text-white/55 transition-colors duration-300 group-hover:text-white/80">{chan.label}</p>
                    <p className="mt-1 font-body text-sm font-semibold tracking-tight text-white">{chan.value}</p>
                  </div>
                </sectionMotion.a>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <FormField label="Full Name" />
              <FormField label="Email" type="email" />
              <FormField label="Phone Number" type="tel" />
              <FormField 
                label="Service Required" 
                select 
                options={[
                  "Reels Editing",
                  "Shorts Editing",
                  "Invitation Videos",
                  "Invitation Cards",
                  "YouTube Thumbnails",
                  "Photo Editing",
                  "Graphic Design",
                  "Social Media Branding",
                  "Color Grading",
                  "Content Strategy"
                ]} 
              />
              <div className="md:col-span-2"><FormField label="Message" multiline /></div>
              
              {validationMsg && (
                <div className="md:col-span-2 text-red-400 font-body text-sm bg-red-500/10 border border-red-500/20 rounded-[0.75rem] px-4 py-2.5">
                  {validationMsg}
                </div>
              )}
              {status === 'success' && (
                <div className="md:col-span-2 text-emerald-400 font-body text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-[0.75rem] px-4 py-2.5">
                  Thank you! Your message has been received. We'll get back to you shortly.
                </div>
              )}
              {status === 'error' && (
                <div className="md:col-span-2 text-red-400 font-body text-sm bg-red-500/10 border border-red-500/20 rounded-[0.75rem] px-4 py-2.5">
                  {submitError}
                </div>
              )}

              <div className="md:col-span-2">
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="liquid-glass-strong flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Sending...' : 'Submit Enquiry'} <ArrowUpRight />
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative px-8 pb-8 pt-16 md:px-16 lg:px-20">
      <sectionMotion.div {...revealProps} className="liquid-glass mx-auto max-w-[1440px] rounded-[1.25rem] p-7 md:p-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="#home" aria-label="Snapmark Media home" className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full">
              <img
                src="assets/snapmark-logo.png"
                alt="SnapMark Media"
                style={{
                  width: 36,
                  height: 36,
                  objectFit: "contain",
                  borderRadius: "50%",
                }}
              />
            </a>
            <h2 className="mt-5 font-heading text-3xl italic text-white">Snapmark Media</h2>
            <p className="mt-3 max-w-xs font-body text-sm font-light leading-relaxed text-white/70">Premium Creative Studio specializing in high-impact visual storytelling.</p>
          </div>
          <div>
            <p className="font-body text-xs font-medium uppercase tracking-[.18em] text-white/55">Quick Links</p>
            <div className="mt-4 flex flex-col gap-2 font-body text-sm text-white/85">
              {["Home", "Gallery", "Contact"].map((label) => <a key={label} href={`#${label.toLowerCase()}`}>{label}</a>)}
            </div>
          </div>
          <div>
            <p className="font-body text-xs font-medium uppercase tracking-[.18em] text-white/55">Capabilities</p>
            <div className="mt-4 flex flex-col gap-2 font-body text-sm text-white/85">
              {["Reels & Shorts Making", "Reels & Shorts Editing", "YouTube Thumbnail Design", "Digital Invitation Cards"].map((label) => <span key={label}>{label}</span>)}
            </div>
          </div>
          <div>
            <p className="font-body text-xs font-medium uppercase tracking-[.18em] text-white/55">Connect</p>
            <p className="mt-4 font-body text-sm leading-relaxed text-white/85">
              <a href="mailto:snapmarkmedia@gmail.com" className="hover:text-white/60 transition-colors">snapmarkmedia@gmail.com</a><br />
              <a href="https://wa.me/919307133407" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">9307133407</a>
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href="tel:9307133407" className="liquid-glass rounded-full px-3 py-1.5 font-body text-[11px] text-white/90 hover:text-[#00f0ff] transition-colors duration-200">Call</a>
              <a href="https://wa.me/919307133407" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full px-3 py-1.5 font-body text-[11px] text-white/90 hover:text-emerald-400 transition-colors duration-200">WhatsApp</a>
              <a href="https://www.instagram.com/snapmarkmedia?igsh=MWVuNWxtM2hsamFvNQ==" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full px-3 py-1.5 font-body text-[11px] text-white/90 hover:text-pink-400 transition-colors duration-200">Instagram</a>
              <a href="https://youtube.com/@sandeshpatil_96k?si=huLSSt7WSk0vXboo" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full px-3 py-1.5 font-body text-[11px] text-white/90 hover:text-red-500 transition-colors duration-200">YouTube</a>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 font-body text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Snapmark Media. All rights reserved.</span>
          <div className="flex gap-4">
            <span>Privacy · Terms</span>
            <span>·</span>
            <a href="leave-review.html" className="hover:text-white transition-colors duration-200">Leave a Review</a>
            <span>·</span>
            <a href="admin-login.html" className="hover:text-white transition-colors duration-200">Admin Login</a>
          </div>
        </div>
      </sectionMotion.div>
    </footer>
  );
}

function ContentSections() {
  return (
    <div className="relative bg-transparent">
      <div className="sticky top-0 z-0 h-screen overflow-hidden">
        <FadingVideo src={BACKGROUND_VIDEO} className="site-background-media absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="relative z-10 -mt-[100vh]">
        <GallerySection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
}

window.ContentSections = ContentSections;
