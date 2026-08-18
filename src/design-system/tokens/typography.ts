export const typography = {
  fonts: {
    sans: "Manrope, ui-sans-serif, system-ui, -apple-system, sans-serif",
  },
  sizes: {
    "page-title": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
    "page-title-sm": ["28px", { lineHeight: "1.2", fontWeight: "600" }],
    "section-title": ["20px", { lineHeight: "1.3", fontWeight: "600" }],
    "section-title-sm": ["18px", { lineHeight: "1.3", fontWeight: "600" }],
    "card-title": ["16px", { lineHeight: "1.4", fontWeight: "600" }],
    "card-title-sm": ["14px", { lineHeight: "1.4", fontWeight: "600" }],
    body: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
    small: ["13px", { lineHeight: "1.5", fontWeight: "400" }],
    label: ["13px", { lineHeight: "1.5", fontWeight: "500" }],
    "label-sm": ["12px", { lineHeight: "1.5", fontWeight: "600" }],
  },
} as const;
