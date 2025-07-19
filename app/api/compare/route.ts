import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Start both requests in parallel for performance comparison
    const startTime = Date.now();
    
    const [puppeteerResponse, playwrightResponse] = await Promise.all([
      fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/seo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      }),
      fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/playwright`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
    ]);

    const totalTime = Date.now() - startTime;

    const puppeteerData = await puppeteerResponse.json();
    const playwrightData = await playwrightResponse.json();

    return NextResponse.json({
      url,
      totalTime,
      comparison: {
        puppeteer: {
          success: puppeteerResponse.ok,
          data: puppeteerData,
          features: [
            'Basic SEO analysis',
            'Meta tags extraction',
            'Links and images',
            'Color and font extraction',
            'Tool detection',
            'Screenshot capture',
            'Cookie analysis'
          ]
        },
        playwright: {
          success: playwrightResponse.ok,
          data: playwrightData,
          features: [
            'Enhanced SEO analysis',
            'Advanced data extraction',
            'Contact info extraction',
            'Social media detection',
            'Business info analysis',
            'Content analysis',
            'Form detection',
            'Structured data parsing',
            'Performance metrics',
            'Heading structure analysis'
          ]
        }
      },
      recommendations: {
        usePlaywright: [
          'More comprehensive data extraction',
          'Better structured data handling',
          'Enhanced contact and business info extraction',
          'Content quality analysis',
          'Form detection capabilities'
        ],
        usePuppeteer: [
          'Simpler setup and smaller bundle size',
          'More familiar API for basic scraping',
          'Faster for basic operations'
        ]
      }
    });
  } catch (error) {
    console.error('Error comparing engines:', error);
    return NextResponse.json(
      { error: 'Failed to compare engines' },
      { status: 500 }
    );
  }
}