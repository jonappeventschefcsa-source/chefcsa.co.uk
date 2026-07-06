"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase-client";

interface ContentEntry {
  id: string;
  section: string;
  key: string;
  value: string;
}

interface ReviewEntry {
  id: string;
  name: string;
  text: string;
  rating: number;
  active: boolean;
}

interface SpecialEntry {
  id: string;
  title: string;
  description: string;
  days_available: string;
  image_url: string;
  active: boolean;
}

interface HeroImageEntry {
  id: string;
  image_url: string;
  sort_order: number;
  active: boolean;
}

const sections = [
  { id: "hero", label: "Hero" },
  { id: "welcome", label: "Welcome" },
  { id: "authenticity", label: "Authenticity" },
  { id: "experience", label: "Experience" },
  { id: "order_cta", label: "Order CTA" },
  { id: "contact", label: "Contact" },
  { id: "global", label: "Global" },
];

export default function ContentEditorPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [content, setContent] = useState<ContentEntry[]>([]);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [specials, setSpecials] = useState<SpecialEntry[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [newReview, setNewReview] = useState({ name: "", text: "", rating: 5 });
  const [uploadError, setUploadError] = useState("");
  const [newSpecial, setNewSpecial] = useState({
    title: "",
    description: "",
    days_available: "",
    image_url: "",
  });
  const supabase = createSupabaseClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [contentRes, reviewsRes, specialsRes, heroRes] = await Promise.all([
      supabase.from("site_content").select("*"),
      supabase.from("reviews").select("*").order("sort_order"),
      supabase.from("weekly_specials").select("*").order("sort_order"),
      supabase.from("hero_images").select("*").order("sort_order"),
    ]);
    if (contentRes.data) setContent(contentRes.data as ContentEntry[]);
    if (reviewsRes.data) setReviews(reviewsRes.data as ReviewEntry[]);
    if (specialsRes.data) setSpecials(specialsRes.data as SpecialEntry[]);
    if (heroRes.data) setHeroImages(heroRes.data as HeroImageEntry[]);
    setLoading(false);
  };

  const currentSectionContent = content.filter((c) => c.section === activeTab);

  const saveContent = async () => {
    setSaving(true);
    for (const [id, value] of Object.entries(edited)) {
      await supabase.from("site_content").update({ value }).eq("id", id);
    }
    setEdited({});
    setSaving(false);
    loadData();
  };

  const addReview = async () => {
    if (!newReview.name || !newReview.text) return;
    await supabase.from("reviews").insert(newReview);
    setNewReview({ name: "", text: "", rating: 5 });
    loadData();
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    loadData();
  };

  const addSpecial = async () => {
    if (!newSpecial.title) return;
    await supabase.from("weekly_specials").insert(newSpecial);
    setNewSpecial({ title: "", description: "", days_available: "", image_url: "" });
    loadData();
  };

  const deleteSpecial = async (id: string) => {
    if (!confirm("Delete this special?")) return;
    await supabase.from("weekly_specials").delete().eq("id", id);
    loadData();
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
        Site Content
      </h1>

      {/* Section tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === s.id
                ? "bg-terracotta text-white"
                : "bg-white text-charcoal/60 border border-forest/10"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Logo upload (Global tab) */}
      {activeTab === "global" && (
        <div className="bg-white rounded-2xl border border-forest/5 p-5 mb-8">
          <h2 className="font-display text-lg font-bold text-charcoal mb-4">
            Site Logo
          </h2>
          <div className="flex items-center gap-4">
            {(() => {
              const logoEntry = content.find((c) => c.section === "global" && c.key === "logo_url");
              return (
                <>
                  {logoEntry?.value ? (
                    <div className="w-40 h-20 rounded-xl overflow-hidden bg-forest/5 border border-forest/10 shrink-0 flex items-center justify-center p-2">
                      <img src={logoEntry.value} alt="Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-40 h-20 rounded-xl bg-forest/5 border-2 border-dashed border-forest/10 flex items-center justify-center shrink-0">
                      <span className="text-2xl opacity-40">🖼</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = async () => {
                          const file = input.files?.[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append("file", file);
                          fd.append("folder", "logo");
                          const res = await fetch("/api/upload", { method: "POST", body: fd });
                          const data = await res.json();
                          if (data.error) {
                            setUploadError(data.error);
                          } else if (data.url) {
                            if (logoEntry) {
                              await supabase.from("site_content").update({ value: data.url }).eq("id", logoEntry.id);
                            } else {
                              await supabase.from("site_content").insert({ section: "global", key: "logo_url", value: data.url });
                            }
                            loadData();
                          }
                        };
                        input.click();
                      }}
                      className="px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold transition-all"
                    >
                      {logoEntry?.value ? "Change Logo" : "Upload Logo"}
                    </button>
                    {logoEntry?.value && (
                      <button
                        onClick={async () => {
                          await supabase.from("site_content").update({ value: "" }).eq("id", logoEntry.id);
                          loadData();
                        }}
                        className="px-4 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-all"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Content editor */}
      <div className="bg-white rounded-2xl border border-forest/5 p-5 mb-8">
        <div className="space-y-4">
          {currentSectionContent.filter((e) => e.key !== "background_image").map((entry) => {
            const isImage = entry.key.includes("image") || entry.key.includes("photo");
            return (
              <div key={entry.id}>
                <label className="block text-xs font-medium text-charcoal mb-1 capitalize">
                  {entry.key.replace(/_/g, " ")}
                </label>
                {isImage ? (
                  <div className="flex items-center gap-3">
                    {entry.value && (
                      <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-forest/5">
                        <img
                          src={entry.value}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id={`img-${entry.id}`}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadError("");
                          const fd = new FormData();
                          fd.append("file", file);
                          fd.append("folder", "hero");
                          const res = await fetch("/api/upload", { method: "POST", body: fd });
                          const data = await res.json();
                          if (data.error) {
                            setUploadError(data.error);
                          } else if (data.url) {
                            setEdited({ ...edited, [entry.id]: data.url });
                          }
                          e.target.value = "";
                        }}
                      />
                      <button
                        onClick={() => document.getElementById(`img-${entry.id}`)?.click()}
                        className="px-3 py-2 rounded-xl border border-forest/10 bg-cream text-xs font-medium text-charcoal/60 hover:border-forest/30 transition-colors"
                      >
                        {entry.value ? "Change Image" : "Upload Image"}
                      </button>
                      {entry.value && (
                        <button
                          onClick={() => setEdited({ ...edited, [entry.id]: "" })}
                          className="ml-2 text-xs text-red-500 font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <textarea
                    rows={entry.key === "body" || entry.key === "body_1" || entry.key === "body_2" ? 3 : 2}
                    defaultValue={entry.value}
                    onChange={(e) =>
                      setEdited({ ...edited, [entry.id]: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-forest/10 bg-cream text-sm resize-none"
                  />
                )}
              </div>
            );
          })}
        </div>
        {uploadError && (
          <div className="mt-4 bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">
            {uploadError}
          </div>
        )}
        {Object.keys(edited).length > 0 && (
          <button
            onClick={saveContent}
            disabled={saving}
            className="mt-4 bg-terracotta hover:bg-terracotta-hover disabled:bg-forest/30 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>

      {/* Section image (Authenticity / Experience) */}
      {(activeTab === "authenticity" || activeTab === "experience") && (
        <div className="bg-white rounded-2xl border border-forest/5 p-5 mb-8">
          <h2 className="font-display text-lg font-bold text-charcoal mb-4">
            Section Image
          </h2>
          <div className="flex items-center gap-4">
            {(() => {
              const imgEntry = content.find((c) => c.section === activeTab && c.key === "image_url");
              return (
                <>
                  {imgEntry?.value ? (
                    <div className="w-40 aspect-[4/3] rounded-xl overflow-hidden bg-forest/5 border border-forest/10 shrink-0">
                      <img src={imgEntry.value} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-40 aspect-[4/3] rounded-xl bg-forest/5 border-2 border-dashed border-forest/10 flex items-center justify-center shrink-0">
                      <span className="text-3xl opacity-40">🖼</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = async () => {
                          const file = input.files?.[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append("file", file);
                          fd.append("folder", "sections");
                          const res = await fetch("/api/upload", { method: "POST", body: fd });
                          const data = await res.json();
                          if (data.error) {
                            setUploadError(data.error);
                          } else if (data.url) {
                            if (imgEntry) {
                              await supabase.from("site_content").update({ value: data.url }).eq("id", imgEntry.id);
                            } else {
                              await supabase.from("site_content").insert({ section: activeTab, key: "image_url", value: data.url });
                            }
                            loadData();
                          }
                        };
                        input.click();
                      }}
                      className="px-4 py-2 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold transition-all"
                    >
                      {imgEntry?.value ? "Change Image" : "Upload Image"}
                    </button>
                    {imgEntry?.value && (
                      <button
                        onClick={async () => {
                          await supabase.from("site_content").update({ value: "" }).eq("id", imgEntry.id);
                          loadData();
                        }}
                        className="px-4 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-all"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Hero Images */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-2xl border border-forest/5 p-5 mb-8">
          <h2 className="font-display text-lg font-bold text-charcoal mb-4">
            Hero Background Images
          </h2>
          <p className="text-xs text-charcoal/50 mb-4">
            Upload multiple images for the rotating hero slider. The slider auto-cycles every 6 seconds.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {heroImages.map((img) => (
              <div key={img.id} className="relative group aspect-[4/3] rounded-xl overflow-hidden bg-forest/5 border border-forest/10">
                {img.image_url ? (
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal/30 text-sm">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={async () => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = async () => {
                        const file = input.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append("file", file);
                        fd.append("folder", "hero");
                        const res = await fetch("/api/upload", { method: "POST", body: fd });
                        const data = await res.json();
                        if (data.url) {
                          await supabase.from("hero_images").update({ image_url: data.url }).eq("id", img.id);
                          loadData();
                        } else if (data.error) {
                          setUploadError(data.error);
                        }
                      };
                      input.click();
                    }}
                    className="bg-white/90 text-charcoal text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
                  >
                    {img.image_url ? "Change" : "Upload"}
                  </button>
                  <button
                    onClick={async () => {
                      await supabase.from("hero_images").delete().eq("id", img.id);
                      loadData();
                    }}
                    className="bg-red-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.multiple = true;
              input.onchange = async () => {
                const files = input.files;
                if (!files || files.length === 0) return;
                for (const file of Array.from(files)) {
                  const fd = new FormData();
                  fd.append("file", file);
                  fd.append("folder", "hero");
                  const res = await fetch("/api/upload", { method: "POST", body: fd });
                  const data = await res.json();
                  if (data.url) {
                    await supabase
                      .from("hero_images")
                      .insert({ image_url: data.url, sort_order: heroImages.length });
                  } else if (data.error) {
                    setUploadError(data.error);
                  }
                }
                loadData();
              };
              input.click();
            }}
            className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload Images
          </button>
        </div>
      )}

      {/* Reviews */}
      <div className="bg-white rounded-2xl border border-forest/5 p-5 mb-8">
        <h2 className="font-display text-lg font-bold text-charcoal mb-4">
          Reviews / Testimonials
        </h2>
        <div className="space-y-3 mb-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="flex items-start justify-between p-3 rounded-xl bg-cream border border-forest/5"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-charcoal">{r.name}</span>
                  <span className="text-xs text-gold">{'★'.repeat(r.rating)}</span>
                </div>
                <p className="text-xs text-charcoal/60 mt-1">{r.text}</p>
              </div>
              <button
                onClick={() => deleteReview(r.id)}
                className="text-xs text-red-500 font-semibold shrink-0 ml-3"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Name"
            value={newReview.name}
            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            className="px-3 py-2 rounded-xl border border-forest/10 bg-cream text-sm"
          />
          <input
            type="text"
            placeholder="Review text"
            value={newReview.text}
            onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
            className="px-3 py-2 rounded-xl border border-forest/10 bg-cream text-sm sm:col-span-1"
          />
          <div className="flex gap-2">
            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: parseInt(e.target.value) })
              }
              className="px-3 py-2 rounded-xl border border-forest/10 bg-cream text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} stars</option>
              ))}
            </select>
            <button
              onClick={addReview}
              className="bg-terracotta hover:bg-terracotta-hover text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Specials */}
      <div className="bg-white rounded-2xl border border-forest/5 p-5">
        <h2 className="font-display text-lg font-bold text-charcoal mb-4">
          Weekly Specials
        </h2>
        <div className="space-y-3 mb-4">
          {specials.map((s) => (
            <div
              key={s.id}
              className="flex items-start justify-between p-3 rounded-xl bg-cream border border-forest/5"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {s.image_url ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-forest/5">
                    <img src={s.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = async () => {
                        const file = input.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append("file", file);
                        fd.append("folder", "specials");
                        const res = await fetch("/api/upload", { method: "POST", body: fd });
                        const data = await res.json();
                        if (data.url) {
                          await supabase.from("weekly_specials").update({ image_url: data.url }).eq("id", s.id);
                          loadData();
                        } else if (data.error) {
                          setUploadError(data.error);
                        }
                      };
                      input.click();
                    }}
                    className="w-14 h-14 rounded-xl border-2 border-dashed border-forest/10 flex items-center justify-center text-charcoal/30 hover:text-terracotta hover:border-terracotta/30 transition-all shrink-0"
                    title="Upload image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-charcoal">{s.title}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${s.active ? "bg-forest/10 text-forest" : "bg-red-100 text-red-600"}`}>
                      {s.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/60 mt-1">{s.description}</p>
                  {s.days_available && (
                    <p className="text-xs text-terracotta mt-0.5">{s.days_available}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteSpecial(s.id)}
                className="text-xs text-red-500 font-semibold shrink-0 ml-3"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Title"
            value={newSpecial.title}
            onChange={(e) => setNewSpecial({ ...newSpecial, title: e.target.value })}
            className="px-3 py-2 rounded-xl border border-forest/10 bg-cream text-sm"
          />
          <input
            type="text"
            placeholder="Description"
            value={newSpecial.description}
            onChange={(e) =>
              setNewSpecial({ ...newSpecial, description: e.target.value })
            }
            className="px-3 py-2 rounded-xl border border-forest/10 bg-cream text-sm"
          />
          <input
            type="text"
            placeholder="Days (e.g. Friday)"
            value={newSpecial.days_available}
            onChange={(e) =>
              setNewSpecial({ ...newSpecial, days_available: e.target.value })
            }
            className="px-3 py-2 rounded-xl border border-forest/10 bg-cream text-sm"
          />
          <button
            onClick={addSpecial}
            className="bg-terracotta hover:bg-terracotta-hover text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          >
            Add Special
          </button>
        </div>
      </div>
    </div>
  );
}
