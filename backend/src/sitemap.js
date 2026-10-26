import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  Product,
  Category,
  Collection,
  Brand,
  Service,
  Blog,
  Page,
  LegalPage,
  SiteSetting
} from "./models.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DEFAULT_BASE_URL = "https://prettyvision.in";

/* Helper to escape XML special characters */
export const xmlEscape = (str = "") => {
  if (typeof str !== "string") str = String(str || "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

/* Resolve full URL for images */
export const resolveImageUrl = (img, baseUrl) => {
  if (!img) return "";
  const cleaned = String(img).trim();
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned;
  }
  const root = baseUrl.replace(/\/+$/, "");
  const rel = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
  return `${root}${rel}`;
};

/* Format ISO date to YYYY-MM-DD */
export const formatDate = (date) => {
  try {
    const d = date ? new Date(date) : new Date();
    if (isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
    return d.toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
};

/* Determine canonical base URL from request or database settings */
export const getBaseUrl = async (req) => {
  try {
    if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, "");
    const setting = await SiteSetting.findOne({ singletonKey: "site" }).lean();
    if (setting?.siteUrl) return setting.siteUrl.replace(/\/+$/, "");
  } catch {
    // fallback
  }

  if (req && req.headers) {
    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      return `${proto}://${host}`.replace(/\/+$/, "");
    }
  }

  return DEFAULT_BASE_URL;
};

/**
 * Generate fully dynamic, AI- and Google-optimized Sitemap XML for PrettyVision.
 * Automatically queries active/published records in real time.
 * If an item/card is deleted or deactivated, it is immediately omitted.
 */
export const generateSitemapXml = async ({ baseUrl = DEFAULT_BASE_URL } = {}) => {
  const root = baseUrl.replace(/\/+$/, "");
  const now = formatDate(new Date());

  // Parallel live database queries for only active/published entities
  const [
    products,
    brands,
    services,
    collections,
    categories,
    blogs,
    pages,
    legalPages
  ] = await Promise.all([
    Product.find({
      isActive: true,
      status: { $ne: "archived" }
    }).sort({ order: 1, updatedAt: -1 }).lean().catch(() => []),

    Brand.find({
      isActive: true,
      status: { $ne: "inactive" }
    }).sort({ order: 1, updatedAt: -1 }).lean().catch(() => []),

    Service.find({
      isActive: true,
      status: { $ne: "inactive" }
    }).sort({ order: 1, updatedAt: -1 }).lean().catch(() => []),

    Collection.find({
      isActive: true,
      status: { $ne: "inactive" }
    }).sort({ order: 1, updatedAt: -1 }).lean().catch(() => []),

    Category.find({
      isActive: true,
      status: { $ne: "inactive" }
    }).sort({ order: 1, updatedAt: -1 }).lean().catch(() => []),

    Blog.find({
      status: { $in: ["published", "active"] }
    }).sort({ publishedAt: -1, updatedAt: -1 }).lean().catch(() => []),

    Page.find({
      status: { $ne: "archived" },
      $or: [{ active: true }, { status: "published" }, { status: "active" }]
    }).sort({ updatedAt: -1 }).lean().catch(() => []),

    LegalPage.find({
      status: { $ne: "inactive" }
    }).sort({ updatedAt: -1 }).lean().catch(() => [])
  ]);

  const items = [];
  const seenUrls = new Set();

  const addUrl = ({
    loc,
    lastmod,
    changefreq = "weekly",
    priority = "0.8",
    image,
    title,
    caption
  }) => {
    if (!loc) return;
    const url = loc.startsWith("http") ? loc : `${root}${loc.startsWith("/") ? loc : `/${loc}`}`;
    if (seenUrls.has(url)) return;
    seenUrls.add(url);

    items.push({
      loc: url,
      lastmod: formatDate(lastmod || now),
      changefreq,
      priority: String(priority),
      image: image ? resolveImageUrl(image, root) : null,
      title: title ? xmlEscape(title) : null,
      caption: caption ? xmlEscape(caption) : null
    });
  };

  /* 1. Core High-Priority Static & Catalog Routes */
  addUrl({
    loc: "/",
    lastmod: now,
    changefreq: "daily",
    priority: "1.0",
    title: "PrettyVision — Premium Eyewear & Optometry Clinic | Kalina, Mumbai",
    caption: "Optometrist, Opticians & Contact Lens Clinic at Shop No 11, Agarwal Building, Market, Kalina, Santacruz East, Mumbai 400098."
  });

  addUrl({
    loc: "/eyewear",
    lastmod: now,
    changefreq: "daily",
    priority: "0.95",
    title: "Eyewear & Optical Frames Catalog — PrettyVision",
    caption: "Browse handcrafted spectacle frames, luxury sunglasses, computer blue-light blockers, and reading glasses."
  });

  addUrl({
    loc: "/brands",
    lastmod: now,
    changefreq: "weekly",
    priority: "0.9",
    title: "Iconic Eyewear Brands — Ray-Ban, Oakley, Vogue, Armani, Versace",
    caption: "100% genuine luxury designer eyewear brands with official warranty and expert lens fitting."
  });

  addUrl({
    loc: "/services",
    lastmod: now,
    changefreq: "weekly",
    priority: "0.9",
    title: "Clinical Optometry & Eye Care Services — PrettyVision",
    caption: "Comprehensive computerized eye examinations, contact lens consultation, and precision lens dispensing."
  });

  addUrl({
    loc: "/about",
    lastmod: now,
    changefreq: "monthly",
    priority: "0.8",
    title: "About PrettyVision — Trusted Opticians & Eye Clinic in Kalina",
    caption: "Established showroom in Kalina, Santacruz East, committed to optical precision, genuine luxury, and clinical excellence."
  });

  addUrl({
    loc: "/contact",
    lastmod: now,
    changefreq: "weekly",
    priority: "0.85",
    title: "Visit Our Store & Book Eye Test — PrettyVision Kalina",
    caption: "Showroom location, phone: 095940 30310, opening hours, and direct Google Maps directions."
  });

  addUrl({
    loc: "/guide",
    lastmod: now,
    changefreq: "monthly",
    priority: "0.8",
    title: "Comprehensive Eye Care & Frame Selection Guide — PrettyVision",
    caption: "Expert optometrist guide on choosing the right frames, lens coatings, UV protection, and digital eye strain prevention."
  });

  addUrl({
    loc: "/guide/comprehensive-eyecare",
    lastmod: now,
    changefreq: "monthly",
    priority: "0.8",
    title: "Comprehensive Eye Care Guide — PrettyVision Clinic",
    caption: "Complete clinical recommendations for healthy vision, spectacle prescriptions, and contact lens hygiene."
  });

  addUrl({
    loc: "/sitemap",
    lastmod: now,
    changefreq: "weekly",
    priority: "0.6",
    title: "PrettyVision Website Sitemap",
    caption: "Full directory index of optical products, designer brands, clinical eye care services, and guides."
  });

  /* 2. Dynamic Optical Products */
  for (const p of products) {
    if (!p.slug) continue;
    addUrl({
      loc: `/product/${p.slug}`,
      lastmod: p.updatedAt || p.createdAt,
      changefreq: "weekly",
      priority: p.isFeatured ? "0.95" : "0.85",
      image: p.mainImage || (p.images && p.images[0]),
      title: `${p.name} — ${p.brand || "PrettyVision"} Eyewear`,
      caption: p.shortDescription || p.fullDescription || `Genuine ${p.brand || "luxury"} ${p.category || "eyewear"} frame available at PrettyVision Kalina.`
    });
  }

  /* 3. Dynamic Designer Brands */
  for (const b of brands) {
    if (!b.slug) continue;
    addUrl({
      loc: `/brands/${b.slug}`,
      lastmod: b.updatedAt || b.createdAt,
      changefreq: "weekly",
      priority: "0.85",
      image: b.brandImage || b.bannerImage || b.logo,
      title: `${b.name} Eyewear Collection at PrettyVision`,
      caption: b.description || `Explore authentic ${b.name} sunglasses and prescription frames at PrettyVision Kalina, Mumbai.`
    });
  }

  /* 4. Dynamic Clinical Services */
  for (const s of services) {
    if (!s.slug) continue;
    addUrl({
      loc: `/services/${s.slug}`,
      lastmod: s.updatedAt || s.createdAt,
      changefreq: "weekly",
      priority: "0.85",
      image: s.image,
      title: `${s.title} — PrettyVision Eye Care Clinic`,
      caption: s.shortDescription || s.fullDescription || `Professional ${s.title} by qualified optometrists in Kalina, Santacruz East, Mumbai.`
    });
  }

  /* 5. Dynamic Eyewear Collections */
  for (const c of collections) {
    const slugOrUrl = c.destinationUrl?.startsWith("/")
      ? c.destinationUrl
      : (c.slug ? `/eyewear?collection=${c.slug}` : null);
    if (!slugOrUrl) continue;

    addUrl({
      loc: slugOrUrl,
      lastmod: c.updatedAt || c.createdAt,
      changefreq: "weekly",
      priority: "0.8",
      image: c.image,
      title: `${c.title} — PrettyVision Eyewear Collection`,
      caption: c.description || c.subtitle || `Handpicked ${c.title} sunglasses and spectacle frames at PrettyVision.`
    });
  }

  /* 6. Dynamic Eyewear Categories */
  for (const cat of categories) {
    const slugOrUrl = (cat.destinationUrl?.startsWith("/") && cat.destinationUrl !== "/eyewear")
      ? cat.destinationUrl
      : (cat.slug ? `/eyewear?category=${cat.slug}` : null);
    if (!slugOrUrl) continue;

    addUrl({
      loc: slugOrUrl,
      lastmod: cat.updatedAt || cat.createdAt,
      changefreq: "weekly",
      priority: "0.8",
      image: cat.image,
      title: `${cat.title} — PrettyVision Eyewear`,
      caption: cat.subtitle || `Browse premium ${cat.title} at PrettyVision optical showroom Kalina.`
    });
  }

  /* 7. Dynamic Vision & Optical Blogs */
  for (const blog of blogs) {
    if (!blog.slug) continue;
    addUrl({
      loc: `/blogs/${blog.slug}`,
      lastmod: blog.updatedAt || blog.publishedAt || blog.createdAt,
      changefreq: "weekly",
      priority: "0.75",
      image: blog.image,
      title: blog.title,
      caption: blog.shortDescription || blog.summary || blog.title
    });
  }

  /* 8. Dynamic CMS Pages */
  const reservedSlugs = new Set(["home", "about", "contact", "eyewear", "services", "brands", "guide", "sitemap"]);
  for (const pg of pages) {
    if (!pg.slug || reservedSlugs.has(pg.slug.toLowerCase())) continue;
    addUrl({
      loc: `/${pg.slug}`,
      lastmod: pg.updatedAt || pg.createdAt,
      changefreq: "monthly",
      priority: "0.7",
      image: pg.bannerImage,
      title: pg.title,
      caption: pg.excerpt
    });
  }

  /* 9. Dynamic Legal & Policy Pages */
  for (const leg of legalPages) {
    if (!leg.slug) continue;
    addUrl({
      loc: `/${leg.slug}`,
      lastmod: leg.updatedAt || leg.createdAt,
      changefreq: "monthly",
      priority: "0.5",
      title: `${leg.title} — PrettyVision`,
      caption: "Store policy, privacy, and customer terms of PrettyVision."
    });
  }

  // Build XML payload with full schema namespaces
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- Dynamic Real-Time Google- & AI-Optimized Sitemap for PrettyVision -->
  <!-- Total Indexed URLs: ${items.length} | Generated: ${new Date().toISOString()} -->
`;

  for (const item of items) {
    xml += `  <url>\n`;
    xml += `    <loc>${xmlEscape(item.loc)}</loc>\n`;
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;

    if (item.image) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${xmlEscape(item.image)}</image:loc>\n`;
      if (item.title) {
        xml += `      <image:title>${item.title}</image:title>\n`;
      }
      if (item.caption) {
        xml += `      <image:caption>${item.caption.slice(0, 500)}</image:caption>\n`;
      }
      xml += `    </image:image>\n`;
    }

    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  return {
    xml,
    total: items.length,
    counts: {
      products: products.length,
      brands: brands.length,
      services: services.length,
      collections: collections.length,
      categories: categories.length,
      blogs: blogs.length,
      pages: pages.length,
      legalPages: legalPages.length
    }
  };
};

/**
 * Generate robots.txt specifically optimized for PrettyVision:
 * - Googlebot, Bingbot, Slurp, DuckDuckBot
 * - AI Crawlers (GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Applebot, Google-Extended)
 * - Declaring canonical Sitemap location
 */
export const generateRobotsTxt = ({ baseUrl = DEFAULT_BASE_URL } = {}) => {
  const root = baseUrl.replace(/\/+$/, "");
  return `# PrettyVision Robots Directive
# Dynamically Generated for Maximum Search & AI Engine Optimization

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/
Disallow: /login
Disallow: /register
Disallow: /verify-otp
Disallow: /forgot-password
Disallow: /request-password-reset

# OpenAI Search & Crawlers (ChatGPT Web Browsing & Search)
User-agent: GPTBot
Allow: /
Disallow: /admin/
Disallow: /api/admin/

User-agent: ChatGPT-User
Allow: /

# Anthropic Claude AI Search
User-agent: ClaudeBot
Allow: /
Disallow: /admin/
Disallow: /api/admin/

# Perplexity AI Engine
User-agent: PerplexityBot
Allow: /

# Google Gemini & Search Extended
User-agent: Google-Extended
Allow: /

# Apple Intelligence
User-agent: Applebot-Extended
Allow: /

# Canonical Sitemap
Sitemap: ${root}/sitemap.xml
`;
};

/**
 * Generate llms.txt (The Open AI Web Standard for Large Language Models).
 * When ChatGPT, Claude, Perplexity visit /llms.txt,
 * they receive a structured overview of PrettyVision optical showroom and clinic.
 */
export const generateLlmsTxt = async ({ baseUrl = DEFAULT_BASE_URL } = {}) => {
  const root = baseUrl.replace(/\/+$/, "");

  const [products, brands, services, blogs] = await Promise.all([
    Product.find({ isActive: true }).limit(10).lean().catch(() => []),
    Brand.find({ isActive: true }).limit(10).lean().catch(() => []),
    Service.find({ isActive: true }).limit(10).lean().catch(() => []),
    Blog.find({ status: { $in: ["published", "active"] } }).limit(5).lean().catch(() => [])
  ]);

  let md = `# PrettyVision — Optometrist • Opticians • Contact Lens Clinic

> Premium optical showroom and eye care clinic located in Kalina, Santacruz East, Mumbai. Providing authentic luxury eyewear brands (Ray-Ban, Oakley, Vogue, Armani, etc.), computerized eye tests, and customized prescription glasses.

- Canonical Website: ${root}
- Sitemap: ${root}/sitemap.xml
- Store Address: Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098
- Phone: 095940 30310
- Hours: Monday – Saturday: 10:00 AM – 9:30 PM | Sunday: 11:00 AM – 8:00 PM

## Core Showroom Hubs
- [Home Page](${root}/): Showroom highlights, featured eyewear, and store visit details.
- [Eyewear Catalog](${root}/eyewear): Spectacle frames, sunglasses, computer blue-light lenses.
- [Designer Brands](${root}/brands): 100% genuine luxury optical brands with warranty.
- [Eye Care Services](${root}/services): Clinical optometrist consultations and lens fittings.
- [About PrettyVision](${root}/about): Showroom heritage and optometry expertise in Kalina.
- [Contact & Store Visit](${root}/contact): Directions, appointments, and contact form.
- [Eye Care Guide](${root}/guide): Vision health, frame fitting, and lens care guides.

## Featured Eyewear Products
`;

  for (const p of products) {
    md += `- [${p.name}](${root}/product/${p.slug}): ${p.brand || "PrettyVision"} - ${p.category || "Eyewear"} (${p.frameType || "Frame"})\n`;
  }

  md += `\n## Iconic Designer Brands\n`;
  for (const b of brands) {
    md += `- [${b.name}](${root}/brands/${b.slug}): ${b.description || "Authentic eyewear collection."}\n`;
  }

  md += `\n## Clinical Optometry Services\n`;
  for (const s of services) {
    md += `- [${s.title}](${root}/services/${s.slug}): ${s.shortDescription || "Clinical eye care service."}\n`;
  }

  if (blogs.length > 0) {
    md += `\n## Vision Health & Eyewear Articles\n`;
    for (const bl of blogs) {
      md += `- [${bl.title}](${root}/blogs/${bl.slug}): ${bl.summary || bl.title}\n`;
    }
  }

  return md;
};

/**
 * Write sitemap.xml and robots.txt to static dist/public paths if available.
 * Keeps disk copies synchronized alongside dynamic Express routes.
 */
export const writeSitemapToDisk = async (baseUrl) => {
  try {
    const { xml } = await generateSitemapXml({ baseUrl });
    const robots = generateRobotsTxt({ baseUrl });
    const llms = await generateLlmsTxt({ baseUrl });

    const targetDirs = [
      path.resolve(__dirname, "../../frontend/dist"),
      path.resolve(__dirname, "../../frontend/public"),
      path.resolve(__dirname, "../public")
    ];

    for (const dir of targetDirs) {
      if (fs.existsSync(dir)) {
        try {
          fs.writeFileSync(path.join(dir, "sitemap.xml"), xml, "utf8");
          fs.writeFileSync(path.join(dir, "robots.txt"), robots, "utf8");
          fs.writeFileSync(path.join(dir, "llms.txt"), llms, "utf8");
        } catch {
          // ignore permission errors on non-writable paths
        }
      }
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
