import { SearchSelect } from "../components/ui/SearchSelect";
import { searchPlayersByName, searchTeamsByName } from "../lib/api";

import { useState } from "react";
import '../styles/gridBackground.css'

import BigSearchBar from "../components/ui/BigSearchBar";


const HomePage = () => {
  return (
    <>
    <div className="min-h-[75vh] inset-0 bg-grid-pattern flex flex-col items-center justify-start pt-40 overflow-hidden text-[#FFB13C]">

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#FFB13C] rounded-full mix-blend-screen opacity-25 animate-blob animation-delay-1500"></div>
        <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-[#2A2929] rounded-full mix-blend-screen opacity-15 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-[#FFB13C] rounded-full mix-blend-screen opacity-25 animate-blob animation-delay-3000"></div>
      </div>

      <header className="mb-12 text-center relative z-10 pt-4">
      <h1 className="font-kagoda text-8xl font-extrabold  bg-clip-text bg-gradient-to-r text-[#FFB13C] mb-6 uppercase tracking-wide animate-fade-in-down">
          StatsBanger.com
        </h1>
        <p className="font-kagoda text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-300 text-[#FFB13C] font-semibold">
          Explore{" "}
          <span className="font-kagoda  font-semibold text-[#FFB13C]">detailed analytics</span> and{" "}
          <span className="font-kagoda font-semibold text-[#FFB13C]">interactive visualizations</span> of your favorite football players and teams.
        </p>
      </header>

      <BigSearchBar onSearch={(query) => console.log("Search for:", query)} />


    </div>
        <div className=" font-kagoda  min-h-screen pt-screen bg-[#FFB13C]] flex items-center justify-center z-0">
        <SearchSelect
        title="Player Analytics"
        description={
          <>
            Dive deep into{" "}
            <span className="text-[#FFB13C] font-medium">player performance metrics</span>, compare stats across seasons, and track progress with our interactive dashboards.
          </>
        }
        colorClasses={{
          bar: "bg-[#FFB13C]",
          titleFrom: "from-[#FFB13C]",
          titleTo: "to-[#2A2929]",
          badges: "text-[#FFB13C]",
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
            <span className="text-[#FFB13C] font-medium">team formations</span>, win rates, and key moments across leagues and tournaments. Our heatmaps and tactical boards bring matches to life with data-driven insights.
          </>
        }
        colorClasses={{
          bar: "bg-[#2A2929]",
          titleFrom: "from-[#2A2929]",
          titleTo: "to-[#FFB13C]",
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

    <SearchSelect
        title="League Overview"
        description={
          <>
            Analyze{" "}
            <span className="text-[#FFB13C] font-medium">team formations</span>, win rates, and key moments across leagues and tournaments. Our heatmaps and tactical boards bring matches to life with data-driven insights.
          </>
        }
        colorClasses={{
          bar: "bg-[#2A2929]",
          titleFrom: "from-[#2A2929]",
          titleTo: "to-[#FFB13C]",
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
      </div>
      


    <footer className="mt-12 text-sm text-[#FFB13C] relative z-10 animate-fade-in animate-delay-1000">
        <div className="flex items-center space-x-4">
          <span>© 2025 Football Stats Visualizer</span>
          <span className="h-1 w-1 bg-[#FFB13C] rounded-full"></span>
          <span>All rights reserved</span>
          <span className="h-1 w-1 bg-[#FFB13C] rounded-full"></span>
          <a href="#" className="hover:text-[#FFB13C] transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-[#FFB13C] transition-colors">
            Privacy
          </a>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
