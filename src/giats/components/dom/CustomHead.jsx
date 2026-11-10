/**
 * CustomHead Component
 * Manages document head metadata, OpenGraph tags, schema structured data,
 * and security headers for search engines and social platforms.
 * Strictly dash-free titles per branding guidelines.
 */
import NextHead from 'next/head';
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';

const SITE_URL = typeof window !== 'undefined' && window.location.origin 
  ? window.location.origin 
  : 'https://xycombinator.com';
const OG_IMAGE = `${SITE_URL}/og.png`;
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

/**
 * Generates Schema.org JSON-LD structured data for XY Combinator.
 * Adheres to Google search engine Rich Results specifications.
 */
const getSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'XY Combinator',
  alternateName: 'XYC',
  description: 'A design and engineering studio for founders who move fast. We build websites, apps, and e-commerce from first sketch to live users in weeks.',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: OG_IMAGE,
  email: 'contact@xycombinator.com',
  telephone: '+8801700000000',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Dhaka',
    addressLocality: 'Dhaka',
    addressRegion: 'Dhaka Division',
    postalCode: '1200',
    addressCountry: 'BD',
  },
  founder: {
    '@type': 'Person',
    name: 'XY Combinator Founding Team',
  },
  foundingDate: '2026',
  sameAs: [
    'https://x.com/xycombinators',
    'https://www.linkedin.com/company/xy-combinator',
    'https://github.com/XY-COMBINATOR/XY-COMBINATOR',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Design & Engineering Services',
    itemOffered: [
      {
        '@type': 'Service',
        name: 'Website Design & Development',
        description: 'High-performance websites built with React, Next.js, and modern frontend technologies.',
      },
      {
        '@type': 'Service',
        name: 'Mobile App Development',
        description: 'iOS and Android mobile applications with React Native.',
      },
      {
        '@type': 'Service',
        name: 'E-commerce Development',
        description: 'Scalable online stores and digital product platforms.',
      },
      {
        '@type': 'Service',
        name: 'Brand Strategy & Creative Direction',
        description: 'Brand identity, visual systems, and creative direction for startups.',
      },
    ],
  },
  areaServed: ['BD', 'US', 'IN', 'WW'],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+8801700000000',
      contactType: 'customer service',
      email: 'contact@xycombinator.com',
      areaServed: 'BD',
      availableLanguage: ['en', 'bn'],
    },
  ],
});

function CustomHead({ title = '', description, keywords }) {
  // Enforce zero dashes anywhere in the browser tab title
  const cleanTitle = title.replace(/[-—–]/g, ' ').replace(/\s+/g, ' ').trim();
  let displayTitle = cleanTitle || 'XY Combinator Design & Engineering Studio';
  if (cleanTitle && !cleanTitle.toLowerCase().includes('xy combinator')) {
    displayTitle = `${cleanTitle} · XY Combinator`;
  }
  displayTitle = displayTitle.replace(/[-—–]/g, ' ').replace(/\s+/g, ' ').trim();

  const displayDesc = description || 'A design and engineering studio for founders who move fast. Websites, apps, and e-commerce from first sketch to live users in weeks.';

  return (
    <>
      <NextHead>
        {/* Core Metadata */}
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta httpEquiv="x-dns-prefetch-control" content="off" />
        <meta name="robots" content={process.env.NODE_ENV !== 'development' ? 'index,follow' : 'noindex,nofollow'} />
        
        {/* Accessible Viewport (Allows pinch-to-zoom for WCAG 2.1 compliance) */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="keywords" content={keywords && keywords.length ? keywords.join(', ') : keywords} />
        <meta name="author" content="XY Combinator" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no, address=no, email=no" />
        <meta name="geo.region" content="BD" />
        <meta name="geo.placename" content="Dhaka" />
        <meta name="geo.position" content="23.8103;90.4125" />
        <meta name="language" content="English" />

        {/* Canonical Link */}
        <link rel="canonical" href={SITE_URL} />
        <title>{displayTitle}</title>

        {/* OpenGraph Meta Tags */}
        <meta property="og:site_name" content="XY Combinator" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content={OG_IMAGE_WIDTH} />
        <meta property="og:image:height" content={OG_IMAGE_HEIGHT} />
        <meta property="og:image:alt" content="XY Combinator — Design & Engineering Studio" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={displayTitle} />
        <meta property="og:description" content={displayDesc} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:determiner" content="" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@xycombinators" />
        <meta name="twitter:creator" content="@xycombinators" />
        <meta name="twitter:title" content={displayTitle} />
        <meta name="twitter:description" content={displayDesc} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="XY Combinator — Design & Engineering Studio" />

        {/* Icons and Theme Colors */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#28282b" />
        <meta name="apple-mobile-web-app-title" content="XY Combinator" />
        <meta name="application-name" content="XY Combinator" />
        <meta name="msapplication-TileColor" content="#28282b" />
        <meta name="theme-color" content="#28282b" />

        {/* JSON-LD Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSchema()),
          }}
        />
      </NextHead>
      <NextSeo title={displayTitle} description={displayDesc} />
    </>
  );
}

CustomHead.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};

export default CustomHead;
