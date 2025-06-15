import { useState } from 'react';
import { SEASON_STAT_COMBINATIONS } from '../../../utils/combo/seasonStatsCombo';

interface SeasonChartCustomizerProps {
  currentCombination: string;
  onCombinationChange: (combination: string) => void;
  buttonClassName?: string;
  buttonText?: string;
  onApply?: () => void;
}

export function PlayerSeasonScatterCustomizer({ 
  currentCombination, 
  onCombinationChange, 
  buttonClassName = "bg-gray-800/90 hover:bg-gray-700/90 text-gray-200 hover:text-white px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200 text-sm font-medium backdrop-blur-sm",
  buttonText = "Customize Chart",
  onApply
}: SeasonChartCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempCombination, setTempCombination] = useState(currentCombination);

  const handleOpen = () => {
    setTempCombination(currentCombination);
    setIsOpen(true);
  };

  const handleApply = () => {
    onCombinationChange(tempCombination);
    setIsOpen(false);
    onApply?.();
  };

  const handleCancel = () => {
    setTempCombination(currentCombination);
    setIsOpen(false);
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
                <h3 className="text-xl font-semibold text-gray-200">Customize Season Chart</h3>
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
                  Choose from predefined season stat combinations that work well together.
                </p>
                
                {/* Stat Combination Selection */}
                <div className="space-y-6">
                  <h4 className="text-gray-300 text-sm font-medium mb-4">Available Season Combinations</h4>
                  
                  {/* Group combinations by category */}
                  {Object.entries(
                    Object.entries(SEASON_STAT_COMBINATIONS).reduce((groups, [key, combo]) => {
                      const category = combo.category || 'other';
                      if (!groups[category]) groups[category] = [];
                      groups[category].push([key, combo]);
                      return groups;
                    }, {} as Record<string, Array<[string, any]>>)
                  ).map(([category, combos]) => (
                    <div key={category} className="space-y-2">
                      <h5 className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3 border-b border-gray-700 pb-1">
                        {category.replace(/_/g, ' ')}
                      </h5>
                      <div className="space-y-2">
                        {combos.map(([key, combo]) => (
                          <button
                            key={key}
                            onClick={() => setTempCombination(key)}
                            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                              tempCombination === key
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{combo.name}</div>
                                <div className="text-xs opacity-75 mt-1">{combo.description}</div>
                              </div>
                              {tempCombination === key && (
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