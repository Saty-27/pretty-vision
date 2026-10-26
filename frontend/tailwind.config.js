export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      screens: { xs: "480px" },
      colors: {
        /* ---- PrettyVision Luxury Optical Palette ---- */
        primary: "#042041",
        "primary-dark": "#021226",
        navy: "#042041",
        "navy-light": "#0B2A52",
        "navy-deep": "#020F1F",
        accent: "#1E3A8A",
        gold: "#C5A880",
        heading: "#0F172A",
        body: "#334155",
        "text-muted": "#64748B",
        "bg-cool": "#F8FAFC",
        "bg-light": "#F1F5F9",
        line: "#E2E8F0",
        "footer-bg": "#021226",

        /* Aliases for compatibility */
        ink: "#0F172A",
        inkDeep: "#042041",
        inkMuted: "#64748B",
        muted: "#64748B",
        soft: "#F8FAFC",
        "primary-hover": "#0B2A52"
      },
      fontFamily: {
        sans: ["var(--font-body)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        ui: ["var(--font-body)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        display: ["var(--font-display)", "Cormorant Garamond", "Playfair Display", "serif"],
        serif: ["var(--font-display)", "Cormorant Garamond", "Playfair Display", "serif"],
        script: ["var(--font-script)", "Great Vibes", "cursive"]
      },
      maxWidth: { shell: "1360px" },
      boxShadow: {
        card: "0 10px 30px rgba(4, 32, 65, 0.05)",
        cardHover: "0 20px 45px rgba(4, 32, 65, 0.12)",
        cta: "0 10px 25px rgba(4, 32, 65, 0.25)",
        premium: "0 12px 35px rgba(4, 32, 65, 0.07)"
      }
    }
  },
  plugins: []
};
