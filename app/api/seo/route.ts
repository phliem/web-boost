import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

interface ToolPattern {
  name: string;
  pattern: RegExp;
}

interface ToolPatterns {
  [key: string]: ToolPattern[];
}

// Tool patterns for detection
const toolPatterns: ToolPatterns = {
  analytics: [
    { name: 'Google Analytics', pattern: /(ga\.js|analytics\.js|gtag\.js|google-analytics\.com)/i },
    { name: 'Google Tag Manager', pattern: /googletagmanager\.com/i },
    { name: 'Mixpanel', pattern: /mixpanel\.com/i },
    { name: 'Amplitude', pattern: /amplitude\.com/i },
    { name: 'Hotjar', pattern: /hotjar\.com/i },
    { name: 'Heap Analytics', pattern: /heap\.com/i },
    { name: 'Pendo', pattern: /pendo\.io/i },
    { name: 'Segment', pattern: /segment\.com/i },
    { name: 'Matomo', pattern: /matomo\.org/i },
    { name: 'Plausible Analytics', pattern: /plausible\.io/i },
  ],
  optimization: [
    { name: 'Optimizely', pattern: /optimizely\.com/i },
    { name: 'VWO', pattern: /vwo\.com/i },
    { name: 'AB Tasty', pattern: /abtasty\.com/i },
    { name: 'Convert', pattern: /convert\.com/i },
    { name: 'Kameleoon', pattern: /kameleoon\.com/i },
  ],
  monitoring: [
    { name: 'Sentry', pattern: /sentry\.io/i },
    { name: 'Datadog', pattern: /datadog\.com/i },
    { name: 'New Relic', pattern: /newrelic\.com/i },
    { name: 'LogRocket', pattern: /logrocket\.com/i },
    { name: 'FullStory', pattern: /fullstory\.com/i },
    { name: 'Inspectlet', pattern: /inspectlet\.com/i },
    { name: 'Snowplow', pattern: /snowplow\.com/i },
    { name: 'Raygun', pattern: /raygun\.com/i },
    { name: 'Rollbar', pattern: /rollbar\.com/i },
  ],
  marketing: [
    { name: 'HubSpot', pattern: /hubspot\.com/i },
    { name: 'Marketo', pattern: /marketo\.com/i },
    { name: 'Pardot', pattern: /pardot\.com/i },
    { name: 'Salesforce', pattern: /salesforce\.com/i },
    { name: 'Mailchimp', pattern: /mailchimp\.com/i },
  ],
  chat: [
    { name: 'Intercom', pattern: /intercom\.com/i },
    { name: 'Drift', pattern: /drift\.com/i },
    { name: 'Zendesk', pattern: /zendesk\.com/i },
    { name: 'Freshchat', pattern: /freshchat\.com/i },
    { name: 'Tawk.to', pattern: /tawk\.to/i },
  ],
  cms: [
    { name: 'WordPress', pattern: /(wp-content|wp-includes|wordpress\.org|wordpress\.com)/i },
    { name: 'Drupal', pattern: /drupal\.org/i },
    { name: 'Joomla', pattern: /joomla\.org/i },
    { name: 'Wix', pattern: /wix\.com/i },
    { name: 'Squarespace', pattern: /squarespace\.com/i },
    { name: 'Shopify', pattern: /shopify\.com/i },
    { name: 'Magento', pattern: /magento\.com/i },
    { name: 'Webflow', pattern: /webflow\.com/i },
    { name: 'Ghost', pattern: /ghost\.org/i },
    { name: 'Contentful', pattern: /contentful\.com/i },
  ],
  frameworks: [
    { name: 'React', pattern: /(react\.development\.js|react\.production\.min\.js|react-dom)/i },
    { name: 'Vue.js', pattern: /(vue\.js|vue\.min\.js)/i },
    { name: 'Angular', pattern: /(angular\.js|angular\.min\.js)/i },
    { name: 'jQuery', pattern: /(jquery\.js|jquery\.min\.js)/i },
    { name: 'Next.js', pattern: /next\.js/i },
    { name: 'Nuxt.js', pattern: /nuxt\.js/i },
    { name: 'Gatsby', pattern: /gatsby\.js/i },
    { name: 'Svelte', pattern: /svelte\.js/i },
    { name: 'Ember.js', pattern: /ember\.js/i },
    { name: 'Backbone.js', pattern: /backbone\.js/i },
  ],
  cdns: [
    { name: 'Cloudflare', pattern: /(cloudflare\.com|cf-cdn)/i },
    { name: 'Akamai', pattern: /(akamaihd\.net|akamaized\.net)/i },
    { name: 'Fastly', pattern: /fastly\.net/i },
    { name: 'AWS CloudFront', pattern: /cloudfront\.net/i },
    { name: 'BunnyCDN', pattern: /bunnycdn\.com/i },
    { name: 'KeyCDN', pattern: /keycdn\.com/i },
    { name: 'StackPath', pattern: /stackpath\.com/i },
    { name: 'Limelight', pattern: /limelight\.com/i },
    { name: 'EdgeCast', pattern: /edgecast\.com/i },
    { name: 'CDN77', pattern: /cdn77\.com/i },
  ],
  payments: [
    { name: 'Stripe', pattern: /(stripe\.com|stripe\.js)/i },
    { name: 'PayPal', pattern: /(paypal\.com|paypalobjects\.com)/i },
    { name: 'Square', pattern: /(squareup\.com|square\.js)/i },
    { name: 'Shopify Payments', pattern: /shopify\.com\/payments/i },
    { name: 'Braintree', pattern: /braintree\.com/i },
    { name: 'Authorize.net', pattern: /authorize\.net/i },
    { name: 'Adyen', pattern: /adyen\.com/i },
    { name: 'Klarna', pattern: /klarna\.com/i },
    { name: 'Afterpay', pattern: /afterpay\.com/i },
    { name: 'Affirm', pattern: /affirm\.com/i },
  ],
  security: [
    { name: 'Cloudflare Security', pattern: /(cloudflare\.com\/security|cf-security)/i },
    { name: 'reCAPTCHA', pattern: /(recaptcha|grecaptcha)/i },
    { name: 'hCaptcha', pattern: /hcaptcha\.com/i },
    { name: 'Imperva', pattern: /imperva\.com/i },
    { name: 'Sucuri', pattern: /sucuri\.net/i },
    { name: 'Akamai Security', pattern: /akamai\.com\/security/i },
    { name: 'Fastly Security', pattern: /fastly\.com\/security/i },
    { name: 'Cloudflare WAF', pattern: /cloudflare\.com\/waf/i },
    { name: 'ModSecurity', pattern: /modsecurity\.org/i },
    { name: 'Wordfence', pattern: /wordfence\.com/i },
  ],
};

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Get page content
    const content = await page.content();
    const title = await page.title();
    const metaDescription = await page.$eval(
      'meta[name="description"]',
      (el: Element) => el.getAttribute('content')
    ).catch(() => null);

    // Get all meta tags
    const metaTags = await page.$$eval('meta', (tags: Element[]) =>
      tags.map((tag: Element) => ({
        name: tag.getAttribute('name') || tag.getAttribute('property'),
        content: tag.getAttribute('content'),
      }))
    );

    // Get all links
    const links = await page.$$eval('a', (anchors: HTMLAnchorElement[]) =>
      anchors.map((a: HTMLAnchorElement) => ({
        href: a.href,
        text: a.textContent?.trim(),
        rel: a.rel,
      }))
    );

    // Get all images
    const images = await page.$$eval('img', (imgs: HTMLImageElement[]) =>
      imgs.map((img: HTMLImageElement) => ({
        src: img.src,
        alt: img.alt,
      }))
    );

    // Detect tools
    const detectedTools: Record<string, string[]> = {
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
    };

    // Check for each tool pattern
    Object.entries(toolPatterns).forEach(([category, patterns]) => {
      patterns.forEach(({ name, pattern }) => {
        if (pattern.test(content)) {
          detectedTools[category].push(name);
        }
      });
    });

    await browser.close();

    return NextResponse.json({
      title,
      metaDescription,
      metaTags,
      links,
      images,
      detectedTools,
    });
  } catch (error) {
    console.error('Error analyzing website:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website' },
      { status: 500 }
    );
  }
} 