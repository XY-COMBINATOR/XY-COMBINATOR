/**
 * MenuLinks Component
 * Fullscreen animated navigation drawer powered by GSAP timelines.
 * Features staggered entrance animations, accessible keyboard escape handlers,
 * and inertial scroll integration with Lenis.
 */
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import gsap from 'gsap';
import menuLinks from '@src/components/dom/navbar/constants/menuLinks';
import styles from '@src/components/dom/navbar/styles/menuLinks.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useRouter } from 'next/router';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function MenuLinks() {
  const timeline = useRef(gsap.timeline({ paused: true, defaults: { duration: 0.92, ease: 'expo.inOut' } }));
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen, lenis, isLoading] = useStore(
    useShallow((state) => [state.isMenuOpen, state.setIsMenuOpen, state.lenis, state.isLoading]),
  );
  const menuRef = useRef(null);
  const menuLinksItemsRef = useRef([]);
  const hashTimeout = useRef(null);
  const router = useRouter();

  // Clear pending scroll timeouts on unmount
  useEffect(() => () => clearTimeout(hashTimeout.current), []);

  /**
   * Builds GSAP timeline choreography for menu opening and backdrop morphing.
   */
  const setupMenuAnimation = (gsapTimeline, refs) => {
    const fluidCanvas = document?.getElementById('fluidCanvas');
    const layout = document?.getElementById('layout');
    const scrollbar = document?.getElementById('scrollbar');
    const header = document?.querySelector('header');

    gsap.set(refs.menuRef.current, { pointerEvents: 'none', autoAlpha: 0 });
    gsap.set(refs.menuLinksItemsRef.current, { x: '-100%' });

    gsapTimeline
      .to(refs.menuRef.current, { autoAlpha: 1, stagger: 0.01, pointerEvents: 'auto' }, 0)
      .to(fluidCanvas, { duration: 0, opacity: 0 }, 0)
      .to(refs.menuLinksItemsRef.current, { x: 0, stagger: 0.016, pointerEvents: 'auto' }, 0)
      .to('main', { borderRadius: '1.3888888889vw', border: '2px solid #f0f4f1', scale: 0.9, pointerEvents: 'none', left: '-40vw' }, 0)
      .to(layout, { opacity: isMobile ? 0.05 : 0.3, height: '90svh' }, 0)
      .to(scrollbar, { opacity: 0, right: '46vw', scale: 0.9 }, 0)
      .to(header, { autoAlpha: 0, left: '-40vw', top: isMobile ? '6vw' : '3vw', scale: 0.9, overwrite: true }, 0);
  };

  useEffect(() => {
    const tl = timeline.current;
    const refs = { menuRef, menuLinksItemsRef };
    const ctx = gsap.context(() => {
      setupMenuAnimation(tl, refs, isMobile);
    });

    return () => {
      if (tl) {
        tl.kill();
      }
      ctx.kill();
    };
  }, [isLoading, isMobile]);

  // Synchronize timeline with menu open state
  useEffect(() => {
    const tl = timeline.current;
    if (isMenuOpen) {
      tl.play();
    } else {
      tl.reverse();
    }
  }, [isMenuOpen]);

  // Keyboard accessibility: Close menu when Escape key is pressed
  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        lenis?.start();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, setIsMenuOpen, lenis]);

  /**
   * Scrolls to footer contact section.
   */
  const goToBottom = () => {
    setIsMenuOpen(false);

    setTimeout(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        const mainHeight = mainElement.scrollHeight;
        lenis?.scrollTo(mainHeight, {
          duration: 1.5,
          force: true,
          easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          onComplete: () => {
            lenis?.start();
          },
        });
      }
    }, 850);
  };

  /**
   * Navigates smoothly to internal anchor target.
   */
  const goToHash = (event, href) => {
    event.preventDefault();
    setIsMenuOpen(false);

    if (hashTimeout.current) clearTimeout(hashTimeout.current);

    hashTimeout.current = setTimeout(() => {
      const target = document.querySelector(href);
      if (!target || !lenis) return;

      lenis.scrollTo(target, {
        duration: 1.5,
        force: true,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        onComplete: () => {
          lenis.start();
        },
      });
    }, 850);
  };

  /**
   * Renders the navigational link list.
   */
  const renderMenuLinks = (links, refs, pathname) =>
    links.map((link, index) => (
      <div
        ref={(el) => {
          menuLinksItemsRef.current[index + 1] = el;
        }}
        key={link.title}
        className={clsx(styles.menuListItem, pathname === link.href && styles.menuListItemActive)}
      >
        {link.href !== undefined ? (
          <Link
            aria-label={`Navigate to ${link.title}`}
            scroll={false}
            href={link.href}
            onClick={link.href.startsWith('#') ? (event) => goToHash(event, link.href) : undefined}
          >
            <span>{link.title}</span>
          </Link>
        ) : (
          <span
            onClick={goToBottom}
            role="button"
            tabIndex={0}
            aria-label="Scroll to footer contact form"
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                goToBottom();
              }
            }}
          >
            {link.title}
          </span>
        )}
      </div>
    ));

  return (
    <nav 
      id="menu" 
      ref={menuRef} 
      className={styles.menu} 
      role="dialog" 
      aria-modal="true" 
      aria-label="Site navigation menu"
    >
      <div className={clsx(styles.menuWrapper, 'layout-block-inner')}>
        <div
          ref={(el) => {
            menuLinksItemsRef.current[0] = el;
          }}
          className={styles.menuList}
        >
          {renderMenuLinks(menuLinks, menuLinksItemsRef, router.pathname)}
        </div>
        <div
          ref={(el) => {
            menuLinksItemsRef.current[menuLinks.length + 1] = el;
          }}
          className={styles.menuList}
        >
          <div role="presentation" className={styles.menuListItem}>
            <Link aria-label="Send email to XY Combinator" scroll={false} href="mailto:contact@xycombinator.com">
              <span>GET IN TOUCH</span>
            </Link>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsMenuOpen(false);
            lenis?.start();
          }}
          aria-label="Close navigation menu"
          className={styles.menuClose}
        >
          <p>&#10005;</p>
        </button>
      </div>
    </nav>
  );
}

export default MenuLinks;
