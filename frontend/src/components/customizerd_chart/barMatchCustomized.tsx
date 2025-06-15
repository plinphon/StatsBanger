import { useState } from 'react';
import { ALL_STAT_CATEGORIES, STAT_CATEGORY_LABELS } from '../../utils/rawMatchStats';

interface ChartCustomizerProps {
  currentMetric: string;
  currentBarLimit: number;
  onMetricChange: (metric: string) => void;
  onBarLimitChange: (limit: number) => void;
  buttonClassName?: string;
  buttonText?: string;
  onApply?: () => void;
}

export function PlayerMatchBarCustomizer({ 
  currentMetric,
  currentBarLimit,
  onMetricChange,
  onBarLimitChange,
  buttonClassName = "bg-gray-800/90 hover:bg-gray-700/90 text-gray-200 hover:text-white px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200 text-sm font-medium backdrop-blur-sm",
  buttonText = "Customize Chart",
  onApply
}: ChartCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempMetric, setTempMetric] = useState(currentMetric);
  const [tempBarLimit, setTempBarLimit] = useState(currentBarLimit);

  const handleOpen = () => {
    setTempMetric(currentMetric);
    setTempBarLimit(currentBarLimit);
    setIsOpen(true);
  };

  const handleApply = () => {
    onMetricChange(tempMetric);
    onBarLimitChange(tempBarLimit);
    setIsOpen(false);
    onApply?.();
  };

  const handleCancel = () => {
    setTempMetric(currentMetric);
    setTempBarLimit(currentBarLimit);
    setIsOpen(false);
  };

  // Format metric names
  const formatMetricName = (metric: string) => {
    return metric
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
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
                <div className="space-y-6">
                  {/* Metric Selection */}
                  <div>
                    <h4 className="text-gray-300 text-sm font-medium mb-4">Select Metric</h4>
                    <div className="space-y-4">
                      {Object.entries(ALL_STAT_CATEGORIES).map(([category, metrics]) => (
                        <div key={category}>
                          <div className="flex items-center space-x-2 mb-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: STAT_CATEGORY_LABELS[category as keyof typeof STAT_CATEGORY_LABELS]?.color || '#6B7280' }}
                            />
                            <h5 className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                              {STAT_CATEGORY_LABELS[category as keyof typeof STAT_CATEGORY_LABELS]?.name || category}
                            </h5>
                          </div>
                          <div className="grid grid-cols-1 gap-2 ml-5">
                            {metrics.map((metric) => (
                              <button
                                key={metric}
                                onClick={() => setTempMetric(metric)}
                                className={`text-left p-3 rounded-lg border transition-all duration-200 text-sm ${
                                  tempMetric === metric
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{formatMetricName(metric)}</span>
                                  {tempMetric === metric && (
                                    <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bar Limit Selection */}
                  <div>
                    <h4 className="text-gray-300 text-sm font-medium mb-4">Number of Players to Show</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <label className="text-gray-400 text-sm min-w-0 flex-shrink-0">
                          Limit:
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="50"
                          value={tempBarLimit}
                          onChange={(e) => setTempBarLimit(Number(e.target.value))}
                          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="text-gray-300 text-sm font-semibold min-w-0 flex-shrink-0">
                          {tempBarLimit}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {[10, 15, 20, 25].map((limit) => (
                          <button
                            key={limit}
                            onClick={() => setTempBarLimit(limit)}
                            className={`px-3 py-1 rounded text-xs transition-colors ${
                              tempBarLimit === limit
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {limit}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
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