import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { METRICS, PLAYER_COLORS } from "@/types/player";
import type { PlayerRadarData } from "@/types/player";

interface Props {
  players: PlayerRadarData[];
}

const BarChartView = ({ players }: Props) => {
  // 🔥 Detect role
  const role = players[0]?.role || "";

  // 🔥 Filter metrics
  const filteredMetrics = METRICS.filter((m) => {
    if (role === "Forward" || role === "Finisher") {
      return !["interceptions_pct", "duels_pct"].includes(m.key);
    }
    return true;
  });

  // 🔥 Build data (with scaling)
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
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="metric" />

        {/* 🔥 SCALE FIX */}
        <YAxis domain={[0, 100]} />

        {/* 🔥 TOOLTIP FIX */}
        <Tooltip formatter={(v: number) => `${Number(v ?? 0).toFixed(0)}%`} />

        <Legend />

        {players.map((p, i) => (
          <Bar
            key={p.player_name}
            dataKey={p.player_name}
            fill={PLAYER_COLORS[i % PLAYER_COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartView;