"use client";

import { useEffect, useState, useRef } from "react";
import { createSupabaseClient } from "@/lib/supabase-client";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  dietary_labels: string[];
  available: boolean;
  sort_order: number;
}

const categories = ["Rice & Classics", "Swallow", "Starters", "Protein", "Sides"];

const emptyItem = {
  name: "",
  description: "",
  price: 0,
  category: "Rice & Classics",
  image_url: "",
  dietary_labels: [] as string[],
  available: true,
  sort_order: 0,
};

export default function MenuEditorPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyItem);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createSupabaseClient();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .order("sort_order");
    if (data) setItems(data as MenuItem[]);
    setLoading(false);
  };

  const uploadImage = async (file: File, itemId?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "menu");

    setUploadError("");
    setUploading(itemId || "new");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) {
        setUploadError(data.error);
        setUploading(null);
        return;
      }
      if (data.url) {
        if (itemId) {
          await supabase.from("menu_items").update({ image_url: data.url }).eq("id", itemId);
          loadItems();
        } else {
          setForm({ ...form, image_url: data.url });
        }
      }
    } catch (err) {
      setUploadError("Network error — check console");
      console.error("Upload failed:", err);
    }
    setUploading(null);
  };

  const saveItem = async () => {
    setSaving(true);
    if (editing) {
      await supabase.from("menu_items").update(form).eq("id", editing);
    } else {
      await supabase.from("menu_items").insert(form);
    }
    setEditing(null);
    setForm(emptyItem);
    setSaving(false);
    loadItems();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    await supabase.from("menu_items").delete().eq("id", id);
    loadItems();
  };

  const toggleAvailable = async (item: MenuItem) => {
    await supabase
      .from("menu_items")
      .update({ available: !item.available })
      .eq("id", item.id);
    loadItems();
  };

  const editItem = (item: MenuItem) => {
    setEditing(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.image_url || "",
      dietary_labels: item.dietary_labels || [],
      available: item.available,
      sort_order: item.sort_order,
    });
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
        Menu Editor
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {categories.map((cat) => {
            const catItems = items.filter((i) => i.category === cat);
            return (
              <div key={cat} className="bg-white rounded-2xl border border-forest/5 p-5">
                <h2 className="font-display text-lg font-bold text-forest mb-3">
                  {cat}
                </h2>
                {catItems.length === 0 ? (
                  <p className="text-xs text-charcoal/40">No items yet</p>
                ) : (
                  <div className="space-y-2">
                    {catItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-cream border border-forest/5"
                      >
                        <div className="w-12 h-12 rounded-xl bg-forest/10 shrink-0 overflow-hidden">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">
                              🍽
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-semibold ${
                                item.available ? "text-charcoal" : "text-charcoal/40 line-through"
                              }`}
                            >
                              {item.name}
                            </span>
                            <span className="text-xs text-charcoal/40">
                              £{item.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-charcoal/50 truncate">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => document.getElementById(`file-${item.id}`)?.click()}
                            className="text-xs text-forest font-semibold"
                          >
                            {uploading === item.id ? "..." : "Img"}
                          </button>
                          <input
                            id={`file-${item.id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) uploadImage(f, item.id);
                              e.target.value = "";
                            }}
                          />
                          <button
                            onClick={() => toggleAvailable(item)}
                            className={`text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${
                              item.available
                                ? "bg-forest/10 text-forest"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {item.available ? "Live" : "Hidden"}
                          </button>
                          <button
                            onClick={() => editItem(item)}
                            className="text-xs text-terracotta font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-xs text-red-500 font-semibold"
                          >
                            Del
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-forest/5 p-5 h-fit sticky top-24">
          <h2 className="font-display text-lg font-bold text-charcoal mb-4">
            {editing ? "Edit Item" : "Add Item"}
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-forest/10 bg-cream text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-forest/10 bg-cream text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Price (£)</label>
                <input
                  type="number"
                  step="0.5"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-forest/10 bg-cream text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-forest/10 bg-cream text-sm"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1">Image</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl border border-forest/10 bg-cream text-xs font-medium text-charcoal/60 hover:border-forest/30 transition-colors"
                >
                  {uploading === "new" ? "Uploading..." : "Choose Image"}
                </button>
                {form.image_url && (
                  <img src={form.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f);
                  e.target.value = "";
                }}
              />
            </div>
            {uploadError && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">
                {uploadError}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={saveItem}
                disabled={saving || !form.name}
                className="flex-1 bg-terracotta hover:bg-terracotta-hover disabled:bg-forest/30 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                {saving ? "Saving..." : editing ? "Update" : "Add Item"}
              </button>
              {editing && (
                <button
                  onClick={() => { setEditing(null); setForm(emptyItem); }}
                  className="px-4 py-2.5 rounded-xl border border-forest/10 text-sm font-semibold text-charcoal/60"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
