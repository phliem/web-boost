interface SEOData {
  title: string;
  metaDescription: string | null;
  metaTags: Array<{
    name: string | null;
    content: string | null;
  }>;
}

interface TabSeoProps {
  seoData: SEOData;
}

export function TabSeo({ seoData }: TabSeoProps) {
  return (
    <div className="space-y-8">
      {/* Basic SEO Info */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Basic SEO Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Title</h3>
            <p className="text-gray-600 dark:text-gray-300">{seoData.title}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Meta Description</h3>
            <p className="text-gray-600 dark:text-gray-300">{seoData.metaDescription || 'Not found'}</p>
          </div>
        </div>
      </div>

      {/* Meta Tags */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Meta Tags</h2>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seoData.metaTags.map((tag, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">{tag.name}</p>
                <p className="text-gray-900 dark:text-white">{tag.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
