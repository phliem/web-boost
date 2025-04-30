import { NextResponse } from 'next/server';

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

    return NextResponse.json({
      title,
      description,
      keywords,
      ogImage
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