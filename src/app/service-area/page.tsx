import Link from "next/link";

const areas = [
  {
    zone: "Cambridge (Local)",
    type: "Local Delivery",
    fee: "£2.50",
    minOrder: "£10.00",
    delivery: "Same day (order before 2pm)",
    note: "We deliver within a 10-mile radius of Cambridge city centre.",
  },
  {
    zone: "East of England",
    type: "Regional Delivery",
    fee: "£5.00",
    minOrder: "£15.00",
    delivery: "Next-day delivery",
    note: "Bedfordshire, Essex, Hertfordshire, Norfolk, Suffolk.",
  },
  {
    zone: "UK Nationwide",
    type: "Nationwide Delivery",
    fee: "£8.00",
    minOrder: "£25.00",
    delivery: "1-2 business days via courier",
    note: "We deliver to all postcodes across England, Scotland, Wales & Northern Ireland.",
  },
];

const cookingService = [
  {
    title: "In-Home Cooking Service",
    desc: "Chefcsa comes to your home and prepares a full Ghanaian meal for you and your guests. Perfect for dinner parties, celebrations, or just treating yourself.",
    price: "From £40 per head",
  },
  {
    title: "Cooking Lessons",
    desc: "Learn to cook authentic Ghanaian dishes in the comfort of your own kitchen. From perfecting jollof rice to mastering fufu pounding.",
    price: "From £50 per session",
  },
];

export default function ServiceAreaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-charcoal mb-4">
          Service Area & Coverage
        </h1>
        <p className="text-charcoal/60 max-w-lg mx-auto">
          Based in Cambridge, serving the UK with authentic Ghanaian cuisine.
          We come to you.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold text-forest mb-6">
          Delivery Zones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {areas.map((area) => (
            <div
              key={area.zone}
              className="rounded-2xl bg-white border border-forest/5 p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-xs font-semibold text-terracotta uppercase tracking-wider mb-1">
                {area.type}
              </div>
              <h3 className="font-display text-lg font-bold text-charcoal mb-3">
                {area.zone}
              </h3>
              <div className="space-y-2 text-sm text-charcoal/70">
                <p>
                  <span className="font-medium text-charcoal">Delivery Fee:</span>{" "}
                  {area.fee}
                </p>
                <p>
                  <span className="font-medium text-charcoal">Min Order:</span>{" "}
                  {area.minOrder}
                </p>
                <p>
                  <span className="font-medium text-charcoal">Est. Delivery:</span>{" "}
                  {area.delivery}
                </p>
              </div>
              <p className="mt-3 text-xs text-charcoal/50 italic">{area.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold text-forest mb-6">
          Cooking & Dining Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cookingService.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl bg-gradient-to-br from-cream to-white border border-forest/5 p-6"
            >
              <h3 className="font-display text-xl font-bold text-charcoal mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-charcoal/70 leading-relaxed mb-3">
                {service.desc}
              </p>
              <p className="text-terracotta font-semibold text-sm">{service.price}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center rounded-2xl bg-forest p-8 sm:p-12">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-cream mb-4">
          Not Sure If We Deliver To You?
        </h2>
        <p className="text-cream/70 mb-6 max-w-md mx-auto">
          Drop us a message with your postcode and we will let you know
          about delivery options and times.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center bg-terracotta hover:bg-terracotta-hover text-white px-8 py-3.5 rounded-full text-base font-semibold transition-all"
        >
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
