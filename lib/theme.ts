export const themeStorageKey = "ofc-theme";
export const themes = ["system", "light", "dark"] as const;

export type ThemePreference = (typeof themes)[number];

export function getThemeScript() {
  return `
(() => {
  const key = "${themeStorageKey}";
  const root = document.documentElement;
  const stored = localStorage.getItem(key);
  const preference = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = preference === "system" ? (systemDark ? "dark" : "light") : preference;
  root.dataset.themePreference = preference;
})();
`;
}
