import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "./api";

export const DEFAULT_HOMEPAGE_SECTIONS = [
  {
    sectionKey: "hero",
    sectionName: "Hero Banner & Slider",
    sectionTitle: "",
    sectionSubtitle: "",
    description: "Full-width campaign visual banner and promotional image slider.",
    routePath: "/",
    navLabel: "Hero Banner",
    homepageVisible: true,
    websiteEnabled: true,
    sortOrder: 1
  },
  {
    sectionKey: "feature_highlights",
    sectionName: "Feature & Trust Highlights",
    sectionTitle: "Why PrettyVision",
    sectionSubtitle: "OUR COMMITMENT",
    description: "Trust badges: Expert Eye Care, Premium Brands, Personalized Fitting, Contact Lens Expertise.",
    routePath: "/",
    navLabel: "Trust Highlights",
    homepageVisible: true,
    websiteEnabled: true,
    sortOrder: 2
  },
  {
    sectionKey: "collections",
    sectionName: "Explore Our Collections",
    sectionTitle: "FRAMES FOR EVERY STYLE",
    sectionSubtitle: "EXPLORE OUR COLLECTIONS",
    description: "Curated collections: Men's, Women's, Kids, Sunglasses & Contact Lenses.",
    routePath: "/eyewear",
    navLabel: "Collections",
    homepageVisible: true,
    websiteEnabled: true,
    sortOrder: 3
  },
  {
    sectionKey: "categories",
    sectionName: "Shop By Type",
    sectionTitle: "FIND WHAT SUITS YOU",
    sectionSubtitle: "SHOP BY TYPE",
    description: "Frames categorized by type: Optical Frames, Sunglasses, Blue-Light Glasses, Sports Eyewear, Contact Lenses.",
    routePath: "/eyewear",
    navLabel: "Categories",
    homepageVisible: true,
    websiteEnabled: true,
    sortOrder: 4
  },
  {
    sectionKey: "brand_showcase",
    sectionName: "Brand Showcase",
    sectionTitle: "OUR BRANDS",
    sectionSubtitle: "ICONIC BRANDS. TIMELESS STYLE.",
    description: "Explore premium global brands at PrettyVision.",
    routePath: "/brands",
    navLabel: "Brand Showcase",
    homepageVisible: true,
    websiteEnabled: true,
    sortOrder: 5
  },
  {
    sectionKey: "brand_strip",
    sectionName: "Brand Logo Strip",
    sectionTitle: "Authorized Optical Brands",
    sectionSubtitle: "GLOBAL LABELS",
    description: "Marquee strip of luxury brands: Ray-Ban, Oakley, Vogue, Armani, Versace, Tom Ford, Essilor, Polaroid.",
    routePath: "/brands",
    navLabel: "Brand Logos",
    homepageVisible: true,
    websiteEnabled: true,
    sortOrder: 6
  },
  {
    sectionKey: "services",
    sectionName: "Complete Eye Care Services",
    sectionTitle: "OUR SERVICES",
    sectionSubtitle: "COMPLETE EYE CARE",
    description: "Professional eye care and optical services to keep your vision clear and your eyes healthy.",
    routePath: "/services",
    navLabel: "Services",
    homepageVisible: true,
    websiteEnabled: true,
    sortOrder: 7
  },
  {
    sectionKey: "store_visit",
    sectionName: "Visit Our Store",
    sectionTitle: "PRETTY VISION KALINA",
    sectionSubtitle: "VISIT OUR STORE",
    description: "Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098",
    routePath: "/contact",
    navLabel: "Store Visit",
    homepageVisible: true,
    websiteEnabled: true,
    sortOrder: 8
  },
  {
    sectionKey: "gallery",
    sectionName: "Instagram & Lifestyle Gallery",
    sectionTitle: "FOLLOW PRETTYVISION",
    sectionSubtitle: "@prettyvision_kalina",
    description: "Editorial photography and lifestyle proof from our store and happy customers.",
    routePath: "/gallery",
    navLabel: "Gallery",
    homepageVisible: true,
    websiteEnabled: true,
    sortOrder: 9
  },
  {
    sectionKey: "blog",
    sectionName: "PrettyVision Journal & Articles",
    sectionTitle: "LATEST FROM PRETTYVISION",
    sectionSubtitle: "EYE HEALTH & STYLE",
    description: "Optical advice, lens care tips, and frame selection guides.",
    routePath: "/blog",
    navLabel: "Blog",
    homepageVisible: true,
    websiteEnabled: true,
    sortOrder: 10
  },
  {
    sectionKey: "testimonials",
    sectionName: "Customer Reviews",
    sectionTitle: "What Our Customers Say",
    sectionSubtitle: "COMMUNITY TRUST",
    description: "Trusted by our community for quality eyewear and expert care.",
    routePath: "/",
    navLabel: "Testimonials",
    homepageVisible: true,
    websiteEnabled: true,
    sortOrder: 11
  },
  {
    sectionKey: "final_cta",
    sectionName: "Expert Eye Care CTA",
    sectionTitle: "YOUR VISION DESERVES EXPERT CARE.",
    sectionSubtitle: "EXPERT EYE CARE AT PRETTYVISION KALINA",
    description: "Visit PrettyVision Kalina and experience better vision with our trusted optometrists, advanced technology and personalized care.",
    routePath: "/contact",
    navLabel: "Expert Eye Care CTA",
    homepageVisible: true,
    websiteEnabled: true,
    sortOrder: 13,
    content: {
      eyebrow: "EXPERT EYE CARE AT PRETTYVISION KALINA",
      showEyebrow: true,
      heading: "YOUR VISION DESERVES EXPERT CARE.",
      showHeading: true,
      description: "Visit PrettyVision Kalina and experience better vision with our trusted optometrists, advanced technology and personalized care.",
      showDescription: true,
      features: [
        { id: "1", icon: "Eye", title: "Professional Eye Examination", description: "", enabled: true, sortOrder: 1 },
        { id: "2", icon: "Users", title: "Expert Optometrists", description: "", enabled: true, sortOrder: 2 },
        { id: "3", icon: "Shield", title: "Advanced Technology", description: "", enabled: true, sortOrder: 3 },
        { id: "4", icon: "Heart", title: "Personalized Care", description: "", enabled: true, sortOrder: 4 }
      ],
      showFeatures: true,
      primaryCtaText: "Book an Eye Test",
      primaryCtaLink: "/contact",
      showPrimaryCta: true,
      secondaryCtaText: "Explore Our Store",
      secondaryCtaLink: "/eyewear",
      showSecondaryCta: true,
      image: "/uploads/sunglasses_hero_wood.jpg",
      showImage: true,
      showImageMobile: true,
      imageAlt: "Luxury Eyewear at PrettyVision Kalina",
      overlayOpacity: 85
    }
  }
];

export const notifyHomepageSectionsUpdated = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("homepage-sections-updated"));
  }
};

export const useHomepageSections = () => {
  const [sections, setSections] = useState(DEFAULT_HOMEPAGE_SECTIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/homepage-sections");
      const list = (res && (res.sections || res.items)) || [];
      if (Array.isArray(list) && list.length > 0) {
        setSections(list);
      }
      setError(null);
    } catch (err) {
      console.warn("Failed to fetch homepage sections:", err?.message);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();

    const handleUpdate = () => {
      fetchSections();
    };

    window.addEventListener("homepage-sections-updated", handleUpdate);
    return () => {
      window.removeEventListener("homepage-sections-updated", handleUpdate);
    };
  }, [fetchSections]);

  const sectionMap = useCallback(() => {
    const map = {};
    for (const s of sections) {
      map[s.sectionKey] = s;
    }
    return map;
  }, [sections]);

  const isSectionVisible = useCallback(
    (key) => {
      const s = sections.find((item) => item.sectionKey === key);
      if (!s) return true;
      if (s.homepageVisible === false) return false;
      if (s.websiteEnabled === false) return false;
      if (s.status === "inactive") return false;
      return true;
    },
    [sections]
  );

  const isPageEnabled = useCallback(
    (routeOrKey) => {
      if (!routeOrKey) return true;
      const normalized = routeOrKey.toLowerCase().trim();

      const byKey = sections.find((s) => s.sectionKey?.toLowerCase() === normalized);
      if (byKey && byKey.websiteEnabled === false) {
        return false;
      }

      const byRoute = sections.filter((s) => {
        if (!s.routePath) return false;
        const sPath = s.routePath.toLowerCase();
        return sPath === normalized || normalized.startsWith(sPath + "/");
      });

      for (const s of byRoute) {
        if (s.websiteEnabled === false) {
          return false;
        }
      }

      return true;
    },
    [sections]
  );

  const getSection = useCallback(
    (key) => {
      return sections.find((s) => s.sectionKey === key) || null;
    },
    [sections]
  );

  return {
    sections,
    loading,
    error,
    refetch: fetchSections,
    isSectionVisible,
    isPageEnabled,
    getSection,
    sectionMap
  };
};
