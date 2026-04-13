import Navbar from "@/components/Navbar";
import PlayerSearch from "@/components/PlayerSearch";
import PlayerTags from "@/components/PlayerTags";
import BarChartView from "@/components/BarChartView";
import RadarChartView from "@/components/RadarChartView";
import TableView from "@/components/TableView";
import { usePlayerSearch } from "@/hooks/usePlayerSearch";
import { usePlayerData } from "@/hooks/usePlayerData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3, Radar, Table } from "lucide-react";

const Index = () => {
  const { query, results, loading, search, setQuery, setResults } = usePlayerSearch();
  const { players, addPlayer, removePlayer } = usePlayerData();

  const handleSelect = (name: string) => {
    addPlayer(name);
    setQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container py-10 space-y-8">
        {/* Hero area */}
        <div className="flex flex-col items-center text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">
            Compare Player Performance
          </h2>
          <p className="text-muted-foreground text-sm max-w-md">
            Search and add players to visualize their stats side by side
          </p>
        </div>

        {/* Search — centered */}
        <div className="flex justify-center">
          <PlayerSearch
            query={query}
            results={results}
            loading={loading}
            onSearch={search}
            onSelect={handleSelect}
            onClearResults={() => setResults([])}
          />
        </div>

        {/* Selected Players — centered */}
        <div className="flex justify-center">
          <PlayerTags players={players} onRemove={removePlayer} />
        </div>

        {/* Comparison */}
        {players.length > 0 ? (
          <Tabs defaultValue="radar" className="space-y-4">
            <div className="flex justify-center">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="radar" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <Radar className="h-4 w-4" /> Radar
                </TabsTrigger>
                <TabsTrigger value="bar" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <BarChart3 className="h-4 w-4" /> Bar Chart
                </TabsTrigger>
                <TabsTrigger value="table" className="gap-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <Table className="h-4 w-4" /> Table
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
              <TabsContent value="radar" className="mt-0">
                <RadarChartView players={players} />
              </TabsContent>
              <TabsContent value="bar" className="mt-0">
                <BarChartView players={players} />
              </TabsContent>
              <TabsContent value="table" className="mt-0">
                <TableView players={players} />
              </TabsContent>
            </div>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3">
            <div className="p-4 rounded-2xl bg-muted/40">
              <Radar className="h-10 w-10 opacity-40" />
            </div>
            <p className="text-base font-display font-medium">No players selected</p>
            <p className="text-sm text-muted-foreground/70">Start typing a player name above to begin</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
