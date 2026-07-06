"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase-client";
import Link from "next/link";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  delivery_date: string;
  delivery_time: string;
  seen: boolean;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-forest/10 text-forest",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseClient();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
    setLoading(false);
  };

  const markSeen = async (id: string) => {
    await supabase.from("orders").update({ seen: true }).eq("id", id);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, seen: true } : o))
    );
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const filtered =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-charcoal mb-6">
        Orders
      </h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"].map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                filter === f
                  ? "bg-terracotta text-white"
                  : "bg-white text-charcoal/60 border border-forest/10 hover:border-forest/30"
              }`}
            >
              {f.replace(/_/g, " ")}
            </button>
          )
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-forest/5 p-8 text-center text-sm text-charcoal/40">
          No orders found.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-forest/5 overflow-hidden">
          <div className="divide-y divide-forest/5">
            {filtered.map((order) => (
              <div
                key={order.id}
                onClick={() => markSeen(order.id)}
                className="p-4 sm:p-5 hover:bg-forest/[0.02] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {!order.seen && (
                      <span className="w-2 h-2 rounded-full bg-terracotta shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-charcoal truncate">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-charcoal/40 truncate">
                        {order.delivery_date} at {order.delivery_time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-charcoal">
                      £{Number(order.total).toFixed(2)}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`text-xs font-medium rounded-lg px-2 py-1 border-0 cursor-pointer ${statusColors[order.status] || ""}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-terracotta hover:text-terracotta-hover font-semibold"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
