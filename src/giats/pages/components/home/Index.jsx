import { useRef } from 'react';

import Image from 'next/image';
import InfiniteText from '@src/components/animationComponents/infiniteText/Index';
import Link from 'next/link';
import clsx from 'clsx';
import { gsap } from 'gsap';
import heroImg from '@/assets/slr-hero.jpg';
import styles from '@src/pages/components/home/styles/home.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';

function Home() {
  const isMobile = useIsMobile();
  const rootRef = useRef();
  const infiniteTextRef = useRef();

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top+=3%',
            end: 'top+=5%',
            toggleActions: 'play none reverse none',
            scroller: document.querySelector('main'),
            invalidateOnRefresh: true,
          },
        })
        .to(infiniteTextRef.current, {
          opacity: 0,
          duration: 0.6,
        });
    });

    return () => ctx.kill();
  }, []);

  return (
    <section ref={rootRef} id="top" className={clsx(styles.root)}>
      <div className={clsx(styles.topContainer, 'layout-grid-inner')}>
        <div className={styles.leftContainer}>
          <h2 className="h2">Design &amp; engineering</h2>
          <h2 className={clsx('h2', 'bold')}>that ships every week</h2>
        </div>
        {!isMobile && (
          <h6 className={clsx('h6', styles.rightContainer)}>
            We take products from idea to live users — websites, apps and e-commerce. Fixed scope, weekly clickable releases, and launch support that actually shows up.
          </h6>
        )}
      </div>
      {isMobile && (
        <div className={styles.rightContainerMobile}>
          <h6 className="h6"> We take products from idea to live users — websites, apps and e-commerce. Fixed scope, weekly clickable releases, and launch support that actually shows up.</h6>
        </div>
      )}

      <div className={styles.bottomContainer}>
        <Link
          target="_blank"
          rel="noreferrer"
          aria-label="View SLR Playground — designed and built by XY Combinators"
          href="https://slrplaygroundmalaysia.com/"
          className={styles.heroMedia}
        >
          <Image priority src={heroImg} alt="SLR Playground — a website designed and built by XY Combinators" fill sizes="100%" />
          <span className={styles.heroTag}>SLR Playground · live site ↗</span>
        </Link>
      </div>

      <div ref={infiniteTextRef} className={styles.infiniteContainer}>
        <InfiniteText text="Scroll Down" length={5} />
      </div>
    </section>
  );
}

export default Home;
