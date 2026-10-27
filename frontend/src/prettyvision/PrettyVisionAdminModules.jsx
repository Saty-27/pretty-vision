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
  Mail,
  Compass,
  ArrowRight,
  RefreshCw,
  X
} from "lucide-react";
import { apiFetch, assetUrl } from "../api";
import { MediaUploaderWithScreenSize } from "./PrettyVisionAdmin";

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
