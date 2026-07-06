import Link from "next/link";

interface HeroProps {
  headline?: string;
  subheadline?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  backgroundImage?: string;
}

export default function Hero({
  headline = "Best Ghanaian Food in the UK",
  subheadline = "Authentic Ghanaian Flavours, Made Fresh Daily",
  ctaPrimary = "Order Online",
  ctaSecondary = "View Menu",
  backgroundImage,
}: HeroProps) {
  return (
    <section className="relative bg-forest overflow-hidden min-h-[70vh] flex items-center">
      {backgroundImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 animate-hero-zoom"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest/95 via-forest/85 to-charcoal/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-transparent to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-forest/95 via-forest/90 to-charcoal/80" />
      )}

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #E8A93C 2px, transparent 2px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 rounded-full bg-terracotta/5 blur-3xl" />

      <div className="absolute top-20 left-[10%] text-4xl opacity-20 animate-float hidden lg:block">
        🍛
      </div>
      <div className="absolute bottom-32 right-[15%] text-3xl opacity-20 animate-float-reverse hidden lg:block">
        🥣
      </div>
      <div className="absolute top-1/3 right-[25%] text-2xl opacity-15 animate-float-delayed hidden lg:block">
        🍌
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold tracking-wider uppercase">
            Authentic Ghanaian Cuisine
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-cream leading-tight animate-fade-in-up">
            {headline}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-cream/80 max-w-xl leading-relaxed animate-fade-in-up-delayed-1">
            {subheadline}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in-up-delayed-2">
            <Link
              href="/order"
              className="inline-flex items-center justify-center bg-terracotta hover:bg-terracotta-hover text-white px-8 py-3.5 rounded-full text-base font-semibold transition-all hover:shadow-lg hover:shadow-terracotta/30 hover:scale-105 active:scale-95"
            >
              {ctaPrimary}
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center border-2 border-cream/30 hover:border-cream/60 text-cream px-8 py-3.5 rounded-full text-base font-semibold transition-all hover:bg-cream/5 hover:scale-105 active:scale-95"
            >
              {ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
