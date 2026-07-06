interface ExperienceProps {
  title?: string;
  body?: string;
  image_url?: string;
}

const defaults = {
  title: "More Than Just Food — It's an Experience",
  body: "Every meal from Chefcsa is crafted with care, bringing the warmth and vibrancy of Ghanaian hospitality straight to your table. Whether it's a weeknight dinner or a special celebration, we make every order feel like a homecoming.",
};

export default function Experience({ title = defaults.title, body = defaults.body, image_url }: ExperienceProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mb-6">
              {title}
            </h2>
            <p className="text-charcoal/70 leading-relaxed">
              {body}
            </p>
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gold/10 via-terracotta/5 to-forest/10 flex items-center justify-center border border-forest/5">
            {image_url ? (
              <img src={image_url} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-8">
                <span className="text-6xl">👨🏾‍🍳</span>
                <p className="mt-4 text-sm text-charcoal/50 font-medium">
                  Made with love, delivered with care
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
