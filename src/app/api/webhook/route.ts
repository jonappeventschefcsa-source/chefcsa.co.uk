import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const { customer_name, customer_phone, delivery_date, delivery_time, notes } =
      session.metadata || {};

    const addressParts = [
      (session as any).shipping_details?.address?.line1,
      (session as any).shipping_details?.address?.city,
      (session as any).shipping_details?.address?.postal_code,
    ].filter(Boolean);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("orders").insert({
      customer_name: customer_name || "",
      customer_email: session.customer_email || "",
      customer_phone: customer_phone || "",
      delivery_address: addressParts.join(", "),
      delivery_date: delivery_date || "",
      delivery_time: delivery_time || "",
      items: [],
      subtotal: (session.amount_subtotal || 0) / 100,
      delivery_fee: 0,
      total: (session.amount_total || 0) / 100,
      status: "pending",
      notes: notes || "",
      stripe_payment_intent: session.payment_intent as string,
    });

    if (error) {
      console.error("Supabase insert error:", error);
    }
  }

  return NextResponse.json({ received: true });
}
