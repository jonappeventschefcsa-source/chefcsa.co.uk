import Link from "next/link";

interface Special {
  title: string;
  description: string;
  days_available?: string;
  image_url?: string;
}

const fallbackSpecials: Special[] = [
  { title: "Weekend Jollof Special", description: "Every Saturday & Sunday — our signature jollof rice with your choice of protein. The way mum used to make it.", days_available: "Saturday, Sunday" },
  { title: "Friday Fufu Night", description: "Freshly pounded fufu with your choice of light soup, groundnut soup, or palm nut soup. Available Friday evenings.", days_available: "Friday" },
];

interface SpecialsProps {
  specials?: Special[];
}

export default function Specials({ specials = fallbackSpecials }: SpecialsProps) {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mb-10 text-center">
          Weekly Specials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specials.map((special) => (
            <div
              key={special.title}
              className="rounded-2xl border border-forest/5 overflow-hidden bg-cream hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-0">
                {special.image_url ? (
                  <div className="sm:w-40 shrink-0 aspect-[4/3] sm:aspect-square overflow-hidden">
                    <img src={special.image_url} alt={special.title} className="w-full h-full object-cover" />
                  </div>
                ) : null}
                <div className="p-6 sm:p-8 flex flex-col gap-4">
                  <h3 className="font-display text-xl font-bold text-charcoal mb-1">
                    {special.title}
                  </h3>
                  <p className="text-sm text-charcoal/70 leading-relaxed">
                    {special.description}
                  </p>
                  {special.days_available && (
                    <p className="text-xs text-terracotta font-medium">
                      {special.days_available}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/contact"
            className="inline-flex text-terracotta hover:text-terracotta-hover font-semibold text-sm transition-colors"
          >
            Ask about this week&rsquo;s specials &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
