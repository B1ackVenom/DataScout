export interface PlayerRadarData {
  player_name: string;
  role: string;

  goals_pct: number;
  xg_pct: number;
  assists_pct: number;
  xa_pct: number;

  shots_pct: number;
  passes_pct: number;

  interceptions_pct: number;
  duels_pct: number;
  clearances_pct: number;

  carries_pct: number;
}

// 🔥 UPDATED METRICS (clean + balanced)
export const METRICS = [
  // ⚽ Attack
  { key: "goals_pct", label: "Goals %" },
  { key: "xg_pct", label: "xG %" },
  { key: "shots_pct", label: "Shots %" },

  // 🎯 Creativity
  { key: "assists_pct", label: "Assists %" },
  { key: "xa_pct", label: "xA %" },

  // 🧠 Control
  { key: "passes_pct", label: "Pass Volume %" },
  { key: "carries_pct", label: "Carries %" },

  // 🛡️ Defense (keep only meaningful ones)
  { key: "interceptions_pct", label: "Interceptions %" },
  { key: "duels_pct", label: "Duels %" },
  // ❌ removed clearances (too defensive-heavy)
] as const;

export type MetricKey = typeof METRICS[number]["key"];

export const PLAYER_COLORS = [
  "hsl(142, 71%, 45%)",
  "hsl(199, 89%, 48%)",
  "hsl(280, 65%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(170, 70%, 45%)",
  "hsl(330, 70%, 55%)",
  "hsl(60, 80%, 50%)",
];