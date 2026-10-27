import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Phone, PhoneCall } from "lucide-react";
import { apiFetch } from "../api";

export const normalizePhoneNumber = (rawNumber = "", defaultCountryCode = "91") => {
  if (!rawNumber) return { tel: "", whatsapp: "", display: "" };
  const cleaned = String(rawNumber).trim();
  const digitsOnly = cleaned.replace(/\D/g, "");

  // If starts with '+'
  if (cleaned.startsWith("+")) {
    return {
      tel: `+${digitsOnly}`,
      whatsapp: digitsOnly,
      display: `+${digitsOnly}`
    };
  }

  // 11 digits starting with 0 (e.g., 09594030310)
  if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
    const withoutZero = digitsOnly.slice(1);
    return {
      tel: `+${defaultCountryCode}${withoutZero}`,
      whatsapp: `${defaultCountryCode}${withoutZero}`,
      display: `+${defaultCountryCode} ${withoutZero}`
    };
  }

  // 10 digits standard Indian number (e.g. 9594030310)
  if (digitsOnly.length === 10) {
    return {
      tel: `+${defaultCountryCode}${digitsOnly}`,
      whatsapp: `${defaultCountryCode}${digitsOnly}`,
      display: `+${defaultCountryCode} ${digitsOnly}`
    };
  }

  // If already prefixed with 91 (12 digits, e.g. 919594030310)
  if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
    return {
      tel: `+${digitsOnly}`,
      whatsapp: digitsOnly,
      display: `+91 ${digitsOnly.slice(2)}`
    };
  }

  // Fallback
  return {
    tel: digitsOnly ? `+${digitsOnly}` : "",
    whatsapp: digitsOnly,
    display: cleaned
  };
};

export const buildCallUrl = (callNumber = "9594030310") => {
  const norm = normalizePhoneNumber(callNumber);
  return norm.tel ? `tel:${norm.tel}` : "";
};

export const buildWhatsAppUrl = (whatsappNumber = "9594030310", message = "") => {
  const norm = normalizePhoneNumber(whatsappNumber);
  if (!norm.whatsapp) return "";
  const baseUrl = `https://wa.me/${norm.whatsapp}`;
  if (message && message.trim()) {
    return `${baseUrl}?text=${encodeURIComponent(message.trim())}`;
  }
  return baseUrl;
};

export const WhatsAppIcon = ({ className = "w-5 h-5", size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413Z" />
  </svg>
);

const DEFAULT_CONFIG = {
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
};

export const FloatingContactButtons = () => {
  const location = useLocation();
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const loadSettings = () => {
    apiFetch("/floating-contact")
      .then((data) => {
        if (data && data.floatingContact) {
          setConfig((prev) => ({
            ...prev,
            ...data.floatingContact
          }));
        }
      })
      .catch(() => {
        // Fallback to default config on network or parse issue
      });
  };

  useEffect(() => {
    loadSettings();

    // Listen to admin update events in real-time
    const handleUpdate = () => loadSettings();
    window.addEventListener("floating-contact-updated", handleUpdate);
    return () => window.removeEventListener("floating-contact-updated", handleUpdate);
  }, []);

  // Do not render on admin or teacher portals
  const pathname = location.pathname || "";
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/teacher") ||
    pathname.startsWith("/learn")
  ) {
    return null;
  }

  const {
    callEnabled,
    callNumber,
    callLabel,
    whatsappEnabled,
    whatsappNumber,
    whatsappLabel,
    whatsappMessage,
    position,
    desktopEnabled,
    mobileEnabled,
    bottomOffsetDesktop,
    bottomOffsetMobile,
    order
  } = config;

  // If both are disabled, do not render anything
  if (!callEnabled && !whatsappEnabled) return null;

  const callHref = buildCallUrl(callNumber);
  const whatsappHref = buildWhatsAppUrl(whatsappNumber, whatsappMessage);

  const isLeft = position === "bottom-left";

  const renderCallButton = () => {
    if (!callEnabled || !callHref) return null;
    return (
      <a
        key="call-button"
        href={callHref}
        aria-label={callLabel || "Call PrettyVision"}
        className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#06264A] to-[#0B192C] text-white px-4 py-3 sm:px-4.5 sm:py-3 shadow-xl hover:shadow-2xl shadow-[#06264A]/30 border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06264A]"
      >
        <span className="relative flex items-center justify-center w-5 h-5">
          <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-300 transition-transform duration-300 group-hover:rotate-12" />
        </span>
        <span className="text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap text-white">
          {callLabel || "Call Now"}
        </span>
      </a>
    );
  };

  const renderWhatsAppButton = () => {
    if (!whatsappEnabled || !whatsappHref) return null;
    return (
      <a
        key="whatsapp-button"
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={whatsappLabel || "Chat on WhatsApp"}
        className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white px-4 py-3 sm:px-4.5 sm:py-3 shadow-xl hover:shadow-2xl shadow-[#25D366]/35 border border-white/25 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
      >
        {/* Subtle breathing pulse ring */}
        <span className="absolute -inset-0.5 rounded-full bg-[#25D366] opacity-30 blur-sm group-hover:opacity-60 transition duration-300 animate-pulse pointer-events-none" />
        <span className="relative flex items-center justify-center w-5 h-5 text-white">
          <WhatsAppIcon size={20} className="transition-transform duration-300 group-hover:scale-110" />
        </span>
        <span className="relative text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap text-white">
          {whatsappLabel || "WhatsApp Now"}
        </span>
      </a>
    );
  };

  const buttons = order === "call-whatsapp"
    ? [renderCallButton(), renderWhatsAppButton()]
    : [renderWhatsAppButton(), renderCallButton()];

  // Responsive display rules
  const displayClasses = [
    desktopEnabled ? "md:flex" : "md:hidden",
    mobileEnabled ? "flex" : "hidden"
  ].join(" ");

  return (
    <aside
      aria-label="Contact quick actions"
      style={{
        "--bottom-offset-desktop": `${bottomOffsetDesktop || 24}px`,
        "--bottom-offset-mobile": `calc(${bottomOffsetMobile || 80}px + env(safe-area-inset-bottom, 0px))`
      }}
      className={`fixed z-40 flex flex-col gap-2.5 pointer-events-auto ${displayClasses} ${
        isLeft ? "left-4 sm:left-6 items-start" : "right-4 sm:right-6 items-end"
      } bottom-[var(--bottom-offset-mobile)] md:bottom-[var(--bottom-offset-desktop)]`}
    >
      {buttons}
    </aside>
  );
};
