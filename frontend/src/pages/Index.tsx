import { SearchSelect } from "../components/ui/SearchSelect";
import { searchPlayersByName, searchTeamsByName } from "../lib/api";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-grid-pattern flex flex-col items-center justify-center p-6 overflow-hidden relative text-[#ffd000]">
      {/* Grid pattern background */}
      <style>
        {`
          /* Background base color */
          .bg-grid-pattern {
            background-color: #0f0f0f; /* main dark */
            background-image:
              linear-gradient(#2A2929 1px, transparent 1px),
              linear-gradient(90deg, #2A2929 1px, transparent 1px);
            background-size: 120px 120px;
          }

          /* Faster blob animation */
          .animate-blob {
            animation: blob 3s infinite;
          }

          /* Faster fade-in */
          .animate-fade-in-down {
            animation: fadeInDown 0.5s ease forwards;
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.5s ease forwards;
          }
          .animate-delay-300 {
            animation-delay: 0.15s;
          }
          .animate-delay-1000 {
            animation-delay: 0.5s;
          }

          @keyframes blob {
            0%, 100% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(10px, -10px) scale(1.05);
            }
            66% {
              transform: translate(-10px, 10px) scale(0.95);
            }
          }
          @keyframes fadeInDown {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#ffd000] rounded-full mix-blend-screen opacity-25 animate-blob animation-delay-1500"></div>
        <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-[#2A2929] rounded-full mix-blend-screen opacity-15 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-[#ffd000] rounded-full mix-blend-screen opacity-25 animate-blob animation-delay-3000"></div>
      </div>

      <header className="mb-8 text-center relative z-10">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-[#ffd000] mb-4 animate-fade-in-down">
          StatsBanger.com
        </h1>
        <p className="text-lg max-w-xl mx-auto leading-relaxed animate-fade-in-up animate-delay-300">
          Explore{" "}
          <span className="font-semibold text-[#ffd000]">detailed analytics</span> and{" "}
          <span className="font-semibold text-[#ffd000]">interactive visualizations</span> of your favorite football players and teams.
        </p>
      </header>

      <SearchSelect
        title="Player Analytics"
        description={
          <>
            Dive deep into{" "}
            <span className="text-[#ffd000] font-medium">player performance metrics</span>, compare stats across seasons, and track progress with our interactive dashboards.
          </>
        }
        colorClasses={{
          bar: "bg-[#ffd000]",
          titleFrom: "from-[#ffd000]",
          titleTo: "to-[#2A2929]",
          badges: "text-[#ffd000]",
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
            <span className="text-[#ffd000] font-medium">team formations</span>, win rates, and key moments across leagues and tournaments. Our heatmaps and tactical boards bring matches to life with data-driven insights.
          </>
        }
        colorClasses={{
          bar: "bg-[#2A2929]",
          titleFrom: "from-[#2A2929]",
          titleTo: "to-[#ffd000]",
          badges: "text-[#2A2929]",
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

      <footer className="mt-12 text-sm text-[#ffd000] relative z-10 animate-fade-in animate-delay-1000">
        <div className="flex items-center space-x-4">
          <span>© 2025 Football Stats Visualizer</span>
          <span className="h-1 w-1 bg-[#ffd000] rounded-full"></span>
          <span>All rights reserved</span>
          <span className="h-1 w-1 bg-[#ffd000] rounded-full"></span>
          <a href="#" className="hover:text-[#ffd000] transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-[#ffd000] transition-colors">
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
