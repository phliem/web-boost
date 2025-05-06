interface DetectedTools {
  analytics: string[];
  optimization: string[];
  monitoring: string[];
  marketing: string[];
  chat: string[];
  cms: string[];
  frameworks: string[];
  cdns: string[];
  payments: string[];
  security: string[];
}

interface TabToolsProps {
  detectedTools: DetectedTools;
}

export function TabTools({ detectedTools }: TabToolsProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Detected Tools</h2>
      <div className="space-y-6">
        {Object.entries(detectedTools).map(([category, tools]) => (
          tools.length > 0 && (
            <div key={category} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
