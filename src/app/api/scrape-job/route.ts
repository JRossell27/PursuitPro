import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // For now, we'll implement a basic scraper
    // In production, you might want to use a service like Scrapfly or implement more robust scraping
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job page');
    }

    const html = await response.text();
    
    // Extract job information based on the site
    let jobData = {
      company: '',
      position: '',
      location: '',
      description: '',
      salary: '',
    };

    if (url.includes('linkedin.com')) {
      jobData = extractLinkedInData(html);
    } else if (url.includes('indeed.com')) {
      jobData = extractIndeedData(html);
    } else if (url.includes('glassdoor.com')) {
      jobData = extractGlassdoorData(html);
    } else {
      // Generic extraction for other sites
      jobData = extractGenericData(html);
    }

    return NextResponse.json(jobData);
  } catch (error) {
    console.error('Error scraping job data:', error);
    return NextResponse.json(
      { error: 'Failed to scrape job data' }, 
      { status: 500 }
    );
  }
}

function extractLinkedInData(html: string) {
  const jobData = {
    company: '',
    position: '',
    location: '',
    description: '',
    salary: '',
  };

  try {
    // Extract company name
    const companyMatch = html.match(/<span[^>]*class="[^"]*topcard__flavor[^"]*"[^>]*>([^<]+)<\/span>/i) ||
                         html.match(/<a[^>]*class="[^"]*topcard__org-name-link[^"]*"[^>]*>([^<]+)<\/a>/i);
    if (companyMatch) {
      jobData.company = companyMatch[1].trim();
    }

    // Extract job title
    const titleMatch = html.match(/<h1[^>]*class="[^"]*topcard__title[^"]*"[^>]*>([^<]+)<\/h1>/i) ||
                      html.match(/<h1[^>]*>([^<]*(?:Engineer|Developer|Manager|Analyst|Designer)[^<]*)<\/h1>/i);
    if (titleMatch) {
      jobData.position = titleMatch[1].trim();
    }

    // Extract location
    const locationMatch = html.match(/<span[^>]*class="[^"]*topcard__flavor--bullet[^"]*"[^>]*>([^<]+)<\/span>/i);
    if (locationMatch) {
      jobData.location = locationMatch[1].trim();
    }

    // Extract description (first 200 chars)
    const descMatch = html.match(/<div[^>]*class="[^"]*description__text[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (descMatch) {
      const cleanDesc = descMatch[1].replace(/<[^>]*>/g, '').trim();
      jobData.description = cleanDesc.substring(0, 200) + (cleanDesc.length > 200 ? '...' : '');
    }
  } catch (error) {
    console.error('Error extracting LinkedIn data:', error);
  }

  return jobData;
}

function extractIndeedData(html: string) {
  const jobData = {
    company: '',
    position: '',
    location: '',
    description: '',
    salary: '',
  };

  try {
    // Extract company name
    const companyMatch = html.match(/data-testid="inlineHeader-companyName"[^>]*>([^<]+)</i) ||
                         html.match(/<span[^>]*class="[^"]*companyName[^"]*"[^>]*>([^<]+)<\/span>/i);
    if (companyMatch) {
      jobData.company = companyMatch[1].trim();
    }

    // Extract job title
    const titleMatch = html.match(/<h1[^>]*class="[^"]*jobsearch-JobInfoHeader-title[^"]*"[^>]*>([^<]+)<\/h1>/i) ||
                      html.match(/data-testid="jobsearch-JobInfoHeader-title"[^>]*>([^<]+)</i);
    if (titleMatch) {
      jobData.position = titleMatch[1].trim();
    }

    // Extract location
    const locationMatch = html.match(/data-testid="job-location"[^>]*>([^<]+)</i);
    if (locationMatch) {
      jobData.location = locationMatch[1].trim();
    }

    // Extract salary
    const salaryMatch = html.match(/data-testid="salaryInfoAndJobType"[^>]*>([^<]*\$[^<]+)/i);
    if (salaryMatch) {
      jobData.salary = salaryMatch[1].trim();
    }
  } catch (error) {
    console.error('Error extracting Indeed data:', error);
  }

  return jobData;
}

function extractGlassdoorData(html: string) {
  const jobData = {
    company: '',
    position: '',
    location: '',
    description: '',
    salary: '',
  };

  try {
    // Basic Glassdoor extraction
    const companyMatch = html.match(/<div[^>]*class="[^"]*employer[^"]*"[^>]*>([^<]+)<\/div>/i);
    if (companyMatch) {
      jobData.company = companyMatch[1].trim();
    }

    const titleMatch = html.match(/<h1[^>]*class="[^"]*jobHeader[^"]*"[^>]*>([^<]+)<\/h1>/i);
    if (titleMatch) {
      jobData.position = titleMatch[1].trim();
    }
  } catch (error) {
    console.error('Error extracting Glassdoor data:', error);
  }

  return jobData;
}

function extractGenericData(html: string) {
  const jobData = {
    company: '',
    position: '',
    location: '',
    description: '',
    salary: '',
  };

  try {
    // Generic patterns that might work across multiple sites
    const titleMatch = html.match(/<title>([^<]*(?:Engineer|Developer|Manager|Analyst|Designer|Jobs?)[^<]*)<\/title>/i);
    if (titleMatch) {
      const title = titleMatch[1].trim();
      // Try to extract position from title
      const positionMatch = title.match(/(.*?)(?:\s*-\s*|\s*at\s*|\s*\|\s*)([^-|]+)/i);
      if (positionMatch) {
        jobData.position = positionMatch[1].trim();
        jobData.company = positionMatch[2].trim();
      }
    }

    // Look for salary patterns
    const salaryMatch = html.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?(?:\s*\/?\s*(?:year|yr|annual|hour|hr))?/i);
    if (salaryMatch) {
      jobData.salary = salaryMatch[0];
    }
  } catch (error) {
    console.error('Error extracting generic data:', error);
  }

  return jobData;
} 