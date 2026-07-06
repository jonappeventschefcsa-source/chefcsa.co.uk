export const dynamic = "force-dynamic";

import HeroSlider from "@/components/HeroSlider";
import FeaturedDishes from "@/components/FeaturedDishes";
import Welcome from "@/components/Welcome";
import Authenticity from "@/components/Authenticity";
import Specials from "@/components/Specials";
import Experience from "@/components/Experience";
import OrderDirectCTA from "@/components/OrderDirectCTA";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import ServiceAreaSection from "@/components/ServiceAreaSection";
import {
  getSiteContent,
  getReviews,
  getWeeklySpecials,
} from "@/lib/site-content";
import { supabase } from "@/lib/supabase";

async function getHeroImages(): Promise<string[]> {
  try {
    const { data } = await supabase
      .from("hero_images")
      .select("image_url")
      .eq("active", true)
      .order("sort_order");
    return data?.map((r) => r.image_url).filter(Boolean) || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [content, reviews, specials, heroImages] = await Promise.all([
    getSiteContent().catch(() => ({}) as Record<string, Record<string, string>>),
    getReviews().catch(() => []),
    getWeeklySpecials().catch(() => []),
    getHeroImages(),
  ]);

  const hero = content.hero || {};
  const welcome = content.welcome || {};
  const authenticity = content.authenticity || {};
  const experience = content.experience || {};
  const orderCta = content.order_cta || {};

  return (
    <>
      <HeroSlider
        headline={hero.headline}
        subheadline={hero.subheadline}
        ctaPrimary={hero.cta_primary}
        ctaSecondary={hero.cta_secondary}
        images={heroImages}
      />
      <FeaturedDishes />
      <Welcome title={welcome.title} body={welcome.body} />
      <Authenticity
        title={authenticity.title}
        body1={authenticity.body_1}
        body2={authenticity.body_2}
        image_url={authenticity.image_url}
      />
      <Specials specials={specials.length > 0 ? specials : undefined} />
      <Experience title={experience.title} body={experience.body} image_url={experience.image_url} />
      <OrderDirectCTA
        title={orderCta.title}
        body={orderCta.body}
        buttonText={orderCta.button_text}
      />
      <Reviews reviews={reviews.length > 0 ? reviews : undefined} />
      <Services />
      <ServiceAreaSection />
    </>
  );
}
