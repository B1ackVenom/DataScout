import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const usePlayerSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (q: string) => {
    setQuery(q);

    if (!q) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(`${API}/player/search?query=${q}`);
      setResults(res.data || []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    query,
    results,
    loading,
    search,
    setQuery,
    setResults,
  };
};