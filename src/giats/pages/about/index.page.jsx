/* eslint-disable react/jsx-props-no-spreading */
import Hero from '@src/pages/about/components/hero/Hero';
import Overview from '@src/pages/about/components/overview/Overview';
import Services from '@src/pages/about/components/services/Services';
import Process from '@src/pages/about/components/process/Process';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'XY Combinator — Studio',
  description:
    'XY Combinator is a design and engineering studio for founders who move fast. We build websites, apps and e-commerce, and we stick around through launch.',
  keywords: [
    'XY Combinator',
    'Design Studio',
    'Engineering Studio',
    'Web Development',
    'React',
    'Next.js',
    'React Native',
    'E-commerce',
    'Responsive Design',
    'SEO',
    'Firebase',
    'Vercel',
    'Product Design',
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
