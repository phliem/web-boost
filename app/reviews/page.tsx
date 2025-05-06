'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Footer } from '../_components';
import { TabNavigation, SEOTab, ToolsTab, LinksTab, ImagesTab, CookiesTab } from './_components';

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
  cookies: Array<{
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: string;
    secure: boolean;
    httpOnly: boolean;
    sameSite: string;
  }>;
  loading: boolean;
  error?: string;
}

export default function ReviewsPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const [activeTab, setActiveTab] = useState('seo');
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
    cookies: [],
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

  const tabs = [
    { id: 'seo', label: 'SEO' },
    { id: 'tools', label: 'Detected Tools' },
    { id: 'links', label: 'Links' },
    { id: 'images', label: 'Images' },
    { id: 'cookies', label: 'Cookies' },
  ];

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
      <div className="container mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            SEO Analysis for {url}
          </h1>

          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="space-y-8">
            {activeTab === 'seo' && <SEOTab seoData={seoData} />}
            {activeTab === 'tools' && <ToolsTab detectedTools={seoData.detectedTools} />}
            {activeTab === 'links' && <LinksTab links={seoData.links} />}
            {activeTab === 'images' && <ImagesTab images={seoData.images} />}
            {activeTab === 'cookies' && <CookiesTab cookies={seoData.cookies} />}
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
      <Footer />
    </div>
  );
} 