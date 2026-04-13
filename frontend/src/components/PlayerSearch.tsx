import { useRef, useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";

interface Props {
  query: string;
  results: string[];
  loading: boolean;
  onSearch: (q: string) => void;
  onSelect: (name: string) => void;
  onClearResults: () => void;
}

const PlayerSearch = ({ query, results, loading, onSearch, onSelect, onClearResults }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-lg">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <input
          type="text"
          placeholder="Search players..."
          value={query}
          onChange={(e) => {
            onSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
          className="w-full h-12 pl-11 pr-11 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-popover shadow-2xl overflow-hidden animate-fade-in">
          {results.map((name) => (
            <button
              key={name}
              onClick={() => {
                onSelect(name);
                onClearResults();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-popover-foreground hover:bg-primary/10 hover:text-primary transition-colors capitalize"
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerSearch;
