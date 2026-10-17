/* eslint-disable react/jsx-props-no-spreading */
import Home from '@src/pages/components/home/Index';
import About from '@src/pages/components/about/Index';
import Quote from '@src/pages/components/quote/Index';
import Projects from '@src/pages/components/projects/Index';
import Clients from '@src/pages/components/clients/Index';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'XY Combinators — Design & Engineering Studio',
  description:
    'XY Combinators is a design & engineering studio for founders who move fast. We build websites, apps and e-commerce — from first sketch to live users in weeks. Fixed scope, weekly releases, no endless decks.',
  keywords: [
    'XY Combinators',
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
