"use client";

import { useState } from "react";

const menuItems = [
  { id: "1", name: "Jollof Rice", price: 8.5, category: "Rice & Classics" },
  { id: "2", name: "Waakye", price: 7.5, category: "Rice & Classics" },
  { id: "3", name: "Fried Rice", price: 8.0, category: "Rice & Classics" },
  { id: "4", name: "Fufu & Light Soup", price: 10.0, category: "Swallow" },
  { id: "5", name: "Banku & Tilapia", price: 11.0, category: "Swallow" },
  { id: "6", name: "Ampesi & Kontomire", price: 9.0, category: "Swallow" },
  { id: "7", name: "Kelewele", price: 5.0, category: "Starters" },
  { id: "8", name: "Spring Rolls", price: 4.5, category: "Starters" },
  { id: "9", name: "Chicken Wings", price: 6.5, category: "Starters" },
  { id: "10", name: "Grilled Tilapia", price: 9.0, category: "Protein" },
  { id: "11", name: "Red Red", price: 7.0, category: "Protein" },
  { id: "12", name: "Shito (Hot Pepper Sauce)", price: 2.5, category: "Sides" },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function OrderPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"menu" | "details" | "confirm">("menu");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    date: "",
    time: "",
    notes: "",
  });

  const addToCart = (item: (typeof menuItems)[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = total >= 25 ? 0 : total >= 15 ? 5 : 2.5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirm");
  };

  if (step === "details") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <button
          onClick={() => setStep("menu")}
          className="text-terracotta hover:text-terracotta-hover text-sm font-semibold mb-6 transition-colors inline-flex items-center gap-1"
        >
          &larr; Back to Menu
        </button>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mb-8">
          Delivery Details
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-forest/10 bg-white text-charcoal text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-forest/10 bg-white text-charcoal text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Phone</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-forest/10 bg-white text-charcoal text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Delivery Address</label>
            <textarea
              required
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-forest/10 bg-white text-charcoal text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Delivery Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-forest/10 bg-white text-charcoal text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Delivery Time</label>
              <input
                type="time"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-forest/10 bg-white text-charcoal text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Notes / Allergies</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-forest/10 bg-white text-charcoal text-sm resize-none"
              placeholder="Any dietary requirements or special instructions..."
            />
          </div>
          <div className="bg-cream rounded-xl p-4 border border-forest/5">
            <div className="flex justify-between text-sm mb-1">
              <span>Subtotal</span>
              <span>£{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? "FREE" : `£${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-forest/10">
              <span>Total</span>
              <span className="text-terracotta">£{(total + deliveryFee).toFixed(2)}</span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-terracotta hover:bg-terracotta-hover text-white px-6 py-3.5 rounded-xl text-base font-semibold transition-all hover:shadow-lg"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mb-4">
          Order Confirmed!
        </h1>
        <p className="text-charcoal/60 max-w-md mx-auto mb-8">
          Thank you for your order, {form.name}! We have sent a confirmation
          to {form.email}. We will be in touch shortly to confirm your
          delivery time.
        </p>
        <div className="bg-cream rounded-2xl p-6 border border-forest/5 text-left max-w-sm mx-auto mb-8">
          <h3 className="font-semibold text-charcoal mb-2">Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-charcoal/70 py-1">
              <span>{item.quantity}x {item.name}</span>
              <span>£{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-forest/10 mt-2 pt-2 flex justify-between font-bold text-sm">
            <span>Total</span>
            <span className="text-terracotta">£{(total + deliveryFee).toFixed(2)}</span>
          </div>
        </div>
        <p className="text-xs text-charcoal/40">
          For now, this is a demo confirmation. Stripe payment integration will
          process real payments once you add your API keys.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mb-8">
        Place Your Order
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {["Rice & Classics", "Swallow", "Starters", "Protein", "Sides"].map(
              (cat) => (
                <div key={cat}>
                  <h2 className="font-display text-xl font-bold text-forest mb-3">
                    {cat}
                  </h2>
                  <div className="space-y-2">
                    {menuItems
                      .filter((item) => item.category === cat)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white border border-forest/5"
                        >
                          <div>
                            <span className="font-medium text-sm text-charcoal">
                              {item.name}
                            </span>
                            <span className="text-terracotta text-sm font-semibold ml-2">
                              £{item.price.toFixed(2)}
                            </span>
                          </div>
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-forest hover:bg-forest/90 text-cream text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-forest/5 p-6">
            <h2 className="font-display text-lg font-bold text-charcoal mb-4">
              Your Order
            </h2>
            {cart.length === 0 ? (
              <p className="text-sm text-charcoal/50">Your cart is empty</p>
            ) : (
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal">
                        {item.name}
                      </p>
                      <p className="text-xs text-charcoal/50">
                        £{item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-6 h-6 rounded-full bg-forest/10 text-charcoal/60 flex items-center justify-center text-xs hover:bg-forest/20 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            category: "",
                          })
                        }
                        className="w-6 h-6 rounded-full bg-forest/10 text-charcoal/60 flex items-center justify-center text-xs hover:bg-forest/20 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-charcoal ml-3 w-14 text-right">
                      £{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-forest/10 pt-3 space-y-1">
                  <div className="flex justify-between text-sm text-charcoal/60">
                    <span>Subtotal</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-charcoal/60">
                    <span>Delivery</span>
                    <span>
                      {deliveryFee === 0 ? "FREE" : `£${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-forest/10">
                    <span>Total</span>
                    <span className="text-terracotta">
                      £{(total + deliveryFee).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => setStep("details")}
              disabled={cart.length === 0}
              className="w-full bg-terracotta hover:bg-terracotta-hover disabled:bg-forest/20 disabled:text-charcoal/30 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
