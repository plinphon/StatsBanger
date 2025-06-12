import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";
import type { Player } from "../../models/player";
import type { Team } from "../../models/team";


type ResultType = { name: string; playerId?: number; teamId?: number };
type OptionType = { label: string; value: number };

type SearchSelectProps = {
  title: string;
  description: React.ReactNode;
  colorClasses: {
    bar: string;
    titleFrom: string;
    titleTo: string;
    badges: string;
  };
  placeholder: string;

  searchFunction: (query: string) => Promise<(Player | Team)[]>;


  navigatePathPrefix: string; // "/player/" or "/team/"
  filterOptions?: {
    countries: string[];
    leagues: string[];
    teams: string[];
  };
};

const stats = [
  { label: "Goals", color: "green" },
  { label: "Assists", color: "blue" },
  { label: "Pass Accuracy", color: "purple" },
  { label: "Tackles", color: "red" },
  { label: "Shots", color: "yellow" },
  { label: "Saves", color: "cyan" },
  // add more stats here...
];

function SlidingStats() {
  return (
    <div className="overflow-hidden w-full max-w-full">
      <div
        className="flex space-x-4 whitespace-nowrap animate-slide"
        style={{ minWidth: "max-content" }}
      >
        {/* Duplicate the stats for seamless loop */}
        {stats.concat(stats).map(({ label, color }, i) => (
          <span
            key={`${label}-${i}`}
            className={`px-4 py-2 bg-gray-700/50 rounded-full text-${color}-300 text-sm font-medium border border-${color}-500/30 inline-block select-none`}
          >
            {label}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-slide {
          animation: slide 15s linear infinite;
        }
      `}</style>
    </div>
  );
}


export function SearchSelect({
  title,
  description,
  colorClasses,
  placeholder,
  searchFunction,
  navigatePathPrefix,
  filterOptions,
}: SearchSelectProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  const handleFocus = () => setExpanded(true);

  const handleClickMain = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const navigate = useNavigate();


  const loadOptions = async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue) return [];
    try {
      const results: ResultType[] = await searchFunction(inputValue);
  
      return results
        .map((r) => {
          const id = r.playerId ?? r.teamId;
          if (id === undefined) return null;  // skip if no id
          return {
            label: r.name,
            value: Number(id),
          };
        })
        .filter((opt): opt is OptionType => opt !== null);  // filter out nulls
    } catch {
      return [];
    }
  };

  const handleInputChange = (newValue: OptionType | null) => {
    setSelectedOption(newValue);
  };

  const handleSelectClick = () => {
    if (selectedOption) {
      navigate(`${navigatePathPrefix}${selectedOption.value}`);
    }
  };

  return (
    <main
      onClick={handleClickMain}
      className="w-full max-w-5xl bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700/50 relative z-10 transform transition-all hover:scale-[1.01] hover:shadow-green-500/20 duration-500 cursor-pointer"
    >
      <section className="mb-10 group">
        <div className="flex items-center mb-6">
          <div
            className={`w-3 h-12 rounded-full mr-4 group-hover:animate-pulse ${colorClasses.bar}`}
          ></div>
          <h2
            className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${colorClasses.titleFrom} ${colorClasses.titleTo}`}
          >
            {title}
          </h2>
        </div>
        <p className="text-gray-300 text-lg pl-7 leading-relaxed">{description}</p>
                <div className={`mt-6 pl-7`}>
                <SlidingStats />
              </div>

        <div
          className={`transition-all duration-500 overflow-hidden ${
            expanded ? "max-h-96 mt-6 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div onClick={(e) => e.stopPropagation()} className="space-y-3">
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions}
              defaultOptions
              placeholder={placeholder}
              className="w-full text-black"
              onFocus={handleFocus}
              onChange={handleInputChange}
            />
            <button
              className={`w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors duration-300`}
              onClick={handleSelectClick}
              disabled={!selectedOption}
            >
              Select From Search
            </button>
          </div>

          <div className="flex items-center justify-center text-gray-500 font-semibold uppercase">
            <div className="h-px bg-gray-400 flex-1 mr-3"></div>
            or
            <div className="h-px bg-gray-400 flex-1 ml-3"></div>
          </div>

          {filterOptions && (
            <div className="space-y-4 mt-4">
              <select
                onFocus={handleFocus}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option>Select Country</option>
                {filterOptions.countries.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                onFocus={handleFocus}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Select League</option>
                {filterOptions.leagues.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>

              <select
                onFocus={handleFocus}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>Select Team</option>
                {filterOptions.teams.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <button className="w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors duration-300">
                Select From Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
