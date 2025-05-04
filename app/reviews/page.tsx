'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface SEOData {
  title: string;
  metaDescription: string | null;
  metaTags: Array<{
    name: string | null;
    content: string | null;
  }>;
  links: Array<{
    href: string;
    text: string | null;
    rel: string;
  }>;
  images: Array<{
    src: string;
    alt: string;
  }>;
  detectedTools: {
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
  };
  loading: boolean;
  error?: string;
}

export default function ReviewsPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const [seoData, setSeoData] = useState<SEOData>({
    title: '',
    metaDescription: null,
    metaTags: [],
    links: [],
    images: [],
    detectedTools: {
      analytics: [],
      optimization: [],
      monitoring: [],
      marketing: [],
      chat: [],
      cms: [],
      frameworks: [],
      cdns: [],
      payments: [],
      security: [],
    },
    loading: true
  });

  useEffect(() => {
    const fetchSEOData = async () => {
      if (!url) {
        setSeoData(prev => ({ ...prev, loading: false, error: 'No URL provided' }));
        return;
      }

      try {
        const response = await fetch('/api/seo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });
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

            {/* Detected Tools */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Detected Tools</h2>
              <div className="space-y-6">
                {Object.entries(seoData.detectedTools).map(([category, tools]) => (
                  tools.length > 0 && (
                    <div key={category} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {tools.map((tool, index) => (
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

            {/* Links */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Links</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {seoData.links.map((link, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {link.text || link.href}
                      </a>
                      {link.rel && (
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          ({link.rel})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Images</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {seoData.images.map((image, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="relative aspect-video mb-2">
                        <Image
                          src={image.src}
                          alt={image.alt || 'Image'}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {image.alt || 'No alt text'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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