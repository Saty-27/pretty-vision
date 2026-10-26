import React, { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apiFetch, assetUrl } from "../api";
import { useAboutSections } from "../useAboutSections";
import {
  TopBar,
  Navbar,
  Footer,
  BookEyeTestModal,
  DynamicIcon,
  OpticalGuideSection
} from "./PrettyVisionComponents";
import {
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Clock,
  Check,
  Star,
  ExternalLink,
  MessageCircle,
  Eye,
  Glasses,
  ShieldCheck,
  Calendar,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  Shield,
  Heart,
  HelpCircle,
  Compass,
  Layers,
  Quote
} from "lucide-react";

export const PublicLayoutWrapper = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [navigation, setNavigation] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    apiFetch("/settings").then((res) => {
      if (res.site) setSettings(res.site);
    }).catch(() => {});

    apiFetch("/navigation").then((res) => {
      if (res.items) setNavigation(res.items);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#042041] selection:text-white">
      <TopBar settings={settings} onBookClick={() => setModalOpen(true)} />
      <Navbar navigation={navigation} settings={settings} onBookClick={() => setModalOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer siteSettings={settings} />
      <BookEyeTestModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

/* ============================================================
   EYEWEAR CATALOGUE PAGE
   ============================================================ */
export const EyewearPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [activeCategoryInfo, setActiveCategoryInfo] = useState(null);
  const [categoryBrands, setCategoryBrands] = useState([]);
  const [categoryAudiences, setCategoryAudiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get("category") || "all";
  const selectedBrand = searchParams.get("brand") || "all";
  const selectedGender = searchParams.get("gender") || "all";
  const search = searchParams.get("search") || "";

  // 1. Initial load of all active categories and brands
  useEffect(() => {
    apiFetch("/categories")
      .then((res) => {
        const items = Array.isArray(res) ? res : (res?.items || []);
        items.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
        setCategories(items);
      })
      .catch(() => {});

    apiFetch("/brands")
      .then((res) => {
        const items = Array.isArray(res) ? res : (res?.items || []);
        items.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
        setAllBrands(items);
      })
      .catch(() => {});
  }, []);

  // 2. Fetch products and dynamically scope brands & audiences
  useEffect(() => {
    setLoading(true);

    if (selectedCategory !== "all") {
      // Find category slug or title
      const matchedCat = categories.find(
        (c) =>
          c.slug?.toLowerCase() === selectedCategory.toLowerCase() ||
          c.name?.toLowerCase() === selectedCategory.toLowerCase() ||
          c.title?.toLowerCase() === selectedCategory.toLowerCase()
      );
      const catSlug = matchedCat?.slug || selectedCategory.toLowerCase().replace(/\s+/g, "-");

      apiFetch(`/categories/${catSlug}`)
        .then((res) => {
          if (res?.success && res.category) {
            setActiveCategoryInfo(res.category);
            setCategoryBrands(res.availableBrands || []);
            setCategoryAudiences(res.availableAudiences || []);

            let prods = res.products || [];
            // Apply client-side sub-filters for brand, gender, and search
            if (selectedBrand !== "all") {
              prods = prods.filter((p) => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
            }
            if (selectedGender !== "all") {
              prods = prods.filter(
                (p) =>
                  (p.targetAudience && p.targetAudience.toLowerCase() === selectedGender.toLowerCase()) ||
                  (p.gender && p.gender.toLowerCase() === selectedGender.toLowerCase())
              );
            }
            if (search.trim()) {
              const q = search.toLowerCase();
              prods = prods.filter(
                (p) =>
                  p.name?.toLowerCase().includes(q) ||
                  p.brand?.toLowerCase().includes(q) ||
                  p.sku?.toLowerCase().includes(q) ||
                  p.frameType?.toLowerCase().includes(q)
              );
            }
            setProducts(prods);
          } else {
            fallbackProductFetch();
          }
        })
        .catch(() => {
          fallbackProductFetch();
        })
        .finally(() => setLoading(false));
    } else {
      setActiveCategoryInfo(null);
      setCategoryBrands([]);
      setCategoryAudiences([]);
      fallbackProductFetch();
    }
  }, [selectedCategory, selectedBrand, selectedGender, search, categories]);

  const fallbackProductFetch = () => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.append("category", selectedCategory);
    if (selectedBrand !== "all") params.append("brand", selectedBrand);
    if (selectedGender !== "all") params.append("gender", selectedGender);
    if (search) params.append("search", search);

    apiFetch(`/products?${params.toString()}`)
      .then((res) => setProducts(res.items || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  const updateFilter = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val === "all" || !val) newParams.delete(key);
    else newParams.set(key, val);

    // If changing category, reset brand if the brand doesn't exist in the new category
    if (key === "category") {
      newParams.delete("brand");
      newParams.delete("gender");
    }
    setSearchParams(newParams);
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedBrand !== "all" || selectedGender !== "all" || search !== "";

  // Available brands to display in filter:
  // If a category is selected, ONLY show brands that have products in this category!
  const displayBrands = selectedCategory !== "all" && categoryBrands.length > 0
    ? categoryBrands
    : allBrands;

  // Available audiences to display:
  const displayAudiences = selectedCategory !== "all" && categoryAudiences.length > 0
    ? categoryAudiences
    : ["Men", "Women", "Unisex", "Kids"];

  return (
    <PublicLayoutWrapper>
      {/* Category Hero Header */}
      <div className="bg-[#F8FAFC] py-8 sm:py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#06264A]/70 mb-2">
            {activeCategoryInfo ? `${activeCategoryInfo.categoryType || "EYEWEAR"} COLLECTION` : "PRETTYVISION CATALOGUE"}
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#06264A]">
            {activeCategoryInfo?.title || activeCategoryInfo?.name || "Eyewear & Optical Frames"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-2 leading-relaxed">
            {activeCategoryInfo?.description ||
              activeCategoryInfo?.subtitle ||
              "Discover precision prescription eyewear, sunglasses, blue-light blockers, and premium frames curated by PrettyVision Kalina."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filters Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search frames, models, SKU..."
                value={search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
              />
            </div>

            {/* Target Audience / Gender filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline">Audience:</span>
              <button
                onClick={() => updateFilter("gender", "all")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedGender === "all"
                    ? "bg-[#06264A] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              {displayAudiences.map((g) => (
                <button
                  key={g}
                  onClick={() => updateFilter("gender", g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedGender.toLowerCase() === g.toLowerCase()
                      ? "bg-[#06264A] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline">Category:</span>
            <button
              onClick={() => updateFilter("category", "all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-[#06264A] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => {
              const isMatch =
                selectedCategory.toLowerCase() === (c.slug || "").toLowerCase() ||
                selectedCategory.toLowerCase() === (c.name || "").toLowerCase() ||
                selectedCategory.toLowerCase() === (c.title || "").toLowerCase();
              return (
                <button
                  key={c._id || c.slug || c.name}
                  onClick={() => updateFilter("category", c.slug || c.name)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    isMatch
                      ? "bg-[#06264A] text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {c.name || c.title}
                </button>
              );
            })}
          </div>

          {/* Brand Filter Pills (Dynamically Scoped) */}
          {displayBrands.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline">Brand:</span>
              <button
                onClick={() => updateFilter("brand", "all")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedBrand === "all"
                    ? "bg-slate-800 text-white"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                All Brands
              </button>
              {displayBrands.map((b) => {
                const brandName = typeof b === "string" ? b : b.name;
                const isSelected = selectedBrand.toLowerCase() === brandName.toLowerCase();
                return (
                  <button
                    key={typeof b === "string" ? b : (b._id || b.slug || b.name)}
                    onClick={() => updateFilter("brand", brandName)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      isSelected
                        ? "bg-slate-800 text-white"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {brandName}
                  </button>
                );
              })}
            </div>
          )}

          {/* Reset Filters row */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">
                Showing results for active filters ({products.length} {products.length === 1 ? "product" : "products"})
              </span>
              <button
                onClick={() => setSearchParams({})}
                className="text-[#06264A] font-bold hover:underline"
              >
                Clear All Filters ✕
              </button>
            </div>
          )}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="h-8 w-8 border-2 border-[#06264A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-500">Loading eyewear collection...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Glasses className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-slate-800">No Eyewear Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your filters or search keywords to explore more frames.
            </p>
            <button
              onClick={() => setSearchParams({})}
              className="mt-4 px-4 py-2 rounded-full bg-[#06264A] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((item) => (
              <div
                key={item._id || item.slug}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <Link to={`/product/${item.slug}`} className="block relative aspect-[4/3] bg-slate-50 p-4 overflow-hidden">
                  <img
                    src={assetUrl(item.mainImage)}
                    alt={item.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-108"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/uploads/cat_optical_frames.jpg";
                    }}
                  />
                  {item.brand && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#042041] shadow-xs">
                      {item.brand}
                    </span>
                  )}
                </Link>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {item.category || "Eyewear"} {item.gender ? `• ${item.gender}` : ""}
                    </p>
                    <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#042041] transition-colors leading-snug">
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </h3>
                    {item.shortDescription && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.shortDescription}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {item.price ? (
                        <span className="text-sm font-bold text-slate-900">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500">
                          Enquire Price
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/product/${item.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#042041] hover:underline"
                    >
                      <span>View</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayoutWrapper>
  );
};

/* ============================================================
   PRODUCT DETAIL PAGE
   ============================================================ */
export const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    setLoading(true);
    apiFetch(`/products/${slug}`)
      .then((res) => {
        setProduct(res.product);
        setRelated(res.related || []);
        setSelectedImage(res.product?.mainImage || "");
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <PublicLayoutWrapper>
        <div className="py-24 text-center">
          <div className="h-8 w-8 border-2 border-[#042041] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading product details...</p>
        </div>
      </PublicLayoutWrapper>
    );
  }

  if (!product) {
    return (
      <PublicLayoutWrapper>
        <div className="max-w-md mx-auto py-24 px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-slate-900">Frame Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">
            The requested eyewear product could not be located or is no longer listed.
          </p>
          <Link
            to="/eyewear"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#042041] text-white px-6 py-2.5 text-xs font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Catalogue</span>
          </Link>
        </div>
      </PublicLayoutWrapper>
    );
  }

  const allImages = [product.mainImage, ...(product.images || [])].filter(Boolean);
  const whatsappUrl = `https://wa.me/919594030310?text=${encodeURIComponent(
    `Hi PrettyVision, I am interested in viewing/fitting the frame: ${product.name} (SKU: ${product.sku || "N/A"}). Is it available in store?`
  )}`;

  return (
    <PublicLayoutWrapper>
      <div className="bg-slate-50 py-4 border-b border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link to="/" className="hover:text-[#042041]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/eyewear" className="hover:text-[#042041]">Eyewear</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-800 font-semibold truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Images Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl overflow-hidden bg-slate-50 border border-slate-200/80 aspect-[4/3] p-8 flex items-center justify-center">
              <img
                src={assetUrl(selectedImage || product.mainImage)}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/uploads/cat_optical_frames.jpg";
                }}
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`h-20 w-20 rounded-xl overflow-hidden bg-slate-50 border-2 p-2 shrink-0 transition-all ${
                      selectedImage === img ? "border-[#042041] shadow-sm" : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={assetUrl(img)} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.brand && (
                  <span className="bg-[#042041] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {product.brand}
                  </span>
                )}
                {product.category && (
                  <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {product.category}
                  </span>
                )}
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#042041] leading-tight">
                {product.name}
              </h1>
              {product.sku && (
                <p className="text-xs text-slate-400 mt-1 font-mono">Reference: {product.sku}</p>
              )}
            </div>

            {/* Price display if set */}
            {product.price ? (
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.salePrice && product.salePrice < product.price && (
                  <span className="text-base text-slate-400 line-through">
                    ₹{product.salePrice.toLocaleString("en-IN")}
                  </span>
                )}
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Genuine Store Warranty
                </span>
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
                Available for trial & custom power lens fitting at PrettyVision Kalina.
              </div>
            )}

            {/* Description */}
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-b border-slate-100 py-4">
              <p>{product.fullDescription || product.shortDescription}</p>
            </div>

            {/* Optical Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200/80">
              {product.frameType && (
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Frame Silhouette</span>
                  <span className="font-bold text-slate-800">{product.frameType}</span>
                </div>
              )}
              {product.lensType && (
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Lens Options</span>
                  <span className="font-bold text-slate-800">{product.lensType}</span>
                </div>
              )}
              {product.gender && (
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Fit / Gender</span>
                  <span className="font-bold text-slate-800">{product.gender}</span>
                </div>
              )}
              {product.frameColor && (
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Colorway</span>
                  <span className="font-bold text-slate-800">{product.frameColor}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Enquire On WhatsApp</span>
              </a>

              {product.externalEcommerceUrl && (
                <a
                  href={product.externalEcommerceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 hover:border-slate-800 text-slate-800 py-3 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <span>View On Official Brand Store</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            {/* Store visit notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900">
              <MapPin className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                Want to try this frame on your face? Visit our store at <strong>Shop No 11, Agarwal Building, Kalina, Santacruz East, Mumbai</strong>. Free fitting and adjustments provided!
              </span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200">
            <h3 className="font-serif text-2xl font-bold text-[#042041] mb-6">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {related.map((item) => (
                <Link
                  key={item._id}
                  to={`/product/${item.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition group block"
                >
                  <div className="aspect-[4/3] bg-slate-50 rounded-xl mb-3 p-2 overflow-hidden">
                    <img src={assetUrl(item.mainImage)} alt={item.name} className="w-full h-full object-contain group-hover:scale-106 transition-transform" />
                  </div>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#042041] leading-tight truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">{item.brand || item.category}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicLayoutWrapper>
  );
};

/* ============================================================
   SERVICES PAGE & SERVICE DETAIL
   ============================================================ */
export const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/services")
      .then((res) => setServices(res.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayoutWrapper>
      <div className="bg-[#042041] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200 mb-2">
            COMPLETE EYE CARE
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Optometry & Optical Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-2 leading-relaxed">
            From computerized refraction testing to precision lens customization and contact lens fitting, experience dedicated care in Kalina.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((srv) => (
            <div
              key={srv._id || srv.title}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={assetUrl(srv.image)}
                  alt={srv.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/uploads/service_exam.jpg";
                  }}
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-[#042041]">
                    <DynamicIcon name={srv.icon || "Eye"} className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#042041] leading-snug">
                    <Link to={`/services/${srv.slug}`}>{srv.title}</Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {srv.fullDescription || srv.shortDescription}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/services/${srv.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#042041] hover:underline"
                  >
                    <span>Read Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayoutWrapper>
  );
};

export const ServiceDetailPage = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/services/${slug}`)
      .then((res) => setService(res.service))
      .catch(() => setService(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <PublicLayoutWrapper>
        <div className="py-24 text-center">
          <div className="h-8 w-8 border-2 border-[#042041] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading service details...</p>
        </div>
      </PublicLayoutWrapper>
    );
  }

  if (!service) {
    return (
      <PublicLayoutWrapper>
        <div className="max-w-md mx-auto py-24 px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-slate-900">Service Not Found</h2>
          <Link to="/services" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#042041] text-white px-6 py-2.5 text-xs font-bold">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Services</span>
          </Link>
        </div>
      </PublicLayoutWrapper>
    );
  }

  return (
    <PublicLayoutWrapper>
      <div className="bg-[#042041] text-white py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center gap-1.5 text-xs text-blue-200 hover:text-white mb-4">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Services</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            {service.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-2 leading-relaxed">
            {service.shortDescription}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        {service.image && (
          <div className="rounded-3xl overflow-hidden aspect-[16/9] shadow-xl bg-slate-100 max-h-[460px]">
            <img src={assetUrl(service.image)} alt={service.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
          <p className="whitespace-pre-line">{service.fullDescription || service.shortDescription}</p>
        </div>

        <div className="p-8 rounded-3xl bg-[#F8FAFC] border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#042041]">
              Ready to schedule your appointment?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Visit our store in Kalina, Mumbai or contact our team directly.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#042041] text-white px-8 py-3 text-xs font-bold uppercase tracking-wider"
          >
            <span>Book Appointment</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PublicLayoutWrapper>
  );
};

/* ============================================================
   BRANDS PAGE & BRAND DETAIL
   ============================================================ */
export const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/brands")
      .then((res) => setBrands(res.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayoutWrapper>
      <div className="bg-[#042041] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200 mb-2">
            AUTHORIZED OPTICAL RETAILER
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Our Luxury Eyewear Brands
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-2 leading-relaxed">
            PrettyVision Kalina is proud to house genuine luxury collections from the world’s leading optical design houses.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand._id || brand.slug}
              to={`/brands/${brand.slug}`}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group space-y-4 overflow-hidden"
            >
              {/* Brand Banner or Logo */}
              <div className="h-28 rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-center justify-center relative overflow-hidden">
                {brand.bannerImage && (
                  <img
                    src={assetUrl(brand.bannerImage)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                {brand.logo ? (
                  <img
                    src={assetUrl(brand.logo)}
                    alt={brand.name}
                    className="max-h-16 max-w-full object-contain relative z-10"
                  />
                ) : (
                  <span className="font-serif text-2xl font-bold text-[#06264A] relative z-10">
                    {brand.name}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-[#06264A] transition-colors">
                  {brand.name}
                </h3>
                {brand.description && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {brand.description}
                  </p>
                )}
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#06264A]">
                <span>Explore Eyewear</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PublicLayoutWrapper>
  );
};

export const BrandDetailPage = () => {
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/brands/${slug}`)
      .then((res) => {
        setBrand(res.brand);
        setProducts(res.products || []);
      })
      .catch(() => setBrand(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <PublicLayoutWrapper>
        <div className="py-24 text-center">
          <div className="h-8 w-8 border-2 border-[#042041] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold">Loading brand collection...</p>
        </div>
      </PublicLayoutWrapper>
    );
  }

  if (!brand) {
    return (
      <PublicLayoutWrapper>
        <div className="max-w-md mx-auto py-24 px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-slate-900">Brand Not Found</h2>
          <Link to="/brands" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#042041] text-white px-6 py-2.5 text-xs font-bold">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Brands</span>
          </Link>
        </div>
      </PublicLayoutWrapper>
    );
  }

  return (
    <PublicLayoutWrapper>
      <div className="bg-[#06264A] text-white py-12 sm:py-16 relative overflow-hidden">
        {brand.bannerImage && (
          <img
            src={assetUrl(brand.bannerImage)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/brands" className="inline-flex items-center gap-1.5 text-xs text-blue-200 hover:text-white mb-4">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Brands</span>
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {brand.logo && (
              <div className="bg-white p-3 rounded-2xl shadow-md max-w-[140px] max-h-16 flex items-center justify-center">
                <img src={assetUrl(brand.logo)} alt={brand.name} className="max-h-10 max-w-full object-contain" />
              </div>
            )}
            <div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
                {brand.name}
              </h1>
              {brand.description && (
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
                  {brand.description}
                </p>
              )}
              {brand.websiteUrl && (
                <a
                  href={brand.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-300 hover:text-white hover:underline mt-2"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Official Website ({brand.websiteUrl.replace(/^https?:\/\//, "")})</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="font-serif text-2xl font-bold text-[#042041] mb-6">
          Frames by {brand.name}
        </h2>
        {products.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-500">
              New arrivals for {brand.name} are coming soon. Visit our Kalina showroom to see the full catalogue!
            </p>
            <Link to="/contact" className="mt-4 inline-flex items-center rounded-full bg-[#042041] text-white px-6 py-2 text-xs font-bold">
              Visit Store
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item.slug}`}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-lg transition group block"
              >
                <div className="aspect-[4/3] bg-slate-50 rounded-xl mb-3 p-2 overflow-hidden">
                  <img src={assetUrl(item.mainImage)} alt={item.name} className="w-full h-full object-contain group-hover:scale-106 transition-transform" />
                </div>
                <h4 className="font-serif text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#042041] leading-tight truncate">
                  {item.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">{item.category}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayoutWrapper>
  );
};

/* ============================================================
   ABOUT PRETTYVISION PAGE
   ============================================================ */
/* ============================================================
   ABOUT PRETTYVISION PAGE — EDITORIAL LUXURY REBUILD (11 SECTIONS)
   ============================================================ */

const AboutImage = ({ src, alt, className = "", fallbackClass = "bg-[#EEF1F4]" }) => {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className={`flex items-center justify-center text-slate-400 ${fallbackClass} ${className}`}>
        <Glasses className="h-10 w-10 text-slate-300 opacity-60" />
      </div>
    );
  }
  return (
    <img
      src={assetUrl(src)}
      alt={alt || "PrettyVision Optical Kalina"}
      onError={() => setError(true)}
      className={className}
      loading="lazy"
    />
  );
};

export const AboutPage = () => {
  const { sections, loading, isSectionActive, getSectionData } = useAboutSections();
  const [aboutData, setAboutData] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiFetch("/about-page")
      .then((res) => {
        if (res.success) setAboutData(res);
      })
      .catch(() => {});
  }, []);

  const getSec = (key) => {
    return getSectionData(key) || {};
  };

  const getSecContent = (key) => {
    const sec = getSec(key);
    return sec.content || {};
  };

  // Structured Data for LocalBusiness & Optician
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Optician", "LocalBusiness", "MedicalBusiness"],
        "@id": "https://prettyvision.in/#organization",
        "name": "PrettyVision",
        "alternateName": "Pretty Vision Kalina",
        "url": "https://prettyvision.in/about",
        "logo": "https://prettyvision.in/uploads/pv_logo.png",
        "image": "https://prettyvision.in/about_hero_model.jpg",
        "description": "33+ years of trusted optometric care and luxury eyewear in Kalina, Mumbai. Computerized eye examinations, designer frames, prescription lenses and contact lenses.",
        "telephone": "095940 30310",
        "email": "prettyvisionkalina@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East",
          "addressLocality": "Mumbai",
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
        "priceRange": "$$"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://prettyvision.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "About Us",
            "item": "https://prettyvision.in/about"
          }
        ]
      }
    ]
  };

  // Render individual sections dynamically based on active status
  const renderSection = (sec) => {
    const key = sec.sectionKey;
    const content = sec.content || {};

    switch (key) {
      /* ============================================================
         1. ABOUT HERO BANNER (50/50 Desktop Split)
         ============================================================ */
      case "about_hero":
        return (
          <section key={key} className="w-full bg-white border-b border-slate-100">
            <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-12 sm:py-16 lg:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                {/* Left Text Column */}
                <div className="lg:col-span-7 space-y-6 sm:space-y-7">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06264A]/5 border border-[#06264A]/15 text-[#06264A] text-xs font-bold uppercase tracking-[0.18em]">
                    <Sparkles className="h-3.5 w-3.5 text-[#06264A]" />
                    <span>{content.eyebrow || "ABOUT PRETTYVISION"}</span>
                  </div>

                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#09284D] leading-[1.06] whitespace-pre-line">
                    {content.heading || "SEEING BETTER.\nLIVING BETTER."}
                  </h1>

                  <p className="text-xs sm:text-sm font-bold tracking-[0.14em] text-slate-500 uppercase">
                    {content.subheading || "33 YEARS OF TRUSTED EYE CARE & EYEWEAR IN KALINA, MUMBAI"}
                  </p>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                    {content.paragraph ||
                      "Since 1993, PrettyVision has been helping families discover better vision, better-fitting eyewear and trusted eye-care solutions from our optical store in Kalina, Mumbai."}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link
                      to={content.button1Url || "/eyewear"}
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#06264A] hover:bg-[#0B3566] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg"
                    >
                      <span>{content.button1Text || "Explore Our Eyewear"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      to={content.button2Url || "/contact"}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#06264A] border border-slate-300 text-xs sm:text-sm font-bold tracking-wide transition-all shadow-xs"
                    >
                      <Calendar className="h-4 w-4 text-[#06264A]" />
                      <span>{content.button2Text || "Book an Eye Test"}</span>
                    </Link>
                  </div>
                </div>

                {/* Right Image Column */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 aspect-[5/6] bg-[#EEF1F4]">
                    <AboutImage
                      src={content.image || "/about_hero_model.jpg"}
                      alt={content.imageAlt || "PrettyVision Luxury Eyewear Model"}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Bottom floating badge */}
                    <div className="absolute bottom-5 left-5 right-5 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-200/90 shadow-lg flex items-center justify-center gap-2 text-xs font-semibold text-slate-800">
                      <Glasses className="h-4 w-4 text-[#06264A]" />
                      <span>{content.badge || "Classic Eyewear • Everyday Confidence"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      /* ============================================================
         2. TRUST STATISTICS STRIP (4 Pillars)
         ============================================================ */
      case "about_stats":
        const stats = content.items || [
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
        ];
        return (
          <section key={key} className="w-full bg-[#F5F7FA] border-b border-slate-200/80">
            <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-10 sm:py-14">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
                {stats.map((st, i) => (
                  <div key={st.id || i} className={`px-4 sm:px-6 lg:px-8 py-5 sm:py-0 ${i === 0 ? "sm:pl-0" : ""}`}>
                    <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#06264A] tracking-tight block">
                      {st.number}
                    </span>
                    <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase mt-2">
                      {st.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {st.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      /* ============================================================
         3. OUR STORY SECTION (50/50 Split)
         ============================================================ */
      case "about_story":
        return (
          <section key={key} className="w-full bg-white border-b border-slate-100">
            <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-16 sm:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                {/* Left Showroom Photo */}
                <div className="lg:col-span-6">
                  <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3] bg-[#EEF1F4]">
                    <AboutImage
                      src={content.image || "/about_story_showroom.jpg"}
                      alt={content.imageAlt || "PrettyVision Optical Boutique Kalina"}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>

                {/* Right Legacy Text */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#06264A]">
                    <Shield className="h-3.5 w-3.5 text-[#06264A]" />
                    <span>{content.eyebrow || "OUR STORY"}</span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#09284D] tracking-tight leading-[1.14]">
                    {content.heading || "33 YEARS OF HELPING MUMBAI SEE BETTER"}
                  </h2>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {content.paragraph1 ||
                      "Founded in 1993, PrettyVision has grown from a trusted optical destination into a premium eyewear and eye-care store serving generations of customers in and around Kalina, Mumbai."}
                  </p>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {content.paragraph2 ||
                      "For more than three decades, our focus has remained simple — helping every customer find the right eyewear for their vision, lifestyle and personal style. From everyday prescription glasses and sunglasses to contact lenses and professional eye examinations, PrettyVision brings eye care and eyewear together under one roof."}
                  </p>

                  <div className="pt-2">
                    <Link
                      to={content.buttonUrl || "/eyewear"}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#06264A] hover:bg-[#0B3566] text-white text-xs sm:text-sm font-bold tracking-wide transition shadow-md"
                    >
                      <span>{content.buttonText || "Discover PrettyVision"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      /* ============================================================
         4. WHY CHOOSE PRETTYVISION (4-Grid + Frame Photo)
         ============================================================ */
      case "about_why_choose":
        const features = content.features || [
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
            description: "Trusted by families across Mumbai for personal care and genuine quality."
          },
          {
            id: "feat_3",
            icon: "Sparkles",
            title: "PERSONALIZED FITTING",
            description: "Frames fitted precisely to your face structure for all-day comfort."
          },
          {
            id: "feat_4",
            icon: "Glasses",
            title: "PREMIUM EYEWEAR & LENSES",
            description: "Wide selection of certified luxury frames and precision lens tech."
          }
        ];
        return (
          <section key={key} className="w-full bg-[#F5F7FA] border-b border-slate-200/80">
            <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-16 sm:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                {/* Left 4 Features */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#06264A] block mb-2">
                      {content.eyebrow || "WHY CHOOSE PRETTYVISION"}
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#09284D] tracking-tight">
                      {content.heading || "MORE THAN AN OPTICAL STORE"}
                    </h2>
                    <p className="text-sm text-slate-600 mt-2">
                      {content.subtitle || "A trusted destination for better vision and better eyewear."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
                    {features.map((feat, i) => (
                      <div
                        key={feat.id || i}
                        className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow"
                      >
                        <div className="h-10 w-10 rounded-xl bg-[#06264A]/5 text-[#06264A] flex items-center justify-center mb-3">
                          <DynamicIcon name={feat.icon || "Glasses"} className="h-5 w-5 text-[#06264A]" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          {feat.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Frame Visual */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[5/6] bg-[#EEF1F4]">
                    <AboutImage
                      src={content.image || "/about_why_eyewear.jpg"}
                      alt={content.imageAlt || "Crafted Tortoiseshell Eyewear Frame"}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      /* ============================================================
         5. WHAT WE OFFER (6 Service Cards)
         ============================================================ */
      case "about_offerings":
        const servicesList = content.services || [
          {
            id: "srv_1",
            title: "Comprehensive Eye Testing",
            description: "Accurate computerized vision assessments by certified optometrists.",
            image: "/service_exam.jpg",
            url: "/services"
          },
          {
            id: "srv_2",
            title: "Prescription Eyeglasses",
            description: "Wide range of single-vision, bifocal and progressive lenses tailored to your prescription.",
            image: "/service_prescription.jpg",
            url: "/services"
          },
          {
            id: "srv_3",
            title: "Polarized & Designer Sunglasses",
            description: "100% UV-protected sunglasses combining eye health and modern style.",
            image: "/uploads/cat_sunglasses.jpg",
            url: "/services"
          },
          {
            id: "srv_4",
            title: "Contact Lens Clinic & Fittings",
            description: "Daily, monthly and toric lenses with professional guidance on hygiene and wear.",
            image: "/service_fitting.jpg",
            url: "/services"
          },
          {
            id: "srv_5",
            title: "Children's Eyewear Collection",
            description: "Durable, lightweight frames designed specifically for active children and teens.",
            image: "/service_kids.jpg",
            url: "/services"
          },
          {
            id: "srv_6",
            title: "Advanced Lens Coatings & Blue-Light Care",
            description: "Anti-reflective, anti-scratch and blue-light filter lenses for screen comfort.",
            image: "/service_coating.jpg",
            url: "/services"
          }
        ];
        return (
          <section key={key} className="w-full bg-white border-b border-slate-100">
            <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-16 sm:py-24">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#06264A] block mb-2">
                    {content.eyebrow || "EVERYTHING YOU NEED FOR CLEARER VISION"}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#09284D] tracking-tight">
                    {content.heading || "WHAT WE OFFER"}
                  </h2>
                </div>
                <Link
                  to={content.buttonUrl || "/services"}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#06264A] hover:underline shrink-0"
                >
                  <span>{content.buttonText || "View All Services"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {servicesList.map((srv, i) => (
                  <Link
                    key={srv.id || i}
                    to={srv.url || "/services"}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-[#EEF1F4] relative">
                      <AboutImage
                        src={srv.image || "/uploads/store_interior.jpg"}
                        alt={srv.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#06264A] transition-colors">
                          {srv.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                          {srv.description}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#06264A] pt-2">
                        <span>Learn More</span>
                        <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );

      /* ============================================================
         6. CURATED EYEWEAR BANNER (Navy Strip)
         ============================================================ */
      case "about_eyewear_banner":
        const categories = [
          "Optical Frames",
          "Designer Sunglasses",
          "Blue-Light Glasses",
          "Sports Eyewear",
          "Kids' Eyewear",
          "Contact Lenses"
        ];
        return (
          <section key={key} className="w-full bg-[#06264A] text-white">
            <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-14 sm:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Content */}
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300 block">
                    {content.eyebrow || "CURATED EYEWEAR"}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
                    {content.heading || "EYEWEAR FOR EVERY FACE, EVERY PRESCRIPTION, EVERY STYLE"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {content.paragraph ||
                      "Explore our handpicked collection of optical frames, designer sunglasses, and precision lenses engineered for clarity and comfort."}
                  </p>
                  <div className="pt-2">
                    <Link
                      to={content.buttonUrl || "/eyewear"}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-slate-100 text-[#06264A] text-xs sm:text-sm font-bold tracking-wide transition shadow-md"
                    >
                      <span>{content.buttonText || "Explore Collections"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Center Eyewear Visual */}
                <div className="lg:col-span-4 flex items-center justify-center">
                  <div className="w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-4">
                    <AboutImage
                      src={content.image || "/about_final_cta_glasses.jpg"}
                      alt={content.imageAlt || "Curated Designer Eyewear"}
                      className="w-full h-full object-contain filter drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Right Category List */}
                <div className="lg:col-span-3 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 block mb-3">
                    Popular Categories
                  </span>
                  {categories.map((cat, i) => (
                    <Link
                      key={i}
                      to="/eyewear"
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition"
                    >
                      <span>{cat}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-blue-300" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      /* ============================================================
         7. THE PRETTYVISION EXPERIENCE (4 Steps + Photo)
         ============================================================ */
      case "about_experience":
        const steps = content.steps || [
          {
            step: "01",
            title: "UNDERSTAND YOUR VISION",
            description: "Thorough computerized vision testing and consultation to evaluate your eyesight and visual needs."
          },
          {
            step: "02",
            title: "DISCOVER YOUR FIT",
            description: "Explore curated frames matched to your face shape, prescription, and personal aesthetic."
          },
          {
            step: "03",
            title: "PRECISION CRAFTING & FITTING",
            description: "Lenses cut and aligned to millimeter accuracy, with custom temple and bridge adjustments."
          },
          {
            step: "04",
            title: "WEAR WITH CONFIDENCE",
            description: "Walk away with comfortable, crystal-clear vision backed by manufacturer warranty and complimentary aftercare."
          }
        ];
        return (
          <section key={key} className="w-full bg-[#F5F7FA] border-b border-slate-200/80">
            <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-16 sm:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                {/* Left Consultation Photo */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/5] bg-[#EEF1F4]">
                    <AboutImage
                      src={content.image || "/about_experience_exam.jpg"}
                      alt={content.imageAlt || "PrettyVision Optometrist Consultation"}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>

                {/* Right 4 Steps */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#06264A] block mb-2">
                      {content.eyebrow || "HOW WE CARE FOR YOU"}
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#09284D] tracking-tight">
                      {content.heading || "THE PRETTYVISION EXPERIENCE"}
                    </h2>
                  </div>

                  <div className="space-y-4 pt-2">
                    {steps.map((st, i) => (
                      <div
                        key={i}
                        className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-4 sm:gap-5"
                      >
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#06264A] text-white flex items-center justify-center font-mono font-bold text-sm sm:text-base shrink-0 shadow-sm">
                          {st.step || `0${i + 1}`}
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wide">
                            {st.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                            {st.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      /* ============================================================
         8. VISIT OUR STORE (3 Connected Columns)
         ============================================================ */
      case "about_store":
        return (
          <section key={key} className="w-full bg-white border-b border-slate-100">
            <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-16 sm:py-24">
              <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#06264A]">
                  {content.eyebrow || "VISIT OUR STORE"}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#09284D] tracking-tight">
                  EXPERIENCE PRETTYVISION IN PERSON
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white">
                {/* Column 1: Store Facade Photo */}
                <div className="lg:col-span-4 min-h-[300px] lg:min-h-full bg-[#EEF1F4] relative">
                  <AboutImage
                    src={content.image || "/store_exterior_ref.png"}
                    alt={content.imageAlt || "PrettyVision Kalina Showroom"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#06264A]/90 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wide">
                    Kalina Showroom
                  </div>
                </div>

                {/* Column 2: Details & Hours */}
                <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white border-y lg:border-y-0 lg:border-x border-slate-100">
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        FLAGSHIP OPTICAL STORE
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-[#06264A] mt-1">
                        {content.storeName || "PRETTYVISION KALINA"}
                      </h3>
                    </div>

                    <div className="space-y-3 text-xs text-slate-600">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="h-4 w-4 text-[#06264A] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          {content.address ||
                            "Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Phone className="h-4 w-4 text-[#06264A] shrink-0" />
                        <a
                          href={`tel:${(content.phone || "095940 30310").replace(/\s+/g, "")}`}
                          className="font-bold text-[#06264A] hover:underline"
                        >
                          {content.phone || "095940 30310"}
                        </a>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Clock className="h-4 w-4 text-[#06264A] shrink-0 mt-0.5" />
                        <span className="whitespace-pre-line leading-relaxed">
                          {content.hours ||
                            "Monday – Saturday: 10:00 AM – 9:30 PM\nSunday: 11:00 AM – 8:00 PM"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                    <a
                      href={
                        content.button1Url ||
                        "https://maps.google.com/?q=Pretty+Vision+Kalina+Mumbai"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#06264A] hover:bg-[#0B3566] text-white text-xs font-bold transition shadow-xs"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{content.button1Text || "Get Directions"}</span>
                    </a>
                    <a
                      href={content.button2Url || "tel:09594030310"}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{content.button2Text || "Call PrettyVision"}</span>
                    </a>
                  </div>
                </div>

                {/* Column 3: Google Maps Embed */}
                <div className="lg:col-span-4 min-h-[320px] bg-slate-100">
                  <iframe
                    title="PrettyVision Store Location"
                    src={
                      content.mapEmbedUrl ||
                      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.835948956972!2d72.8596646!3d19.0709405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e0a3f81e35%3A0xc3b09dc69fb4d23!2sPretty%20Vision!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    }
                    className="w-full h-full border-0 min-h-[320px]"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </section>
        );

      /* ============================================================
         9. CUSTOMER TESTIMONIALS ("Loved by Families")
         ============================================================ */
      case "about_testimonials":
        const testimonialsList =
          aboutData?.testimonials?.length > 0
            ? aboutData.testimonials
            : [
                {
                  userName: "Rohit Mehta",
                  designation: "Kalina, Mumbai",
                  testimonialText:
                    "Excellent collection and very helpful staff. Got my new Ray-Ban here and the experience was amazing!",
                  rating: 5
                },
                {
                  userName: "Priya Shah",
                  designation: "Santacruz, Mumbai",
                  testimonialText:
                    "Great service and professional eye testing. Highly recommend Pretty Vision for genuine brands!",
                  rating: 5
                },
                {
                  userName: "Amit Desai",
                  designation: "BKC, Mumbai",
                  testimonialText:
                    "Wide range of frames and contact lenses. Very friendly staff and expert guidance.",
                  rating: 5
                }
              ];
        return (
          <section key={key} className="w-full bg-[#F5F7FA] border-b border-slate-200/80">
            <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-16 sm:py-24">
              <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#06264A]">
                  {content.eyebrow || "TRUSTED BY THOUSANDS"}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#09284D] tracking-tight">
                  {content.heading || "LOVED BY FAMILIES"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {content.supportingText || "10,000+ happy customers and counting."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {testimonialsList.slice(0, 3).map((item, i) => (
                  <div
                    key={item._id || i}
                    className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(item.rating || 5)].map((_, s) => (
                          <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                        "{item.testimonialText}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {item.userName || item.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {item.designation || "Customer, Mumbai"}
                        </span>
                      </div>
                      <Quote className="h-5 w-5 text-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      /* ============================================================
         10. FREQUENTLY ASKED QUESTIONS (2-Column Accordion)
         ============================================================ */
      case "about_faq":
        const faqs = content.faqs || [
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
        ];
        return (
          <section key={key} className="w-full bg-white border-b border-slate-100">
            <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-16 sm:py-24">
              <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#06264A]">
                  {sec.sectionSubtitle || "FAQS"}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#09284D] tracking-tight">
                  {content.heading || "FREQUENTLY ASKED QUESTIONS"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {content.subtitle ||
                    "Find answers to common questions about our optical store, services and eyewear."}
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-serif font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50/50 transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <span className="p-1 rounded-full bg-slate-100 text-slate-600 shrink-0">
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      /* ============================================================
         11. FINAL CTA BANNER ("YOUR VISION DESERVES BETTER.")
         ============================================================ */
      case "about_final_cta":
        return (
          <section key={key} className="w-full bg-[#06264A] text-white relative overflow-hidden">
            <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-16 sm:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left Text & Dual Buttons */}
                <div className="lg:col-span-7 space-y-5">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300 block">
                    {sec.sectionSubtitle || "VISIT PRETTYVISION"}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                    {content.heading || "YOUR VISION DESERVES BETTER."}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                    {content.paragraph ||
                      "Visit PrettyVision Kalina for professional eye care, premium eyewear, prescription glasses, sunglasses and contact lens solutions."}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-3">
                    <Link
                      to={content.button1Url || "/contact"}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#06264A] text-xs sm:text-sm font-bold tracking-wide transition shadow-lg"
                    >
                      <Calendar className="h-4 w-4 text-[#06264A]" />
                      <span>{content.button1Text || "Book an Eye Test"}</span>
                    </Link>

                    <Link
                      to={content.button2Url || "/contact"}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-transparent hover:bg-white/10 text-white border border-white/30 text-xs sm:text-sm font-bold tracking-wide transition"
                    >
                      <MapPin className="h-4 w-4 text-white" />
                      <span>{content.button2Text || "Visit Our Store"}</span>
                    </Link>
                  </div>
                </div>

                {/* Right Eyewear Visual */}
                <div className="lg:col-span-5 flex items-center justify-center">
                  <div className="w-full max-w-md aspect-[16/10] rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-3 shadow-2xl">
                    <AboutImage
                      src={content.image || "/about_final_cta_glasses.jpg"}
                      alt={content.imageAlt || "PrettyVision Designer Eyewear"}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <PublicLayoutWrapper>
      {/* Full SEO Head & Local Schema */}
      <Helmet>
        <title>About PrettyVision — 33+ Years of Premium Eyewear & Eye Care in Kalina, Mumbai</title>
        <meta
          name="description"
          content="Discover PrettyVision, Kalina Mumbai's premier optical store since 1993. Over 33 years providing computerized eye examinations, luxury frames, prescription glasses, sunglasses, and contact lenses."
        />
        <link rel="canonical" href="https://prettyvision.in/about" />

        {/* OpenGraph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prettyvision.in/about" />
        <meta
          property="og:title"
          content="About PrettyVision — 33+ Years of Premium Eyewear & Eye Care in Kalina, Mumbai"
        />
        <meta
          property="og:description"
          content="Serving Kalina, Mumbai since 1993 with 10,000+ happy customers. Visit PrettyVision for comprehensive eye examinations and curated luxury eyewear."
        />
        <meta property="og:image" content="https://prettyvision.in/about_hero_model.jpg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="About PrettyVision — Premium Optical Showroom Kalina"
        />
        <meta
          name="twitter:description"
          content="33+ years of optometric excellence and luxury eyewear in Kalina, Santacruz East, Mumbai."
        />
        <meta name="twitter:image" content="https://prettyvision.in/about_hero_model.jpg" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Render all active sections in order from CMS */}
      <main className="w-full flex flex-col">
        {sections
          .filter((s) => isSectionActive(s.sectionKey))
          .map((sec) => renderSection(sec))}
      </main>
    </PublicLayoutWrapper>
  );
};

/* ============================================================
   CONTACT & VISIT STORE PAGE
   ============================================================ */
export const ContactPage = () => {
  return (
    <PublicLayoutWrapper>
      <div className="bg-[#042041] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200 mb-2">
            PRETTYVISION STORE & CLINIC
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Visit Our Store & Book An Eye Test
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-2 leading-relaxed">
            Conveniently located in Kalina, opposite Nilesh Dryfruits. Drop by anytime or schedule your eye examination appointment below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Details & Store Photo */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl overflow-hidden shadow aspect-[16/10] bg-slate-100">
              <img src="/uploads/store_interior.jpg" alt="PrettyVision Store" className="w-full h-full object-cover" />
            </div>

            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-200 space-y-4 text-xs sm:text-sm">
              <h3 className="font-serif text-lg font-bold text-[#042041]">Store Information</h3>

              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#042041] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#042041] shrink-0" />
                  <a href="tel:09594030310" className="font-bold text-[#042041] hover:underline">
                    095940 30310
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-[#042041] shrink-0" />
                  <span>Mon – Sat: 10:00 AM – 9:30 PM | Sun: 11:00 AM – 8:00 PM</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href="https://maps.google.com/?q=Pretty+Vision+Kalina+Mumbai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#042041] text-white px-5 py-2 text-xs font-bold"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Get Directions</span>
                </a>
                <a
                  href="https://wa.me/919594030310"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white px-5 py-2 text-xs font-bold"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Map & Direct Appointment Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl overflow-hidden shadow border border-slate-200 h-64 sm:h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.835948956972!2d72.8596646!3d19.0709405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e0a3f81e35%3A0xc3b09dc69fb4d23!2sPretty%20Vision!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                title="Google Maps Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#042041] mb-2">
                Send An Enquiry or Appointment Request
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Fill in the details below and our team will get in touch to confirm your consultation.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </PublicLayoutWrapper>
  );
};

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setError("Please provide your name and phone number.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await apiFetch("/appointments", {
        method: "POST",
        body: {
          ...form,
          serviceRequested: "General Consultation & Eye Test"
        }
      });
      setSent(true);
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="p-6 rounded-2xl bg-emerald-50 text-center space-y-2 border border-emerald-200">
        <Check className="h-8 w-8 text-emerald-600 mx-auto" />
        <h4 className="font-serif text-base font-bold text-emerald-900">Message Received!</h4>
        <p className="text-xs text-emerald-700">Thank you. Our team will contact you shortly.</p>
        <button onClick={() => setSent(false)} className="text-xs text-emerald-800 underline font-semibold mt-2">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 text-xs">
      {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-xl">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Anand R."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#042041]"
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
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#042041]"
          />
        </div>
      </div>
      <div>
        <label className="block font-bold text-slate-700 mb-1">Email Address</label>
        <input
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#042041]"
        />
      </div>
      <div>
        <label className="block font-bold text-slate-700 mb-1">Message or Query</label>
        <textarea
          rows={3}
          placeholder="How can we help you?"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#042041]"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#042041] hover:bg-[#0B2A52] text-white py-3 font-bold uppercase tracking-wider text-xs shadow transition"
      >
        {loading ? "Sending..." : "Submit Enquiry"}
      </button>
    </form>
  );
};

/* ============================================================
   10. EYECARE & OPTICAL GUIDE DEDICATED STANDALONE PILLAR PAGE
   ============================================================ */
export const EyecareGuidePage = () => {
  return (
    <PublicLayoutWrapper>
      <div className="w-full bg-[#08264A] text-white py-16 sm:py-24 border-b border-[#0D315A]">
        <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-[0.25em] text-blue-200">
            <span>Clinical Optometry & Luxury Optics</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            The Definitive Eyecare, Precision Optics & Luxury Eyewear Guide
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
            By PrettyVision Optometrists • Shop No 11, Agarwal Building, Kalina, Santacruz East, Mumbai
          </p>
        </div>
      </div>
      <OpticalGuideSection
        sectionData={{
          sectionTitle: "THE COMPLETE EYECARE & EYEWEAR GUIDE",
          sectionSubtitle: "OPTOMETRY EXCELLENCE IN KALINA, MUMBAI"
        }}
      />
    </PublicLayoutWrapper>
  );
};
