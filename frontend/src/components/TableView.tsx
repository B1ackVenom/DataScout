import type { PlayerRadarData } from "@/types/player";
import { PLAYER_COLORS, METRICS } from "@/types/player";

interface Props {
  players: PlayerRadarData[];
}

const TableView = ({ players }: Props) => {
  if (!players || players.length === 0) return null;

  // 🔥 Detect role
  const role = players[0]?.role || "";

  // 🔥 Filter metrics
  const filteredMetrics = METRICS.filter((m) => {
    if (role === "Forward" || role === "Finisher") {
      return !["interceptions_pct", "duels_pct"].includes(m.key);
    }
    return true;
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">
              Player
            </th>

            {filteredMetrics.map((m) => (
              <th
                key={m.key}
                className="text-center px-5 py-3.5 font-semibold text-muted-foreground"
              >
                {m.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {players.map((p, i) => (
            <tr
              key={p.player_name}
              className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td className="px-5 py-3.5 font-medium capitalize flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    background:
                      PLAYER_COLORS[i % PLAYER_COLORS.length],
                  }}
                />
                {p.player_name}
              </td>

              {filteredMetrics.map((m) => {
                const val = Number(p[m.key as keyof PlayerRadarData] ?? 0);
                return (
                  <td
                    key={m.key}
                    className="text-center px-5 py-3.5 tabular-nums"
                  >
                    {/* 🔥 % SCALE FIX */}
                    {(val * 100).toFixed(0)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;