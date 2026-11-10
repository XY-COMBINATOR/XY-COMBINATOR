/**
 * CustomHead Component
 * Manages document head metadata, OpenGraph tags, schema structured data,
 * and security headers for search engines and social platforms.
 */
import NextHead from 'next/head';
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';

const SITE_URL = 'https://xycombinator.com';
const OG_IMAGE = `${SITE_URL}/og.png`;

const getSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'XY Combinator',
  description: 'A design & engineering studio helping founders move fast. We build products, brands, and digital experiences that scale.',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: OG_IMAGE,
  email: 'contact@xycombinator.com',
  sameAs: [
    'https://x.com/xycombinators',
    'https://www.linkedin.com/company/xy-combinator',
    'https://github.com/XY-COMBINATOR/XY-COMBINATOR',
  ],
});

function CustomHead({ title = '', description, keywords }) {
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
        <meta name="geo.region" content="US" />

        {/* Canonical Link */}
        <link rel="canonical" href={SITE_URL} />
        <title>{displayTitle}</title>

        {/* OpenGraph Meta Tags */}
        <meta property="og:site_name" content="XY Combinator" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={displayTitle} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={displayTitle} />
        <meta property="og:description" content={displayDesc} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@xycombinators" />
        <meta name="twitter:creator" content="@xycombinators" />
        <meta name="twitter:title" content={displayTitle} />
        <meta name="twitter:description" content={displayDesc} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content={displayTitle} />

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
