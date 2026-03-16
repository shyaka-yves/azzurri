import { getSupabase } from "@/lib/supabaseServer";

export type HeroContent = {
  brand: string;
  tagline: string;
  headline: string;
  subheadline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  mediaType: "image" | "video";
  mediaSrc: string;
  overlay: string;
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  imageSrc: string;
  ctaLabel: string;
  ctaHref: string;
};

export type ExcellenceContent = {
  eyebrow: string;
  title: string;
  description: string;
  quote: string;
  stats: Array<{ value: string; label: string }>;
  imageSrc: string;
};

export type EventsContent = {
  eyebrow: string;
  title: string;
  description: string;
  items: Array<{
    date: string;
    title: string;
    description: string;
    imageSrc: string;
  }>;
};

export type GalleryContent = {
  eyebrow: string;
  title: string;
  items: Array<{ imageSrc: string; alt: string; zone?: string }>;
};

export type TestimonialsContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: Array<{ quote: string; name: string; rating: number }>;
};

export type BlogContent = {
  eyebrow: string;
  title: string;
  items: Array<{
    category: string;
    title: string;
    excerpt: string;
    imageSrc: string;
  }>;
};

export type ContactContent = {
  title: string;
  addressLines: string[];
  addressNote: string;
  hoursLines: string[];
  email: string;
  phone: string;
  mapEmbedSrc: string;
  directionsUrl: string;
};

export type MenuIntroContent = {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
};

export type MenuContent = {
  restaurantPdfUrl: string;
  clubPdfUrl: string;
};

export type DescriptionContent = {
  heading: string;
  paragraphs: string[];
};

export type SpecialtyContent = {
  title: string;
  content: string;
};

export type SpecialOffersContent = {
  title: string;
  content: string;
};

export type SocialLinksContent = {
  instagramRestaurant: string;
  instagramClub: string;
  tikTok: string;
  facebook?: string;
};

export type SiteContent = {
  hero: HeroContent;
  about: AboutContent;
  excellence: ExcellenceContent;
  descriptionSection: DescriptionContent;
  menuIntro: MenuIntroContent;
  events: EventsContent;
  gallery: GalleryContent;
  testimonials: TestimonialsContent;
  blog: BlogContent;
  contact: ContactContent;
  menu: MenuContent;
  specialty: SpecialtyContent;
  specialOffers: SpecialOffersContent;
  socialLinks: SocialLinksContent;
};

export type ReservationRecord = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  date?: string;
  guests?: number;
  notes?: string;
  status: "new" | "contacted" | "closed";
};

const CONTENT_ROW_ID = "default";

function getDefaultContent(): SiteContent {
  return {
    hero: {
      brand: "Azzurri",
      tagline: "Rooftop Restaurant, Club & Lounge - African and Asian Fusion",
      headline: "Azzurri",
      subheadline: "",
      primaryCtaLabel: "BOOK A TABLE",
      primaryCtaHref: "/book",
      secondaryCtaLabel: "VIEW MENU",
      secondaryCtaHref: "/menu",
      mediaType: "video",
      mediaSrc: "/uploads/bg.mp4",
      overlay: "rgba(0,0,0,0.4)",
    },
    about: {
      eyebrow: "ABOUT AZZURRI",
      title: "For a truly unique culinary experience",
      paragraphs: [
        "Azzurri is a vibrant dining destination in Kigali, offering a refined fusion of African and Asian flavors. Our menu is built around sharing plates, bold tastes, and creative cocktails — designed for discovery, connection, and enjoyment.",
        "Whether you’re joining us for a relaxed meal or an energetic evening, every visit is crafted to feel memorable.",
        "Experience the full Azzurri dining experience, and try our menu – meaning “I leave it up to you” in Kigali."
      ],
      imageSrc: "/uploads/FRIDAYYY.png",
      ctaLabel: "READ OUR STORY",
      ctaHref: "/about",
    },
    excellence: {
      eyebrow: "THE STANDARD",
      title: "Azzurri Excellence",
      description: "Our chefs compose each plate as a story of provenance and precision. Seasonal ingredients, curated wines, and bespoke pairings converge in a dining experience where every detail—from glassware to garnish—is intentionally designed.",
      quote: "Sharing the essence of Rwanda with a world-class twist.",
      stats: [
        { value: "20+", label: "Awards" },
        { value: "5k+", label: "Happy Guests" }
      ],
      imageSrc: "/uploads/cocktail-sq.png",
    },
    descriptionSection: {
      heading: "A TASTE OF KIGALI",
      paragraphs: [
        "Inspired by diverse culinary cultures, Azzurri blends African soul with Asian finesse. Our tapas-style menu allows guests to explore a variety of flavors in one sitting, while our cocktails complement the journey with creativity and balance.",
        "It’s not just about food — it’s about atmosphere, rhythm, and the joy of experiencing something different."
      ]
    },
    menuIntro: {
      eyebrow: "TASTING NOTES",
      title: "A fusion of African soul & Asian finesse",
      description: "Our menu changes with the markets and the moods of the city.",
      imageSrc: "/uploads/dish-1.png",
    },
    events: {
      eyebrow: "UPCOMING EVENTS",
      title: "Upcoming Party Events",
      description: "Experience only the best night life story at Azzurri",
      items: [
        {
          date: "Oct 27, 2024",
          title: "Neon Night Party",
          description: "Experience the ultimate neon glow party with live DJs and neon-themed cocktails.",
          imageSrc: "/uploads/party-1.png",
        },
        {
          date: "Oct 28, 2024",
          title: "Beats Sunset Vibe",
          description: "Relaxing sunset vibes with smooth beats and refreshing drinks by the hills.",
          imageSrc: "/uploads/party-2.png",
        },
        {
          date: "Oct 31, 2024",
          title: "Halloween Costume Bash",
          description: "Join us for the most mysterious night of the year. Best costume wins a prize!",
          imageSrc: "/uploads/party-3.png",
        }
      ],
    },
    gallery: {
      eyebrow: "INSIDE AZZURRI",
      title: "Our Gallery",
      items: [],
    },
    testimonials: {
      eyebrow: "TESTIMONIALS",
      title: "What Our Clients Say",
      subtitle: "",
      items: [
        {
          quote: "The combination of flavors is something I haven't experienced elsewhere in Kigali. The atmosphere is just perfect for a night out.",
          name: "SOPHIA MUKAMANZI",
          rating: 5
        },
        {
          quote: "A truly unique fusion experience. The cocktails are inventive and the staff makes you feel right at home.",
          name: "DAVID KAGAME",
          rating: 5
        }
      ],
    },
    blog: {
      eyebrow: "FROM OUR BLOG",
      title: "Latest News & Updates",
      items: [
        {
          category: "FOOD & DRINKS",
          title: "Summer cocktails that bring the vibe",
          excerpt: "Discover our new seasonal cocktail menu featuring local ingredients and exotic spirits.",
          imageSrc: "/uploads/blog-1.png",
        },
        {
          category: "KITCHEN",
          title: "Chef’s notes: The art of fusion",
          excerpt: "Our lead chef shares the inspiration behind combining Rwandan spices with Japanese techniques.",
          imageSrc: "/uploads/blog-2.png",
        },
        {
          category: "EVENTS",
          title: "Halloween party at Azzurri",
          excerpt: "A look back at our most successful themed night yet. See the highlights and costumes.",
          imageSrc: "/uploads/party-3.png",
        }
      ],
    },
    contact: {
      title: "Visit Us",
      addressLines: ["Kigali, Rwanda", "KG 674 St, Kimihurura"],
      addressNote: "Located in the heart of Kimihurura.",
      hoursLines: [
        "Monday - Sunday: 10:00 AM - 12:00 PM",
      ],
      email: "reservation@azzurrirwanda.com",
      phone: "+250 792 880 335",
      mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.534425993558!2d30.055222774966932!3d-1.9387409980436723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca5b8c42a7f63%3A0x14cf363a1f515ab0!2sAzzurri%20Restaurant%2C%20Club%20%26%20Lounge!5e0!3m2!1sen!2srw!4v1773607724597!5m2!1sen!2srw",
      directionsUrl: "https://maps.google.com/?q=Azzurri+Kigali+Kimihurura",
    },
    menu: {
      restaurantPdfUrl: "",
      clubPdfUrl: "",
    },
    specialty: {
      title: "Speciality",
      content: "",
    },
    specialOffers: {
      title: "Special offers",
      content: "",
    },
    socialLinks: {
      instagramRestaurant: "https://www.instagram.com/azzurri_rooftop_restaurant/",
      instagramClub: "https://www.instagram.com/azzurri.rw/",
      tikTok: "https://www.tiktok.com/@azzurri.rw",
      facebook: "https://web.facebook.com/p/La-Creola-Restaurant-and-Lounge-61550407251686/",
    },
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  const defaults = getDefaultContent();
  try {
    const supabase = getSupabase();
    console.log("Fetching site content for ID:", CONTENT_ROW_ID);
    const { data, error } = await supabase.from("content").select("data").eq("id", CONTENT_ROW_ID).maybeSingle();
    
    if (error) {
      console.error("Supabase fetch error for site content:", error);
      return defaults;
    }
    
    if (!data?.data || typeof data.data !== "object") {
      console.warn("No data found or invalid format for site content ID:", CONTENT_ROW_ID);
      return defaults;
    }
    
    console.log("Successfully fetched site content from Supabase.");
    const parsed = data.data as Partial<SiteContent>;
    return {
      hero: { ...defaults.hero, ...parsed.hero },
      about: { ...defaults.about, ...parsed.about },
      excellence: { ...defaults.excellence, ...parsed.excellence },
      descriptionSection: { ...defaults.descriptionSection, ...parsed.descriptionSection },
      menuIntro: { ...defaults.menuIntro, ...parsed.menuIntro },
      events: { ...defaults.events, ...parsed.events },
      gallery: { ...defaults.gallery, ...parsed.gallery },
      testimonials: { ...defaults.testimonials, ...parsed.testimonials },
      blog: { ...defaults.blog, ...parsed.blog },
      contact: { ...defaults.contact, ...parsed.contact },
      menu: { ...defaults.menu, ...parsed.menu },
      specialty: { ...defaults.specialty, ...parsed.specialty },
      specialOffers: { ...defaults.specialOffers, ...parsed.specialOffers },
      socialLinks: { ...defaults.socialLinks, ...parsed.socialLinks },
    };
  } catch (err) {
    console.error("Critical error in getSiteContent:", err);
    return defaults;
  }
}

export async function saveSiteContent(next: SiteContent): Promise<void> {
  const supabase = getSupabase();
  await supabase.from("content").upsert({ id: CONTENT_ROW_ID, data: next, updated_at: new Date().toISOString() }, { onConflict: "id" });
}

