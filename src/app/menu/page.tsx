import Link from "next/link";
import { getMenuItems } from "@/lib/site-content";

const fallbackCategories = [
  {
    name: "Rice & Classics",
    items: [
      { name: "Jollof Rice", price: "£8.50", desc: "Classic one-pot rice with tomato, pepper & spices", image_url: "" },
      { name: "Waakye", price: "£7.50", desc: "Rice & beans cooked with millet leaves, served with shito", image_url: "" },
      { name: "Fried Rice", price: "£8.00", desc: "Stir-fried rice with vegetables & your choice of protein", image_url: "" },
    ],
  },
  {
    name: "Swallow (Fufu & Dough)",
    items: [
      { name: "Fufu & Light Soup", price: "£10.00", desc: "Cassava & plantain dough with goat light soup", image_url: "" },
      { name: "Banku & Tilapia", price: "£11.00", desc: "Fermented corn & cassava dough with grilled tilapia", image_url: "" },
      { name: "Ampesi & Kontomire", price: "£9.00", desc: "Boiled yam/plantain with palava sauce", image_url: "" },
    ],
  },
  {
    name: "Small Chops (Starters)",
    items: [
      { name: "Kelewele", price: "£5.00", desc: "Spiced fried plantains with ginger & chilli", image_url: "" },
      { name: "Spring Rolls", price: "£4.50", desc: "Crispy vegetable spring rolls", image_url: "" },
      { name: "Chicken Wings", price: "£6.50", desc: "Grilled wings with shito dip", image_url: "" },
    ],
  },
  {
    name: "Protein & Sides",
    items: [
      { name: "Grilled Tilapia", price: "£9.00", desc: "Whole tilapia, seasoned & grilled", image_url: "" },
      { name: "Red Red", price: "£7.00", desc: "Beans in palm oil with fried plantain", image_url: "" },
      { name: "Shito (Hot Pepper Sauce)", price: "£2.50", desc: "Traditional Ghanaian black pepper sauce", image_url: "" },
    ],
  },
];

interface MenuDisplayItem {
  name: string;
  price: string;
  desc: string;
  image_url: string;
}

export default async function MenuPage() {
  const menuItems = await getMenuItems();

  const categories = menuItems.length > 0
    ? (() => {
        const grouped: Record<string, MenuDisplayItem[]> = {};
        for (const item of menuItems) {
          if (!grouped[item.category]) grouped[item.category] = [];
          grouped[item.category].push({
            name: item.name,
            price: `£${Number(item.price).toFixed(2)}`,
            desc: item.description || "",
            image_url: item.image_url || "",
          });
        }
        return Object.entries(grouped).map(([name, items]) => ({ name, items }));
      })()
    : fallbackCategories;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-charcoal mb-4">
          Our Menu
        </h1>
        <p className="text-charcoal/60 max-w-md mx-auto">
          Authentic Ghanaian dishes made fresh to order. Prices may vary.
        </p>
        <Link
          href="/order"
          className="mt-6 inline-flex items-center justify-center bg-terracotta hover:bg-terracotta-hover text-white px-8 py-3.5 rounded-full text-base font-semibold transition-all hover:shadow-lg hover:shadow-terracotta/30"
        >
          Order Now
        </Link>
      </div>

      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category.name}>
            <h2 className="font-display text-2xl font-bold text-forest mb-6 pb-3 border-b border-forest/10">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {category.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white border border-forest/5 hover:shadow-md transition-all group"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-gold/10 to-terracotta/10">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        🍽
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-charcoal group-hover:text-terracotta transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-terracotta font-semibold whitespace-nowrap shrink-0">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-sm text-charcoal/60 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-forest/5 border border-forest/10 text-center">
        <p className="text-sm text-charcoal/60">
          Menu is regularly updated. Follow us on Instagram for daily specials
          and new additions.
        </p>
      </div>
    </div>
  );
}
