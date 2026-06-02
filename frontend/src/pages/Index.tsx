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
import { motion } from "framer-motion";

const Index = () => {
  const { query, results, loading, search, setQuery, setResults } =
    usePlayerSearch();
  const { players, addPlayer, removePlayer } = usePlayerData();

  const handleSelect = (name: string) => {
    addPlayer(name);
    setQuery("");
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">

      {/* 🔥 Background Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-3xl opacity-40" />

      <Navbar />

      <main className="w-full flex flex-col items-center px-4 py-12">

        {/* 🔥 HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl flex flex-col items-center text-center space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight leading-tight">
            Compare Player Performance
          </h1>

          <p className="text-muted-foreground text-sm md:text-base max-w-lg">
            Search and compare football players with advanced analytics
          </p>

          {/* 🔥 Search */}
          <div className="w-full max-w-xl">
            <PlayerSearch
              query={query}
              results={results}
              loading={loading}
              onSearch={search}
              onSelect={handleSelect}
              onClearResults={() => setResults([])}
            />
          </div>

          {/* 🔥 Tags */}
          {players.length > 0 && (
            <div className="flex justify-center w-full">
              <PlayerTags players={players} onRemove={removePlayer} />
            </div>
          )}
        </motion.div>

        {/* 🔥 CONTENT */}
        <div className="w-full max-w-6xl mt-12">

          {players.length > 0 ? (
            <Tabs defaultValue="radar" className="space-y-6">

              {/* Tabs */}
              <div className="flex justify-center">
                <TabsList className="bg-muted/50 backdrop-blur-md border border-border p-1 rounded-xl shadow-lg">

                  <TabsTrigger
                    value="radar"
                    className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-md"
                  >
                    <Radar className="h-4 w-4" /> Radar
                  </TabsTrigger>

                  <TabsTrigger
                    value="bar"
                    className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-md"
                  >
                    <BarChart3 className="h-4 w-4" /> Bar Chart
                  </TabsTrigger>

                  <TabsTrigger
                    value="table"
                    className="gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-md"
                  >
                    <Table className="h-4 w-4" /> Table
                  </TabsTrigger>

                </TabsList>
              </div>

              {/* Charts */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-card/70 backdrop-blur-md p-6 shadow-2xl"
              >
                <TabsContent value="radar" className="mt-0">
                  <RadarChartView players={players} />
                </TabsContent>

                <TabsContent value="bar" className="mt-0">
                  <BarChartView players={players} />
                </TabsContent>

                <TabsContent value="table" className="mt-0">
                  <TableView players={players} />
                </TabsContent>
              </motion.div>

            </Tabs>
          ) : (
            /* 🔥 EMPTY STATE (PERFECT CENTER) */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center mt-24 space-y-4 text-center"
            >
              <div className="p-6 rounded-2xl bg-muted/40 backdrop-blur-md border border-border shadow-md">
                <Radar className="h-12 w-12 opacity-40" />
              </div>

              <p className="text-lg font-display font-medium">
                No players selected
              </p>

              <p className="text-sm text-muted-foreground/70 max-w-sm">
                Search for players above to start comparing performance
              </p>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Index;