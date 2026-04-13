import { X } from "lucide-react";
import { PLAYER_COLORS } from "@/types/player";
import type { PlayerRadarData } from "@/types/player";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  players: PlayerRadarData[];
  onRemove: (name: string) => void;
}

const PlayerTags = ({ players, onRemove }: Props) => {
  if (players.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence>
        {players.map((p, i) => (
          <motion.div
            key={p.player_name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium capitalize"
            style={{ borderLeftColor: PLAYER_COLORS[i % PLAYER_COLORS.length], borderLeftWidth: 3 }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: PLAYER_COLORS[i % PLAYER_COLORS.length] }}
            />
            {p.player_name}
            <button
              onClick={() => onRemove(p.player_name)}
              className="ml-1 rounded-md p-0.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PlayerTags;
