import { Page } from 'playwright';

export interface ExtractedData {
  contactInfo: ContactInfo;
  socialMedia: SocialMediaLinks;
  businessInfo: BusinessInfo;
  technicalDetails: TechnicalDetails;
  contentAnalysis: ContentAnalysis;
}

interface ContactInfo {
  emails: string[];
  phones: string[];
  addresses: string[];
}

interface SocialMediaLinks {
  facebook: string[];
  twitter: string[];
  linkedin: string[];
  instagram: string[];
  youtube: string[];
  github: string[];
}

interface BusinessInfo {
  companyName: string | null;
  description: string | null;
  industry: string | null;
  location: string | null;
}

interface TechnicalDetails {
  charset: string | null;
  viewport: string | null;
  robots: string | null;
  language: string | null;
  canonical: string | null;
}

interface ContentAnalysis {
  wordCount: number;
  readingTime: number;
  contentScore: number;
  headingStructure: HeadingStructure;
}

interface HeadingStructure {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  hasProperStructure: boolean;
}

export async function extractContactInfo(page: Page): Promise<ContactInfo> {
  return await page.evaluate(() => {
    const text = document.body.innerText;
    
    // Email regex
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = Array.from(new Set(text.match(emailRegex) || []));
    
    // Phone regex (various formats)
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phones = Array.from(new Set(text.match(phoneRegex) || []));
    
    // Address patterns (basic)
    const addressRegex = /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Circle|Cir)/gi;
    const addresses = Array.from(new Set(text.match(addressRegex) || []));
    
    return { emails, phones, addresses };
  });
}

export async function extractSocialMedia(page: Page): Promise<SocialMediaLinks> {
  return await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href]'));
    const socialMedia: SocialMediaLinks = {
      facebook: [],
      twitter: [],
      linkedin: [],
      instagram: [],
      youtube: [],
      github: []
    };
    
    links.forEach(link => {
      const href = link.getAttribute('href') || '';
      
      if (href.includes('facebook.com')) {
        socialMedia.facebook.push(href);
      } else if (href.includes('twitter.com') || href.includes('x.com')) {
        socialMedia.twitter.push(href);
      } else if (href.includes('linkedin.com')) {
        socialMedia.linkedin.push(href);
      } else if (href.includes('instagram.com')) {
        socialMedia.instagram.push(href);
      } else if (href.includes('youtube.com')) {
        socialMedia.youtube.push(href);
      } else if (href.includes('github.com')) {
        socialMedia.github.push(href);
      }
    });
    
    // Remove duplicates
    Object.keys(socialMedia).forEach(key => {
      socialMedia[key as keyof SocialMediaLinks] = Array.from(new Set(socialMedia[key as keyof SocialMediaLinks]));
    });
    
    return socialMedia;
  });
}

export async function extractBusinessInfo(page: Page): Promise<BusinessInfo> {
  return await page.evaluate(() => {
    // Try to get company name from various meta tags and structured data
    const companyName = 
      document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
      document.querySelector('meta[name="application-name"]')?.getAttribute('content') ||
      document.querySelector('title')?.textContent?.split('|')[0]?.trim() ||
      null;
    
    const description = 
      document.querySelector('meta[name="description"]')?.getAttribute('content') ||
      document.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      null;
    
    // Try to extract industry from meta keywords or content
    const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
    const industry = keywords ? keywords.split(',')[0]?.trim() : null;
    
    // Try to get location from structured data or content
    const locationMeta = document.querySelector('meta[name="geo.region"]')?.getAttribute('content') ||
                        document.querySelector('meta[name="geo.placename"]')?.getAttribute('content') ||
                        null;
    
    return {
      companyName,
      description,
      industry,
      location: locationMeta
    };
  });
}

export async function extractTechnicalDetails(page: Page): Promise<TechnicalDetails> {
  return await page.evaluate(() => {
    return {
      charset: document.querySelector('meta[charset]')?.getAttribute('charset') || null,
      viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || null,
      robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') || null,
      language: document.documentElement.getAttribute('lang') || null,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null
    };
  });
}

export async function analyzeContent(page: Page): Promise<ContentAnalysis> {
  return await page.evaluate(() => {
    const textContent = document.body.innerText || '';
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Estimate reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);
    
    // Simple content score based on word count and structure
    const hasH1 = document.querySelector('h1') !== null;
    const hasH2 = document.querySelectorAll('h2').length > 0;
    const hasImages = document.querySelectorAll('img').length > 0;
    const hasLinks = document.querySelectorAll('a[href]').length > 2;
    
    let contentScore = 0;
    if (wordCount > 300) contentScore += 25;
    if (wordCount > 1000) contentScore += 25;
    if (hasH1) contentScore += 20;
    if (hasH2) contentScore += 15;
    if (hasImages) contentScore += 10;
    if (hasLinks) contentScore += 5;
    
    // Analyze heading structure
    const h1Count = document.querySelectorAll('h1').length;
    const h2Count = document.querySelectorAll('h2').length;
    const h3Count = document.querySelectorAll('h3').length;
    
    const hasProperStructure = h1Count === 1 && h2Count > 0;
    
    return {
      wordCount,
      readingTime,
      contentScore: Math.min(contentScore, 100),
      headingStructure: {
        h1Count,
        h2Count,
        h3Count,
        hasProperStructure
      }
    };
  });
}

export async function extractAllData(page: Page): Promise<ExtractedData> {
  const [contactInfo, socialMedia, businessInfo, technicalDetails, contentAnalysis] = await Promise.all([
    extractContactInfo(page),
    extractSocialMedia(page),
    extractBusinessInfo(page),
    extractTechnicalDetails(page),
    analyzeContent(page)
  ]);

  return {
    contactInfo,
    socialMedia,
    businessInfo,
    technicalDetails,
    contentAnalysis
  };
}