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
    });
  } catch (error) {
    console.error('Error analyzing website:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website' },
      { status: 500 }
    );
  }
}
