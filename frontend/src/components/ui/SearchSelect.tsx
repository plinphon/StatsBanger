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
  navigatePathPrefix: string;
  filterOptions?: {
    countries: string[];
    leagues: string[];
    teams: string[];
  };
};

const stats = [
  { label: "Goals", color: "#ffd000" },
  { label: "Assists", color: "#e6c300" },
  { label: "Pass Accuracy", color: "#ffe066" },
  { label: "Tackles", color: "#f0d800" },
  { label: "Shots", color: "#ffeb80" },
  { label: "Saves", color: "#fff199" },
];

function SlidingStats() {
  return (
    <div className="overflow-hidden w-full max-w-full">
      <div
        className="flex space-x-4 whitespace-nowrap animate-slide"
        style={{ minWidth: "max-content" }}
      >
        {[...stats, ...stats].map(({ label, color }, i) => (
          <span
            key={`${label}-${i}`}
            style={{ backgroundColor: "rgba(255, 208, 0, 0.15)", color, borderColor: color }}
            className="px-4 py-2 rounded-full text-sm font-medium border inline-block select-none"
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
          animation: slide 6s linear infinite;
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
  const navigate = useNavigate();

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

  const loadOptions = async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue) return [];
    try {
      const results: ResultType[] = await searchFunction(inputValue);

      return results
        .map((r) => {
          const id = r.playerId ?? r.teamId;
          if (id === undefined) return null;
          return {
            label: r.name,
            value: Number(id),
          };
        })
        .filter((opt): opt is OptionType => opt !== null);
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
      className="w-full max-w-5xl bg-[#0f0f0f] rounded-xl shadow-xl p-8 border border-[#ffd000] relative z-10 transform transition-all hover:scale-[1.03] hover:shadow-[#ffd000]/60 duration-300 cursor-pointer"
      style={{ backgroundImage: "linear-gradient(45deg, rgba(42,41,41,0.2) 25%, transparent 25%), linear-gradient(-45deg, rgba(42,41,41,0.2) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(42,41,41,0.2) 75%), linear-gradient(-45deg, transparent 75%, rgba(42,41,41,0.2) 75%)", backgroundSize: "20px 20px", backgroundColor: "#0f0f0f" }}
    >
      <section className="mb-10 group">
        <div className="flex items-center mb-6">
          <div
            className={`w-3 h-12 rounded-full mr-4 group-hover:animate-pulse`}
            style={{ backgroundColor: "#ffd000" }}
          ></div>
          <h2
            className={`text-4xl font-bold`}
            style={{
              background: "linear-gradient(90deg, #ffd000, #fff199)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
          </h2>
        </div>
        <p className="text-[#fff199] text-lg pl-7 leading-relaxed">{description}</p>
        <div className="mt-6 pl-7">
          <SlidingStats />
        </div>

        <div
          className={`transition-all duration-300 overflow-hidden ${
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
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#fff199",
                  borderColor: "#ffd000",
                  minHeight: 38,
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#ffd000" : undefined,
                  color: state.isFocused ? "#0f0f0f" : "#0f0f0f",
                  cursor: "pointer",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#0f0f0f",
                }),
              }}
            />
            <button
              className="w-full px-4 py-2 rounded-lg bg-[#ffd000] hover:bg-[#e6c300] text-[#0f0f0f] font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSelectClick}
              disabled={!selectedOption}
            >
              Select From Search
            </button>
          </div>

          <div className="flex items-center justify-center text-[#fff199] font-semibold uppercase mt-6 mb-4">
            <div className="h-px bg-[#fff199] flex-1 mr-3"></div>
            or
            <div className="h-px bg-[#fff199] flex-1 ml-3"></div>
          </div>

          {filterOptions && (
            <div className="space-y-4">
              <select
                onFocus={handleFocus}
                className="w-full px-4 py-2 rounded-lg bg-[#0f0f0f] text-[#fff199] border border-[#ffd000] focus:outline-none focus:ring-2 focus:ring-[#ffd000]"
              >
                <option className="text-[#0f0f0f]">Select Country</option>
                {filterOptions.countries.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                onFocus={handleFocus}
                className="w-full px-4 py-2 rounded-lg bg-[#0f0f0f] text-[#fff199] border border-[#ffd000] focus:outline-none focus:ring-2 focus:ring-[#ffd000]"
              >
                <option className="text-[#0f0f0f]">Select League</option>
                {filterOptions.leagues.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>

              <select
                onFocus={handleFocus}
                className="w-full px-4 py-2 rounded-lg bg-[#0f0f0f] text-[#fff199] border border-[#ffd000] focus:outline-none focus:ring-2 focus:ring-[#ffd000]"
              >
                <option className="text-[#0f0f0f]">Select Team</option>
                {filterOptions.teams.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <button className="w-full px-4 py-2 rounded-lg bg-[#ffd000] hover:bg-[#e6c300] text-[#0f0f0f] font-semibold transition-colors duration-300">
                Select From Filters
              </button>
            </div>
          )}
        </div>
      </section>
      <style>{`
        .group-hover\\:animate-pulse:hover {
          animation: pulse 0.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </main>
  );
}