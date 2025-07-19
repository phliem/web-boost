import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

import { toolPatterns } from '../seo/toolPatterns';
import { extractAllData } from './dataExtractors';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const browser = await chromium.launch({
      headless: true,
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });

    const page = await context.newPage();
    
    // Navigate and wait for network idle
    await page.goto(url, { waitUntil: 'networkidle' });

    // Get cookies
    const cookies = await context.cookies();
    const formattedCookies = cookies.map(cookie => ({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path,
      expires: cookie.expires ? new Date(cookie.expires * 1000).toISOString() : 'Session',
      secure: cookie.secure,
      httpOnly: cookie.httpOnly,
      sameSite: cookie.sameSite
    }));

    // Get page content
    const content = await page.content();
    const title = await page.title();
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content').catch(() => null);

    // Get all meta tags
    const metaTags = await page.$$eval('meta', (tags) =>
      tags.map((tag) => ({
        name: tag.getAttribute('name') || tag.getAttribute('property'),
        content: tag.getAttribute('content'),
      }))
    );

    // Get all links
    const links = await page.$$eval('a', (anchors) =>
      anchors.map((a) => ({
        href: a.href,
        text: a.textContent?.trim(),
        rel: a.rel,
      }))
    );

    // Get all images
    const images = await page.$$eval('img', (imgs) =>
      imgs.map((img) => ({
        src: img.src,
        alt: img.alt,
      }))
    );

    // Take screenshot
    const screenshot = await page.screenshot({
      fullPage: true,
      type: 'png'
    });
    const screenshotBase64 = screenshot.toString('base64');

    // Extract CSS colors
    const colors = await page.evaluate(() => {
      const colorSet = new Set<string>();
      const colorRegex = /#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)/g;
      
      // Get all stylesheets
      const stylesheets = Array.from(document.styleSheets);
      
      for (const stylesheet of stylesheets) {
        try {
          const rules = Array.from(stylesheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule) {
              const cssText = rule.cssText;
              const matches = cssText.match(colorRegex);
              if (matches) {
                matches.forEach(color => colorSet.add(color.toLowerCase()));
              }
            }
          }
        } catch {
          // Skip cross-origin stylesheets
        }
      }
      
      // Also check inline styles
      const elements = document.querySelectorAll('[style]');
      elements.forEach(el => {
        const style = (el as HTMLElement).style.cssText;
        const matches = style.match(colorRegex);
        if (matches) {
          matches.forEach(color => colorSet.add(color.toLowerCase()));
        }
      });
      
      return Array.from(colorSet).sort();
    });

    // Extract fonts
    const fonts = await page.evaluate(() => {
      const fontSet = new Set<string>();
      
      // Get all stylesheets
      const stylesheets = Array.from(document.styleSheets);
      
      for (const stylesheet of stylesheets) {
        try {
          const rules = Array.from(stylesheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule) {
              const style = rule.style;
              const fontFamily = style.fontFamily;
              if (fontFamily) {
                // Clean up font names by removing quotes and splitting by comma
                fontFamily.split(',').forEach(font => {
                  const cleanFont = font.trim().replace(/['"]/g, '');
                  if (cleanFont && !cleanFont.includes('serif') && !cleanFont.includes('sans-serif') && !cleanFont.includes('monospace') && !cleanFont.includes('cursive') && !cleanFont.includes('fantasy')) {
                    fontSet.add(cleanFont);
                  }
                });
              }
            }
          }
        } catch {
          // Skip cross-origin stylesheets
        }
      }
      
      // Also check computed styles of visible elements
      const elements = document.querySelectorAll('*');
      const elementsToCheck = Array.from(elements).slice(0, 50); // Limit to first 50 elements for performance
      
      elementsToCheck.forEach(el => {
        const computedStyle = window.getComputedStyle(el);
        const fontFamily = computedStyle.fontFamily;
        if (fontFamily) {
          fontFamily.split(',').forEach(font => {
            const cleanFont = font.trim().replace(/['"]/g, '');
            if (cleanFont && !cleanFont.includes('serif') && !cleanFont.includes('sans-serif') && !cleanFont.includes('monospace') && !cleanFont.includes('cursive') && !cleanFont.includes('fantasy')) {
              fontSet.add(cleanFont);
            }
          });
        }
      });
      
      return Array.from(fontSet).sort();
    });

    // Enhanced data extraction - get structured data
    const structuredData = await page.evaluate(() => {
      const jsonLdElements = document.querySelectorAll('script[type="application/ld+json"]');
      const data = [];
      
      for (const element of jsonLdElements) {
        try {
          const parsed = JSON.parse(element.textContent || '');
          data.push(parsed);
        } catch {
          // Skip invalid JSON-LD
        }
      }
      
      return data;
    });

    // Extract form data
    const forms = await page.$$eval('form', (formElements) =>
      formElements.map((form) => ({
        action: form.action,
        method: form.method,
        inputs: Array.from(form.querySelectorAll('input')).map(input => ({
          type: input.type,
          name: input.name,
          placeholder: input.placeholder,
          required: input.required
        }))
      }))
    );

    // Extract headings structure
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (headingElements) =>
      headingElements.map((h) => ({
        level: parseInt(h.tagName.substring(1)),
        text: h.textContent?.trim(),
        id: h.id
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

    // Performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        firstContentfulPaint: performance.getEntriesByType('paint')
          .find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      };
    });

    // Extract advanced data using our custom extractors
    const extractedData = await extractAllData(page);

    await browser.close();

    return NextResponse.json({
      title,
      metaDescription,
      metaTags,
      links,
      images,
      detectedTools,
      cookies: formattedCookies,
      screenshot: `data:image/png;base64,${screenshotBase64}`,
      colors,
      fonts,
      structuredData,
      forms,
      headings,
      performanceMetrics,
      extractedData,
      engine: 'playwright'
    });
  } catch (error) {
    console.error('Error analyzing website with Playwright:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website with Playwright' },
      { status: 500 }
    );
  }
}