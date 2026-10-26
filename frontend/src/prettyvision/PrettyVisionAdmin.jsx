import React, { useState, useEffect } from "react";
import { apiFetch, uploadFile, assetUrl } from "../api";
import { notifyHomepageSectionsUpdated } from "../useHomepageSections";
import { notifyAboutSectionsUpdated } from "../useAboutSections";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  Upload,
  Search,
  ExternalLink,
  Star,
  Copy,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Glasses,
  Image as ImageIcon,
  Sliders,
  Settings,
  Shield,
  Layers,
  Save,
  Monitor,
  Tablet,
  Smartphone,
  Users,
  Award,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Tag,
  Globe,
  Filter,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Gem,
  AlertCircle,
  AlertTriangle
} from "lucide-react";

/* ============================================================
   REUSABLE MEDIA UPLOADER WITH SCREEN SIZE & RESOLUTION SENSING
   ============================================================ */
export const MediaUploaderWithScreenSize = ({
  label,
  value,
  onChange,
  folder = "general",
  targetScreen = "Desktop",
  screenBadge = "🖥️ Desktop Screen (≥ 1024px)",
  recommendedDimensions = "1920 × 820 px",
  aspectRatio = "16:7",
  helperText,
  accept = "image/*",
  placeholder = "/uploads/... or paste URL"
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [measured, setMeasured] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const img = new window.Image();
      img.onload = () => {
        setMeasured({
          width: img.naturalWidth,
          height: img.naturalHeight,
          kb: (file.size / 1024).toFixed(0),
          ratio: (img.naturalWidth / img.naturalHeight).toFixed(2)
        });
      };
      img.src = URL.createObjectURL(file);
    }

    try {
      setUploading(true);
      setError("");
      const res = await uploadFile(file, folder);
      onChange(res.url);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const screenIcon =
    targetScreen === "Mobile" ? (
      <Smartphone className="h-3.5 w-3.5 text-sky-600 shrink-0" />
    ) : targetScreen === "Tablet" ? (
      <Tablet className="h-3.5 w-3.5 text-sky-600 shrink-0" />
    ) : (
      <Monitor className="h-3.5 w-3.5 text-sky-600 shrink-0" />
    );

  return (
    <div className="space-y-2 p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
      {/* Screen Size & Dimension Header */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
          {screenIcon}
          <span>{label}</span>
        </label>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            {screenBadge}
          </span>
          {recommendedDimensions && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-900 font-bold border border-sky-200/80">
              📐 Rec: {recommendedDimensions} {aspectRatio ? `(${aspectRatio})` : ""}
            </span>
          )}
        </div>
      </div>

      {helperText && <p className="text-[11px] text-slate-500 leading-normal">{helperText}</p>}

      {/* Input Row with Thumbnail & Upload Button */}
      <div className="flex items-center gap-2.5 pt-1">
        {value && (
          <div className="h-10 w-14 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative group">
            <img src={assetUrl(value)} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#042041]"
        />
        <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-[#042041] hover:bg-[#0B2A52] text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs">
          <Upload className="h-3.5 w-3.5" />
          <span>{uploading ? "Uploading..." : "Upload"}</span>
          <input type="file" accept={accept} className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      {/* Detected Dimensions Banner */}
      {measured && (
        <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
          <span className="flex items-center gap-1.5">
            <Check className="h-3 w-3 text-emerald-600" />
            <span>Measured Dimensions: <strong className="font-mono">{measured.width} × {measured.height} px</strong></span>
            <span className="text-emerald-700">({measured.kb} KB • {measured.ratio}:1 aspect)</span>
          </span>
          <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider">
            Optimized for {targetScreen}
          </span>
        </div>
      )}

      {error && <p className="text-[11px] font-bold text-rose-600">{error}</p>}
    </div>
  );
};

/* ============================================================
   INLINE CATEGORIES MANAGER (FOR "SHOP BY TYPE" SECTION)
   ============================================================ */
const InlineCategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchCats = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/admin/categories");
      setCategories(res.items || res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleToggle = async (cat) => {
    try {
      await apiFetch(`/admin/categories/${cat._id}`, {
        method: "PUT",
        body: { ...cat, isActive: !cat.isActive }
      });
      notifyHomepageSectionsUpdated();
      fetchCats();
    } catch (e) {
      alert("Failed to toggle category: " + e.message);
    }
  };

  const handleSaveCat = async (e) => {
    e.preventDefault();
    if (!editingCat) return;
    try {
      setSaving(true);
      await apiFetch(`/admin/categories/${editingCat._id}`, {
        method: "PUT",
        body: catForm
      });
      notifyHomepageSectionsUpdated();
      setEditingCat(null);
      fetchCats();
    } catch (e) {
      alert("Failed to save category: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 pt-3 border-t border-slate-200">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
          Individual Categories ({categories.length})
        </h4>
        <span className="text-[11px] text-slate-400">#EEF1F4 placeholder if image is empty</span>
      </div>

      {loading ? (
        <p className="text-xs text-slate-400">Loading categories...</p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {categories.map((c) => (
            <div
              key={c._id}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#EEF1F4] border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                  {c.image ? (
                    <img src={assetUrl(c.image)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Glasses className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-800 truncate">{c.title}</p>
                  <p className="text-[11px] text-slate-500 truncate">{c.subtitle || c.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggle(c)}
                  className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    c.isActive !== false ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {c.isActive !== false ? "Active" : "Hidden"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCat(c);
                    setCatForm({
                      title: c.title || "",
                      subtitle: c.subtitle || "",
                      destinationUrl: c.destinationUrl || "",
                      image: c.image || ""
                    });
                  }}
                  className="p-1 rounded-lg hover:bg-white text-slate-600 border border-transparent hover:border-slate-200 transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingCat && (
        <div className="p-3 bg-white rounded-xl border border-sky-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-xs text-slate-800">Edit Category: {editingCat.title}</h5>
            <button
              type="button"
              onClick={() => setEditingCat(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Title</label>
              <input
                type="text"
                value={catForm.title}
                onChange={(e) => setCatForm({ ...catForm, title: e.target.value })}
                className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Subtitle / Description</label>
              <input
                type="text"
                value={catForm.subtitle}
                onChange={(e) => setCatForm({ ...catForm, subtitle: e.target.value })}
                className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Destination Link</label>
            <input
              type="text"
              value={catForm.destinationUrl}
              onChange={(e) => setCatForm({ ...catForm, destinationUrl: e.target.value })}
              className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-300"
            />
          </div>
          <MediaUploaderWithScreenSize
            label="Category Image (Optional)"
            value={catForm.image}
            onChange={(val) => setCatForm({ ...catForm, image: val })}
            folder="categories"
            targetScreen="Desktop"
            screenBadge="🖥️ Horizontal Card Photo (16:10 ratio)"
            recommendedDimensions="600 × 380 px"
            aspectRatio="16:10"
            helperText="Leave empty to use the sleek #EEF1F4 neutral placeholder. Upload when final real product photo is ready."
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setEditingCat(null)}
              className="px-3 py-1 rounded-lg border border-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveCat}
              className="px-4 py-1 rounded-lg bg-[#08264A] text-white text-xs font-bold"
            >
              {saving ? "Saving..." : "Update Category"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   1. ADMIN HOMEPAGE SECTIONS MANAGER
   ============================================================ */
export const AdminHomepageSections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const loadSections = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/homepage-sections");
      setSections(res.sections || res.items || []);
    } catch (err) {
      setNotice("Failed to load homepage sections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const toggleVisibility = async (sec) => {
    try {
      const newVisible = sec.homepageVisible === false ? true : false;
      await apiFetch(`/admin/homepage-sections/${sec.sectionKey}/visibility`, {
        method: "PUT",
        body: {
          homepageVisible: newVisible,
          websiteEnabled: sec.websiteEnabled !== false
        }
      });
      notifyHomepageSectionsUpdated();
      loadSections();
    } catch (err) {
      alert(err.message || "Failed to toggle visibility.");
    }
  };

  const moveSection = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setSections(reordered);

    try {
      await apiFetch("/admin/homepage-sections/reorder", {
        method: "PUT",
        body: { orderedKeys: reordered.map((s) => s.sectionKey) }
      });
      notifyHomepageSectionsUpdated();
    } catch (err) {
      alert("Failed to save reorder.");
      loadSections();
    }
  };

  const openEdit = (sec) => {
    setEditingSection(sec);
    if (sec.sectionKey === "store_visit") {
      const existing = sec.content || {};
      setForm({
        sectionTitle: sec.sectionTitle || existing.storeName || "PRETTY VISION KALINA",
        sectionSubtitle: sec.sectionSubtitle || existing.eyebrow || "VISIT OUR STORE",
        description: sec.description || existing.address || "Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098",
        content: {
          storeName: existing.storeName || sec.sectionTitle || "PRETTY VISION KALINA",
          eyebrow: existing.eyebrow || sec.sectionSubtitle || "VISIT OUR STORE",
          address: existing.address || sec.description || "Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098",
          phone: existing.phone || "095940 30310",
          hours: existing.hours || "Monday – Saturday: 10:00 AM – 9:30 PM\nSunday: 11:00 AM – 8:00 PM",
          button1Text: existing.button1Text || "Get Directions",
          button1Link: existing.button1Link || "https://maps.google.com/?q=Pretty+Vision+Kalina+Mumbai",
          button2Text: existing.button2Text || "095940 30310",
          button2Link: existing.button2Link || "tel:09594030310",
          interiorImage: existing.interiorImage || "/store_interior_ref.png",
          exteriorImage: existing.exteriorImage || "/store_exterior_ref.png"
        }
      });
      return;
    }
    setForm({
      sectionTitle: sec.sectionTitle || "",
      sectionSubtitle: sec.sectionSubtitle || "",
      description: sec.description || "",
      content: sec.content || {}
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editingSection) return;
    try {
      setSaving(true);
      const payload = { ...form };
      if (editingSection.sectionKey === "store_visit") {
        payload.sectionTitle = form.content?.storeName || form.sectionTitle;
        payload.sectionSubtitle = form.content?.eyebrow || form.sectionSubtitle;
        payload.description = form.content?.address || form.description;
      }
      await apiFetch(`/admin/homepage-sections/${editingSection.sectionKey}`, {
        method: "PUT",
        body: payload
      });
      notifyHomepageSectionsUpdated();
      setEditingSection(null);
      loadSections();
    } catch (err) {
      alert(err.message || "Failed to update section.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Homepage Section Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Drag, reorder, enable/disable, and edit content for every section of the PrettyVision homepage.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading sections...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          {sections.map((sec, idx) => {
            const isVisible = sec.homepageVisible !== false && sec.status !== "inactive";
            return (
              <div
                key={sec.sectionKey}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  !isVisible ? "bg-slate-50 opacity-60" : "hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveSection(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-slate-200 disabled:opacity-20 text-slate-600 transition"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveSection(idx, 1)}
                      disabled={idx === sections.length - 1}
                      className="p-1 rounded hover:bg-slate-200 disabled:opacity-20 text-slate-600 transition"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                    {idx + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {sec.sectionName || sec.sectionKey}
                      </h3>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {sec.sectionKey}
                      </span>
                    </div>
                    {sec.sectionTitle && (
                      <p className="text-xs text-slate-500 mt-0.5 font-serif italic">
                        "{sec.sectionTitle}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => toggleVisibility(sec)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isVisible
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    {isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    <span>{isVisible ? "Active / Visible" : "Hidden"}</span>
                  </button>

                  <button
                    onClick={() => openEdit(sec)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#042041] hover:bg-[#0B2A52] text-white text-xs font-bold transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            className={`bg-white rounded-3xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto ${
              editingSection.sectionKey === "store_visit" ||
              editingSection.sectionKey === "brand_showcase" ||
              editingSection.sectionKey === "categories"
                ? "max-w-3xl"
                : "max-w-lg"
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Edit {editingSection.sectionName}
                </h3>
                <p className="text-xs text-slate-400 font-mono">{editingSection.sectionKey}</p>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveEdit} className="space-y-4 text-xs">
              {editingSection.sectionKey !== "store_visit" && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Section Heading (Title)</label>
                    <input
                      type="text"
                      value={form.sectionTitle}
                      onChange={(e) => setForm({ ...form, sectionTitle: e.target.value })}
                      placeholder="e.g. FRAMES FOR EVERY STYLE"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#042041]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Section Subheading (Eyebrow)</label>
                    <input
                      type="text"
                      value={form.sectionSubtitle}
                      onChange={(e) => setForm({ ...form, sectionSubtitle: e.target.value })}
                      placeholder="e.g. EXPLORE OUR COLLECTIONS"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#042041]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Section Description</label>
                    <textarea
                      rows={2}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#042041]"
                    />
                  </div>
                </>
              )}

              {/* Comprehensive Our Brands Promotional Banner Controls */}
              {editingSection.sectionKey === "brand_showcase" && (
                <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="border-b border-slate-200 pb-2">
                    <h4 className="font-bold text-slate-900 text-sm">Our Brands Banner Configuration</h4>
                    <p className="text-[11px] text-slate-500">
                      Configure the single full-width promotional strip, primary action, featured brand block, and visual photography.
                    </p>
                  </div>

                  {/* Primary Action Button */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800 text-xs">Primary Button (Left)</label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.content?.button1Enabled !== false}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, button1Enabled: e.target.checked }
                            })
                          }
                          className="rounded border-slate-300 text-[#08264A]"
                        />
                        <span>Enabled</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-0.5">Button Text</label>
                        <input
                          type="text"
                          value={form.content?.button1Text || "View All Brands"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, button1Text: e.target.value }
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-0.5">Button Link</label>
                        <input
                          type="text"
                          value={form.content?.button1Link || "/brands"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, button1Link: e.target.value }
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Featured Brand Block (Right) */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800 text-xs">Featured Brand Block (Right)</label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.content?.featuredEnabled !== false}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, featuredEnabled: e.target.checked }
                            })
                          }
                          className="rounded border-slate-300 text-[#08264A]"
                        />
                        <span>Enabled</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-0.5">Brand Name</label>
                        <input
                          type="text"
                          value={form.content?.brandName || "Ray-Ban"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, brandName: e.target.value }
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-0.5">Tagline (period separates lines)</label>
                        <input
                          type="text"
                          value={form.content?.tagline || "FRESH STYLES. FRESH COLOURS."}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, tagline: e.target.value }
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-0.5">Secondary Button Text</label>
                        <input
                          type="text"
                          value={form.content?.button2Text || "Explore Ray-Ban"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, button2Text: e.target.value }
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-0.5">Secondary Button Link</label>
                        <input
                          type="text"
                          value={form.content?.button2Link || "/brands/ray-ban"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, button2Link: e.target.value }
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>

                    <MediaUploaderWithScreenSize
                      label="Featured Brand Logo (White/Transparent PNG/SVG)"
                      value={form.content?.brandLogo || "/rayban_logo_white.png"}
                      onChange={(val) =>
                        setForm({
                          ...form,
                          content: { ...form.content, brandLogo: val }
                        })
                      }
                      folder="brands"
                      targetScreen="Desktop"
                      screenBadge="🏷️ Brand Script Logo"
                      recommendedDimensions="200 × 80 px"
                      aspectRatio="2.5:1"
                      helperText="Rendered in white cursive/script on the right side of the promotional banner."
                    />
                  </div>

                  {/* Eyewear Image & Visual Positioning */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-3">
                    <label className="font-bold text-slate-800 text-xs block">Banner Eyewear Visual Layer</label>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-0.5">Image Position</label>
                        <select
                          value={form.content?.imagePosition || "center"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, imagePosition: e.target.value }
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="center">Center / Slight Right (Recommended)</option>
                          <option value="right">Far Right</option>
                          <option value="left">Left Aligned</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-0.5">Image Fit</label>
                        <select
                          value={form.content?.imageFit || "contain"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, imageFit: e.target.value }
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="contain">Contain (Crisp frame silhouette)</option>
                          <option value="cover">Cover (Full bleed)</option>
                        </select>
                      </div>
                    </div>

                    <MediaUploaderWithScreenSize
                      label="Desktop Banner Eyewear Image"
                      value={form.content?.desktopImage || form.content?.image || "/brand_sunglasses_feathered.png"}
                      onChange={(val) =>
                        setForm({
                          ...form,
                          content: { ...form.content, desktopImage: val, image: val }
                        })
                      }
                      folder="brands"
                      targetScreen="Desktop"
                      screenBadge="🖥️ Desktop Banner Visual (≥ 1024px)"
                      recommendedDimensions="1200 × 400 px"
                      aspectRatio="3:1"
                      helperText="High-resolution eyewear visual seamlessly blended into the navy background."
                    />

                    <MediaUploaderWithScreenSize
                      label="Mobile Banner Eyewear Image (Optional)"
                      value={form.content?.mobileImage || ""}
                      onChange={(val) =>
                        setForm({
                          ...form,
                          content: { ...form.content, mobileImage: val }
                        })
                      }
                      folder="brands"
                      targetScreen="Mobile"
                      screenBadge="📱 Mobile Banner Visual (< 768px)"
                      recommendedDimensions="800 × 400 px"
                      aspectRatio="2:1"
                      helperText="Optional specific crop for smartphone viewports. Uses desktop image if empty."
                    />
                  </div>
                </div>
              )}

              {/* Individual Categories Manager when editing Shop By Type */}
              {editingSection.sectionKey === "categories" && (
                <InlineCategoriesManager />
              )}

              {/* Visit Our Store 3-Column Architectural Configuration */}
              {editingSection.sectionKey === "store_visit" && (
                <div className="space-y-5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="border-b border-slate-200 pb-2.5">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>Visit Our Store — 3-Column Composition</span>
                      <span className="text-[10px] bg-[#08264A] text-white px-2 py-0.5 rounded font-mono font-normal">
                        Architectural Layout
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Unified full-width composition: Left Store Interior Image (~46%) + Center White Info Panel (~26%) + Right Store Exterior Image (~28%).
                    </p>
                  </div>

                  {/* Live 3-Column Architectural Preview */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Live Layout Preview
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Matches Homepage Exactly
                      </span>
                    </div>

                    <div className="w-full bg-[#F6F8FA] p-3 rounded-xl border border-slate-200">
                      <div className="w-full bg-white rounded-lg border border-[#DCE3EA] overflow-hidden grid grid-cols-1 md:grid-cols-[1.35fr_0.75fr_1fr] items-stretch shadow-xs text-left">
                        {/* Col 1: Interior Photo */}
                        <div className="relative min-h-[140px] md:min-h-full bg-[#EEF1F4] border-b md:border-b-0 md:border-r border-[#E2E8F0] overflow-hidden">
                          {form.content?.interiorImage ? (
                            <img
                              src={assetUrl(form.content.interiorImage)}
                              alt="Interior"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-[11px]">
                              No Interior Image
                            </div>
                          )}
                          <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                            LEFT ~46% • INTERIOR
                          </span>
                        </div>

                        {/* Col 2: Center Info */}
                        <div className="p-3 flex flex-col justify-between space-y-2 bg-white">
                          <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#64748B]">
                              {form.content?.eyebrow || form.sectionSubtitle || "VISIT OUR STORE"}
                            </p>
                            <h4 className="font-serif text-sm font-bold text-[#08264A] leading-tight mt-0.5">
                              {form.content?.storeName || form.sectionTitle || "PRETTY VISION KALINA"}
                            </h4>
                            <div className="w-full border-b border-slate-200 my-1.5" />
                            <div className="space-y-1 text-[10px] text-slate-700">
                              <div className="flex items-start gap-1">
                                <MapPin className="w-3 h-3 text-[#08264A] shrink-0 mt-0.5" />
                                <span className="line-clamp-2 leading-tight">
                                  {form.content?.address || form.description}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-[#08264A] shrink-0" />
                                <span className="font-medium text-[#08264A]">
                                  {form.content?.phone || "095940 30310"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            <div className="bg-[#08264A] text-white text-[9px] font-bold text-center py-1 rounded-[3px] truncate px-1">
                              {form.content?.button1Text || "Get Directions"}
                            </div>
                            <div className="border border-slate-300 text-[#08264A] text-[9px] font-bold text-center py-1 rounded-[3px] truncate px-1">
                              {form.content?.button2Text || "Phone"}
                            </div>
                          </div>
                        </div>

                        {/* Col 3: Exterior Photo */}
                        <div className="relative min-h-[140px] md:min-h-full bg-[#EEF1F4] border-t md:border-t-0 md:border-l border-[#E2E8F0] overflow-hidden">
                          {form.content?.exteriorImage ? (
                            <img
                              src={assetUrl(form.content.exteriorImage)}
                              alt="Exterior"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-[11px]">
                              No Exterior Image
                            </div>
                          )}
                          <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                            RIGHT ~28% • EXTERIOR
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 1: Store Interior Photo */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b pb-1.5">
                      <span className="font-bold text-slate-800 text-xs">
                        1. Left Column: Store Interior Photo (~46% width)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Showroom Interior View
                      </span>
                    </div>

                    <MediaUploaderWithScreenSize
                      label="Store Interior Showroom Photo"
                      value={form.content?.interiorImage || "/store_interior_ref.png"}
                      onChange={(val) =>
                        setForm({
                          ...form,
                          content: { ...form.content, interiorImage: val }
                        })
                      }
                      folder="store"
                      targetScreen="Desktop"
                      screenBadge="🏛️ Left Column (~46%) • Showroom Interior"
                      recommendedDimensions="1200 × 800 px"
                      aspectRatio="3:2 Landscape"
                      helperText="High-resolution photography showing store interior, eyewear displays, and consulting counters."
                    />
                  </div>

                  {/* COLUMN 2: Store Information Panel */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b pb-1.5">
                      <span className="font-bold text-slate-800 text-xs">
                        2. Center Column: Store Information Panel (~26% width)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        White Architectural Card
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Eyebrow Subheading
                        </label>
                        <input
                          type="text"
                          value={form.content?.eyebrow || form.sectionSubtitle || "VISIT OUR STORE"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              sectionSubtitle: e.target.value,
                              content: { ...form.content, eyebrow: e.target.value }
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                          placeholder="VISIT OUR STORE"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Store Name / Heading
                        </label>
                        <input
                          type="text"
                          value={form.content?.storeName || form.sectionTitle || "PRETTY VISION KALINA"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              sectionTitle: e.target.value,
                              content: { ...form.content, storeName: e.target.value }
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                          placeholder="PRETTY VISION KALINA"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Physical Store Address
                      </label>
                      <textarea
                        rows={2}
                        value={form.content?.address || form.description || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            description: e.target.value,
                            content: { ...form.content, address: e.target.value }
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                        placeholder="Shop No 11, Agarwal Building, Market, Kalina..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={form.content?.phone || "095940 30310"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, phone: e.target.value }
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                          placeholder="095940 30310"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Opening Hours
                        </label>
                        <textarea
                          rows={2}
                          value={form.content?.hours || "Monday – Saturday: 10:00 AM – 9:30 PM\nSunday: 11:00 AM – 8:00 PM"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, hours: e.target.value }
                            })
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                          placeholder="Monday – Saturday: 10:00 AM – 9:30 PM..."
                        />
                      </div>
                    </div>

                    <div className="border-t pt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Button 1 */}
                      <div className="space-y-1.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <label className="block text-[11px] font-bold text-slate-800">
                          Primary Button (Solid Navy)
                        </label>
                        <input
                          type="text"
                          value={form.content?.button1Text || "Get Directions"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, button1Text: e.target.value }
                            })
                          }
                          className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                          placeholder="Button Text"
                        />
                        <input
                          type="text"
                          value={form.content?.button1Link || "https://maps.google.com/?q=Pretty+Vision+Kalina+Mumbai"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, button1Link: e.target.value }
                            })
                          }
                          className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                          placeholder="Directions URL"
                        />
                      </div>

                      {/* Button 2 */}
                      <div className="space-y-1.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <label className="block text-[11px] font-bold text-slate-800">
                          Secondary Button (White Outline)
                        </label>
                        <input
                          type="text"
                          value={form.content?.button2Text || "095940 30310"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, button2Text: e.target.value }
                            })
                          }
                          className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                          placeholder="Button Text"
                        />
                        <input
                          type="text"
                          value={form.content?.button2Link || "tel:09594030310"}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              content: { ...form.content, button2Link: e.target.value }
                            })
                          }
                          className="w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                          placeholder="tel: link or URL"
                        />
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 3: Store Exterior Photo */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b pb-1.5">
                      <span className="font-bold text-slate-800 text-xs">
                        3. Right Column: Store Exterior Photo (~28% width)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Street Entrance & Facade
                      </span>
                    </div>

                    <MediaUploaderWithScreenSize
                      label="Store Exterior Facade Photo"
                      value={form.content?.exteriorImage || "/store_exterior_ref.png"}
                      onChange={(val) =>
                        setForm({
                          ...form,
                          content: { ...form.content, exteriorImage: val }
                        })
                      }
                      folder="store"
                      targetScreen="Desktop"
                      screenBadge="🏬 Right Column (~28%) • Store Facade & Entrance"
                      recommendedDimensions="800 × 800 px"
                      aspectRatio="1:1 Square"
                      helperText="High-resolution photography showing the storefront entrance, facade signboard, and market location."
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-full bg-[#042041] text-white font-bold"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   1B. ADMIN ABOUT US SECTIONS MANAGER (CMS)
   ============================================================ */
export const AdminAboutSections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const loadSections = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/about-sections");
      setSections(res.items || res.sections || []);
    } catch (err) {
      setNotice("Failed to load about sections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const toggleVisibility = async (sec) => {
    try {
      const newEnabled = sec.websiteEnabled === false ? true : false;
      await apiFetch(`/admin/about-sections/${sec.sectionKey}/visibility`, {
        method: "PUT",
        body: {
          websiteEnabled: newEnabled,
          status: newEnabled ? "active" : "inactive"
        }
      });
      notifyAboutSectionsUpdated();
      loadSections();
    } catch (err) {
      alert(err.message || "Failed to toggle visibility.");
    }
  };

  const moveSection = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setSections(reordered);

    try {
      await apiFetch("/admin/about-sections/reorder", {
        method: "PUT",
        body: { orderedKeys: reordered.map((s) => s.sectionKey) }
      });
      notifyAboutSectionsUpdated();
    } catch (err) {
      alert("Failed to save reorder.");
      loadSections();
    }
  };

  const resetAllSections = async () => {
    if (!window.confirm("Reset all 11 About Us sections to their original order and active state?")) {
      return;
    }
    try {
      setLoading(true);
      await apiFetch("/admin/about-sections/reset", { method: "POST" });
      notifyAboutSectionsUpdated();
      await loadSections();
      alert("All About Us sections successfully reset to default order and enabled status.");
    } catch (err) {
      alert(err.message || "Failed to reset sections.");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (sec) => {
    setEditingSection(sec);
    setForm({
      sectionTitle: sec.sectionTitle || "",
      sectionSubtitle: sec.sectionSubtitle || "",
      description: sec.description || "",
      websiteEnabled: sec.websiteEnabled !== false,
      content: JSON.parse(JSON.stringify(sec.content || {}))
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editingSection) return;
    try {
      setSaving(true);
      const payload = {
        sectionTitle: form.sectionTitle,
        sectionSubtitle: form.sectionSubtitle,
        description: form.description,
        websiteEnabled: form.websiteEnabled,
        status: form.websiteEnabled ? "active" : "inactive",
        content: form.content
      };
      await apiFetch(`/admin/about-sections/${editingSection.sectionKey}`, {
        method: "PUT",
        body: payload
      });
      notifyAboutSectionsUpdated();
      setEditingSection(null);
      loadSections();
    } catch (err) {
      alert(err.message || "Failed to update section.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              About Us Page CMS Manager
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#06264A] text-white text-[11px] font-bold tracking-wide">
              11 Sections
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete editorial luxury control: reorder, toggle active/inactive, update copy, images, and features for every section on <code className="text-[#06264A] bg-slate-100 px-1 py-0.5 rounded">/about</code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetAllSections}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition"
            title="Reset all sections to default ordering and status"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#06264A] hover:bg-[#0B3566] text-white text-xs font-bold transition shadow-xs"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Live Page</span>
          </a>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Loading About Us sections...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          {sections.map((sec, idx) => {
            const isVisible = sec.websiteEnabled !== false && sec.status !== "inactive";
            return (
              <div
                key={sec.sectionKey}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  !isVisible ? "bg-slate-50/70 opacity-60" : "hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveSection(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-slate-200 disabled:opacity-20 text-slate-600 transition"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveSection(idx, 1)}
                      disabled={idx === sections.length - 1}
                      className="p-1 rounded hover:bg-slate-200 disabled:opacity-20 text-slate-600 transition"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                    {idx + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {sec.sectionName || sec.sectionKey}
                      </h3>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {sec.sectionKey}
                      </span>
                    </div>
                    {sec.sectionTitle && (
                      <p className="text-xs text-slate-500 mt-0.5 font-serif italic">
                        "{sec.sectionTitle.split("\n")[0]}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => toggleVisibility(sec)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isVisible
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    {isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    <span>{isVisible ? "Active" : "Inactive"}</span>
                  </button>

                  <button
                    onClick={() => openEdit(sec)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#06264A] hover:bg-[#0B3566] text-white text-xs font-bold transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit Content</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit About Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-3xl p-6 shadow-2xl border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Edit: {editingSection.sectionName}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs text-slate-400">{editingSection.sectionKey}</span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-sans">About Us Page</span>
                </div>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveEdit} className="space-y-5 text-xs">
              {/* Status and Common Top Fields */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Section Visibility</span>
                  <p className="text-[11px] text-slate-500">Toggle whether this section appears on the public /about page.</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.websiteEnabled !== false}
                    onChange={(e) => setForm({ ...form, websiteEnabled: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-[#06264A] focus:ring-[#06264A]"
                  />
                  <span>{form.websiteEnabled !== false ? "Active / Enabled" : "Disabled (Hidden)"}</span>
                </label>
              </div>

              {/* SECTION-SPECIFIC CONTROLS */}

              {/* 1. ABOUT HERO */}
              {editingSection.sectionKey === "about_hero" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Eyebrow (Top Badge)</label>
                      <input
                        type="text"
                        value={form.content?.eyebrow || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, eyebrow: e.target.value } })
                        }
                        placeholder="ABOUT PRETTYVISION"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#06264A]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Bottom Float Badge</label>
                      <input
                        type="text"
                        value={form.content?.badge || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, badge: e.target.value } })
                        }
                        placeholder="Classic Eyewear • Everyday Confidence"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#06264A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Main Heading (Serif)</label>
                    <textarea
                      rows={2}
                      value={form.content?.heading || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          sectionTitle: e.target.value,
                          content: { ...form.content, heading: e.target.value }
                        })
                      }
                      placeholder={"SEEING BETTER.\nLIVING BETTER."}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#06264A]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subheading / Highlight</label>
                    <input
                      type="text"
                      value={form.content?.subheading || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          sectionSubtitle: e.target.value,
                          content: { ...form.content, subheading: e.target.value }
                        })
                      }
                      placeholder="33 YEARS OF TRUSTED EYE CARE & EYEWEAR IN KALINA, MUMBAI"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#06264A]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Hero Paragraph</label>
                    <textarea
                      rows={3}
                      value={form.content?.paragraph || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          description: e.target.value,
                          content: { ...form.content, paragraph: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#06264A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="space-y-2">
                      <label className="block font-bold text-slate-800">Primary Button</label>
                      <input
                        type="text"
                        placeholder="Button Text"
                        value={form.content?.button1Text || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, button1Text: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Button URL"
                        value={form.content?.button1Url || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, button1Url: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-bold text-slate-800">Secondary Button</label>
                      <input
                        type="text"
                        placeholder="Button Text"
                        value={form.content?.button2Text || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, button2Text: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Button URL"
                        value={form.content?.button2Url || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, button2Url: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <MediaUploaderWithScreenSize
                    label="Hero Model Photo (Right 50% Column)"
                    value={form.content?.image || ""}
                    onChange={(url) => setForm({ ...form, content: { ...form.content, image: url } })}
                    folder="about"
                    targetScreen="Desktop 50% Bleed"
                    screenBadge="Right Column Editorial Photo (≥ 1024px)"
                    recommendedDimensions="1000 × 1100 px"
                    aspectRatio="5:6"
                    helperText="High-res portrait of model wearing eyewear. Clean background."
                  />

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Image Alt Text</label>
                    <input
                      type="text"
                      value={form.content?.imageAlt || ""}
                      onChange={(e) =>
                        setForm({ ...form, content: { ...form.content, imageAlt: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* 2. ABOUT STATS */}
              {editingSection.sectionKey === "about_stats" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">4 Trust Statistics</h4>
                      <p className="text-[11px] text-slate-500">Horizontal strip shown directly under the Hero.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const items = form.content?.items || [];
                        setForm({
                          ...form,
                          content: {
                            ...form.content,
                            items: [
                              ...items,
                              {
                                id: `stat_${Date.now()}`,
                                icon: "Sparkles",
                                number: "NEW",
                                title: "FEATURE TITLE",
                                description: "Description here"
                              }
                            ]
                          }
                        });
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Stat</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(form.content?.items || []).map((item, idx) => (
                      <div key={item.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700 text-xs">Pillar #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const items = [...(form.content?.items || [])];
                              items.splice(idx, 1);
                              setForm({ ...form, content: { ...form.content, items } });
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-500">Metric / Number</label>
                            <input
                              type="text"
                              value={item.number || ""}
                              onChange={(e) => {
                                const items = [...(form.content?.items || [])];
                                items[idx] = { ...items[idx], number: e.target.value };
                                setForm({ ...form, content: { ...form.content, items } });
                              }}
                              placeholder="33+"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] text-slate-500">Title</label>
                            <input
                              type="text"
                              value={item.title || ""}
                              onChange={(e) => {
                                const items = [...(form.content?.items || [])];
                                items[idx] = { ...items[idx], title: e.target.value };
                                setForm({ ...form, content: { ...form.content, items } });
                              }}
                              placeholder="YEARS OF EXPERIENCE"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500">Supporting Description</label>
                          <input
                            type="text"
                            value={item.description || ""}
                            onChange={(e) => {
                              const items = [...(form.content?.items || [])];
                              items[idx] = { ...items[idx], description: e.target.value };
                              setForm({ ...form, content: { ...form.content, items } });
                            }}
                            placeholder="Serving the Kalina community since 1993"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. ABOUT STORY */}
              {editingSection.sectionKey === "about_story" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Eyebrow</label>
                      <input
                        type="text"
                        value={form.content?.eyebrow || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, eyebrow: e.target.value } })
                        }
                        placeholder="OUR STORY"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={form.content?.buttonText || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, buttonText: e.target.value } })
                        }
                        placeholder="Discover PrettyVision"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Heading</label>
                    <input
                      type="text"
                      value={form.content?.heading || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          sectionTitle: e.target.value,
                          content: { ...form.content, heading: e.target.value }
                        })
                      }
                      placeholder="33 YEARS OF HELPING MUMBAI SEE BETTER"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Story Paragraph 1 (Founding & Legacy)</label>
                    <textarea
                      rows={3}
                      value={form.content?.paragraph1 || ""}
                      onChange={(e) =>
                        setForm({ ...form, content: { ...form.content, paragraph1: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Story Paragraph 2 (Services & Commitment)</label>
                    <textarea
                      rows={3}
                      value={form.content?.paragraph2 || ""}
                      onChange={(e) =>
                        setForm({ ...form, content: { ...form.content, paragraph2: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CTA Button URL</label>
                    <input
                      type="text"
                      value={form.content?.buttonUrl || ""}
                      onChange={(e) =>
                        setForm({ ...form, content: { ...form.content, buttonUrl: e.target.value } })
                      }
                      placeholder="/eyewear"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <MediaUploaderWithScreenSize
                    label="Showroom Photo (Left 50% Column)"
                    value={form.content?.image || ""}
                    onChange={(url) => setForm({ ...form, content: { ...form.content, image: url } })}
                    folder="about"
                    targetScreen="Desktop Showroom Photo"
                    screenBadge="Showroom Interior / Optical boutique (≥ 1024px)"
                    recommendedDimensions="1200 × 900 px"
                    aspectRatio="4:3"
                    helperText="High-res photo of PrettyVision showroom displaying eyewear racks."
                  />
                </div>
              )}

              {/* 4. ABOUT WHY CHOOSE */}
              {editingSection.sectionKey === "about_why_choose" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Eyebrow</label>
                      <input
                        type="text"
                        value={form.content?.eyebrow || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, eyebrow: e.target.value } })
                        }
                        placeholder="WHY CHOOSE PRETTYVISION"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Heading</label>
                      <input
                        type="text"
                        value={form.content?.heading || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            sectionTitle: e.target.value,
                            content: { ...form.content, heading: e.target.value }
                          })
                        }
                        placeholder="MORE THAN AN OPTICAL STORE"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={form.content?.subtitle || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          sectionSubtitle: e.target.value,
                          content: { ...form.content, subtitle: e.target.value }
                        })
                      }
                      placeholder="A trusted destination for better vision and better eyewear."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <MediaUploaderWithScreenSize
                    label="Eyewear Frame Feature Photo (Right Column)"
                    value={form.content?.image || ""}
                    onChange={(url) => setForm({ ...form, content: { ...form.content, image: url } })}
                    folder="about"
                    targetScreen="Desktop Frame Visual"
                    screenBadge="Crafted Tortoiseshell Eyewear (≥ 1024px)"
                    recommendedDimensions="1100 × 1200 px"
                    aspectRatio="5:6"
                    helperText="Close-up of premium handcrafted eyewear."
                  />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">4 Core Features (Left Grid)</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const features = form.content?.features || [];
                          setForm({
                            ...form,
                            content: {
                              ...form.content,
                              features: [
                                ...features,
                                {
                                  id: `feat_${Date.now()}`,
                                  icon: "Award",
                                  title: "NEW BENEFIT",
                                  description: "Benefit description here"
                                }
                              ]
                            }
                          });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Feature</span>
                      </button>
                    </div>

                    {(form.content?.features || []).map((feat, idx) => (
                      <div key={feat.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700 text-xs">Feature #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const features = [...(form.content?.features || [])];
                              features.splice(idx, 1);
                              setForm({ ...form, content: { ...form.content, features } });
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={feat.title || ""}
                          onChange={(e) => {
                            const features = [...(form.content?.features || [])];
                            features[idx] = { ...features[idx], title: e.target.value };
                            setForm({ ...form, content: { ...form.content, features } });
                          }}
                          placeholder="Title (e.g. 33+ YEARS OF TRUST)"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                        <textarea
                          rows={2}
                          value={feat.description || ""}
                          onChange={(e) => {
                            const features = [...(form.content?.features || [])];
                            features[idx] = { ...features[idx], description: e.target.value };
                            setForm({ ...form, content: { ...form.content, features } });
                          }}
                          placeholder="Description..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. ABOUT OFFERINGS */}
              {editingSection.sectionKey === "about_offerings" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Eyebrow</label>
                      <input
                        type="text"
                        value={form.content?.eyebrow || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, eyebrow: e.target.value } })
                        }
                        placeholder="EVERYTHING YOU NEED FOR CLEARER VISION"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Heading</label>
                      <input
                        type="text"
                        value={form.content?.heading || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            sectionTitle: e.target.value,
                            content: { ...form.content, heading: e.target.value }
                          })
                        }
                        placeholder="WHAT WE OFFER"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Header Action Button Text</label>
                      <input
                        type="text"
                        value={form.content?.buttonText || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, buttonText: e.target.value } })
                        }
                        placeholder="View All Services"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Header Action Button URL</label>
                      <input
                        type="text"
                        value={form.content?.buttonUrl || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, buttonUrl: e.target.value } })
                        }
                        placeholder="/services"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">6 Service Cards</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const services = form.content?.services || [];
                          setForm({
                            ...form,
                            content: {
                              ...form.content,
                              services: [
                                ...services,
                                {
                                  id: `srv_${Date.now()}`,
                                  title: "New Service Card",
                                  description: "Service description here",
                                  image: "/uploads/store_interior.jpg",
                                  url: "/services"
                                }
                              ]
                            }
                          });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Service Card</span>
                      </button>
                    </div>

                    {(form.content?.services || []).map((srv, idx) => (
                      <div key={srv.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700 text-xs">Card #{idx + 1} — {srv.title}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const services = [...(form.content?.services || [])];
                              services.splice(idx, 1);
                              setForm({ ...form, content: { ...form.content, services } });
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-500">Service Title</label>
                            <input
                              type="text"
                              value={srv.title || ""}
                              onChange={(e) => {
                                const services = [...(form.content?.services || [])];
                                services[idx] = { ...services[idx], title: e.target.value };
                                setForm({ ...form, content: { ...form.content, services } });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500">Target Link URL</label>
                            <input
                              type="text"
                              value={srv.url || ""}
                              onChange={(e) => {
                                const services = [...(form.content?.services || [])];
                                services[idx] = { ...services[idx], url: e.target.value };
                                setForm({ ...form, content: { ...form.content, services } });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500">Card Image URL</label>
                          <input
                            type="text"
                            value={srv.image || ""}
                            onChange={(e) => {
                              const services = [...(form.content?.services || [])];
                              services[idx] = { ...services[idx], image: e.target.value };
                              setForm({ ...form, content: { ...form.content, services } });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500">Description</label>
                          <textarea
                            rows={2}
                            value={srv.description || ""}
                            onChange={(e) => {
                              const services = [...(form.content?.services || [])];
                              services[idx] = { ...services[idx], description: e.target.value };
                              setForm({ ...form, content: { ...form.content, services } });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. ABOUT EYEWEAR BANNER */}
              {editingSection.sectionKey === "about_eyewear_banner" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Eyebrow</label>
                      <input
                        type="text"
                        value={form.content?.eyebrow || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, eyebrow: e.target.value } })
                        }
                        placeholder="CURATED EYEWEAR"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={form.content?.buttonText || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, buttonText: e.target.value } })
                        }
                        placeholder="Explore Collections"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Main Heading</label>
                    <textarea
                      rows={2}
                      value={form.content?.heading || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          sectionTitle: e.target.value,
                          content: { ...form.content, heading: e.target.value }
                        })
                      }
                      placeholder="EYEWEAR FOR EVERY FACE, EVERY PRESCRIPTION, EVERY STYLE"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Paragraph</label>
                    <textarea
                      rows={3}
                      value={form.content?.paragraph || ""}
                      onChange={(e) =>
                        setForm({ ...form, content: { ...form.content, paragraph: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Button URL</label>
                    <input
                      type="text"
                      value={form.content?.buttonUrl || ""}
                      onChange={(e) =>
                        setForm({ ...form, content: { ...form.content, buttonUrl: e.target.value } })
                      }
                      placeholder="/eyewear"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <MediaUploaderWithScreenSize
                    label="Banner Eyewear Image (Center / Floating)"
                    value={form.content?.image || ""}
                    onChange={(url) => setForm({ ...form, content: { ...form.content, image: url } })}
                    folder="about"
                    targetScreen="Banner Eyewear Visual"
                    screenBadge="Featured Sunglasses / Eyewear Visual"
                    recommendedDimensions="1000 × 750 px"
                    aspectRatio="4:3"
                    helperText="Transparent PNG or crisp studio photograph of sunglasses."
                  />
                </div>
              )}

              {/* 7. ABOUT EXPERIENCE */}
              {editingSection.sectionKey === "about_experience" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Eyebrow</label>
                      <input
                        type="text"
                        value={form.content?.eyebrow || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, eyebrow: e.target.value } })
                        }
                        placeholder="HOW WE CARE FOR YOU"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Heading</label>
                      <input
                        type="text"
                        value={form.content?.heading || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            sectionTitle: e.target.value,
                            content: { ...form.content, heading: e.target.value }
                          })
                        }
                        placeholder="THE PRETTYVISION EXPERIENCE"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <MediaUploaderWithScreenSize
                    label="Consultation Photo (Left Column)"
                    value={form.content?.image || ""}
                    onChange={(url) => setForm({ ...form, content: { ...form.content, image: url } })}
                    folder="about"
                    targetScreen="Desktop Consultation Visual"
                    screenBadge="Optometrist Consultation / Eye Exam (≥ 1024px)"
                    recommendedDimensions="1100 × 1300 px"
                    aspectRatio="5:6"
                    helperText="Photo of optometrist helping customer with glasses or conducting exam."
                  />

                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900">4 Experience Steps (Right Column)</h4>
                    {(form.content?.steps || []).map((stp, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-500">Step #</label>
                            <input
                              type="text"
                              value={stp.step || `0${idx + 1}`}
                              onChange={(e) => {
                                const steps = [...(form.content?.steps || [])];
                                steps[idx] = { ...steps[idx], step: e.target.value };
                                setForm({ ...form, content: { ...form.content, steps } });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-[10px] text-slate-500">Title</label>
                            <input
                              type="text"
                              value={stp.title || ""}
                              onChange={(e) => {
                                const steps = [...(form.content?.steps || [])];
                                steps[idx] = { ...steps[idx], title: e.target.value };
                                setForm({ ...form, content: { ...form.content, steps } });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500">Description</label>
                          <textarea
                            rows={2}
                            value={stp.description || ""}
                            onChange={(e) => {
                              const steps = [...(form.content?.steps || [])];
                              steps[idx] = { ...steps[idx], description: e.target.value };
                              setForm({ ...form, content: { ...form.content, steps } });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. ABOUT STORE */}
              {editingSection.sectionKey === "about_store" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Eyebrow</label>
                      <input
                        type="text"
                        value={form.content?.eyebrow || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, eyebrow: e.target.value } })
                        }
                        placeholder="VISIT OUR STORE"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Store Name</label>
                      <input
                        type="text"
                        value={form.content?.storeName || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            sectionTitle: e.target.value,
                            content: { ...form.content, storeName: e.target.value }
                          })
                        }
                        placeholder="PRETTYVISION KALINA"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Store Address</label>
                    <textarea
                      rows={2}
                      value={form.content?.address || ""}
                      onChange={(e) =>
                        setForm({ ...form, content: { ...form.content, address: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={form.content?.phone || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, phone: e.target.value } })
                        }
                        placeholder="095940 30310"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Store Hours</label>
                      <input
                        type="text"
                        value={form.content?.hours || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, hours: e.target.value } })
                        }
                        placeholder="Mon – Sat: 10:00 AM – 9:30 PM | Sun: 11:00 AM – 8:00 PM"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="space-y-2">
                      <label className="block font-bold text-slate-800">Button 1 (Directions)</label>
                      <input
                        type="text"
                        value={form.content?.button1Text || "Get Directions"}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, button1Text: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        value={form.content?.button1Url || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, button1Url: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-bold text-slate-800">Button 2 (Call)</label>
                      <input
                        type="text"
                        value={form.content?.button2Text || "Call PrettyVision"}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, button2Text: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        value={form.content?.button2Url || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, button2Url: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <MediaUploaderWithScreenSize
                    label="Store Facade / Exterior Photo (Left Column)"
                    value={form.content?.image || ""}
                    onChange={(url) => setForm({ ...form, content: { ...form.content, image: url } })}
                    folder="store"
                    targetScreen="Store Exterior"
                    screenBadge="Storefront Entrance Photo (≥ 1024px)"
                    recommendedDimensions="1200 × 900 px"
                    aspectRatio="4:3"
                    helperText="Store entrance photo showing PrettyVision signage and glass facade."
                  />

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Google Maps Embed URL (Right Column)</label>
                    <input
                      type="text"
                      value={form.content?.mapEmbedUrl || ""}
                      onChange={(e) =>
                        setForm({ ...form, content: { ...form.content, mapEmbedUrl: e.target.value } })
                      }
                      placeholder="https://www.google.com/maps/embed?..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}

              {/* 9. ABOUT TESTIMONIALS */}
              {editingSection.sectionKey === "about_testimonials" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Eyebrow</label>
                      <input
                        type="text"
                        value={form.content?.eyebrow || ""}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, eyebrow: e.target.value } })
                        }
                        placeholder="TRUSTED BY THOUSANDS"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Heading</label>
                      <input
                        type="text"
                        value={form.content?.heading || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            sectionTitle: e.target.value,
                            content: { ...form.content, heading: e.target.value }
                          })
                        }
                        placeholder="LOVED BY FAMILIES"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Supporting Text</label>
                    <input
                      type="text"
                      value={form.content?.supportingText || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          sectionSubtitle: e.target.value,
                          content: { ...form.content, supportingText: e.target.value }
                        })
                      }
                      placeholder="10,000+ happy customers and counting."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-slate-700 space-y-2">
                    <div className="flex items-center gap-2 text-[#06264A] font-bold">
                      <Sparkles className="h-4 w-4" />
                      <span>Live Customer Reviews</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      The customer review cards on this section are pulled live from your active approved Testimonials collection. To add new customer reviews, edit ratings, or moderate testimonials, navigate to the <a href="/admin/testimonials" className="font-bold underline text-[#06264A]">Testimonials Manager</a>.
                    </p>
                  </div>
                </div>
              )}

              {/* 10. ABOUT FAQ */}
              {editingSection.sectionKey === "about_faq" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Heading</label>
                      <input
                        type="text"
                        value={form.content?.heading || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            sectionTitle: e.target.value,
                            content: { ...form.content, heading: e.target.value }
                          })
                        }
                        placeholder="FREQUENTLY ASKED QUESTIONS"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={form.content?.subtitle || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            sectionSubtitle: e.target.value,
                            content: { ...form.content, subtitle: e.target.value }
                          })
                        }
                        placeholder="Find answers to common questions about our optical store..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900">FAQ Accordion Questions ({form.content?.faqs?.length || 0})</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const faqs = form.content?.faqs || [];
                          setForm({
                            ...form,
                            content: {
                              ...form.content,
                              faqs: [
                                ...faqs,
                                {
                                  q: "New Eyewear Question?",
                                  a: "Answer explanation here."
                                }
                              ]
                            }
                          });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Question</span>
                      </button>
                    </div>

                    {(form.content?.faqs || []).map((faq, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700 text-xs">Q{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const faqs = [...(form.content?.faqs || [])];
                              faqs.splice(idx, 1);
                              setForm({ ...form, content: { ...form.content, faqs } });
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={faq.q || ""}
                          onChange={(e) => {
                            const faqs = [...(form.content?.faqs || [])];
                            faqs[idx] = { ...faqs[idx], q: e.target.value };
                            setForm({ ...form, content: { ...form.content, faqs } });
                          }}
                          placeholder="Question..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium"
                        />
                        <textarea
                          rows={2}
                          value={faq.a || ""}
                          onChange={(e) => {
                            const faqs = [...(form.content?.faqs || [])];
                            faqs[idx] = { ...faqs[idx], a: e.target.value };
                            setForm({ ...form, content: { ...form.content, faqs } });
                          }}
                          placeholder="Answer..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 11. ABOUT FINAL CTA */}
              {editingSection.sectionKey === "about_final_cta" && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Heading</label>
                    <input
                      type="text"
                      value={form.content?.heading || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          sectionTitle: e.target.value,
                          content: { ...form.content, heading: e.target.value }
                        })
                      }
                      placeholder="YOUR VISION DESERVES BETTER."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Paragraph</label>
                    <textarea
                      rows={2}
                      value={form.content?.paragraph || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          description: e.target.value,
                          content: { ...form.content, paragraph: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="space-y-2">
                      <label className="block font-bold text-slate-800">Button 1</label>
                      <input
                        type="text"
                        value={form.content?.button1Text || "Book an Eye Test"}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, button1Text: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        value={form.content?.button1Url || "/contact"}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, button1Url: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-bold text-slate-800">Button 2</label>
                      <input
                        type="text"
                        value={form.content?.button2Text || "Visit Our Store"}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, button2Text: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        value={form.content?.button2Url || "/contact"}
                        onChange={(e) =>
                          setForm({ ...form, content: { ...form.content, button2Url: e.target.value } })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <MediaUploaderWithScreenSize
                    label="Eyewear Visual Image (Right)"
                    value={form.content?.image || ""}
                    onChange={(url) => setForm({ ...form, content: { ...form.content, image: url } })}
                    folder="about"
                    targetScreen="CTA Eyewear Visual"
                    screenBadge="Blue-tinted / Luxury Designer Frame (≥ 1024px)"
                    recommendedDimensions="1200 × 700 px"
                    aspectRatio="16:9"
                    helperText="Crisp photography of luxury eyewear frame."
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-[#06264A] hover:bg-[#0B3566] text-white font-bold transition shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Saving Changes..." : "Save Section"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   1. ADMIN PRODUCT CATEGORIES MANAGER (WITH STRICT VALIDATION & SAFE DELETION)
   ============================================================ */
export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [productTypes, setProductTypes] = useState(["Eyewear", "Contact Lenses", "Accessories", "Eye Care"]);
  const [availableAudiences, setAvailableAudiences] = useState(["Men", "Women", "Unisex", "Kids", "Boys", "Girls", "Seniors", "Teenagers"]);
  const [reordering, setReordering] = useState(false);
  const [errors, setErrors] = useState({});

  // Safe Deletion Guard State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);
  const [affectedProducts, setAffectedProducts] = useState([]);
  const [usageLoading, setUsageLoading] = useState(false);
  const [reassignTarget, setReassignTarget] = useState("");
  const [reassigning, setReassigning] = useState(false);

  const initialForm = {
    name: "",
    title: "",
    slug: "",
    categoryType: "Eyewear",
    targetAudiences: ["Unisex"],
    subtitle: "",
    description: "",
    image: "",
    icon: "",
    destinationUrl: "",
    order: 0,
    isFeatured: false,
    isActive: true,
    status: "active",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: ""
  };

  const [form, setForm] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catRes, taxRes] = await Promise.all([
        apiFetch("/admin/categories"),
        apiFetch("/taxonomy").catch(() => null)
      ]);
      const items = Array.isArray(catRes) ? catRes : (catRes?.items || []);
      items.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      setCategories(items);

      if (taxRes) {
        if (taxRes.productTypes?.length) {
          setProductTypes(taxRes.productTypes.map((pt) => pt.name));
        }
        if (taxRes.targetAudiences?.length) {
          setAvailableAudiences(taxRes.targetAudiences.map((ta) => ta.name));
        }
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  // Field validation rules
  const validateForm = () => {
    const errs = {};
    const nameTrimmed = (form.name || "").trim();
    if (!nameTrimmed) {
      errs.name = "Category name is required.";
    } else if (nameTrimmed.length < 2) {
      errs.name = "Category name must be at least 2 characters.";
    } else if (nameTrimmed.length > 100) {
      errs.name = "Category name cannot exceed 100 characters.";
    } else {
      // Case-insensitive uniqueness
      const dup = categories.find(
        (c) => c._id !== editingId && c.name?.trim().toLowerCase() === nameTrimmed.toLowerCase()
      );
      if (dup) {
        errs.name = `Category "${nameTrimmed}" already exists. Category names must be unique.`;
      }
    }

    const slugTrimmed = (form.slug || "").trim().toLowerCase();
    if (!slugTrimmed) {
      errs.slug = "Slug is required.";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugTrimmed)) {
      errs.slug = "Slug must contain only lowercase letters, numbers, and hyphens.";
    } else {
      const dupSlug = categories.find(
        (c) => c._id !== editingId && c.slug?.trim().toLowerCase() === slugTrimmed
      );
      if (dupSlug) {
        errs.slug = "This slug is already in use. Please choose another slug.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNameChange = (val) => {
    setForm((prev) => {
      const next = { ...prev, name: val };
      if (!editingId && (!prev.slug || prev.slug === slugify(prev.name))) {
        next.slug = slugify(val);
      }
      if (!editingId && (!prev.title || prev.title === prev.name)) {
        next.title = val;
      }
      return next;
    });

    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  const handleSlugChange = (val) => {
    const clean = val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    setForm((prev) => ({ ...prev, slug: clean }));
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  const toggleAudience = (aud) => {
    setForm((prev) => {
      const exists = prev.targetAudiences?.includes(aud);
      const next = exists
        ? prev.targetAudiences.filter((a) => a !== aud)
        : [...(prev.targetAudiences || []), aud];
      return { ...prev, targetAudiences: next };
    });
  };

  const openNew = () => {
    setEditingId(null);
    setErrors({});
    const nextOrder = categories.length > 0 ? Math.max(...categories.map((c) => Number(c.order) || 0)) + 1 : 1;
    setForm({
      ...initialForm,
      order: nextOrder
    });
    setActiveTab("general");
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat._id);
    setErrors({});
    setForm({
      name: cat.name || "",
      title: cat.title || cat.name || "",
      slug: cat.slug || "",
      categoryType: cat.categoryType || "Eyewear",
      targetAudiences: Array.isArray(cat.targetAudiences) ? cat.targetAudiences : (cat.targetAudiences ? [cat.targetAudiences] : ["Unisex"]),
      subtitle: cat.subtitle || "",
      description: cat.description || "",
      image: cat.image || "",
      icon: cat.icon || "",
      destinationUrl: cat.destinationUrl || "",
      order: Number(cat.order) || 0,
      isFeatured: Boolean(cat.isFeatured),
      isActive: cat.isActive !== false,
      status: cat.status || "active",
      seoTitle: cat.seoTitle || "",
      seoDescription: cat.seoDescription || "",
      seoKeywords: cat.seoKeywords || ""
    });
    setActiveTab("general");
    setModalOpen(true);
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setActiveTab("general");
      return;
    }

    const finalSlug = form.slug.trim() ? form.slug.trim().toLowerCase() : slugify(form.name);
    const payload = {
      ...form,
      name: form.name.trim(),
      title: form.title.trim() || form.name.trim(),
      slug: finalSlug,
      order: Number(form.order) || 0,
      status: form.isActive ? "active" : "draft"
    };

    try {
      if (editingId) {
        await apiFetch(`/admin/categories/${editingId}`, {
          method: "PUT",
          body: payload
        });
      } else {
        await apiFetch("/admin/categories", {
          method: "POST",
          body: payload
        });
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      if (err.field) {
        setErrors((prev) => ({ ...prev, [err.field]: err.message }));
        setActiveTab("general");
      } else {
        alert(err.message || "Failed to save category");
      }
    }
  };

  // Safe Deletion Handler
  const initiateDelete = async (cat) => {
    setCatToDelete(cat);
    setUsageLoading(true);
    setDeleteModalOpen(true);
    setAffectedProducts([]);

    // Default target category to first available other category
    const otherCat = categories.find((c) => c._id !== cat._id && c.isActive !== false);
    setReassignTarget(otherCat?.name || "");

    try {
      const usageRes = await apiFetch(`/admin/categories/${cat._id}/usage`);
      setAffectedProducts(usageRes.products || []);
    } catch (err) {
      // Fallback
    } finally {
      setUsageLoading(false);
    }
  };

  const executeDirectDelete = async () => {
    if (!catToDelete) return;
    try {
      await apiFetch(`/admin/categories/${catToDelete._id}`, { method: "DELETE" });
      setDeleteModalOpen(false);
      setCatToDelete(null);
      await loadData();
    } catch (err) {
      if (err.code === "CATEGORY_IN_USE") {
        setAffectedProducts(err.products || []);
      } else {
        alert(err.message || "Failed to delete category");
      }
    }
  };

  const executeReassignAndDelete = async () => {
    if (!catToDelete || !reassignTarget) {
      alert("Please select a target category to reassign products to.");
      return;
    }
    setReassigning(true);
    try {
      const res = await apiFetch("/admin/categories/reassign-and-delete", {
        method: "POST",
        body: {
          sourceId: catToDelete._id,
          targetCategoryName: reassignTarget
        }
      });
      alert(res.message || "Category safely deleted and products reassigned.");
      setDeleteModalOpen(false);
      setCatToDelete(null);
      await loadData();
    } catch (err) {
      alert(err.message || "Reassign & delete failed");
    } finally {
      setReassigning(false);
    }
  };

  const toggleActive = async (cat) => {
    const nextState = !cat.isActive;
    try {
      await apiFetch(`/admin/categories/${cat._id}`, {
        method: "PUT",
        body: { isActive: nextState, status: nextState ? "active" : "draft" }
      });
      setCategories((prev) =>
        prev.map((c) => (c._id === cat._id ? { ...c, isActive: nextState, status: nextState ? "active" : "draft" } : c))
      );
    } catch (err) {
      alert(err.message || "Failed to update category status");
    }
  };

  const toggleFeatured = async (cat) => {
    const nextFeatured = !cat.isFeatured;
    try {
      await apiFetch(`/admin/categories/${cat._id}`, {
        method: "PUT",
        body: { isFeatured: nextFeatured }
      });
      setCategories((prev) =>
        prev.map((c) => (c._id === cat._id ? { ...c, isFeatured: nextFeatured } : c))
      );
    } catch (err) {
      alert(err.message || "Failed to update featured flag");
    }
  };

  const moveOrder = async (index, direction) => {
    if (reordering) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const list = [...categories];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const updated = list.map((item, idx) => ({
      id: item._id,
      order: idx + 1
    }));

    setCategories(list.map((item, idx) => ({ ...item, order: idx + 1 })));
    setReordering(true);
    try {
      await apiFetch("/admin/categories/reorder", {
        method: "PUT",
        body: { items: updated }
      });
    } catch (err) {
      console.error("Reorder failed:", err);
      loadData();
    } finally {
      setReordering(false);
    }
  };

  const filteredCategories = categories.filter((cat) => {
    const matchSearch =
      !search ||
      cat.name?.toLowerCase().includes(search.toLowerCase()) ||
      cat.title?.toLowerCase().includes(search.toLowerCase()) ||
      cat.slug?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "ALL" || (cat.categoryType || "Eyewear").toLowerCase() === filterType.toLowerCase();
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06264A]/5 text-[#06264A] text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="h-3.5 w-3.5" />
            <span>Product Taxonomy & Classification</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Product Categories Management
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Create, reorder, and configure optical categories. Enforced with strict data validation, safe deletion rules, and conflict prevention.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-[#06264A] hover:bg-[#0B3564] text-white px-5 py-2.5 text-xs font-bold transition shadow-md shadow-[#06264A]/10"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-2xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories by name, slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#06264A] bg-slate-50/50"
          />
        </div>

        {/* Category Type Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              filterType === "ALL"
                ? "bg-[#06264A] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Types ({categories.length})
          </button>
          {productTypes.map((pt) => {
            const count = categories.filter((c) => (c.categoryType || "Eyewear").toLowerCase() === pt.toLowerCase()).length;
            return (
              <button
                key={pt}
                onClick={() => setFilterType(pt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  filterType.toLowerCase() === pt.toLowerCase()
                    ? "bg-[#06264A] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {pt} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5 w-16 text-center">Order</th>
                <th className="p-3.5 w-20">Image</th>
                <th className="p-3.5">Category Name / Title</th>
                <th className="p-3.5">Type & Audiences</th>
                <th className="p-3.5">Slug / URL</th>
                <th className="p-3.5 text-center">Featured</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((cat, idx) => (
                <tr key={cat._id} className="hover:bg-slate-50/70 transition">
                  {/* Order / Reorder */}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-mono font-bold text-slate-500 text-[11px] w-5">
                        {cat.order || idx + 1}
                      </span>
                      <div className="flex flex-col">
                        <button
                          disabled={idx === 0 || reordering}
                          onClick={() => moveOrder(idx, -1)}
                          className="p-0.5 text-slate-400 hover:text-slate-900 disabled:opacity-20"
                          title="Move Up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={idx === filteredCategories.length - 1 || reordering}
                          onClick={() => moveOrder(idx, 1)}
                          className="p-0.5 text-slate-400 hover:text-slate-900 disabled:opacity-20"
                          title="Move Down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Thumbnail */}
                  <td className="p-3">
                    <div className="h-12 w-16 rounded-lg border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center">
                      {cat.image ? (
                        <img
                          src={assetUrl(cat.image)}
                          alt={cat.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-slate-300 font-bold text-[10px]">No img</span>
                      )}
                    </div>
                  </td>

                  {/* Name & Subtitle */}
                  <td className="p-3">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>{cat.name}</span>
                      {cat.icon && <span className="text-base">{cat.icon}</span>}
                    </div>
                    {cat.title && cat.title !== cat.name && (
                      <div className="text-[11px] text-slate-500">{cat.title}</div>
                    )}
                    {cat.subtitle && (
                      <div className="text-[11px] text-slate-400 italic line-clamp-1">{cat.subtitle}</div>
                    )}
                  </td>

                  {/* Type & Audiences */}
                  <td className="p-3">
                    <div className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] mb-1">
                      {cat.categoryType || "Eyewear"}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(cat.targetAudiences) ? cat.targetAudiences : [cat.targetAudiences || "Unisex"]).map((aud) => (
                        <span
                          key={aud}
                          className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[9.5px] font-medium"
                        >
                          {aud}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="p-3">
                    <code className="text-[11px] bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">
                      /{cat.slug}
                    </code>
                    {cat.destinationUrl && (
                      <div className="text-[10px] text-slate-400 mt-1 truncate max-w-[140px]">
                        → {cat.destinationUrl}
                      </div>
                    )}
                  </td>

                  {/* Featured */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleFeatured(cat)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                        cat.isFeatured
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <Star className={`h-3 w-3 ${cat.isFeatured ? "fill-amber-400 text-amber-500" : ""}`} />
                      <span>{cat.isFeatured ? "Featured" : "Regular"}</span>
                    </button>
                  </td>

                  {/* Status Toggle */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleActive(cat)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                        cat.isActive !== false
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-600 border border-rose-200"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${cat.isActive !== false ? "bg-emerald-500" : "bg-rose-500"}`} />
                      <span>{cat.isActive !== false ? "Active" : "Hidden"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition"
                        title="Edit Category"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => initiateDelete(cat)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition"
                        title="Delete Category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-400">
                    No categories found. Click "Add New Category" above to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  {editingId ? `Edit Category: ${form.name}` : "Create New Product Category"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure optical category identity, classification, image, and target audiences.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`px-4 py-2 rounded-xl transition ${
                  activeTab === "general"
                    ? "bg-[#06264A] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                1. Category Identity & Type
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("audience")}
                className={`px-4 py-2 rounded-xl transition ${
                  activeTab === "audience"
                    ? "bg-[#06264A] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                2. Target Audiences & Visuals
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className={`px-4 py-2 rounded-xl transition ${
                  activeTab === "seo"
                    ? "bg-[#06264A] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                3. SEO & Display Settings
              </button>
            </div>

            <form onSubmit={saveCategory} className="space-y-5 text-xs">
              {/* TAB 1: GENERAL */}
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Category Name * <span className="text-slate-400 font-normal">(2–100 chars, Unique)</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Optical Frames, Sunglasses, Blue-Light..."
                        className={`w-full px-3.5 py-2.5 rounded-xl border font-medium focus:outline-none ${
                          errors.name
                            ? "border-rose-400 bg-rose-50/20 focus:border-rose-600"
                            : "border-slate-300 focus:border-[#06264A]"
                        }`}
                      />
                      {errors.name && (
                        <div className="flex items-center gap-1.5 text-rose-600 font-semibold text-[11px] mt-1.5">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.name}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Display Title / Heading <span className="text-slate-400 font-normal">(Shown on hero & cards)</span>
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g., Optical Frames & Designer Glasses"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Category Slug (URL Path) *
                      </label>
                      <div className="flex items-center">
                        <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-500 font-mono text-[11px]">
                          /eyewear/
                        </span>
                        <input
                          type="text"
                          required
                          value={form.slug}
                          onChange={(e) => handleSlugChange(e.target.value)}
                          placeholder="optical-frames"
                          className={`w-full px-3.5 py-2.5 rounded-r-xl border font-mono text-[11px] focus:outline-none ${
                            errors.slug
                              ? "border-rose-400 bg-rose-50/20 focus:border-rose-600"
                              : "border-slate-300 focus:border-[#06264A]"
                          }`}
                        />
                      </div>
                      {errors.slug ? (
                        <div className="flex items-center gap-1.5 text-rose-600 font-semibold text-[11px] mt-1.5">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.slug}</span>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 mt-1">Unique URL identifier used for filtering and links.</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Product Type Classification
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={form.categoryType}
                          onChange={(e) => setForm({ ...form, categoryType: e.target.value })}
                          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:border-[#06264A]"
                        >
                          {productTypes.map((pt) => (
                            <option key={pt} value={pt}>{pt}</option>
                          ))}
                          <option value="Custom">Custom / Other</option>
                        </select>
                        {form.categoryType === "Custom" && (
                          <input
                            type="text"
                            placeholder="Type custom name"
                            onChange={(e) => setForm({ ...form, categoryType: e.target.value })}
                            className="w-1/2 px-3 py-2 rounded-xl border border-slate-300"
                          />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Groups this category under Eyewear, Contact Lenses, Accessories, etc.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Subtitle / Tagline <span className="text-slate-400 font-normal">(Optional card badge or header text)</span>
                    </label>
                    <input
                      type="text"
                      value={form.subtitle}
                      onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                      placeholder="e.g., Premium Titanium & Italian Acetate"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Category Description
                    </label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Detailed editorial description of this category, styling advice, or optical care notes..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: AUDIENCE & VISUALS */}
              {activeTab === "audience" && (
                <div className="space-y-5">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-bold text-slate-800 text-xs">
                        Target Audiences <span className="text-slate-400 font-normal">(Select all that apply)</span>
                      </label>
                      <span className="text-[10px] text-slate-500">
                        Selected: {form.targetAudiences?.join(", ") || "None"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {availableAudiences.map((aud) => {
                        const isSelected = form.targetAudiences?.includes(aud);
                        return (
                          <button
                            key={aud}
                            type="button"
                            onClick={() => toggleAudience(aud)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition ${
                              isSelected
                                ? "bg-[#06264A] text-white border-[#06264A]"
                                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <span>{aud}</span>
                            {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Enables visitors to filter this category by Men, Women, Unisex, Kids, etc.
                    </p>
                  </div>

                  <MediaUploaderWithScreenSize
                    label="Category Card & Showcase Photo"
                    value={form.image}
                    onChange={(val) => setForm({ ...form, image: val })}
                    folder="categories"
                    targetScreen="Universal"
                    screenBadge="🖥️ Desktop & 📱 Mobile Category Card"
                    recommendedDimensions="800 × 600 px (4:3) or 1000 × 1000 px (1:1)"
                    aspectRatio="4:3 or 1:1"
                    helperText="High-resolution hero photo used for Homepage 'Find What Suits You' cards and category landing banners."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Optional Icon / Badge Emoji
                      </label>
                      <input
                        type="text"
                        value={form.icon}
                        onChange={(e) => setForm({ ...form, icon: e.target.value })}
                        placeholder="👓 or 🕶️ or 👁️"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Custom External / Override Destination URL
                      </label>
                      <input
                        type="text"
                        value={form.destinationUrl}
                        onChange={(e) => setForm({ ...form, destinationUrl: e.target.value })}
                        placeholder="Leave empty to use /eyewear?category=slug"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SEO & DISPLAY */}
              {activeTab === "seo" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Display Order <span className="text-slate-400 font-normal">(Lower numbers appear first)</span>
                      </label>
                      <input
                        type="number"
                        value={form.order}
                        onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Publication Status
                      </label>
                      <select
                        value={form.isActive ? "active" : "draft"}
                        onChange={(e) => setForm({ ...form, isActive: e.target.value === "active", status: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="active">Active (Visible on website)</option>
                        <option value="draft">Draft / Hidden</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                        className="h-4 w-4 rounded text-[#06264A]"
                      />
                      <span>Featured Category (Showcase in Homepage Curations)</span>
                    </label>
                  </div>

                  <div className="border-t border-slate-200 pt-3 space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs">Search Engine Optimization (SEO)</h4>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">SEO Meta Title</label>
                      <input
                        type="text"
                        value={form.seoTitle}
                        onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                        placeholder={`${form.name || "Category"} in Kalina, Santacruz Mumbai | PrettyVision`}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">SEO Meta Description</label>
                      <textarea
                        rows={2}
                        value={form.seoDescription}
                        onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                        placeholder="Explore premium eyewear and designer optical frames at PrettyVision Kalina, Mumbai..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">SEO Keywords</label>
                      <input
                        type="text"
                        value={form.seoKeywords}
                        onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}
                        placeholder="optical frames, sunglasses, spectacles kalina, prettyvision"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <div className="flex gap-2">
                  {activeTab !== "seo" && (
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === "general" ? "audience" : "seo")}
                      className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition"
                    >
                      Next Step →
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#06264A] hover:bg-[#0B3564] text-white font-bold transition shadow-md shadow-[#06264A]/10"
                  >
                    {editingId ? "Save Changes" : "Create Category"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SAFE DELETION GUARD MODAL */}
      {deleteModalOpen && catToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            {usageLoading ? (
              <div className="py-12 text-center space-y-3">
                <div className="h-8 w-8 border-2 border-[#06264A] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-600">Verifying data relationships...</p>
              </div>
            ) : affectedProducts.length > 0 ? (
              /* BLOCKED STATE: Products in use */
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold w-fit">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>ACTION BLOCKED: DATA INTEGRITY PROTECTION</span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Cannot Delete Category: "{catToDelete.name}"
                  </h3>
                  <div className="p-3.5 mt-2 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                    <p className="font-bold">
                      This category is currently used by {affectedProducts.length} product{affectedProducts.length > 1 ? "s" : ""}.
                    </p>
                    <p className="mt-0.5 text-amber-800">
                      You cannot delete it until those products are reassigned to another category or removed.
                    </p>
                  </div>
                </div>

                {/* Affected Products Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Affected Products Preview ({affectedProducts.length})</span>
                    <a
                      href={`/admin/products`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#06264A] hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>View in Catalogue</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    {affectedProducts.map((p) => (
                      <div key={p._id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={assetUrl(p.mainImage)}
                            alt=""
                            className="h-8 w-10 object-contain rounded bg-slate-50 border"
                          />
                          <div>
                            <div className="font-bold text-slate-900 leading-snug">{p.name}</div>
                            <div className="text-[10px] text-slate-400">{p.brand} {p.sku ? `• SKU: ${p.sku}` : ""}</div>
                          </div>
                        </div>
                        <div className="font-bold text-slate-700">
                          {p.price ? `₹${Number(p.price).toLocaleString("en-IN")}` : "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reassign Option */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Option: Reassign all {affectedProducts.length} products & delete:
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={reassignTarget}
                      onChange={(e) => setReassignTarget(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                    >
                      {categories
                        .filter((c) => c._id !== catToDelete._id && c.isActive !== false)
                        .map((c) => (
                          <option key={c._id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                    <button
                      type="button"
                      disabled={reassigning || !reassignTarget}
                      onClick={executeReassignAndDelete}
                      className="px-4 py-2 rounded-xl bg-[#06264A] hover:bg-[#0B3564] text-white text-xs font-bold disabled:opacity-50 transition shrink-0"
                    >
                      {reassigning ? "Reassigning..." : "Reassign & Delete"}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-5 py-2 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* UNUSED STATE: Safe to delete */
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold w-fit">
                  <Check className="h-3.5 w-3.5" />
                  <span>0 PRODUCTS ATTACHED — SAFE TO DELETE</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Delete Category: "{catToDelete.name}"?
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    No products currently belong to this category. Deleting it will permanently remove it from categories, filters, and sitemaps.
                  </p>
                </div>
                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={executeDirectDelete}
                    className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow"
                  >
                    Yes, Delete Category
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   2. ADMIN BRANDS MANAGER (WITH STRICT VALIDATION & SAFE DELETION)
   ============================================================ */
export const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [reordering, setReordering] = useState(false);
  const [errors, setErrors] = useState({});

  // Safe Deletion Guard State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [affectedProducts, setAffectedProducts] = useState([]);
  const [usageLoading, setUsageLoading] = useState(false);
  const [reassignTarget, setReassignTarget] = useState("");
  const [reassigning, setReassigning] = useState(false);

  const initialForm = {
    name: "",
    slug: "",
    logo: "",
    bannerImage: "",
    brandImage: "",
    description: "",
    websiteUrl: "",
    order: 0,
    isFeatured: false,
    isActive: true,
    status: "active",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: ""
  };

  const [form, setForm] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/admin/brands");
      const items = Array.isArray(res) ? res : (res?.items || []);
      items.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      setBrands(items);
    } catch (err) {
      console.error("Failed to load brands:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  // Field validation rules
  const validateForm = () => {
    const errs = {};
    const nameTrimmed = (form.name || "").trim();
    if (!nameTrimmed) {
      errs.name = "Brand name is required.";
    } else if (nameTrimmed.length < 2) {
      errs.name = "Brand name must be at least 2 characters.";
    } else if (nameTrimmed.length > 100) {
      errs.name = "Brand name cannot exceed 100 characters.";
    } else {
      // Case-insensitive uniqueness
      const dup = brands.find(
        (b) => b._id !== editingId && b.name?.trim().toLowerCase() === nameTrimmed.toLowerCase()
      );
      if (dup) {
        errs.name = `Brand "${nameTrimmed}" already exists. Brand names must be unique.`;
      }
    }

    const slugTrimmed = (form.slug || "").trim().toLowerCase();
    if (!slugTrimmed) {
      errs.slug = "Brand slug is required.";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugTrimmed)) {
      errs.slug = "Slug must contain only lowercase letters, numbers, and hyphens.";
    } else {
      const dupSlug = brands.find(
        (b) => b._id !== editingId && b.slug?.trim().toLowerCase() === slugTrimmed
      );
      if (dupSlug) {
        errs.slug = "This slug is already in use. Please choose another slug.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNameChange = (val) => {
    setForm((prev) => {
      const next = { ...prev, name: val };
      if (!editingId && (!prev.slug || prev.slug === slugify(prev.name))) {
        next.slug = slugify(val);
      }
      return next;
    });

    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
    if (errors.slug) setErrors((prev) => ({ ...prev, slug: "" }));
  };

  const handleSlugChange = (val) => {
    const clean = val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    setForm((prev) => ({ ...prev, slug: clean }));
    if (errors.slug) setErrors((prev) => ({ ...prev, slug: "" }));
  };

  const openNew = () => {
    setEditingId(null);
    setErrors({});
    const nextOrder = brands.length > 0 ? Math.max(...brands.map((b) => Number(b.order) || 0)) + 1 : 1;
    setForm({
      ...initialForm,
      order: nextOrder
    });
    setModalOpen(true);
  };

  const openEdit = (b) => {
    setEditingId(b._id);
    setErrors({});
    setForm({
      name: b.name || "",
      slug: b.slug || "",
      logo: b.logo || "",
      bannerImage: b.bannerImage || "",
      brandImage: b.brandImage || "",
      description: b.description || "",
      websiteUrl: b.websiteUrl || "",
      order: Number(b.order) || 0,
      isFeatured: Boolean(b.isFeatured),
      isActive: b.isActive !== false,
      status: b.status || "active",
      seoTitle: b.seoTitle || "",
      seoDescription: b.seoDescription || "",
      seoKeywords: b.seoKeywords || ""
    });
    setModalOpen(true);
  };

  const saveBrand = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalSlug = form.slug.trim() ? form.slug.trim().toLowerCase() : slugify(form.name);
    const payload = {
      ...form,
      name: form.name.trim(),
      slug: finalSlug,
      order: Number(form.order) || 0,
      status: form.isActive ? "active" : "draft"
    };

    try {
      if (editingId) {
        await apiFetch(`/admin/brands/${editingId}`, {
          method: "PUT",
          body: payload
        });
      } else {
        await apiFetch("/admin/brands", {
          method: "POST",
          body: payload
        });
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      if (err.field) {
        setErrors((prev) => ({ ...prev, [err.field]: err.message }));
      } else {
        alert(err.message || "Failed to save brand");
      }
    }
  };

  // Safe Deletion Handler
  const initiateDelete = async (brand) => {
    setBrandToDelete(brand);
    setUsageLoading(true);
    setDeleteModalOpen(true);
    setAffectedProducts([]);

    const otherBrand = brands.find((b) => b._id !== brand._id && b.isActive !== false);
    setReassignTarget(otherBrand?.name || "Other / Independent");

    try {
      const usageRes = await apiFetch(`/admin/brands/${brand._id}/usage`);
      setAffectedProducts(usageRes.products || []);
    } catch (err) {
      // Fallback
    } finally {
      setUsageLoading(false);
    }
  };

  const executeDirectDelete = async () => {
    if (!brandToDelete) return;
    try {
      await apiFetch(`/admin/brands/${brandToDelete._id}`, { method: "DELETE" });
      setDeleteModalOpen(false);
      setBrandToDelete(null);
      await loadData();
    } catch (err) {
      if (err.code === "BRAND_IN_USE") {
        setAffectedProducts(err.products || []);
      } else {
        alert(err.message || "Failed to delete brand");
      }
    }
  };

  const executeReassignAndDelete = async () => {
    if (!brandToDelete || !reassignTarget) {
      alert("Please select a target brand to reassign products to.");
      return;
    }
    setReassigning(true);
    try {
      const res = await apiFetch("/admin/brands/reassign-and-delete", {
        method: "POST",
        body: {
          sourceId: brandToDelete._id,
          targetBrandName: reassignTarget
        }
      });
      alert(res.message || "Brand safely deleted and products reassigned.");
      setDeleteModalOpen(false);
      setBrandToDelete(null);
      await loadData();
    } catch (err) {
      alert(err.message || "Reassign & delete failed");
    } finally {
      setReassigning(false);
    }
  };

  const toggleActive = async (brand) => {
    const nextState = !brand.isActive;
    try {
      await apiFetch(`/admin/brands/${brand._id}`, {
        method: "PUT",
        body: { isActive: nextState, status: nextState ? "active" : "draft" }
      });
      setBrands((prev) =>
        prev.map((b) => (b._id === brand._id ? { ...b, isActive: nextState, status: nextState ? "active" : "draft" } : b))
      );
    } catch (err) {
      alert(err.message || "Failed to update brand status");
    }
  };

  const toggleFeatured = async (brand) => {
    const nextFeatured = !brand.isFeatured;
    try {
      await apiFetch(`/admin/brands/${brand._id}`, {
        method: "PUT",
        body: { isFeatured: nextFeatured }
      });
      setBrands((prev) =>
        prev.map((b) => (b._id === brand._id ? { ...b, isFeatured: nextFeatured } : b))
      );
    } catch (err) {
      alert(err.message || "Failed to update brand featured flag");
    }
  };

  const moveOrder = async (index, direction) => {
    if (reordering) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= brands.length) return;

    const list = [...brands];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const updated = list.map((item, idx) => ({
      id: item._id,
      order: idx + 1
    }));

    setBrands(list.map((item, idx) => ({ ...item, order: idx + 1 })));
    setReordering(true);
    try {
      await apiFetch("/admin/brands/reorder", {
        method: "PUT",
        body: { items: updated }
      });
    } catch (err) {
      console.error("Reorder failed:", err);
      loadData();
    } finally {
      setReordering(false);
    }
  };

  const filteredBrands = brands.filter((b) => {
    if (!search) return true;
    return (
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.slug?.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06264A]/5 text-[#06264A] text-xs font-bold uppercase tracking-wider mb-1">
            <Gem className="h-3.5 w-3.5" />
            <span>Eyewear Brand Partnerships</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Brand Management
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Manage luxury and designer optical brands. Enforced with strict data validation, safe deletion rules, and conflict prevention.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-[#06264A] hover:bg-[#0B3564] text-white px-5 py-2.5 text-xs font-bold transition shadow-md shadow-[#06264A]/10"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Brand</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search brands by name, slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#06264A] bg-slate-50/50"
          />
        </div>
        <div className="text-xs text-slate-500 font-bold pr-2">
          Total Brands: {brands.length}
        </div>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5 w-16 text-center">Order</th>
                <th className="p-3.5 w-24">Logo</th>
                <th className="p-3.5">Brand Name</th>
                <th className="p-3.5">Slug / URL</th>
                <th className="p-3.5">Banner Preview</th>
                <th className="p-3.5 text-center">Featured</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBrands.map((brand, idx) => (
                <tr key={brand._id} className="hover:bg-slate-50/70 transition">
                  {/* Order / Reorder */}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-mono font-bold text-slate-500 text-[11px] w-5">
                        {brand.order || idx + 1}
                      </span>
                      <div className="flex flex-col">
                        <button
                          disabled={idx === 0 || reordering}
                          onClick={() => moveOrder(idx, -1)}
                          className="p-0.5 text-slate-400 hover:text-slate-900 disabled:opacity-20"
                          title="Move Up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={idx === filteredBrands.length - 1 || reordering}
                          onClick={() => moveOrder(idx, 1)}
                          className="p-0.5 text-slate-400 hover:text-slate-900 disabled:opacity-20"
                          title="Move Down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Logo Thumbnail */}
                  <td className="p-3">
                    <div className="h-10 w-20 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center">
                      {brand.logo ? (
                        <img
                          src={assetUrl(brand.logo)}
                          alt={brand.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-slate-300 font-bold text-[10px]">No Logo</span>
                      )}
                    </div>
                  </td>

                  {/* Brand Name & Description */}
                  <td className="p-3">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span>{brand.name}</span>
                    </div>
                    {brand.description && (
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 max-w-md">
                        {brand.description}
                      </div>
                    )}
                    {brand.websiteUrl && (
                      <a
                        href={brand.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:underline mt-0.5"
                      >
                        <Globe className="h-3 w-3" />
                        <span>{brand.websiteUrl.replace(/^https?:\/\//, "")}</span>
                      </a>
                    )}
                  </td>

                  {/* Slug */}
                  <td className="p-3">
                    <code className="text-[11px] bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">
                      /{brand.slug}
                    </code>
                  </td>

                  {/* Banner Preview */}
                  <td className="p-3">
                    {brand.bannerImage ? (
                      <div className="h-9 w-24 rounded border border-slate-200 overflow-hidden bg-slate-100">
                        <img
                          src={assetUrl(brand.bannerImage)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No Banner</span>
                    )}
                  </td>

                  {/* Featured */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleFeatured(brand)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                        brand.isFeatured
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <Star className={`h-3 w-3 ${brand.isFeatured ? "fill-amber-400 text-amber-500" : ""}`} />
                      <span>{brand.isFeatured ? "Featured" : "Regular"}</span>
                    </button>
                  </td>

                  {/* Status Toggle */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleActive(brand)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                        brand.isActive !== false
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-600 border border-rose-200"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${brand.isActive !== false ? "bg-emerald-500" : "bg-rose-500"}`} />
                      <span>{brand.isActive !== false ? "Active" : "Hidden"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(brand)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition"
                        title="Edit Brand"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => initiateDelete(brand)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition"
                        title="Delete Brand"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBrands.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-400">
                    No brands found. Click "Add New Brand" above to register brand partners.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  {editingId ? `Edit Brand: ${form.name}` : "Add New Brand"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure brand identity, logo, showcase banner, and official website URL.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveBrand} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Brand Name * <span className="text-slate-400 font-normal">(2–100 chars, Unique)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ray-Ban, Oakley, Vogue Eyewear..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-medium focus:outline-none ${
                      errors.name
                        ? "border-rose-400 bg-rose-50/20 focus:border-rose-600"
                        : "border-slate-300 focus:border-[#06264A]"
                    }`}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1.5 text-rose-600 font-semibold text-[11px] mt-1.5">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Brand Slug (URL Path) *
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-500 font-mono text-[11px]">
                      /brands/
                    </span>
                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="ray-ban"
                      className={`w-full px-3.5 py-2.5 rounded-r-xl border font-mono text-[11px] focus:outline-none ${
                        errors.slug
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-600"
                          : "border-slate-300 focus:border-[#06264A]"
                      }`}
                    />
                  </div>
                  {errors.slug && (
                    <div className="flex items-center gap-1.5 text-rose-600 font-semibold text-[11px] mt-1.5">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.slug}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Logo Uploader */}
              <MediaUploaderWithScreenSize
                label="Brand Vector Logo / High-Res PNG"
                value={form.logo}
                onChange={(val) => setForm({ ...form, logo: val })}
                folder="brands"
                targetScreen="Universal"
                screenBadge="🏷️ Brand Logo (Transparent PNG or SVG)"
                recommendedDimensions="400 × 200 px"
                aspectRatio="2:1 Horizontal"
                helperText="Upload transparent PNG or SVG brand logo for brand carousels, cards, and header filters."
              />

              {/* Banner Image Uploader */}
              <MediaUploaderWithScreenSize
                label="Brand Showcase / Editorial Promotional Banner"
                value={form.bannerImage}
                onChange={(val) => setForm({ ...form, bannerImage: val })}
                folder="brands"
                targetScreen="Desktop"
                screenBadge="🖥️ Brand Banner Showcase (Wide)"
                recommendedDimensions="1600 × 600 px (16:6) or 1920 × 700 px"
                aspectRatio="16:6 Panoramic"
                helperText="Wide editorial promotional hero banner displayed on the brand landing page and homepage brand showcase."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Official Brand Website URL <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={form.websiteUrl}
                    onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                    placeholder="https://www.ray-ban.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Brand Heritage / Editorial Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Official brand story, craftsmanship highlights, and collection highlights..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="h-4 w-4 rounded text-[#06264A]"
                  />
                  <span>Active & Visible on Website</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="h-4 w-4 rounded text-[#06264A]"
                  />
                  <span>Featured Luxury Brand (Homepage Brand Strip)</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#06264A] hover:bg-[#0B3564] text-white font-bold transition shadow-md shadow-[#06264A]/10"
                >
                  {editingId ? "Save Changes" : "Create Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SAFE DELETION GUARD MODAL */}
      {deleteModalOpen && brandToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            {usageLoading ? (
              <div className="py-12 text-center space-y-3">
                <div className="h-8 w-8 border-2 border-[#06264A] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-600">Verifying brand relationships...</p>
              </div>
            ) : affectedProducts.length > 0 ? (
              /* BLOCKED STATE: Products in use */
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold w-fit">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>ACTION BLOCKED: DATA INTEGRITY PROTECTION</span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Cannot Delete Brand: "{brandToDelete.name}"
                  </h3>
                  <div className="p-3.5 mt-2 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                    <p className="font-bold">
                      This brand is currently used by {affectedProducts.length} product{affectedProducts.length > 1 ? "s" : ""}.
                    </p>
                    <p className="mt-0.5 text-amber-800">
                      You cannot delete it until those products are reassigned to another brand partner or removed.
                    </p>
                  </div>
                </div>

                {/* Affected Products Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Affected Products Preview ({affectedProducts.length})</span>
                    <a
                      href={`/admin/products`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#06264A] hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <span>View in Catalogue</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    {affectedProducts.map((p) => (
                      <div key={p._id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={assetUrl(p.mainImage)}
                            alt=""
                            className="h-8 w-10 object-contain rounded bg-slate-50 border"
                          />
                          <div>
                            <div className="font-bold text-slate-900 leading-snug">{p.name}</div>
                            <div className="text-[10px] text-slate-400">{p.category} {p.sku ? `• SKU: ${p.sku}` : ""}</div>
                          </div>
                        </div>
                        <div className="font-bold text-slate-700">
                          {p.price ? `₹${Number(p.price).toLocaleString("en-IN")}` : "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reassign Option */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Option: Reassign all {affectedProducts.length} products & delete:
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={reassignTarget}
                      onChange={(e) => setReassignTarget(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                    >
                      {brands
                        .filter((b) => b._id !== brandToDelete._id && b.isActive !== false)
                        .map((b) => (
                          <option key={b._id} value={b.name}>{b.name}</option>
                        ))}
                      <option value="Other / Independent">Other / Independent</option>
                    </select>
                    <button
                      type="button"
                      disabled={reassigning || !reassignTarget}
                      onClick={executeReassignAndDelete}
                      className="px-4 py-2 rounded-xl bg-[#06264A] hover:bg-[#0B3564] text-white text-xs font-bold disabled:opacity-50 transition shrink-0"
                    >
                      {reassigning ? "Reassigning..." : "Reassign & Delete"}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-5 py-2 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* UNUSED STATE: Safe to delete */
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold w-fit">
                  <Check className="h-3.5 w-3.5" />
                  <span>0 PRODUCTS ATTACHED — SAFE TO DELETE</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Delete Brand: "{brandToDelete.name}"?
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    No products currently belong to this brand. Deleting it will permanently remove it from brand directories, filters, and sitemaps.
                  </p>
                </div>
                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={executeDirectDelete}
                    className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow"
                  >
                    Yes, Delete Brand
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   3. ADMIN PRODUCTS / CATALOGUE MANAGER (WITH STRICT VALIDATION)
   ============================================================ */
export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterBrand, setFilterBrand] = useState("ALL");
  const [errors, setErrors] = useState({});

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [prodToDelete, setProdToDelete] = useState(null);

  // Taxonomy states loaded dynamically from backend
  const [categoriesList, setCategoriesList] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [productTypesList, setProductTypesList] = useState([]);
  const [audiencesList, setAudiencesList] = useState([]);

  // Form State
  const initialForm = {
    name: "",
    brand: "",
    category: "",
    productType: "Eyewear",
    targetAudience: "Unisex",
    gender: "Unisex",
    collectionName: "",
    sku: "",
    price: "",
    salePrice: "",
    mainImage: "",
    images: [],
    frameType: "Full Rim",
    frameShape: "Round",
    frameMaterial: "Acetate",
    lensType: "Single Vision Compatible",
    lensColor: "Clear",
    lensMaterial: "CR-39",
    size: "Medium",
    fit: "Standard Fit",
    uvProtection: "100% UV400",
    polarized: false,
    blueLightProtection: false,
    wearingDuration: "Daily Disposable",
    baseCurve: "8.6 mm",
    diameter: "14.2 mm",
    waterContent: "55%",
    ageGroup: "4-7 Years",
    flexibleFrame: false,
    safetyFeatures: "",
    shortDescription: "",
    fullDescription: "",
    externalEcommerceUrl: "",
    isFeatured: false,
    isActive: true,
    specifications: []
  };

  const [form, setForm] = useState(initialForm);

  const loadTaxonomyAndProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, taxRes, catRes, brandRes] = await Promise.all([
        apiFetch(`/admin/products${search ? `?search=${encodeURIComponent(search)}` : ""}`),
        apiFetch("/taxonomy").catch(() => null),
        apiFetch("/admin/categories").catch(() => null),
        apiFetch("/admin/brands").catch(() => null)
      ]);

      setProducts(prodRes?.items || (Array.isArray(prodRes) ? prodRes : []));

      const cats = Array.isArray(catRes) ? catRes : (catRes?.items || taxRes?.categories || []);
      setCategoriesList(cats);

      const brs = Array.isArray(brandRes) ? brandRes : (brandRes?.items || taxRes?.brands || []);
      setBrandsList(brs);

      if (taxRes) {
        if (taxRes.productTypes?.length) setProductTypesList(taxRes.productTypes.map((p) => p.name));
        if (taxRes.targetAudiences?.length) setAudiencesList(taxRes.targetAudiences.map((a) => a.name));
      }
    } catch (err) {
      console.error("Failed to load products or taxonomy:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaxonomyAndProducts();
  }, [search]);

  const selectedCategoryObj = categoriesList.find(
    (c) => c.name?.toLowerCase() === form.category?.toLowerCase() || c.title?.toLowerCase() === form.category?.toLowerCase()
  );
  const currentCategoryType = (selectedCategoryObj?.categoryType || form.productType || "Eyewear").toLowerCase();
  const isSunglasses = form.category?.toLowerCase().includes("sunglass") || currentCategoryType.includes("sunglass");
  const isContactLens = form.category?.toLowerCase().includes("contact") || currentCategoryType.includes("lens");
  const isKids = form.category?.toLowerCase().includes("kid") || form.targetAudience?.toLowerCase() === "kids" || form.gender?.toLowerCase() === "kids";

  const handleCategorySelect = (selectedCatName) => {
    const matched = categoriesList.find((c) => c.name === selectedCatName);
    setForm((prev) => ({
      ...prev,
      category: selectedCatName,
      productType: matched?.categoryType || prev.productType,
      targetAudience: matched?.targetAudiences?.[0] || prev.targetAudience
    }));
    if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
  };

  // Validation rules for product form
  const validateProductForm = () => {
    const errs = {};
    const nameTrimmed = (form.name || "").trim();
    if (!nameTrimmed) {
      errs.name = "Product name is required.";
    } else if (nameTrimmed.length < 2) {
      errs.name = "Product name must be at least 2 characters.";
    } else if (nameTrimmed.length > 200) {
      errs.name = "Product name cannot exceed 200 characters.";
    }

    if (!form.category || !form.category.trim()) {
      errs.category = "Please select a product category.";
    }

    if (!form.brand || !form.brand.trim()) {
      errs.brand = "Please select a brand.";
    }

    if (!form.targetAudience || !form.targetAudience.trim()) {
      errs.targetAudience = "Please select target audience.";
    }

    if (!form.mainImage || !form.mainImage.trim()) {
      errs.mainImage = "Primary product card photo is required.";
    }

    // SKU uniqueness
    if (form.sku && form.sku.trim()) {
      const skuTrimmed = form.sku.trim();
      const dup = products.find(
        (p) => p._id !== editingId && p.sku && p.sku.trim().toLowerCase() === skuTrimmed.toLowerCase()
      );
      if (dup) {
        errs.sku = `SKU "${skuTrimmed}" is already assigned to "${dup.name}". SKU must be unique.`;
      }
    }

    // Pricing validation
    if (form.price !== "" && form.price !== null && form.price !== undefined) {
      const p = Number(form.price);
      if (isNaN(p) || p < 0) {
        errs.price = "Price must be a valid positive number.";
      }
    }

    if (form.salePrice !== "" && form.salePrice !== null && form.salePrice !== undefined) {
      const sp = Number(form.salePrice);
      if (isNaN(sp) || sp < 0) {
        errs.salePrice = "Sale price must be a valid positive number.";
      } else if (form.price !== "" && form.price !== null && form.price !== undefined) {
        const p = Number(form.price);
        if (sp > p) {
          errs.salePrice = `Sale price (₹${sp}) cannot be higher than regular price (₹${p}).`;
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const addSpecification = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), { key: "", value: "" }]
    }));
  };

  const updateSpecification = (index, field, value) => {
    setForm((prev) => {
      const updated = [...(prev.specifications || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, specifications: updated };
    });
  };

  const removeSpecification = (index) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const openNew = () => {
    setEditingId(null);
    setErrors({});
    const activeCats = categoriesList.filter((c) => c.isActive !== false);
    const activeBrands = brandsList.filter((b) => b.isActive !== false);
    const defaultCat = activeCats[0]?.name || "Optical Frames";
    const defaultBrand = activeBrands[0]?.name || "Ray-Ban";
    setForm({
      ...initialForm,
      category: defaultCat,
      brand: defaultBrand,
      mainImage: "/uploads/cat_optical_frames.jpg",
      specifications: [
        { key: "Frame Dimensions", value: "52-18-140 mm" },
        { key: "Warranty", value: "1 Year Manufacturer Warranty" }
      ]
    });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setErrors({});
    let parsedSpecs = [];
    if (Array.isArray(p.specifications)) {
      parsedSpecs = p.specifications;
    } else if (p.specifications && typeof p.specifications === "object") {
      parsedSpecs = Object.entries(p.specifications).map(([key, value]) => ({ key, value: String(value) }));
    }

    setForm({
      name: p.name || "",
      brand: p.brand || (brandsList[0]?.name || "Ray-Ban"),
      category: p.category || (categoriesList[0]?.name || "Optical Frames"),
      productType: p.productType || "Eyewear",
      targetAudience: p.targetAudience || p.gender || "Unisex",
      gender: p.gender || p.targetAudience || "Unisex",
      collectionName: p.collectionName || "",
      sku: p.sku || "",
      price: p.price ?? "",
      salePrice: p.salePrice ?? "",
      mainImage: p.mainImage || "",
      images: Array.isArray(p.images) ? p.images : [],
      frameType: p.frameType || "Full Rim",
      frameShape: p.frameShape || "Round",
      frameMaterial: p.frameMaterial || "Acetate",
      lensType: p.lensType || "Single Vision Compatible",
      lensColor: p.lensColor || "Clear",
      lensMaterial: p.lensMaterial || "CR-39",
      size: p.size || "Medium",
      fit: p.fit || "Standard Fit",
      uvProtection: p.uvProtection || "100% UV400",
      polarized: Boolean(p.polarized),
      blueLightProtection: Boolean(p.blueLightProtection),
      wearingDuration: p.wearingDuration || "Daily Disposable",
      baseCurve: p.baseCurve || "8.6 mm",
      diameter: p.diameter || "14.2 mm",
      waterContent: p.waterContent || "55%",
      ageGroup: p.ageGroup || "4-7 Years",
      flexibleFrame: Boolean(p.flexibleFrame),
      safetyFeatures: p.safetyFeatures || "",
      shortDescription: p.shortDescription || "",
      fullDescription: p.fullDescription || "",
      externalEcommerceUrl: p.externalEcommerceUrl || "",
      isFeatured: Boolean(p.isFeatured),
      isActive: p.isActive !== false,
      specifications: parsedSpecs.length > 0 ? parsedSpecs : [
        { key: "Frame Dimensions", value: "52-18-140 mm" },
        { key: "Warranty", value: "1 Year Manufacturer Warranty" }
      ]
    });
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateProductForm()) return;

    try {
      const cleanSpecs = (form.specifications || []).filter((s) => s.key?.trim() && s.value?.trim());

      const body = {
        ...form,
        name: form.name.trim(),
        sku: form.sku?.trim() || undefined,
        gender: form.targetAudience || form.gender,
        price: form.price !== "" ? Number(form.price) : undefined,
        salePrice: form.salePrice !== "" ? Number(form.salePrice) : undefined,
        specifications: cleanSpecs
      };

      if (editingId) {
        await apiFetch(`/admin/products/${editingId}`, { method: "PUT", body });
      } else {
        await apiFetch("/admin/products", { method: "POST", body });
      }
      setModalOpen(false);
      loadTaxonomyAndProducts();
    } catch (err) {
      if (err.field) {
        setErrors((prev) => ({ ...prev, [err.field]: err.message }));
      } else {
        alert(err.message || "Failed to save product.");
      }
    }
  };

  const confirmDeleteProduct = (p) => {
    setProdToDelete(p);
    setDeleteModalOpen(true);
  };

  const executeDeleteProduct = async () => {
    if (!prodToDelete) return;
    try {
      await apiFetch(`/admin/products/${prodToDelete._id}`, { method: "DELETE" });
      setDeleteModalOpen(false);
      setProdToDelete(null);
      loadTaxonomyAndProducts();
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  const toggleProductActive = async (p) => {
    const nextState = !p.isActive;
    try {
      await apiFetch(`/admin/products/${p._id}`, {
        method: "PUT",
        body: { isActive: nextState }
      });
      setProducts((prev) =>
        prev.map((item) => (item._id === p._id ? { ...item, isActive: nextState } : item))
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const toggleProductFeatured = async (p) => {
    const nextFeatured = !p.isFeatured;
    try {
      await apiFetch(`/admin/products/${p._id}`, {
        method: "PUT",
        body: { isFeatured: nextFeatured }
      });
      setProducts((prev) =>
        prev.map((item) => (item._id === p._id ? { ...item, isFeatured: nextFeatured } : item))
      );
    } catch (err) {
      alert("Failed to update featured flag");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchCat = filterCategory === "ALL" || p.category?.toLowerCase() === filterCategory.toLowerCase();
    const matchBrand = filterBrand === "ALL" || p.brand?.toLowerCase() === filterBrand.toLowerCase();
    return matchCat && matchBrand;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06264A]/5 text-[#06264A] text-xs font-bold uppercase tracking-wider mb-1">
            <Glasses className="h-3.5 w-3.5" />
            <span>Catalogue & Inventory Management</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Eyewear Products & Catalogue
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Manage frames, sunglasses, lenses, and clinic optical products. Connected dynamically with strict data validation, active relationship enforcement, and pricing checks.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-[#06264A] hover:bg-[#0B3564] text-white px-5 py-2.5 text-xs font-bold transition shadow-md shadow-[#06264A]/10"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Dynamic Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-3 rounded-2xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name, brand, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#06264A] bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-[#06264A]"
          >
            <option value="ALL">All Categories ({categoriesList.length})</option>
            {categoriesList.map((c) => (
              <option key={c._id || c.name} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-[#06264A]"
          >
            <option value="ALL">All Brands ({brandsList.length})</option>
            {brandsList.map((b) => (
              <option key={b._id || b.name} value={b.name}>{b.name}</option>
            ))}
          </select>

          <span className="text-xs text-slate-500 font-bold px-1">
            {filteredProducts.length} items
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5 w-16">Image</th>
                <th className="p-3.5">Product & Brand</th>
                <th className="p-3.5">Category & Type</th>
                <th className="p-3.5">Audience / Fit</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5 text-center">Featured</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3">
                    <div className="h-12 w-14 rounded-lg border border-slate-200 bg-slate-50 p-1 flex items-center justify-center">
                      <img
                        src={assetUrl(p.mainImage)}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {p.brand || "Unbranded"}
                      </span>
                      {p.sku && <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</span>}
                    </div>
                  </td>
                  <td className="p-3 text-slate-600">
                    <div className="font-semibold text-slate-800">{p.category || "—"}</div>
                    <div className="text-[10px] text-slate-400">{p.frameType || p.productType || "Eyewear"}</div>
                  </td>
                  <td className="p-3">
                    <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10.5px] font-bold">
                      {p.targetAudience || p.gender || "Unisex"}
                    </span>
                    {p.frameShape && <div className="text-[10px] text-slate-400 mt-0.5">{p.frameShape}</div>}
                  </td>
                  <td className="p-3 font-bold text-slate-900 text-sm">
                    {p.price ? (
                      <div>
                        <span>₹{Number(p.price).toLocaleString("en-IN")}</span>
                        {p.salePrice && (
                          <span className="text-[10px] text-rose-600 line-through ml-1.5 font-normal">
                            ₹{Number(p.salePrice).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 font-normal">Enquire</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleProductFeatured(p)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                        p.isFeatured
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <Star className={`h-3 w-3 ${p.isFeatured ? "fill-amber-400 text-amber-500" : ""}`} />
                      <span>{p.isFeatured ? "Featured" : "Regular"}</span>
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleProductActive(p)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                        p.isActive !== false
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-600 border border-rose-200"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${p.isActive !== false ? "bg-emerald-500" : "bg-rose-500"}`} />
                      <span>{p.isActive !== false ? "Active" : "Hidden"}</span>
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition"
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => confirmDeleteProduct(p)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-400">
                    No products found matching current filters. Click "Add New Product" to populate your catalogue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  {editingId ? `Edit Product: ${form.name}` : "Add New Eyewear Product"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-dimensional product classification with active relationship validation and pricing checks.
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-5 text-xs">
              {/* Basic Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Product Model / Name * <span className="text-slate-400 font-normal">(2–200 chars)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    placeholder="e.g. Aviator Classic Gold, Wayfarer Matte Black..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-medium focus:outline-none ${
                      errors.name
                        ? "border-rose-400 bg-rose-50/20 focus:border-rose-600"
                        : "border-slate-300 focus:border-[#06264A]"
                    }`}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1.5 text-rose-600 font-semibold text-[11px] mt-1.5">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    SKU / Model Code <span className="text-slate-400 font-normal">(Unique per product)</span>
                  </label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => {
                      setForm({ ...form, sku: e.target.value });
                      if (errors.sku) setErrors({ ...errors, sku: "" });
                    }}
                    placeholder="RB3025-001/58"
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-mono focus:outline-none ${
                      errors.sku
                        ? "border-rose-400 bg-rose-50/20 focus:border-rose-600"
                        : "border-slate-300 focus:border-[#06264A]"
                    }`}
                  />
                  {errors.sku && (
                    <div className="flex items-center gap-1.5 text-rose-600 font-semibold text-[11px] mt-1.5">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.sku}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Brand & Category Selectors (RELATIONSHIP ENFORCEMENT) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {/* Brand Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Gem className="h-3.5 w-3.5 text-[#06264A]" />
                    <span>Brand *</span>
                  </label>
                  <select
                    value={form.brand}
                    onChange={(e) => {
                      setForm({ ...form, brand: e.target.value });
                      if (errors.brand) setErrors({ ...errors, brand: "" });
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl border bg-white font-medium focus:outline-none ${
                      errors.brand
                        ? "border-rose-400 bg-rose-50/20 focus:border-rose-600"
                        : "border-slate-300 focus:border-[#06264A]"
                    }`}
                  >
                    <option value="">-- Choose Brand --</option>
                    {brandsList
                      .filter((b) => b.isActive !== false || b.name === form.brand)
                      .map((b) => (
                        <option key={b._id || b.name} value={b.name}>
                          {b.name} {b.isActive === false ? "(Inactive)" : ""}
                        </option>
                      ))}
                    <option value="Other / Independent">Other / Independent</option>
                  </select>
                  {errors.brand && (
                    <div className="flex items-center gap-1 text-rose-600 font-semibold text-[11px] mt-1.5">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.brand}</span>
                    </div>
                  )}
                </div>

                {/* Category Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-[#06264A]" />
                    <span>Category *</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border bg-white font-medium focus:outline-none ${
                      errors.category
                        ? "border-rose-400 bg-rose-50/20 focus:border-rose-600"
                        : "border-slate-300 focus:border-[#06264A]"
                    }`}
                  >
                    <option value="">-- Choose Category --</option>
                    {categoriesList
                      .filter((c) => c.isActive !== false || c.name === form.category)
                      .map((c) => (
                        <option key={c._id || c.name} value={c.name}>
                          {c.name} {c.isActive === false ? "(Inactive)" : ""}
                        </option>
                      ))}
                  </select>
                  {errors.category && (
                    <div className="flex items-center gap-1 text-rose-600 font-semibold text-[11px] mt-1.5">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.category}</span>
                    </div>
                  )}
                </div>

                {/* Target Audience / Gender */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#06264A]" />
                    <span>Target Audience *</span>
                  </label>
                  <select
                    value={form.targetAudience}
                    onChange={(e) => {
                      setForm({ ...form, targetAudience: e.target.value, gender: e.target.value });
                      if (errors.targetAudience) setErrors({ ...errors, targetAudience: "" });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:border-[#06264A]"
                  >
                    {audiencesList.length > 0 ? (
                      audiencesList.map((aud) => (
                        <option key={aud} value={aud}>{aud}</option>
                      ))
                    ) : (
                      <>
                        <option value="Unisex">Unisex</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                        <option value="Seniors">Seniors</option>
                        <option value="Teenagers">Teenagers</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Image Uploader */}
              <div>
                <MediaUploaderWithScreenSize
                  label="Product Card Image (Primary Eyewear Photo) *"
                  value={form.mainImage}
                  onChange={(val) => {
                    setForm({ ...form, mainImage: val });
                    if (errors.mainImage) setErrors({ ...errors, mainImage: "" });
                  }}
                  folder="products"
                  targetScreen="Universal"
                  screenBadge="🖥️ Desktop / 📱 Mobile Card Image"
                  recommendedDimensions="1000 × 1000 px"
                  aspectRatio="1:1 Square or 4:5 Portrait"
                  helperText="Primary high-resolution eyewear frame photo displayed in catalogue cards, filters, and product detail page."
                />
                {errors.mainImage && (
                  <div className="flex items-center gap-1.5 text-rose-600 font-semibold text-[11px] mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.mainImage}</span>
                  </div>
                )}
              </div>

              {/* Pricing & Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => {
                      setForm({ ...form, price: e.target.value });
                      if (errors.price) setErrors({ ...errors, price: "" });
                    }}
                    placeholder="Regular MRP (e.g. 8500)"
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                      errors.price
                        ? "border-rose-400 bg-rose-50/20 focus:border-rose-600"
                        : "border-slate-300 focus:border-[#06264A]"
                    }`}
                  />
                  {errors.price && (
                    <div className="flex items-center gap-1 text-rose-600 font-semibold text-[11px] mt-1.5">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.price}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Sale / Offer Price (₹) <span className="text-slate-400 font-normal">(≤ Regular Price)</span>
                  </label>
                  <input
                    type="number"
                    value={form.salePrice}
                    onChange={(e) => {
                      setForm({ ...form, salePrice: e.target.value });
                      if (errors.salePrice) setErrors({ ...errors, salePrice: "" });
                    }}
                    placeholder="Discounted (e.g. 7200)"
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                      errors.salePrice
                        ? "border-rose-400 bg-rose-50/20 focus:border-rose-600"
                        : "border-slate-300 focus:border-[#06264A]"
                    }`}
                  />
                  {errors.salePrice && (
                    <div className="flex items-center gap-1 text-rose-600 font-semibold text-[11px] mt-1.5">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.salePrice}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">External Direct Buy URL</label>
                  <input
                    type="url"
                    value={form.externalEcommerceUrl}
                    onChange={(e) => setForm({ ...form, externalEcommerceUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                  />
                </div>
              </div>

              {/* DYNAMIC CATEGORY-SPECIFIC ATTRIBUTES SECTION */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-[#06264A]" />
                    <span>Technical Attributes ({form.category || "Eyewear"})</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Dynamic fields for optical specifications</span>
                </div>

                {/* Common Optical Fields */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Frame Rim / Type</label>
                    <select
                      value={form.frameType}
                      onChange={(e) => setForm({ ...form, frameType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Full Rim">Full Rim</option>
                      <option value="Semi-Rimless">Semi-Rimless</option>
                      <option value="Rimless">Rimless</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Frame Shape</label>
                    <select
                      value={form.frameShape}
                      onChange={(e) => setForm({ ...form, frameShape: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Aviator">Aviator</option>
                      <option value="Round">Round</option>
                      <option value="Wayfarer">Wayfarer</option>
                      <option value="Rectangle">Rectangle</option>
                      <option value="Square">Square</option>
                      <option value="Cat-Eye">Cat-Eye</option>
                      <option value="Geometric">Geometric</option>
                      <option value="Clubmaster">Clubmaster</option>
                      <option value="Oval">Oval</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Frame Material</label>
                    <select
                      value={form.frameMaterial}
                      onChange={(e) => setForm({ ...form, frameMaterial: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Acetate">Acetate</option>
                      <option value="Titanium">Titanium</option>
                      <option value="Stainless Steel">Stainless Steel</option>
                      <option value="TR-90">TR-90 Memory Polymer</option>
                      <option value="Metal Alloy">Metal Alloy</option>
                      <option value="Bio-Acetate">Bio-Acetate</option>
                      <option value="Carbon Fiber">Carbon Fiber</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Size & Fit</label>
                    <select
                      value={form.size}
                      onChange={(e) => setForm({ ...form, size: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Small">Small (Narrow)</option>
                      <option value="Medium">Medium (Standard)</option>
                      <option value="Large">Large (Wide)</option>
                      <option value="Extra Large">Extra Large</option>
                    </select>
                  </div>
                </div>

                {/* Sunglasses Specific Fields */}
                {isSunglasses && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">UV Protection</label>
                      <select
                        value={form.uvProtection}
                        onChange={(e) => setForm({ ...form, uvProtection: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="100% UV400">100% UV400 (Max)</option>
                        <option value="UV380">UV380</option>
                        <option value="Category 3">Category 3 Sunlight</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Lens Tint / Color</label>
                      <input
                        type="text"
                        value={form.lensColor}
                        onChange={(e) => setForm({ ...form, lensColor: e.target.value })}
                        placeholder="G-15 Green, Grey..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Lens Material</label>
                      <select
                        value={form.lensMaterial}
                        onChange={(e) => setForm({ ...form, lensMaterial: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="Mineral Glass">Mineral Glass (Scratch-Proof)</option>
                        <option value="Polycarbonate">Polycarbonate (Impact-Resistant)</option>
                        <option value="CR-39">CR-39 Optical Resin</option>
                        <option value="Nylon">High-Grade Nylon</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={form.polarized}
                          onChange={(e) => setForm({ ...form, polarized: e.target.checked })}
                          className="h-4 w-4 rounded text-[#06264A]"
                        />
                        <span>Polarized Lens</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Contact Lens Specific Fields */}
                {isContactLens && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Wearing Duration</label>
                      <select
                        value={form.wearingDuration}
                        onChange={(e) => setForm({ ...form, wearingDuration: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="Daily Disposable">Daily Disposable</option>
                        <option value="Monthly Disposable">Monthly Disposable</option>
                        <option value="Bi-Weekly">Bi-Weekly</option>
                        <option value="Extended Wear">Extended Wear</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Base Curve (BC)</label>
                      <input
                        type="text"
                        value={form.baseCurve}
                        onChange={(e) => setForm({ ...form, baseCurve: e.target.value })}
                        placeholder="8.4 mm, 8.6 mm..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Diameter (DIA)</label>
                      <input
                        type="text"
                        value={form.diameter}
                        onChange={(e) => setForm({ ...form, diameter: e.target.value })}
                        placeholder="14.0 mm, 14.2 mm..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Water Content</label>
                      <input
                        type="text"
                        value={form.waterContent}
                        onChange={(e) => setForm({ ...form, waterContent: e.target.value })}
                        placeholder="38%, 55%, 69%..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>
                )}

                {/* Kids Specific Fields */}
                {isKids && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Age Group</label>
                      <select
                        value={form.ageGroup}
                        onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="0-3 Years (Infant/Toddler)">0-3 Years (Infant/Toddler)</option>
                        <option value="4-7 Years (Junior)">4-7 Years (Junior)</option>
                        <option value="8-12 Years (Pre-Teen)">8-12 Years (Pre-Teen)</option>
                        <option value="Teens">Teens</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Safety Features</label>
                      <input
                        type="text"
                        value={form.safetyFeatures}
                        onChange={(e) => setForm({ ...form, safetyFeatures: e.target.value })}
                        placeholder="BPA-Free, Headband compatible..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={form.flexibleFrame}
                          onChange={(e) => setForm({ ...form, flexibleFrame: e.target.checked })}
                          className="h-4 w-4 rounded text-[#06264A]"
                        />
                        <span>Unbreakable / Flexible TR-90 Frame</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* CUSTOM EXTENSIBLE SPECIFICATIONS (KEY-VALUE PAIRS) */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-slate-800 text-xs">
                      Custom Specifications & Measurements <span className="text-slate-400 font-normal">(Dynamic key-value pairs)</span>
                    </label>
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#06264A] hover:underline"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Custom Field</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {form.specifications?.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Feature (e.g. Hinge, Temple)"
                          value={spec.key}
                          onChange={(e) => updateSpecification(sIdx, "key", e.target.value)}
                          className="w-1/3 px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Specification value"
                          value={spec.value}
                          onChange={(e) => updateSpecification(sIdx, "value", e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecification(sIdx)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {(!form.specifications || form.specifications.length === 0) && (
                      <p className="text-[11px] text-slate-400 italic">No custom specifications added. Click "Add Custom Field" to attach any custom measurement or detail.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Editorial Short Description</label>
                <textarea
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="Crafted from hand-polished Italian acetate featuring signature rivets and embossed temple branding..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="h-4 w-4 rounded text-[#06264A]"
                  />
                  <span>Active & In Stock (Online & In-Store Kalina)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="h-4 w-4 rounded text-[#06264A]"
                  />
                  <span>Featured Showcase Item</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.blueLightProtection}
                    onChange={(e) => setForm({ ...form, blueLightProtection: e.target.checked })}
                    className="h-4 w-4 rounded text-[#06264A]"
                  />
                  <span>Blue-Light Filter Compatible</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#06264A] hover:bg-[#0B3564] text-white font-bold transition shadow-md shadow-[#06264A]/10"
                >
                  {editingId ? "Save Product Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && prodToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold w-fit">
              <Trash2 className="h-3.5 w-3.5" />
              <span>DELETE PRODUCT CONFIRMATION</span>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Delete "{prodToDelete.name}"?
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to permanently delete this eyewear model? It will be removed from customer catalogue, filters, and store inventory.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border flex items-center gap-3 text-xs">
              <img
                src={assetUrl(prodToDelete.mainImage)}
                alt=""
                className="h-10 w-12 object-contain bg-white rounded border p-1"
              />
              <div>
                <div className="font-bold text-slate-900">{prodToDelete.name}</div>
                <div className="text-[11px] text-slate-500">{prodToDelete.brand} • {prodToDelete.category}</div>
              </div>
            </div>
            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-5 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDeleteProduct}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   3. ADMIN APPOINTMENTS MANAGER
   ============================================================ */
export const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    apiFetch("/admin/appointments")
      .then((res) => setAppointments(res.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await apiFetch(`/admin/appointments/${id}/status`, {
        method: "PATCH",
        body: { status }
      });
      load();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
          Eye Test & Clinic Appointments
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review consultation and eye check-up requests submitted by website visitors.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Patient Name</th>
                <th className="p-3.5">Phone & Contact</th>
                <th className="p-3.5">Service Requested</th>
                <th className="p-3.5">Preferred Slot</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((a) => (
                <tr key={a._id} className="hover:bg-slate-50/60 transition">
                  <td className="p-3 font-bold text-slate-900">{a.name}</td>
                  <td className="p-3">
                    <a href={`tel:${a.phone}`} className="font-bold text-[#042041] hover:underline block">
                      {a.phone}
                    </a>
                    {a.email && <div className="text-[11px] text-slate-400">{a.email}</div>}
                  </td>
                  <td className="p-3 text-slate-700">{a.serviceRequested}</td>
                  <td className="p-3 text-slate-600">
                    <div>{a.preferredDate || "Any Date"}</div>
                    <div className="text-[11px] text-slate-400">{a.preferredTime}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        a.status === "confirmed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : a.status === "completed"
                          ? "bg-blue-50 text-blue-700"
                          : a.status === "cancelled"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {a.status || "pending"}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    {a.status !== "confirmed" && (
                      <button
                        onClick={() => updateStatus(a._id, "confirmed")}
                        className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]"
                      >
                        Confirm
                      </button>
                    )}
                    {a.status !== "completed" && (
                      <button
                        onClick={() => updateStatus(a._id, "completed")}
                        className="px-2.5 py-1 rounded bg-[#042041] text-white font-bold text-[10px]"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No appointment requests yet. Submissions from "Book Eye Test" will appear here in real time.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   4. ADMIN HERO BANNERS (FULL-WIDTH VISUAL BANNER CMS)
   ============================================================ */
export const AdminHeroBanners = () => {
  const [banners, setBanners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewScreen, setPreviewScreen] = useState("desktop"); // "desktop" | "tablet" | "mobile"
  const [form, setForm] = useState({
    desktopImage: "",
    tabletImage: "",
    mobileImage: "",
    bannerUrl: "",
    eyebrow: "",
    heading: "",
    description: "",
    locationText: "",
    button1Enabled: false,
    button1Text: "",
    button1Url: "",
    button2Enabled: false,
    button2Text: "",
    button2Url: "",
    overlayType: "dark",
    textPosition: "bottom-left",
    textAlignment: "left",
    textColor: "light",
    height: "large",
    isActive: true,
    order: 0
  });

  const load = () => {
    apiFetch("/admin/hero-banners")
      .then((res) => setBanners(res.items || []))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setPreviewScreen("desktop");
    setForm({
      desktopImage: "/uploads/hero_banner.jpg",
      tabletImage: "",
      mobileImage: "",
      bannerUrl: "",
      eyebrow: "",
      heading: "",
      description: "",
      locationText: "",
      button1Enabled: false,
      button1Text: "",
      button1Url: "/contact",
      button2Enabled: false,
      button2Text: "",
      button2Url: "/eyewear",
      overlayType: "dark",
      textPosition: "bottom-left",
      textAlignment: "left",
      textColor: "light",
      height: "large",
      isActive: true,
      order: banners.length + 1
    });
    setModalOpen(true);
  };

  const openEdit = (b) => {
    setEditingId(b._id);
    setPreviewScreen("desktop");
    setForm({
      desktopImage: b.desktopImage || "",
      tabletImage: b.tabletImage || "",
      mobileImage: b.mobileImage || "",
      bannerUrl: b.bannerUrl || b.destinationUrl || "",
      eyebrow: b.eyebrow || b.eyebrowText || "",
      heading: b.heading || b.title || "",
      description: b.description || b.subtitle || "",
      locationText: b.locationText || b.locationBadge || "",
      button1Enabled: b.button1Enabled ?? Boolean(b.button1Text || b.buttonText),
      button1Text: b.button1Text || b.buttonText || "",
      button1Url: b.button1Url || b.buttonLink || "/contact",
      button2Enabled: b.button2Enabled ?? Boolean(b.button2Text || b.button2Link),
      button2Text: b.button2Text || "",
      button2Url: b.button2Url || b.button2Link || "/eyewear",
      overlayType: b.overlayType || "dark",
      textPosition: b.textPosition || "bottom-left",
      textAlignment: b.textAlignment || "left",
      textColor: b.textColor || "light",
      height: b.height || "large",
      isActive: b.isActive !== false,
      order: b.order || 0
    });
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.desktopImage) {
      alert("Please upload or enter a desktop banner image.");
      return;
    }
    try {
      const payload = {
        ...form,
        title: form.heading,
        heading: form.heading,
        subtitle: form.description,
        description: form.description,
        eyebrowText: form.eyebrow,
        eyebrow: form.eyebrow,
        buttonText: form.button1Text,
        buttonLink: form.button1Url,
        button2Link: form.button2Url,
        destinationUrl: form.bannerUrl,
        locationBadge: form.locationText
      };
      if (editingId) {
        await apiFetch(`/admin/hero-banners/${editingId}`, { method: "PUT", body: payload });
      } else {
        await apiFetch("/admin/hero-banners", { method: "POST", body: payload });
      }
      setModalOpen(false);
      notifyHomepageSectionsUpdated();
      load();
    } catch (err) {
      alert("Failed to save banner: " + err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    await apiFetch(`/admin/hero-banners/${id}`, { method: "DELETE" });
    notifyHomepageSectionsUpdated();
    load();
  };

  const hasCopy = Boolean(
    form.eyebrow ||
    form.heading ||
    form.description ||
    (form.button1Enabled && form.button1Text) ||
    (form.button2Enabled && form.button2Text) ||
    form.locationText
  );

  // Active image based on preview screen toggle
  const activePreviewImage =
    previewScreen === "mobile" && form.mobileImage
      ? form.mobileImage
      : previewScreen === "tablet" && form.tabletImage
      ? form.tabletImage
      : form.desktopImage;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Hero Banners & Slider
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage full-width visual campaign banners. Images span the entire container with optional overlay text and CTAs.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-[#042041] hover:bg-[#0B2A52] text-white px-5 py-2.5 text-xs font-bold shadow transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Hero Banner</span>
        </button>
      </div>

      {/* Banner Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((b) => {
          const bannerHeading = b.heading || b.title;
          const bannerDesc = b.description || b.subtitle;
          const bannerEyebrow = b.eyebrow || b.eyebrowText;
          return (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div className="aspect-[16/7] overflow-hidden bg-slate-950 relative">
                <img
                  src={assetUrl(b.desktopImage)}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow ${
                    b.isActive ? "bg-emerald-500 text-white" : "bg-slate-600 text-white"
                  }`}
                >
                  {b.isActive ? "Active" : "Inactive"}
                </span>
                {b.bannerUrl && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                    Link: {b.bannerUrl}
                  </span>
                )}
                {/* Visual indicator if text overlay is configured */}
                {bannerHeading && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                    {bannerEyebrow && (
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
                        {bannerEyebrow}
                      </p>
                    )}
                    <h4 className="font-serif text-sm font-bold truncate">{bannerHeading}</h4>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    {bannerHeading || "(Visual Image-Only Banner)"}
                  </span>
                  <span className="text-[10px] text-slate-400">Order: {b.order || 0}</span>
                </div>
                {bannerDesc && (
                  <p className="text-xs text-slate-500 line-clamp-2">{bannerDesc}</p>
                )}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Pos: {b.textPosition || "bottom-left"} • {b.overlayType || "dark"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(b)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(b._id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor Modal with Screen Size Responsive Live Preview */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  {editingId ? "Edit Full-Width Banner" : "New Full-Width Banner"}
                </h3>
                <p className="text-xs text-slate-500">
                  Full-width visual banner with optional text overlay and multi-screen support.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* REAL-TIME LIVE PREVIEW WITH SCREEN SIZE SWITCHER */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-3xl border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Live Banner Preview
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Current View: <strong className="text-[#042041] capitalize font-bold">{previewScreen} Screen</strong>
                  </span>
                </div>

                {/* Screen Size Switcher Pills */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setPreviewScreen("desktop")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      previewScreen === "desktop"
                        ? "bg-[#042041] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    <span>Desktop</span>
                    <span className="text-[10px] opacity-75">(100%)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewScreen("tablet")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      previewScreen === "tablet"
                        ? "bg-[#042041] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Tablet className="h-3.5 w-3.5" />
                    <span>Tablet</span>
                    <span className="text-[10px] opacity-75">(768px)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewScreen("mobile")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      previewScreen === "mobile"
                        ? "bg-[#042041] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Mobile</span>
                    <span className="text-[10px] opacity-75">(375px)</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Responsive Screen Container */}
              <div
                className={`transition-all duration-300 mx-auto ${
                  previewScreen === "desktop"
                    ? "w-full"
                    : previewScreen === "tablet"
                    ? "w-full max-w-[620px]"
                    : "w-full max-w-[340px]"
                }`}
              >
                <div
                  className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-300 shadow-md ${
                    previewScreen === "mobile"
                      ? "aspect-[3/4]"
                      : previewScreen === "tablet"
                      ? "aspect-[16/10]"
                      : "aspect-[16/7]"
                  }`}
                >
                  {activePreviewImage ? (
                    <img
                      src={assetUrl(activePreviewImage)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                      Upload a {previewScreen} image to see live preview
                    </div>
                  )}

                  {/* Scrim Overlay */}
                  {hasCopy && form.overlayType !== "none" && (
                    <div
                      className={`absolute inset-0 pointer-events-none ${
                        form.overlayType === "light"
                          ? "bg-gradient-to-t from-white/90 via-white/50 to-transparent"
                          : form.overlayType === "gradient"
                          ? "bg-gradient-to-r from-black/85 via-black/40 to-transparent"
                          : "bg-gradient-to-t from-black/85 via-black/40 to-transparent"
                      }`}
                    />
                  )}

                  {/* Text Overlay */}
                  {hasCopy && (
                    <div
                      className={`absolute inset-0 p-4 sm:p-6 flex pointer-events-none ${
                        form.textPosition === "center"
                          ? "items-center justify-center text-center"
                          : form.textPosition === "left"
                          ? "items-center justify-start text-left"
                          : form.textPosition === "right"
                          ? "items-center justify-end text-right"
                          : form.textPosition === "top-left"
                          ? "items-start justify-start text-left"
                          : form.textPosition === "top-right"
                          ? "items-start justify-end text-right"
                          : form.textPosition === "bottom-right"
                          ? "items-end justify-end text-right"
                          : "items-end justify-start text-left"
                      } ${form.textColor === "dark" ? "text-[#042041]" : "text-white"}`}
                    >
                      <div className="max-w-md space-y-1.5">
                        {form.eyebrow && (
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                            {form.eyebrow}
                          </p>
                        )}
                        {form.heading && (
                          <h2 className="font-serif text-lg sm:text-2xl font-bold leading-tight">
                            {form.heading}
                          </h2>
                        )}
                        {form.description && (
                          <p className="text-[11px] sm:text-xs opacity-90 line-clamp-2">{form.description}</p>
                        )}
                        {(form.button1Enabled || form.button2Enabled) && (
                          <div className="flex gap-2 pt-1.5">
                            {form.button1Enabled && form.button1Text && (
                              <span className="inline-block px-3 py-1 rounded-full bg-white text-[#042041] text-[10px] font-bold shadow-xs">
                                {form.button1Text}
                              </span>
                            )}
                            {form.button2Enabled && form.button2Text && (
                              <span className="inline-block px-3 py-1 rounded-full border border-white/60 bg-black/20 text-white text-[10px] font-bold">
                                {form.button2Text}
                              </span>
                            )}
                          </div>
                        )}
                        {form.locationText && (
                          <p className="text-[10px] opacity-75 pt-1">📍 {form.locationText}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-5 text-xs">
              {/* Image & Screen Size Uploads */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">1. Multi-Screen Banner Images & Link</h4>
                  <span className="text-[11px] text-slate-500">Auto-detected resolution upon selection</span>
                </div>

                <div className="space-y-3">
                  {/* Desktop Banner Image */}
                  <MediaUploaderWithScreenSize
                    label="Desktop Banner Image (Primary) *"
                    value={form.desktopImage}
                    onChange={(val) => setForm({ ...form, desktopImage: val })}
                    folder="banners"
                    targetScreen="Desktop"
                    screenBadge="🖥️ Desktop Screen (≥ 1024px width)"
                    recommendedDimensions="1920 × 820 px"
                    aspectRatio="16:7 aspect ratio"
                    helperText="Primary high-resolution visual banner shown across desktop and wide laptop displays."
                  />

                  {/* Tablet Banner Image */}
                  <MediaUploaderWithScreenSize
                    label="Tablet Banner Image (Optional)"
                    value={form.tabletImage}
                    onChange={(val) => setForm({ ...form, tabletImage: val })}
                    folder="banners"
                    targetScreen="Tablet"
                    screenBadge="📱 Tablet Screen (640px – 1023px width)"
                    recommendedDimensions="1024 × 600 px"
                    aspectRatio="16:9.5 aspect ratio"
                    helperText="Optional specific framing optimized for iPad, tablet, and horizontal orientations."
                  />

                  {/* Mobile Banner Image */}
                  <MediaUploaderWithScreenSize
                    label="Mobile Banner Image (Optional)"
                    value={form.mobileImage}
                    onChange={(val) => setForm({ ...form, mobileImage: val })}
                    folder="banners"
                    targetScreen="Mobile"
                    screenBadge="📱 Mobile Screen (< 640px width)"
                    recommendedDimensions="750 × 1000 px"
                    aspectRatio="3:4 portrait aspect ratio"
                    helperText="Optional vertical or compact crop so optical frames & models stay centered on phones."
                  />

                  <div>
                    <label className="block font-bold mb-1 text-slate-700">Banner Click Destination URL (Optional)</label>
                    <input
                      type="text"
                      value={form.bannerUrl}
                      onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
                      placeholder="/eyewear, /brands/ray-ban, or https://..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Content Overlay */}
              <div className="bg-slate-50 p-4 rounded-2xl border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">2. Optional Text Overlay</h4>
                  <span className="text-[11px] text-slate-400">Leave blank for clean image-only banner</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">Eyebrow / Small Label (Optional)</label>
                    <input
                      type="text"
                      value={form.eyebrow}
                      onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
                      placeholder="e.g. PREMIUM EYEWEAR"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700">Heading (Optional)</label>
                    <input
                      type="text"
                      value={form.heading}
                      onChange={(e) => setForm({ ...form, heading: e.target.value })}
                      placeholder="e.g. SEE BETTER. LOOK YOUR BEST."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold mb-1 text-slate-700">Description / Paragraph (Optional)</label>
                    <textarea
                      rows={2}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="e.g. Expert eye care and genuine luxury eyewear in Kalina, Mumbai."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold mb-1 text-slate-700">Location / Additional Text (Optional)</label>
                    <input
                      type="text"
                      value={form.locationText}
                      onChange={(e) => setForm({ ...form, locationText: e.target.value })}
                      placeholder="e.g. Shop No 11, Agarwal Building, Kalina, Santacruz East, Mumbai"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-slate-50 p-4 rounded-2xl border space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">3. Action Buttons</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Button 1 */}
                  <div className="p-3 bg-white rounded-xl border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">CTA Button 1</span>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.button1Enabled}
                          onChange={(e) => setForm({ ...form, button1Enabled: e.target.checked })}
                          className="rounded text-[#042041]"
                        />
                        <span className="font-bold text-[11px]">Enable</span>
                      </label>
                    </div>
                    {form.button1Enabled && (
                      <div className="space-y-2 pt-1">
                        <input
                          type="text"
                          value={form.button1Text}
                          onChange={(e) => setForm({ ...form, button1Text: e.target.value })}
                          placeholder="Button Text (e.g. Book an Eye Test)"
                          className="w-full px-3 py-1.5 rounded-lg border text-xs"
                        />
                        <input
                          type="text"
                          value={form.button1Url}
                          onChange={(e) => setForm({ ...form, button1Url: e.target.value })}
                          placeholder="Button Link (e.g. /contact)"
                          className="w-full px-3 py-1.5 rounded-lg border text-xs"
                        />
                      </div>
                    )}
                  </div>

                  {/* Button 2 */}
                  <div className="p-3 bg-white rounded-xl border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">CTA Button 2</span>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.button2Enabled}
                          onChange={(e) => setForm({ ...form, button2Enabled: e.target.checked })}
                          className="rounded text-[#042041]"
                        />
                        <span className="font-bold text-[11px]">Enable</span>
                      </label>
                    </div>
                    {form.button2Enabled && (
                      <div className="space-y-2 pt-1">
                        <input
                          type="text"
                          value={form.button2Text}
                          onChange={(e) => setForm({ ...form, button2Text: e.target.value })}
                          placeholder="Button Text (e.g. Explore Collections)"
                          className="w-full px-3 py-1.5 rounded-lg border text-xs"
                        />
                        <input
                          type="text"
                          value={form.button2Url}
                          onChange={(e) => setForm({ ...form, button2Url: e.target.value })}
                          placeholder="Button Link (e.g. /eyewear)"
                          className="w-full px-3 py-1.5 rounded-lg border text-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Styling, Positioning & Layout */}
              <div className="bg-slate-50 p-4 rounded-2xl border space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">4. Positioning, Overlay & Height</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">Text Position</label>
                    <select
                      value={form.textPosition}
                      onChange={(e) => setForm({ ...form, textPosition: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="bottom-left">Bottom Left (Default)</option>
                      <option value="left">Center Left</option>
                      <option value="center">Center</option>
                      <option value="right">Center Right</option>
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700">Text Alignment</label>
                    <select
                      value={form.textAlignment}
                      onChange={(e) => setForm({ ...form, textAlignment: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="left">Left Aligned</option>
                      <option value="center">Centered</option>
                      <option value="right">Right Aligned</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700">Overlay Scrim</label>
                    <select
                      value={form.overlayType}
                      onChange={(e) => setForm({ ...form, overlayType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="dark">Dark Gradient (for white text)</option>
                      <option value="light">Light Gradient (for navy text)</option>
                      <option value="gradient">Directional Gradient</option>
                      <option value="none">None (Clean Image)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700">Banner Height</label>
                    <select
                      value={form.height}
                      onChange={(e) => setForm({ ...form, height: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="large">Large (~680px desktop)</option>
                      <option value="medium">Medium (~580px desktop)</option>
                      <option value="small">Small (~500px desktop)</option>
                      <option value="auto">Auto Aspect (16:7 Ratio)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700">Text Color</label>
                    <select
                      value={form.textColor}
                      onChange={(e) => setForm({ ...form, textColor: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="light">Light (White)</option>
                      <option value="dark">Dark (Deep Navy)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700">Display Order</label>
                    <input
                      type="number"
                      value={form.order}
                      onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                        className="rounded text-[#042041]"
                      />
                      <span className="font-bold text-slate-700">Banner Enabled / Active</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-300 rounded-full font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-[#042041] hover:bg-[#0B2A52] text-white rounded-full font-bold shadow transition-all"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   5. ADMIN WEBSITE SETTINGS
   ============================================================ */
export const AdminWebsiteSettings = () => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch("/settings").then((res) => {
      if (res.site) setForm(res.site);
    }).finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/admin/site-settings", {
        method: "PUT",
        body: form
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to save settings: " + err.message);
    }
  };

  if (loading) return <div className="p-8 text-xs text-slate-500">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
          Global Website Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Brand identity, store contact information, Google Maps embed, social media, and SEO.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>Settings saved successfully! Website updated.</span>
        </div>
      )}

      <form onSubmit={save} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Business Name</label>
            <input
              type="text"
              value={form.siteName || ""}
              onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline || ""}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
            />
          </div>
        </div>

        <div className="space-y-4">
          <MediaUploaderWithScreenSize
            label="Primary Brand Logo"
            value={form.logo}
            onChange={(url) => setForm({ ...form, logo: url })}
            folder="logo"
            targetScreen="desktop"
            screenBadge="🖥️ Desktop & 📱 Mobile Header (Universal)"
            recommendedDimensions="500 × 150 px"
            aspectRatio="3.3:1 Horizontal (Transparent PNG or SVG)"
            helperText="Displayed in the sticky navigation header on desktop (max-h: 52px) and mobile (max-h: 40px), as well as footer branding."
            placeholder="/prettyvision_logo.png or upload image file"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MediaUploaderWithScreenSize
              label="Browser Tab Favicon & Bookmark Icon"
              value={form.favicon}
              onChange={(url) => setForm({ ...form, favicon: url })}
              folder="favicon"
              targetScreen="mobile"
              screenBadge="🌐 Browser Tab & Mobile App Icon"
              recommendedDimensions="64 × 64 px or 128 × 128 px"
              aspectRatio="1:1 Square (PNG, ICO, SVG)"
              helperText="Appears in browser tabs, favorites bar, and mobile home screen bookmarks."
              placeholder="/favicon.ico or upload small square icon"
            />

            <MediaUploaderWithScreenSize
              label="Social Share & OpenGraph Preview Banner"
              value={form.ogImage}
              onChange={(url) => setForm({ ...form, ogImage: url })}
              folder="seo"
              targetScreen="desktop"
              screenBadge="🖥️ & 📱 Social Share Card"
              recommendedDimensions="1200 × 630 px"
              aspectRatio="1.91:1 Landscape (JPG, PNG, WebP)"
              helperText="Rich preview banner shown when sharing the website on WhatsApp, Twitter/X, LinkedIn, and iMessage."
              placeholder="Paste URL or upload 1200×630 share card"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Store Physical Address</label>
          <textarea
            rows={2}
            value={form.address || ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Google Maps Embed URL (iframe src)</label>
          <input
            type="text"
            value={form.googleMapsEmbedUrl || ""}
            onChange={(e) => setForm({ ...form, googleMapsEmbedUrl: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Instagram URL</label>
            <input
              type="text"
              value={form.instagramUrl || ""}
              onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Facebook URL</label>
            <input
              type="text"
              value={form.facebookUrl || ""}
              onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">WhatsApp Number</label>
            <input
              type="text"
              value={form.whatsappNumber || ""}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-[#042041] hover:bg-[#0B2A52] text-white px-8 py-3 font-bold uppercase tracking-wider text-xs shadow-md transition"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
