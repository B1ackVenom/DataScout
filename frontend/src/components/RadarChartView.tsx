import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

import { METRICS, PLAYER_COLORS } from "@/types/player";
import type { PlayerRadarData } from "@/types/player";

interface Props {
  players: PlayerRadarData[];
}

const RadarChartView = ({ players }: Props) => {
  // 🔥 Detect role
  const role = players[0]?.role || "";

  // 🔥 Filter metrics based on role
  const filteredMetrics = METRICS.filter((m) => {
    if (role === "Forward" || role === "Finisher") {
      return !["interceptions_pct", "duels_pct"].includes(m.key);
    }
    return true;
  });

  // 🔥 Build chart data (with % scaling)
  const data = filteredMetrics.map((m) => {
    const entry: Record<string, string | number> = { metric: m.label };

    players.forEach((p) => {
      entry[p.player_name] =
        Number(p[m.key as keyof PlayerRadarData] ?? 0) * 100;
    });

    return entry;
  });

  return (
    <ResponsiveContainer width="100%" height={420}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" />

        {/* 🔥 FIX SCALE */}
        <PolarRadiusAxis domain={[0, 100]} />

        {/* 🔥 FIX TOOLTIP */}
        <Tooltip formatter={(v: number) => `${Number(v ?? 0).toFixed(0)}%`} />

        {players.map((p, i) => (
          <Radar
            key={p.player_name}
            name={p.player_name}
            dataKey={p.player_name}
            stroke={PLAYER_COLORS[i % PLAYER_COLORS.length]}
            fill={PLAYER_COLORS[i % PLAYER_COLORS.length]}
            fillOpacity={0.2}
          />
        ))}

        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChartView;