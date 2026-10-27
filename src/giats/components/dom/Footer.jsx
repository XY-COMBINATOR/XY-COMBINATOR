/**
 * Footer Component
 * Award-grade responsive footer with sitemap links, real-time UTC/local studio clock,
 * interactive email link, and animated scroll-to-top trigger.
 */
import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import Link from 'next/link';
import LinkText from '@src/components/animationComponents/linkText/Index';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import menuLinks from '@src/components/dom/navbar/constants/menuLinks';
import styles from '@src/components/dom/styles/footer.module.scss';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import { useWindowSize } from '@darkroom.engineering/hamo';

// Dynamically load browser-only interactive sub-components
const Time = dynamic(() => import('@src/components/dom/Time'), { ssr: false });
const GoTop = dynamic(() => import('@src/components/dom/GoTop'), { ssr: false });

function Footer() {
  const footerRef = useRef(null);
  const [isLoading] = useStore(useShallow((state) => [state.isLoading]));
  const windowSize = useWindowSize();

  // Reveal uncover parallax animation on desktop viewports
  useIsomorphicLayoutEffect(() => {
    if (!isLoading && footerRef.current) {
      const setupFooterAnimation = () => {
        gsap.set(footerRef.current, { height: 'auto' });
        const allSections = document.querySelectorAll('#mainContainer section');
        if (allSections.length > 1) {
          const lastSection = allSections[allSections.length - 2];
          if (footerRef.current.offsetHeight <= windowSize.height) {
            gsap.set(footerRef.current, { yPercent: -50 });
            const uncover = gsap.timeline({ paused: true });
            gsap.set(footerRef.current, { height: '100.5svh' });
            uncover.to(footerRef.current, {
              yPercent: 0,
              ease: 'none',
            });
            ScrollTrigger.create({
              id: 'footerTrigger',
              trigger: lastSection,
              start: 'bottom bottom',
              end: '+=100%',
              animation: uncover,
              scrub: true,
              scroller: document?.querySelector('main'),
            });
          } else {
            gsap.set(footerRef.current, { transform: 'translate(0%, 0%)', height: 'auto' });
          }
        }
      };

      setupFooterAnimation();
    }

    return () => {
      const footerTrigger = ScrollTrigger.getById('footerTrigger');
      if (footerTrigger) {
        footerTrigger.kill();
      }
    };
  }, [isLoading, windowSize.height]);

  return (
    <section 
      ref={footerRef} 
      className={clsx(styles.root, 'layout-grid-inner')} 
      role="contentinfo" 
      aria-label="Studio footer" 
      data-header-theme="dark"
    >
      {/* Navigation Sitemap */}
      <div className={clsx(styles.linksContainer, styles.sitemap)}>
        <AppearTitle isFooter>
          <h6 className={clsx(styles.title, 'h6')}>Sitemap</h6>
          {menuLinks.slice(0, -1).map((link) => (
            <div key={link.title} className={styles.linkTextContainer}>
              <LinkText className={styles.linkText} title={link.title} href={link.href}>
                <span className="footer">{link.title}</span>
              </LinkText>
            </div>
          ))}
        </AppearTitle>
      </div>

      {/* Primary Studio Contact CTA */}
      <div className={styles.emailContaineer}>
        <AppearTitle isFooter>
          <h4 className={clsx(styles.workWithMe, 'h4')}>Start a project:</h4>
          <div>
            <div className={styles.link}>
              <Link aria-label="Send inquiry email to contact@xycombinator.com" scroll={false} href="mailto:contact@xycombinator.com">
                <h4 className={clsx(styles.email, 'h4')}>contact@xycombinator.com</h4>
              </Link>
              <svg className={clsx(styles.linkGraphic)} width="300%" height="100%" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0" />
              </svg>
            </div>
          </div>
        </AppearTitle>
      </div>

      {/* Global Location & Studio Clock */}
      <div className={clsx(styles.middleContainer, styles.location)}>
        <AppearTitle isFooter>
          <div className="p-x">Remote · Working worldwide</div>
          <div className={clsx('p-x', styles.middleText)}>
            Current Time: <Time />
          </div>
        </AppearTitle>
      </div>

      {/* Availability Status */}
      <div className={clsx(styles.middleContainer, styles.availability)}>
        <AppearTitle isFooter>
          <div className="p-x">Availability</div>
          <div className={clsx('p-x', styles.middleText)}>Currently available for limited projects</div>
        </AppearTitle>
      </div>

      {/* Copyright Notice */}
      <div className={clsx(styles.middleContainer, styles.rights)}>
        <AppearTitle isFooter>
          <div className="p-x">© 2026 · XY Combinator</div>
          <div className={clsx('p-x', styles.middleText)}>All Rights Reserved</div>
        </AppearTitle>
      </div>

      {/* Visual Watermark */}
      <div className={styles.giats} aria-hidden="true">
        <span>XY</span>
      </div>

      {/* Scroll to Top Trigger */}
      <div className={styles.goToTop}>
        <GoTop />
      </div>
    </section>
  );
}

export default Footer;
