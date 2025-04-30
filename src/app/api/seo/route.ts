import { NextResponse } from 'next/server';

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
}

const TOOL_PATTERNS = [
  // Analytics
  { name: 'Google Analytics', patterns: [/google-analytics/, /ga\.js/, /analytics\.js/, /gtag\.js/], category: 'Analytics' },
  { name: 'Facebook Pixel', patterns: [/facebook\.net\/connect/, /fbq/, /facebook\.com\/tr/], category: 'Analytics' },
  { name: 'Hotjar', patterns: [/hotjar\.com/, /hjid/, /hjSettings/], category: 'Analytics' },
  { name: 'Mixpanel', patterns: [/mixpanel\.com/, /mixpanel\.js/], category: 'Analytics' },
  { name: 'Amplitude', patterns: [/amplitude\.com/, /amplitude\.min\.js/], category: 'Analytics' },

  // Marketing
  { name: 'HubSpot', patterns: [/hubspot\.com/, /hs-scripts/, /hs-analytics/], category: 'Marketing' },
  { name: 'Mailchimp', patterns: [/mailchimp\.com/, /mc-embedded-subscribe-form/], category: 'Marketing' },
  { name: 'Intercom', patterns: [/intercom\.io/, /intercomSettings/], category: 'Marketing' },
  { name: 'Drift', patterns: [/drift\.com/, /drift\.js/], category: 'Marketing' },
  { name: 'Segment', patterns: [/segment\.com/, /analytics\.js/], category: 'Marketing' },

  // Payment Processors
  { name: 'Stripe', patterns: [/stripe\.com/, /stripe\.js/], category: 'Payments' },
  { name: 'PayPal', patterns: [/paypal\.com/, /paypalobjects\.com/], category: 'Payments' },
  { name: 'Square', patterns: [/squareup\.com/, /square\.js/], category: 'Payments' },
  { name: 'Shopify', patterns: [/shopify\.com/, /shopify\.js/], category: 'Payments' },

  // CMS Platforms
  { name: 'WordPress', patterns: [/wp-content/, /wp-includes/, /wordpress/], category: 'CMS' },
  { name: 'Drupal', patterns: [/drupal\.org/, /drupal\.js/], category: 'CMS' },
  { name: 'Joomla', patterns: [/joomla\.org/, /joomla\.js/], category: 'CMS' },
  { name: 'Wix', patterns: [/wix\.com/, /wix\.js/], category: 'CMS' },

  // JavaScript Frameworks
  { name: 'React', patterns: [/react\.development\.js/, /react\.production\.min\.js/, /react-dom/], category: 'Framework' },
  { name: 'Vue.js', patterns: [/vue\.js/, /vue\.min\.js/], category: 'Framework' },
  { name: 'Angular', patterns: [/angular\.js/, /angular\.min\.js/], category: 'Framework' },
  { name: 'jQuery', patterns: [/jquery\.js/, /jquery\.min\.js/], category: 'Framework' },

  // CDNs
  { name: 'Cloudflare', patterns: [/cloudflare\.com/, /cf-cdn/], category: 'CDN' },
  { name: 'Akamai', patterns: [/akamaihd\.net/, /akamaized\.net/], category: 'CDN' },
  { name: 'Fastly', patterns: [/fastly\.net/, /fastly\.js/], category: 'CDN' },

  // Security
  { name: 'Cloudflare Security', patterns: [/cloudflare\.com\/security/, /cf-security/], category: 'Security' },
  { name: 'reCAPTCHA', patterns: [/recaptcha/, /grecaptcha/], category: 'Security' },
  { name: 'hCaptcha', patterns: [/hcaptcha\.com/, /hcaptcha\.js/], category: 'Security' },

  // Performance
  { name: 'Google PageSpeed', patterns: [/pagespeed/, /psi/], category: 'Performance' },
  { name: 'Lighthouse', patterns: [/lighthouse/, /lh3\.googleusercontent\.com/], category: 'Performance' }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch the webpage content
    const response = await fetch(url);
    const html = await response.text();

    // Extract SEO information
    const title = extractTitle(html);
    const description = extractDescription(html);
    const keywords = extractKeywords(html);
    const ogImage = extractOGImage(html);
    const tools = detectTools(html);

    return NextResponse.json({
      title,
      description,
      keywords,
      ogImage,
      tools
    });
  } catch (error) {
    console.error('Error in SEO analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch or analyze the website' },
      { status: 500 }
    );
  }
}

function extractTitle(html: string): string {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : '';
}

function extractDescription(html: string): string {
  const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
  return descriptionMatch ? descriptionMatch[1].trim() : '';
}

function extractKeywords(html: string): string[] {
  const keywordsMatch = html.match(/<meta[^>]*name="keywords"[^>]*content="([^"]*)"[^>]*>/i);
  if (!keywordsMatch) return [];
  
  return keywordsMatch[1]
    .split(',')
    .map(keyword => keyword.trim())
    .filter(keyword => keyword.length > 0);
}

function extractOGImage(html: string): string | undefined {
  const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i);
  return ogImageMatch ? ogImageMatch[1].trim() : undefined;
}

function detectTools(html: string): SEOData['tools'] {
  const detectedTools: SEOData['tools'] = [];

  for (const tool of TOOL_PATTERNS) {
    if (tool.patterns.some(pattern => pattern.test(html))) {
      detectedTools.push({
        name: tool.name,
        category: tool.category,
        confidence: 'high'
      });
    }
  }

  return detectedTools;
} 