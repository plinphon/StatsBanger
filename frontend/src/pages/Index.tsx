import { SearchSelect } from "../components/ui/SearchSelect";
import { searchPlayersByName, searchTeamsByName } from "../lib/api";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6 overflow-hidden relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-green-500 rounded-full mix-blend-screen opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-500 rounded-full mix-blend-screen opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/3 w-52 h-52 bg-purple-500 rounded-full mix-blend-screen opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <header className="mb-12 text-center relative z-10">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-200 mb-6 animate-fade-in-down">
          StatsBanger.com
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-300">
          Explore <span className="font-semibold text-green-300">detailed analytics</span> and <span className="font-semibold text-blue-300">interactive visualizations</span> of your favorite football players and teams.
        </p>
      </header>

      <SearchSelect
        title="Player Analytics"
        description={
          <>
            Dive deep into{" "}
            <span className="text-green-300 font-medium">player performance metrics</span>, compare stats across seasons, and track progress with our interactive dashboards.
          </>
        }
        colorClasses={{
          bar: "bg-green-500",
          titleFrom: "from-green-400",
          titleTo: "to-cyan-400",
          badges: "text-green-300",
        }}
        placeholder="Search player name..."
        searchFunction={searchPlayersByName}
        navigatePathPrefix="/player/"
        filterOptions={{
          countries: ["Spain", "Germany", "Brazil"],
          leagues: ["Premier League", "La Liga", "Serie A"],
          teams: ["FC Barcelona", "Manchester City", "Juventus"],
        }}
      />

      <SearchSelect
        title="Team Performance"
        description={
          <>
            Analyze{" "}
            <span className="text-blue-300 font-medium">team formations</span>, win rates, and key moments across leagues and tournaments. Our heatmaps and tactical boards bring matches to life with data-driven insights.
          </>
        }
        colorClasses={{
          bar: "bg-blue-500",
          titleFrom: "from-blue-400",
          titleTo: "to-indigo-400",
          badges: "text-yellow-300",
        }}
        placeholder="Search team name..."
        searchFunction={searchTeamsByName}
        navigatePathPrefix="/team/"
        filterOptions={{
          countries: ["USA", "England", "Italy"],
          leagues: ["MLS", "Championship", "Serie A"],
          teams: ["LA Galaxy", "Chelsea", "AC Milan"],
        }}
      />

        <footer className="mt-16 text-sm text-gray-400 relative z-10 animate-fade-in animate-delay-1000">
          <div className="flex items-center space-x-6">
            <span>© 2025 Football Stats Visualizer</span>
            <span className="h-1 w-1 bg-gray-500 rounded-full"></span>
            <span>All rights reserved</span>
            <span className="h-1 w-1 bg-gray-500 rounded-full"></span>
            <a href="#" className="hover:text-green-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-green-400 transition-colors">Privacy</a>
          </div>
        </footer>
    </div>
  );
};

export default HomePage;
