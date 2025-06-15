import { useState } from 'react';

// Position-specific metrics for the radar chart
const topicF = ["goals", "penaltyGoals", "goalConversionPercentage", "totalShots", "keyPasses", "accurateFinalThirdPasses", "successfulDribbles", "aerialDuelsWon", "possessionLost"];
const topicM = ["accuratePassesPercentage", "accurateLongBalls", "keyPasses", "totalShots", "successfulDribbles", "totalDuelsWon", "tackles", "interceptions"];
const topicD = ["tackles", "interceptions", "clearances", "groundDuelsWonPercentage", "aerialDuelsWonPercentage", "fouls", "accuratePassesPercentage", "accurateLongBalls", "keyPasses"];
const topicG = ["saves", "goalsConcededOutsideTheBox", "goalsConcededInsideTheBox", "highClaims", "punches", "runsOut", "accuratePassesPercentage", "accurateLongBalls"];

// Stat categories for dynamic radar chart
const STAT_CATEGORIES = {
  attacking: {
    name: "Attacking",
    stats: ["goals", "assists", "expectedGoals", "bigChancesCreated", "shotsOnTarget", "totalShots"]
  },
  defending: {
    name: "Defending", 
    stats: ["tackles", "interceptions", "blockedShots", "aerialDuelsWon", "cleanSheet"]
  },
  passing: {
    name: "Passing",
    stats: ["accuratePassesPercentage", "keyPasses", "accurateLongBalls", "passToAssist", "totalPasses"]
  },
  dribbling: {
    name: "Dribbling",
    stats: ["successfulDribbles", "accurateCrosses", "dribbledPast"]
  },
  goalkeeping: {
    name: "Goalkeeping",
    stats: ["saves", "goalsConceded", "penaltySave", "savedShotsFromInsideTheBox", "cleanSheet"]
  }
};

// Built-in presets for quick selection
const BUILT_IN_PRESETS = {
  "attacking": {
    name: "Attacking Focus",
    metrics: ["goals", "assists", "expectedGoals", "totalShots", "shotsOnTarget", "keyPasses"]
  },
  "defending": {
    name: "Defensive Profile", 
    metrics: ["tackles", "interceptions", "clearances", "aerialDuelsWon", "blockedShots", "cleanSheet"]
  },
  "playmaking": {
    name: "Playmaker Profile",
    metrics: ["keyPasses", "accuratePassesPercentage", "accurateLongBalls", "assists", "passToAssist", "totalPasses"]
  },
  "physical": {
    name: "Physical Dominance",
    metrics: ["aerialDuelsWon", "totalDuelsWon", "successfulDribbles", "dribbledPast", "possessionLost", "fouls"]
  }
};

// All available metrics organized by category
const ALL_METRICS = {
  attacking: ["goals", "assists", "expectedGoals", "bigChancesCreated", "shotsOnTarget", "totalShots", "goalConversionPercentage", "penaltyGoals"],
  defending: ["tackles", "interceptions", "blockedShots", "aerialDuelsWon", "cleanSheet", "clearances", "groundDuelsWonPercentage", "aerialDuelsWonPercentage"],
  passing: ["accuratePassesPercentage", "keyPasses", "accurateLongBalls", "passToAssist", "totalPasses", "accurateFinalThirdPasses"],
  dribbling: ["successfulDribbles", "accurateCrosses", "dribbledPast", "possessionLost"],
  goalkeeping: ["saves", "goalsConceded", "penaltySave", "savedShotsFromInsideTheBox", "goalsConcededOutsideTheBox", "goalsConcededInsideTheBox", "highClaims", "punches", "runsOut"],
  performance: ["minutesPlayed", "appearances", "yellowCards", "redCards", "fouls", "totalDuelsWon"]
};

interface RadarChartCustomizerProps {
  currentCategory: string;
  customMode: boolean;
  selectedMetrics: string[];
  position: string;
  onCategoryChange: (category: string) => void;
  onCustomModeChange: (customMode: boolean) => void;
  onSelectedMetricsChange: (metrics: string[]) => void;
  buttonClassName?: string;
  buttonText?: string;
  onApply?: () => void;
}

export function PlayerRadarChartCustomizer({ 
  currentCategory,
  customMode,
  selectedMetrics,
  position,
  onCategoryChange,
  onCustomModeChange,
  onSelectedMetricsChange,
  buttonClassName = "bg-gray-800/90 hover:bg-gray-700/90 text-gray-200 hover:text-white px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200 text-sm font-medium backdrop-blur-sm",
  buttonText = "Customize Chart",
  onApply
}: RadarChartCustomizerProps) {
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
    const preset = BUILT_IN_PRESETS[presetKey as keyof typeof BUILT_IN_PRESETS];
    if (preset) {
      setTempSelectedMetrics(preset.metrics);
      setTempCustomMode(true);
    }
  };

  const getPositionDefaultMetrics = () => {
    switch (position) {
      case "F": return topicF;
      case "M": return topicM;
      case "D": return topicD;
      default: return topicG;
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
                <h3 className="text-xl font-semibold text-gray-200">Customize Chart</h3>
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
                  Select the metrics you want to display on your radar chart.
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
                      <div className="text-xs opacity-75 mt-1">Use position-based or category presets</div>
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
                      <div className="text-xs opacity-75 mt-1">Choose specific metrics manually</div>
                    </button>
                  </div>
                </div>

                {!tempCustomMode ? (
                  /* Preset Categories */
                  <div className="space-y-3">
                    <h4 className="text-gray-300 text-sm font-medium mb-4">Select Category</h4>
                    
                    {/* Position Default */}
                    <button
                      onClick={() => setTempCategory("position")}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        tempCategory === "position"
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="font-medium text-sm">Position Default ({position})</div>
                      <div className="text-xs opacity-75 mt-1">
                        {getPositionDefaultMetrics().length} metrics optimized for {position} position
                      </div>
                    </button>

                    {/* Category Options */}
                    {Object.entries(STAT_CATEGORIES).map(([key, category]) => (
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
                        {Object.entries(BUILT_IN_PRESETS).map(([key, preset]) => (
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
                    
                    {Object.entries(ALL_METRICS).map(([category, metrics]) => (
                      <div key={category} className="space-y-2">
                        <h5 className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                          {STAT_CATEGORIES[category as keyof typeof STAT_CATEGORIES]?.name || category}
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