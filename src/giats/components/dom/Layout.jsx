import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Transition as ReactTransition, SwitchTransition } from 'react-transition-group';

import Footer from '@src/components/dom/Footer';
import PreFooter from '@src/components/dom/PreFooter';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import gsap from 'gsap';
import styles from '@src/components/dom/styles/layout.module.scss';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function Layout({ children, layoutRef, mainRef, router }) {
  const [lenis, introOut, setIsLoading, isMenuOpen, setIsMenuOpen, setIsAbout] = useStore(
    useShallow((state) => [state.lenis, state.introOut, state.setIsLoading, state.isMenuOpen, state.setIsMenuOpen, state.setIsAbout]),
  );

  const enterTimelineRef = useRef();
  const exitTimelineRef = useRef();

  const [isEntering, setIsEntering] = useState(false);

  const menuTime = useMemo(() => (isMenuOpen ? 0.8 : 0), [isMenuOpen]);

  useEffect(() => {
    const darkSections = Array.from(document.querySelectorAll('[data-header-theme="dark"]'));
    if (!darkSections.length) return undefined;

    const active = new Set();
    let observer;

    const watch = () => {
      if (observer) observer.disconnect();

      const logo = document.querySelector('header h4');
      const logoRect = logo?.getBoundingClientRect();
      const triggerLine = logoRect ? logoRect.top + logoRect.height * 0.5 : 60;
      const bottomInset = Math.max(Math.round(window.innerHeight - triggerLine), 24);

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              active.add(entry.target);
              entry.target.classList.add('section-revealed');
            } else {
              active.delete(entry.target);
            }
          });
          document.body.classList.toggle('on-dark-section', active.size > 0);
        },
        { rootMargin: `0px 0px -${bottomInset}px 0px` },
      );

      darkSections.forEach((section) => observer.observe(section));
    };

    const revealed = new Set();

    const revealSection = (el) => {
      if (revealed.has(el)) return;
      revealed.add(el);
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'opacity 1.1s ease, transform 1.1s ease';
    };

    const hideSection = (el) => {
      if (revealed.has(el)) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity 1.1s ease, transform 1.1s ease';
    };

    const updateReveal = () => {
      document.querySelectorAll('#mainContainer section').forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
          revealSection(section);
        } else {
          hideSection(section);
        }
      });
    };

    updateReveal();

    watch();
    window.addEventListener('resize', updateReveal);

    if (lenis) {
      lenis.on('scroll', updateReveal);
    }

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', watch);
      if (lenis) {
        lenis.off('scroll', updateReveal);
      }
      document.body.classList.remove('on-dark-section');
    };
  }, [router.asPath, lenis]);

  const handleEnter = useCallback(
    () => {
      if (introOut) {
        if (exitTimelineRef.current) exitTimelineRef.current.pause();

        const tl = gsap.timeline({
          onComplete: () => {
            setIsAbout(router.asPath === '/about');
            setIsLoading(false);
            lenis.start();
            ScrollTrigger.refresh();
          },
        });

        enterTimelineRef.current = tl;
        setIsEntering(true);

        tl.set(
          layoutRef.current,
          {
            ease: 'power2.inOut',
            height: '90%',
            opacity: 1,
            onComplete: () => {
              setIsAbout(router.asPath === '/about');
              setIsEntering(false);
            },
          },
          2.5,
        )
          .to(
            '#loader',
            {
              x: '-100%',
              ease: 'power2.inOut',
            },
            2.5,
          )
          .to(
            mainRef.current,
            {
              ease: 'power2.inOut',
              x: '0px',
            },
            2.5,
          )
          .to(
            mainRef.current,
            {
              ease: 'power2.inOut',
              borderRadius: 0,
              scale: 1,
            },
            3,
          )
          .to(
            layoutRef.current,
            {
              ease: 'power2.inOut',
              height: '100%',
              opacity: 1,
            },
            3,
          )
          .to(
            'header',
            {
              ease: 'power2.inOut',
              autoAlpha: 1,
            },
            3.3,
          )
          .to(
            mainRef.current,
            {
              ease: 'power2.inOut',
              height: 'auto',
              border: 'none',
              pointerEvents: 'auto',
            },
            3.3,
          );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [introOut],
  );

  const handleExit = useCallback(
    () => {
      if (introOut) {
        if (enterTimelineRef.current) enterTimelineRef.current.pause();

        lenis.stop();
        if (isMenuOpen) {
          setIsMenuOpen(false);
        }
        if (isEntering === false) {
          const tl = gsap.timeline({
            onComplete: () => {
              setIsLoading(true);
              lenis.scrollTo(0, { force: true });
            },
          });

          exitTimelineRef.current = tl;

          if (document?.getElementById('scrollbar')) {
            tl.to(
              document.getElementById('scrollbar'),
              {
                ease: 'power2.inOut',
                autoAlpha: 0,
                duration: 0.5,
              },
              menuTime,
            );
          }

          tl.to(
            'header',
            {
              ease: 'power2.inOut',
              autoAlpha: 0,
              duration: 0.5,
              onComplete: () => {
                gsap.set('#loader', {
                  scale: 0.9,
                  x: '100%',
                  borderRadius: '1.3888888889vw',
                });
                gsap.set('header', {
                  left: 0,
                  top: 0,
                  scale: 1,
                  duration: 0,
                });
              },
              overwrite: true,
            },
            menuTime,
          )
            .to(
              layoutRef.current,
              {
                ease: 'power2.inOut',
                height: '90svh',
                opacity: 1,
                duration: 0.5,
              },
              menuTime,
            )
            .to(
              mainRef.current,
              {
                ease: 'power2.inOut',
                scale: 0.9,
                opacity: 1,
                border: '2px solid #f0f4f1',
                borderRadius: '1.3888888889vw',
                duration: 0.5,
              },
              menuTime,
            )
            .to(
              mainRef.current,
              {
                ease: 'power2.inOut',
                x: '-100%',
                duration: 0.5,
              },
              0.5 + menuTime,
            )
            .to(
              '#loader',
              {
                ease: 'power2.inOut',
                x: '0px',
                duration: 0.5,
              },
              0.5 + menuTime,
            )
            .set(mainRef.current, {
              x: '100%',
            });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [introOut, menuTime, isEntering],
  );

  return (
    <>
      <SwitchTransition>
        <ReactTransition
          key={router.asPath}
          in={false}
          unmountOnExit
          timeout={{
            enter: introOut ? 4500 : 0,
            exit: introOut ? 2550 : 0,
          }}
          onEnter={handleEnter}
          onExit={handleExit}
        >
          {children}
        </ReactTransition>
      </SwitchTransition>

      <PreFooter />
      <footer className={styles.footer}>
        <Footer />
      </footer>
    </>
  );
}

export default Layout;
