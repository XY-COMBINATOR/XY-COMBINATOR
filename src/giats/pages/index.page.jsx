/* eslint-disable react/jsx-props-no-spreading */
import Home from '@src/pages/components/home/Index';
import About from '@src/pages/components/about/Index';
import Quote from '@src/pages/components/quote/Index';
import Projects from '@src/pages/components/projects/Index';
import Clients from '@src/pages/components/clients/Index';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'XY Combinator — Design & Engineering Studio for Founders',
  description:
    'XY Combinator is a design & engineering studio helping founders move fast. We build websites, apps and e-commerce — from a rough sketch to real users in weeks. Fixed scope, weekly releases, no endless decks.',
  keywords: [
    'XY Combinator',
    'Design Studio',
    'Engineering Studio',
    'Web Development',
    'React',
    'Next.js',
    'React Native',
    'E-commerce',
    'Web Applications',
    'Responsive Design',
    'Progressive Web Apps',
    'SEO',
    'Firebase',
    'Vercel',
    'GSAP',
    'Motion',
    'Product Design',
  ],
};

function Page() {
  return (
    <>
      <CustomHead {...seo} />
      <Home />
      <About />
      <Clients />
      <Quote />
      <Projects />
    </>
  );
}

export default Page;
