import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Glasses,
  Layers,
  Gem,
  Calendar,
  Users,
  Eye,
  Sliders,
  Sparkles,
  Instagram,
  ShoppingBag,
  Clock,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  RefreshCw,
  Phone,
  BarChart3,
  Image as ImageIcon,
  Check,
  X
} from "lucide-react";
import { apiFetch, assetUrl } from "../api";
import { SEO } from "../components";

export const PrettyVisionAdminDashboard = () => {
  const [data, setData] = useState({
    stats: {},
    charts: {},
    recentActivity: { appointments: [], customers: [], products: [] }
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState("");

  const loadStats = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);
      const res = await apiFetch("/admin/dashboard/stats");
      setData(res || {});
    } catch (err) {
      console.warn("Failed to load dashboard stats:", err);
      setNotice(err.message || "Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const stats = data.stats || {};
  const recent = data.recentActivity || {};
  const trafficDays = data.charts?.trafficByDay || [];

  return (
    <div className="space-y-8 pb-12">
      <SEO title="PrettyVision E-Commerce Admin Dashboard" />

      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#06264A] via-[#0A3360] to-[#041A33] p-6 sm:p-8 text-white shadow-xl shadow-[#06264A]/10 border border-[#0A3360]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B7D0E8]" />
              <span>PrettyVision Store & Boutique Operations</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              E-Commerce & Store Overview
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Live catalog control, eye test appointment pipeline, dynamic homepage configuration, and customer engagement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => loadStats(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider backdrop-blur-xs border border-white/10 transition"
              title="Refresh live metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-[#06264A] hover:bg-slate-100 px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md transition"
            >
              <ExternalLink className="w-4 h-4 text-[#06264A]" />
              <span>View Live Website</span>
            </a>
          </div>
        </div>
      </div>

      {notice && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Quick Action Shortcuts */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
          Quick Action Shortcuts
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Link
            to="/admin/products"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 hover:border-[#06264A] hover:bg-[#06264A]/5 transition text-center group"
          >
            <Glasses className="w-5 h-5 text-[#06264A] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">Add Product</span>
          </Link>
          <Link
            to="/admin/collections"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 hover:border-[#06264A] hover:bg-[#06264A]/5 transition text-center group"
          >
            <Sparkles className="w-5 h-5 text-[#06264A] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">Frame Collections</span>
          </Link>
          <Link
            to="/admin/homepage"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 hover:border-[#06264A] hover:bg-[#06264A]/5 transition text-center group"
          >
            <Sliders className="w-5 h-5 text-[#06264A] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">Homepage Sections</span>
          </Link>
          <Link
            to="/admin/store"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 hover:border-[#06264A] hover:bg-[#06264A]/5 transition text-center group"
          >
            <MapPin className="w-5 h-5 text-[#06264A] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">Store & Hours</span>
          </Link>
          <Link
            to="/admin/instagram"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 hover:border-[#06264A] hover:bg-[#06264A]/5 transition text-center group"
          >
            <Instagram className="w-5 h-5 text-[#06264A] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">Instagram Feed</span>
          </Link>
          <Link
            to="/admin/appointments"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 hover:border-[#06264A] hover:bg-[#06264A]/5 transition text-center group"
          >
            <Calendar className="w-5 h-5 text-[#06264A] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800">Appointments</span>
          </Link>
        </div>
      </div>

      {/* PRIMARY E-COMMERCE METRICS GRID */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Catalog & Store Inventory
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Products */}
          <Link
            to="/admin/products"
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#06264A]/30 transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-blue-50 text-[#06264A]">
                <Glasses className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {stats.activeProducts ?? 0} Active
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Products
              </p>
              <p className="text-3xl font-serif font-bold text-slate-900 mt-1">
                {stats.totalProducts ?? 0}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{stats.outOfStockProducts ?? 0} Out of Stock</span>
              <span className="group-hover:translate-x-1 transition-transform font-bold text-[#06264A] inline-flex items-center gap-0.5">
                Manage <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Card 2: Categories / Shop By Type */}
          <Link
            to="/admin/categories"
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#06264A]/30 transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
                <Layers className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                {stats.activeCategories ?? 0} Active
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Product Categories
              </p>
              <p className="text-3xl font-serif font-bold text-slate-900 mt-1">
                {stats.totalCategories ?? 0}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Shop by Type Cards</span>
              <span className="group-hover:translate-x-1 transition-transform font-bold text-[#06264A] inline-flex items-center gap-0.5">
                Manage <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Card 3: Brands */}
          <Link
            to="/admin/brands"
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#06264A]/30 transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
                <Gem className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {stats.activeBrands ?? 0} Active
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Eyewear Brands
              </p>
              <p className="text-3xl font-serif font-bold text-slate-900 mt-1">
                {stats.totalBrands ?? 0}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Ray-Ban, Oakley, Vogue...</span>
              <span className="group-hover:translate-x-1 transition-transform font-bold text-[#06264A] inline-flex items-center gap-0.5">
                Manage <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Card 4: Appointments & Enquiries */}
          <Link
            to="/admin/appointments"
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#06264A]/30 transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                <Calendar className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {stats.pendingAppointments ?? 0} Pending
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Eye Test Bookings
              </p>
              <p className="text-3xl font-serif font-bold text-slate-900 mt-1">
                {stats.totalAppointments ?? 0}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{stats.confirmedAppointments ?? 0} Confirmed</span>
              <span className="group-hover:translate-x-1 transition-transform font-bold text-[#06264A] inline-flex items-center gap-0.5">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* SECONDARY ROW: Dynamic Homepage & Content Stats */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Dynamic Homepage & Content Curation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 5: Homepage Sections */}
          <Link
            to="/admin/homepage"
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#06264A]/30 transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-slate-100 text-[#06264A]">
                <Sliders className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {stats.activeHomeSections ?? 0} Active
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Homepage Sections
              </p>
              <p className="text-3xl font-serif font-bold text-slate-900 mt-1">
                {stats.totalHomeSections ?? 0}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{stats.disabledHomeSections ?? 0} Disabled / Hidden</span>
              <span className="group-hover:translate-x-1 transition-transform font-bold text-[#06264A] inline-flex items-center gap-0.5">
                Reorder <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Card 6: Frame Collections */}
          <Link
            to="/admin/collections"
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#06264A]/30 transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700">
                <Sparkles className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                {stats.activeCollections ?? 0} Live Cards
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Frame Collections
              </p>
              <p className="text-3xl font-serif font-bold text-slate-900 mt-1">
                {stats.totalCollections ?? 0}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Men, Women, Kids...</span>
              <span className="group-hover:translate-x-1 transition-transform font-bold text-[#06264A] inline-flex items-center gap-0.5">
                Manage <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Card 7: Instagram Posts */}
          <Link
            to="/admin/instagram"
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#06264A]/30 transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-pink-50 text-pink-700">
                <Instagram className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full">
                {stats.activeInstagramPosts ?? 0} Active
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Instagram Posts
              </p>
              <p className="text-3xl font-serif font-bold text-slate-900 mt-1">
                {stats.totalInstagramPosts ?? 0}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>@prettyvision_kalina</span>
              <span className="group-hover:translate-x-1 transition-transform font-bold text-[#06264A] inline-flex items-center gap-0.5">
                Feed <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Card 8: Customers & Visitors */}
          <Link
            to="/admin/users"
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#06264A]/30 transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-cyan-50 text-cyan-700">
                <Users className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
                {stats.activeCustomers ?? 0} Active
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Registered Customers
              </p>
              <p className="text-3xl font-serif font-bold text-slate-900 mt-1">
                {stats.totalCustomers ?? 0}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{stats.blockedCustomers ?? 0} Blocked</span>
              <span className="group-hover:translate-x-1 transition-transform font-bold text-[#06264A] inline-flex items-center gap-0.5">
                Customers <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* LOWER SECTION: Two Columns (Recent Eye Test Appointments + Recent Products) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Eye Test Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Recent Eye Test Appointments
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest customer bookings submitted online for the Kalina clinic.
                </p>
              </div>
              <Link
                to="/admin/appointments"
                className="text-xs font-bold text-[#06264A] hover:underline inline-flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {(!recent.appointments || recent.appointments.length === 0) ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No appointment requests yet. Bookings from the website modal will appear here in real-time.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recent.appointments.map((apt) => (
                  <div key={apt._id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{apt.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {apt.serviceRequested || "Eye Examination"} · {apt.preferredDate || "Anytime"} {apt.preferredTime ? `(${apt.preferredTime})` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          apt.status === "confirmed"
                            ? "bg-emerald-50 text-emerald-700"
                            : apt.status === "completed"
                            ? "bg-blue-50 text-blue-700"
                            : apt.status === "cancelled"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {apt.status || "pending"}
                      </span>
                      {apt.phone && (
                        <a
                          href={`tel:${apt.phone}`}
                          className="p-1 text-slate-400 hover:text-[#06264A] transition"
                          title={`Call ${apt.phone}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Clinic Hours: Mon–Sat 10:00 AM – 9:30 PM</span>
            <Link to="/admin/store" className="font-bold text-[#06264A] hover:underline">
              Edit Hours
            </Link>
          </div>
        </div>

        {/* Recent Products in Catalog */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Featured Eyewear Catalog
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Recently added or updated optical frames and sunglasses.
                </p>
              </div>
              <Link
                to="/admin/products"
                className="text-xs font-bold text-[#06264A] hover:underline inline-flex items-center gap-1"
              >
                <span>Full Catalog</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {(!recent.products || recent.products.length === 0) ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No products found in catalog. Click "Add Product" to create your first eyewear item.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recent.products.map((prod) => (
                  <div key={prod._id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                        {prod.mainImage ? (
                          <img
                            src={assetUrl(prod.mainImage)}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Glasses className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{prod.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {prod.brand || "PrettyVision"} · {prod.category || "Eyewear"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-slate-900">
                        {prod.salePrice || prod.price ? `₹${(prod.salePrice || prod.price).toLocaleString("en-IN")}` : "Enquiry"}
                      </p>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full ${
                          prod.status === "active" ? "text-emerald-700 bg-emerald-50" : "text-slate-500 bg-slate-100"
                        }`}
                      >
                        {prod.status || "active"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{stats.totalProducts ?? 0} items currently indexed</span>
            <Link to="/admin/products" className="font-bold text-[#06264A] hover:underline">
              Add New Frame
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
