import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  User,
  SiteSetting,
  FooterSetting,
  NavigationItem,
  PageSection,
  HeroBanner,
  FeatureHighlight,
  Collection,
  Category,
  Brand,
  Product,
  Service,
  StoreLocation,
  GalleryItem,
  Testimonial,
  Blog
} from "./models.js";
import { DEFAULT_HOMEPAGE_SECTIONS } from "./homepageSectionsConfig.js";
import { DEFAULT_ABOUT_SECTIONS } from "./aboutSectionsConfig.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/prettyvision";

async function seedPrettyVision() {
  console.log("Connecting to MongoDB at:", MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB successfully.");

  // 1. Admin Users
  const adminUsers = [
    {
      name: "PrettyVision Admin",
      email: "admin@prettyvision.in",
      password: "Admin@123",
      role: "main_admin",
      phone: "+91 95940 30310",
      status: "active"
    },
    {
      name: "Main Admin",
      email: "admin@iskconlms.com",
      password: "Admin@123",
      role: "main_admin",
      phone: "+91 90000 00001",
      status: "active"
    }
  ];

  for (const adm of adminUsers) {
    const exists = await User.findOne({ email: adm.email });
    if (!exists) {
      await User.create(adm);
      console.log(`Created admin user: ${adm.email}`);
    } else {
      exists.password = adm.password;
      exists.role = "main_admin";
      exists.status = "active";
      await exists.save();
      console.log(`Updated admin password & role: ${adm.email}`);
    }
  }

  // 2. Site Setting
  await SiteSetting.findOneAndUpdate(
    { singletonKey: "site" },
    {
      $set: {
        singletonKey: "site",
        siteName: "PrettyVision",
        tagline: "Optometrist • Opticians • Contact Lens Clinic",
        logo: "/uploads/pv_logo.png",
        favicon: "/uploads/pv_logo.png",
        primaryColor: "#042041",
        defaultSeoTitle: "PrettyVision — Premium Eyewear & Optometry Clinic Kalina Mumbai",
        defaultSeoDescription: "Expert eye care, premium eyewear and contact lenses all under one roof in Kalina, Mumbai. Visit PrettyVision for comprehensive eye tests and genuine luxury brands.",
        phone: "095940 30310",
        email: "prettyvisionkalina@gmail.com",
        address: "Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098",
        businessHours: "Mon – Sat: 10:00 AM – 9:30 PM | Sun: 11:00 AM – 8:00 PM",
        googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.835948956972!2d72.8596646!3d19.0709405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e0a3f81e35%3A0xc3b09dc69fb4d23!2sPretty%20Vision!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
        googleMapsUrl: "https://maps.google.com/?q=Pretty+Vision+Kalina+Mumbai",
        instagramUrl: "https://instagram.com/prettyvision_kalina",
        facebookUrl: "https://facebook.com/prettyvision_kalina",
        youtubeUrl: "",
        whatsappNumber: "919594030310",
        whatsappDefaultMessage: "Hi PrettyVision, I would like to enquire about your eyewear collection / book an eye test.",
        primaryCtaText: "Book Eye Test",
        primaryCtaUrl: "/contact",
        topBarLocation: "Kalina, Mumbai",
        topBarPhone: "095940 30310",
        topBarCtaText: "Visit Store",
        topBarCtaUrl: "/contact"
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("Seeded SiteSetting.");

  // 3. Footer Setting
  await FooterSetting.findOneAndUpdate(
    { singletonKey: "footer" },
    {
      $set: {
        singletonKey: "footer",
        logo: "/uploads/pv_logo.png",
        description: "PrettyVision is Kalina's premier optical store and eye care clinic, providing qualified optometrist eye testing, luxury eyewear, and contact lens fitting.",
        columns: [
          {
            title: "Quick Links",
            links: [
              { label: "Home", url: "/" },
              { label: "Eyewear", url: "/eyewear" },
              { label: "Services", url: "/services" },
              { label: "Brands", url: "/brands" },
              { label: "About", url: "/about" },
              { label: "Contact", url: "/contact" }
            ]
          },
          {
            title: "Our Services",
            links: [
              { label: "Eye Examination", url: "/services/comprehensive-eye-examination" },
              { label: "Prescription Eyewear", url: "/services/prescription-eyewear" },
              { label: "Contact Lens Fitting", url: "/services/contact-lens-fitting" },
              { label: "Kids Eye Care", url: "/services/kids-and-family-eye-care" },
              { label: "Lens & Coating", url: "/services/lens-and-coating-consultation" },
              { label: "Frame Adjustment", url: "/services/frame-adjustment-and-repair" }
            ]
          }
        ],
        contactDetails: {
          address: "Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098",
          phone: "095940 30310",
          email: "prettyvisionkalina@gmail.com"
        },
        socialLinks: {
          instagram: "https://instagram.com/prettyvision_kalina",
          facebook: "https://facebook.com/prettyvision_kalina",
          whatsapp: "https://wa.me/919594030310"
        },
        copyrightText: "© 2024 Pretty Vision. All rights reserved.",
        copyrightYear: 2024,
        newsletterEnabled: true
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("Seeded FooterSetting.");

  // 4. Navigation Items
  await NavigationItem.deleteMany({});
  const navItems = [
    { label: "Home", path: "/", order: 1, isActive: true },
    {
      label: "Eyewear",
      path: "/eyewear",
      order: 2,
      isActive: true,
      children: [
        { label: "Optical Frames", path: "/eyewear?category=Optical+Frames", order: 1, isActive: true },
        { label: "Sunglasses", path: "/eyewear?category=Sunglasses", order: 2, isActive: true },
        { label: "Blue-Light Glasses", path: "/eyewear?category=Blue-Light+Glasses", order: 3, isActive: true },
        { label: "Sports Eyewear", path: "/eyewear?category=Sports+Eyewear", order: 4, isActive: true },
        { label: "Contact Lenses", path: "/eyewear?category=Contact+Lenses", order: 5, isActive: true }
      ]
    },
    { label: "Services", path: "/services", order: 3, isActive: true },
    { label: "Brands", path: "/brands", order: 4, isActive: true },
    { label: "About", path: "/about", order: 5, isActive: true },
    { label: "Contact", path: "/contact", order: 6, isActive: true },
    { label: "Book Eye Test", path: "/contact", order: 7, isCta: true, ctaStyle: "solid", isActive: true }
  ];
  await NavigationItem.insertMany(navItems);
  console.log("Seeded Navigation Items.");

  // 5. Homepage Sections
  for (const def of DEFAULT_HOMEPAGE_SECTIONS) {
    await PageSection.findOneAndUpdate(
      { pageName: "home", sectionKey: def.sectionKey },
      {
        $set: {
          pageName: "home",
          sectionKey: def.sectionKey,
          sectionName: def.sectionName,
          sectionTitle: def.sectionTitle,
          sectionSubtitle: def.sectionSubtitle,
          description: def.description,
          routePath: def.routePath,
          navLabel: def.navLabel,
          sortOrder: def.sortOrder,
          homepageVisible: true,
          websiteEnabled: true,
          status: "active",
          content: def.content || {}
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log("Seeded Homepage Sections.");

  // 5b. About Page Sections
  for (const def of DEFAULT_ABOUT_SECTIONS) {
    await PageSection.findOneAndUpdate(
      { pageName: "about", sectionKey: def.sectionKey },
      {
        $set: {
          pageName: "about",
          sectionKey: def.sectionKey,
          sectionName: def.sectionName,
          sectionTitle: def.sectionTitle,
          sectionSubtitle: def.sectionSubtitle,
          description: def.description,
          routePath: def.routePath,
          navLabel: def.navLabel,
          sortOrder: def.sortOrder,
          websiteEnabled: true,
          status: "active",
          content: def.content || {}
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log("Seeded About Page Sections.");

  // 6. Hero Banners
  await HeroBanner.deleteMany({});
  await HeroBanner.create({
    eyebrow: "PREMIUM EYEWEAR",
    eyebrowText: "PREMIUM EYEWEAR",
    heading: "SEE BETTER. LOOK YOUR BEST.",
    title: "SEE BETTER. LOOK YOUR BEST.",
    description: "Expert eye care, premium eyewear and contact lenses all under one roof in Kalina, Mumbai.",
    subtitle: "Expert eye care, premium eyewear and contact lenses all under one roof in Kalina, Mumbai.",
    button1Enabled: true,
    button1Text: "Book an Eye Test",
    button1Url: "/contact",
    buttonText: "Book an Eye Test",
    buttonLink: "/contact",
    button2Enabled: true,
    button2Text: "Explore Collections",
    button2Url: "/eyewear",
    button2Link: "/eyewear",
    desktopImage: "/uploads/hero_banner.jpg",
    tabletImage: "/uploads/hero_banner.jpg",
    mobileImage: "/uploads/hero_banner.jpg",
    locationBadge: "Shop No 11, Agarwal Building, opposite Nilesh Dryfruits, Kalina, Santacruz East, Mumbai 400098",
    locationText: "Shop No 11, Agarwal Building, opposite Nilesh Dryfruits, Kalina, Santacruz East, Mumbai 400098",
    bannerUrl: "/eyewear",
    textPosition: "bottom-left",
    textAlignment: "left",
    textColor: "light",
    overlayType: "dark",
    height: "large",
    order: 1,
    isActive: true
  });
  console.log("Seeded Hero Banner.");

  // 7. Feature Highlights
  await FeatureHighlight.deleteMany({});
  const highlights = [
    { icon: "Eye", title: "Expert Eye Care", subtitle: "by Qualified Optometrists", linkUrl: "/services", order: 1, isActive: true },
    { icon: "Gem", title: "Premium Brands", subtitle: "Global Eyewear Collection", linkUrl: "/brands", order: 2, isActive: true },
    { icon: "Glasses", title: "Personalized Fitting", subtitle: "Find Your Perfect Look", linkUrl: "/services", order: 3, isActive: true },
    { icon: "Disc", title: "Contact Lens Expertise", subtitle: "For Clearer Vision", linkUrl: "/services", order: 4, isActive: true }
  ];
  await FeatureHighlight.insertMany(highlights);
  console.log("Seeded Feature Highlights.");

  // 8. Collections (Square Cards)
  await Collection.deleteMany({});
  const collections = [
    {
      title: "Men's Eyewear",
      subtitle: "Modern. Sharp. Versatile.",
      image: "/square_card_1.png",
      buttonText: "Explore",
      destinationUrl: "/eyewear?gender=Men",
      hasEmbeddedText: true,
      badge: "Architectural & Titanium",
      seoTitle: "Men's Designer Eyewear & Prescription Frames in Kalina, Mumbai | PrettyVision",
      seoDescription: "Discover precision-crafted men's eyewear at PrettyVision Kalina. From aerospace titanium to hand-polished Italian acetate frames tailored for professional & casual style.",
      seoContent: "Engineered for distinction and all-day visual comfort, PrettyVision's men's optical collection showcases architectonic eyewear designs crafted from Japanese titanium, lightweight carbon composite, and rich block acetate. Designed for professional boardrooms in BKC and weekend leisure across Bandra, each pair is custom-fitted to your bridge geometry, pupillary distance, and optical prescription.",
      order: 1,
      isActive: true
    },
    {
      title: "Women's Eyewear",
      subtitle: "Elegant. Contemporary. Timeless.",
      image: "/square_card_2.png",
      buttonText: "Explore",
      destinationUrl: "/eyewear?gender=Women",
      hasEmbeddedText: true,
      badge: "Contemporary Luxe",
      seoTitle: "Women's Luxury Eyewear & Designer Frames in Kalina Mumbai | PrettyVision",
      seoDescription: "Explore our curated women's eyewear collection at PrettyVision Kalina. Sophisticated cat-eyes, translucent champagne acetates, and refined gold wireframes for discerning eyes.",
      seoContent: "PrettyVision's women's eyewear collection balances haute couture aesthetics with ophthalmic precision. From sculptural cat-eye silhouettes and oversized vintage hexagons to ultralight rose-gold wireframes, each frame is paired with premium anti-reflective and blue-cut lenses to protect your eyes while elevating your personal aesthetic.",
      order: 2,
      isActive: true
    },
    {
      title: "Kids' Eyewear",
      subtitle: "Safe. Stylish. Built for Growing Eyes.",
      image: "/square_card_3.png",
      buttonText: "Explore",
      destinationUrl: "/eyewear?gender=Kids",
      hasEmbeddedText: true,
      badge: "Flexible & Impact Safe",
      seoTitle: "Kids' Eyewear & Pediatric Myopia Care in Kalina Santacruz | PrettyVision",
      seoDescription: "Durable, flexible, and shatterproof kids' glasses in Kalina, Mumbai. Certified pediatric optometrists providing gentle vision testing and myopia control lenses.",
      seoContent: "Children's vision demands extraordinary durability, biocompatibility, and comfort. At PrettyVision Kalina, our pediatric eyewear range features shatter-resistant polycarbonate lenses, hypoallergenic BPA-free TR90 memory flex frames, and specialized myopia-control optics that slow axial elongation in school-aged children.",
      order: 3,
      isActive: true
    },
    {
      title: "Sunglasses Collection",
      subtitle: "Everyday to Iconic Styles.",
      image: "/square_card_4.png",
      buttonText: "Explore",
      destinationUrl: "/eyewear?category=Sunglasses",
      hasEmbeddedText: true,
      badge: "UV400 & Polarized Optics",
      seoTitle: "Designer Sunglasses & Prescription Polarized Eyewear Mumbai | PrettyVision",
      seoDescription: "Shield your eyes in style with 100% UV400 polarized prescription sunglasses at PrettyVision Kalina. Authorized dealers for Ray-Ban, Oakley, Vogue, and Versace.",
      seoContent: "Under Mumbai's intense coastal sunlight, ocular UV protection is essential. PrettyVision offers polarized prescription and non-prescription sunglasses equipped with anti-reflective back-surface coatings, contrast-enhancing tints, and UV400 defense to eliminate blinding road glare and safeguard retinal health.",
      order: 4,
      isActive: true
    },
    {
      title: "Contact Lenses",
      subtitle: "Clearer Vision. Greater Freedom.",
      image: "/square_card_5.png",
      buttonText: "Explore",
      destinationUrl: "/eyewear?category=Contact+Lenses",
      hasEmbeddedText: true,
      badge: "Breathable Silicone Hydrogel",
      seoTitle: "Contact Lens Clinic Kalina Mumbai — Daily & Monthly Toric/Multifocal Lenses",
      seoDescription: "Book a clinical contact lens consultation at PrettyVision Kalina. Authorized dispensing of Acuvue, Bausch + Lomb, and Alcon toric, multifocal, and daily lenses.",
      seoContent: "Experience boundary-free vision with our specialized contact lens fitting clinic. Using digital keratometry and tear-film analysis, our certified optometrists fit breathable silicone hydrogel lenses, toric astigmatism correction, and multifocal lenses for presbyopia with unparalleled wettability and oxygen permeability.",
      order: 5,
      isActive: true
    }
  ];
  await Collection.insertMany(collections);
  console.log("Seeded Collections with high-res square cards and SEO metadata.");

  // 9. Categories ("Shop By Type / Find What Suits You")
  await Category.deleteMany({});
  const categories = [
    {
      name: "Optical Frames",
      title: "Optical Frames",
      subtitle: "Classic. Modern. Timeless.",
      slug: "optical-frames",
      image: "/cat_optical_frames.jpg",
      icon: "Glasses",
      destinationUrl: "/eyewear?category=Optical+Frames",
      order: 1,
      isActive: true
    },
    {
      name: "Sunglasses",
      title: "Sunglasses",
      subtitle: "Everyday to Iconic Styles.",
      slug: "sunglasses",
      image: "/cat_sunglasses.jpg",
      icon: "Sun",
      destinationUrl: "/eyewear?category=Sunglasses",
      order: 2,
      isActive: true
    },
    {
      name: "Blue-Light Glasses",
      title: "Blue-Light Glasses",
      subtitle: "Work. Study. Digital Comfort.",
      slug: "blue-light-glasses",
      image: "/cat_bluelight.jpg",
      icon: "Monitor",
      destinationUrl: "/eyewear?category=Blue-Light+Glasses",
      order: 3,
      isActive: true
    },
    {
      name: "Sports Eyewear",
      title: "Sports Eyewear",
      subtitle: "Active. Durable. Performance.",
      slug: "sports-eyewear",
      image: "/cat_sports.jpg",
      icon: "Activity",
      destinationUrl: "/eyewear?category=Sports+Eyewear",
      order: 4,
      isActive: true
    },
    {
      name: "Contact Lenses",
      title: "Contact Lenses",
      subtitle: "Daily. Monthly. Specialized.",
      slug: "contact-lenses",
      image: "/cat_contacts.jpg",
      icon: "Disc",
      destinationUrl: "/eyewear?category=Contact+Lenses",
      order: 5,
      isActive: true
    }
  ];
  await Category.insertMany(categories);
  console.log("Seeded Categories with neutral placeholder configuration.");

  // 10. Brands
  await Brand.deleteMany({});
  const brands = [
    {
      name: "Ray-Ban",
      slug: "ray-ban",
      description: "Iconic global eyewear brand famous for the Aviator, Wayfarer, Clubmaster and Meta smart glasses.",
      bannerImage: "/uploads/brand_showcase.jpg",
      brandImage: "/uploads/brand_showcase.jpg",
      websiteUrl: "https://www.ray-ban.com",
      isFeatured: true,
      order: 1,
      isActive: true
    },
    {
      name: "Oakley",
      slug: "oakley",
      description: "Pioneering high-performance sport optics and stylish casual eyewear for outdoor enthusiasts.",
      websiteUrl: "https://www.oakley.com",
      isFeatured: true,
      order: 2,
      isActive: true
    },
    {
      name: "Vogue Eyewear",
      slug: "vogue-eyewear",
      description: "Trendy, expressive and fashion-forward frames tailored for contemporary women and men.",
      websiteUrl: "https://www.vogue-eyewear.com",
      isFeatured: true,
      order: 3,
      isActive: true
    },
    {
      name: "Emporio Armani",
      slug: "emporio-armani",
      description: "Refined Italian luxury and modern elegance crafted with exceptional precision.",
      websiteUrl: "https://www.armani.com",
      isFeatured: true,
      order: 4,
      isActive: true
    },
    {
      name: "Versace",
      slug: "versace",
      description: "Glamorous Italian high-fashion eyewear with unmistakable Medusa motifs and opulent designs.",
      websiteUrl: "https://www.versace.com",
      isFeatured: true,
      order: 5,
      isActive: true
    },
    {
      name: "Tom Ford",
      slug: "tom-ford",
      description: "Sophisticated luxury acetate and metal frames recognized by the signature elegant 'T' temple logo.",
      websiteUrl: "https://www.tomford.com",
      isFeatured: true,
      order: 6,
      isActive: true
    },
    {
      name: "Essilor",
      slug: "essilor",
      description: "World leader in ophthalmic lens technology, Varilux progressive lenses and Crizal anti-reflective coatings.",
      websiteUrl: "https://www.essilor.com",
      isFeatured: true,
      order: 7,
      isActive: true
    },
    {
      name: "Polaroid",
      slug: "polaroid",
      description: "The pioneers of polarized lens technology, bringing crisp contrast and 100% UV protection.",
      websiteUrl: "https://www.polaroideyewear.com",
      isFeatured: true,
      order: 8,
      isActive: true
    }
  ];
  await Brand.insertMany(brands);
  console.log("Seeded Brands.");

  // 11. Services
  await Service.deleteMany({});
  const services = [
    {
      title: "Comprehensive Eye Examination",
      slug: "comprehensive-eye-examination",
      icon: "Eye",
      image: "/service_exam.jpg",
      shortDescription: "Detailed eye tests with advanced equipment.",
      fullDescription: "Our qualified optometrists carry out in-depth computerized vision screenings, refraction tests, and ocular pressure evaluations to keep your vision crisp and healthy.",
      ctaText: "Book Eye Test",
      ctaUrl: "/contact",
      isFeatured: true,
      order: 1,
      isActive: true
    },
    {
      title: "Prescription Eyewear",
      slug: "prescription-eyewear",
      icon: "Glasses",
      image: "/service_prescription.jpg",
      shortDescription: "Expert guidance to find the right frames and lenses.",
      fullDescription: "We help you select frames that complement your face shape and personal style, fitted with precision single vision, bifocal or progressive lenses.",
      ctaText: "Explore Eyewear",
      ctaUrl: "/eyewear",
      isFeatured: true,
      order: 2,
      isActive: true
    },
    {
      title: "Contact Lens Fitting",
      slug: "contact-lens-fitting",
      icon: "Disc",
      image: "/service_fitting.jpg",
      shortDescription: "Wide range of contact lenses and professional fitting.",
      fullDescription: "Get trial fittings for daily, monthly, toric (astigmatism) and multifocal contact lenses from world-class brands with step-by-step wear & hygiene tutorials.",
      ctaText: "Book Fitting",
      ctaUrl: "/contact",
      isFeatured: true,
      order: 3,
      isActive: true
    },
    {
      title: "Kids & Family Eye Care",
      slug: "kids-and-family-eye-care",
      icon: "Users",
      image: "/service_kids.jpg",
      shortDescription: "Eye care for all ages, including children.",
      fullDescription: "Child-friendly optometrist evaluations and durable, lightweight, hypoallergenic, flexible frames built to withstand active school and sports days.",
      ctaText: "Learn More",
      ctaUrl: "/contact",
      isFeatured: true,
      order: 4,
      isActive: true
    },
    {
      title: "Lens & Coating Consultation",
      slug: "lens-and-coating-consultation",
      icon: "Sparkles",
      image: "/service_coating.jpg",
      shortDescription: "Guidance on the best lenses, coatings and solutions for your needs.",
      fullDescription: "Personalized advice on blue-light blocking lenses for computer work, photochromic transitions, anti-glare coatings, and ultra-thin high-index materials.",
      ctaText: "Consult Optometrist",
      ctaUrl: "/contact",
      isFeatured: true,
      order: 5,
      isActive: true
    },
    {
      title: "Frame Styling & Personal Consultation",
      slug: "frame-styling-consultation",
      icon: "Smile",
      image: "/service_styling.jpg",
      shortDescription: "1-on-1 frame curation tailored to your face shape, prescription, and wardrobe.",
      fullDescription: "Our optical stylists work directly with you in our Kalina showroom to analyze bridge proportions, temple fit, and lens thickness, guaranteeing eyewear that looks striking and feels effortless.",
      ctaText: "Book Consultation",
      ctaUrl: "/contact",
      isFeatured: true,
      order: 6,
      isActive: true
    }
  ];
  await Service.insertMany(services);
  console.log("Seeded 6 Services with high-res clinical imagery.");

  // 12. Store Location
  await StoreLocation.deleteMany({});
  await StoreLocation.create({
    name: "Pretty Vision Kalina",
    eyebrow: "VISIT OUR STORE",
    tagline: "Optometrist • Opticians • Contact Lens Clinic",
    address: "Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098",
    phone: "095940 30310",
    email: "prettyvisionkalina@gmail.com",
    hours: "Monday – Saturday: 10:00 AM – 9:30 PM\nSunday: 11:00 AM – 8:00 PM",
    directionsUrl: "https://maps.google.com/?q=Pretty+Vision+Kalina+Mumbai",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.835948956972!2d72.8596646!3d19.0709405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e0a3f81e35%3A0xc3b09dc69fb4d23!2sPretty%20Vision!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    interiorImage: "/store_interior_ref.png",
    exteriorImage: "/store_exterior_ref.png",
    button1Text: "Get Directions",
    button1Url: "https://maps.google.com/?q=Pretty+Vision+Kalina+Mumbai",
    button2Text: "095940 30310",
    button2Url: "tel:09594030310",
    button3Text: "WhatsApp",
    button3Url: "https://wa.me/919594030310",
    isActive: true,
    status: "active"
  });
  console.log("Seeded Store Location with high-res boutique imagery.");

  // 13. Gallery Items
  await GalleryItem.deleteMany({});
  const galleryItems = [
    { title: "Classic Elegance", caption: "Premium acetate frames styled for everyday confidence.", image: "/gallery_1.jpg", instagramUrl: "https://instagram.com/prettyvision_kalina", order: 1, isActive: true },
    { title: "Iconic Shades", caption: "Ray-Ban polarized sunglasses under the Mumbai sun.", image: "/gallery_2.jpg", instagramUrl: "https://instagram.com/prettyvision_kalina", order: 2, isActive: true },
    { title: "Summer Tones", caption: "Amber gradient lenses with gold metallic accents.", image: "/gallery_3.jpg", instagramUrl: "https://instagram.com/prettyvision_kalina", order: 3, isActive: true },
    { title: "New Arrivals", caption: "Fresh European optical silhouettes just dropped in store.", image: "/gallery_4.jpg", instagramUrl: "https://instagram.com/prettyvision_kalina", order: 4, isActive: true },
    { title: "Work & Study", caption: "Blue-cut digital lenses for screen clarity and zero eye fatigue.", image: "/gallery_5.jpg", instagramUrl: "https://instagram.com/prettyvision_kalina", order: 5, isActive: true },
    { title: "Tortoiseshell Craft", caption: "Timeless Havana pattern sculpted from Italian acetate.", image: "/gallery_6.jpg", instagramUrl: "https://instagram.com/prettyvision_kalina", order: 6, isActive: true },
    { title: "Urban Aviators", caption: "Double-bridge matte metal frames worn with attitude.", image: "/gallery_7.jpg", instagramUrl: "https://instagram.com/prettyvision_kalina", order: 7, isActive: true },
    { title: "Contact Lens Comfort", caption: "Moisturizing silicone hydrogel daily lenses.", image: "/gallery_8.jpg", instagramUrl: "https://instagram.com/prettyvision_kalina", order: 8, isActive: true }
  ];
  await GalleryItem.insertMany(galleryItems);
  console.log("Seeded Gallery Items with 8 high-res lifestyle tiles.");

  // 14. Testimonials
  await Testimonial.deleteMany({});
  const testimonials = [
    {
      name: "Rohit Mehta",
      userName: "Rohit Mehta",
      testimonialText: "Excellent collection and very helpful staff. Got my new Ray-Ban here and the experience was amazing!",
      rating: 5,
      designation: "Kalina, Mumbai",
      status: "approved",
      showOnHomepage: true,
      isFeatured: true,
      sortOrder: 1
    },
    {
      name: "Priya Shah",
      userName: "Priya Shah",
      testimonialText: "Great service and professional eye testing. Highly recommend Pretty Vision for genuine brands!",
      rating: 5,
      designation: "Santacruz, Mumbai",
      status: "approved",
      showOnHomepage: true,
      isFeatured: true,
      sortOrder: 2
    },
    {
      name: "Amit Desai",
      userName: "Amit Desai",
      testimonialText: "Wide range of frames and contact lenses. Very friendly staff and expert guidance.",
      rating: 5,
      designation: "BKC, Mumbai",
      status: "approved",
      showOnHomepage: true,
      isFeatured: true,
      sortOrder: 3
    }
  ];
  await Testimonial.insertMany(testimonials);
  console.log("Seeded Testimonials.");

  // 15. Products Catalogue
  await Product.deleteMany({});
  const products = [
    {
      name: "Ray-Ban Aviator Classic Gold",
      slug: "ray-ban-aviator-classic-gold",
      sku: "RB-3025-L0205",
      brand: "Ray-Ban",
      category: "Sunglasses",
      mainImage: "/uploads/cat_sunglasses.jpg",
      images: ["/uploads/cat_sunglasses.jpg", "/uploads/brand_showcase.jpg"],
      shortDescription: "Iconic teardrop shape with crystal green G-15 lenses and gold metal frame.",
      fullDescription: "Originally created in 1937 for US aviators, the Ray-Ban Aviator Classic combines exceptional styling with exceptional quality, performance and comfort.",
      frameType: "Aviator",
      lensType: "Polarized",
      gender: "Unisex",
      frameColor: "Arista Gold",
      price: 9890,
      externalEcommerceUrl: "https://www.ray-ban.com/india",
      isFeatured: true,
      order: 1,
      isActive: true
    },
    {
      name: "Tom Ford Square Havana Acetate",
      slug: "tom-ford-square-havana-acetate",
      sku: "TF-5295-052",
      brand: "Tom Ford",
      category: "Optical Frames",
      mainImage: "/uploads/cat_optical_frames.jpg",
      images: ["/uploads/cat_optical_frames.jpg", "/uploads/collection_mens.jpg"],
      shortDescription: "Handcrafted dark Havana acetate optical glasses with signature metal T logo.",
      fullDescription: "Exquisite Italian craftsmanship with subtle vintage undertones. Spring hinges ensure long-lasting comfort throughout the day.",
      frameType: "Square",
      lensType: "Single Vision",
      gender: "Men",
      frameColor: "Dark Havana",
      price: 24500,
      isFeatured: true,
      order: 2,
      isActive: true
    },
    {
      name: "Vogue Cat-Eye Contemporary",
      slug: "vogue-cat-eye-contemporary",
      sku: "VO-5353-2940",
      brand: "Vogue Eyewear",
      category: "Optical Frames",
      mainImage: "/uploads/collection_womens.jpg",
      images: ["/uploads/collection_womens.jpg"],
      shortDescription: "Feminine, stylish cat-eye frame in translucent rose crystal acetate.",
      fullDescription: "Designed for confident everyday expression, offering a lightweight fit that lifts facial contours gracefully.",
      frameType: "Cat-Eye",
      lensType: "Blue-Light Block",
      gender: "Women",
      frameColor: "Rose Transparent",
      price: 5290,
      isFeatured: true,
      order: 3,
      isActive: true
    },
    {
      name: "Essilor Eyezen Blue-Light Digital Frames",
      slug: "essilor-eyezen-blue-light-digital",
      sku: "ESS-BL-901",
      brand: "Essilor",
      category: "Blue-Light Glasses",
      mainImage: "/uploads/cat_bluelight.jpg",
      images: ["/uploads/cat_bluelight.jpg"],
      shortDescription: "Computer glasses equipped with Crizal Prevencia blue-violet light filtration.",
      fullDescription: "Engineered specifically for heavy computer, tablet and smartphone use to alleviate digital eye strain, dryness, and fatigue.",
      frameType: "Round",
      lensType: "Blue-Light Block",
      gender: "Unisex",
      frameColor: "Matte Blue",
      price: 6800,
      isFeatured: true,
      order: 4,
      isActive: true
    },
    {
      name: "Oakley Flak 2.0 XL Sports Shield",
      slug: "oakley-flak-2-0-xl-sports",
      sku: "OO-9188-01",
      brand: "Oakley",
      category: "Sports Eyewear",
      mainImage: "/uploads/cat_sports.jpg",
      images: ["/uploads/cat_sports.jpg"],
      shortDescription: "High-definition optics with Unobtainium nose pads that increase grip with sweat.",
      fullDescription: "Semi-rimless performance frame with expanded lens coverage for cycling, cricket, running, and active sports.",
      frameType: "Semi-Rimless",
      lensType: "Polarized",
      gender: "Unisex",
      frameColor: "Polished Black",
      price: 13990,
      isFeatured: true,
      order: 5,
      isActive: true
    },
    {
      name: "Acuvue Oasys HydraLuxe Contact Lenses",
      slug: "acuvue-oasys-hydraluxe-contact-lenses",
      sku: "JNJ-ACU-OAS-30",
      brand: "Essilor",
      category: "Contact Lenses",
      mainImage: "/uploads/cat_contacts.jpg",
      images: ["/uploads/cat_contacts.jpg", "/uploads/collection_contact_lenses.jpg"],
      shortDescription: "Tear-infused daily disposable silicone hydrogel contact lenses for all-day hydration.",
      fullDescription: "Designed for demanding days and digital screen use, providing breathability, smooth blink feel, and Class 1 UV blocking.",
      frameType: "Rimless",
      lensType: "Single Vision",
      gender: "Unisex",
      frameColor: "Clear",
      price: 2850,
      isFeatured: true,
      order: 6,
      isActive: true
    }
  ];
  await Product.insertMany(products);
  console.log("Seeded Products.");

  // 16. Blog Posts
  await Blog.deleteMany({});
  const blogs = [
    {
      title: "How Often Should You Get Your Eyes Tested? An Optometrist's Guide",
      slug: "how-often-should-you-get-your-eyes-tested",
      image: "/uploads/service_exam.jpg",
      shortDescription: "Vision changes gradually over time. Learn why annual check-ups are essential for both adults and children.",
      content: "<p>Most adults take their eyesight for granted until they start straining to read small text or experience recurring evening headaches. Our qualified optometrists at PrettyVision Kalina recommend scheduling a comprehensive eye examination at least once every 12 to 18 months.</p><h3>Why Routine Screenings Matter</h3><p>An eye exam is not just about updating your glasses power. It also evaluates the physical health of your eyes, checking for early signs of dry eye syndrome, ocular hypertension, and corneal stress.</p><p>Visit our Kalina clinic today for a comprehensive examination with our advanced computerized diagnostic equipment.</p>",
      category: "Eye Care",
      tags: ["Eye Test", "Optometrist", "Health", "Vision"],
      status: "published",
      showOnHomepage: true
    },
    {
      title: "Choosing the Right Frames for Your Face Shape: The 2024 Style Guide",
      slug: "choosing-the-right-frames-for-your-face-shape",
      image: "/uploads/collection_womens.jpg",
      shortDescription: "From oval and square to heart and round faces, find the exact silhouettes that flatter your facial contours.",
      content: "<p>Eyewear is one of the most expressive accessories you wear on your face every day. Balancing your frame's geometry against your natural facial contours creates immediate harmony and elevates your look.</p><h3>The Golden Rule of Contrast</h3><p>If you have soft, round features, structured rectangular or angular cat-eye frames add definition. Conversely, square or angular jawlines look stunning with round or softly curved aviator frames.</p><p>Drop by PrettyVision in Kalina, Mumbai to try on dozens of designer styles with guidance from our personalized fitting specialists.</p>",
      category: "Style Guide",
      tags: ["Fashion", "Face Shape", "Eyewear", "Frames"],
      status: "published",
      showOnHomepage: true
    },
    {
      title: "Digital Eye Strain: How Blue-Light Filtering Lenses Protect Your Eyes",
      slug: "digital-eye-strain-blue-light-filtering-lenses",
      image: "/uploads/cat_bluelight.jpg",
      shortDescription: "Spending 8+ hours in front of screens? Discover how specialized coatings reduce glare and improve sleep quality.",
      content: "<p>Between office monitors, laptops, and smartphones, modern screen exposure is at an all-time high. High-energy blue-violet light emitted by digital screens scatters easily, leading to pixel blur, contrast loss, and eye muscle fatigue.</p><h3>How Blue-Cut Lenses Help</h3><p>Premium lenses with selective blue-light filters neutralize harsh glare without discoloring your view, allowing you to work longer with superior comfort and reduced evening headaches.</p>",
      category: "Lens Technology",
      tags: ["Blue Light", "Screens", "Lenses", "Comfort"],
      status: "published",
      showOnHomepage: true
    }
  ];
  await Blog.insertMany(blogs);
  console.log("Seeded Blog Posts.");

  console.log("ALL PRETTYVISION SEED DATA COMPLETED SUCCESSFULLY!");
  await mongoose.disconnect();
}

seedPrettyVision().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
