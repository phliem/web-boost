import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

import { toolPatterns } from './toolPatterns';

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

    // Get cookies
    const cookies = await page.cookies();
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

    // Take screenshot
    const screenshot = await page.screenshot({
      encoding: 'base64',
      fullPage: true,
      type: 'png'
    });

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
      cookies: formattedCookies,
      screenshot: `data:image/png;base64,${screenshot}`,
      colors,
      fonts,
    });
  } catch (error) {
    console.error('Error analyzing website:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website' },
      { status: 500 }
    );
  }
}
