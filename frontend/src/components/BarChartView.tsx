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
import { motion } from "framer-motion";

interface Props {
  players: PlayerRadarData[];
}

const BarChartView = ({ players }: Props) => {
  const role = players[0]?.role || "";

  const filteredMetrics = METRICS.filter((m) => {
    if (role === "Forward" || role === "Finisher") {
      return !["interceptions_pct", "duels_pct"].includes(m.key);
    }
    return true;
  });

  const data = filteredMetrics.map((m) => {
    const entry: Record<string, string | number> = { metric: m.label };

    players.forEach((p) => {
      entry[p.player_name] =
        Number(p[m.key as keyof PlayerRadarData] ?? 0) * 100;
    });

    return entry;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-xl p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
    >
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis domain={[0, 100]} />

          <Tooltip
            formatter={(v: number) => {
              const val = Number(v);
              return [`${val.toFixed(0)}%`];
            }}
          />

          <Legend />

          {players.map((p, i) => (
            <Bar
              key={p.player_name}
              dataKey={p.player_name}
              fill={PLAYER_COLORS[i % PLAYER_COLORS.length]}
              isAnimationActive
              animationDuration={800}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default BarChartView;