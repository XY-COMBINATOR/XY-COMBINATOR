import AppearByWords from '@src/components/animationComponents/appearByWords/Index';
import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import Badge from '@src/pages/components/clients/components/Badge';
import clsx from 'clsx';
import { gsap } from 'gsap';
import styles from '@src/pages/components/clients/styles/clients.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useRef } from 'react';
import { useWindowSize } from '@darkroom.engineering/hamo';

const clients = [
  {
    badge: 'company1',
    year: 'since 2024',
    name: 'Mihsan',
    copy: [
      'Full-stack engineer and open-',
      'source contributor. Ships with',
      'TypeScript, Next.js and Python.',
      'Currently at Innovick and',
      'Iksura Nomoi. mihsanalam.com',
    ],
  },
  {
    badge: 'company2',
    year: 'since 2026',
    name: 'Mantis',
    copy: [
      'Bitten by curiosity, tangled in',
      'code, chasing what is possible.',
      'Builds AI agents and playful',
      'web experiments. 24 public',
      'repos and counting.',
    ],
  },
  {
    badge: 'company3',
    year: 'since 2026',
    name: 'Aizen',
    copy: [
      'Half genius, half chaos, all',
      'curiosity. Explores design,',
      'web and AI with thousands of',
      'ideas in flight. Based in India,',
      'always building something new.',
    ],
  },
  {
    badge: 'company4',
    year: 'since 2024',
    name: 'Jignesh D Maru',
    copy: [
      'Just a developer making fun',
      'stuff on the internet. Based in',
      'Gujarat, India. Builds web apps',
      'and experiments with AI, agents',
      'and debug battles.',
    ],
  },
];

const renderCopy = (lines) => lines.map((line) => <div key={line} className="p-l">{line}</div>);

function Clients() {
  const isMobile = useIsMobile();
  const textRefs = useRef([]);
  const badgeRefs = useRef([]);
  const rootRef = useRef();
  const windowSize = useWindowSize();

  const setupScrollAnimation = () => {
    const ctx = gsap.context(() => {
      if (!isMobile) {
        const vw = (coef) => windowSize.height * (coef / 100);
        textRefs.current.forEach((textRef, index) => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: rootRef.current,
                start: index === 0 ? `top-=${vw(35)}` : `top+=${vw(35 + 5.5555556 * index)}`,
                end: index === 0 ? `bottom-=${vw(35 + 5.5555556 * index)}` : `bottom+=${vw(25)}`,
                toggleActions: 'play none reverse none',
                scrub: true,
                scroller: document?.querySelector('main'),
                invalidateOnRefresh: true,
              },
            })
            .to(textRef, {
              top: `${10 + 30 * index + 5.5555556 * index}vw`,
            });
        });
      }
    });

    return ctx;
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = setupScrollAnimation(textRefs, rootRef, windowSize, isMobile);
    return () => ctx.kill();
  }, [isMobile, windowSize.height]);

  return (
    <section ref={rootRef} className={clsx(styles.root, 'layout-grid-inner')}>
      <h1 className={clsx(styles.sectionTitle, 'h1')}>
        <AppearByWords>Meet Developers</AppearByWords>
      </h1>
      {isMobile ? <div className={styles.mobileEmpty} /> : null}
      {isMobile ? (
        <div className={styles.mobileCount}>
          <AppearTitle>{clients[0].year}</AppearTitle>
        </div>
      ) : null}
      <div
        ref={(el) => {
          badgeRefs.current[0] = el;
        }}
        className={styles.first}
      >
        <Badge name={clients[0].badge} />
      </div>
      {isMobile ? <div className={styles.mobileEmptySecond} /> : null}
      {isMobile ? (
        <div className={styles.textMobile}>
          <AppearTitle>
            <h4 className={clsx('h4', 'bold')}>{clients[0].name}</h4>
          </AppearTitle>
          <AppearTitle>{renderCopy(clients[0].copy)}</AppearTitle>
        </div>
      ) : null}
      {!isMobile ? (
        <>
          <div className={styles.firstEmpty} />
          <div
            ref={(el) => {
              textRefs.current[0] = el;
            }}
            className={styles.firstText}
          >
            <AppearTitle>
              <h6 className="h6">{clients[0].year}</h6>
            </AppearTitle>
            <AppearTitle>
              <h4 className={clsx('h4', 'bold', styles.title)}>{clients[0].name}</h4>
            </AppearTitle>
            <AppearTitle>{renderCopy(clients[0].copy)}</AppearTitle>
          </div>
        </>
      ) : null}
      {!isMobile ? <div className={styles.secondEmpty} /> : null}
      {isMobile ? <div className={styles.mobileEmpty} /> : null}
      {isMobile ? (
        <div className={styles.mobileCount}>
          <AppearTitle>{clients[1].year}</AppearTitle>
        </div>
      ) : null}
      <div
        ref={(el) => {
          badgeRefs.current[1] = el;
        }}
        className={styles.second}
      >
        <Badge name={clients[1].badge} />
      </div>
      {isMobile ? <div className={styles.mobileEmptySecond} /> : null}
      {isMobile ? (
        <div className={styles.textMobile}>
          <AppearTitle>
            <h4 className={clsx('h4', 'bold')}>{clients[1].name}</h4>
          </AppearTitle>
          <AppearTitle>{renderCopy(clients[1].copy)}</AppearTitle>
        </div>
      ) : null}
      {!isMobile ? (
        <>
          <div
            ref={(el) => {
              textRefs.current[1] = el;
            }}
            className={styles.secondText}
          >
            <AppearTitle>
              <h6 className="h6">{clients[1].year}</h6>
            </AppearTitle>
            <AppearTitle>
              <h4 className={clsx('h4', 'bold', styles.title)}>{clients[1].name}</h4>
            </AppearTitle>
            <AppearTitle>{renderCopy(clients[1].copy)}</AppearTitle>
          </div>
        </>
      ) : null}
      {isMobile ? <div className={styles.mobileEmpty} /> : null}
      {isMobile ? (
        <div className={styles.mobileCount}>
          <AppearTitle>{clients[2].year}</AppearTitle>
        </div>
      ) : null}
      <div
        ref={(el) => {
          badgeRefs.current[2] = el;
        }}
        className={styles.third}
      >
        <Badge name={clients[2].badge} />
      </div>
      {!isMobile ? <div className={styles.fourthEmpty} /> : null}
      {isMobile ? <div className={styles.mobileEmptySecond} /> : null}
      {isMobile ? (
        <div className={styles.textMobile}>
          <AppearTitle>
            <h4 className={clsx('h4', 'bold')}>{clients[2].name}</h4>
          </AppearTitle>
          <AppearTitle>{renderCopy(clients[2].copy)}</AppearTitle>
        </div>
      ) : null}
      {!isMobile ? (
        <>
          <div className={styles.fifthEmpty} />
          <div
            ref={(el) => {
              textRefs.current[2] = el;
            }}
            className={styles.thirdText}
          >
            <AppearTitle>
              <h6 className="h6">{clients[2].year}</h6>
            </AppearTitle>
            <AppearTitle>
              <h4 className={clsx('h4', 'bold', styles.title)}>{clients[2].name}</h4>
            </AppearTitle>
            <AppearTitle>{renderCopy(clients[2].copy)}</AppearTitle>
          </div>
        </>
      ) : null}
      {!isMobile ? <div className={styles.sixthEmpty} /> : null}
      {isMobile ? <div className={styles.mobileEmpty} /> : null}
      {isMobile ? (
        <div className={styles.mobileCount}>
          <AppearTitle>{clients[3].year}</AppearTitle>
        </div>
      ) : null}
      <div
        ref={(el) => {
          badgeRefs.current[3] = el;
        }}
        className={styles.fourth}
      >
        <Badge name={clients[3].badge} />
      </div>
      {isMobile ? <div className={styles.mobileEmptySecond} /> : null}
      {isMobile ? (
        <div className={styles.textMobile}>
          <AppearTitle>
            <h4 className={clsx('h4', 'bold')}>{clients[3].name}</h4>
          </AppearTitle>
          <AppearTitle>{renderCopy(clients[3].copy)}</AppearTitle>
        </div>
      ) : null}
      {!isMobile ? (
        <div
          ref={(el) => {
            textRefs.current[3] = el;
          }}
          className={styles.fourthText}
        >
          <AppearTitle>
            <h6 className="h6">{clients[3].year}</h6>
          </AppearTitle>
          <AppearTitle>
            <h4 className={clsx('h4', 'bold', styles.title)}>{clients[3].name}</h4>
          </AppearTitle>
          <AppearTitle>{renderCopy(clients[3].copy)}</AppearTitle>
        </div>
      ) : null}
    </section>
  );
}

export default Clients;
