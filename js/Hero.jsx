const { motion } = Motion;

const rise = {
  initial: { filter: "blur(10px)", opacity: 0, y: 20 },
  animate: { filter: "blur(0px)", opacity: 1, y: 0 }
};

function StatCard({ icon, value, label }) {
  return (
    <div className="liquid-glass flex min-h-[138px] w-[220px] flex-col rounded-[1.25rem] p-5 text-left">
      {icon}
      <div className="mt-auto pt-5">
        <div className="font-heading text-4xl italic leading-none tracking-[-1px] text-white">{value}</div>
        <div className="mt-2 font-body text-xs font-light text-white">{label}</div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen overflow-hidden bg-transparent">
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
        className="site-background-media absolute left-1/2 top-0 z-0 -translate-x-1/2 object-cover object-top"
        style={{ width: "120%", height: "120%" }}
      />
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center px-4 pb-4 pt-24 text-center">
          <motion.div {...rise} transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }} className="liquid-glass flex items-center gap-2 rounded-full p-1">
            <span className="rounded-full bg-white px-3 py-1 font-body text-xs font-semibold text-black">Studio</span>
            <span className="pr-3 font-body text-xs text-white/90 sm:text-sm">Short tagline placeholder</span>
          </motion.div>

          <BlurText text="Snapmark Media" className="mt-5 max-w-3xl justify-center font-heading text-6xl italic leading-[0.8] tracking-[-3px] text-white sm:text-7xl md:text-8xl md:tracking-[-4px] lg:text-[7rem]" />

          <motion.p {...rise} transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }} className="mt-4 max-w-2xl font-body text-sm font-light leading-tight text-white md:text-base">
            Brief studio introduction placeholder. Add a concise statement about the ideas, stories, and visual experiences Snapmark Media creates.
          </motion.p>

          <motion.div {...rise} transition={{ duration: 0.7, delay: 1.1, ease: "easeOut" }} className="mt-6 flex items-center gap-6">
            <a href="#services" className="liquid-glass-strong flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium text-white">
              Primary Action <ArrowUpRight />
            </a>
            <a href="#gallery" className="flex items-center gap-2 font-body text-sm font-medium text-white">
              Secondary Action <PlayIcon />
            </a>
          </motion.div>

          <motion.div {...rise} transition={{ duration: 0.7, delay: 1.3, ease: "easeOut" }} className="mt-8 flex items-stretch gap-3 sm:gap-4">
            <StatCard icon={<ClockIcon />} value="00+" label="Projects delivered placeholder" />
            <StatCard icon={<GlobeIcon />} value="00+" label="Creative partners placeholder" />
          </motion.div>
        </main>

        <motion.div {...rise} transition={{ duration: 0.7, delay: 1.4, ease: "easeOut" }} className="flex flex-col items-center gap-4 px-4 pb-8">
          <div className="liquid-glass rounded-full px-3.5 py-1 font-body text-xs font-medium text-white">Selected client names and creative partners</div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-heading text-2xl italic tracking-tight text-white md:gap-x-16 md:text-3xl">
            {["Brand One", "Studio Two", "Client Three", "Label Four", "Partner Five"].map((name) => <span key={name}>{name}</span>)}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

window.Hero = Hero;
