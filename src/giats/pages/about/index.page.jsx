/**
 * About Page Component
 * Overview of studio philosophy, capabilities, engineering standards, and process.
 */
/* eslint-disable react/jsx-props-no-spreading */
import Hero from '@src/pages/about/components/hero/Hero';
import Overview from '@src/pages/about/components/overview/Overview';
import Services from '@src/pages/about/components/services/Services';
import Process from '@src/pages/about/components/process/Process';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'XY Combinator — About the Studio',
  description: 'Learn about the design philosophy, rapid engineering cycles, and commitment to high-impact digital products at XY Combinator.',
  keywords: [
    'XY Combinator',
    'About Studio',
    'Engineering Standards',
    'Design Philosophy',
    'Rapid Web Development',
    'Product Engineering',
  ],
};

function Page() {
  return (
    <>
      <CustomHead {...seo} />
      <Hero />
      <Overview />
      <Services />
      <Process />
    </>
  );
}

export default Page;
