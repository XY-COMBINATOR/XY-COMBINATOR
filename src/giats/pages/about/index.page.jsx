/* eslint-disable react/jsx-props-no-spreading */
import Hero from '@src/pages/about/components/hero/Hero';
import Overview from '@src/pages/about/components/overview/Overview';
import Services from '@src/pages/about/components/services/Services';
import Process from '@src/pages/about/components/process/Process';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'Giats - About',
  description: 'Learn about my journey, values, and commitment to quality web and app solutions.',
  keywords: [
    'Giats',
    'About Evangelos Giatsidis',
    'About me',
    'Frontend Developer Journey',
    'Web Developer Story',
    'Professional Web Development',
    'Frontend Development Expertise',
    'Web Design Skills',
    'Web Development Services',
    'Web Design Expertise',
    'Developer Profile',
    'Quality Web Solutions',
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
