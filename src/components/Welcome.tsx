interface WelcomeProps {
  title?: string;
  body?: string;
}

const defaults = {
  title: "Welcome to Chefcsa",
  body: "At Chefcsa, every dish starts with a genuine love for Ghanaian cooking — not a recipe book, but years of passion poured into every pot of food and every pinch of spice. We are bringing that same home-kitchen love straight to your door across the UK, one authentic meal at a time.",
};

export default function Welcome({ title = defaults.title, body = defaults.body }: WelcomeProps) {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mb-6">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-charcoal/70 leading-relaxed">
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}
