import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { allowed, remaining } = rateLimit(`upload:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429, headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "menu";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and AVIF images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be under 5MB" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { supabase } = await import("@/lib/supabase");

    const { data, error } = await supabase.storage
      .from("chefcsa")
      .upload(fileName, file, {
        cacheControl: "31536000",
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      const message =
        error.message === "Bucket not found"
          ? "Storage bucket 'chefcsa' not found. Create it in your Supabase dashboard under Storage."
          : error.message;
      return NextResponse.json({ error: message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("chefcsa").getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
