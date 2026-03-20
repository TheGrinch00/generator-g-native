/**
 * Design tokens — single source of truth for colors used in JS context.
 * For className usage, prefer the semantic Tailwind classes (e.g. `bg-primary`, `text-muted`).
 * Use these tokens only where a raw hex value is required (Switch, Ionicons, style props, etc.).
 */

export const colors = {
  light: {
    primary: "#2563eb",
    primaryForeground: "#ffffff",
    secondary: "#8b5cf6",
    accent: "#f59e0b",
    destructive: "#ef4444",
    success: "#22c55e",
    background: "#ffffff",
    foreground: "#111827",
    muted: "#6b7280",
    mutedForeground: "#9ca3af",
    border: "#e5e7eb",
    input: "#f9fafb",
    card: "#f9fafb",
    switchTrack: "#e5e7eb",
    switchTrackActive: "#3b82f6",
    switchThumb: "#ffffff",
  },
  dark: {
    primary: "#3b82f6",
    primaryForeground: "#ffffff",
    secondary: "#a78bfa",
    accent: "#fbbf24",
    destructive: "#f87171",
    success: "#4ade80",
    background: "#0f172a",
    foreground: "#f8fafc",
    muted: "#94a3b8",
    mutedForeground: "#64748b",
    border: "#1e293b",
    input: "#1e293b",
    card: "#1e293b",
    switchTrack: "#334155",
    switchTrackActive: "#3b82f6",
    switchThumb: "#ffffff",
  },
} as const;

export type ThemeColors = typeof colors.light;
