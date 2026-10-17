import jcreation from '@/assets/work-imgs/jcreation.webp';
import arish from '@/assets/work-imgs/arish-travels.webp';
import slr from '@/assets/work-imgs/slr-playground.webp';

const projects = [
  {
    id: 'j-creation',
    title: 'J Creation',
    img: jcreation,
    link: 'https://jcreationbd.com/shop',
    date: 'E-commerce',
    company: 'J Creation',
    primary: '#2D2D2D',
    accentColor: '#FCFBF7',
    secondary: '#F2EEE7',
    fillColor: '#F2F3F4',
    menuColor: 'gold',
    menuFontColor: '#2D2D2D',
    fluidColor: '#0028FF',
    images: [
      { src: jcreation, tag: 'big', isRight: false },
    ],
    desc: [
      'Grooms’ exclusive wear, taken online with a full catalog, product pages and a checkout built to convert.',
      'Design, build, payments and SEO shipped as one project in a single release.',
    ],
  },
  {
    id: 'arish-travels',
    title: 'Arish Travels',
    img: arish,
    link: 'https://arishbd.com/',
    date: 'Website',
    company: 'Arish Travels',
    primary: '#0e0063',
    accentColor: '#f0f4f1',
    secondary: '#fbfbfc',
    fillColor: '#e1e1f9',
    menuColor: '#170053',
    menuFontColor: '#f0f4f1',
    fluidColor: '#E8FFC8',
    images: [
      { src: arish, tag: 'big', isRight: false },
    ],
    desc: [
      'A Hajj and Umrah agency site with packages, visa guidance and online pre-registration.',
      'Built to rank well, and to turn first-time visitors into confirmed bookings.',
    ],
  },
  {
    id: 'slr-playground',
    title: 'SLR Playground',
    img: slr,
    link: 'https://slrplaygroundmalaysia.com/',
    date: 'Catalog site',
    company: 'SLR Playground',
    primary: '#263745',
    accentColor: '#f0f4f1',
    secondary: '#F3F5F7',
    fillColor: '#E0DFFC',
    menuColor: '#5C58EB',
    menuFontColor: '#f0f4f1',
    fluidColor: '#A3A714',
    images: [
      { src: slr, tag: 'big', isRight: false },
    ],
    desc: [
      'A playground supplier catalog and project gallery for the Malaysian market.',
      'Fast, image-led and easy for the team to keep updated long after launch day.',
    ],
  },
];
export default projects;
