import { useCallback, useRef } from 'react';

import Arrow from '@src/components/imageComponents/Arrow';
import Link from 'next/link';
import clsx from 'clsx';
import gsap from 'gsap';
import styles from '@src/components/animationComponents/buttonLink/buttonLink.module.scss';

function ButtonLink({ href, label, target = false }) {
  const buttonRef = useRef(null);
  const spanRef = useRef(null);
  const relsRef = useRef({ relX: 0, relY: 0 });

  const handleMouseEnter = useCallback((e) => {
    const button = buttonRef.current;
    const span = spanRef.current;
    if (!button || !span) return;

    const { clientY } = e;
    const parentOffset = button.getBoundingClientRect();
    const isTop = clientY < parentOffset.top + parentOffset.height / 2;
    const relX = ((e.pageX - parentOffset.left) / parentOffset.width) * 100;
    const relY = isTop ? 0 : 100;

    relsRef.current = { relX, relY };

    gsap.set(span, { top: `${relY}%`, left: `${relX}%` });
    gsap.to(span, {
      duration: 0.6,
      ease: 'cubic-bezier(.4,0,.1,1)',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const span = spanRef.current;
    if (!span) return;

    const { relX, relY } = relsRef.current;
    gsap.to(span, {
      duration: 0.6,
      top: `${relY}%`,
      left: `${relX}%`,
      ease: 'cubic-bezier(.4,0,.1,1)',
    });
  }, []);

  return (
    <Link target={target ? '_blank' : undefined} rel={target ? 'noopener noreferrer' : undefined} aria-label={label} scroll={false} href={href}>
      <button type="button" aria-label={label} ref={buttonRef} className={clsx('p-xs', styles.btnPosnawr)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <span className={clsx('p-x', styles.labelClassic)}>{label}</span>
        <Arrow className={styles.arrowClassic} />
        <span className={styles.ball} ref={spanRef} />
      </button>
    </Link>
  );
}

export default ButtonLink;
