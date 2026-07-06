"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase-client";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_date: string;
  delivery_time: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  notes: string;
  created_at: string;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();
    if (data) setOrder(data as Order);
    setLoading(false);
  };

  const updateStatus = async (status: string) => {
    await supabase.from("orders").update({ status, seen: true }).eq("id", id);
    if (order) setOrder({ ...order, status });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-charcoal/60">Order not found.</p>
        <button
          onClick={() => router.push("/dashboard/orders")}
          className="text-terracotta text-sm font-semibold mt-2"
        >
          &larr; Back to orders
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push("/dashboard/orders")}
        className="text-terracotta hover:text-terracotta-hover text-sm font-semibold mb-4 inline-flex items-center gap-1"
      >
        &larr; Back to Orders
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-forest/5 p-6">
            <h2 className="font-display text-xl font-bold text-charcoal mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-forest/5 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      {item.name}
                    </p>
                    <p className="text-xs text-charcoal/50">
                      Qty: {item.quantity} &times; £{item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-charcoal">
                    £{(item.quantity * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-2 space-y-1">
                <div className="flex justify-between text-sm text-charcoal/60">
                  <span>Subtotal</span>
                  <span>£{Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-charcoal/60">
                  <span>Delivery</span>
                  <span>£{Number(order.delivery_fee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-forest/10">
                  <span>Total</span>
                  <span className="text-terracotta">
                    £{Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white rounded-2xl border border-forest/5 p-6">
              <h3 className="font-semibold text-charcoal text-sm mb-2">
                Notes / Allergies
              </h3>
              <p className="text-sm text-charcoal/70">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-forest/5 p-6">
            <h3 className="font-semibold text-charcoal text-sm mb-4">
              Customer Details
            </h3>
            <div className="space-y-2 text-sm text-charcoal/70">
              <p>
                <span className="font-medium text-charcoal">Name:</span>{" "}
                {order.customer_name}
              </p>
              <p>
                <span className="font-medium text-charcoal">Email:</span>{" "}
                {order.customer_email}
              </p>
              {order.customer_phone && (
                <p>
                  <span className="font-medium text-charcoal">Phone:</span>{" "}
                  {order.customer_phone}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-forest/5 p-6">
            <h3 className="font-semibold text-charcoal text-sm mb-4">
              Delivery
            </h3>
            <div className="space-y-2 text-sm text-charcoal/70">
              <p>{order.delivery_address}</p>
              <p>
                {order.delivery_date} at {order.delivery_time}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-forest/5 p-6">
            <h3 className="font-semibold text-charcoal text-sm mb-4">
              Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                      order.status === s
                        ? "bg-terracotta text-white"
                        : "bg-forest/5 text-charcoal/60 hover:bg-forest/10"
                    }`}
                  >
                    {s.replace(/_/g, " ")}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
