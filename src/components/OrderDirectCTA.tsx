import Link from "next/link";

interface OrderDirectCTAProps {
  title?: string;
  body?: string;
  buttonText?: string;
}

export default function OrderDirectCTA({
  title = "Order From Our Website",
  body = "Order direct to save on fees, get faster service, and support a local Ghanaian kitchen right here in the UK.",
  buttonText = "Order Now",
}: OrderDirectCTAProps) {
  return (
    <section className="relative bg-forest overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/95 to-charcoal/90" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream mb-4">
          {title}
        </h2>
        <p className="text-cream/70 max-w-xl mx-auto mb-8 leading-relaxed">
          {body}
        </p>
        <Link
          href="/order"
          className="inline-flex items-center justify-center bg-terracotta hover:bg-terracotta-hover text-white px-8 py-3.5 rounded-full text-base font-semibold transition-all hover:shadow-lg hover:shadow-terracotta/30"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
