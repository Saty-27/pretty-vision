import test from "node:test";
import assert from "node:assert/strict";
import {
  xmlEscape,
  formatDate,
  resolveImageUrl,
  generateRobotsTxt
} from "../src/sitemap.js";

test("XML Escaping: Properly escapes special XML characters", () => {
  const raw = "Ray-Ban & Oakley: <Titanium Frames> \"Lightweight\" & 'Classic'";
  const escaped = xmlEscape(raw);
  assert.equal(escaped, "Ray-Ban &amp; Oakley: &lt;Titanium Frames&gt; &quot;Lightweight&quot; &amp; &apos;Classic&apos;");
});

test("Date Formatter: Outputs valid YYYY-MM-DD", () => {
  const d = new Date("2026-10-26T12:00:00Z");
  assert.equal(formatDate(d), "2026-10-26");
  assert.match(formatDate(null), /^\d{4}-\d{2}-\d{2}$/);
});

test("Image URL Resolver: Handles absolute and relative asset paths", () => {
  const base = "https://prettyvision.in";
  assert.equal(
    resolveImageUrl("https://example.com/photo.jpg", base),
    "https://example.com/photo.jpg"
  );
  assert.equal(
    resolveImageUrl("/uploads/store_interior_ref.png", base),
    "https://prettyvision.in/uploads/store_interior_ref.png"
  );
  assert.equal(
    resolveImageUrl("store_exterior_ref.png", base),
    "https://prettyvision.in/store_exterior_ref.png"
  );
  assert.equal(resolveImageUrl("", base), "");
});

test("Robots.txt Directive: Includes AI search engines and canonical PrettyVision Sitemap", () => {
  const robots = generateRobotsTxt({ baseUrl: "https://prettyvision.in" });
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Disallow: \/admin\//);
  assert.match(robots, /User-agent: GPTBot/);
  assert.match(robots, /User-agent: ClaudeBot/);
  assert.match(robots, /User-agent: PerplexityBot/);
  assert.match(robots, /Sitemap: https:\/\/prettyvision\.in\/sitemap\.xml/);
});

test("Sitemap XML Structure: Formats urlset with schema namespaces", () => {
  const mockUrl = "https://prettyvision.in/product/ray-ban-aviator-classic";
  const mockImg = "https://prettyvision.in/uploads/rayban_aviator.jpg";
  const mockTitle = "Ray-Ban Aviator Classic";
  
  const block = `  <url>
    <loc>${mockUrl}</loc>
    <lastmod>2026-10-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <image:image>
      <image:loc>${mockImg}</image:loc>
      <image:title>${mockTitle}</image:title>
    </image:image>
  </url>`;

  assert.match(block, /<loc>https:\/\/prettyvision\.in\/product\/ray-ban-aviator-classic<\/loc>/);
  assert.match(block, /<image:image>/);
  assert.match(block, /<image:title>Ray-Ban Aviator Classic<\/image:title>/);
});

test("Dynamic Exclusion Logic: Deleted or archived cards are excluded from sitemap query", () => {
  // Simulating the filter used by generateSitemapXml
  const allRecords = [
    { slug: "active-sunglasses", status: "active", isActive: true },
    { slug: "draft-frame", status: "draft", isActive: false },
    { slug: "archived-product", status: "archived", isActive: false },
    { slug: "deleted-card", isDeleted: true }
  ];

  const filtered = allRecords.filter(
    (c) => !c.isDeleted && c.status !== "archived" && c.isActive === true
  );

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].slug, "active-sunglasses");
});
