interface AuthenticityProps {
  title?: string;
  body1?: string;
  body2?: string;
  image_url?: string;
}

const defaults = {
  title: "Authentic Ghanaian Flavours Nearby",
  body1: "Every dish is lovingly prepared using the freshest ingredients, traditional recipes, and time-honoured techniques passed down through generations. No shortcuts, no compromises — just real, honest Ghanaian cooking.",
  body2: "From the bold, smoky heat of our jollof to the comforting richness of our light soup, each bite is a taste of home.",
};

export default function Authenticity({ title = defaults.title, body1 = defaults.body1, body2 = defaults.body2, image_url }: AuthenticityProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mb-6">
              {title}
            </h2>
            <div className="space-y-4 text-charcoal/70 leading-relaxed">
              <p>{body1}</p>
              <p>{body2}</p>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-terracotta/10 via-gold/5 to-forest/10 flex items-center justify-center border border-forest/5">
            {image_url ? (
              <img src={image_url} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-8">
                <span className="text-6xl">🇬🇭</span>
                <p className="mt-4 text-sm text-charcoal/50 font-medium">
                  Fresh Ingredients &bull; Traditional Recipes &bull; No Shortcuts
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
