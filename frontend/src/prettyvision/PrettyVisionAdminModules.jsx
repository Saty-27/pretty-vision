import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Layers,
  Gem,
  MapPin,
  Instagram,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  Check,
  AlertCircle,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Clock,
  Phone,
  PhoneCall,
  MessageCircle,
  Smartphone,
  Monitor,
  RotateCcw,
  Mail,
  Compass,
  ArrowRight,
  RefreshCw,
  X
} from "lucide-react";
import { apiFetch, assetUrl } from "../api";
import { MediaUploaderWithScreenSize } from "./PrettyVisionAdmin";
import {
  WhatsAppIcon,
  buildCallUrl,
  buildWhatsAppUrl,
  normalizePhoneNumber
} from "./FloatingContactButtons";
import { FinalCTA, DynamicIcon } from "./PrettyVisionComponents";

const notifySections = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("homepage-sections-updated"));
  }
};

/* ============================================================
   1. FRAME COLLECTIONS MODULE
   Route: /admin/collections & /admin/frame-collections
   ============================================================ */
export const AdminCollections = () => {
  const [collections, setCollections] = useState([]);
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingSec, setSavingSec] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null, 'new', or item object
  const [form, setForm] = useState({});
  const [savingItem, setSavingItem] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [msg, setMsg] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [colRes, secRes] = await Promise.all([
        apiFetch("/admin/collections?limit=50"),
        apiFetch("/homepage-sections")
      ]);
      setCollections(colRes.items || colRes || []);
      const sec = (secRes.sections || secRes.items || []).find((s) => s.sectionKey === "collections");
      if (sec) setSectionData(sec);
    } catch (err) {
      setMsg("Failed to load collections: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSection = async (e) => {
    e.preventDefault();
    if (!sectionData) return;
    try {
      setSavingSec(true);
      await apiFetch(`/admin/homepage-sections/collections`, {
        method: "PUT",
        body: {
          sectionTitle: sectionData.sectionTitle,
          sectionSubtitle: sectionData.sectionSubtitle,
          homepageVisible: sectionData.homepageVisible !== false,
          content: {
            ...sectionData.content,
            viewAllText: sectionData.content?.viewAllText || "View All Collections",
            viewAllLink: sectionData.content?.viewAllLink || "/eyewear"
          }
        }
      });
      notifySections();
      setMsg("Section header settings saved successfully.");
      setTimeout(() => setMsg(""), 3500);
    } catch (err) {
      alert(err.message || "Failed to update section header.");
    } finally {
      setSavingSec(false);
    }
  };

  const handleOpenEdit = (item) => {
    if (item === "new") {
      setEditingItem("new");
      setForm({
        title: "",
        subtitle: "",
        badge: "",
        image: "",
        buttonText: "Explore",
        destinationUrl: "/eyewear?gender=Men",
        theme: "light",
        hasEmbeddedText: false,
        order: collections.length + 1,
        isActive: true,
        status: "active"
      });
    } else {
      setEditingItem(item);
      setForm({
        title: item.title || "",
        subtitle: item.subtitle || "",
        badge: item.badge || "",
        image: item.image || "",
        buttonText: item.buttonText || "Explore",
        destinationUrl: item.destinationUrl || "/eyewear",
        theme: item.theme || "light",
        hasEmbeddedText: Boolean(item.hasEmbeddedText),
        order: item.order ?? 0,
        isActive: item.isActive !== false,
        status: item.status || "active"
      });
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!form.title) {
      alert("Please provide a title for this collection.");
      return;
    }
    try {
      setSavingItem(true);
      if (editingItem === "new") {
        await apiFetch("/admin/collections", {
          method: "POST",
          body: form
        });
      } else {
        await apiFetch(`/admin/collections/${editingItem._id}`, {
          method: "PUT",
          body: form
        });
      }
      notifySections();
      setEditingItem(null);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to save collection item.");
    } finally {
      setSavingItem(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await apiFetch(`/admin/collections/${deleteModal._id}`, {
        method: "DELETE"
      });
      notifySections();
      setDeleteModal(null);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to delete collection.");
    }
  };

  const moveItem = async (idx, dir) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= collections.length) return;
    const reordered = [...collections];
    const [moved] = reordered.splice(idx, 1);
    reordered.splice(targetIdx, 0, moved);
    setCollections(reordered);

    try {
      await apiFetch("/admin/collections/reorder", {
        method: "PUT",
        body: { orderedIds: reordered.map((c) => c._id) }
      });
      notifySections();
    } catch (err) {
      loadData();
    }
  };

  const toggleItemActive = async (item) => {
    try {
      const nextActive = !item.isActive;
      await apiFetch(`/admin/collections/${item._id}`, {
        method: "PUT",
        body: { isActive: nextActive, status: nextActive ? "active" : "draft" }
      });
      notifySections();
      setCollections((prev) =>
        prev.map((c) => (c._id === item._id ? { ...c, isActive: nextActive } : c))
      );
    } catch (err) {
      alert("Failed to toggle status");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06264A]/5 text-[#06264A] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#06264A]" />
            <span>Section 1 • Explore Our Collections</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Frame Collections Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure section headings, destination URLs, and manage all showcase frame collection cards (4:3 / 1:1 format).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenEdit("new")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#06264A] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#0A3360] transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Collection</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* SECTION HEADER CONFIGURATION CARD */}
      {sectionData && (
        <form onSubmit={handleSaveSection} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Section Header & Navigation Controls
              </h2>
              <p className="text-[11px] text-slate-500">Controls the eyebrow, heading, and 'View All' link displayed on the homepage.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sectionData.homepageVisible !== false}
                onChange={(e) => setSectionData({ ...sectionData, homepageVisible: e.target.checked })}
                className="rounded border-slate-300 text-[#06264A] focus:ring-[#06264A]"
              />
              <span className="text-xs font-bold text-slate-700">Show Section on Homepage</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Eyebrow Subtitle</label>
              <input
                type="text"
                value={sectionData.sectionSubtitle || ""}
                onChange={(e) => setSectionData({ ...sectionData, sectionSubtitle: e.target.value })}
                placeholder="e.g. EXPLORE OUR COLLECTIONS"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Main Heading</label>
              <input
                type="text"
                value={sectionData.sectionTitle || ""}
                onChange={(e) => setSectionData({ ...sectionData, sectionTitle: e.target.value })}
                placeholder="e.g. FRAMES FOR EVERY STYLE"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">View All Button Text</label>
              <input
                type="text"
                value={sectionData.content?.viewAllText || "View All Collections"}
                onChange={(e) =>
                  setSectionData({
                    ...sectionData,
                    content: { ...sectionData.content, viewAllText: e.target.value }
                  })
                }
                placeholder="View All Collections"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">View All Destination Link</label>
              <input
                type="text"
                value={sectionData.content?.viewAllLink || "/eyewear"}
                onChange={(e) =>
                  setSectionData({
                    ...sectionData,
                    content: { ...sectionData.content, viewAllLink: e.target.value }
                  })
                }
                placeholder="/eyewear"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingSec}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-black transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSec ? "Saving..." : "Save Header Settings"}</span>
            </button>
          </div>
        </form>
      )}

      {/* COLLECTIONS CARD GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Showcase Collection Cards ({collections.length})
          </h2>
          <span className="text-[11px] text-slate-500">
            Tip: You can reorder cards with the arrow buttons. All active cards appear dynamically on the homepage carousel.
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading collection cards...</div>
        ) : collections.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No collections found</p>
            <p className="text-xs text-slate-400 mt-1">Create your first collection card using the button above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {collections.map((item, idx) => (
              <div
                key={item._id}
                className={`bg-white rounded-2xl border ${
                  item.isActive === false ? "border-slate-200 opacity-60 bg-slate-50" : "border-slate-200 shadow-xs"
                } overflow-hidden flex flex-col justify-between transition-all`}
              >
                {/* Image Preview Container */}
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  {item.image ? (
                    <img
                      src={assetUrl(item.image)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    {item.badge && (
                      <span className="bg-[#06264A] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                        {item.badge}
                      </span>
                    )}
                    <span className="bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Active Toggle Switch */}
                  <button
                    onClick={() => toggleItemActive(item)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 text-slate-700 hover:bg-white shadow-xs"
                    title={item.isActive !== false ? "Click to disable" : "Click to activate"}
                  >
                    {item.isActive !== false ? (
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Card Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-slate-900 truncate">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.subtitle || "No subtitle"}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-1">
                      Link: {item.destinationUrl}
                    </p>
                  </div>

                  {/* Action Bar */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveItem(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20"
                        title="Move Left"
                      >
                        <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                      <button
                        onClick={() => moveItem(idx, 1)}
                        disabled={idx === collections.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20"
                        title="Move Right"
                      >
                        <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-[#06264A] hover:bg-slate-100 transition"
                        title="Edit Card"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteModal(item)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                        title="Delete Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT / CREATE MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                {editingItem === "new" ? "Add New Frame Collection" : `Edit: ${editingItem.title}`}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Collection Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Men's Eyewear, Sunglasses"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtitle / Editorial Tagline
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="e.g. Modern. Sharp. Versatile."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Badge / Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="e.g. Trending, New, Premium"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Button CTA Label
                  </label>
                  <input
                    type="text"
                    value={form.buttonText}
                    onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                    placeholder="e.g. Explore"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  value={form.destinationUrl}
                  onChange={(e) => setForm({ ...form, destinationUrl: e.target.value })}
                  placeholder="/eyewear?gender=Men"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
                <div className="mt-1 flex flex-wrap gap-1.5 text-[10px]">
                  <span className="text-slate-400">Quick presets:</span>
                  {[
                    { label: "Men", url: "/eyewear?gender=Men" },
                    { label: "Women", url: "/eyewear?gender=Women" },
                    { label: "Kids", url: "/eyewear?gender=Kids" },
                    { label: "Sunglasses", url: "/eyewear?category=Sunglasses" },
                    { label: "Contact Lenses", url: "/eyewear?category=Contact+Lenses" }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setForm({ ...form, destinationUrl: preset.url })}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Uploader */}
              <MediaUploaderWithScreenSize
                label="Card Showcase Photo"
                value={form.image}
                onChange={(val) => setForm({ ...form, image: val })}
                recommendedSize="1200 x 900 px (4:3) or 1080 x 1080 px (1:1)"
                screenBadge="Card Showcase"
              />

              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="rounded border-slate-300 text-[#06264A] focus:ring-[#06264A]"
                  />
                  <span>Published (Active)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.hasEmbeddedText}
                    onChange={(e) => setForm({ ...form, hasEmbeddedText: e.target.checked })}
                    className="rounded border-slate-300 text-[#06264A] focus:ring-[#06264A]"
                  />
                  <span>Poster has built-in text</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingItem}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#06264A] hover:bg-[#0A3360] rounded-xl transition shadow-md"
                >
                  {savingItem ? "Saving..." : "Save Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Delete Collection?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <span className="font-bold text-slate-800">"{deleteModal.title}"</span>? This will remove the card from the homepage carousel.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


/* ============================================================
   2. STORE / VISIT US MODULE
   Route: /admin/store & /admin/store-settings
   ============================================================ */
export const AdminStoreLocation = () => {
  const [store, setStore] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const loadStore = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/admin/store-location");
      setStore(res.store || res.item || {});
    } catch (err) {
      setNotice("Failed to load store information: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStore();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await apiFetch("/admin/store-location", {
        method: "PUT",
        body: store
      });
      notifySections();
      setNotice("Store location, operating hours, and imagery updated successfully!");
      setTimeout(() => setNotice(""), 4000);
    } catch (err) {
      alert(err.message || "Failed to update store details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06264A]/5 text-[#06264A] text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#06264A]" />
            <span>Section 4 • Store & Eye Care Clinic Details</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Store & Location Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Update store name, address, business hours, interior/exterior showroom photos, and interactive Google Maps embed.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#06264A] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#0A3360] transition"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Store Details"}</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Loading store configuration...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. General Boutique Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Store Identity & Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Store Name / Heading</label>
                <input
                  type="text"
                  value={store.name || "PRETTY VISION KALINA"}
                  onChange={(e) => setStore({ ...store, name: e.target.value })}
                  placeholder="PRETTY VISION KALINA"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eyebrow Subtitle</label>
                <input
                  type="text"
                  value={store.eyebrow || "VISIT OUR STORE"}
                  onChange={(e) => setStore({ ...store, eyebrow: e.target.value })}
                  placeholder="VISIT OUR STORE"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Clinic & Store Address</label>
                <textarea
                  rows={2}
                  value={store.address || ""}
                  onChange={(e) => setStore({ ...store, address: e.target.value })}
                  placeholder="Shop No 11, Agarwal Building, Market, opposite Nilesh Dryfruits, Kolivery Village, Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Call)</label>
                <input
                  type="text"
                  value={store.phone || "095940 30310"}
                  onChange={(e) => setStore({ ...store, phone: e.target.value })}
                  placeholder="095940 30310"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Email</label>
                <input
                  type="email"
                  value={store.email || "prettyvisionkalina@gmail.com"}
                  onChange={(e) => setStore({ ...store, email: e.target.value })}
                  placeholder="prettyvisionkalina@gmail.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>
            </div>
          </div>

          {/* 2. Store Business Hours */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Business & Optometrist Clinic Hours
            </h2>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Opening Hours (Lines appear formatted on website)
              </label>
              <textarea
                rows={3}
                value={store.hours || ""}
                onChange={(e) => setStore({ ...store, hours: e.target.value })}
                placeholder={"Monday – Saturday: 10:00 AM – 9:30 PM\nSunday: 11:00 AM – 8:00 PM"}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A] font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: Use separate lines for Weekdays and Sundays.
              </p>
            </div>
          </div>

          {/* 3. Boutique Imagery (Interior & Exterior) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Boutique Photography (3-Column Layout: Interior Left, Info Center, Exterior Right)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MediaUploaderWithScreenSize
                label="Store Interior Photo (Left Column)"
                value={store.interiorImage || "/store_interior_ref.png"}
                onChange={(val) => setStore({ ...store, interiorImage: val })}
                recommendedSize="1200 x 900 px (4:3) or 1600 x 1200 px"
                screenBadge="Interior Showroom"
              />

              <MediaUploaderWithScreenSize
                label="Store Exterior / Street Front Photo (Right Column)"
                value={store.exteriorImage || "/store_exterior_ref.png"}
                onChange={(val) => setStore({ ...store, exteriorImage: val })}
                recommendedSize="1200 x 900 px (4:3) or 1600 x 1200 px"
                screenBadge="Storefront Exterior"
              />
            </div>
          </div>

          {/* 4. Google Maps & Navigation Links */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Google Maps & Action CTA Buttons
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Button 1 Text (Directions)
                </label>
                <input
                  type="text"
                  value={store.button1Text || "Get Directions"}
                  onChange={(e) => setStore({ ...store, button1Text: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Button 1 Destination URL
                </label>
                <input
                  type="text"
                  value={store.button1Url || store.directionsUrl || "https://maps.google.com/?q=Pretty+Vision+Kalina+Mumbai"}
                  onChange={(e) =>
                    setStore({ ...store, button1Url: e.target.value, directionsUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Button 2 Text (Call CTA)
                </label>
                <input
                  type="text"
                  value={store.button2Text || "095940 30310"}
                  onChange={(e) => setStore({ ...store, button2Text: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Button 2 Destination URL
                </label>
                <input
                  type="text"
                  value={store.button2Url || "tel:09594030310"}
                  onChange={(e) => setStore({ ...store, button2Url: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Maps Embed Iframe URL
                </label>
                <input
                  type="text"
                  value={store.mapEmbedUrl || ""}
                  onChange={(e) => setStore({ ...store, mapEmbedUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>
            </div>

            {/* Interactive Google Map Preview */}
            {store.mapEmbedUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-slate-200">
                <p className="p-2.5 bg-slate-50 text-[11px] font-bold text-slate-600 border-b border-slate-200">
                  Interactive Live Map Preview:
                </p>
                <iframe
                  title="Google Map Preview"
                  src={store.mapEmbedUrl}
                  width="100%"
                  height="260"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#06264A] text-white px-8 py-3 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#0A3360] transition"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Store Configuration"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};


/* ============================================================
   3. INSTAGRAM FEED MODULE
   Route: /admin/instagram & /admin/gallery
   ============================================================ */
export const AdminInstagramFeed = () => {
  const [items, setItems] = useState([]);
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingSec, setSavingSec] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  const [savingItem, setSavingItem] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [msg, setMsg] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [galRes, secRes] = await Promise.all([
        apiFetch("/admin/gallery-items?limit=50"),
        apiFetch("/homepage-sections")
      ]);
      setItems(galRes.items || galRes || []);
      const sec = (secRes.sections || secRes.items || []).find((s) => s.sectionKey === "gallery");
      if (sec) setSectionData(sec);
    } catch (err) {
      setMsg("Failed to load Instagram gallery: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSection = async (e) => {
    e.preventDefault();
    if (!sectionData) return;
    try {
      setSavingSec(true);
      await apiFetch("/admin/homepage-sections/gallery", {
        method: "PUT",
        body: {
          sectionTitle: sectionData.sectionTitle,
          sectionSubtitle: sectionData.sectionSubtitle,
          homepageVisible: sectionData.homepageVisible !== false,
          content: {
            ...sectionData.content,
            instagramUrl: sectionData.content?.instagramUrl || "https://instagram.com/prettyvision_kalina",
            viewAllText: sectionData.content?.viewAllText || "View on Instagram",
            viewAllLink: sectionData.content?.viewAllLink || "https://instagram.com/prettyvision_kalina"
          }
        }
      });
      notifySections();
      setMsg("Instagram section settings saved successfully.");
      setTimeout(() => setMsg(""), 3500);
    } catch (err) {
      alert(err.message || "Failed to update section header.");
    } finally {
      setSavingSec(false);
    }
  };

  const handleOpenEdit = (item) => {
    if (item === "new") {
      setEditingItem("new");
      setForm({
        title: "",
        caption: "",
        image: "",
        instagramUrl: sectionData?.content?.instagramUrl || "https://instagram.com/prettyvision_kalina",
        destinationUrl: "",
        order: items.length + 1,
        isActive: true,
        status: "active"
      });
    } else {
      setEditingItem(item);
      setForm({
        title: item.title || "",
        caption: item.caption || "",
        image: item.image || "",
        instagramUrl: item.instagramUrl || "https://instagram.com/prettyvision_kalina",
        destinationUrl: item.destinationUrl || "",
        order: item.order ?? 0,
        isActive: item.isActive !== false,
        status: item.status || "active"
      });
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!form.image) {
      alert("Please upload or provide an image for this Instagram tile.");
      return;
    }
    try {
      setSavingItem(true);
      if (editingItem === "new") {
        await apiFetch("/admin/gallery-items", {
          method: "POST",
          body: form
        });
      } else {
        await apiFetch(`/admin/gallery-items/${editingItem._id}`, {
          method: "PUT",
          body: form
        });
      }
      notifySections();
      setEditingItem(null);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to save Instagram item.");
    } finally {
      setSavingItem(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await apiFetch(`/admin/gallery-items/${deleteModal._id}`, {
        method: "DELETE"
      });
      notifySections();
      setDeleteModal(null);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to delete item.");
    }
  };

  const moveItem = async (idx, dir) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const reordered = [...items];
    const [moved] = reordered.splice(idx, 1);
    reordered.splice(targetIdx, 0, moved);
    setItems(reordered);

    try {
      await apiFetch("/admin/gallery-items/reorder", {
        method: "PUT",
        body: { orderedIds: reordered.map((c) => c._id) }
      });
      notifySections();
    } catch (err) {
      loadData();
    }
  };

  const toggleItemActive = async (item) => {
    try {
      const nextActive = !item.isActive;
      await apiFetch(`/admin/gallery-items/${item._id}`, {
        method: "PUT",
        body: { isActive: nextActive, status: nextActive ? "active" : "draft" }
      });
      notifySections();
      setItems((prev) =>
        prev.map((c) => (c._id === item._id ? { ...c, isActive: nextActive } : c))
      );
    } catch (err) {
      alert("Failed to toggle status");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Instagram className="w-3.5 h-3.5" />
            <span>Section 5 • Social Proof & Lifestyle Feed</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Instagram Feed Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage the continuous 8-tile lifestyle Instagram feed on the homepage with direct post links and 1:1 square photos.
          </p>
        </div>

        <button
          onClick={() => handleOpenEdit("new")}
          className="inline-flex items-center gap-2 rounded-xl bg-[#06264A] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#0A3360] transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Instagram Tile</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* SECTION HEADER CONFIGURATION */}
      {sectionData && (
        <form onSubmit={handleSaveSection} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Instagram Feed Header Controls
              </h2>
              <p className="text-[11px] text-slate-500">Handle name, heading, and external profile redirect.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sectionData.homepageVisible !== false}
                onChange={(e) => setSectionData({ ...sectionData, homepageVisible: e.target.checked })}
                className="rounded border-slate-300 text-[#06264A] focus:ring-[#06264A]"
              />
              <span className="text-xs font-bold text-slate-700">Show Section on Homepage</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Title</label>
              <input
                type="text"
                value={sectionData.sectionTitle || "FOLLOW PRETTYVISION"}
                onChange={(e) => setSectionData({ ...sectionData, sectionTitle: e.target.value })}
                placeholder="FOLLOW PRETTYVISION"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Instagram Handle / Eyebrow</label>
              <input
                type="text"
                value={sectionData.sectionSubtitle || "@prettyvision_kalina"}
                onChange={(e) => setSectionData({ ...sectionData, sectionSubtitle: e.target.value })}
                placeholder="@prettyvision_kalina"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Instagram Profile URL</label>
              <input
                type="text"
                value={sectionData.content?.instagramUrl || "https://instagram.com/prettyvision_kalina"}
                onChange={(e) =>
                  setSectionData({
                    ...sectionData,
                    content: { ...sectionData.content, instagramUrl: e.target.value }
                  })
                }
                placeholder="https://instagram.com/prettyvision_kalina"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingSec}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-black transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSec ? "Saving..." : "Save Feed Settings"}</span>
            </button>
          </div>
        </form>
      )}

      {/* 8-TILE GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Instagram Lifestyle Tiles ({items.length})
          </h2>
          <span className="text-[11px] text-slate-500">
            Rendered as seamless 1:1 squares across the homepage. Clicking any tile opens your Instagram post.
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading Instagram tiles...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <Instagram className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No Instagram posts found</p>
            <p className="text-xs text-slate-400 mt-1">Add square lifestyle photos using the button above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {items.map((item, idx) => (
              <div
                key={item._id}
                className={`group relative rounded-xl overflow-hidden aspect-square bg-slate-100 border ${
                  item.isActive === false ? "border-slate-300 opacity-50" : "border-slate-200 shadow-2xs hover:shadow-lg"
                } transition-all flex flex-col justify-between`}
              >
                {/* Photo */}
                <img
                  src={assetUrl(item.image)}
                  alt={item.title || "Instagram Tile"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                {/* Number Badge */}
                <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                  #{idx + 1}
                </span>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-[#06264A]/80 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1 rounded bg-white/20 hover:bg-white/40 text-white"
                      title="Edit"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setDeleteModal(item)}
                      className="p-1 rounded bg-rose-500/80 hover:bg-rose-600 text-white"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] font-bold truncate">{item.title || "Instagram Tile"}</p>
                    <p className="text-[8px] opacity-75 truncate">{item.caption}</p>
                  </div>

                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => moveItem(idx, -1)}
                      disabled={idx === 0}
                      className="p-0.5 text-white/80 hover:text-white disabled:opacity-30"
                      title="Move Left"
                    >
                      <ArrowUp className="w-3 h-3 -rotate-90" />
                    </button>
                    <button
                      onClick={() => moveItem(idx, 1)}
                      disabled={idx === items.length - 1}
                      className="p-0.5 text-white/80 hover:text-white disabled:opacity-30"
                      title="Move Right"
                    >
                      <ArrowDown className="w-3 h-3 -rotate-90" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                {editingItem === "new" ? "Add Instagram Post Tile" : "Edit Instagram Tile"}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="mt-4 space-y-4">
              <MediaUploaderWithScreenSize
                label="Instagram Photo (1:1 Square)"
                value={form.image}
                onChange={(val) => setForm({ ...form, image: val })}
                recommendedSize="1080 x 1080 px (1:1 Square)"
                screenBadge="Instagram 1:1"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title / Theme Name
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Summer Tones, Classic Aviators"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="e.g. Handcrafted acetate frames for effortless daily wear."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Direct Instagram Post / Profile URL
                </label>
                <input
                  type="text"
                  value={form.instagramUrl}
                  onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/prettyvision_kalina"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 pt-1">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-[#06264A] focus:ring-[#06264A]"
                />
                <span>Published (Show in Homepage Feed)</span>
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingItem}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#06264A] hover:bg-[#0A3360] rounded-xl transition shadow-md"
                >
                  {savingItem ? "Saving..." : "Save Tile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Delete Instagram Tile?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this photo from your homepage feed?
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


/* ============================================================
   4. BRAND BANNER SHOWCASE MODULE
   Route: /admin/brand-banner
   ============================================================ */
export const AdminBrandBanner = () => {
  const [sectionData, setSectionData] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [secRes, bRes] = await Promise.all([
        apiFetch("/homepage-sections"),
        apiFetch("/admin/brands?limit=100")
      ]);
      const sec = (secRes.sections || secRes.items || []).find((s) => s.sectionKey === "brand_showcase");
      if (sec) setSectionData(sec);
      setBrands(bRes.items || bRes || []);
    } catch (err) {
      setNotice("Failed to load banner data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBrandSelect = (brandName) => {
    const found = brands.find((b) => b.name === brandName);
    if (!found) return;
    setSectionData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        brandName: found.name,
        brandLogo: found.logo || prev.content?.brandLogo,
        button2Text: `Explore ${found.name}`,
        button2Link: `/brands/${found.slug || found.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!sectionData) return;
    try {
      setSaving(true);
      await apiFetch("/admin/homepage-sections/brand_showcase", {
        method: "PUT",
        body: sectionData
      });
      notifySections();
      setNotice("Brand Showcase banner settings updated successfully!");
      setTimeout(() => setNotice(""), 4000);
    } catch (err) {
      alert(err.message || "Failed to save banner settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06264A]/5 text-[#06264A] text-xs font-bold uppercase tracking-wider mb-2">
            <Gem className="w-3.5 h-3.5 text-[#06264A]" />
            <span>Section 3 • Our Brands Promotional Banner</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Brand Banner Showcase
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure the full-width editorial brand showcase banner (1920x700), left copywriting, and right featured brand spotlight.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#06264A] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#0A3360] transition"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Banner"}</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {loading || !sectionData ? (
        <div className="py-16 text-center text-xs text-slate-500">Loading banner configuration...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. Left Editorial Block */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Left Editorial Copy & Primary CTA
                </h2>
                <p className="text-[11px] text-slate-500">Eyebrow, Main Heading, description, and primary brand button.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sectionData.homepageVisible !== false}
                  onChange={(e) => setSectionData({ ...sectionData, homepageVisible: e.target.checked })}
                  className="rounded border-slate-300 text-[#06264A] focus:ring-[#06264A]"
                />
                <span className="text-xs font-bold text-slate-700">Show Section on Homepage</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={sectionData.sectionSubtitle || "ICONIC BRANDS. TIMELESS STYLE."}
                  onChange={(e) => setSectionData({ ...sectionData, sectionSubtitle: e.target.value })}
                  placeholder="ICONIC BRANDS. TIMELESS STYLE."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Heading</label>
                <input
                  type="text"
                  value={sectionData.sectionTitle || "OUR BRANDS"}
                  onChange={(e) => setSectionData({ ...sectionData, sectionTitle: e.target.value })}
                  placeholder="OUR BRANDS"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Description Paragraph</label>
                <input
                  type="text"
                  value={sectionData.description || "Explore premium global brands at Pretty Vision."}
                  onChange={(e) => setSectionData({ ...sectionData, description: e.target.value })}
                  placeholder="Explore premium global brands at Pretty Vision."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Button Text</label>
                <input
                  type="text"
                  value={sectionData.content?.button1Text || "View All Brands"}
                  onChange={(e) =>
                    setSectionData({
                      ...sectionData,
                      content: { ...sectionData.content, button1Text: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Button Link</label>
                <input
                  type="text"
                  value={sectionData.content?.button1Link || "/brands"}
                  onChange={(e) =>
                    setSectionData({
                      ...sectionData,
                      content: { ...sectionData.content, button1Link: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>
            </div>
          </div>

          {/* 2. Background / Eyewear Composition Image */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Banner Background Image (1920 x 700 px, 2.74:1 Aspect Ratio)
            </h2>

            <MediaUploaderWithScreenSize
              label="Showcase Eyewear Visual Banner"
              value={sectionData.content?.desktopImage || sectionData.content?.image || "/brand_sunglasses_feathered.png"}
              onChange={(val) =>
                setSectionData({
                  ...sectionData,
                  content: { ...sectionData.content, desktopImage: val, image: val }
                })
              }
              recommendedSize="1920 x 700 px (Panoramic Wide 2.74:1) with transparent or deep navy edge"
              screenBadge="Wide Banner (1920x700)"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image Fit</label>
                <select
                  value={sectionData.content?.imageFit || "contain"}
                  onChange={(e) =>
                    setSectionData({
                      ...sectionData,
                      content: { ...sectionData.content, imageFit: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                >
                  <option value="contain">Contain (Crisp eyewear silhouettes)</option>
                  <option value="cover">Cover (Fill entire area)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image Position Alignment</label>
                <select
                  value={sectionData.content?.imagePosition || "center"}
                  onChange={(e) =>
                    setSectionData({
                      ...sectionData,
                      content: { ...sectionData.content, imagePosition: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                >
                  <option value="center">Center / Slight Right</option>
                  <option value="right">Right Heavy</option>
                  <option value="left">Left</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Right Featured Brand Spotlight */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Right Featured Brand Spotlight
                </h2>
                <p className="text-[11px] text-slate-500">Pick from your Brand catalog or enter custom promotional details.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sectionData.content?.featuredEnabled !== false}
                  onChange={(e) =>
                    setSectionData({
                      ...sectionData,
                      content: { ...sectionData.content, featuredEnabled: e.target.checked }
                    })
                  }
                  className="rounded border-slate-300 text-[#06264A] focus:ring-[#06264A]"
                />
                <span className="text-xs font-bold text-slate-700">Enable Brand Spotlight</span>
              </label>
            </div>

            {/* Quick Brand Selector Dropdown */}
            {brands.length > 0 && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Quick Select from Brand Catalog:
                </label>
                <div className="flex flex-wrap gap-2">
                  {brands.map((b) => (
                    <button
                      key={b._id}
                      type="button"
                      onClick={() => handleBrandSelect(b.name)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        sectionData.content?.brandName === b.name
                          ? "bg-[#06264A] text-white"
                          : "bg-white border border-slate-200 text-slate-700 hover:border-[#06264A]"
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={sectionData.content?.brandName || "Ray-Ban"}
                  onChange={(e) =>
                    setSectionData({
                      ...sectionData,
                      content: { ...sectionData.content, brandName: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tagline (Period or newline separates lines)
                </label>
                <input
                  type="text"
                  value={sectionData.content?.tagline || "FRESH STYLES. FRESH COLOURS."}
                  onChange={(e) =>
                    setSectionData({
                      ...sectionData,
                      content: { ...sectionData.content, tagline: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Secondary Button Text</label>
                <input
                  type="text"
                  value={sectionData.content?.button2Text || "Explore Ray-Ban"}
                  onChange={(e) =>
                    setSectionData({
                      ...sectionData,
                      content: { ...sectionData.content, button2Text: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Secondary Button Link</label>
                <input
                  type="text"
                  value={sectionData.content?.button2Link || "/brands/ray-ban"}
                  onChange={(e) =>
                    setSectionData({
                      ...sectionData,
                      content: { ...sectionData.content, button2Link: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>
            </div>

            <MediaUploaderWithScreenSize
              label="Brand Logo (800 x 400 px, White/Transparent PNG or SVG)"
              value={sectionData.content?.brandLogo || "/rayban_logo_white.png"}
              onChange={(val) =>
                setSectionData({
                  ...sectionData,
                  content: { ...sectionData.content, brandLogo: val }
                })
              }
              recommendedSize="800 x 400 px (White Transparent PNG or SVG)"
              screenBadge="Brand Logo (White)"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Link
              to="/admin/brands"
              className="px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl inline-flex items-center gap-1.5"
            >
              <span>Manage All Brands</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#06264A] text-white px-8 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#0A3360] transition"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Banner Configuration"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};


/* ============================================================
   5. SHOP BY TYPE MODULE
   Route: /admin/shop-by-type
   ============================================================ */
export const AdminShopByType = () => {
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingSec, setSavingSec] = useState(false);
  const [msg, setMsg] = useState("");

  const loadSection = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/homepage-sections");
      const sec = (res.sections || res.items || []).find((s) => s.sectionKey === "categories");
      if (sec) setSectionData(sec);
    } catch (err) {
      setMsg("Failed to load Shop by Type section: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSection();
  }, []);

  const handleSaveSection = async (e) => {
    e.preventDefault();
    if (!sectionData) return;
    try {
      setSavingSec(true);
      await apiFetch("/admin/homepage-sections/categories", {
        method: "PUT",
        body: {
          sectionTitle: sectionData.sectionTitle,
          sectionSubtitle: sectionData.sectionSubtitle,
          homepageVisible: sectionData.homepageVisible !== false,
          content: {
            ...sectionData.content,
            viewAllText: sectionData.content?.viewAllText || "View All Categories",
            viewAllLink: sectionData.content?.viewAllLink || "/eyewear"
          }
        }
      });
      notifySections();
      setMsg("Shop by Type section header settings saved successfully.");
      setTimeout(() => setMsg(""), 3500);
    } catch (err) {
      alert(err.message || "Failed to update section header.");
    } finally {
      setSavingSec(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06264A]/5 text-[#06264A] text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5 text-[#06264A]" />
            <span>Section 2 • Shop by Type</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Shop by Type Section Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure the section header, destination links, and curate all type cards (Optical Frames, Sunglasses, Blue-Light Glasses, Sports Eyewear, Contact Lenses).
          </p>
        </div>

        <Link
          to="/admin/categories"
          className="inline-flex items-center gap-2 rounded-xl bg-[#06264A] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#0A3360] transition"
        >
          <Layers className="w-4 h-4" />
          <span>Manage Full Category Taxonomy</span>
        </Link>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* SECTION HEADER CONFIGURATION */}
      {sectionData && (
        <form onSubmit={handleSaveSection} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Section Header & Navigation Controls
              </h2>
              <p className="text-[11px] text-slate-500">Eyebrow, title, and 'View All' destination link.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sectionData.homepageVisible !== false}
                onChange={(e) => setSectionData({ ...sectionData, homepageVisible: e.target.checked })}
                className="rounded border-slate-300 text-[#06264A] focus:ring-[#06264A]"
              />
              <span className="text-xs font-bold text-slate-700">Show Section on Homepage</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Eyebrow Subtitle</label>
              <input
                type="text"
                value={sectionData.sectionSubtitle || "SHOP BY TYPE"}
                onChange={(e) => setSectionData({ ...sectionData, sectionSubtitle: e.target.value })}
                placeholder="SHOP BY TYPE"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Main Heading</label>
              <input
                type="text"
                value={sectionData.sectionTitle || "FIND WHAT SUITS YOU"}
                onChange={(e) => setSectionData({ ...sectionData, sectionTitle: e.target.value })}
                placeholder="FIND WHAT SUITS YOU"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">View All Button Text</label>
              <input
                type="text"
                value={sectionData.content?.viewAllText || "View All Categories"}
                onChange={(e) =>
                  setSectionData({
                    ...sectionData,
                    content: { ...sectionData.content, viewAllText: e.target.value }
                  })
                }
                placeholder="View All Categories"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">View All Destination Link</label>
              <input
                type="text"
                value={sectionData.content?.viewAllLink || "/eyewear"}
                onChange={(e) =>
                  setSectionData({
                    ...sectionData,
                    content: { ...sectionData.content, viewAllLink: e.target.value }
                  })
                }
                placeholder="/eyewear"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingSec}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-black transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSec ? "Saving..." : "Save Header Settings"}</span>
            </button>
          </div>
        </form>
      )}

      {/* CATEGORY CARDS MANAGER EMBED */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Shop by Type Cards & Taxonomy</h3>
            <p className="text-xs text-slate-500">
              Each active category with an image will be rendered in the horizontal interactive carousel.
            </p>
          </div>
          <Link
            to="/admin/categories"
            className="text-xs font-bold text-[#06264A] hover:underline inline-flex items-center gap-1"
          >
            <span>Open Advanced Editor</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   6. FLOATING CONTACT BUTTONS (CALL NOW + WHATSAPP NOW)
   Route: /admin/floating-contact
   ============================================================ */
export const AdminFloatingContact = () => {
  const [config, setConfig] = useState({
    callEnabled: true,
    callNumber: "9594030310",
    callLabel: "Call Now",
    whatsappEnabled: true,
    whatsappNumber: "9594030310",
    whatsappLabel: "WhatsApp Now",
    whatsappMessage: "Hello PrettyVision, I would like to know more about your eyewear and services.",
    position: "bottom-right",
    desktopEnabled: true,
    mobileEnabled: true,
    bottomOffsetDesktop: 24,
    bottomOffsetMobile: 80,
    buttonStyle: "pill",
    order: "whatsapp-call"
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [previewDevice, setPreviewDevice] = useState("desktop"); // 'desktop' | 'mobile'

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/admin/floating-contact");
      if (res && res.floatingContact) {
        setConfig((prev) => ({ ...prev, ...res.floatingContact }));
      }
    } catch (err) {
      console.error("Failed to load floating contact settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setSavedMessage("");
      const res = await apiFetch("/admin/floating-contact", {
        method: "PUT",
        body: config
      });
      if (res.floatingContact) {
        setConfig((prev) => ({ ...prev, ...res.floatingContact }));
      }
      setSavedMessage("Floating contact settings saved successfully!");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("floating-contact-updated"));
      }
      setTimeout(() => setSavedMessage(""), 4000);
    } catch (err) {
      alert("Failed to save settings: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset Call & WhatsApp buttons back to default configuration (9594030310)?")) {
      return;
    }
    try {
      setResetting(true);
      setSavedMessage("");
      const res = await apiFetch("/admin/floating-contact/reset", {
        method: "POST"
      });
      if (res.floatingContact) {
        setConfig(res.floatingContact);
      }
      setSavedMessage("Reset to defaults successfully!");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("floating-contact-updated"));
      }
      setTimeout(() => setSavedMessage(""), 4000);
    } catch (err) {
      alert("Failed to reset: " + (err.message || "Unknown error"));
    } finally {
      setResetting(false);
    }
  };

  const callHref = buildCallUrl(config.callNumber);
  const whatsappHref = buildWhatsAppUrl(config.whatsappNumber, config.whatsappMessage);
  const callNorm = normalizePhoneNumber(config.callNumber);
  const whatsappNorm = normalizePhoneNumber(config.whatsappNumber);

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-[#06264A]" />
        <span>Loading Floating Contact Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Live Floating CTAs
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">Website Quick Actions</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Call Now & WhatsApp Now Floating Buttons
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic floating buttons across the public website. Default number is <strong className="text-slate-700">9594030310</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={resetting || saving}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            title="Reset to default number and labels"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
            <span>{resetting ? "Resetting..." : "Reset Defaults"}</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || resetting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#06264A] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider shadow hover:bg-[#0A3360] transition"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{savedMessage}</span>
          </div>
          <button
            onClick={() => setSavedMessage("")}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Left Controls, Right Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: 7 cols */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          {/* 1. CALL NOW CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#06264A] text-white flex items-center justify-center shadow-sm">
                  <Phone className="w-4.5 h-4.5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Call Now Button</h3>
                  <p className="text-[11px] text-slate-500">One-tap telephone dialer</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(config.callEnabled)}
                  onChange={(e) => setConfig({ ...config, callEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#06264A]"></div>
                <span className="ml-2 text-xs font-bold text-slate-700">
                  {config.callEnabled ? "Enabled" : "Disabled"}
                </span>
              </label>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Call Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={config.callNumber || ""}
                    onChange={(e) => setConfig({ ...config, callNumber: e.target.value })}
                    placeholder="9594030310"
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A] focus:ring-1 focus:ring-[#06264A]"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">
                    Default: 9594030310
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Supports Indian 10-digit, 0-prefixed, or international formats.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Call Button Label
                </label>
                <input
                  type="text"
                  value={config.callLabel || ""}
                  onChange={(e) => setConfig({ ...config, callLabel: e.target.value })}
                  placeholder="Call Now"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A] focus:ring-1 focus:ring-[#06264A]"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Examples: "Call Now", "Contact Us", "Call Our Store", "Speak to Optometrist".
                </p>
              </div>

              {/* Live Link Info */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Generated Dialer Link
                  </span>
                  <code className="text-[11px] text-[#06264A] font-mono font-bold truncate block">
                    {callHref || "None"}
                  </code>
                </div>
                {callHref && (
                  <a
                    href={callHref}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-900 shrink-0"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 2. WHATSAPP NOW CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <WhatsAppIcon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">WhatsApp Now Button</h3>
                  <p className="text-[11px] text-slate-500">Direct WhatsApp chat link</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(config.whatsappEnabled)}
                  onChange={(e) => setConfig({ ...config, whatsappEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ml-2 text-xs font-bold text-slate-700">
                  {config.whatsappEnabled ? "Enabled" : "Disabled"}
                </span>
              </label>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={config.whatsappNumber || ""}
                    onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                    placeholder="9594030310"
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">
                    Default: 9594030310
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Do not type the full wa.me link; just input the phone number.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  WhatsApp Button Label
                </label>
                <input
                  type="text"
                  value={config.whatsappLabel || ""}
                  onChange={(e) => setConfig({ ...config, whatsappLabel: e.target.value })}
                  placeholder="WhatsApp Now"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Examples: "WhatsApp Now", "Chat on WhatsApp", "WhatsApp Us".
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  WhatsApp Default Pre-filled Message
                </label>
                <textarea
                  rows={2}
                  value={config.whatsappMessage || ""}
                  onChange={(e) => setConfig({ ...config, whatsappMessage: e.target.value })}
                  placeholder="Hello PrettyVision, I would like to know more about your eyewear and services."
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Pre-fills customer WhatsApp composer. URL-encoded automatically.
                </p>
              </div>

              {/* Live Link Info */}
              <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-200/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/70 block">
                    Generated WhatsApp Link
                  </span>
                  <code className="text-[11px] text-emerald-900 font-mono font-bold truncate block">
                    {whatsappHref || "None"}
                  </code>
                </div>
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 shrink-0"
                  >
                    <span>Test WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 3. DISPLAY & POSITION SETTINGS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Position & Device Visibility
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Screen Position
                </label>
                <select
                  value={config.position || "bottom-right"}
                  onChange={(e) => setConfig({ ...config, position: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#06264A]"
                >
                  <option value="bottom-right">Bottom Right (Recommended)</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Stack Order
                </label>
                <select
                  value={config.order || "whatsapp-call"}
                  onChange={(e) => setConfig({ ...config, order: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#06264A]"
                >
                  <option value="whatsapp-call">WhatsApp on Top, Call Below</option>
                  <option value="call-whatsapp">Call on Top, WhatsApp Below</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(config.desktopEnabled)}
                  onChange={(e) => setConfig({ ...config, desktopEnabled: e.target.checked })}
                  className="rounded border-slate-300 text-[#06264A] focus:ring-[#06264A]"
                />
                <span className="text-xs font-bold text-slate-700">Show on Desktop Screens</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(config.mobileEnabled)}
                  onChange={(e) => setConfig({ ...config, mobileEnabled: e.target.checked })}
                  className="rounded border-slate-300 text-[#06264A] focus:ring-[#06264A]"
                />
                <span className="text-xs font-bold text-slate-700">Show on Mobile Screens</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Desktop Bottom Offset (px)
                </label>
                <input
                  type="number"
                  min={8}
                  max={200}
                  value={config.bottomOffsetDesktop ?? 24}
                  onChange={(e) => setConfig({ ...config, bottomOffsetDesktop: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
                <p className="text-[10px] text-slate-400 mt-1">Default: 24px</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Mobile Bottom Offset (px)
                </label>
                <input
                  type="number"
                  min={10}
                  max={200}
                  value={config.bottomOffsetMobile ?? 80}
                  onChange={(e) => setConfig({ ...config, bottomOffsetMobile: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
                <p className="text-[10px] text-slate-400 mt-1">Default: 80px (clears mobile nav)</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#06264A] text-white px-8 py-3 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#0A3360] transition"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Floating Contact Settings"}</span>
            </button>
          </div>
        </form>

        {/* Right Sticky Column: Live Simulation & Preview */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Interactive Live Preview
                </h3>
                <p className="text-[11px] text-slate-500">Real-time simulation of user experience</p>
              </div>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition ${
                    previewDevice === "desktop" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition ${
                    previewDevice === "mobile" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Mock website screen container */}
            <div
              className={`relative mx-auto rounded-2xl border border-slate-300 bg-slate-950 overflow-hidden shadow-inner transition-all duration-300 ${
                previewDevice === "mobile" ? "w-[260px] h-[400px]" : "w-full h-[360px]"
              }`}
            >
              {/* Mock website header */}
              <div className="h-9 bg-slate-900/90 border-b border-slate-800 px-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500/80"></span>
                  <span className="w-2 h-2 rounded-full bg-amber-500/80"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500/80"></span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">prettyvision.in</span>
                <span className="w-4"></span>
              </div>

              {/* Mock website page content */}
              <div className="p-4 space-y-3 opacity-30 select-none">
                <div className="h-4 w-3/4 bg-slate-700 rounded"></div>
                <div className="h-2 w-1/2 bg-slate-800 rounded"></div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="h-16 bg-slate-800 rounded-lg"></div>
                  <div className="h-16 bg-slate-800 rounded-lg"></div>
                </div>
                <div className="h-3 w-5/6 bg-slate-800 rounded"></div>
                <div className="h-3 w-4/6 bg-slate-800 rounded"></div>
              </div>

              {/* FLOATING ACTION BUTTONS SIMULATION */}
              {(!config.callEnabled && !config.whatsappEnabled) ? (
                <div className="absolute inset-x-0 bottom-6 text-center text-[11px] text-slate-500">
                  (Both buttons disabled)
                </div>
              ) : (
                <div
                  className={`absolute z-10 flex flex-col gap-2 pointer-events-none ${
                    config.position === "bottom-left" ? "left-4 items-start" : "right-4 items-end"
                  } ${
                    previewDevice === "mobile" ? "bottom-6" : "bottom-5"
                  }`}
                >
                  {(config.order === "call-whatsapp" ? [
                    config.callEnabled && (
                      <div
                        key="call-sim"
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#06264A] to-[#0B192C] text-white px-3 py-2 shadow-lg border border-white/20 scale-90 sm:scale-95"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-300" />
                        <span className="text-[11px] font-bold whitespace-nowrap">
                          {config.callLabel || "Call Now"}
                        </span>
                      </div>
                    ),
                    config.whatsappEnabled && (
                      <div
                        key="wa-sim"
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white px-3 py-2 shadow-lg border border-white/25 scale-90 sm:scale-95 animate-pulse"
                      >
                        <WhatsAppIcon size={16} />
                        <span className="text-[11px] font-bold whitespace-nowrap">
                          {config.whatsappLabel || "WhatsApp Now"}
                        </span>
                      </div>
                    )
                  ] : [
                    config.whatsappEnabled && (
                      <div
                        key="wa-sim"
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white px-3 py-2 shadow-lg border border-white/25 scale-90 sm:scale-95 animate-pulse"
                      >
                        <WhatsAppIcon size={16} />
                        <span className="text-[11px] font-bold whitespace-nowrap">
                          {config.whatsappLabel || "WhatsApp Now"}
                        </span>
                      </div>
                    ),
                    config.callEnabled && (
                      <div
                        key="call-sim"
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#06264A] to-[#0B192C] text-white px-3 py-2 shadow-lg border border-white/20 scale-90 sm:scale-95"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-300" />
                        <span className="text-[11px] font-bold whitespace-nowrap">
                          {config.callLabel || "Call Now"}
                        </span>
                      </div>
                    )
                  ])}
                </div>
              )}
            </div>

            {/* Quick summary notes */}
            <div className="space-y-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span>Call Status:</span>
                <span className={`font-bold ${config.callEnabled ? "text-emerald-600" : "text-rose-500"}`}>
                  {config.callEnabled ? "Active (" + (callNorm.display || config.callNumber) + ")" : "Disabled"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>WhatsApp Status:</span>
                <span className={`font-bold ${config.whatsappEnabled ? "text-emerald-600" : "text-rose-500"}`}>
                  {config.whatsappEnabled ? "Active (" + (whatsappNorm.display || config.whatsappNumber) + ")" : "Disabled"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Position:</span>
                <span className="font-semibold text-slate-700 capitalize">
                  {config.position ? config.position.replace("-", " ") : "Bottom Right"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   7. EXPERT EYE CARE FINAL CTA SECTION MODULE
   Route: /admin/expert-eye-care & /admin/final-cta
   ============================================================ */
const FEATURE_ICON_OPTIONS = [
  { label: "Eye (Eye Examination)", value: "Eye" },
  { label: "Users (Optometrists)", value: "Users" },
  { label: "Shield (Advanced Technology / Protection)", value: "ShieldCheck" },
  { label: "Heart (Personalized Care)", value: "Heart" },
  { label: "Glasses (Frames & Lenses)", value: "Glasses" },
  { label: "Calendar (Eye Test Bookings)", value: "Calendar" },
  { label: "Clock (Quick Service / Hours)", value: "Clock" },
  { label: "Sparkles (Innovation / Laser / Precision)", value: "Sparkles" },
  { label: "Star (5-Star Quality)", value: "Star" },
  { label: "Check (Verified Guarantee)", value: "Check" },
  { label: "Sun (UV & Polarized Protection)", value: "Sun" },
  { label: "Laptop (Digital Blue Light)", value: "Laptop" },
  { label: "Activity (Eye Health & Vision)", value: "Activity" }
];

export const AdminExpertEyeCare = () => {
  const [section, setSection] = useState({
    sectionKey: "final_cta",
    sectionName: "Expert Eye Care CTA",
    sectionTitle: "YOUR VISION DESERVES EXPERT CARE.",
    sectionSubtitle: "EXPERT EYE CARE AT PRETTYVISION KALINA",
    description: "Visit PrettyVision Kalina and experience better vision with our trusted optometrists, advanced technology and personalized care.",
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
        { id: "3", icon: "ShieldCheck", title: "Advanced Technology", description: "", enabled: true, sortOrder: 3 },
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
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [notice, setNotice] = useState("");
  const [activeTab, setActiveTab] = useState("content"); // 'content' | 'features' | 'ctas' | 'image' | 'visibility'
  const [previewDevice, setPreviewDevice] = useState("desktop"); // 'desktop' | 'tablet' | 'mobile'

  // Feature modal state
  const [editingFeature, setEditingFeature] = useState(null); // null, 'new', or id
  const [featureForm, setFeatureForm] = useState({
    id: "",
    icon: "Eye",
    title: "",
    description: "",
    enabled: true,
    sortOrder: 1
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/admin/expert-eye-care");
      if (res && (res.section || res.item)) {
        const sec = res.section || res.item;
        setSection((prev) => ({
          ...prev,
          ...sec,
          content: {
            ...prev.content,
            ...(sec.content || {})
          }
        }));
      }
    } catch (err) {
      console.error("Failed to load Expert Eye Care section:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setNotice("");
      const res = await apiFetch("/admin/expert-eye-care", {
        method: "PUT",
        body: section
      });
      if (res.section || res.item) {
        const sec = res.section || res.item;
        setSection(sec);
      }
      setNotice("Expert Eye Care CTA section saved successfully!");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("homepage-sections-updated"));
      }
      setTimeout(() => setNotice(""), 4000);
    } catch (err) {
      alert("Failed to save section: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset the Expert Eye Care CTA section back to default configuration?")) {
      return;
    }
    try {
      setResetting(true);
      setNotice("");
      const res = await apiFetch("/admin/expert-eye-care/reset", {
        method: "POST"
      });
      if (res.section || res.item) {
        setSection(res.section || res.item);
      }
      setNotice("Section reset to defaults successfully!");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("homepage-sections-updated"));
      }
      setTimeout(() => setNotice(""), 4000);
    } catch (err) {
      alert("Failed to reset: " + (err.message || "Unknown error"));
    } finally {
      setResetting(false);
    }
  };

  // Feature item handlers
  const handleOpenAddFeature = () => {
    const nextOrder = (section.content?.features?.length || 0) + 1;
    setFeatureForm({
      id: "feat_" + Date.now(),
      icon: "Eye",
      title: "",
      description: "",
      enabled: true,
      sortOrder: nextOrder
    });
    setEditingFeature("new");
  };

  const handleOpenEditFeature = (feat) => {
    setFeatureForm({ ...feat });
    setEditingFeature(feat.id);
  };

  const handleSaveFeature = (e) => {
    e.preventDefault();
    if (!featureForm.title.trim()) {
      alert("Please enter a title for this feature.");
      return;
    }
    const currentFeatures = [...(section.content?.features || [])];
    if (editingFeature === "new") {
      currentFeatures.push(featureForm);
    } else {
      const idx = currentFeatures.findIndex((f) => f.id === editingFeature);
      if (idx !== -1) {
        currentFeatures[idx] = featureForm;
      }
    }
    setSection({
      ...section,
      content: {
        ...section.content,
        features: currentFeatures
      }
    });
    setEditingFeature(null);
  };

  const handleDeleteFeature = (id) => {
    if (!window.confirm("Are you sure you want to delete this feature item?")) return;
    const filtered = (section.content?.features || []).filter((f) => f.id !== id);
    setSection({
      ...section,
      content: {
        ...section.content,
        features: filtered
      }
    });
  };

  const handleToggleFeature = (id) => {
    const updated = (section.content?.features || []).map((f) =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    );
    setSection({
      ...section,
      content: {
        ...section.content,
        features: updated
      }
    });
  };

  const handleMoveFeature = (index, direction) => {
    const list = [...(section.content?.features || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    const reordered = list.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    setSection({
      ...section,
      content: {
        ...section.content,
        features: reordered
      }
    });
  };

  const content = section.content || {};

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-[#06264A]" />
        <span>Loading Expert Eye Care Section Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 text-[#06264A]">
              Homepage Section #13
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">Expert Eye Care CTA</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Expert Eye Care CTA Section
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Completely customize the final luxury optical call-to-action banner right before the footer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={resetting || saving}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            title="Reset to default copy, features, and imagery"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
            <span>{resetting ? "Resetting..." : "Reset Defaults"}</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || resetting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#06264A] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider shadow hover:bg-[#0A3360] transition"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{notice}</span>
          </div>
          <button
            onClick={() => setNotice("")}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { key: "content", label: "Copy & Headings", icon: Edit2 },
          { key: "features", label: `Benefit Features (${content.features?.length || 0})`, icon: Sparkles },
          { key: "ctas", label: "Action Buttons", icon: ArrowRight },
          { key: "image", label: "Eyewear Photography", icon: ImageIcon },
          { key: "visibility", label: "Visibility & Status", icon: Eye }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? "bg-[#06264A] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN FORM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Controls Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* TAB 1: COPY & HEADINGS */}
          {activeTab === "content" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Headings & Copywriting</h3>
                <p className="text-xs text-slate-500">Edit the eyebrow, primary heading, and body description.</p>
              </div>

              {/* Eyebrow */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Section Eyebrow Text
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.showEyebrow !== false}
                      onChange={(e) =>
                        setSection({
                          ...section,
                          content: { ...content, showEyebrow: e.target.checked }
                        })
                      }
                      className="rounded text-[#06264A] focus:ring-[#06264A]"
                    />
                    <span>Show Eyebrow</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={content.eyebrow || ""}
                  onChange={(e) =>
                    setSection({
                      ...section,
                      sectionSubtitle: e.target.value,
                      content: { ...content, eyebrow: e.target.value }
                    })
                  }
                  placeholder="EXPERT EYE CARE AT PRETTYVISION KALINA"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Main Heading (Serif)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.showHeading !== false}
                      onChange={(e) =>
                        setSection({
                          ...section,
                          content: { ...content, showHeading: e.target.checked }
                        })
                      }
                      className="rounded text-[#06264A] focus:ring-[#06264A]"
                    />
                    <span>Show Heading</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  value={content.heading || section.sectionTitle || ""}
                  onChange={(e) =>
                    setSection({
                      ...section,
                      sectionTitle: e.target.value,
                      content: { ...content, heading: e.target.value }
                    })
                  }
                  placeholder="YOUR VISION DESERVES EXPERT CARE."
                  className="w-full px-3.5 py-2.5 text-xs font-serif font-bold text-slate-900 rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Paragraph Description
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.showDescription !== false}
                      onChange={(e) =>
                        setSection({
                          ...section,
                          content: { ...content, showDescription: e.target.checked }
                        })
                      }
                      className="rounded text-[#06264A] focus:ring-[#06264A]"
                    />
                    <span>Show Description</span>
                  </label>
                </div>
                <textarea
                  rows={3}
                  value={content.description || section.description || ""}
                  onChange={(e) =>
                    setSection({
                      ...section,
                      description: e.target.value,
                      content: { ...content, description: e.target.value }
                    })
                  }
                  placeholder="Visit PrettyVision Kalina and experience better vision with our trusted optometrists, advanced technology and personalized care."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: BENEFIT FEATURES (REPEATABLE CRUD) */}
          {activeTab === "features" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Feature Benefit Items</h3>
                  <p className="text-xs text-slate-500">
                    Add, edit, reorder or disable benefit badges shown across the banner.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.showFeatures !== false}
                      onChange={(e) =>
                        setSection({
                          ...section,
                          content: { ...content, showFeatures: e.target.checked }
                        })
                      }
                      className="rounded text-[#06264A] focus:ring-[#06264A]"
                    />
                    <span>Show Features Row</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleOpenAddFeature}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#06264A] text-white text-xs font-bold hover:bg-[#0A3360] transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Feature</span>
                  </button>
                </div>
              </div>

              {/* Feature Items List */}
              <div className="space-y-3">
                {(!content.features || content.features.length === 0) ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
                    No features configured yet. Click "Add Feature" to create one.
                  </div>
                ) : (
                  content.features.map((feat, idx) => (
                    <div
                      key={feat.id || idx}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                        feat.enabled !== false
                          ? "bg-slate-50/80 border-slate-200"
                          : "bg-slate-100/50 border-slate-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Reorder Buttons */}
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleMoveFeature(idx, -1)}
                            disabled={idx === 0}
                            className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveFeature(idx, 1)}
                            disabled={idx === content.features.length - 1}
                            className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Icon badge */}
                        <div className="w-9 h-9 rounded-full bg-[#06264A] text-white flex items-center justify-center shrink-0 shadow-sm">
                          <DynamicIcon name={feat.icon || "Eye"} className="w-4 h-4 text-sky-300" />
                        </div>

                        {/* Text info */}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{feat.title}</p>
                          <p className="text-[10px] text-slate-500 truncate">
                            Icon: {feat.icon} {feat.description ? `• ${feat.description}` : ""}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleFeature(feat.id)}
                          className={`p-1.5 rounded-lg border transition ${
                            feat.enabled !== false
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-slate-200 border-slate-300 text-slate-500"
                          }`}
                          title={feat.enabled !== false ? "Disable" : "Enable"}
                        >
                          {feat.enabled !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditFeature(feat)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFeature(feat.id)}
                          className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CTA BUTTONS */}
          {activeTab === "ctas" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Call to Action Buttons</h3>
                <p className="text-xs text-slate-500">Configure the primary pill button and secondary text link.</p>
              </div>

              {/* Primary CTA */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Primary CTA Button
                  </span>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.showPrimaryCta !== false}
                      onChange={(e) =>
                        setSection({
                          ...section,
                          content: { ...content, showPrimaryCta: e.target.checked }
                        })
                      }
                      className="rounded text-[#06264A] focus:ring-[#06264A]"
                    />
                    <span>Enabled</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={content.primaryCtaText || ""}
                      onChange={(e) =>
                        setSection({
                          ...section,
                          content: { ...content, primaryCtaText: e.target.value }
                        })
                      }
                      placeholder="Book an Eye Test"
                      className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Destination Link
                    </label>
                    <input
                      type="text"
                      value={content.primaryCtaLink || ""}
                      onChange={(e) =>
                        setSection({
                          ...section,
                          content: { ...content, primaryCtaLink: e.target.value }
                        })
                      }
                      placeholder="/contact"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  Tip: Use <code>/contact</code> to open the booking modal or route to your appointment page.
                </p>
              </div>

              {/* Secondary CTA */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Secondary CTA Link
                  </span>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={content.showSecondaryCta !== false}
                      onChange={(e) =>
                        setSection({
                          ...section,
                          content: { ...content, showSecondaryCta: e.target.checked }
                        })
                      }
                      className="rounded text-[#06264A] focus:ring-[#06264A]"
                    />
                    <span>Enabled</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Link Text
                    </label>
                    <input
                      type="text"
                      value={content.secondaryCtaText || ""}
                      onChange={(e) =>
                        setSection({
                          ...section,
                          content: { ...content, secondaryCtaText: e.target.value }
                        })
                      }
                      placeholder="Explore Our Store"
                      className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Destination Link
                    </label>
                    <input
                      type="text"
                      value={content.secondaryCtaLink || ""}
                      onChange={(e) =>
                        setSection({
                          ...section,
                          content: { ...content, secondaryCtaLink: e.target.value }
                        })
                      }
                      placeholder="/eyewear"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EYEWEAR PHOTOGRAPHY & BLEND */}
          {activeTab === "image" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Eyewear Photography & Visual Blend</h3>
                <p className="text-xs text-slate-500">
                  Upload luxury eyewear product photography and control gradient overlay effects.
                </p>
              </div>

              {/* Image Preview & Upload */}
              <div className="space-y-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Section Right Image
                </label>
                {content.image && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 h-48 bg-slate-100">
                    <img
                      src={assetUrl(content.image)}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#06264A] via-[#06264A]/60 to-transparent pointer-events-none w-1/2" />
                  </div>
                )}

                <div className="pt-2">
                  <MediaUploaderWithScreenSize
                    label="Upload / Replace Eyewear Image"
                    folder="homepage"
                    value={content.image || ""}
                    onChange={(url) =>
                      setSection({
                        ...section,
                        content: { ...content, image: url }
                      })
                    }
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Recommended: 1600 × 1000 px WebP/JPG. Auto-compressed under 300KB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.showImage !== false}
                    onChange={(e) =>
                      setSection({
                        ...section,
                        content: { ...content, showImage: e.target.checked }
                      })
                    }
                    className="rounded text-[#06264A] focus:ring-[#06264A]"
                  />
                  <span className="text-xs font-bold text-slate-700">Show Image on Desktop</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.showImageMobile !== false}
                    onChange={(e) =>
                      setSection({
                        ...section,
                        content: { ...content, showImageMobile: e.target.checked }
                      })
                    }
                    className="rounded text-[#06264A] focus:ring-[#06264A]"
                  />
                  <span className="text-xs font-bold text-slate-700">Show Image on Mobile</span>
                </label>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Gradient Blend Opacity
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {content.overlayOpacity ?? 85}%
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={5}
                  value={content.overlayOpacity ?? 85}
                  onChange={(e) =>
                    setSection({
                      ...section,
                      content: { ...content, overlayOpacity: Number(e.target.value) }
                    })
                  }
                  className="w-full accent-[#06264A]"
                />
                <p className="text-[10px] text-slate-400">
                  Controls the soft horizontal transition between the deep navy background and the photo.
                </p>
              </div>

              <div className="space-y-1 pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Image Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={content.imageAlt || ""}
                  onChange={(e) =>
                    setSection({
                      ...section,
                      content: { ...content, imageAlt: e.target.value }
                    })
                  }
                  placeholder="Luxury Eyewear at PrettyVision Kalina"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
            </div>
          )}

          {/* TAB 5: VISIBILITY & GENERAL */}
          {activeTab === "visibility" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Section Status & Positioning</h3>
                <p className="text-xs text-slate-500">Enable or disable the complete section from the live homepage.</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Homepage Section Visibility</h4>
                  <p className="text-[11px] text-slate-500">
                    When disabled, the section disappears completely with zero gap or broken layout.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={section.homepageVisible !== false && section.status !== "inactive"}
                    onChange={(e) =>
                      setSection({
                        ...section,
                        homepageVisible: e.target.checked,
                        websiteEnabled: e.target.checked,
                        status: e.target.checked ? "active" : "inactive"
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#06264A]"></div>
                  <span className="ml-2 text-xs font-bold text-slate-700">
                    {section.homepageVisible !== false && section.status !== "inactive" ? "Active" : "Disabled"}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={section.sortOrder ?? 13}
                    onChange={(e) => setSection({ ...section, sortOrder: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Default order: 13 (before footer)</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Section Identifier
                  </label>
                  <input
                    type="text"
                    disabled
                    value={section.sectionKey}
                    className="w-full px-3.5 py-2 text-xs font-mono font-semibold rounded-xl border border-slate-200 bg-slate-100 text-slate-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#06264A] text-white px-8 py-3 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#0A3360] transition"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Section Configuration"}</span>
            </button>
          </div>
        </div>

        {/* Right Sticky Column: Live Simulation & Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Interactive Live Preview
                </h3>
                <p className="text-[11px] text-slate-500">Simulates real component on devices</p>
              </div>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition ${
                    previewDevice === "desktop" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition ${
                    previewDevice === "mobile" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Live component preview frame */}
            <div
              className={`relative mx-auto rounded-2xl border border-slate-300 bg-slate-100 overflow-y-auto max-h-[580px] shadow-inner transition-all duration-300 ${
                previewDevice === "mobile" ? "w-[340px]" : "w-full"
              }`}
            >
              <div className="scale-[0.82] origin-top sm:scale-[0.88] lg:scale-[0.82]">
                <FinalCTA sectionData={section} onBookClick={() => alert("Appointment modal triggered in live view")} />
              </div>
            </div>

            {/* Quick Summary list */}
            <div className="space-y-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span>Section Status:</span>
                <span className={`font-bold ${section.homepageVisible !== false ? "text-emerald-600" : "text-rose-500"}`}>
                  {section.homepageVisible !== false ? "Active on Homepage" : "Disabled"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Active Features:</span>
                <span className="font-bold text-slate-700">
                  {content.features?.filter((f) => f.enabled !== false).length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Mobile Photography:</span>
                <span className="font-semibold text-slate-700">
                  {content.showImageMobile !== false ? "Enabled" : "Hidden"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE ADD / EDIT MODAL */}
      {editingFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingFeature === "new" ? "Add Benefit Feature" : "Edit Benefit Feature"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingFeature(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFeature} className="p-6 space-y-4">
              {/* Icon Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Feature Icon
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#06264A] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <DynamicIcon name={featureForm.icon || "Eye"} className="w-5 h-5 text-sky-300" />
                  </div>
                  <select
                    value={featureForm.icon || "Eye"}
                    onChange={(e) => setFeatureForm({ ...featureForm, icon: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white"
                  >
                    {FEATURE_ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Feature Title (Required)
                </label>
                <input
                  type="text"
                  required
                  value={featureForm.title || ""}
                  onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                  placeholder="e.g. Professional Eye Examination"
                  className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Short Subtitle / Description (Optional)
                </label>
                <input
                  type="text"
                  value={featureForm.description || ""}
                  onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                  placeholder="e.g. Qualified Optometrists"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#06264A]"
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700">Feature Active</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featureForm.enabled !== false}
                    onChange={(e) => setFeatureForm({ ...featureForm, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#06264A]"></div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingFeature(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#06264A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0A3360]"
                >
                  Save Feature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

