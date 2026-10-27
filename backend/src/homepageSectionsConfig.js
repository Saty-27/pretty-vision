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
    sortOrder: 1,
    content: {}
  },
  {
    sectionKey: "feature_highlights",
    sectionName: "Feature & Trust Highlights",
    sectionTitle: "Why PrettyVision",
    sectionSubtitle: "OUR COMMITMENT",
    description: "Trust badges: Expert Eye Care, Premium Brands, Personalized Fitting, Contact Lens Expertise.",
    routePath: "/",
    navLabel: "Feature Highlights",
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
    sortOrder: 3,
    content: {
      viewAllText: "View All Collections",
      viewAllLink: "/eyewear"
    }
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
    sortOrder: 4,
    content: {
      viewAllText: "View All Categories",
      viewAllLink: "/eyewear"
    }
  },
  {
    sectionKey: "brand_showcase",
    sectionName: "Our Brands Promotional Banner",
    sectionTitle: "OUR BRANDS",
    sectionSubtitle: "ICONIC BRANDS. TIMELESS STYLE.",
    description: "Explore premium global brands at PrettyVision.",
    routePath: "/brands",
    navLabel: "Our Brands",
    homepageVisible: true,
    websiteEnabled: true,
    sortOrder: 5,
    content: {
      button1Enabled: true,
      button1Text: "View All Brands",
      button1Link: "/brands",
      featuredEnabled: true,
      brandName: "Ray-Ban",
      tagline: "FRESH STYLES. FRESH COLOURS.",
      button2Text: "Explore Ray-Ban",
      button2Link: "/brands/ray-ban",
      desktopImage: "/brand_sunglasses_feathered.png",
      mobileImage: "/brand_sunglasses_feathered.png",
      image: "/brand_sunglasses_feathered.png",
      brandLogo: "/rayban_logo_white.png",
      imagePosition: "center",
      imageFit: "contain",
      backgroundColor: "#08294C"
    }
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
    sortOrder: 7,
    content: {
      viewAllText: "View All Services",
      viewAllLink: "/services"
    }
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
    sortOrder: 8,
    content: {
      storeName: "PRETTY VISION KALINA",
      eyebrow: "VISIT OUR STORE",
      address: "Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098",
      phone: "095940 30310",
      hours: "Monday – Saturday: 10:00 AM – 9:30 PM\nSunday: 11:00 AM – 8:00 PM",
      button1Text: "Get Directions",
      button1Link: "https://maps.google.com/?q=Pretty+Vision+Kalina+Mumbai",
      button2Text: "095940 30310",
      button2Link: "tel:09594030310",
      interiorImage: "/store_interior_ref.png",
      exteriorImage: "/store_exterior_ref.png"
    }
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
    sortOrder: 9,
    content: {
      instagramHandle: "@prettyvision_kalina",
      instagramUrl: "https://instagram.com/prettyvision_kalina",
      viewAllText: "View on Instagram",
      viewAllLink: "https://instagram.com/prettyvision_kalina"
    }
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
    sortOrder: 10,
    content: {
      viewAllText: "View All Articles",
      viewAllLink: "/blog"
    }
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
    sectionKey: "optical_guide",
    sectionName: "Clinical Optical & Eyecare SEO Guide",
    sectionTitle: "THE DEFINITIVE EYECARE & EYEWEAR GUIDE",
    sectionSubtitle: "OPTOMETRY EXCELLENCE IN KALINA, MUMBAI",
    description: "Comprehensive 1,500+ word clinical guide on eye examinations, frame architecture, lens technology, and vision health.",
    routePath: "/guide/comprehensive-eyecare",
    navLabel: "Eyecare Guide",
    homepageVisible: true,
    websiteEnabled: true,
    sortOrder: 12,
    content: {
      badge: "Clinical Optometry & Luxury Optics",
      readMoreLink: "/guide/comprehensive-eyecare",
      ctaText: "Book an Eye Test"
    }
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

export const HOMEPAGE_SECTION_KEYS = DEFAULT_HOMEPAGE_SECTIONS.map((s) => s.sectionKey);
