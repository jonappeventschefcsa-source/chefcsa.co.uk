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

  const buildWhatsAppMessage = () => {
    const itemsList = cart
      .map((item) => `- ${item.quantity}x ${item.name} (£${(item.price * item.quantity).toFixed(2)})`)
      .join("\n");

    const text =
      `*New Order from Chef CSA*\n\n` +
      `*Customer Details*\n` +
      `Name: ${form.name}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone}\n` +
      `Address: ${form.address}\n` +
      `Delivery: ${form.date} at ${form.time}\n\n` +
      `*Order Items*\n${itemsList}\n\n` +
      `${form.notes ? `*Notes:* ${form.notes}\n\n` : ""}` +
      `*Subtotal:* £${total.toFixed(2)}\n` +
      `*Delivery Fee:* ${deliveryFee === 0 ? "FREE" : "£" + deliveryFee.toFixed(2)}\n` +
      `*Total:* £${(total + deliveryFee).toFixed(2)}`;

    return encodeURIComponent(text);
  };

  const handleWhatsAppOrder = () => {
    const message = buildWhatsAppMessage();
    window.open(`https://wa.me/447917027416?text=${message}`, "_blank");
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
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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
            type="button"
            onClick={handleWhatsAppOrder}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 rounded-xl text-base font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Send Order via WhatsApp
          </button>
        </form>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mb-4">
          Order Sent!
        </h1>
        <p className="text-charcoal/60 max-w-md mx-auto mb-8">
          Thank you, {form.name}! Your order has been sent to us via WhatsApp.
          We will confirm your delivery time shortly.
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
        <button
          onClick={handleWhatsAppOrder}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Open WhatsApp Again
        </button>
        <p className="text-xs text-charcoal/40 mt-4">
          Didn&apos;t see WhatsApp open? Make sure you have WhatsApp installed on your device.
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
