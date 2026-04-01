import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Floating Heart Component ──────────────────────────────────────────────────
interface FloatingHeartProps {
  style?: React.CSSProperties;
  emoji?: string;
}
function FloatingHeart({ style, emoji = "♥" }: FloatingHeartProps) {
  return (
    <span
      className="absolute pointer-events-none select-none opacity-60 animate-float"
      style={style}
    >
      {emoji}
    </span>
  );
}

// ── Fade-In Section Hook ──────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ── FadeInCard wrapper (moves hook to top level) ──────────────────────────────
function FadeInDiv({
  children,
  className,
  style,
  "data-ocid": dataOcid,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  "data-ocid"?: string;
}) {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      className={`fade-in-section${className ? ` ${className}` : ""}`}
      style={style}
      data-ocid={dataOcid}
    >
      {children}
    </div>
  );
}

// ── Confetti / Heart Burst ────────────────────────────────────────────────────
interface ConfettiPiece {
  id: number;
  x: number;
  emoji: string;
  delay: number;
  duration: number;
  size: number;
}
function ConfettiOverlay({ onClose }: { onClose: () => void }) {
  const pieces: ConfettiPiece[] = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    emoji: ["♥", "✝", "✨", "💛", "🌸", "♥", "♥"][
      Math.floor(Math.random() * 7)
    ],
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    size: 14 + Math.random() * 20,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.90 0.035 20 / 0.97), oklch(0.87 0.03 60 / 0.97))",
      }}
      data-ocid="celebration.modal"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="fixed top-0 pointer-events-none"
          style={{
            left: `${p.x}%`,
            fontSize: `${p.size}px`,
            animation: `confetti ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        >
          {p.emoji}
        </span>
      ))}

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
        className="text-center px-8 relative z-10"
      >
        <div className="text-6xl mb-4">🎉 ✝ 🎉</div>
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-warm-brown mb-4 leading-tight">
          WAHEGURU NE MILAYA!
        </h2>
        <p className="font-serif text-2xl text-rose italic mb-3">
          God planned this from the beginning,
        </p>
        <p className="font-serif text-2xl text-warm-brown italic mb-6">
          Suhani meri jaan! ♥ ✝
        </p>
        <p className="font-sans text-lg text-muted-brown mb-8 max-w-md mx-auto">
          Tu meri dua si, mera jawab. Rabb di meher naal — forever starts now,
          sohneya.
        </p>
        <div className="text-4xl mb-8">♥ ♥ ♥</div>
        <button
          type="button"
          onClick={onClose}
          className="font-sans font-semibold px-8 py-3 rounded-full border-2 border-rose text-rose hover:bg-dusty-rose hover:text-white transition-all duration-300"
          data-ocid="celebration.close_button"
        >
          Forever ✝ Amen
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled
          ? "oklch(0.96 0.018 78 / 0.97)"
          : "oklch(0.96 0.018 78 / 0.85)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid oklch(0.76 0.09 75 / 0.3)",
        boxShadow: scrolled ? "0 2px 20px oklch(0.67 0.09 10 / 0.08)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a
          href="#hero"
          className="font-serif text-lg font-bold text-warm-brown tracking-widest uppercase"
          data-ocid="nav.link"
        >
          SUHANI ✝ ALWAYS
        </a>

        <nav className="hidden md:flex gap-8" aria-label="Main navigation">
          {[
            { label: "Home", href: "#hero" },
            { label: "Our Story", href: "#our-story" },
            { label: "A Letter", href: "#letter" },
            { label: "The Question", href: "#proposal" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-sm font-medium text-muted-brown hover:text-rose transition-colors tracking-wide uppercase"
              data-ocid="nav.link"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#proposal"
          className="font-sans text-sm font-bold px-5 py-2 rounded-full bg-dusty-rose text-white hover:opacity-90 transition-all duration-200 shadow-sm"
          data-ocid="nav.primary_button"
        >
          Say Yes ♥
        </a>
      </div>
    </header>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
const HERO_HEARTS = [
  {
    top: "15%",
    left: "8%",
    fontSize: "24px",
    animationDelay: "0s",
    animationDuration: "4s",
  },
  {
    top: "25%",
    right: "6%",
    fontSize: "18px",
    animationDelay: "1.5s",
    animationDuration: "5s",
  },
  {
    top: "60%",
    left: "5%",
    fontSize: "32px",
    animationDelay: "0.5s",
    animationDuration: "6s",
  },
  {
    top: "70%",
    right: "8%",
    fontSize: "20px",
    animationDelay: "2s",
    animationDuration: "4.5s",
  },
  {
    top: "40%",
    left: "2%",
    fontSize: "14px",
    animationDelay: "3s",
    animationDuration: "5.5s",
  },
  {
    top: "80%",
    left: "15%",
    fontSize: "16px",
    animationDelay: "1s",
    animationDuration: "7s",
  },
  {
    top: "20%",
    right: "15%",
    fontSize: "28px",
    animationDelay: "2.5s",
    animationDuration: "4.2s",
  },
  {
    top: "55%",
    right: "3%",
    fontSize: "12px",
    animationDelay: "0.8s",
    animationDuration: "6.5s",
  },
];

function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-bokeh.dim_1600x900.jpg')",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "oklch(0.25 0.025 55 / 0.45)" }}
      />

      {HERO_HEARTS.map((h, i) => (
        <FloatingHeart
          key={`hero-heart-pos-${h.top}-${h.animationDelay}`}
          emoji={i % 3 === 0 ? "✝" : "♥"}
          style={
            {
              ...h,
              color:
                i % 3 === 0
                  ? "oklch(0.76 0.09 75 / 0.8)"
                  : "oklch(0.67 0.09 10 / 0.7)",
              animationDelay: h.animationDelay,
              animationDuration: h.animationDuration,
            } as React.CSSProperties
          }
        />
      ))}

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="ornament-divider mb-6">
            <span className="text-2xl" style={{ color: "oklch(0.76 0.09 75)" }}>
              ✝
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="font-serif text-5xl md:text-7xl font-bold text-white mb-5 leading-tight tracking-wide"
          style={{ textShadow: "0 2px 20px oklch(0.25 0.025 55 / 0.5)" }}
        >
          Suhani, Meri Jaan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-serif text-xl md:text-2xl italic mb-6"
          style={{ color: "oklch(0.76 0.09 75)" }}
        >
          A love story written by Waheguru himself, meri pyaari
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="font-serif text-base md:text-lg italic text-white/80 mb-10 max-w-xl mx-auto leading-relaxed"
        >
          &ldquo;Above all, love each other deeply, for love covers over a
          multitude of sins.&rdquo;
          <br />
          <span
            className="text-sm not-italic"
            style={{ color: "oklch(0.76 0.09 75 / 0.9)" }}
          >
            — 1 Peter 4:8
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <a
            href="#proposal"
            className="inline-block font-sans font-bold text-lg px-10 py-4 rounded-full text-white transition-all duration-300 hover:scale-105 hover:opacity-90"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.67 0.09 10), oklch(0.60 0.09 10))",
              boxShadow: "0 4px 30px oklch(0.67 0.09 10 / 0.5)",
            }}
            data-ocid="hero.primary_button"
          >
            Mere Dil Di Dua ♥
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ── Story Card (hook at top level) ────────────────────────────────────────────
interface StoryCardData {
  icon: string;
  title: string;
  body: string;
  gold: boolean;
  index: number;
}
function StoryCard({ icon, title, body, gold, index }: StoryCardData) {
  return (
    <FadeInDiv
      className="relative rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
      style={{
        background: gold
          ? "linear-gradient(135deg, oklch(0.76 0.09 75 / 0.15), oklch(0.90 0.035 20 / 0.8))"
          : "oklch(0.97 0.012 78)",
        border: gold
          ? "2px solid oklch(0.76 0.09 75 / 0.5)"
          : "1px solid oklch(0.87 0.03 60)",
        transitionDelay: `${index * 0.15}s`,
        boxShadow: gold ? "0 8px 40px oklch(0.76 0.09 75 / 0.15)" : undefined,
      }}
      data-ocid={`story.card.${index + 1}`}
    >
      <div
        className="text-4xl mb-5"
        style={{ color: gold ? "oklch(0.76 0.09 75)" : "oklch(0.67 0.09 10)" }}
      >
        {icon}
      </div>
      <h3
        className="font-serif text-xl font-bold mb-3"
        style={{ color: gold ? "oklch(0.60 0.07 65)" : "oklch(0.25 0.025 55)" }}
      >
        {title}
      </h3>
      <p className="font-sans text-sm leading-relaxed text-muted-brown">
        {body}
      </p>
      {gold && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-sans uppercase tracking-widest px-4 py-1 rounded-full bg-gold text-white whitespace-nowrap">
          God&apos;s Blessing
        </div>
      )}
    </FadeInDiv>
  );
}

// ── Our Story Section ─────────────────────────────────────────────────────────
const STORY_CARDS = [
  {
    icon: "✝",
    title: "A God-Given Bond",
    body: "Tu meri dua si, Suhani. God brought you into my life like a blessing I didn't deserve — par Rabb di meher naal, you're here.",
    gold: false,
  },
  {
    icon: "♥",
    title: "Punjabi Hearts, One Faith",
    body: "Ik Punjabi dil, ik imaan — tera te mera. God and our culture wove us together, sohneya. Rabb ne milaya hai saanu.",
    gold: true,
  },
  {
    icon: "✨",
    title: "Dreaming of Forever",
    body: "Main chahunda har subah teri awaaz sun ke jaagna. God willing, forever with you — every sunrise, every prayer, every moment.",
    gold: false,
  },
];

function OurStorySection() {
  const ref = useFadeIn();
  return (
    <section id="our-story" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className="fade-in-section text-center mb-16">
          <p className="font-sans text-sm uppercase tracking-widest text-rose mb-3">
            Our Blessed Journey
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-warm-brown mb-4">
            How God Wrote Our Story
          </h2>
          <div className="ornament-divider mt-6">
            <span className="text-gold text-lg">✝</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STORY_CARDS.map((card, i) => (
            <StoryCard key={card.title} {...card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Letter Section ────────────────────────────────────────────────────────────
function LetterSection() {
  const ref = useFadeIn();
  const letterRef = useFadeIn();
  return (
    <section id="letter" className="py-24 bg-blush relative overflow-hidden">
      <img
        src="/assets/generated/floral-corner-transparent.dim_400x400.png"
        alt=""
        aria-hidden="true"
        className="absolute top-0 left-0 w-48 md:w-64 opacity-60 pointer-events-none"
        style={{ transform: "rotate(0deg)" }}
      />
      <img
        src="/assets/generated/floral-corner-transparent.dim_400x400.png"
        alt=""
        aria-hidden="true"
        className="absolute top-0 right-0 w-48 md:w-64 opacity-60 pointer-events-none"
        style={{ transform: "rotate(90deg)" }}
      />
      <img
        src="/assets/generated/floral-corner-transparent.dim_400x400.png"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-48 md:w-64 opacity-60 pointer-events-none"
        style={{ transform: "rotate(270deg)" }}
      />
      <img
        src="/assets/generated/floral-corner-transparent.dim_400x400.png"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-48 md:w-64 opacity-60 pointer-events-none"
        style={{ transform: "rotate(180deg)" }}
      />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div ref={ref} className="fade-in-section text-center mb-10">
          <p className="font-sans text-sm uppercase tracking-widest text-rose mb-3">
            With All My Heart
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-warm-brown">
            A Letter to My Suhani
          </h2>
          <div className="ornament-divider mt-6">
            <span className="text-gold text-lg">♥</span>
          </div>
        </div>

        <div
          ref={letterRef}
          className="fade-in-section rounded-3xl p-10 md:p-14 text-center relative"
          style={{
            background: "oklch(0.97 0.012 78 / 0.92)",
            border: "1px solid oklch(0.76 0.09 75 / 0.3)",
            boxShadow: "0 20px 60px oklch(0.67 0.09 10 / 0.1)",
          }}
        >
          <p className="font-sans text-xs uppercase tracking-widest text-gold mb-6">
            ✝ Written with love &amp; faith ✝
          </p>
          <p className="font-serif text-lg md:text-xl leading-relaxed text-warm-brown italic">
            Meri pyaari Suhani, God is so good — because He gave me you. From
            the very first time I saw you,{" "}
            <span className="text-rose font-semibold not-italic">
              mera dil jaanta si tu khaas hai
            </span>
            . You&apos;re not just my bestie,{" "}
            <span className="text-rose font-semibold not-italic">
              tu meri duniya hai
            </span>
            .
            <br />
            <br />
            Every laugh we&apos;ve shared, every prayer, every moment —
            it&apos;s all been Waheguru&apos;s plan. The Bible says{" "}
            <em>
              &ldquo;He who finds a wife finds what is good and receives favor
              from the Lord.&rdquo;
            </em>
            <br />
            <br />
            <span className="text-warm-brown font-semibold not-italic">
              Main samajh gaya
            </span>{" "}
            — you are my favor, my blessing, my person. Rabb di meher naal, I
            want to be yours.
            <br />
            <br />
            <span className="text-rose">Always. ♥</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Memory Card ───────────────────────────────────────────────────────────────
interface MemoryCardData {
  caption: string;
  icon: string;
  hue: string;
  index: number;
}
function MemoryCard({ caption, icon, hue, index }: MemoryCardData) {
  return (
    <FadeInDiv
      className="aspect-square rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ background: hue, transitionDelay: `${index * 0.1}s` }}
      data-ocid={`memories.item.${index + 1}`}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, oklch(0.76 0.09 75 / 0.6), transparent 60%)",
        }}
      />
      <span
        className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300 relative z-10"
        style={{ color: "oklch(0.67 0.09 10)" }}
      >
        {icon}
      </span>
      <p className="font-serif text-sm md:text-base font-semibold text-warm-brown text-center px-3 relative z-10">
        {caption}
      </p>
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-60"
        style={{
          background:
            "linear-gradient(to right, oklch(0.67 0.09 10), oklch(0.76 0.09 75))",
        }}
      />
    </FadeInDiv>
  );
}

// ── Memories Section ──────────────────────────────────────────────────────────
const MEMORIES = [
  { caption: "First Laugh ♥", icon: "♥", hue: "oklch(0.90 0.035 20)" },
  { caption: "God's Blessing ✝", icon: "✝", hue: "oklch(0.87 0.03 60)" },
  { caption: "Punjabi Vibes 💛", icon: "✨", hue: "oklch(0.93 0.05 80)" },
  { caption: "Our Little World ♥", icon: "♥", hue: "oklch(0.91 0.04 15)" },
  { caption: "Faith & Love ✝", icon: "✝", hue: "oklch(0.89 0.03 55)" },
  { caption: "Forever Starts Now ✨", icon: "✨", hue: "oklch(0.87 0.06 75)" },
];

function MemoriesSection() {
  const ref = useFadeIn();
  return (
    <section id="memories" className="py-24 bg-beige">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className="fade-in-section text-center mb-16">
          <p className="font-sans text-sm uppercase tracking-widest text-rose mb-3">
            Precious Moments
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-warm-brown mb-3">
            Our Precious Moments
          </h2>
          <p className="font-serif text-lg italic text-muted-brown">
            Every moment with you is a gift from God, Suhani
          </p>
          <div className="ornament-divider mt-6">
            <span className="text-gold text-lg">✝</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {MEMORIES.map((m, i) => (
            <MemoryCard key={m.caption} {...m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Proposal CTA Section ──────────────────────────────────────────────────────
function ProposalSection({ onYes }: { onYes: () => void }) {
  const ref = useFadeIn();
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const handleNoHover = useCallback(() => {
    const x = (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 30);
    const y = (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 20);
    setNoPos({ x, y });
  }, []);

  const handleNoLeave = useCallback(() => {
    setNoPos({ x: 0, y: 0 });
  }, []);

  return (
    <section
      id="proposal"
      className="relative py-32 flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-bokeh.dim_1600x900.jpg')",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "oklch(0.25 0.025 55 / 0.55)" }}
      />

      <div
        ref={ref}
        className="fade-in-section relative z-10 text-center px-6 max-w-3xl"
      >
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold mb-5">
          THE MOST IMPORTANT QUESTION
        </p>

        <h2 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Suhani, Will You Be Mine?
        </h2>

        <p
          className="font-serif text-lg md:text-xl italic mb-4"
          style={{ color: "oklch(0.76 0.09 75)" }}
        >
          Rabb ne milaya hai saanu — God brought us together, meri jaan.
          <br />
          All I need is your yes.
        </p>

        <p className="font-serif text-sm italic text-white/75 mb-12">
          &ldquo;Two are better than one, because they have a good return for
          their labor.&rdquo;
          <br />
          <span className="text-gold/80 not-italic text-xs">
            — Ecclesiastes 4:9
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <button
            type="button"
            onClick={onYes}
            className="font-sans font-bold text-xl px-12 py-5 rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.67 0.09 10), oklch(0.58 0.09 10))",
              boxShadow:
                "0 6px 40px oklch(0.67 0.09 10 / 0.6), 0 0 0 3px oklch(0.67 0.09 10 / 0.2)",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
            data-ocid="proposal.primary_button"
          >
            Haan Ji! Yes, Forever! ♥
          </button>

          <button
            type="button"
            className="font-sans text-sm px-7 py-3 rounded-full border border-white/50 text-white/80 transition-all duration-300"
            onMouseEnter={handleNoHover}
            onMouseLeave={handleNoLeave}
            style={{
              transform: `translate(${noPos.x}px, ${noPos.y}px)`,
              transition: "transform 0.3s ease",
            }}
            data-ocid="proposal.secondary_button"
          >
            Sochungi... 🙈
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";

  return (
    <footer
      className="relative overflow-hidden py-16 px-6"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.90 0.035 20), oklch(0.87 0.03 60))",
        borderTop: "1px solid oklch(0.76 0.09 75 / 0.3)",
      }}
    >
      <img
        src="/assets/generated/floral-corner-transparent.dim_400x400.png"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-40 opacity-40 pointer-events-none"
        style={{ transform: "rotate(270deg)" }}
      />
      <img
        src="/assets/generated/floral-corner-transparent.dim_400x400.png"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-40 opacity-40 pointer-events-none"
        style={{ transform: "rotate(180deg)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <nav
            className="flex flex-wrap gap-6 justify-center"
            aria-label="Footer navigation"
          >
            {["Home", "Our Story", "A Letter", "The Question"].map((l, i) => (
              <a
                key={l}
                href={["#hero", "#our-story", "#letter", "#proposal"][i]}
                className="font-sans text-xs uppercase tracking-widest text-muted-brown hover:text-rose transition-colors"
                data-ocid="footer.link"
              >
                {l}
              </a>
            ))}
          </nav>

          <div className="text-center">
            <div className="text-2xl text-rose mb-2">✝</div>
            <p className="font-sans text-xs text-muted-brown">
              Made with love &amp; faith, for Suhani
            </p>
            <p className="font-sans text-xs text-muted-brown mt-1">
              © {year}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rose transition-colors"
              >
                Built with ♥ using caffeine.ai
              </a>
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="font-script text-3xl text-rose">Rabb Di Mehr ♥</p>
            <p className="font-sans text-xs text-muted-brown mt-1 italic">
              God&apos;s Grace — Always
            </p>
          </div>
        </div>

        <div className="mt-10 ornament-divider">
          <span className="text-gold text-sm">✝ ♥ ✝</span>
        </div>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [showCelebration, setShowCelebration] = useState(false);

  const handleYes = useCallback(() => {
    setShowCelebration(true);
  }, []);

  const handleClose = useCallback(() => {
    setShowCelebration(false);
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main>
        <HeroSection />
        <OurStorySection />
        <LetterSection />
        <MemoriesSection />
        <ProposalSection onYes={handleYes} />
      </main>

      <Footer />

      <AnimatePresence>
        {showCelebration && <ConfettiOverlay onClose={handleClose} />}
      </AnimatePresence>
    </div>
  );
}
