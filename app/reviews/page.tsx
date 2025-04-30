'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  tools: {
    name: string;
    category: string;
    confidence: 'high' | 'medium' | 'low';
  }[];
  loading: boolean;
  error?: string;
}

export default function ReviewsPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const [seoData, setSeoData] = useState<SEOData>({
    title: '',
    description: '',
    keywords: [],
    tools: [],
    loading: true
  });

  useEffect(() => {
    const fetchSEOData = async () => {
      if (!url) {
        setSeoData(prev => ({ ...prev, loading: false, error: 'No URL provided' }));
        return;
      }

      try {
        const response = await fetch(`/api/seo?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch SEO data');
        }
        const data = await response.json();
        setSeoData(prev => ({ ...prev, ...data, loading: false }));
      } catch (error) {
        setSeoData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred'
        }));
      }
    };

    fetchSEOData();
  }, [url]);

  if (seoData.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Analyzing website...</p>
        </div>
      </div>
    );
  }

  if (seoData.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-300">{seoData.error}</p>
          <Link
            href="/"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            SEO Analysis for {url}
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Title</h2>
              <p className="text-gray-600 dark:text-gray-300">{seoData.title}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Description</h2>
              <p className="text-gray-600 dark:text-gray-300">{seoData.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {seoData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Third-Party Tools</h2>
              {seoData.tools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {seoData.tools.map((tool, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white">{tool.name}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{tool.category}</span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tool.confidence === 'high' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : tool.confidence === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {tool.confidence} confidence
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No third-party tools detected.</p>
              )}
            </div>

            {seoData.ogImage && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Open Graph Image</h2>
                <div className="relative w-full aspect-video">
                  <Image
                    src={seoData.ogImage}
                    alt="Open Graph Image"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Analyze Another Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 