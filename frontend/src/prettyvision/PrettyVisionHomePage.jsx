import React, { useState, useEffect } from "react";
import { apiFetch } from "../api";
import {
  TopBar,
  Navbar,
  HeroBanner,
  FeatureHighlights,
  CollectionsSection,
  CategorySection,
  BrandShowcase,
  BrandLogoStrip,
  ServicesSection,
  StoreSection,
  GallerySection,
  BlogSection,
  TestimonialsSection,
  OpticalGuideSection,
  FinalCTA,
  Footer,
  BookEyeTestModal
} from "./PrettyVisionComponents";

export const PrettyVisionHomePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookModalOpen, setBookModalOpen] = useState(false);

  const loadHomepageData = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/homepage");
      setData(res);
      setError(null);
    } catch (err) {
      console.warn("Error loading homepage data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomepageData();

    // Listen for real-time section updates from admin
    const handleUpdate = () => {
      loadHomepageData();
    };
    window.addEventListener("homepage-sections-updated", handleUpdate);
    return () => window.removeEventListener("homepage-sections-updated", handleUpdate);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-3 border-[#042041] border-t-transparent rounded-full animate-spin" />
        <p className="font-serif text-lg font-bold text-[#042041]">Loading PrettyVision...</p>
      </div>
    );
  }

  const {
    sections = [],
    banners = [],
    highlights = [],
    collections = [],
    categories = [],
    brands = [],
    services = [],
    store = {},
    gallery = [],
    blogs = [],
    testimonials = [],
    siteSettings = {},
    footerSettings = {},
    navigation = []
  } = data || {};

  const openBookModal = () => setBookModalOpen(true);
  const closeBookModal = () => setBookModalOpen(false);

  // Section Renderer Map
  const renderSection = (section) => {
    switch (section.sectionKey) {
      case "hero":
        return (
          <HeroBanner
            key={section.sectionKey}
            banners={banners}
            onBookClick={openBookModal}
            sectionData={section}
          />
        );
      case "feature_highlights":
        return (
          <FeatureHighlights
            key={section.sectionKey}
            items={highlights}
            sectionData={section}
          />
        );
      case "collections":
        return (
          <CollectionsSection
            key={section.sectionKey}
            collections={collections}
            sectionData={section}
          />
        );
      case "categories":
        return (
          <CategorySection
            key={section.sectionKey}
            categories={categories}
            sectionData={section}
          />
        );
      case "brand_showcase":
        return (
          <BrandShowcase
            key={section.sectionKey}
            sectionData={section}
            brands={brands}
          />
        );
      case "brand_strip":
        return (
          <BrandLogoStrip
            key={section.sectionKey}
            brands={brands}
            sectionData={section}
          />
        );
      case "services":
        return (
          <ServicesSection
            key={section.sectionKey}
            services={services}
            sectionData={section}
            onBookClick={openBookModal}
          />
        );
      case "store_visit":
        return (
          <StoreSection
            key={section.sectionKey}
            store={store}
            settings={siteSettings}
            onBookClick={openBookModal}
            sectionData={section}
          />
        );
      case "gallery":
        return (
          <GallerySection
            key={section.sectionKey}
            gallery={gallery}
            sectionData={section}
          />
        );
      case "blog":
        return (
          <BlogSection
            key={section.sectionKey}
            blogs={blogs}
            sectionData={section}
          />
        );
      case "testimonials":
        return (
          <TestimonialsSection
            key={section.sectionKey}
            testimonials={testimonials}
            sectionData={section}
          />
        );
      case "optical_guide":
        return (
          <OpticalGuideSection
            key={section.sectionKey}
            sectionData={section}
            onBookClick={openBookModal}
          />
        );
      case "final_cta":
        return (
          <FinalCTA
            key={section.sectionKey}
            sectionData={section}
            onBookClick={openBookModal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#042041] selection:text-white">
      {/* 1. Top Bar */}
      <TopBar settings={siteSettings} onBookClick={openBookModal} />

      {/* 2. Navbar */}
      <Navbar
        navigation={navigation}
        settings={siteSettings}
        onBookClick={openBookModal}
      />

      {/* 3. Dynamic Homepage Sections (Rendered in Admin-Configured Order) */}
      <main className="flex-1">
        {sections.map((section) => renderSection(section))}
      </main>

      {/* 4. Footer */}
      <Footer footerSettings={footerSettings} siteSettings={siteSettings} />

      {/* 5. Book Eye Test Interactive Modal */}
      <BookEyeTestModal isOpen={bookModalOpen} onClose={closeBookModal} />
    </div>
  );
};
