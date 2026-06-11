export const colors = {
  primary: "#0075de",
  primaryActive: "#005bab",
  secondary: "#213183",
  canvas: "#ffffff",
  canvasSoft: "#f6f5f4",
  surface: "#ffffff",
  hairline: "#e6e6e6",
  ink: "#000000",
  inkSecondary: "#31302e",
  inkMuted: "#615d59",
  inkFaint: "#a39e98",
  onPrimary: "#ffffff",
  accentSky: "#62aef0",
  accentPurple: "#d6b6f6",
  accentPurpleDeep: "#391c57",
  accentPink: "#ff64c8",
  accentOrange: "#dd5b00",
  accentOrangeDeep: "#793400",
  accentTeal: "#2a9d99",
  accentGreen: "#1aae39",
  accentBrown: "#523410",
} as const;

/** Decorative sticker palette — charts, category dots, illustration bands only */
export const stickerPalette = [
  colors.accentSky,
  colors.accentPurple,
  colors.accentPink,
  colors.accentOrange,
  colors.accentTeal,
  colors.accentGreen,
] as const;

export const shadowSoft =
  "0 0.175px 1.041px rgba(0,0,0,0.01), 0 0.8px 2.925px rgba(0,0,0,0.02), 0 2.025px 7.847px rgba(0,0,0,0.027), 0 4px 18px rgba(0,0,0,0.04)";
