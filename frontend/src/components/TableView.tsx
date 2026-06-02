import type { PlayerRadarData } from "@/types/player";
import { PLAYER_COLORS, METRICS } from "@/types/player";
import { motion } from "framer-motion";

interface Props {
  players: PlayerRadarData[];
}

const formatName = (name: string) =>
  name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const getColor = (v: number) => {
  if (v > 85) return "text-green-400 font-semibold";
  if (v > 70) return "text-blue-400";
  if (v > 50) return "text-yellow-400";
  return "text-gray-400";
};

const TableView = ({ players }: Props) => {
  if (!players || players.length === 0) return null;

  const role = players[0]?.role || "";

  const filteredMetrics = METRICS.filter((m) => {
    if (role === "Forward" || role === "Finisher") {
      return !["interceptions_pct", "duels_pct"].includes(m.key);
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 shadow-lg backdrop-blur-sm overflow-x-auto"
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-5 py-3.5">Player</th>

            {filteredMetrics.map((m) => (
              <th key={m.key} className="text-center px-5 py-3.5">
                {m.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {players.map((p, i) => {
            const initials = p.player_name
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            return (
              <tr
                key={p.player_name}
                className="border-b border-border hover:bg-muted/50 transition"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                      style={{
                        background:
                          PLAYER_COLORS[i % PLAYER_COLORS.length],
                      }}
                    >
                      {initials}
                    </div>

                    {formatName(p.player_name)}
                  </div>
                </td>

                {filteredMetrics.map((m) => {
                  const val = Number(
                    p[m.key as keyof PlayerRadarData] ?? 0
                  );
                  const percent = val * 100;

                  const other = players.find(
                    (pl) => pl.player_name !== p.player_name
                  );
                  const otherVal =
                    Number(
                      other?.[m.key as keyof PlayerRadarData] ?? 0
                    ) * 100;

                  const isBetter = percent > otherVal;

                  return (
                    <td
                      key={m.key}
                      className={`text-center px-5 py-3.5 ${
                        isBetter
                          ? "bg-green-500/10 border border-green-500/20"
                          : ""
                      } ${getColor(percent)}`}
                    >
                      {percent.toFixed(0)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
};

export default TableView;