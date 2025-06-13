import { useState } from "react";

const BigSearchBar = ({ placeholder = "Search players or teams...", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto px-4">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full bg-[#fffbc5] placeholder-[#808080] border-2 border-[#ffd000] text-[#808080] text-2xl font-semibold py-4 px-6 focus:outline-none focus:ring-4 focus:ring-yellow-400 hover:ring-4 hover:ring-yellow-300 transition"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#ffd000] hover:bg-yellow-500 text-[#2A2929] rounded-full px-6 py-3 font-bold text-xl transition"
          aria-label="Search"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default BigSearchBar;
