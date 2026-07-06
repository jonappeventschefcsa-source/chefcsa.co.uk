"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase-client";
import Link from "next/link";

interface Order {
  id: string;
  customer_name: string;
  total: number;
  status: string;
  delivery_date: string;
  delivery_time: string;
  seen: boolean;
  created_at: string;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    nextDelivery: "",
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const today = new Date().toISOString().split("T")[0];

    const { data: allOrders } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!allOrders) {
      setLoading(false);
      return;
    }

    const todayOrders = allOrders.filter(
      (o: Order) => o.delivery_date === today
    );
    const pendingOrders = allOrders.filter(
      (o: Order) => o.status === "pending"
    );
    const todayRevenue = todayOrders.reduce(
      (sum: number, o: Order) => sum + Number(o.total),
      0
    );

    const nextDelivery = todayOrders
      .sort((a: Order, b: Order) => a.delivery_time.localeCompare(b.delivery_time))
      .slice(0, 1)
      .map((o: Order) => `${o.delivery_time} — ${o.customer_name}`)
      [0] || "No orders today";

    setStats({
      todayOrders: todayOrders.length,
      todayRevenue,
      pendingOrders: pendingOrders.length,
      nextDelivery,
    });
    setRecentOrders(allOrders.slice(0, 10));
    setLoading(false);
  };

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
        Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-forest/5">
          <p className="text-xs text-charcoal/50 font-medium uppercase tracking-wider">
            Orders Today
          </p>
          <p className="font-display text-3xl font-bold text-forest mt-1">
            {stats.todayOrders}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-forest/5">
          <p className="text-xs text-charcoal/50 font-medium uppercase tracking-wider">
            Revenue Today
          </p>
          <p className="font-display text-3xl font-bold text-terracotta mt-1">
            £{stats.todayRevenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-forest/5">
          <p className="text-xs text-charcoal/50 font-medium uppercase tracking-wider">
            Pending Orders
          </p>
          <p className="font-display text-3xl font-bold text-gold mt-1">
            {stats.pendingOrders}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-forest/5">
          <p className="text-xs text-charcoal/50 font-medium uppercase tracking-wider">
            Next Delivery
          </p>
          <p className="text-sm font-semibold text-charcoal mt-1 truncate">
            {stats.nextDelivery}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-forest/5">
        <div className="flex items-center justify-between px-5 py-4 border-b border-forest/5">
          <h2 className="font-display text-lg font-bold text-charcoal">
            Recent Orders
          </h2>
          <Link
            href="/dashboard/orders"
            className="text-xs text-terracotta hover:text-terracotta-hover font-semibold"
          >
            View All
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-sm text-charcoal/40">
            No orders yet. Share your site and start taking orders!
          </div>
        ) : (
          <div className="divide-y divide-forest/5">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-forest/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {!order.seen && (
                    <span className="w-2 h-2 rounded-full bg-terracotta shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      {order.customer_name}
                    </p>
                    <p className="text-xs text-charcoal/40">
                      {order.delivery_date} at {order.delivery_time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-charcoal">
                    £{Number(order.total).toFixed(2)}
                  </p>
                  <span
                    className={`text-xs font-medium ${
                      order.status === "delivered"
                        ? "text-forest"
                        : order.status === "cancelled"
                        ? "text-red-500"
                        : "text-gold"
                    }`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
