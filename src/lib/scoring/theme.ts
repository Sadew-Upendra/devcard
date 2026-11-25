export interface CardTheme {
  stops: [string, string, string]; // metallic gradient, light to dark
  border: string;
  text: string;
  line: string;
  glow: string;
}

export const THEMES: Record<string, CardTheme> = {
  Bronze: {
    stops: ["#e0a46a", "#a8683a", "#5a3a1a"],
    border: "#f6d3ae",
    text: "#2b1708",
    line: "rgba(43,23,8,0.35)",
    glow: "#ffd9a8",
  },
  Silver: {
    stops: ["#f1f5f9", "#b4bdca", "#6f7a89"],
    border: "#ffffff",
    text: "#1c232d",
    line: "rgba(28,35,45,0.35)",
    glow: "#ffffff",
  },
  Gold: {
    stops: ["#fff0b3", "#f5b82e", "#a8660a"],
    border: "#fff6d0",
    text: "#3b2300",
    line: "rgba(59,35,0,0.35)",
    glow: "#fff3b0",
  },
  Rare: {
    stops: ["#5ad0ff", "#2158e8", "#0a1646"],
    border: "#9be3ff",
    text: "#e8f7ff",
    line: "rgba(232,247,255,0.35)",
    glow: "#7fdcff",
  },
  Icon: {
    stops: ["#f5b8ff", "#7c3aed", "#0b1026"],
    border: "#f8dcff",
    text: "#fdf4ff",
    line: "rgba(253,244,255,0.35)",
    glow: "#e9a8ff",
  },
};