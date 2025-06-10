import React from 'react';
import '../style.css';
import { useState } from "react";
import { searchPlayersByName } from "../lib/api"; 
import { searchTeamsByName } from "../lib/api"; 
import { useNavigate } from "react-router-dom";

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

 
     <PlayerSelect />
     <TeamSelect />


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

export function PlayerSelect() {
    const [expanded, setExpanded] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [filteredPlayers, setFilteredPlayers] = useState<{ name: string; id: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleFocus = () => {
      setExpanded(true);
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
        
        if (!value.trim()) {
          setFilteredPlayers([]);
          return;
        }
      
        try {
          setLoading(true);
          setError(null);
          const players = await searchPlayersByName(value);
          setFilteredPlayers(players.map((p) => ({ name: p.name, id: Number(p.id) })));
        } catch (err) {
          setError("Failed to load players");
          setFilteredPlayers([]);
        } finally {
          setLoading(false);
        }
      };
  
    const handleClickMain = (e: React.MouseEvent<HTMLDivElement>) => {
      // Prevent toggling if user clicks inside the panel
      const target = e.target as HTMLElement;
      if (target.closest("input") || target.closest("select") || target.closest(".preserve-expand")) {
        return;
      }
      setExpanded((prev) => !prev);
    };

    const navigate = useNavigate();

    return (
      <main
        onClick={handleClickMain}
        className="w-full max-w-5xl bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700/50 relative z-10 transform transition-all hover:scale-[1.01] hover:shadow-green-500/20 duration-500 cursor-pointer"
      >
        <section className="mb-10 group">
          <div className="flex items-center mb-6">
            <div className="w-3 h-12 bg-green-500 rounded-full mr-4 group-hover:animate-pulse"></div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
              Player Analytics
            </h2>
          </div>
          <p className="text-gray-300 text-lg pl-7 leading-relaxed">
            Dive deep into{" "}
            <span className="text-green-300 font-medium">
              player performance metrics
            </span>
            , compare stats across seasons, and track progress with our interactive dashboards.
          </p>
          <div className="mt-6 pl-7 flex space-x-4">
            <span className="px-4 py-2 bg-gray-700/50 rounded-full text-green-300 text-sm font-medium border border-green-500/30">
              Goals
            </span>
            <span className="px-4 py-2 bg-gray-700/50 rounded-full text-blue-300 text-sm font-medium border border-blue-500/30">
              Assists
            </span>
            <span className="px-4 py-2 bg-gray-700/50 rounded-full text-purple-300 text-sm font-medium border border-purple-500/30">
              Pass Accuracy
            </span>
          </div>
  
          {/* Expandable Panel */}
          <div
            className={`transition-all duration-500 overflow-hidden ${
              expanded ? "max-h-96 mt-6 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-7 mt-4 space-y-4 preserve-expand">
              <input
                type="text"
                placeholder="Search player name..."
                value={searchInput}
                onChange={handleChange}
                onFocus={handleFocus}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

            {searchInput && (
            <ul className="mt-1 border border-gray-500 rounded bg-white text-black max-h-48 overflow-y-auto">
                {loading ? (
                <li className="p-2 text-gray-500 italic">Loading...</li>
                ) : error ? (
                <li className="p-2 text-red-500 italic">{error}</li>
                ) : filteredPlayers.length > 0 ? (
                  filteredPlayers.map(({ name, id }, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        navigate(`/player/${id}`);
                      }}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {name}
                    </li>
                  ))
                  
                ) : (
                <li className="p-2 text-gray-500 italic">No results</li>
                )}
            </ul>
            )}

  
              <select
                onFocus={handleFocus}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option>Select Country</option>
                <option>Spain</option>
                <option>Germany</option>
                <option>Brazil</option>
              </select>
  
              <select
                onFocus={handleFocus}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Select League</option>
                <option>Premier League</option>
                <option>La Liga</option>
                <option>Serie A</option>
              </select>
  
              <select
                onFocus={handleFocus}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>Select Team</option>
                <option>FC Barcelona</option>
                <option>Manchester City</option>
                <option>Juventus</option>
              </select>
              <button className="w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors duration-300">Select</button>
            </div>
          </div>
        </section>
      </main>
    );
  }
  
  export function TeamSelect() {
    const [expanded, setExpanded] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [filteredTeams, setFilteredTeams] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleFocus = () => {
      setExpanded(true);
    };
  
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchInput(value);
  
      if (!value.trim()) {
        setFilteredTeams([]);
        return;
      }
  
      try {
        setLoading(true);
        setError(null);
        const teams = await searchTeamsByName(value); 
        setFilteredTeams(teams.map((t) => t.name));
      } catch (err) {
        setError("Failed to load teams");
        setFilteredTeams([]);
      } finally {
        setLoading(false);
      }
    };
  
    const handleClickMain = (e: React.MouseEvent<HTMLDivElement>) => {
      // Prevent toggling if user clicks inside input/select or preserve-expand areas
      const target = e.target as HTMLElement;
      if (
        target.closest("input") ||
        target.closest("select") ||
        target.closest(".preserve-expand")
      ) {
        return;
      }
      setExpanded((prev) => !prev);
    };
  
    return (
      <main
        onClick={handleClickMain}
        className="w-full max-w-5xl bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700/50 relative z-10 transform transition-all hover:scale-[1.01] hover:shadow-green-500/20 duration-500 cursor-pointer"
      >
        <section className="mb-10 group">
          <div className="flex items-center mb-6">
            <div className="w-3 h-12 bg-blue-500 rounded-full mr-4 group-hover:animate-pulse"></div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Team Performance
            </h2>
          </div>
          <p className="text-gray-300 text-lg pl-7 leading-relaxed">
            Analyze{" "}
            <span className="text-blue-300 font-medium">team formations</span>, win rates, and key moments across leagues and tournaments. Our heatmaps and tactical boards bring matches to life with data-driven insights.
          </p>
          <div className="mt-6 pl-7 flex space-x-4">
            <span className="px-4 py-2 bg-gray-700/50 rounded-full text-yellow-300 text-sm font-medium border border-yellow-500/30">
              Formations
            </span>
            <span className="px-4 py-2 bg-gray-700/50 rounded-full text-red-300 text-sm font-medium border border-red-500/30">
              Win Rates
            </span>
            <span className="px-4 py-2 bg-gray-700/50 rounded-full text-indigo-300 text-sm font-medium border border-indigo-500/30">
              Tactics
            </span>
          </div>
  
          {/* Expandable Panel */}
          <div
            className={`transition-all duration-500 overflow-hidden ${
              expanded ? "max-h-96 mt-6 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="pl-7 mt-4 space-y-4 preserve-expand">
              <input
                type="text"
                placeholder="Search team name..."
                value={searchInput}
                onChange={handleChange}
                onFocus={handleFocus}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
  
        {searchInput && (
                <ul className="mt-1 border border-gray-500 rounded bg-white text-black max-h-48 overflow-y-auto">
                    {loading ? (
                    <li className="p-2 text-gray-500 italic">Loading...</li>
                    ) : error ? (
                    <li className="p-2 text-red-500 italic">{error}</li>
                    ) : filteredTeams.length > 0 ? (
                    filteredTeams.map((name, idx) => (
                        <li
                        key={idx}
                        onClick={() => {
                            setSearchInput(name);
                            setFilteredTeams([]);
                        }}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        >
                        {name}
                        </li>
                    ))
                    ) : (
                    <li className="p-2 text-gray-500 italic">No results</li>
                    )}
                </ul>
                )}

              <select
                onFocus={handleFocus}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option>Select Country</option>
                <option>Spain</option>
                <option>Germany</option>
                <option>Brazil</option>
              </select>
  
              <select
                onFocus={handleFocus}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Select League</option>
                <option>Premier League</option>
                <option>La Liga</option>
                <option>Serie A</option>
              </select>
  
              <select
                onFocus={handleFocus}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>Select Team</option>
                <option>FC Barcelona</option>
                <option>Manchester City</option>
                <option>Juventus</option>
              </select>
  
              <button className="w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors duration-300">
                Select
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }