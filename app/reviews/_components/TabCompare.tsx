interface ComparisonData {
  url: string;
  totalTime: number;
  comparison: {
    puppeteer: {
      success: boolean;
      data: any;
      features: string[];
    };
    playwright: {
      success: boolean;
      data: any;
      features: string[];
    };
  };
  recommendations: {
    usePlaywright: string[];
    usePuppeteer: string[];
  };
}

interface TabCompareProps {
  comparisonData: ComparisonData | null;
  loading: boolean;
  error?: string;
  onRunComparison: () => void;
}

export function TabCompare({ comparisonData, loading, error, onRunComparison }: TabCompareProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Running comparison between Puppeteer and Playwright...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Comparison Failed</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
        <button
          onClick={onRunComparison}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">⚖️</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Engine Comparison</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Compare Puppeteer vs Playwright performance and capabilities for this website.
        </p>
        <button
          onClick={onRunComparison}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Run Comparison
        </button>
      </div>
    );
  }

  const { comparison, recommendations, totalTime } = comparisonData;

  return (
    <div className="space-y-8">
      {/* Performance Overview */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalTime}ms</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Analysis Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {comparison.puppeteer.success ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Puppeteer Status</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {comparison.playwright.success ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Playwright Status</div>
          </div>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Puppeteer Results */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Puppeteer</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Features</h4>
              <ul className="space-y-1">
                {comparison.puppeteer.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {comparison.puppeteer.success && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Data Points</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Meta Tags:</span>
                    <span className="ml-1 font-medium">{comparison.puppeteer.data.metaTags?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Links:</span>
                    <span className="ml-1 font-medium">{comparison.puppeteer.data.links?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Images:</span>
                    <span className="ml-1 font-medium">{comparison.puppeteer.data.images?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Colors:</span>
                    <span className="ml-1 font-medium">{comparison.puppeteer.data.colors?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Fonts:</span>
                    <span className="ml-1 font-medium">{comparison.puppeteer.data.fonts?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Cookies:</span>
                    <span className="ml-1 font-medium">{comparison.puppeteer.data.cookies?.length || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Playwright Results */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Playwright</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Features</h4>
              <ul className="space-y-1">
                {comparison.playwright.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {comparison.playwright.success && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Data Points</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Meta Tags:</span>
                    <span className="ml-1 font-medium">{comparison.playwright.data.metaTags?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Links:</span>
                    <span className="ml-1 font-medium">{comparison.playwright.data.links?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Images:</span>
                    <span className="ml-1 font-medium">{comparison.playwright.data.images?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Colors:</span>
                    <span className="ml-1 font-medium">{comparison.playwright.data.colors?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Fonts:</span>
                    <span className="ml-1 font-medium">{comparison.playwright.data.fonts?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Cookies:</span>
                    <span className="ml-1 font-medium">{comparison.playwright.data.cookies?.length || 0}</span>
                  </div>
                </div>

                {/* Playwright-specific data */}
                {comparison.playwright.data.extractedData && (
                  <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Advanced Extractions</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Emails:</span>
                        <span className="ml-1 font-medium">{comparison.playwright.data.extractedData.contactInfo?.emails?.length || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phones:</span>
                        <span className="ml-1 font-medium">{comparison.playwright.data.extractedData.contactInfo?.phones?.length || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Forms:</span>
                        <span className="ml-1 font-medium">{comparison.playwright.data.forms?.length || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Headings:</span>
                        <span className="ml-1 font-medium">{comparison.playwright.data.headings?.length || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Word Count:</span>
                        <span className="ml-1 font-medium">{comparison.playwright.data.extractedData.contentAnalysis?.wordCount || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Content Score:</span>
                        <span className="ml-1 font-medium">{comparison.playwright.data.extractedData.contentAnalysis?.contentScore || 0}/100</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            When to use Playwright
          </h3>
          <ul className="space-y-2">
            {recommendations.usePlaywright.map((rec, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            When to use Puppeteer
          </h3>
          <ul className="space-y-2">
            {recommendations.usePuppeteer.map((rec, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                <span className="text-orange-500 mr-2 mt-0.5">✓</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onRunComparison}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Run Again
        </button>
      </div>
    </div>
  );
}