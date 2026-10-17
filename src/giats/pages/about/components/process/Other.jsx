/* eslint-disable react/no-array-index-key */
import { Fragment, memo, useCallback, useRef } from 'react';

import AppearByWords from '@src/components/animationComponents/appearByWords/Index';
import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import Arrow from '@src/components/imageComponents/Arrow';
import MagicBall from '@src/pages/about/components/magicball/MagicBall';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import clsx from 'clsx';
import containt from '@src/pages/about/components/process/constants/Containt';
import { gsap } from 'gsap';
import styles from '@src/pages/about/components/process/styles/process.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import { useWindowSize } from '@darkroom.engineering/hamo';

const colors = ['#444444', '#f2ffbd'];

const areEqual = () => true;

const Other = memo(({ setPortals }) => {
  const [isLoading] = useStore(useShallow((state) => [state.isLoading]));
  const isMobile = useIsMobile();

  const rootRef = useRef();
  const rightContainerRef = useRef();
  const leftContainerRef = useRef();
  const categoriesRef = useRef([]);
  const shapesRef = useRef([]);
  const optionTitlesRef = useRef(containt.map((category) => category.options.map(() => [])));
  const windowSize = useWindowSize();

  useIsomorphicLayoutEffect(() => {
    const vw = (coef) => windowSize.width * (coef / 100);

    const ctx = gsap.context(() => {
      if (!isMobile && !isLoading) {
        ScrollTrigger.create({
          id: 'process',
          trigger: rightContainerRef.current,
          start: 'top',
          end: `bottom-=${vw(30)}`,
          pin: leftContainerRef.current,
          scrub: true,
          scroller: document?.querySelector('main'),
          invalidateOnRefresh: true,
          pinSpacing: false,
        });

        shapesRef.current.forEach((shapeRef, index) => {
          if (shapeRef) {
            gsap.set(shapeRef, {
              xPercent: -100,
            });
            gsap.timeline({
              scrollTrigger: {
                trigger: categoriesRef.current[index],
                start: index === 0 ? 'top-=500%' : 'top center',
                end: 'bottom center',
                id: `process-${index}`,

                scroller: document?.querySelector('main'),
                onEnter: () => {
                  if (index === 0) {
                    gsap.set(shapeRef, {
                      xPercent: 0,
                    });
                  } else {
                    gsap.set(shapeRef, {
                      xPercent: -100,
                      overwrite: true,
                    });
                    gsap.to(shapeRef, {
                      xPercent: 0,
                      duration: 1,
                      ease: 'bounce.out',
                    });
                  }
                },
                onLeave: () => {
                  if (index === 2) {
                    gsap.set(shapeRef, {
                      xPercent: 0,
                    });
                  } else {
                    gsap.to(shapeRef, {
                      xPercent: 100,
                      duration: 1,
                      ease: 'power1.out',
                    });
                  }
                },
                onEnterBack: () => {
                  if (index !== 2) {
                    gsap.set(shapeRef, {
                      xPercent: -100,
                      overwrite: true,
                    });
                    gsap.to(shapeRef, {
                      xPercent: 0,
                      duration: 1,
                      ease: 'bounce.out',
                    });
                  }
                },
                onLeaveBack: () => {
                  gsap.to(shapeRef, {
                    xPercent: 100,
                    duration: 1,
                    ease: 'power1.out',
                  });
                },
                invalidateOnRefresh: true,
              },
            });
          }
        });
      }
    });

    return () => {
      ctx.kill();
      if (ScrollTrigger.getById('process')) {
        ScrollTrigger.getById('process').kill();
      }
    };
  }, [isMobile, isLoading, windowSize.width]);

  const handleMouseEnter = useCallback((index, optionIndex, option) => {
    if (typeof window !== 'undefined') {
      gsap.to(optionTitlesRef.current[index][optionIndex], { color: '#28282b', duration: 0.35, ease: 'none' });

      const element = document.querySelector('main');
      element?.classList.toggle('color-change');
      const mainContainer = document.getElementById('mainContainer');
      const fourthSection = mainContainer?.querySelectorAll('section')[3];
      const thirdSection = mainContainer?.querySelectorAll('section')[2];
      thirdSection?.classList.toggle('fill-change');
      fourthSection?.classList.toggle('fill-change');
      setPortals((prevPortals) => {
        const existingPortal = prevPortals.findIndex((portal) => portal.title === option.title);
        if (existingPortal !== -1) {
          const newPortals = [...prevPortals];
          newPortals[existingPortal] = { ...newPortals[existingPortal], fadeIn: true };
          return newPortals;
        }

        const newPortal = { title: option.title, desc: option.desc, fadeIn: true };
        return [...prevPortals, newPortal];
      });
    }
  }, []);

  const handleMouseLeave = useCallback((index, optionIndex, option) => {
    gsap.to(optionTitlesRef.current[index][optionIndex], { color: 'unset', duration: 0.35, ease: 'none' });

    const element = document?.querySelector('main');

    element.classList.remove('color-change');

    const mainContainer = document.getElementById('mainContainer');

    const fourthSection = mainContainer.querySelectorAll('section')[3];
    const thirdSection = mainContainer.querySelectorAll('section')[2];
    thirdSection.classList.remove('fill-change');
    fourthSection.classList.remove('fill-change');
    setPortals((prevPortals) => {
      const existingPortal = prevPortals.findIndex((portal) => portal.title === option.title);
      if (existingPortal === -1) {
        return prevPortals;
      }
      const newPortals = [...prevPortals];
      newPortals[existingPortal] = { ...newPortals[existingPortal], fadeIn: false };
      return newPortals;
    });
  }, []);

  return (
    <section ref={rootRef} className={clsx(styles.root, 'layout-block-inner')}>
      <div className={styles.topContainer}>
        <h1 className={clsx(styles.text, 'h1')}>
          <AppearByWords>Process</AppearByWords>
        </h1>
      </div>

      <div className={styles.processContainer}>
        <div ref={leftContainerRef} className={styles.leftContainer}>
          {!isMobile ? (
            <>
              {containt.map((category, index) => (
                <div key={`process-shape-${index}`} className={styles.shapesContainer}>
                  <div
                    ref={(el) => {
                      shapesRef.current[index] = el;
                    }}
                    className={styles.shape}
                  >
                    <MagicBall isSphere={false} color={colors[index]} text={category.smallTitle} roughness={0.4} />
                  </div>
                </div>
              ))}
            </>
          ) : null}
          <div className={styles.spacing} />
        </div>

        <div ref={rightContainerRef} className={styles.rightContainer}>
          {containt.map((category, index) => (
            <div
              ref={(el) => {
                categoriesRef.current[index] = el;
              }}
              key={category.bigTitle}
              className={styles.category}
            >
              {isMobile ? (
                <div
                  ref={(el) => {
                    shapesRef.current[index] = el;
                  }}
                  className={styles.shape}
                >
                  <MagicBall isSphere={false} color={colors[index]} text={category.smallTitle} roughness={0.5} />
                </div>
              ) : null}

              <div className={styles.innerContainer}>
                <AppearTitle>
                  <h6 className="h6">{category.bigTitle}</h6>
                </AppearTitle>
                {isMobile ? (
                  <AppearTitle>
                    {category.descMobile.map((descMobile, idx) => (
                      <Fragment key={`process-descMobile-${idx}`}>{descMobile}</Fragment>
                    ))}
                  </AppearTitle>
                ) : null}

                {!isMobile ? (
                  <AppearTitle>
                    {category.desc.map((desc, idx) => (
                      <Fragment key={`process-desc-${idx}`}>{desc}</Fragment>
                    ))}
                  </AppearTitle>
                ) : null}
                <div className={styles.options}>
                  {category.options.map((option, optionIndex) => (
                    <div
                      onMouseEnter={() => handleMouseEnter(index, optionIndex, option)}
                      onMouseLeave={() => handleMouseLeave(index, optionIndex, option)}
                      key={option.title}
                      className={styles.option}
                    >
                      <Arrow className={styles.arrow} />
                      <div className="p-l">
                        <AppearTitle index={index} optionIndex={optionIndex} ref={optionTitlesRef}>
                          <div>{option.title}</div>
                        </AppearTitle>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}, areEqual);

export default Other;
