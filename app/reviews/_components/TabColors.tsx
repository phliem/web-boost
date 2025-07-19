type TabColorsProps = {
  colors: string[];
  fonts: string[];
};

function getColorName(color: string): string {
  const colorNames: Record<string, string> = {
    '#ffffff': 'White',
    '#000000': 'Black',
    '#ff0000': 'Red',
    '#00ff00': 'Green',
    '#0000ff': 'Blue',
    '#ffff00': 'Yellow',
    '#ff00ff': 'Magenta',
    '#00ffff': 'Cyan',
    '#808080': 'Gray',
    '#ffa500': 'Orange',
    '#800080': 'Purple',
    '#008000': 'Dark Green',
    '#000080': 'Navy',
    '#800000': 'Maroon',
    '#808000': 'Olive',
    '#008080': 'Teal',
    '#c0c0c0': 'Silver',
    '#f0f0f0': 'Light Gray',
  };
  
  return colorNames[color.toLowerCase()] || color;
}

function ColorSwatch({ color }: { color: string }) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
      <div
        className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-500 shadow-sm"
        style={{ backgroundColor: color }}
        title={color}
      />
      <div className="flex-1">
        <div className="font-mono text-sm font-medium text-gray-900 dark:text-white">
          {color}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {getColorName(color)}
        </div>
      </div>
    </div>
  );
}

function FontSwatch({ font }: { font: string }) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
      <div className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-500 shadow-sm bg-white dark:bg-gray-600 flex items-center justify-center">
        <span className="text-lg font-medium text-gray-700 dark:text-gray-300" style={{ fontFamily: font }}>
          Aa
        </span>
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {font}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400" style={{ fontFamily: font }}>
          The quick brown fox jumps
        </div>
      </div>
    </div>
  );
}

export function TabColors({ colors, fonts }: TabColorsProps) {
  return (
    <div className="space-y-8">
      {/* Colors Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          CSS Colors
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          All colors found in the website&apos;s stylesheets and inline styles ({colors.length} total)
        </p>

        {colors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colors.map((color, index) => (
              <ColorSwatch key={index} color={color} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">🎨</div>
            <p className="text-gray-600 dark:text-gray-300">No colors found in the website&apos;s CSS</p>
          </div>
        )}
      </div>

      {/* Fonts Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Typography
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Font families used on the website ({fonts.length} total)
        </p>

        {fonts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fonts.map((font, index) => (
              <FontSwatch key={index} font={font} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">📝</div>
            <p className="text-gray-600 dark:text-gray-300">No custom fonts found on the website</p>
          </div>
        )}
      </div>
    </div>
  );
}