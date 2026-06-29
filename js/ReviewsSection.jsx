/* ─────────────────────────────────────────────────────────────
   ReviewsSection.jsx  —  Swipeable Testimonials
───────────────────────────────────────────────────────────────*/
const { motion: pm } = Motion;

const TESTIMONIALS_DATA = [
  {
    id: 12,
    author: "Rohan Desai",
    testimonial: "Sandesh is an absolute wizard! He took our raw footage and turned it into a cinematic masterpiece. His sense of pacing and color grading is unmatched.",
  },
  {
    id: 32,
    author: "Priya Sharma",
    testimonial: "Working with SnapMark Media was the best decision for our brand. The reels are so engaging that our social media reach skyrocketed within weeks.",
  },
  {
    id: 45,
    author: "Vikram Singh",
    testimonial: "I needed a high-end invitation video for my sister's wedding, and the result was breathtaking. Everyone asked who made it. Simply premium work.",
  },
  {
    id: 60,
    author: "Neha Gupta",
    testimonial: "From the very first draft, I knew we were in good hands. The attention to detail and dynamic transitions made our content stand out completely.",
  },
];

function TestimonialCard({ handleShuffle, testimonial, position, id, author }) {
  const dragRef = React.useRef(0);
  const isFront = position === "front";

  return (
    <pm.div
      style={{
        zIndex: position === "front" ? "2" : position === "middle" ? "1" : "0"
      }}
      animate={{
        rotate: position === "front" ? "-6deg" : position === "middle" ? "0deg" : "6deg",
        x: position === "front" ? "0%" : position === "middle" ? "33%" : "66%",
        scale: position === "front" ? 1 : position === "middle" ? 0.95 : 0.9,
        opacity: position === "front" ? 1 : position === "middle" ? 0.4 : 0.1
      }}
      drag={true}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onDragStart={(e) => {
        dragRef.current = e.clientX;
      }}
      onDragEnd={(e) => {
        if (dragRef.current - e.clientX > 150 || e.clientX - dragRef.current > 150) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.35 }}
      className={`absolute left-0 top-0 grid h-[450px] w-[350px] max-w-[90vw] select-none place-content-center space-y-6 rounded-[2rem] p-8 shadow-[0_0_40px_rgba(139,92,246,0.1)] liquid-glass border border-white/5 ${
        isFront ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      <div className="relative mx-auto h-28 w-28">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-40 blur-md"></div>
        <img
          src={`https://i.pravatar.cc/128?img=${id}`}
          alt={`Avatar of ${author}`}
          className="relative pointer-events-none h-full w-full rounded-full border-[3px] border-white/10 object-cover shadow-xl"
        />
      </div>
      
      <p className="text-center font-body text-base italic leading-relaxed text-white/80">"{testimonial}"</p>
      
      <div>
        <p className="text-center font-heading text-xl font-bold tracking-wide" style={{ background: "linear-gradient(90deg, #d8b4fe 0%, #60a5fa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {author}
        </p>
        <p className="mt-1 text-center font-body text-xs font-semibold uppercase tracking-widest text-white/40">Client</p>
      </div>
    </pm.div>
  );
}

function ReviewsSection() {
  const [testimonials, setTestimonials] = React.useState(TESTIMONIALS_DATA);

  const handleShuffle = () => {
    setTestimonials((prev) => {
      const copy = [...prev];
      const front = copy.shift();
      copy.push(front);
      return copy;
    });
  };

  const handleShuffleBack = () => {
    setTestimonials((prev) => {
      const copy = [...prev];
      const back = copy.pop();
      copy.unshift(back);
      return copy;
    });
  };

  return (
    <section id="reviews" className="relative overflow-hidden px-4 py-24 md:px-16 lg:px-20">
      {/* ── decorative ambient blobs ── */}
      <div className="pointer-events-none absolute left-[10%] top-[20%] h-[400px] w-[400px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="pointer-events-none absolute right-[5%] bottom-[10%] h-[500px] w-[500px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="mb-20 text-center">
          <pm.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-body text-sm text-white/70"
          >
            // Client Reviews
          </pm.p>
          <pm.h2
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 font-heading text-4xl italic leading-tight tracking-[-1px] text-white sm:text-5xl md:text-6xl"
          >
            Trusted <span style={{ background: "linear-gradient(90deg, #a78bfa 0%, #f472b6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Clients</span>
          </pm.h2>
        </div>

        {/* Swipeable Cards Container */}
        <div className="relative mx-auto h-[450px] w-[350px] max-w-full">
          {testimonials.map((t, index) => {
            let position = "back";
            if (index === 0) position = "front";
            else if (index === 1) position = "middle";

            return (
              <TestimonialCard
                key={t.id}
                id={t.id}
                author={t.author}
                testimonial={t.testimonial}
                position={position}
                handleShuffle={handleShuffle}
              />
            );
          })}
        </div>
        
        
        {/* Navigation Arrows */}
        <div className="mt-12 flex items-center justify-center gap-6">
          <pm.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShuffleBack}
            className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </pm.button>
          
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-white/30 italic">Swipe or Click</p>
          
          <pm.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShuffle}
            className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </pm.button>
        </div>
      </div>
    </section>
  );
}

window.ReviewsSection = ReviewsSection;
