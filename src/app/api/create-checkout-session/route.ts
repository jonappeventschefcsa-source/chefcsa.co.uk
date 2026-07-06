import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { allowed, remaining } = rateLimit(`checkout:${ip}`, 10, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429, headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  }

  try {
    const body = await req.json();
    const { items, customer } = body;

    if (!items || !items.length || !customer?.email) {
      return NextResponse.json(
        { error: "Missing items or customer email" },
        { status: 400 }
      );
    }

    // Look up all prices from the database — never trust client prices
    const names = items.map((i: { name: string }) => i.name);
    const { data: menuItems } = await supabase
      .from("menu_items")
      .select("name, price")
      .in("name", names)
      .eq("available", true);

    const priceMap = new Map((menuItems || []).map((m) => [m.name, m.price]));

    const lineItems = [];
    for (const item of items) {
      const serverPrice = priceMap.get(item.name);
      if (!serverPrice) {
        return NextResponse.json(
          { error: `Item "${item.name}" not found or unavailable` },
          { status: 400 }
        );
      }
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: { name: item.name },
          unit_amount: Math.round(serverPrice * 100),
        },
        quantity: item.quantity,
      });
    }

    const stripe = getStripe();

    // Idempotency key to prevent duplicate charges on retry
    const idempotencyKey = `checkout_${customer.email}_${Date.now()}`;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        customer_email: customer.email,
        billing_address_collection: "required",
        shipping_address_collection: {
          allowed_countries: ["GB"],
        },
        metadata: {
          customer_name: customer.name || "",
          customer_phone: customer.phone || "",
          delivery_date: customer.date || "",
          delivery_time: customer.time || "",
          notes: customer.notes || "",
        },
        line_items: lineItems,
        success_url: `${req.headers.get("origin")}/order?success=true`,
        cancel_url: `${req.headers.get("origin")}/order?cancelled=true`,
      },
      { idempotencyKey }
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
