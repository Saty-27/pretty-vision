import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  Glasses,
  Gem,
  Disc,
  Users,
  Sparkles,
  Wrench,
  MapPin,
  Phone,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  Instagram,
  Facebook,
  Youtube,
  Clock,
  ExternalLink,
  Calendar,
  Menu,
  X,
  Check,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sun,
  Laptop,
  Activity,
  Heart,
  Plus,
  BookOpen,
  HelpCircle,
  CheckCircle2
} from "lucide-react";
import { assetUrl, apiFetch } from "../api";

export const DynamicIcon = ({ name = "", className = "h-5 w-5" }) => {
  const iconMap = {
    eye: Eye,
    glasses: Glasses,
    gem: Gem,
    disc: Disc,
    users: Users,
    sparkles: Sparkles,
    wrench: Wrench,
    mappin: MapPin,
    phone: Phone,
    sun: Sun,
    laptop: Laptop,
    activity: Activity,
    heart: Heart,
    shield: ShieldCheck,
    shieldcheck: ShieldCheck,
    clock: Clock,
    calendar: Calendar,
    star: Star,
    check: Check
  };
  const key = String(name || "").toLowerCase().replace(/[^a-z]/g, "");
  const IconComponent = iconMap[key] || Glasses;
  return <IconComponent className={className} />;
};

/* ============================================================
   1. TOP UTILITY BAR (FULL-WIDTH DARK NAVY)
   ============================================================ */
export const TopBar = ({ settings, onBookClick }) => {
  const site = settings || {};
  const locationText = site.topBarLocation || "Kalina, Mumbai";
  const phoneText = site.topBarPhone || "095940 30310";
  const ctaText = site.topBarCtaText || "Visit Store";
  const ctaUrl = site.topBarCtaUrl || "/contact";

  return (
    <div className="w-full bg-[#061D38] text-white/90 py-2.5 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 border-b border-white/10 transition-colors">
      <div className="w-full flex flex-wrap items-center justify-between gap-4">
        {/* Left: Location & Phone */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            to="/contact"
            className="flex items-center gap-2 hover:text-white transition-colors text-[13px] font-semibold tracking-wide"
          >
            <MapPin className="h-3.5 w-3.5 text-blue-300 shrink-0" />
            <span>{locationText}</span>
          </Link>
          <a
            href={`tel:${phoneText.replace(/[^0-9+]/g, "")}`}
            className="hidden sm:flex items-center gap-2 hover:text-white transition-colors text-[13px] font-semibold tracking-wide"
          >
            <Phone className="h-3.5 w-3.5 text-blue-300 shrink-0" />
            <span>{phoneText}</span>
          </a>
        </div>

        {/* Right: Phone (mobile) & Visit Store Pill */}
        <div className="flex items-center gap-4 ml-auto">
          <a
            href={`tel:${phoneText.replace(/[^0-9+]/g, "")}`}
            className="sm:hidden flex items-center gap-1.5 text-blue-200 text-xs font-semibold"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>{phoneText}</span>
          </a>

          {ctaUrl === "/contact" && onBookClick ? (
            <button
              onClick={onBookClick}
              className="inline-flex items-center justify-center gap-2 bg-[#0E3D73] hover:bg-[#134D8F] text-white border border-blue-400/40 px-5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer select-none whitespace-nowrap group"
            >
              <span className="leading-none">{ctaText}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <Link
              to={ctaUrl}
              className="inline-flex items-center justify-center gap-2 bg-[#0E3D73] hover:bg-[#134D8F] text-white border border-blue-400/40 px-5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-xs select-none whitespace-nowrap group"
            >
              <span className="leading-none">{ctaText}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   2. NAVBAR (FULL-WIDTH STICKY LUXURY HEADER)
   ============================================================ */
export const Navbar = ({ navigation = [], settings = {}, onBookClick }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoUrl = settings.logo || "/pv_logo.png";
  const primaryCta = navigation.find((item) => item.isCta) || {
    label: settings.primaryCtaText || "Book Eye Test",
    path: "/contact"
  };

  const defaultNavItems = [
    { label: "Home", path: "/" },
    {
      label: "Eyewear",
      path: "/eyewear",
      children: [
        { label: "Optical Frames", path: "/eyewear?category=Optical+Frames" },
        { label: "Sunglasses", path: "/eyewear?category=Sunglasses" },
        { label: "Blue-Light Glasses", path: "/eyewear?category=Blue-Light+Glasses" },
        { label: "Sports Eyewear", path: "/eyewear?category=Sports+Eyewear" },
        { label: "Contact Lenses", path: "/eyewear?category=Contact+Lenses" }
      ]
    },
    { label: "Services", path: "/services" },
    { label: "Brands", path: "/brands" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" }
  ];

  const menuItems =
    navigation.length > 0
      ? navigation.filter((item) => !item.isCta && item.isActive !== false)
      : defaultNavItems;

  const isItemActive = (path) => {
    if (!path) return false;
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path.split("?")[0]);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "shadow-md py-3 sm:py-3.5" : "py-4 sm:py-5 lg:py-5.5 border-b border-slate-100"
      }`}
    >
      <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="h-12 sm:h-14 lg:h-16 w-auto flex items-center">
              <img
                src={assetUrl(logoUrl)}
                alt={settings.siteName || "PrettyVision"}
                className="h-full w-auto object-contain transition-transform group-hover:scale-102"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/pv_logo.png";
                }}
              />
            </div>
          </Link>

          {/* Desktop Navigation Links — Bigger, Bolder, More Impactful */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3.5 2xl:gap-5">
            {menuItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const active = isItemActive(item.path);

              return (
                <div
                  key={item._id || item.label}
                  className="relative group py-2"
                  onMouseEnter={() => hasChildren && setDropdownOpen(item.label)}
                  onMouseLeave={() => hasChildren && setDropdownOpen(null)}
                >
                  {hasChildren ? (
                    <div
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[16px] xl:text-[17px] font-bold tracking-[0.01em] transition-all cursor-pointer ${
                        active
                          ? "text-[#06264A] bg-[#06264A]/6 font-extrabold"
                          : "text-slate-800 hover:text-[#06264A] hover:bg-slate-100/80"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 stroke-[2.3] transition-transform duration-200 ${
                          active ? "text-[#06264A]" : "text-slate-500"
                        } group-hover:rotate-180`}
                      />
                    </div>
                  ) : item.isExternal ? (
                    <a
                      href={item.path}
                      target={item.openInNewTab ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className={`inline-flex items-center px-3.5 py-2 rounded-full text-[16px] xl:text-[17px] font-bold tracking-[0.01em] transition-all relative ${
                        active
                          ? "text-[#06264A] bg-[#06264A]/6 font-extrabold"
                          : "text-slate-800 hover:text-[#06264A] hover:bg-slate-100/80"
                      }`}
                    >
                      <span>{item.label}</span>
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className={`inline-flex items-center px-3.5 py-2 rounded-full text-[16px] xl:text-[17px] font-bold tracking-[0.01em] transition-all relative ${
                        active
                          ? "text-[#06264A] bg-[#06264A]/6 font-extrabold"
                          : "text-slate-800 hover:text-[#06264A] hover:bg-slate-100/80"
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {hasChildren && dropdownOpen === item.label && (
                    <div className="absolute top-full left-0 pt-2.5 w-72 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      <div className="rounded-2xl bg-white p-3 shadow-2xl border border-slate-100 ring-1 ring-black/5 space-y-1">
                        {item.children.map((child) => {
                          const childActive =
                            location.pathname + location.search === child.path;
                          return (
                            <Link
                              key={child._id || child.label}
                              to={child.path}
                              onClick={() => setDropdownOpen(null)}
                              className={`flex items-center justify-between rounded-xl px-4 py-3 text-[14.5px] font-bold transition-all ${
                                childActive
                                  ? "bg-[#06264A] text-white shadow-xs"
                                  : "text-slate-800 hover:bg-[#F5F7FA] hover:text-[#06264A]"
                              }`}
                            >
                              <span>{child.label}</span>
                              <ChevronRight
                                className={`h-4 w-4 ${
                                  childActive ? "text-white" : "text-slate-400"
                                }`}
                              />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right: Primary Action Button — Prominent, Bold, Impactful */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={onBookClick}
              className="inline-flex items-center gap-2.5 rounded-full bg-[#06264A] hover:bg-[#0B3566] text-white px-8 py-3.5 text-[15px] sm:text-base font-bold tracking-wide shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              <span>{primaryCta.label || "Book Eye Test"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={onBookClick}
              className="sm:hidden px-4 py-2 rounded-full bg-[#06264A] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Book Test
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-50 transition cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu — Airy, Bold, Impactful */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-6 py-6 space-y-5 animate-in fade-in duration-200 shadow-2xl">
          <div className="flex flex-col space-y-2">
            {menuItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <div key={item._id || item.label} className="border-b border-slate-100 pb-3">
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block text-[18px] sm:text-[19px] font-bold py-2 ${
                      active ? "text-[#06264A] font-extrabold" : "text-slate-900 hover:text-[#06264A]"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={child.label}
                      to={child.path}
                      onClick={() => setMobileOpen(false)}
                      className="block text-[14.5px] font-semibold text-slate-600 pl-4 py-2 hover:text-[#06264A]"
                    >
                      • {child.label}
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                if (onBookClick) onBookClick();
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#06264A] text-white py-4 text-base font-bold shadow-md cursor-pointer"
            >
              <span>Book An Eye Test</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

/* ============================================================
   3. HERO BANNER (TRUE FULL-WIDTH CINEMATIC BANNER)
   ============================================================ */
export const HeroBanner = ({ banners = [], onBookClick, sectionData = {} }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const defaultBanner = {
    _id: "default-hero",
    eyebrow: "PREMIUM EYEWEAR",
    heading: "SEE BETTER. LOOK YOUR BEST.",
    description:
      "Expert eye care, premium eyewear and contact lenses all under one roof in Kalina, Mumbai.",
    button1Enabled: true,
    button1Text: "Book an Eye Test",
    button1Url: "/contact",
    button2Enabled: true,
    button2Text: "Explore Collections",
    button2Url: "/eyewear",
    desktopImage: "/uploads/hero_banner.jpg",
    mobileImage: "/uploads/hero_banner.jpg",
    locationText:
      "Shop No 11, Agarwal Building, opposite Nilesh Dryfruits, Kalina, Santacruz East, Mumbai 400098",
    textColor: "dark",
    overlayType: "light",
    isActive: true
  };

  const activeBanners =
    banners.length > 0 ? banners.filter((b) => b.isActive !== false) : [defaultBanner];
  const slideCount = activeBanners.length;

  useEffect(() => {
    if (slideCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 8000);
    return () => clearInterval(interval);
  }, [slideCount]);

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  return (
    <section className="relative w-full h-[76vh] min-h-[640px] xl:min-h-[760px] max-h-[920px] overflow-hidden bg-slate-900 border-b border-slate-200">
      {activeBanners.map((banner, index) => {
        const isCurrent = index === currentSlide;
        const eyebrow = banner.eyebrow || banner.eyebrowText;
        const heading = banner.heading || banner.title;
        const description = banner.description || banner.subtitle;
        const location = banner.locationText || banner.locationBadge;

        const showButton1 =
          banner.button1Enabled !== false && (banner.button1Text || banner.buttonText);
        const button1Text = banner.button1Text || banner.buttonText || "Book an Eye Test";
        const button1Url = banner.button1Url || banner.buttonLink || "/contact";

        const showButton2 =
          banner.button2Enabled !== false && (banner.button2Text || banner.button2Link);
        const button2Text = banner.button2Text || "Explore Collections";
        const button2Url = banner.button2Url || banner.button2Link || "/eyewear";

        const hasCopy = Boolean(
          eyebrow || heading || description || showButton1 || showButton2 || location
        );

        const desktopImg = banner.desktopImage || banner.image || "/uploads/hero_banner.jpg";
        const mobileImg = banner.mobileImage || desktopImg;

        return (
          <div
            key={banner._id || index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Picture with Responsive Desktop / Mobile images */}
            <picture className="absolute inset-0 w-full h-full">
              <source media="(max-width: 640px)" srcSet={assetUrl(mobileImg)} />
              <img
                src={assetUrl(desktopImg)}
                alt={heading || "PrettyVision Hero Banner"}
                className="w-full h-full object-cover object-center lg:object-[center_right]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/uploads/hero_banner.jpg";
                }}
              />
            </picture>

            {/* Ambient Watermark Script in top-right */}
            <div className="absolute top-10 sm:top-14 right-6 sm:right-12 lg:right-20 z-15 pointer-events-none hidden md:block">
              <span className="font-script text-white/70 text-3xl sm:text-4xl lg:text-5xl drop-shadow-md select-none">
                Clear Vision, Brighter Possibilities
              </span>
            </div>

            {/* Ambient Light/Dark Gradient Scrim */}
            {hasCopy && (
              <div
                className={`absolute inset-0 z-10 pointer-events-none ${
                  banner.textColor === "dark" || banner.overlayType === "light"
                    ? "bg-gradient-to-r from-white/95 via-white/85 to-transparent md:w-[65%] lg:w-[58%] xl:w-[52%]"
                    : "bg-gradient-to-r from-black/85 via-black/45 to-transparent md:w-[65%] lg:w-[58%] xl:w-[52%]"
                }`}
              />
            )}

            {/* Editorial Content Overlay */}
            {hasCopy && (
              <div className="w-full h-full relative z-20 flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pointer-events-none">
                <div className="max-w-3xl pointer-events-auto py-8">
                  {eyebrow && (
                    <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#08264A]/80 mb-3 sm:mb-4">
                      {eyebrow}
                    </p>
                  )}

                  {heading && (
                    <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] font-bold tracking-tight text-[#08264A] leading-[1.06] mb-5 sm:mb-6">
                      {heading}
                    </h1>
                  )}

                  {description && (
                    <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-slate-700 font-normal max-w-xl mb-7 sm:mb-8">
                      {description}
                    </p>
                  )}

                  {(showButton1 || showButton2) && (
                    <div className="flex flex-wrap items-center gap-3.5 mb-7 sm:mb-8">
                      {showButton1 && (
                        <button
                          onClick={() => {
                            if (button1Url === "/contact" && onBookClick) {
                              onBookClick();
                            } else {
                              window.location.href = button1Url;
                            }
                          }}
                          className="inline-flex items-center gap-2.5 rounded-full bg-[#08264A] hover:bg-[#0D315A] text-white px-8 py-4 text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-xl group"
                        >
                          <span>{button1Text}</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      )}

                      {showButton2 && (
                        <Link
                          to={button2Url}
                          className="inline-flex items-center gap-2.5 rounded-full border-2 border-[#08264A] bg-white/90 hover:bg-[#08264A] text-[#08264A] hover:text-white px-8 py-4 text-sm font-bold tracking-wide transition-all duration-300 shadow-xs"
                        >
                          <span>{button2Text}</span>
                        </Link>
                      )}
                    </div>
                  )}

                  {location && (
                    <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
                      <MapPin className="h-4 w-4 shrink-0 text-[#08264A] mt-0.5" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Carousel Prev / Next Controls (Only if slideCount > 1) */}
      {slideCount > 1 && (
        <div className="absolute bottom-8 right-6 sm:right-12 lg:right-20 z-30 flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-white/80 tracking-widest mr-2">
            0{currentSlide + 1} / 0{slideCount}
          </span>
          <button
            onClick={prevSlide}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-105 cursor-pointer"
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-105 cursor-pointer"
            aria-label="Next slide"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
};

/* ============================================================
   4. FEATURE STRIP (FULL-WIDTH TRUST ROW)
   ============================================================ */
export const FeatureHighlights = ({ items = [], sectionData = {} }) => {
  const defaultItems = [
    { icon: "Eye", title: "Expert Eye Care", subtitle: "by Qualified Optometrists", linkUrl: "/services" },
    { icon: "Gem", title: "Premium Brands", subtitle: "Global Eyewear Collection", linkUrl: "/brands" },
    { icon: "Glasses", title: "Personalized Fitting", subtitle: "Find Your Perfect Look", linkUrl: "/services" },
    { icon: "Disc", title: "Contact Lens Expertise", subtitle: "For Clearer Vision", linkUrl: "/services" }
  ];

  const list = items.length > 0 ? items : defaultItems;

  return (
    <section className="w-full bg-white border-b border-slate-200/80 py-7 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
        {list.map((item, idx) => (
          <Link
            key={item._id || item.title || idx}
            to={item.linkUrl || "/services"}
            className="flex items-center gap-4 px-4 sm:px-6 py-4 sm:py-2 group cursor-pointer transition-colors"
          >
            <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#08264A] group-hover:bg-[#08264A] group-hover:text-white transition-all shrink-0 shadow-2xs">
              <DynamicIcon name={item.icon} className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#08264A] transition-colors leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 font-normal mt-0.5 leading-normal">
                {item.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

/* ============================================================
   5. COLLECTIONS SECTION ("FRAMES FOR EVERY STYLE") - SQUARE CARDS
   ============================================================ */
export const CollectionsSection = ({ collections = [], sectionData = {} }) => {
  if (sectionData.homepageVisible === false || sectionData.status === "inactive") {
    return null;
  }

  const carouselRef = useRef(null);
  const title = sectionData.sectionTitle || "FRAMES FOR EVERY STYLE";
  const subtitle = sectionData.sectionSubtitle || "EXPLORE OUR COLLECTIONS";
  const viewAllText = sectionData.content?.viewAllText || "View All Collections";
  const viewAllLink = sectionData.content?.viewAllLink || "/eyewear";

  const defaultList = [
    {
      title: "Men's Eyewear",
      subtitle: "Modern. Sharp. Versatile.",
      image: "/square_card_1.png",
      fallback: "/col_clean_mens.jpg",
      destinationUrl: "/eyewear?gender=Men",
      buttonText: "Explore",
      hasEmbeddedText: true,
      theme: "dark"
    },
    {
      title: "Women's Eyewear",
      subtitle: "Elegant. Confident. Timeless.",
      image: "/square_card_2.png",
      fallback: "/col_clean_womens.jpg",
      destinationUrl: "/eyewear?gender=Women",
      buttonText: "Explore",
      hasEmbeddedText: true,
      theme: "light"
    },
    {
      title: "Kids Eyewear",
      subtitle: "Safe. Stylish. For Growing Eyes.",
      image: "/square_card_3.png",
      fallback: "/col_clean_kids.jpg",
      destinationUrl: "/eyewear?gender=Kids",
      buttonText: "Explore",
      hasEmbeddedText: true,
      theme: "light"
    },
    {
      title: "Sunglasses",
      subtitle: "Everyday to Iconic Styles.",
      image: "/square_card_4.png",
      fallback: "/col_clean_sunglasses.jpg",
      destinationUrl: "/eyewear?category=Sunglasses",
      buttonText: "Explore",
      hasEmbeddedText: true,
      theme: "light"
    },
    {
      title: "Contact Lenses",
      subtitle: "Clearer Vision. Greater Freedom.",
      image: "/square_card_5.png",
      fallback: "/col_clean_contact_lenses.jpg",
      destinationUrl: "/eyewear?category=Contact+Lenses",
      buttonText: "Explore",
      hasEmbeddedText: true,
      theme: "light"
    }
  ];

  const rawList = collections.length > 0 ? collections : defaultList;
  const list = rawList.filter((col) => col.isActive !== false);

  if (list.length === 0) return null;

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const amount = direction === "left" ? -340 : 340;
    carouselRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white py-16 lg:py-24 xl:py-28 border-b border-slate-100">
      <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8 sm:mb-12">
          <div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#08264A]/80 mb-2">
              {subtitle}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#08264A]">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to={viewAllLink}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#08264A] hover:text-[#0D315A] group"
            >
              <span>{viewAllText}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Previous collections"
                className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:border-[#08264A] hover:bg-[#08264A] hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Next collections"
                className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:border-[#08264A] hover:bg-[#08264A] hover:text-white transition cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Carousel / Grid */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory gap-4 lg:gap-5 xl:gap-6 pb-2"
        >
          {list.map((col, idx) => {
            const isDark = idx === 0 || col.theme === "dark" || col.title?.toLowerCase().includes("men");
            const hasPosterText = Boolean(
              col.hasEmbeddedText ||
              (col.image && (col.image.includes("square_card") || col.image.includes("poster") || col.image.includes("media_")))
            );
            const imgSrc = assetUrl(col.image || defaultList[idx]?.image);

            return (
              <div
                key={col._id || col.title || idx}
                className="snap-start shrink-0 w-[280px] sm:w-[300px] md:w-[320px] lg:w-[calc((100%-4*1.25rem)/5)] min-w-[260px]"
              >
                <Link
                  to={col.destinationUrl || "/eyewear"}
                  title={`${col.title} — ${col.subtitle || ""}`}
                  className="group relative rounded-[20px] sm:rounded-[24px] overflow-hidden aspect-square w-full bg-slate-100 border border-slate-200/90 shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-end p-5 sm:p-6 block"
                >
                  <img
                    src={imgSrc}
                    alt={col.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultList[idx]?.fallback || `/square_card_${idx + 1}.png`;
                    }}
                  />

                  {hasPosterText ? (
                    <>
                      <span className="sr-only">
                        {col.title} — {col.subtitle}. {col.buttonText || "Explore"} collection at PrettyVision Kalina Mumbai.
                      </span>
                      {/* Subtle interactive hover sheen */}
                      <div className="absolute inset-0 bg-[#08264A]/0 group-hover:bg-[#08264A]/10 transition-colors duration-300 pointer-events-none" />
                    </>
                  ) : (
                    <>
                      <div
                        className={`absolute inset-0 pointer-events-none transition-opacity group-hover:opacity-95 ${
                          isDark
                            ? "bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                            : "bg-gradient-to-tr from-white/95 via-white/60 to-transparent"
                        }`}
                      />
                      <div className="relative z-10 space-y-1">
                        <h3
                          className={`font-serif text-xl sm:text-2xl font-bold leading-tight ${
                            isDark ? "text-white" : "text-[#08264A]"
                          }`}
                        >
                          {col.title}
                        </h3>
                        {col.subtitle && (
                          <p
                            className={`text-xs sm:text-[13px] leading-snug line-clamp-2 ${
                              isDark ? "text-slate-200" : "text-[#08264A]/80 font-medium"
                            }`}
                          >
                            {col.subtitle}
                          </p>
                        )}
                        <div
                          className={`pt-2 flex items-center gap-1.5 text-xs sm:text-[13px] font-bold ${
                            isDark ? "text-white" : "text-[#08264A]"
                          }`}
                        >
                          <span>{col.buttonText || "Explore"}</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   6. CATEGORY SECTION ("SHOP BY TYPE / FIND WHAT SUITS YOU")
   Editorial luxury full-width 5-card layout matching reference
   ============================================================ */
export const CategorySection = ({ categories = [], sectionData = {} }) => {
  if (sectionData.homepageVisible === false || sectionData.status === "inactive") {
    return null;
  }

  const carouselRef = useRef(null);
  const title = sectionData.sectionTitle || "FIND WHAT SUITS YOU";
  const subtitle = sectionData.sectionSubtitle || "SHOP BY TYPE";
  const viewAllText = sectionData.content?.viewAllText || "View All Categories";
  const viewAllLink = sectionData.content?.viewAllLink || "/eyewear";

  const defaultList = [
    {
      _id: "cat-optical-frames",
      title: "Optical Frames",
      subtitle: "Classic. Modern. Timeless.",
      description: "Classic. Modern. Timeless.",
      image: "",
      icon: "Glasses",
      destinationUrl: "/eyewear?category=Optical+Frames",
      isActive: true
    },
    {
      _id: "cat-sunglasses",
      title: "Sunglasses",
      subtitle: "Everyday to Iconic Styles.",
      description: "Everyday to Iconic Styles.",
      image: "",
      icon: "Sun",
      destinationUrl: "/eyewear?category=Sunglasses",
      isActive: true
    },
    {
      _id: "cat-bluelight",
      title: "Blue-Light Glasses",
      subtitle: "Work. Study. Digital Comfort.",
      description: "Work. Study. Digital Comfort.",
      image: "",
      icon: "Laptop",
      destinationUrl: "/eyewear?category=Blue-Light+Glasses",
      isActive: true
    },
    {
      _id: "cat-sports",
      title: "Sports Eyewear",
      subtitle: "Active. Durable. Performance.",
      description: "Active. Durable. Performance.",
      image: "",
      icon: "Activity",
      destinationUrl: "/eyewear?category=Sports+Eyewear",
      isActive: true
    },
    {
      _id: "cat-contacts",
      title: "Contact Lenses",
      subtitle: "Daily. Monthly. Specialized.",
      description: "Daily. Monthly. Specialized.",
      image: "",
      icon: "Disc",
      destinationUrl: "/eyewear?category=Contact+Lenses",
      isActive: true
    }
  ];

  const rawList = categories && categories.length > 0 ? categories : defaultList;
  const list = rawList.filter((cat) => cat.isActive !== false);

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const amount = direction === "left" ? -380 : 380;
    carouselRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-[#F7F8FA] py-16 sm:py-20 lg:py-24 xl:py-28 border-b border-[#E1E6EC]">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20">
        {/* Section Header: Aligned horizontally on one row on desktop */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10 lg:mb-12">
          <div>
            <p className="text-xs sm:text-[13px] font-semibold uppercase tracking-[0.18em] text-[#687891] mb-2 sm:mb-3">
              {subtitle}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-[44px] lg:text-[50px] xl:text-[56px] font-semibold tracking-tight text-[#08294C] leading-[1.08]">
              {title}
            </h2>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-8">
            <Link
              to={viewAllLink}
              className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#08294C] hover:text-[#0D315A] transition-colors group shrink-0"
            >
              <span>{viewAllText}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Circular navigation controls (42px × 42px) */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Previous categories"
                className="w-[42px] h-[42px] rounded-full bg-white border border-[#CBD5E1] flex items-center justify-center text-[#08294C] hover:bg-[#08294C] hover:text-white hover:border-[#08294C] shadow-2xs transition-all duration-200 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Next categories"
                className="w-[42px] h-[42px] rounded-full bg-white border border-[#CBD5E1] flex items-center justify-center text-[#08294C] hover:bg-[#08294C] hover:text-white hover:border-[#08294C] shadow-2xs transition-all duration-200 cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Card Grid / Responsive Carousel */}
        <div
          ref={carouselRef}
          className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 xl:gap-6 overflow-x-auto md:overflow-visible scrollbar-none snap-x snap-mandatory pb-3 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0"
        >
          {list.map((cat, idx) => {
            const hasValidImage = Boolean(cat.image && typeof cat.image === "string" && cat.image.trim() !== "");
            const descriptionText = cat.subtitle || cat.description || defaultList[idx]?.subtitle || "";

            return (
              <Link
                key={cat._id || cat.slug || cat.title || cat.name || idx}
                to={cat.destinationUrl || `/eyewear?category=${encodeURIComponent(cat.slug || cat.name || cat.title)}`}
                className="group bg-white rounded-[16px] sm:rounded-[18px] border border-[#E1E6EC] shadow-[0_4px_18px_rgba(8,41,76,0.05)] hover:shadow-[0_8px_24px_rgba(8,41,76,0.09)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between w-[82vw] sm:w-[86vw] md:w-auto shrink-0 snap-center md:shrink block"
              >
                {/* Upper portion: Image or neutral #EEF1F4 placeholder */}
                <div className="w-full h-[185px] sm:h-[195px] lg:h-[200px] xl:h-[205px] bg-[#EEF1F4] relative overflow-hidden flex items-center justify-center">
                  {hasValidImage ? (
                    <img
                      src={assetUrl(cat.image)}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallbackElem = e.currentTarget.parentElement?.querySelector(".fallback-placeholder");
                        if (fallbackElem) fallbackElem.classList.remove("hidden");
                      }}
                    />
                  ) : null}

                  {/* Neutral Image Placeholder (#EEF1F4 with subtle inner gray tone) */}
                  <div
                    className={`fallback-placeholder absolute inset-0 bg-[#EEF1F4] flex items-center justify-center ${
                      hasValidImage ? "hidden" : ""
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/[0.015] to-black/[0.035] pointer-events-none" />
                    <div className="w-14 h-14 rounded-2xl bg-white/70 border border-[#DCE3EA]/80 flex items-center justify-center text-[#8696A8] shadow-2xs group-hover:scale-105 group-hover:bg-white transition-all duration-300">
                      <DynamicIcon name={cat.icon || defaultList[idx]?.icon || "Glasses"} className="w-7 h-7 text-[#6B7A90] stroke-[1.6]" />
                    </div>
                  </div>
                </div>

                {/* Card Content Area: 18px–22px padding, title, description, and circular arrow button */}
                <div className="p-5 sm:p-6 flex items-end justify-between gap-3 bg-white">
                  <div className="space-y-1 min-w-0 pr-1">
                    <h3 className="font-sans text-[19px] sm:text-[20px] lg:text-[21px] font-bold tracking-tight text-[#08294C] leading-snug truncate group-hover:text-[#0D315A] transition-colors">
                      {cat.title || cat.name}
                    </h3>
                    <p className="text-[14px] sm:text-[14.5px] font-normal sm:font-medium text-[#6B7A90] leading-snug line-clamp-1">
                      {descriptionText}
                    </p>
                  </div>

                  {/* Circular Arrow Button (36px × 36px) */}
                  <div
                    aria-label={`Explore ${cat.title || cat.name}`}
                    className="shrink-0 w-9 h-9 rounded-full bg-white border border-[#CBD5E1] text-[#08294C] flex items-center justify-center transition-all duration-200 group-hover:bg-[#08294C] group-hover:text-white group-hover:border-[#08294C] shadow-2xs"
                  >
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   7. BRAND SHOWCASE (SINGLE SHORT FULL-WIDTH PROMOTIONAL BANNER)
   Direct 1:1 match to Reference 1:
   - Single continuous deep navy promotional strip (#08294C)
   - Height: approx 190px–230px on desktop
   - Left: Eyebrow + OUR BRANDS serif + description + View All Brands button
   - Center/Right: Eyewear visual smoothly blended into navy background
   - Far Right: Ray-Ban script logo + FRESH STYLES / FRESH COLOURS + Explore Ray-Ban button
   - No separate bordered cards or giant empty areas
   ============================================================ */
export const BrandShowcase = ({ sectionData = {}, brands = [] }) => {
  if (sectionData.homepageVisible === false || sectionData.status === "inactive") {
    return null;
  }

  const content = sectionData.content || {};

  // General texts
  const heading = sectionData.sectionTitle || "OUR BRANDS";
  const eyebrow = sectionData.sectionSubtitle || "ICONIC BRANDS. TIMELESS STYLE.";
  const description =
    sectionData.description || "Explore premium global brands at Pretty Vision.";

  // Primary Button (Left)
  const button1Enabled = content.button1Enabled !== false;
  const button1Text = content.button1Text || "View All Brands";
  const button1Link = content.button1Link || "/brands";

  // Featured Brand (Right)
  const featuredEnabled = content.featuredEnabled !== false;
  const brandName = content.brandName || "Ray-Ban";
  const tagline = content.tagline || "FRESH STYLES. FRESH COLOURS.";
  const brandLogo = content.brandLogo || "/rayban_logo_white.png";
  const button2Text = content.button2Text || `Explore ${brandName}`;
  const button2Link =
    content.button2Link || `/brands/${brandName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

  // Visual Image Layer
  const desktopImage =
    content.desktopImage || content.image || "/brand_sunglasses_feathered.png";
  const mobileImage = content.mobileImage || desktopImage;
  const imagePosition = content.imagePosition || "center"; // "center" | "right" | "left"
  const imageFit = content.imageFit || "contain"; // "contain" | "cover"

  // Position alignment styling
  const positionClasses =
    imagePosition === "right"
      ? "md:translate-x-24 lg:translate-x-32"
      : imagePosition === "left"
      ? "md:-translate-x-12"
      : "md:translate-x-10 lg:translate-x-16";

  return (
    <section className="w-full bg-[#08294C] relative overflow-hidden min-h-[200px] md:h-[215px] lg:h-[225px] xl:h-[235px] flex items-center border-b border-[#05182F] select-none">
      {/* Visual Composition Layer: Eyewear image smoothly blended into navy strip */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Desktop Image Layer */}
        {desktopImage ? (
          <img
            src={assetUrl(desktopImage)}
            alt={brandName}
            className={`hidden md:block h-[125%] lg:h-[135%] xl:h-[145%] w-auto max-w-none ${
              imageFit === "cover" ? "object-cover" : "object-contain"
            } object-center ${positionClasses} transition-transform duration-700 pointer-events-none`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/brand_sunglasses_feathered.png";
            }}
          />
        ) : null}

        {/* Mobile Image Layer */}
        {mobileImage ? (
          <img
            src={assetUrl(mobileImage)}
            alt={brandName}
            className="md:hidden absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}

        {/* Seamless navy edge fades to guarantee 100% text readability */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[45%] bg-gradient-to-r from-[#08294C] via-[#08294C]/95 to-transparent pointer-events-none" />
        <div className="hidden md:block absolute inset-y-0 right-0 w-[28%] bg-gradient-to-l from-[#08294C] via-[#08294C]/85 to-transparent pointer-events-none" />
      </div>

      {/* Main Single Banner Content Container (Full Width with responsive gutters) */}
      <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10 py-7 md:py-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
          {/* LEFT BLOCK: Eyebrow + Heading + Description + Primary Button */}
          <div className="max-w-md space-y-1.5 md:space-y-2">
            {eyebrow && (
              <p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.18em] text-[#B7D0E8]">
                {eyebrow}
              </p>
            )}

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-semibold tracking-tight text-white leading-none">
              {heading}
            </h2>

            {description && (
              <p className="text-xs sm:text-[13.5px] text-white/80 leading-snug font-normal max-w-[280px] sm:max-w-xs pt-0.5 pb-1">
                {description}
              </p>
            )}

            {button1Enabled && (
              <div className="pt-1">
                <Link
                  to={button1Link}
                  className="inline-flex items-center gap-1.5 rounded-[5px] bg-white hover:bg-slate-100 text-[#08294C] px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-[13px] font-bold tracking-wide transition-all shadow-sm group"
                >
                  <span>{button1Text}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </div>

          {/* FAR RIGHT BLOCK: Featured Brand Logo / Tagline / Explore CTA */}
          {featuredEnabled && (
            <div className="flex flex-col items-start md:items-end text-left md:text-right space-y-1.5 shrink-0 z-10">
              {brandLogo ? (
                <img
                  src={assetUrl(brandLogo)}
                  alt={brandName}
                  className="h-7 sm:h-8 lg:h-9 w-auto object-contain brightness-0 invert opacity-95 mb-0.5"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="font-serif italic font-extrabold text-2xl sm:text-3xl text-white tracking-wide block">
                  {brandName}
                </span>
              )}

              {tagline && (
                <p className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wider text-white leading-tight">
                  {tagline.includes(".") ? (
                    <>
                      {tagline.split(".")[0].trim()}.
                      <br />
                      {tagline.split(".")[1]?.trim()}
                    </>
                  ) : (
                    tagline
                  )}
                </p>
              )}

              {button2Text && (
                <div className="pt-1">
                  <Link
                    to={button2Link}
                    className="inline-flex items-center gap-1.5 rounded-[5px] border border-white/50 hover:border-white text-white hover:bg-white/10 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold tracking-wide transition-all group"
                  >
                    <span>{button2Text}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   8. BRAND LOGO STRIP (FULL-WIDTH BRAND MARQUEE ROW)
   ============================================================ */
export const BrandLogoStrip = ({ brands = [] }) => {
  const brandNames =
    brands.length > 0
      ? brands.map((b) => b.name)
      : [
          "Ray-Ban",
          "Oakley",
          "Vogue Eyewear",
          "Emporio Armani",
          "Versace",
          "Tom Ford",
          "Essilor",
          "Polaroid"
        ];

  return (
    <section className="w-full bg-white border-b border-slate-200 py-7 sm:py-8 overflow-hidden">
      <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="flex items-center justify-between gap-8 overflow-x-auto no-scrollbar py-2">
          {brandNames.map((name, idx) => (
            <Link
              key={name + idx}
              to={`/brands/${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
              className="text-slate-800 hover:text-[#08264A] font-serif text-sm sm:text-base font-bold tracking-widest uppercase whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity px-3 py-1"
            >
              {name}
            </Link>
          ))}
          <Link
            to="/brands"
            className="w-9 h-9 rounded-full border border-slate-300 hover:border-[#08264A] hover:bg-[#08264A] hover:text-white flex items-center justify-center text-slate-700 shrink-0 transition-all"
            aria-label="View all brands"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   9. SERVICES SECTION ("COMPLETE EYE CARE / OUR SERVICES")
   ============================================================ */
export const ServicesSection = ({ services = [], sectionData = {}, onBookClick }) => {
  const title = sectionData.sectionTitle || "OUR SERVICES";
  const subtitle = sectionData.sectionSubtitle || "COMPLETE EYE CARE";
  const description =
    sectionData.description ||
    "Professional eye care and optical services to keep your vision clear and your eyes healthy.";

  const defaultList = [
    { title: "Comprehensive Eye Examination", shortDescription: "Detailed eye tests with advanced equipment.", image: "/service_exam.jpg", fallback: "/service_exam.jpg", slug: "comprehensive-eye-examination" },
    { title: "Prescription Eyewear", shortDescription: "Expert guidance to find the right frames and lenses.", image: "/service_prescription.jpg", fallback: "/service_prescription.jpg", slug: "prescription-eyewear" },
    { title: "Contact Lens Fitting", shortDescription: "Wide range of contact lenses and professional fitting.", image: "/service_fitting.jpg", fallback: "/service_fitting.jpg", slug: "contact-lens-fitting" },
    { title: "Kids & Family Eye Care", shortDescription: "Eye care for all ages, including children.", image: "/service_kids.jpg", fallback: "/service_kids.jpg", slug: "kids-and-family-eye-care" },
    { title: "Lens & Coating Consultation", shortDescription: "Guidance on the best lenses, coatings and solutions for your needs.", image: "/service_coating.jpg", fallback: "/service_coating.jpg", slug: "lens-and-coating-consultation" }
  ];

  const rawList = services.length > 0 ? services : defaultList;
  const list = rawList.slice(0, 5);

  return (
    <section className="w-full bg-white py-20 lg:py-28 xl:py-32 border-b border-slate-100">
      <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#08264A]/80 mb-2">
              {subtitle}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#08264A]">
              {title}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              {description}
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#08264A] hover:text-[#0D315A] shrink-0 group"
            >
              <span>View All Services</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* 5-Column Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 xl:gap-6">
          {list.map((srv, idx) => (
            <div
              key={srv._id || srv.title || idx}
              className="group bg-[#F6F8FA] rounded-[22px] overflow-hidden border border-[#DCE3EA] shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-[16/11] overflow-hidden bg-slate-100">
                <img
                  src={assetUrl(srv.image || defaultList[idx]?.image)}
                  alt={srv.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultList[idx]?.fallback || "/uploads/service_exam.jpg";
                  }}
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#08264A] group-hover:text-[#0D315A] transition-colors leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed">
                    {srv.shortDescription}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
                  <Link
                    to={`/services/${srv.slug || ""}`}
                    className="text-xs font-bold text-[#08264A] hover:text-[#0D315A] flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={onBookClick}
                    className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-[#08264A] text-slate-700 hover:text-white flex items-center justify-center transition-colors"
                    title="Book Appointment"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   10. STORE SECTION ("VISIT OUR STORE / PRETTY VISION KALINA")
   Exact 1:1 reproduction of Reference:
   - Unified 3-column architectural composition block
   - LEFT: Large Store Interior Image (~44%–48%)
   - CENTER: White Store Information Panel (~24%–28%)
   - RIGHT: Large Store Exterior Image (~26%–30%)
   - Connected columns with ZERO card gaps
   - Refined rectangular buttons with subtle rounded-[5px]
   ============================================================ */
export const StoreSection = ({ store = {}, sectionData = {}, settings = {}, onBookClick }) => {
  if (sectionData.homepageVisible === false || sectionData.status === "inactive") {
    return null;
  }

  const content = sectionData.content || {};
  const storeData = store || {};

  const eyebrow =
    sectionData.sectionSubtitle ||
    content.eyebrow ||
    storeData.eyebrow ||
    "VISIT OUR STORE";

  const name =
    sectionData.sectionTitle ||
    content.storeName ||
    storeData.name ||
    "PRETTY VISION KALINA";

  const address =
    content.address ||
    storeData.address ||
    settings.address ||
    "Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098";

  const phone =
    content.phone ||
    storeData.phone ||
    settings.phone ||
    "095940 30310";

  const hours =
    content.hours ||
    storeData.hours ||
    settings.businessHours ||
    "Monday – Saturday: 10:00 AM – 9:30 PM\nSunday: 11:00 AM – 8:00 PM";

  const directionsUrl =
    content.button1Link ||
    storeData.button1Url ||
    storeData.directionsUrl ||
    settings.googleMapsUrl ||
    "https://maps.google.com/?q=Pretty+Vision+Kalina+Mumbai";

  const button1Text =
    content.button1Text ||
    storeData.button1Text ||
    "Get Directions";

  const button2Text =
    content.button2Text ||
    storeData.button2Text ||
    phone;

  const phoneClean = phone.replace(/[^0-9+]/g, "");

  const button2Link =
    content.button2Link ||
    storeData.button2Url ||
    `tel:${phoneClean}`;

  const interiorImage =
    content.interiorImage ||
    storeData.interiorImage ||
    "/store_interior_ref.png";

  const exteriorImage =
    content.exteriorImage ||
    storeData.exteriorImage ||
    "/store_exterior_ref.png";

  return (
    <section className="w-full bg-[#F6F8FA] py-14 sm:py-18 lg:py-24 border-b border-[#E2E8F0]">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Unified 3-Column Architectural Composition */}
        <div className="w-full bg-white rounded-xl md:rounded-2xl border border-[#DCE3EA] shadow-[0_4px_24px_rgba(8,41,76,0.06)] overflow-hidden grid grid-cols-1 md:grid-cols-[1.3fr_0.8fr_0.9fr] lg:grid-cols-[1.35fr_0.75fr_1fr] items-stretch">
          {/* COLUMN 1 (LEFT): Large Store Interior Photo */}
          <div className="w-full min-h-[280px] md:min-h-full h-full relative bg-[#EEF1F4] border-b md:border-b-0 md:border-r border-[#E2E8F0] overflow-hidden">
            {interiorImage ? (
              <img
                src={assetUrl(interiorImage)}
                alt={`${name} Showroom Interior`}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-102"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const ph = e.currentTarget.nextElementSibling;
                  if (ph) ph.style.display = "block";
                }}
              />
            ) : null}
            <div
              className={`w-full h-full bg-[#EEF1F4] ${
                interiorImage ? "hidden" : "block"
              }`}
            />
          </div>

          {/* COLUMN 2 (CENTER): Store Information Area */}
          <div className="bg-white p-6 sm:p-7 md:p-6 lg:p-8 xl:p-10 flex flex-col justify-between">
            <div className="space-y-4 sm:space-y-5">
              <div>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B] mb-1 sm:mb-2">
                  {eyebrow}
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-semibold tracking-tight text-[#08264A] leading-[1.08]">
                  {name.includes(" ") ? (
                    <>
                      {name.split(" ").slice(0, -1).join(" ")}
                      <br />
                      {name.split(" ").slice(-1)}
                    </>
                  ) : (
                    name
                  )}
                </h2>
              </div>

              {/* Thin divider under heading */}
              <div className="w-full border-b border-slate-200/80" />

              {/* Store Details: Address, Phone, Hours */}
              <div className="space-y-3 sm:space-y-3.5 text-xs sm:text-[13px] text-[#1E293B]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#08264A] shrink-0 mt-0.5 fill-[#08264A]/10" />
                  <span className="leading-relaxed font-medium">{address}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#08264A] shrink-0 fill-[#08264A]/10" />
                  <a
                    href={`tel:${phoneClean}`}
                    className="font-semibold text-[#08264A] hover:underline"
                  >
                    {phone}
                  </a>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#08264A] shrink-0 mt-0.5 fill-[#08264A]/10" />
                  <span className="leading-relaxed text-slate-600 whitespace-pre-line font-normal">
                    {hours}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Get Directions & Call */}
            <div className="pt-6 sm:pt-7 flex flex-col sm:flex-row gap-2.5">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-[5px] bg-[#08264A] hover:bg-[#0D315A] text-white py-2.5 sm:py-3 px-4 text-xs sm:text-[13px] font-bold tracking-wide transition-all shadow-sm"
              >
                <span>{button1Text}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={button2Link}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-[5px] bg-white border border-[#CBD5E1] hover:bg-slate-50 text-[#08264A] py-2.5 sm:py-3 px-4 text-xs sm:text-[13px] font-bold tracking-wide transition-all shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-[#08264A]" />
                <span className="truncate">{button2Text}</span>
              </a>
            </div>
          </div>

          {/* COLUMN 3 (RIGHT): Large Store Exterior Photo */}
          <div className="w-full min-h-[260px] md:min-h-full h-full relative bg-[#EEF1F4] border-t md:border-t-0 md:border-l border-[#E2E8F0] overflow-hidden">
            {exteriorImage ? (
              <img
                src={assetUrl(exteriorImage)}
                alt={`${name} Storefront Exterior`}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-102"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const ph = e.currentTarget.nextElementSibling;
                  if (ph) ph.style.display = "block";
                }}
              />
            ) : null}
            <div
              className={`w-full h-full bg-[#EEF1F4] ${
                exteriorImage ? "hidden" : "block"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   11. INSTAGRAM GALLERY ("FOLLOW PRETTYVISION @prettyvision_kalina")
   ============================================================ */
export const GallerySection = ({ gallery = [], sectionData = {} }) => {
  if (sectionData.homepageVisible === false || sectionData.status === "inactive") {
    return null;
  }

  const galleryRef = useRef(null);
  const title = sectionData.sectionTitle || "FOLLOW PRETTYVISION";
  const subtitle = sectionData.sectionSubtitle || "@prettyvision_kalina";
  const content = sectionData.content || {};
  const instagramUrl = content.instagramUrl || "https://instagram.com/prettyvision_kalina";
  const viewAllText = content.viewAllText || "View on Instagram";
  const viewAllLink = content.viewAllLink || instagramUrl;

  const defaultImages = [
    { image: "/gallery_1.jpg", fallback: "/gallery_1.jpg", title: "Classic Elegance" },
    { image: "/gallery_2.jpg", fallback: "/gallery_2.jpg", title: "Iconic Shades" },
    { image: "/gallery_3.jpg", fallback: "/gallery_3.jpg", title: "Summer Tones" },
    { image: "/gallery_4.jpg", fallback: "/gallery_4.jpg", title: "New Arrivals" },
    { image: "/gallery_5.jpg", fallback: "/gallery_5.jpg", title: "Work & Study" },
    { image: "/gallery_6.jpg", fallback: "/gallery_6.jpg", title: "Tortoiseshell Craft" },
    { image: "/gallery_7.jpg", fallback: "/gallery_7.jpg", title: "Urban Aviators" },
    { image: "/gallery_8.jpg", fallback: "/gallery_8.jpg", title: "Contact Lens Comfort" }
  ];

  const rawList = gallery.length > 0 ? gallery : defaultImages;
  const list = rawList.filter((item) => item.isActive !== false);

  if (list.length === 0) return null;

  const scroll = (direction) => {
    if (!galleryRef.current) return;
    const amount = direction === "left" ? -300 : 300;
    galleryRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white py-20 lg:py-26 border-b border-slate-200">
      <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#08264A]">
                {title}
              </h2>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-[#08264A] hover:underline tracking-wide inline-flex items-center gap-1.5 mt-1"
              >
                <Instagram className="h-4 w-4" />
                <span>{subtitle}</span>
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={viewAllLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#08264A] hover:text-[#0D315A] group"
            >
              <span>{viewAllText}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Previous gallery images"
                className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:border-[#08264A] hover:bg-[#08264A] hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Next gallery images"
                className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:border-[#08264A] hover:bg-[#08264A] hover:text-white transition cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Continuous Square Tiles Across Desktop (Scrollable on overflow) */}
        <div
          ref={galleryRef}
          className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory gap-3.5 sm:gap-4 pb-2"
        >
          {list.map((item, idx) => (
            <div
              key={item._id || idx}
              className="snap-start shrink-0 w-[140px] sm:w-[170px] md:w-[185px] lg:w-[calc((100%-7*1rem)/8)] min-w-[130px]"
            >
              <a
                href={item.instagramUrl || instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden aspect-square bg-slate-100 shadow-2xs hover:shadow-xl transition-all duration-300 block"
              >
                <img
                  src={assetUrl(item.image || defaultImages[idx]?.image)}
                  alt={item.title || "PrettyVision Gallery"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImages[idx]?.fallback || "/uploads/gallery_1.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Instagram className="h-7 w-7 drop-shadow-md" />
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   12. BLOG SECTION ("LATEST FROM PRETTYVISION")
   ============================================================ */
export const BlogSection = ({ blogs = [], sectionData = {} }) => {
  const title = sectionData.sectionTitle || "LATEST FROM PRETTYVISION";
  const subtitle = sectionData.sectionSubtitle || "EYE HEALTH & STYLE";

  const defaultBlogs = [
    {
      title: "How Often Should You Get Your Eyes Tested? An Optometrist's Guide",
      category: "Eye Care",
      shortDescription:
        "Regular eye exams detect vision changes and health conditions early. Here is what our Kalina clinic recommends for every age group.",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=85",
      slug: "how-often-should-you-get-your-eyes-tested"
    },
    {
      title: "How to Choose the Right Frame for Your Face Shape",
      category: "Style Guide",
      shortDescription:
        "From round and oval to square and heart-shaped faces, discover the flattering eyewear designs that complement your unique features.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
      slug: "how-to-choose-the-right-frame-for-your-face-shape"
    },
    {
      title: "Digital Eye Strain: Blue-Light Blocking Lenses for Screen Time",
      category: "Technology",
      shortDescription:
        "Spending long hours on laptops and phones? Learn how anti-glare and blue-cut coatings reduce eye fatigue and improve sleep.",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=85",
      slug: "digital-eye-strain-blue-light-blocking-lenses"
    }
  ];

  const list = blogs && blogs.length > 0 ? blogs : defaultBlogs;

  return (
    <section className="w-full bg-[#F6F8FA] py-20 lg:py-28 xl:py-32 border-b border-slate-200">
      <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10 sm:mb-14">
          <div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#08264A]/80 mb-2">
              {subtitle}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#08264A]">
              {title}
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#08264A] hover:text-[#0D315A] group"
          >
            <span>View All Articles</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {list.slice(0, 3).map((post, idx) => (
            <article
              key={post._id || post.slug || idx}
              className="bg-white rounded-[24px] overflow-hidden border border-[#DCE3EA] shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={assetUrl(post.image || post.featuredImage || defaultBlogs[idx]?.image)}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/uploads/service_exam.jpg";
                  }}
                />
              </div>
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-[#08264A]">
                    {post.category || "Eye Care"}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#08264A] group-hover:text-[#0D315A] transition-colors leading-snug">
                    <Link to={`/blog/${post.slug || ""}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed">
                    {post.shortDescription || post.excerpt}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/blog/${post.slug || ""}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#08264A] group-hover:underline"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   13. TESTIMONIALS SECTION ("WHAT OUR CUSTOMERS SAY")
   ============================================================ */
export const TestimonialsSection = ({ testimonials = [], sectionData = {} }) => {
  const title = sectionData.sectionTitle || "What Our Customers Say";
  const subtitle =
    sectionData.description || "Trusted by our community for quality eyewear and expert care.";

  const defaultReviews = [
    {
      name: "Rohit Mehta",
      testimonialText:
        "Excellent collection and very helpful staff. Got my new Ray-Ban here and the experience was amazing!",
      rating: 5,
      designation: "Verified Customer • Kalina, Mumbai"
    },
    {
      name: "Priya Shah",
      testimonialText:
        "Great service and professional eye testing. Highly recommend Pretty Vision for genuine brands!",
      rating: 5,
      designation: "Verified Customer • Santacruz, Mumbai"
    },
    {
      name: "Amit Desai",
      testimonialText:
        "Wide range of frames and contact lenses. Very friendly staff and expert guidance.",
      rating: 5,
      designation: "Verified Customer • BKC, Mumbai"
    }
  ];

  const list = testimonials.length > 0 ? testimonials : defaultReviews;

  return (
    <section className="w-full bg-white py-20 lg:py-28 xl:py-32 border-b border-slate-200">
      <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12 sm:mb-16">
          <div className="lg:col-span-5 space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#08264A]">
              {title}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-md">
              {subtitle}
            </p>
          </div>
          <div className="lg:col-span-7 flex items-center gap-2 lg:justify-end">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-800 ml-2">
              4.9/5 Rating from 300+ Google Reviews
            </span>
          </div>
        </div>

        {/* 3 Large Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {list.map((review, idx) => (
            <div
              key={review._id || idx}
              className="bg-[#F6F8FA] rounded-[24px] p-8 border border-[#DCE3EA] shadow-2xs hover:shadow-lg transition-shadow flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-700 italic font-serif leading-relaxed">
                  "{review.testimonialText || review.quote}"
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {review.name || review.userName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{review.designation}</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   13B. COMPREHENSIVE CLINICAL EYECARE & OPTICAL SEO GUIDE SECTION (1500+ WORDS)
   ============================================================ */
export const OpticalGuideSection = ({ sectionData = {}, onBookClick }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const title = sectionData.sectionTitle || "THE DEFINITIVE EYECARE & LUXURY EYEWEAR GUIDE";
  const subtitle = sectionData.sectionSubtitle || "OPTOMETRY EXCELLENCE IN KALINA, MUMBAI";

  const chapters = [
    { id: "all", label: "Overview & Index" },
    { id: "eye-exam", label: "14-Step Clinical Exam" },
    { id: "mens-eyewear", label: "Men's Architectural Frames" },
    { id: "womens-eyewear", label: "Women's Haute Aesthetics" },
    { id: "pediatric-care", label: "Pediatric & Myopia Control" },
    { id: "sunglasses", label: "UV400 & Polarized Optics" },
    { id: "contact-lenses", label: "Contact Lens Clinic" },
    { id: "lenses-coatings", label: "Progressive & Blue-Cut Lenses" },
    { id: "store-location", label: "Kalina Store & Access" },
    { id: "faqs", label: "Frequently Asked Questions" }
  ];

  const faqs = [
    {
      q: "How often should I undergo a comprehensive clinical eye examination?",
      a: "Adults between the ages of 18 and 60 should have a comprehensive eye examination at least once every 12 to 18 months, even if they experience no noticeable vision degradation. For individuals experiencing digital eye strain, those with high myopia, diabetic patients, or adults over 40 noticing reading difficulty (presbyopia), annual checks are strongly advised. Children should be screened annually to prevent undetected refractive errors that impair classroom performance and accelerate childhood myopia progression."
    },
    {
      q: "What makes PrettyVision's 14-step clinical eye exam superior to ordinary autorefractor checks?",
      a: "An autorefractor measures only an initial baseline estimate of refractive error. PrettyVision's certified optometrists conduct a 14-step clinical examination encompassing high-contrast digital visual acuity testing (Snellen & logMAR), manual cross-cylinder astigmatic refinement, digital keratometry for corneal topography, binocular motility and stereopsis testing, non-contact tonometry for intraocular pressure screening (glaucoma risk), slit-lamp biomicroscopy of anterior ocular tissues, tear-film breakup time (TBUT), and fundus retinal integrity evaluation. This comprehensive methodology uncovers underlying ocular fatigue, dry eye syndrome, and early systemic anomalies."
    },
    {
      q: "Which eyewear frame material is best for daily wear: Italian acetate, pure titanium, or TR90?",
      a: "The ideal frame material depends on your prescription strength, facial anatomy, and lifestyle. Italian cellulose acetate (such as Mazzucchelli block acetate) offers rich depth of color, substantial tactile weight, and the ability to be custom heat-molded to your temple contours. Aerospace pure titanium and beta-titanium memory alloys provide featherlight durability (often weighing less than 12 grams), hypoallergenic skin contact, and superior corrosion resistance against Mumbai's coastal humidity. TR90 memory polymers deliver extreme flexural resilience and impact resistance, making them ideal for sports and pediatric eyewear."
    },
    {
      q: "How do digital freeform progressive lenses differ from traditional bifocal lenses?",
      a: "Traditional bifocal lenses feature an abrupt, visible dividing line that causes an unsettling 'image jump' between distance and near vision, offering zero intermediate correction for computer screens. Digital freeform progressive lenses utilize computer-guided point-by-point back-surface diamond surfacing to blend distance vision (driving and walking), intermediate vision (desktop monitors, dashboards, laptops), and reading vision into one continuous optical corridor. Advanced personalized corridors eliminate peripheral swim and distortion, ensuring effortless natural gaze transitions."
    },
    {
      q: "Do blue-light filter lenses really reduce digital eye strain and headache frequency?",
      a: "Yes. Modern electronic displays emit high-energy visible (HEV) blue-violet light in the 415nm to 455nm wavelength band, which scatters easily inside the eye, reduces contrast sensitivity, and causes ciliary muscle spasm, dry eyes, and circadian melatonin suppression. PrettyVision's certified blue-cut lenses incorporate molecular monomer filtration combined with broadband anti-reflective (AR) coatings that selectively absorb harmful HEV light while allowing beneficial blue-turquoise light (essential for mood and alertness) to pass through, significantly minimizing digital fatigue during prolonged screen use."
    },
    {
      q: "Can I wear contact lenses if I have high astigmatism or require reading glasses?",
      a: "Absolutely. Advancements in contact lens engineering have made both high astigmatism and presbyopia effortlessly correctable. Toric contact lenses feature customized cylindrical powers and dynamic ballast stabilization zones that prevent lens rotation on the cornea during blinking. For presbyopic adults over 40, concentric multifocal silicone hydrogel lenses provide distinct optical zones for clear distance, computer, and smartphone viewing simultaneously without the need for reading spectacles."
    },
    {
      q: "How do polarized sunglasses protect eyes better than regular dark tinted lenses?",
      a: "Standard dark tinted sunglasses merely reduce overall luminous transmittance; they do not eliminate polarized horizontal glare. When Mumbai sunlight reflects off flat surfaces like wet roadways, car hoods, or the Arabian Sea, it becomes horizontally polarized, creating intense blinding glare that obscures contrast and strains the visual cortex. PrettyVision's polarized sunglasses incorporate an internal micro-crystalline polarizing filter that selectively blocks 99.9% of blinding horizontal reflections while transmitting useful vertical light, delivering rich contrast, accurate color fidelity, and certified UV400 retinal defense."
    },
    {
      q: "Where is PrettyVision located in Mumbai, and do I need an advance appointment?",
      a: "PrettyVision is conveniently situated at Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai 400098. While walk-in consultations and frame try-ons are always welcome during our opening hours (Monday to Saturday: 10:00 AM – 9:30 PM, Sunday: 11:00 AM – 8:00 PM), scheduling an advance appointment ensures dedicated one-on-one consultation time with our senior optometrist for comprehensive clinical refractions and contact lens fittings."
    }
  ];

  // Schema.org structured data for SEO rich snippets
  const schemaOrgData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Optician",
        "@id": "https://prettyvision.in/#optician",
        "name": "PrettyVision",
        "image": "https://prettyvision.in/uploads/pv_logo.png",
        "telephone": "+919594030310",
        "email": "prettyvisionkalina@gmail.com",
        "url": "https://prettyvision.in",
        "priceRange": "₹₹ - ₹₹₹₹",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina",
          "addressLocality": "Santacruz East, Mumbai",
          "addressRegion": "Maharashtra",
          "postalCode": "400098",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "19.0709405",
          "longitude": "72.8596646"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "10:00",
            "closes": "21:30"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "11:00",
            "closes": "20:00"
          }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "PrettyVision Optical & Clinical Services",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Comprehensive Clinical Eye Examination" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Prescription Designer Eyewear Dispensing" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Contact Lens Fitting & Dry Eye Clinic" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pediatric Myopia Management Eyewear" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "UV400 Polarized Prescription Sunglasses" } }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://prettyvision.in/#faq",
        "mainEntity": faqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }
    ]
  };

  return (
    <section id="eyecare-guide" className="w-full bg-[#FAFBFD] py-20 lg:py-28 xl:py-32 border-b border-slate-200">
      {/* Inject Structured Data for Googlebot / Search Engine Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgData) }}
      />

      <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08264A]/5 border border-[#08264A]/15 text-[#08264A] text-xs font-bold uppercase tracking-[0.2em]">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{subtitle}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#08264A] leading-[1.15]">
            {title}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-light">
            An authoritative clinical and stylistic compendium for discerning individuals in Mumbai. Explore everything you need to know about precision visual acuity refractions, anatomical frame engineering, high-index ophthalmic coatings, and specialized contact lens fittings at PrettyVision Kalina, Santacruz East.
          </p>
        </div>

        {/* Chapter Tabs / Quick Navigator */}
        <div className="w-full overflow-x-auto pb-4 mb-10 no-scrollbar">
          <div className="flex items-center justify-start lg:justify-center gap-2 min-w-max px-2">
            {chapters.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  setActiveTab(ch.id);
                  if (!isExpanded) setIsExpanded(true);
                }}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === ch.id
                    ? "bg-[#08264A] text-white shadow-md shadow-[#08264A]/20 scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-100 hover:text-[#08264A] border border-slate-200"
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clinical Badges / Key Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm text-center">
            <span className="block font-serif text-3xl sm:text-4xl font-bold text-[#08264A]">14-Step</span>
            <span className="text-xs sm:text-sm font-medium text-slate-600 mt-1 block">Clinical Eye Examination</span>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm text-center">
            <span className="block font-serif text-3xl sm:text-4xl font-bold text-[#08264A]">100%</span>
            <span className="text-xs sm:text-sm font-medium text-slate-600 mt-1 block">UV400 Certified Defense</span>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm text-center">
            <span className="block font-serif text-3xl sm:text-4xl font-bold text-[#08264A]">1.74 Ultra</span>
            <span className="text-xs sm:text-sm font-medium text-slate-600 mt-1 block">High-Index Thin Lenses</span>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm text-center">
            <span className="block font-serif text-3xl sm:text-4xl font-bold text-[#08264A]">Mazzucchelli</span>
            <span className="text-xs sm:text-sm font-medium text-slate-600 mt-1 block">Handcrafted Italian Acetates</span>
          </div>
        </div>

        {/* Editorial Guide Content Container */}
        <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6 sm:p-10 lg:p-14 transition-all duration-500">
          {/* Chapter 1: 14-Step Exam */}
          {(activeTab === "all" || activeTab === "eye-exam") && (
            <article className="mb-14 pb-12 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#08264A]/70 mb-2">
                <span>Chapter 01</span>
                <span>•</span>
                <span>Preventive Diagnostics</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#08264A] mb-5">
                The Comprehensive 14-Step Clinical Eye Examination in Kalina, Mumbai
              </h3>
              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                <p>
                  At PrettyVision, our clinical optometry practice is founded upon the principle that exceptional visual clarity cannot exist without comprehensive ocular health. Located in the heart of Kalina, Santacruz East—surrounded by the high-density academic and commercial corridors of Mumbai University Vidya Nagari and the Bandra-Kurla Complex (BKC)—our clinic diagnoses and treats complex refractive errors, digital asthenopia, and subtle ocular pathologies using a structured 14-step diagnostic protocol.
                </p>
                <p>
                  A typical optical dispensary frequently relies solely upon an automated autorefractor printout, completing a cursory prescription evaluation in less than three minutes. Such automated readings, while useful as preliminary approximations, fail to account for instrumental accommodation, fluctuating ciliary muscle tone, and binocular alignment deficiencies. At PrettyVision, our qualified optometrists conduct an exhaustive, patient-centered examination that integrates:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs sm:text-sm">
                    <strong className="text-[#08264A] block mb-1">1. High-Contrast LogMAR & Snellen Visual Acuity</strong>
                    Calibrated digital letter charts testing monocular and binocular distance resolution under controlled ambient lux levels.
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs sm:text-sm">
                    <strong className="text-[#08264A] block mb-1">2. Wavefront Computerized Autorefraction</strong>
                    Multi-point corneal mapping capturing spherical, cylindrical, and high-order ocular optical aberrations.
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs sm:text-sm">
                    <strong className="text-[#08264A] block mb-1">3. Manual Jackson Cross-Cylinder Refinement</strong>
                    Pinpoint verification of astigmatic power and exact meridian axis down to single-degree increments to prevent headache-inducing axis tilt.
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs sm:text-sm">
                    <strong className="text-[#08264A] block mb-1">4. Digital Keratometry & Corneal Topography</strong>
                    Measurement of anterior corneal curvature radii in horizontal and vertical meridians, essential for toric contact lens stabilization.
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs sm:text-sm">
                    <strong className="text-[#08264A] block mb-1">5. Non-Contact Tonometry (NCT Intraocular Pressure)</strong>
                    Painless micro-air-puff measurement of intraocular fluid tension to screen for early, asymptomatic glaucoma risks.
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs sm:text-sm">
                    <strong className="text-[#08264A] block mb-1">6. Slit-Lamp Biomicroscopy Inspection</strong>
                    High-magnification stereoscopic evaluation of the cornea, conjunctival vasculature, crystalline lens transparency, and tear meniscus.
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs sm:text-sm">
                    <strong className="text-[#08264A] block mb-1">7. Tear-Film Breakup Time (TBUT Dry Eye Screening)</strong>
                    Quantifying tear-layer evaporation stability, critical for IT professionals and corporate executives facing extensive screen-time.
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs sm:text-sm">
                    <strong className="text-[#08264A] block mb-1">8. Binocular Motility & Stereopsis Assessment</strong>
                    Testing extraocular muscle synchrony, depth perception, convergence limits, and near accommodation reserve.
                  </div>
                </div>
                <p>
                  By synthesizing clinical refraction with ocular pathology screening, PrettyVision ensures that your prescription spectacles or contact lenses do not merely offer 20/20 clarity on an eye chart—they alleviate persistent cervical tension, eliminate evening digital eye strain, and provide effortless, fatigue-free visual endurance throughout your workday.
                </p>
              </div>
            </article>
          )}

          {/* Chapter 2: Men's Eyewear */}
          {(activeTab === "all" || activeTab === "mens-eyewear") && (
            <article className="mb-14 pb-12 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#08264A]/70 mb-2">
                <span>Chapter 02</span>
                <span>•</span>
                <span>Masculine Architecture</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#08264A] mb-5">
                Men's Eyewear Engineering: Aerospace Titanium, Mazzucchelli Acetates & Face Geometry
              </h3>
              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                <p>
                  Men's optical frames require a delicate equilibrium between architectural solidity, ergonomic balance, and understated refinement. At PrettyVision Kalina, our curated men's optical collection moves away from generic mass-manufactured plastic frames toward meticulously crafted silhouettes composed of aerospace-grade Japanese pure titanium, flexible beta-titanium memory alloys, high-density block acetate from Milan's historic Mazzucchelli 1849 manufactory, and featherlight carbon fiber weaves.
                </p>
                <p>
                  Selecting the ideal frame demands careful consideration of Craniofacial architecture and facial geometry:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  <li>
                    <strong className="text-[#08264A]">Square Facial Contours & Chiseled Jawlines:</strong> Men with prominent angular jaws and broad foreheads benefit from circular panto silhouettes, vintage keyhole bridges, and soft rounded rectangles that soften hard angles without diminishing masculinity.
                  </li>
                  <li>
                    <strong className="text-[#08264A]">Round Faces & Soft Curves:</strong> Structured rectangular frames, bold browline silhouettes, and sharp polygonal geometries introduce visual verticality and architectural definition, creating the illusion of a leaner, more sculpted profile.
                  </li>
                  <li>
                    <strong className="text-[#08264A]">Oval Facial Geometry:</strong> The most versatile face shape, suited for bold aviator optical styles, iconic navigator double bridges, and classic geometric wayfarer cuts.
                  </li>
                  <li>
                    <strong className="text-[#08264A]">High Myopic Prescriptions (-4.00D to -10.00D):</strong> We recommend high-density Italian acetate frames with narrow eye sizes (48mm–51mm) and pronounced rim thickness that naturally conceal the outer temporal edge thickness of minus lenses.
                  </li>
                </ul>
                <p>
                  Every men's frame fitted at PrettyVision undergo custom temple bending, pantoscopic tilt adjustment, and vertex distance calibration to ensure the optical optical centers align millimeter-perfect with your visual axes.
                </p>
              </div>
            </article>
          )}

          {/* Chapter 3: Women's Eyewear */}
          {(activeTab === "all" || activeTab === "womens-eyewear") && (
            <article className="mb-14 pb-12 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#08264A]/70 mb-2">
                <span>Chapter 03</span>
                <span>•</span>
                <span>Haute Optical Aesthetics</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#08264A] mb-5">
                Women's Eyewear Aesthetics: Contemporary Silhouettes, Cat-Eyes & Translucent Palettes
              </h3>
              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                <p>
                  Eyewear is the single most prominent accessory on the human face; it defines first impressions, reflects personal aesthetic taste, and frames your eyes. PrettyVision's women's eyewear collection combines haute couture fashion sensibilities with clinical optical accuracy. We stock iconic global labels including Vogue Eyewear, Emporio Armani, Versace, and Ray-Ban, alongside minimalist artisan titanium wireframes.
                </p>
                <p>
                  Contemporary trends in women's optical fashion showcase an exciting departure from heavy, dark rectangles toward luminous, flattering silhouettes:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  <li>
                    <strong className="text-[#08264A]">Sculptural Cat-Eye Geometries:</strong> Designed to follow the natural upward sweep of the cheekbones, lifting the eye area and adding instant elegance suitable for both professional boardrooms and evening engagements.
                  </li>
                  <li>
                    <strong className="text-[#08264A]">Translucent Crystal & Pastel Palettes:</strong> Frames crafted in smoked crystal, champagne taupe, blush quartz, and subtle matcha green introduce warmth and light to the complexion without overpowering delicate facial features.
                  </li>
                  <li>
                    <strong className="text-[#08264A]">Ultralight Featherweight Titanium:</strong> Weighing as little as 9 grams, our titanium wireframes with hypoallergenic medical-grade silicone nose pads eliminate nasal bridge red marks and prevent glasses from sliding during humid Mumbai afternoons.
                  </li>
                  <li>
                    <strong className="text-[#08264A]">Oversized Vintage 70s Hexagons:</strong> Delivering an effortless retro-chic statement with thin wire contours that maximize unobstructed peripheral vision while comfortably accommodating progressive reading zones.
                  </li>
                </ul>
              </div>
            </article>
          )}

          {/* Chapter 4: Pediatric Care */}
          {(activeTab === "all" || activeTab === "pediatric-care") && (
            <article className="mb-14 pb-12 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#08264A]/70 mb-2">
                <span>Chapter 04</span>
                <span>•</span>
                <span>Pediatric Optometry</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#08264A] mb-5">
                Pediatric Eyecare & Childhood Myopia Progression Management in Mumbai
              </h3>
              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                <p>
                  Across urban Mumbai, childhood myopia (nearsightedness) has surged at an unprecedented rate, driven by extended digital tablet exposure, rigorous academic reading, and reduced outdoor natural sunlight exposure. Left unmonitored, rapidly progressing myopia increases the long-term lifetime risk of high myopic retinopathy, retinal detachment, and glaucoma in adulthood.
                </p>
                <p>
                  At PrettyVision Kalina, our pediatric optometry services provide gentle, child-friendly eye examinations that evaluate not merely distance refractive power, but axial eye elongation, accommodative lag, and binocular convergence. For growing children, safety and durability are non-negotiable:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  <li>
                    <strong className="text-[#08264A]">Shatterproof Polycarbonate Lenses:</strong> Polycarbonate is 10 times more impact-resistant than standard plastic or glass, providing 100% inherent UV protection and zero risk of shattering during playground athletics.
                  </li>
                  <li>
                    <strong className="text-[#08264A]">BPA-Free, Hypoallergenic TR90 Memory Flex Frames:</strong> Built with flexible silicone temples that wrap comfortably behind the ears, eliminating painful pressure points and resisting the rough handling of school classrooms.
                  </li>
                  <li>
                    <strong className="text-[#08264A]">Specialized Myopia Control Defocus Optics:</strong> Advanced lens geometries that focus peripheral light rays in front of the retina rather than behind it, providing clear central vision while generating a biological signal that slows the eyeball's axial lengthening.
                  </li>
                </ul>
              </div>
            </article>
          )}

          {/* Chapter 5: Sunglasses */}
          {(activeTab === "all" || activeTab === "sunglasses") && (
            <article className="mb-14 pb-12 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#08264A]/70 mb-2">
                <span>Chapter 05</span>
                <span>•</span>
                <span>Photoprotection Optics</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#08264A] mb-5">
                Prescription Sunglasses: UV400 Defense & Polarized Glare Cancellation
              </h3>
              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                <p>
                  Mumbai's tropical maritime climate exposes our eyes to intense ambient ultraviolet (UV) radiation 365 days a year. Cumulative unprotected UV exposure is clinically linked to photokeratitis, pterygium (surfer's eye growth), pinguecula, cortical cataracts, and age-related macular degeneration. Many individuals make the critical error of wearing dark non-UV-blocking sunglasses, which causes the pupil to dilate in response to decreased visible light, allowing massive doses of unfiltered harmful UV rays to flood directly onto the crystalline lens and retina.
                </p>
                <p>
                  At PrettyVision, every sunglass pair we dispense guarantees 100% UV400 certification, blocking all UVA and UVB wavelengths up to 400 nanometers. Furthermore, our polarized optical technology provides decisive advantages for motorists, maritime travelers, and outdoor enthusiasts:
                </p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 my-3">
                  <h4 className="font-bold text-[#08264A] text-sm mb-1.5">How Polarized Filtration Works:</h4>
                  <p className="text-xs sm:text-sm text-slate-600">
                    When sunlight strikes flat reflective surfaces like the asphalt of the Western Express Highway, wet pavements, or the waters of Mumbai's coast, the reflected light waves oscillate horizontally, creating intense blinding glare. A polarized filter embeds microscopic vertical aligned iodine crystals that selectively block 99.9% of horizontal glare, transmitting only useful vertical light rays. The result is crystal-clear contrast, heightened depth perception, and eliminated visual fatigue during daytime driving.
                  </p>
                </div>
                <p>
                  We also dispense customized prescription sunglasses and photochromic transition lenses (such as Transitions Gen S and XTRActive), which adapt dynamically from crystal transparency indoors to category-3 dark polarized sunglasses when stepping outdoors into direct sunlight.
                </p>
              </div>
            </article>
          )}

          {/* Chapter 6: Contact Lenses */}
          {(activeTab === "all" || activeTab === "contact-lenses") && (
            <article className="mb-14 pb-12 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#08264A]/70 mb-2">
                <span>Chapter 06</span>
                <span>•</span>
                <span>Corneal Contactology</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#08264A] mb-5">
                Specialized Contact Lens Clinic: Toric, Multifocal & Breathable Silicone Hydrogel Fittings
              </h3>
              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                <p>
                  For millions of active individuals, contact lenses offer an unparalleled sense of visual freedom, an unrestricted field of view, and total independence from spectacle frames during sports, celebrations, and professional engagements. However, contact lenses are medical devices that rest directly upon the delicate living corneal epithelium; improper fitting, incorrect base curve curvature, or inadequate oxygen permeability can lead to corneal hypoxia, neovascularization, and microbial keratitis.
                </p>
                <p>
                  PrettyVision operates a dedicated Contact Lens Clinic in Kalina under the clinical oversight of certified optometrists. Our systematic fitting protocol includes:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  <li>
                    <strong className="text-[#08264A]">Corneal Base Curve (BC) & Sagittal Depth Matching:</strong> Digital keratometry precisely measures corneal steepness to match the exact radius of curvature (typically 8.4mm–8.8mm), preventing excessively tight lenses that starve the cornea of oxygen or loose lenses that dislodge during blinking.
                  </li>
                  <li>
                    <strong className="text-[#08264A]">Third-Generation Silicone Hydrogel Polymers:</strong> Delivering oxygen transmissibility (Dk/t) values exceeding 130 to 160 units, allowing up to 98% of atmospheric oxygen to reach the corneal surface, maintaining white, healthy, uncompromised eyes even during 14-hour wearing days.
                  </li>
                  <li>
                    <strong className="text-[#08264A]">Toric Lenses for Astigmatism:</strong> Engineered with dynamic stabilization zones and prism ballasting to neutralize corneal cylinder without rotational blur during head movement.
                  </li>
                  <li>
                    <strong className="text-[#08264A]">Multifocal Contact Lenses for Presbyopia:</strong> Eliminating the need for separate reading glasses by incorporating concentric optical zones that simultaneously correct distance, computer intermediate, and smartphone reading vision.
                  </li>
                </ul>
                <p>
                  We are authorized dispensary partners for global contact lens leaders, including Johnson & Johnson Acuvue (Oasys, Moist), Bausch + Lomb (Ultra, PureVision), Alcon (Dailies Total1, Air Optix HydraGlyde), and CooperVision (Biofinity, Clariti).
                </p>
              </div>
            </article>
          )}

          {/* Chapter 7: Lenses & Coatings */}
          {(activeTab === "all" || activeTab === "lenses-coatings") && (
            <article className="mb-14 pb-12 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#08264A]/70 mb-2">
                <span>Chapter 07</span>
                <span>•</span>
                <span>Ophthalmic Optics</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#08264A] mb-5">
                Certified Lens Dispensing: Digital Progressives, High-Index Thinning & Blue-Cut Multi-Coatings
              </h3>
              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                <p>
                  While the frame dictates the aesthetic appeal of your eyewear, the ophthalmic lenses dictate how well your brain perceives the world. At PrettyVision, we partner with world-renowned optical lens innovators—including Essilor (Crizal, Varilux), Carl Zeiss (DuraVision, SmartLife), and Hoya—to customize optical solutions tailored to your unique visual habits.
                </p>
                <div className="space-y-4 my-4">
                  <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
                    <h4 className="font-serif text-lg font-bold text-[#08264A] mb-1">
                      1. Digital Freeform Progressive Lenses (No Bifocal Lines)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Unlike obsolete segmented bifocals, modern digital freeform progressive lenses feature a computer-surfaced back-surface corridor that transitions seamlessly from distance vision (infinity) at the top of the lens, through intermediate distance (60cm–100cm, perfect for computer screens and car dashboards), down to near reading vision (35cm–40cm) at the bottom. Individualized fitting parameters—including pupillary distance (PD), fitting height (FH), pantoscopic tilt, and wrap angle—are measured to eradicate the disorienting 'swimming' peripheral aberration common in lower-grade progressive lenses.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
                    <h4 className="font-serif text-lg font-bold text-[#08264A] mb-1">
                      2. High-Index Thinning (Index 1.56, 1.60, 1.67, and 1.74)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      For individuals with moderate to high prescriptions (+/- 3.00D to +/- 12.00D), standard 1.50 index plastic results in thick, heavy lenses with noticeable edge magnification or minification. Ultra high-index 1.67 and 1.74 resin materials bend light significantly more efficiently, allowing lenses to be manufactured up to 45% to 50% thinner and noticeably lighter. Paired with aspheric front-curve surfaces, high-index lenses prevent the awkward 'bug-eye' or 'tiny-eye' cosmetic distortions associated with thick optical glasses.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
                    <h4 className="font-serif text-lg font-bold text-[#08264A] mb-1">
                      3. Multi-Layer Vacuum AR (Anti-Reflective) & Blue-Cut Stack
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Uncoated optical plastic reflects approximately 8% to 12% of incoming light, producing distracting ghost images, nighttime headlight starbursts, and obscuring the wearer's eyes in photographs. PrettyVision's multi-layer vacuum anti-reflective coatings allow 99.2% of light to pass cleanly into the eye. Furthermore, an integrated blue-violet blocker filters out the high-energy blue rays emitted by smartphone and laptop screens, while hydrophobic and oleophobic fluorocarbon topcoats repel water droplets, facial skin oils, and dust particles, ensuring effortless cleaning.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Chapter 8: Store Location & Access */}
          {(activeTab === "all" || activeTab === "store-location") && (
            <article className="mb-14 pb-12 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#08264A]/70 mb-2">
                <span>Chapter 08</span>
                <span>•</span>
                <span>Store & Neighborhood Guide</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#08264A] mb-5">
                PrettyVision Kalina: Your Neighborhood Optical Destination in Santacruz East, Mumbai
              </h3>
              <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4">
                <p>
                  Strategically situated in Kalina, Santacruz East, PrettyVision has established itself as Mumbai's trusted optical center, serving patients and eyewear enthusiasts across Kalina Village, Kolivery Village, Vidya Nagari (Mumbai University Campus), CST Road, Santacruz Railway Station, Kurla West, and the prestigious Bandra-Kurla Complex (BKC).
                </p>
                <div className="p-5 bg-[#08264A]/5 rounded-2xl border border-[#08264A]/15 my-4">
                  <h4 className="font-bold text-[#08264A] text-base mb-2">Store Address & Visiting Hours:</h4>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed mb-2">
                    <strong>Address:</strong> Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098
                  </p>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed mb-2">
                    <strong>Contact Phone:</strong> <a href="tel:09594030310" className="underline font-bold text-[#08264A]">095940 30310</a> | <strong>Instagram:</strong> <a href="https://instagram.com/prettyvision_kalina" target="_blank" rel="noopener noreferrer" className="underline font-bold text-[#08264A]">@prettyvision_kalina</a>
                  </p>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <strong>Operating Hours:</strong> Monday through Saturday: 10:00 AM – 9:30 PM | Sunday: 11:00 AM – 8:00 PM
                  </p>
                </div>
                <p>
                  Every customer who purchases eyewear at PrettyVision receives our complimentary lifetime service guarantee, encompassing ultrasonic deep-cleaning of frames and lenses, replacement of silicone nose pads, hinge tightening, and frame realignment whenever required.
                </p>
              </div>
            </article>
          )}

          {/* Chapter 9: FAQs with Schema.org */}
          {(activeTab === "all" || activeTab === "faqs") && (
            <article>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#08264A]/70 mb-2">
                <span>Chapter 09</span>
                <span>•</span>
                <span>Frequently Asked Questions</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#08264A] mb-6">
                Frequently Asked Optical & Eyecare Questions
              </h3>
              <div className="space-y-3.5">
                {faqs.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div
                      key={i}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-colors duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left bg-white hover:bg-slate-50 transition"
                      >
                        <span className="font-serif text-base sm:text-lg font-bold text-[#08264A]">
                          {faq.q}
                        </span>
                        <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#08264A] shrink-0">
                          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          )}

          {/* Consultation CTA Banner inside Guide */}
          <div className="mt-12 pt-10 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#08264A] to-[#0D315A] text-white p-6 sm:p-8 rounded-2xl">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-xs uppercase tracking-[0.2em] text-blue-200 font-bold block">
                Prioritize Your Visual Health
              </span>
              <h4 className="font-serif text-2xl sm:text-3xl font-bold">
                Experience PrettyVision's 14-Step Eye Examination
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                Visit our optical boutique in Kalina, Mumbai. Our optometrists will evaluate your ocular health and help you select the ideal frame and lens configuration.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={onBookClick}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white text-[#08264A] hover:bg-slate-100 font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg text-center"
              >
                Book Eye Test →
              </button>
              <a
                href="tel:09594030310"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/40 hover:bg-white/10 text-white font-bold text-xs sm:text-sm transition-all duration-300 text-center"
              >
                Call Store
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   14. EXPERT EYE CARE FINAL CTA SECTION
   Redesigned 1:1 to Reference:
   - Deep PrettyVision navy (#06264A) card
   - Eyebrow: "EXPERT EYE CARE AT PRETTYVISION KALINA"
   - Large Serif Heading: "YOUR VISION DESERVES EXPERT CARE."
   - Paragraph Description: "Visit PrettyVision Kalina and experience better vision with our trusted optometrists, advanced technology and personalized care."
   - Dynamic repeatable feature benefits row with circular icon badges:
     * Professional Eye Examination
     * Expert Optometrists
     * Advanced Technology
     * Personalized Care
   - Primary pill CTA ("Book an Eye Test →") + Secondary link CTA ("Explore Our Store →")
   - Seamless gradient fade into right-side eyewear image
   - Clean aesthetics with NO white store/timing card overlay
   - Fully dynamic and admin-controllable
   ============================================================ */
export const FinalCTA = ({ sectionData = {}, onBookClick }) => {
  if (
    sectionData.homepageVisible === false ||
    sectionData.status === "inactive" ||
    sectionData.websiteEnabled === false
  ) {
    return null;
  }

  const content = sectionData.content || {};

  // Visibility flags
  const showEyebrow = content.showEyebrow !== false;
  const showHeading = content.showHeading !== false;
  const showDescription = content.showDescription !== false;
  const showFeatures = content.showFeatures !== false;
  const showPrimaryCta = content.showPrimaryCta !== false;
  const showSecondaryCta = content.showSecondaryCta !== false;
  const showImage = content.showImage !== false;
  const showImageMobile = content.showImageMobile !== false;

  // Copy
  const eyebrow =
    content.eyebrow ||
    sectionData.sectionSubtitle ||
    "EXPERT EYE CARE AT PRETTYVISION KALINA";
  const heading =
    content.heading ||
    sectionData.sectionTitle ||
    "YOUR VISION DESERVES EXPERT CARE.";
  const description =
    content.description ||
    sectionData.description ||
    "Visit PrettyVision Kalina and experience better vision with our trusted optometrists, advanced technology and personalized care.";

  // CTAs
  const primaryCtaText = content.primaryCtaText || content.buttonText || "Book an Eye Test";
  const primaryCtaLink = content.primaryCtaLink || content.buttonLink || "/contact";
  const secondaryCtaText = content.secondaryCtaText || "Explore Our Store";
  const secondaryCtaLink = content.secondaryCtaLink || "/eyewear";

  // Feature Items (Repeatable Admin-managed list)
  const defaultFeatures = [
    { id: "1", icon: "Eye", title: "Professional Eye Examination", description: "", enabled: true, sortOrder: 1 },
    { id: "2", icon: "Users", title: "Expert Optometrists", description: "", enabled: true, sortOrder: 2 },
    { id: "3", icon: "ShieldCheck", title: "Advanced Technology", description: "", enabled: true, sortOrder: 3 },
    { id: "4", icon: "Heart", title: "Personalized Care", description: "", enabled: true, sortOrder: 4 }
  ];
  const features = Array.isArray(content.features) && content.features.length > 0
    ? content.features
    : defaultFeatures;

  // Image & Blend
  const image =
    content.image ||
    "/uploads/sunglasses_hero_wood.jpg";
  const imageAlt = content.imageAlt || "Luxury Eyewear at PrettyVision Kalina";
  const overlayOpacity = typeof content.overlayOpacity === "number" ? content.overlayOpacity : 85;

  const handleCtaClick = (link, e) => {
    if (!link) return;
    if (link === "/contact" || link.includes("appointment") || link.includes("book")) {
      if (typeof onBookClick === "function") {
        e.preventDefault();
        onBookClick();
        return;
      }
    }
  };

  return (
    <section className="w-full py-10 sm:py-14 lg:py-16 bg-slate-50/60" aria-label="Expert Eye Care">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 max-w-[1440px] mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06264A] via-[#051E3B] to-[#04162B] text-white shadow-2xl border border-white/10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px] lg:min-h-[480px] items-stretch">
            {/* LEFT CONTENT COLUMN */}
            <div className="lg:col-span-7 xl:col-span-7 p-7 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-center relative z-20 space-y-5 sm:space-y-6">
              
              {/* 1. Small Eyebrow */}
              {showEyebrow && eyebrow && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-sky-200/90 font-mono">
                    {eyebrow}
                  </p>
                </div>
              )}

              {/* 2. Main Heading */}
              {showHeading && heading && (
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] xl:text-5xl font-bold tracking-tight text-white leading-[1.12]">
                  {heading}
                </h2>
              )}

              {/* 3. Description / Paragraph */}
              {showDescription && description && (
                <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed font-normal max-w-xl">
                  {description}
                </p>
              )}

              {/* 4. Feature / Benefit Items (Repeatable Admin-managed list) */}
              {showFeatures && features && features.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 pt-2 pb-1 border-y border-white/10">
                  {features
                    .filter((f) => f.enabled !== false)
                    .map((feat, idx) => (
                      <div
                        key={feat.id || idx}
                        className="flex items-center gap-2.5 sm:gap-3 py-1 group"
                      >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-sky-300 shrink-0 shadow-inner backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20 group-hover:scale-105">
                          <DynamicIcon name={feat.icon || "Eye"} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                            {feat.title}
                          </h4>
                          {feat.description && (
                            <p className="text-[10px] text-slate-300/80 truncate mt-0.5">
                              {feat.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* 5. CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
                {showPrimaryCta && primaryCtaText && (
                  primaryCtaLink.startsWith("http") ? (
                    <a
                      href={primaryCtaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-slate-100 text-[#06264A] px-7 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 group shrink-0"
                    >
                      <span>{primaryCtaText}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  ) : (
                    <Link
                      to={primaryCtaLink}
                      onClick={(e) => handleCtaClick(primaryCtaLink, e)}
                      className="inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-slate-100 text-[#06264A] px-7 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 group shrink-0"
                    >
                      <span>{primaryCtaText}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )
                )}

                {showSecondaryCta && secondaryCtaText && (
                  secondaryCtaLink.startsWith("http") ? (
                    <a
                      href={secondaryCtaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white/90 hover:text-white transition-colors duration-200 border-b border-transparent hover:border-white/50 py-1 group shrink-0"
                    >
                      <span>{secondaryCtaText}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </a>
                  ) : (
                    <Link
                      to={secondaryCtaLink}
                      onClick={(e) => handleCtaClick(secondaryCtaLink, e)}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white/90 hover:text-white transition-colors duration-200 border-b border-transparent hover:border-white/50 py-1 group shrink-0"
                    >
                      <span>{secondaryCtaText}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* RIGHT EYEWEAR PHOTOGRAPHY COLUMN */}
            {showImage && (
              <div
                className={`relative ${
                  showImageMobile ? "block" : "hidden lg:block"
                } lg:col-span-5 xl:col-span-5 min-h-[260px] sm:min-h-[320px] lg:min-h-full overflow-hidden`}
              >
                <img
                  src={assetUrl(image)}
                  alt={imageAlt}
                  className="w-full h-full object-cover object-center lg:object-left transform hover:scale-105 transition-transform duration-700 select-none"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/uploads/sunglasses_hero_wood.jpg";
                  }}
                />

                {/* Smooth horizontal gradient blend from the left navy into the image */}
                <div
                  className="absolute inset-y-0 left-0 w-28 sm:w-44 lg:w-56 bg-gradient-to-r from-[#06264A] via-[#06264A]/80 to-transparent pointer-events-none"
                  style={{ opacity: `${overlayOpacity / 100}` }}
                />

                {/* Subtle vertical blend for mobile stacked view */}
                <div
                  className="lg:hidden absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#06264A] to-transparent pointer-events-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   15. FOOTER (FULL-WIDTH 6-COLUMN FOOTER WITH DEEP NAVY BAR)
   ============================================================ */
export const Footer = ({ footerSettings = {}, siteSettings = {} }) => {
  const footer = footerSettings || {};
  const site = siteSettings || {};
  const logoUrl = footer.logo || site.logo || "/pv_logo.png";
  const desc =
    footer.description ||
    "PrettyVision is Kalina's premier optical store and eye care clinic, providing qualified optometrist eye testing, luxury eyewear, and contact lens fitting.";
  const columns = footer.columns || [
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
  ];
  const address =
    footer.contactDetails?.address ||
    site.address ||
    "Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098";
  const phone = footer.contactDetails?.phone || site.phone || "095940 30310";
  const copyright = footer.copyrightText || `© 2026 Pretty Vision. All rights reserved.`;

  return (
    <footer className="w-full bg-white border-t border-slate-200">
      {/* Upper Footer Columns */}
      <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand Info & Socials */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src={assetUrl(logoUrl)}
                alt="PrettyVision Logo"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/pv_logo.png";
                }}
              />
            </Link>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-sm">
              {desc}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={site.instagramUrl || "https://instagram.com/prettyvision_kalina"}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-slate-100 hover:bg-[#08264A] text-slate-700 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={site.facebookUrl || "https://facebook.com/prettyvision_kalina"}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-slate-100 hover:bg-[#08264A] text-slate-700 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              {site.whatsappNumber && (
                <a
                  href={`https://wa.me/${site.whatsappNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-slate-100 hover:bg-[#08264A] text-slate-700 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {columns.map((col, idx) => (
            <div key={col.title || idx} className="lg:col-span-2 space-y-4">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                {col.links?.map((link, lIdx) => (
                  <li key={link.label || lIdx}>
                    <Link to={link.url} className="hover:text-[#08264A] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Store Address & Contact */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
              Store Address
            </h4>
            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-[#08264A] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{address}</span>
            </div>
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2.5 text-slate-800 text-xs sm:text-sm">
                <Phone className="h-4 w-4 text-[#08264A] shrink-0" />
                <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="hover:text-[#08264A] font-bold">
                  {phone}
                </a>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#08264A] hover:underline font-bold pt-1"
              >
                <span>Visit Store</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar in Deep Navy */}
      <div className="w-full bg-[#05182F] text-slate-400 py-6 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>{copyright}</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ============================================================
   16. BOOK EYE TEST APPOINTMENT MODAL
   ============================================================ */
export const BookEyeTestModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    preferredDate: "",
    preferredTime: "Morning (10:30 AM - 1:00 PM)",
    serviceRequested: "Comprehensive Eye Examination",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setErrorMsg("Please enter your name and contact phone number.");
      return;
    }
    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await apiFetch("/appointments", {
        method: "POST",
        body: form
      });
      setSuccessMsg(
        res.message ||
          "Thank you! Your eye test appointment request has been submitted. Our team will contact you shortly."
      );
      setForm({
        name: "",
        phone: "",
        email: "",
        preferredDate: "",
        preferredTime: "Morning (10:30 AM - 1:00 PM)",
        serviceRequested: "Comprehensive Eye Examination",
        message: ""
      });
    } catch (err) {
      setErrorMsg(
        err.message || "Failed to submit request. Please try again or call 095940 30310."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-1 mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#08264A]/80">
            PrettyVision Kalina
          </p>
          <h3 className="font-serif text-2xl font-bold text-[#08264A]">
            Book An Eye Test Appointment
          </h3>
          <p className="text-xs text-slate-500">
            Schedule a comprehensive eye exam with our qualified optometrists.
          </p>
        </div>

        {successMsg ? (
          <div className="space-y-4 py-6 text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <Check className="h-8 w-8" />
            </div>
            <h4 className="font-serif text-xl font-bold text-slate-900">
              Appointment Request Received!
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              {successMsg}
            </p>
            <button
              onClick={() => {
                setSuccessMsg("");
                onClose();
              }}
              className="rounded-full bg-[#08264A] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#08264A]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 095940 30310"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#08264A]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#08264A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={form.preferredDate}
                  onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#08264A]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Time</label>
                <select
                  value={form.preferredTime}
                  onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#08264A]"
                >
                  <option value="Morning (10:30 AM - 1:00 PM)">Morning (10:30 AM - 1:00 PM)</option>
                  <option value="Afternoon (1:00 PM - 5:00 PM)">Afternoon (1:00 PM - 5:00 PM)</option>
                  <option value="Evening (5:00 PM - 9:00 PM)">Evening (5:00 PM - 9:00 PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Service Needed</label>
              <select
                value={form.serviceRequested}
                onChange={(e) => setForm({ ...form, serviceRequested: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#08264A]"
              >
                <option value="Comprehensive Eye Examination">Comprehensive Eye Examination</option>
                <option value="Prescription Eyewear Consultation">Prescription Eyewear Consultation</option>
                <option value="Contact Lens Trial & Fitting">Contact Lens Trial & Fitting</option>
                <option value="Kids & Family Eye Checkup">Kids & Family Eye Checkup</option>
                <option value="Frame Repair & Ultrasonic Tune-up">Frame Repair & Ultrasonic Tune-up</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Notes / Symptoms</label>
              <textarea
                rows={2}
                placeholder="Mention any eye strain, headache or power requirements..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#08264A]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-[#08264A] hover:bg-[#0D315A] text-white py-3.5 font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Confirm Appointment Request</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
