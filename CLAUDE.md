# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (Next.js 15)
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Architecture

This is a Next.js 15 application that provides AI-powered website analysis and reviews using Puppeteer for web scraping.

### Core Structure

**App Router Architecture:**
- `/app` - Next.js App Router pages and components
- `/app/api/seo/route.ts` - Main API endpoint for website analysis using Puppeteer
- `/app/reviews/page.tsx` - Review results page with tabbed interface

**Key Components:**
- **Website Analysis API** (`/api/seo/route.ts`): Uses Puppeteer to scrape websites and analyze SEO, meta tags, links, images, cookies, and detect third-party tools
- **Tool Detection** (`/api/seo/toolPatterns.ts`): Pattern matching for identifying analytics, marketing, CMS, and other web tools
- **Review Interface** (`/reviews/`): Tabbed component system for displaying analysis results

### Component Organization

Components are organized in `_components/` folders:
- `/app/_components/` - Global components (Header, Hero, Footer, etc.)
- `/app/reviews/_components/` - Review-specific tab components (TabSeo, TabTools, etc.)
- Each folder has an `index.ts` for clean imports

### Tech Stack

- **Frontend**: React 19, Next.js 15 with App Router, TypeScript
- **Styling**: Tailwind CSS 4
- **Web Scraping**: Puppeteer for headless browser automation
- **Fonts**: Geist font family with custom CSS variables

### Key Features

1. **Website Analysis**: Puppeteer-based scraping for comprehensive site analysis
2. **Tool Detection**: Regex patterns to identify third-party services and frameworks
3. **Multi-tab Results**: Organized display of SEO, tools, links, images, and cookies
4. **Dark Mode**: Built-in dark/light theme support via Tailwind

### Development Notes

- The app uses Next.js App Router with TypeScript
- Puppeteer runs in headless mode with sandbox disabled for compatibility
- Tool detection patterns in `toolPatterns.ts` cover 10+ categories
- All API routes follow REST conventions with proper error handling