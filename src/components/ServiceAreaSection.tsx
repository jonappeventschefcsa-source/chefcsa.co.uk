import Link from "next/link";

export default function ServiceAreaSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mb-6">
              Serving the UK from Cambridge
            </h2>
            <div className="space-y-4 text-charcoal/70 leading-relaxed">
              <p>
                Based in Cambridge, we deliver authentic Ghanaian cuisine across
                the United Kingdom. Whether you are local to Cambridgeshire or
                further afield, we can bring the taste of Ghana to your door.
              </p>
              <p>
                For local deliveries in and around Cambridge, we offer flexible
                same-day and scheduled delivery. For nationwide orders, we use
                trusted courier services to ensure your meal arrives fresh and
                on time.
              </p>
            </div>
            <Link
              href="/service-area"
              className="mt-6 inline-flex items-center text-terracotta hover:text-terracotta-hover font-semibold text-sm transition-colors"
            >
              Check Delivery Availability &rarr;
            </Link>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-forest/5 via-gold/5 to-terracotta/5 flex items-center justify-center border border-forest/5">
            <div className="text-center p-8">
              <span className="text-6xl">📍</span>
              <p className="mt-4 text-sm text-charcoal/50 font-medium">
                Cambridge &bull; UK-wide delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
