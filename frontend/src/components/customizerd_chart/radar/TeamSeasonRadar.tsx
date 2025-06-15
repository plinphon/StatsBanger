import { useState } from 'react';

// Team-specific metrics for the radar chart
const teamAttacking = ["goals", "shotsTotal", "shotsOnTarget", "bigChancesCreated", "cornerKicks", "crosses", "offside"];
const teamDefending = ["concededGoals", "tackles", "interceptions", "clearances", "blocks", "saves", "cleanSheet"];
const teamPossession = ["possession", "passes", "accuratePassesPercentage", "longBalls", "crosses", "fouls", "yellowCards"];
const teamSetPieces = ["cornerKicks", "freeKicks", "throwIns", "penalties", "goalKicks"];

// Stat categories for dynamic radar chart
const TEAM_STAT_CATEGORIES = {
  attacking: {
    name: "Attacking",
    stats: ["goals", "shotsTotal", "shotsOnTarget", "bigChancesCreated", "cornerKicks", "crosses"]
  },
  defending: {
    name: "Defending", 
    stats: ["concededGoals", "tackles", "interceptions", "clearances", "blocks", "saves", "cleanSheet"]
  },
  possession: {
    name: "Possession",
    stats: ["possession", "passes", "accuratePassesPercentage", "longBalls", "crosses", "fouls"]
  },
  setpieces: {
    name: "Set Pieces",
    stats: ["cornerKicks", "freeKicks", "throwIns", "penalties", "goalKicks", "offside"]
  },
  discipline: {
    name: "Discipline",
    stats: ["fouls", "yellowCards", "redCards", "offside"]
  }
};

// Built-in presets for quick selection
const TEAM_BUILT_IN_PRESETS = {
  "attacking": {
    name: "Attacking Focus",
    metrics: ["goals", "shotsTotal", "shotsOnTarget", "bigChancesCreated", "cornerKicks", "crosses"]
  },
  "defending": {
    name: "Defensive Profile", 
    metrics: ["concededGoals", "tackles", "interceptions", "clearances", "blocks", "saves", "cleanSheet"]
  },
  "ballcontrol": {
    name: "Ball Control",
    metrics: ["possession", "passes", "accuratePassesPercentage", "longBalls", "crosses", "fouls"]
  },
  "setpieces": {
    name: "Set Piece Specialists",
    metrics: ["cornerKicks", "freeKicks", "throwIns", "penalties", "goalKicks", "offside"]
  }
};

// All available team metrics organized by category
const ALL_TEAM_METRICS = {
  attacking: ["goals", "shotsTotal", "shotsOnTarget", "bigChancesCreated", "cornerKicks", "crosses", "offside", "penalties"],
  defending: ["concededGoals", "tackles", "interceptions", "clearances", "blocks", "saves", "cleanSheet", "ownGoals"],
  possession: ["possession", "passes", "accuratePassesPercentage", "longBalls", "crosses", "fouls", "yellowCards"],
  setpieces: ["cornerKicks", "freeKicks", "throwIns", "penalties", "goalKicks", "offside"],
  discipline: ["fouls", "yellowCards", "redCards", "offside"],
  performance: ["matchesPlayed", "wins", "draws", "losses", "goalsFor", "goalsAgainst", "goalDifference"]
};

interface TeamRadarChartCustomizerProps {
  currentCategory: string;
  customMode: boolean;
  selectedMetrics: string[];
  onCategoryChange: (category: string) => void;
  onCustomModeChange: (customMode: boolean) => void;
  onSelectedMetricsChange: (metrics: string[]) => void;
  buttonClassName?: string;
  buttonText?: string;
  onApply?: () => void;
}

export function TeamRadarChartCustomizer({ 
  currentCategory,
  customMode,
  selectedMetrics,
  onCategoryChange,
  onCustomModeChange,
  onSelectedMetricsChange,
  buttonClassName = "bg-gray-800/90 hover:bg-gray-700/90 text-gray-200 hover:text-white px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200 text-sm font-medium backdrop-blur-sm",
  buttonText = "Customize Chart",
  onApply
}: TeamRadarChartCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempCategory, setTempCategory] = useState(currentCategory);
  const [tempCustomMode, setTempCustomMode] = useState(customMode);
  const [tempSelectedMetrics, setTempSelectedMetrics] = useState<string[]>(selectedMetrics);

  const handleOpen = () => {
    setTempCategory(currentCategory);
    setTempCustomMode(customMode);
    setTempSelectedMetrics([...selectedMetrics]);
    setIsOpen(true);
  };

  const handleApply = () => {
    onCategoryChange(tempCategory);
    onCustomModeChange(tempCustomMode);
    onSelectedMetricsChange([...tempSelectedMetrics]);
    setIsOpen(false);
    onApply?.();
  };

  const handleCancel = () => {
    setTempCategory(currentCategory);
    setTempCustomMode(customMode);
    setTempSelectedMetrics([...selectedMetrics]);
    setIsOpen(false);
  };

  const handleMetricToggle = (metric: string) => {
    setTempSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const handlePresetSelect = (presetKey: string) => {
    const preset = TEAM_BUILT_IN_PRESETS[presetKey as keyof typeof TEAM_BUILT_IN_PRESETS];
    if (preset) {
      setTempSelectedMetrics(preset.metrics);
      setTempCustomMode(true);
    }
  };

  const getCategoryDefaultMetrics = () => {
    switch (tempCategory) {
      case "attacking": return teamAttacking;
      case "defending": return teamDefending;
      case "possession": return teamPossession;
      case "setpieces": return teamSetPieces;
      default: return teamAttacking;
    }
  };

  return (
    <>
      {/* Customize Button */}
      <button
        className={buttonClassName}
        onClick={handleOpen}
      >
        {buttonText}
      </button>

      {/* Customization Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={handleCancel}
          />
          
          {/* Drawer Panel */}
          <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 border-l border-gray-700 shadow-2xl z-50 transform transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-gray-200">Customize Team Chart</h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-200 transition-colors p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-gray-400 text-sm mb-6">
                  Select the team metrics you want to display on your radar chart.
                </p>
                
                {/* Mode Selection */}
                <div className="mb-6">
                  <h4 className="text-gray-300 text-sm font-medium mb-3">Chart Mode</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setTempCustomMode(false)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        !tempCustomMode
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="font-medium text-sm">Preset Categories</div>
                      <div className="text-xs opacity-75 mt-1">Use team-focused category presets</div>
                    </button>
                    <button
                      onClick={() => setTempCustomMode(true)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        tempCustomMode
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="font-medium text-sm">Custom Selection</div>
                      <div className="text-xs opacity-75 mt-1">Choose specific team metrics manually</div>
                    </button>
                  </div>
                </div>

                {!tempCustomMode ? (
                  /* Preset Categories */
                  <div className="space-y-3">
                    <h4 className="text-gray-300 text-sm font-medium mb-4">Select Category</h4>
                    
                    {/* Category Options */}
                    {Object.entries(TEAM_STAT_CATEGORIES).map(([key, category]) => (
                      <button
                        key={key}
                        onClick={() => setTempCategory(key)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          tempCategory === key
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{category.name}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {category.stats.length} metrics focused on {category.name.toLowerCase()}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Custom Selection */
                  <div className="space-y-4">
                    {/* Quick Presets for Custom Mode */}
                    <div className="mb-6">
                      <h4 className="text-gray-300 text-sm font-medium mb-3">Quick Presets</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(TEAM_BUILT_IN_PRESETS).map(([key, preset]) => (
                          <button
                            key={key}
                            onClick={() => handlePresetSelect(key)}
                            className="text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                          >
                            <div className="text-gray-200 text-sm font-medium">{preset.name}</div>
                            <div className="text-gray-400 text-xs mt-1">
                              {preset.metrics.length} metrics
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Individual Metric Selection */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-gray-300 text-sm font-medium">Individual Metrics</h4>
                      <span className="text-gray-400 text-xs">
                        {tempSelectedMetrics.length} selected
                      </span>
                    </div>
                    
                    {Object.entries(ALL_TEAM_METRICS).map(([category, metrics]) => (
                      <div key={category} className="space-y-2">
                        <h5 className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                          {TEAM_STAT_CATEGORIES[category as keyof typeof TEAM_STAT_CATEGORIES]?.name || category}
                        </h5>
                        <div className="space-y-1">
                          {metrics.map((metric) => (
                            <label
                              key={metric}
                              className="flex items-center p-2 hover:bg-gray-800 rounded cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={tempSelectedMetrics.includes(metric)}
                                onChange={() => handleMetricToggle(metric)}
                                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                              />
                              <span className="ml-3 text-gray-300 text-sm">
                                {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-gray-700">
                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 px-4 rounded-lg transition-colors"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors"
                    onClick={handleApply}
                    disabled={tempCustomMode && tempSelectedMetrics.length === 0}
                  >
                    Apply Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}