/* ─────────────────────────────────────────────────────────────
   ReviewsSectionDynamic.jsx  —  Redesigned Testimonials Grid
   Fetches approved reviews dynamically from Supabase database.
 ───────────────────────────────────────────────────────────────*/
const { motion: pm } = Motion;

const DEFAULT_TESTIMONIALS = [
  {
    id: "mock-1",
    author: "Sarah Jenkins",
    profession: "Founder, Alpha Media Group",
    testimonial: "SnapMark Media took our raw video content and turned it into high-converting Instagram reels. Our engagement skyrocketed by over 150% in the first two weeks!",
    rating: 5,
    serviceUsed: "Reels Editing",
    photoUrl: "https://i.pravatar.cc/128?img=33"
  },
  {
    id: "mock-2",
    author: "Marcus Sterling",
    profession: "Tech YouTuber, 1.2M Subs",
    testimonial: "The pacing, sound design, and custom graphics they added were absolutely top-tier. They are highly responsive and deliver exactly on time.",
    rating: 5,
    serviceUsed: "Video Editing",
    photoUrl: "https://i.pravatar.cc/128?img=12"
  },
  {
    id: "mock-3",
    author: "Elena Rostova",
    profession: "Marketing Director, Nether Apparel",
    testimonial: "Outstanding service! From invitation video cards to cinematic event recaps, their creative editors understand pacing and brand identity better than any team we've worked with.",
    rating: 5,
    serviceUsed: "Motion Graphics",
    photoUrl: "https://i.pravatar.cc/128?img=47"
  }
];

function TestimonialCard({ testimonial, rating, photoUrl, author, serviceUsed, profession, delayIndex }) {
  const stars = "★".repeat(rating || 5) + "☆".repeat(5 - (rating || 5));
  const finalAvatar = photoUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  return (
    <pm.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: delayIndex * 0.1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="liquid-glass flex flex-col justify-between rounded-[2rem] p-8 shadow-[0_4px_30px_rgba(139,92,246,0.02)] border border-white/5 hover:border-white/10 hover:shadow-[0_12px_40px_rgba(139,92,246,0.12)] transition-all duration-300 min-h-[300px]"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-yellow-400 text-sm tracking-wider">{stars}</span>
          {serviceUsed && (
            <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-white/50">
              {serviceUsed}
            </span>
          )}
        </div>
        
        <p className="font-body text-sm italic leading-relaxed text-white/80">
          "{testimonial}"
        </p>
      </div>

      <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-6">
        <div className="h-11 w-11 rounded-full border border-white/10 overflow-hidden flex-shrink-0 bg-white/5">
          <img src={finalAvatar} alt={author} className="h-full w-full object-cover" />
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold text-white tracking-wide">{author}</h4>
          <p className="text-[11px] text-white/45 font-medium">{profession}</p>
        </div>
      </div>
    </pm.div>
  );
}

function ReviewsSection() {
  const [testimonials, setTestimonials] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadReviews = async () => {
      const supabaseUrl = 'https://amzrzysnwbfnldnyricg.supabase.co';
      const supabaseAnonKey = 'sb_publishable_f6yhgk7fBqV46E872LyKEg__mQfkTKk';
      
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/reviews?status=eq.Approved&order=created_at.desc`, {
          method: 'GET',
          headers: {
            'apikey': supabaseAnonKey,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load reviews');
        }

        const data = await response.json();
        
        const mapped = data.map(item => ({
          id: item.id,
          author: item.client_name,
          profession: item.client_profession || "Client",
          testimonial: item.detailed_review,
          rating: item.rating,
          serviceUsed: item.service_used,
          photoUrl: item.photo_url
        }));

        setTestimonials(mapped);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const displayReviews = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  return (
    <section id="reviews" className="relative overflow-hidden px-6 py-24 md:px-16 lg:px-20 border-t border-white/5">
      {/* Ambient decorative lighting */}
      <div className="pointer-events-none absolute left-[10%] top-[20%] h-[400px] w-[400px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)", filter: "blur(65px)" }} />
      <div className="pointer-events-none absolute right-[5%] bottom-[10%] h-[500px] w-[500px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)", filter: "blur(85px)" }} />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Section Header */}
        <div className="mb-20 text-center space-y-4">
          <pm.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff]"
          >
            CLIENT REVIEWS
          </pm.p>
          <pm.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-heading text-4xl italic leading-tight tracking-[-1px] text-white sm:text-5xl md:text-6xl"
          >
            What Our <span style={{ background: "linear-gradient(90deg, #a78bfa 0%, #f472b6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Clients</span> Say
          </pm.h2>
          <pm.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-sm text-white/50 max-w-md mx-auto leading-relaxed"
          >
            Real feedback from creators and brands who partner with SnapMark Media to elevate their media presence.
          </pm.p>
        </div>

        {/* Testimonials Grid Layout */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-white/40 text-sm font-body animate-pulse uppercase tracking-wider">// Loading reviews...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-red-400/60 text-sm font-body uppercase tracking-wider">// Unable to load reviews at this time.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayReviews.map((t, index) => (
              <TestimonialCard
                key={t.id}
                author={t.author}
                testimonial={t.testimonial}
                rating={t.rating}
                serviceUsed={t.serviceUsed}
                photoUrl={t.photoUrl}
                profession={t.profession}
                delayIndex={index}
              />
            ))}
          </div>
        )}
        
        {/* Leave a Review Button */}
        <div className="mt-16 flex justify-center">
          <pm.a
            href="leave-review.html"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-black font-semibold text-sm rounded-full shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:bg-white/90 transition-all duration-200 cursor-pointer"
          >
            Leave a Review
          </pm.a>
        </div>
      </div>
    </section>
  );
}

window.ReviewsSection = ReviewsSection;
