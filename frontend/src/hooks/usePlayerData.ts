import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const usePlayerData = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addPlayer = async (name: string) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/player/radar?name=${name}`);

      if (res.data && res.data.length > 0) {
        setPlayers((prev) => [...prev, res.data[0]]);
      }
    } catch (err) {
      console.error("Radar fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const removePlayer = (name: string) => {
    setPlayers((prev) =>
      prev.filter((p) => p.player_name !== name)
    );
  };

  return {
    players,
    loading,
    addPlayer,
    removePlayer,
  };
};