import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "./api";

export const DEFAULT_ABOUT_SECTIONS = [
  {
    sectionKey: "about_hero",
    sectionName: "About Hero Banner",
    sectionTitle: "SEEING BETTER.\nLIVING BETTER.",
    sectionSubtitle: "ABOUT PRETTYVISION",
    description: "33 YEARS OF TRUSTED EYE CARE & EYEWEAR IN KALINA, MUMBAI",
    routePath: "/about",
    navLabel: "About Hero",
    status: "active",
    websiteEnabled: true,
    sortOrder: 1,
    content: {
      eyebrow: "ABOUT PRETTYVISION",
      heading: "SEEING BETTER.\nLIVING BETTER.",
      subheading: "33 YEARS OF TRUSTED EYE CARE & EYEWEAR IN KALINA, MUMBAI",
      paragraph: "Since 1993, PrettyVision has been helping families discover better vision, better-fitting eyewear and trusted eye-care solutions from our optical store in Kalina, Mumbai.",
      button1Text: "Explore Our Eyewear",
      button1Url: "/eyewear",
      button2Text: "Book an Eye Test",
      button2Url: "/contact",
      image: "/about_hero_model.jpg",
      imageAlt: "PrettyVision Luxury Eyewear Model",
      badge: "Classic Eyewear • Everyday Confidence"
    }
  },
  {
    sectionKey: "about_stats",
    sectionName: "Trust Statistics Strip",
    sectionTitle: "Our Key Statistics",
    sectionSubtitle: "33+ YEARS OF TRUST",
    description: "Four trust pillars: 33+ years of experience, 10,000+ happy customers, expert optometrists, premium eyewear.",
    routePath: "/about",
    navLabel: "Trust Statistics",
    status: "active",
    websiteEnabled: true,
    sortOrder: 2,
    content: {
      items: [
        {
          id: "stat_1",
          icon: "Calendar",
          number: "33+",
          title: "YEARS OF EXPERIENCE",
          description: "Serving the Kalina community since 1993"
        },
        {
          id: "stat_2",
          icon: "Users",
          number: "10,000+",
          title: "HAPPY CUSTOMERS",
          description: "Trusted by families across Mumbai"
        },
        {
          id: "stat_3",
          icon: "Eye",
          number: "EXPERT",
          title: "OPTOMETRIC CARE",
          description: "Professional eye testing and vision care"
        },
        {
          id: "stat_4",
          icon: "Sparkles",
          number: "PREMIUM",
          title: "EYEWEAR & LENSES",
          description: "Global brands and latest lens technology"
        }
      ]
    }
  },
  {
    sectionKey: "about_story",
    sectionName: "Our Story Section",
    sectionTitle: "33 YEARS OF HELPING MUMBAI SEE BETTER",
    sectionSubtitle: "OUR STORY",
    description: "Founded in 1993, PrettyVision has grown into Kalina's premier optical showroom and optometrist clinic.",
    routePath: "/about",
    navLabel: "Our Story",
    status: "active",
    websiteEnabled: true,
    sortOrder: 3,
    content: {
      eyebrow: "OUR STORY",
      heading: "33 YEARS OF HELPING MUMBAI SEE BETTER",
      paragraph1: "Founded in 1993, PrettyVision has grown from a trusted optical destination into a premium eyewear and eye-care store serving generations of customers in and around Kalina, Mumbai.",
      paragraph2: "For more than three decades, our focus has remained simple — helping every customer find the right eyewear for their vision, lifestyle and personal style. From everyday prescription glasses and sunglasses to contact lenses and professional eye examinations, PrettyVision brings eye care and eyewear together under one roof.",
      buttonText: "Discover PrettyVision",
      buttonUrl: "/eyewear",
      image: "/about_story_showroom.jpg",
      imageAlt: "PrettyVision Luxury Optical Showroom Kalina"
    }
  },
  {
    sectionKey: "about_why_choose",
    sectionName: "Why Choose PrettyVision",
    sectionTitle: "MORE THAN AN OPTICAL STORE",
    sectionSubtitle: "WHY CHOOSE PRETTYVISION",
    description: "A trusted destination for better vision and better eyewear.",
    routePath: "/about",
    navLabel: "Why Choose PrettyVision",
    status: "active",
    websiteEnabled: true,
    sortOrder: 4,
    content: {
      eyebrow: "WHY CHOOSE PRETTYVISION",
      heading: "MORE THAN AN OPTICAL STORE",
      subtitle: "A trusted destination for better vision and better eyewear.",
      image: "/about_why_eyewear.jpg",
      imageAlt: "Crafted Tortoiseshell Eyewear Frame",
      features: [
        {
          id: "feat_1",
          icon: "Award",
          title: "33+ YEARS OF TRUST",
          description: "Serving customers since 1993 with decades of optical and eyewear experience."
        },
        {
          id: "feat_2",
          icon: "Users",
          title: "10,000+ HAPPY CUSTOMERS",
          description: "Trusted by thousands of customers looking for dependable eyewear and professional optical care."
        },
        {
          id: "feat_3",
          icon: "Glasses",
          title: "PERSONALIZED FITTING",
          description: "Frames are selected and adjusted according to your prescription, face shape, comfort and lifestyle."
        },
        {
          id: "feat_4",
          icon: "Sparkles",
          title: "PREMIUM EYEWEAR",
          description: "Explore carefully selected eyewear, sunglasses, lenses and contact lens solutions."
        }
      ]
    }
  },
  {
    sectionKey: "about_offerings",
    sectionName: "What We Offer (Services)",
    sectionTitle: "EVERYTHING YOU NEED FOR CLEARER VISION",
    sectionSubtitle: "WHAT WE OFFER",
    description: "Complete eye care and optical services to keep your vision clear and your eyewear comfortable.",
    routePath: "/services",
    navLabel: "What We Offer",
    status: "active",
    websiteEnabled: true,
    sortOrder: 5,
    content: {
      eyebrow: "WHAT WE OFFER",
      heading: "EVERYTHING YOU NEED FOR CLEARER VISION",
      supportingText: "Complete eye care and optical services to keep your vision clear and your eyes healthy.",
      buttonText: "View All Services",
      buttonUrl: "/services",
      cards: [
        {
          id: "card_1",
          title: "Eye Examination",
          description: "Professional eye testing and vision assessment to understand your visual needs.",
          image: "/service_exam.jpg",
          url: "/services/comprehensive-eye-examination"
        },
        {
          id: "card_2",
          title: "Prescription Eyewear",
          description: "Find frames and prescription lenses designed around your vision, comfort and lifestyle.",
          image: "/cat_optical_frames.jpg",
          url: "/services/prescription-eyewear"
        },
        {
          id: "card_3",
          title: "Sunglasses",
          description: "Stylish sunglasses for everyday wear, outdoor use and personal style.",
          image: "/cat_sunglasses.jpg",
          url: "/eyewear?category=Sunglasses"
        },
        {
          id: "card_4",
          title: "Contact Lenses",
          description: "Daily, monthly and specialized contact lens options with professional fitting guidance.",
          image: "/cat_contacts.jpg",
          url: "/services/contact-lens-fitting"
        },
        {
          id: "card_5",
          title: "Kids & Family Eye Care",
          description: "Eyewear and vision solutions for children, teenagers and the whole family.",
          image: "/service_kids.jpg",
          url: "/services/kids-and-family-eye-care"
        },
        {
          id: "card_6",
          title: "Lens & Coating Consultation",
          description: "Guidance on lens materials and coatings based on your lifestyle and prescription.",
          image: "/service_coating.jpg",
          url: "/services/lens-and-coating-consultation"
        }
      ]
    }
  },
  {
    sectionKey: "about_eyewear_banner",
    sectionName: "Curated Eyewear Banner",
    sectionTitle: "PREMIUM EYEWEAR.\nTIMELESS STYLE.",
    sectionSubtitle: "CURATED FOR YOUR STYLE",
    description: "From everyday optical frames to statement sunglasses, PrettyVision brings together thoughtfully selected eyewear.",
    routePath: "/eyewear",
    navLabel: "Curated Eyewear Banner",
    status: "active",
    websiteEnabled: true,
    sortOrder: 6,
    content: {
      eyebrow: "CURATED FOR YOUR STYLE",
      heading: "PREMIUM EYEWEAR.\nTIMELESS STYLE.",
      paragraph: "From everyday optical frames to statement sunglasses, PrettyVision brings together thoughtfully selected eyewear designed for different personalities, professions, lifestyles and occasions.",
      buttonText: "View All Collections",
      buttonUrl: "/eyewear",
      image: "/brand_sunglasses_feathered.png",
      categories: [
        { label: "Optical Frames", icon: "Glasses", url: "/eyewear?category=Optical+Frames" },
        { label: "Sunglasses", icon: "Sun", url: "/eyewear?category=Sunglasses" },
        { label: "Blue-Light Glasses", icon: "Monitor", url: "/eyewear?category=Blue-Light+Glasses" },
        { label: "Sports Eyewear", icon: "Activity", url: "/eyewear?category=Sports+Eyewear" },
        { label: "Kids Eyewear", icon: "Smile", url: "/eyewear?gender=Kids" },
        { label: "Contact Lenses", icon: "Eye", url: "/eyewear?category=Contact+Lenses" }
      ]
    }
  },
  {
    sectionKey: "about_experience",
    sectionName: "The PrettyVision Experience",
    sectionTitle: "MORE THAN A PAIR OF GLASSES",
    sectionSubtitle: "THE PRETTYVISION EXPERIENCE",
    description: "Four-step experience: Understand, Discover, Fit, Wear with Confidence.",
    routePath: "/about",
    navLabel: "The Experience",
    status: "active",
    websiteEnabled: true,
    sortOrder: 7,
    content: {
      eyebrow: "THE PRETTYVISION EXPERIENCE",
      heading: "MORE THAN A PAIR OF GLASSES",
      image: "/about_experience_exam.jpg",
      imageAlt: "Optometrist consultation and eye testing",
      steps: [
        {
          number: "01",
          title: "Understand",
          description: "We understand your vision requirements, lifestyle and personal preferences."
        },
        {
          number: "02",
          title: "Discover",
          description: "Explore frames, lenses and eyewear styles suited to your needs."
        },
        {
          number: "03",
          title: "Fit",
          description: "Accurate measurements, fitting and professional adjustments."
        },
        {
          number: "04",
          title: "Wear with Confidence",
          description: "Leave with eyewear designed around your vision, comfort and style."
        }
      ]
    }
  },
  {
    sectionKey: "about_store",
    sectionName: "Visit Our Store Section",
    sectionTitle: "PRETTYVISION KALINA",
    sectionSubtitle: "VISIT OUR STORE",
    description: "Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098",
    routePath: "/contact",
    navLabel: "Store Location",
    status: "active",
    websiteEnabled: true,
    sortOrder: 8,
    content: {
      eyebrow: "VISIT OUR STORE",
      storeName: "PRETTYVISION KALINA",
      address: "Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098",
      phone: "095940 30310",
      hours: "Monday – Saturday: 10:00 AM – 9:30 PM\nSunday: 11:00 AM – 8:00 PM",
      button1Text: "Get Directions",
      button1Url: "https://maps.google.com/?q=Pretty+Vision+Kalina+Mumbai",
      button2Text: "Call PrettyVision",
      button2Url: "tel:09594030310",
      image: "/store_exterior_ref.png",
      imageAlt: "PrettyVision Kalina Showroom Entrance",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.835948956972!2d72.8596646!3d19.0709405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e0a3f81e35%3A0xc3b09dc69fb4d23!2sPretty%20Vision!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
    }
  },
  {
    sectionKey: "about_testimonials",
    sectionName: "Customer Testimonials",
    sectionTitle: "LOVED BY FAMILIES",
    sectionSubtitle: "TRUSTED BY THOUSANDS",
    description: "10,000+ happy customers and counting.",
    routePath: "/about",
    navLabel: "Testimonials",
    status: "active",
    websiteEnabled: true,
    sortOrder: 9,
    content: {
      eyebrow: "TRUSTED BY THOUSANDS",
      heading: "LOVED BY FAMILIES",
      supportingText: "10,000+ happy customers and counting."
    }
  },
  {
    sectionKey: "about_faq",
    sectionName: "Frequently Asked Questions",
    sectionTitle: "FREQUENTLY ASKED QUESTIONS",
    sectionSubtitle: "FAQS",
    description: "Find answers to common questions about our optical store, services and eyewear.",
    routePath: "/about",
    navLabel: "FAQ Section",
    status: "active",
    websiteEnabled: true,
    sortOrder: 10,
    content: {
      heading: "FREQUENTLY ASKED QUESTIONS",
      subtitle: "Find answers to common questions about our optical store, services and eyewear.",
      faqs: [
        {
          q: "What services does PrettyVision offer?",
          a: "PrettyVision provides comprehensive computerized eye examinations, prescription eyeglasses, polarized & designer sunglasses, contact lens fittings, blue-light computer glasses, pediatric optical care, and precision frame repairs & adjustments."
        },
        {
          q: "Where is PrettyVision located?",
          a: "We are located at Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai 400098."
        },
        {
          q: "Does PrettyVision provide eye examinations?",
          a: "Yes. Our qualified optometrists conduct thorough computerized refraction and visual acuity tests using modern optometric instruments to guarantee pinpoint prescription accuracy."
        },
        {
          q: "Does PrettyVision sell prescription glasses?",
          a: "Yes, we stock hundreds of spectacle frames ranging from everyday lightweight titanium and acetate frames to designer luxury labels with single vision, bifocal, and progressive lenses."
        },
        {
          q: "Does PrettyVision sell sunglasses?",
          a: "Yes, we offer an extensive collection of 100% UV-protected and polarized sunglasses from iconic international brands including Ray-Ban, Oakley, Vogue, Armani, and Polaroid."
        },
        {
          q: "Does PrettyVision provide contact lenses?",
          a: "Yes, we supply daily disposable, monthly, toric, and multifocal contact lenses from leading manufacturers such as Acuvue, Bausch + Lomb, and Alcon, along with complete insertion & hygiene guidance."
        },
        {
          q: "Can I get my glasses fitted and adjusted?",
          a: "Absolutely. Every pair purchased is customized to your facial contours, including temple alignment, bridge height, and nose pad adjustments for maximum comfort."
        },
        {
          q: "Do you provide eyewear for children?",
          a: "Yes, we feature a dedicated kids' eyewear collection crafted with flexible, durable, non-toxic materials and impact-resistant polycarbonate lenses."
        },
        {
          q: "What types of lenses are available?",
          a: "We dispense advanced digital lenses, anti-reflective Crizal coatings, blue-light filtering lenses (Eyezen), Transitions photochromic lenses, and progressive designs customized for your prescription."
        },
        {
          q: "Why choose PrettyVision in Kalina, Mumbai?",
          a: "With 33+ years of trusted service since 1993, 10,000+ satisfied families, genuine certified brands, and qualified optometrists, PrettyVision is Kalina's premier optical destination."
        }
      ]
    }
  },
  {
    sectionKey: "about_final_cta",
    sectionName: "Final CTA Banner",
    sectionTitle: "YOUR VISION DESERVES BETTER.",
    sectionSubtitle: "VISIT PRETTYVISION",
    description: "Visit PrettyVision Kalina for professional eye care, premium eyewear, prescription glasses, sunglasses and contact lens solutions.",
    routePath: "/contact",
    navLabel: "Final CTA",
    status: "active",
    websiteEnabled: true,
    sortOrder: 11,
    content: {
      heading: "YOUR VISION DESERVES BETTER.",
      paragraph: "Visit PrettyVision Kalina for professional eye care, premium eyewear, prescription glasses, sunglasses and contact lens solutions.",
      button1Text: "Book an Eye Test",
      button1Url: "/contact",
      button2Text: "Visit Our Store",
      button2Url: "/contact",
      image: "/about_final_cta_glasses.jpg",
      imageAlt: "PrettyVision Designer Eyewear"
    }
  }
];

export const ABOUT_SECTIONS_UPDATED_EVENT = "pv_about_sections_updated";

export const notifyAboutSectionsUpdated = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(ABOUT_SECTIONS_UPDATED_EVENT));
  }
};

export const useAboutSections = () => {
  const [sections, setSections] = useState(DEFAULT_ABOUT_SECTIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSections = useCallback(async () => {
    try {
      const res = await apiFetch("/about-sections");
      const list = res.sections || res.items || [];
      if (Array.isArray(list) && list.length > 0) {
        setSections(list);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();

    const handleUpdate = () => {
      fetchSections();
    };

    window.addEventListener(ABOUT_SECTIONS_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(ABOUT_SECTIONS_UPDATED_EVENT, handleUpdate);
    };
  }, [fetchSections]);

  const isSectionActive = useCallback(
    (key) => {
      const sec = sections.find((s) => s.sectionKey === key);
      if (!sec) return true;
      return sec.websiteEnabled !== false && sec.status !== "inactive";
    },
    [sections]
  );

  const getSectionData = useCallback(
    (key) => {
      return sections.find((s) => s.sectionKey === key) || null;
    },
    [sections]
  );

  return {
    sections,
    loading,
    error,
    isSectionActive,
    getSectionData,
    refetch: fetchSections
  };
};
