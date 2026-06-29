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

function GalleryCard({ item, className = "" }) {
  return (
    <sectionMotion.article
      {...revealProps}
      whileHover={{
        y: -5,
        scale: 1.01,
        boxShadow: "0 15px 35px rgba(100, 180, 255, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.18)",
        backgroundColor: "rgba(255,255,255,0.03)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`liquid-glass group flex min-h-[350px] flex-col rounded-[1.25rem] p-3 transition-colors duration-300 cursor-pointer ${className}`}
    >
      <div className="relative flex min-h-[230px] flex-1 items-center justify-center overflow-hidden rounded-[1rem] bg-black/30">
        {item.src && item.kind === "video" && (
          <video
            src={item.src}
            muted
            autoPlay
            playsInline
            loop
            className="absolute inset-0 h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
        )}
        {item.src && item.kind === "image" && (
          <img
            src={item.src}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
        )}
        {!item.src && (
          <div className="transform group-hover:scale-110 transition-transform duration-500">
            <GlassIcon path={item.kind === "video" ? iconPaths.movie : iconPaths.image} />
          </div>
        )}
        <span className="liquid-glass absolute left-3 top-3 rounded-full px-3 py-1 font-body text-[11px] text-white/90">{item.label}</span>
      </div>
      <div className="flex items-end justify-between gap-4 px-3 pb-2 pt-5">
        <div>
          <h3 className="font-heading text-3xl italic leading-none tracking-[-1px] text-white group-hover:text-blue-400 transition-colors duration-300">{item.title}</h3>
          <p className="mt-2 font-body text-xs font-light text-white/70">Project details placeholder</p>
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
      </div>
    </sectionMotion.article>
  );
}

function GallerySection() {
  const galleryItems = [
    { title: "Featured Project", label: "Featured", kind: "video", src: BACKGROUND_VIDEO },
    { title: "Recent Work 01", label: "Recent Work", kind: "image", src: null },
    { title: "Video Showcase", label: "Video", kind: "video", src: null },
    { title: "Image Gallery", label: "Image", kind: "image", src: null },
    { title: "Recent Work 02", label: "Recent Work", kind: "image", src: null }
  ];

  return (
    <section id="gallery" className="relative min-h-screen px-8 pb-16 pt-28 md:px-16 lg:px-20">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading kicker="Art Gallery / Portfolio" lineOne="Selected" lineTwo="work" description="Gallery introduction placeholder. Add a short line about the ideas and craft behind the studio's featured projects." />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => <GalleryCard key={item.title} item={item} className={index === 0 ? "md:col-span-2" : ""} />)}
        </div>
      </div>
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
  const channels = [
    {
      label: "WhatsApp / Phone",
      value: "82008045085",
      href: "https://wa.me/82008045085",
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
            <form onSubmit={(event) => event.preventDefault()} className="grid gap-5 md:grid-cols-2">
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
              <div className="md:col-span-2">
                <button type="submit" className="liquid-glass-strong flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium text-white">
                  Submit Enquiry <ArrowUpRight />
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
              snapmarkmedia@gmail.com<br />
              82008045085
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href="https://www.instagram.com/snapmarkmedia?igsh=MWVuNWxtM2hsamFvNQ==" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full px-3 py-1.5 font-body text-[11px] text-white/90 hover:text-pink-400 transition-colors duration-200">Instagram</a>
              <a href="https://wa.me/82008045085" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full px-3 py-1.5 font-body text-[11px] text-white/90 hover:text-emerald-400 transition-colors duration-200">WhatsApp</a>
              <a href="https://youtube.com/@sandeshpatil_96k?si=huLSSt7WSk0vXboo" target="_blank" rel="noopener noreferrer" className="liquid-glass rounded-full px-3 py-1.5 font-body text-[11px] text-white/90 hover:text-red-500 transition-colors duration-200">YouTube</a>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 font-body text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Snapmark Media. All rights reserved.</span>
          <span>Privacy · Terms</span>
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
