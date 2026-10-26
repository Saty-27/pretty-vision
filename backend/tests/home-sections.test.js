import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_HOMEPAGE_SECTIONS } from "../src/homepageSectionsConfig.js";

test("Default Homepage Sections: Covers all 12 PrettyVision sections", () => {
  assert.equal(DEFAULT_HOMEPAGE_SECTIONS.length, 12);

  const keys = DEFAULT_HOMEPAGE_SECTIONS.map((s) => s.sectionKey);
  const expectedKeys = [
    "hero",
    "feature_highlights",
    "collections",
    "categories",
    "brand_showcase",
    "brand_strip",
    "services",
    "store_visit",
    "gallery",
    "blog",
    "testimonials",
    "final_cta"
  ];

  for (const expected of expectedKeys) {
    assert.ok(keys.includes(expected), `Missing section key: ${expected}`);
  }
});

test("Default Metadata: Every section has valid routePath and initial active state", () => {
  for (const s of DEFAULT_HOMEPAGE_SECTIONS) {
    assert.ok(s.sectionKey, "Must have sectionKey");
    assert.ok(s.sectionName, "Must have sectionName");
    assert.ok(typeof s.routePath === "string", "Must have routePath");
    assert.equal(s.homepageVisible, true, `${s.sectionKey} must be visible on homepage by default`);
    assert.equal(s.websiteEnabled, true, `${s.sectionKey} must be enabled on website by default`);
  }
});

test("Visibility Matrix: Option 1 (Disable from Homepage Only) logic", () => {
  const payload = { homepageVisible: false, websiteEnabled: true };
  
  const isVisibleOnHome = payload.homepageVisible !== false && payload.websiteEnabled !== false;
  const isAccessibleOnWebsite = payload.websiteEnabled !== false;

  assert.equal(isVisibleOnHome, false, "Must be hidden from homepage");
  assert.equal(isAccessibleOnWebsite, true, "Must remain active and accessible on website/navbar");
});

test("Visibility Matrix: Option 2 (Disable from Entire Website) logic", () => {
  const payload = { homepageVisible: false, websiteEnabled: false };

  const isVisibleOnHome = payload.homepageVisible !== false && payload.websiteEnabled !== false;
  const isAccessibleOnWebsite = payload.websiteEnabled !== false;

  assert.equal(isVisibleOnHome, false, "Must be hidden from homepage");
  assert.equal(isAccessibleOnWebsite, false, "Must be completely disabled on website/navbar/routes");
});

test("Visibility Matrix: Enable Everywhere restores both flags", () => {
  const payload = { homepageVisible: true, websiteEnabled: true };

  const isVisibleOnHome = payload.homepageVisible !== false && payload.websiteEnabled !== false;
  const isAccessibleOnWebsite = payload.websiteEnabled !== false;

  assert.equal(isVisibleOnHome, true, "Must be visible on homepage");
  assert.equal(isAccessibleOnWebsite, true, "Must be active on website");
});

test("Section Merging: Overrides from database take precedence over defaults", () => {
  const defaultCollections = DEFAULT_HOMEPAGE_SECTIONS.find((s) => s.sectionKey === "collections");
  assert.ok(defaultCollections);

  const dbRecord = {
    sectionKey: "collections",
    sectionTitle: "Custom Collections Heading",
    homepageVisible: false,
    websiteEnabled: true
  };

  const merged = {
    ...defaultCollections,
    ...dbRecord
  };

  assert.equal(merged.sectionKey, "collections");
  assert.equal(merged.sectionName, "Explore Our Collections");
  assert.equal(merged.sectionTitle, "Custom Collections Heading");
  assert.equal(merged.homepageVisible, false);
  assert.equal(merged.websiteEnabled, true);
  assert.equal(merged.routePath, "/eyewear");
});
