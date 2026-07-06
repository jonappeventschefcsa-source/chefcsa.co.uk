"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase-client";

interface Dish {
  name: string;
  description: string;
  image_url: string;
  price: number;
}

const fallbackDishes: Dish[] = [
  { name: "Jollof Rice", description: "Classic one-pot rice dish", image_url: "", price: 8.5 },
  { name: "Waakye", description: "Rice & beans with shito", image_url: "", price: 7.5 },
  { name: "Banku & Tilapia", description: "Fermented corn dough with grilled fish", image_url: "", price: 11 },
  { name: "Kelewele", description: "Spiced fried plantains", image_url: "", price: 5 },
  { name: "Fufu & Light Soup", description: "Cassava & plantain dough with soup", image_url: "", price: 10 },
  { name: "Red Red", description: "Beans in palm oil with fried plantain", image_url: "", price: 7 },
];

export default function FeaturedDishes() {
  const [dishes, setDishes] = useState<Dish[]>(fallbackDishes);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase
      .from("menu_items")
      .select("name, description, image_url, price")
      .eq("available", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) setDishes(data as Dish[]);
      });
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const el = scrollRef.current;
    if (!el || isPaused) return;
    const interval = setInterval(() => {
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 5) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: el.clientWidth * 0.5, behavior: "smooth" });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-charcoal">
            Featured Dishes
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => scroll("left")}
              className={`hidden sm:flex w-9 h-9 rounded-full items-center justify-center border transition-all ${
                canScrollLeft
                  ? "border-forest/20 text-charcoal hover:bg-forest hover:text-cream"
                  : "border-forest/5 text-charcoal/20"
              }`}
              disabled={!canScrollLeft}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className={`hidden sm:flex w-9 h-9 rounded-full items-center justify-center border transition-all ${
                canScrollRight
                  ? "border-forest/20 text-charcoal hover:bg-forest hover:text-cream"
                  : "border-forest/5 text-charcoal/20"
              }`}
              disabled={!canScrollRight}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <Link
              href="/menu"
              className="text-terracotta hover:text-terracotta-hover font-semibold text-sm transition-colors hidden sm:inline"
            >
              View All &rarr;
            </Link>
          </div>
        </div>

        {/* Horizontal scroll carousel */}
        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {dishes.map((dish) => (
            <Link
              key={dish.name}
              href="/menu"
              className="group snap-start shrink-0 w-[160px] sm:w-[185px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-forest/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-square bg-gradient-to-br from-gold/10 via-cream to-terracotta/5 overflow-hidden relative">
                {dish.image_url ? (
                  <img
                    src={dish.image_url}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
                    <span className="opacity-80">🍽</span>
                  </div>
                )}
                {/* Price badge */}
                <div className="absolute top-2 right-2 bg-terracotta text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  £{dish.price?.toFixed(2)}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-charcoal text-sm sm:text-base group-hover:text-terracotta transition-colors truncate">
                  {dish.name}
                </h3>
                <p className="text-xs text-charcoal/50 mt-0.5 line-clamp-2">
                  {dish.description || dish.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 text-center sm:hidden">
          <Link
            href="/menu"
            className="text-terracotta hover:text-terracotta-hover font-semibold text-sm transition-colors"
          >
            View Full Menu &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
