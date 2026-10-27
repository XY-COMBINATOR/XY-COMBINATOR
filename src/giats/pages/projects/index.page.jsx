/**
 * Projects Archive Page Component
 * Renders complete showcase of studio releases and development case studies.
 */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import CustomHead from '@src/components/dom/CustomHead';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { gsap } from 'gsap';
import projects from '@src/constants/projects';
import styles from '@src/pages/projects/projects.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import { useWindowSize } from '@darkroom.engineering/hamo';

const seo = {
  title: 'XY Combinator — All Projects',
  description: 'Explore the full portfolio of websites, web applications, and mobile products designed and engineered by XY Combinator.',
  keywords: [
    'XY Combinator Projects',
    'Portfolio Showcase',
    'Frontend Development',
    'Web Design Portfolio',
    'Responsive Web Applications',
    'React Three Fiber',
    'Next.js Studio',
  ],
};

function Page() {
  const isMobile = useIsMobile();
  const windowSize = useWindowSize();
  const rootRef = useRef(null);
  const projectRefs = useRef([]);
  const [isLoading] = useStore(useShallow((state) => [state.isLoading]));

  const setupProjectAnimations = () => {
    const ctx = gsap.context(() => {
      if (!isLoading) {
        projectRefs.current.slice(0, -1).forEach((projectRef, index) => {
          gsap.set(projectRef, { yPercent: 0 });
          gsap
            .timeline({
              scrollTrigger: {
                id: `projectRef-${index}`,
                trigger: rootRef.current,
                start: `top+=${windowSize.height * index}`,
                end: () => `+=${(projectRefs.current.length - 2) * windowSize.height}`,
                scrub: true,
                scroller: document?.querySelector('main'),
                invalidateOnRefresh: true,
              },
            })
            .to(projectRef, {
              yPercent: 100,
              stagger: 1,
            });
        });
      }
    });

    return ctx;
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = setupProjectAnimations();
    return () => ctx.kill();
  }, [isLoading, windowSize.height]);

  return (
    <>
      <CustomHead {...seo} />
      <section className={clsx(styles.titleContainer, 'layout-block-inner')}>
        <h1 className={clsx(styles.title, 'h1')}>All Projects</h1>
      </section>
      <section ref={rootRef} className={clsx(styles.root, 'layout-block-inner')} aria-label="Projects list">
        <div className={styles.innerContainer}>
          {projects.map((project, index) => (
            <Link aria-label={`View ${project.title}`} id={project.id} key={project.id} scroll={false} href={project.link} className={clsx(styles.card)}>
              <div
                style={
                  !isMobile
                    ? {
                        height: index === projects.length - 1 ? '200svh' : `${200 + 100 * index}svh`,
                        top: index === 0 ? '0px' : '-100svh',
                      }
                    : {
                        height: index === projects.length - 1 ? '100svh' : `${200 + 100 * index}svh`,
                        top: index === 0 ? '0px' : '-50svh',
                      }
                }
                className={styles.projectsWrap}
              >
                <div className={clsx(styles.container, 'layout-grid-inner')}>
                  <div className={styles.projectsDetails}>
                    <h6 className={clsx(styles.text, 'h6')}>{project.date}</h6>
                    <h3 className={clsx(styles.text, 'h3')}>{project.title}</h3>
                  </div>
                  <div className={styles.imageContainer}>
                    <Image priority={index === 0} sizes="100%" src={project.img} fill alt={project.title} />
                  </div>
                </div>
              </div>
              <div
                ref={(el) => {
                  projectRefs.current[index] = el;
                }}
                className={styles.canvas}
              >
                <Image
                  priority={index === 0}
                  sizes="100%"
                  className={index === 0 ? styles.firstCard : index === projects.length - 1 ? styles.lastCard : undefined}
                  src={project.img}
                  fill
                  alt={project.title}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default Page;
