import Link from 'next/link';
import clsx from 'clsx';
import { gsap } from 'gsap';
import styles from '@src/components/animationComponents/linkText/linkText.module.scss';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useRef } from 'react';

function LinkText({ children, href, svgX, spanX, title, className = undefined, hovered = undefined, target = false }) {
  const linkRef = useRef(null);
  const svgRef = useRef(null);
  const spanRef = useRef(null);

  const animateHover = (isHovered) => {
    gsap.to(svgRef.current, {
      ease: 'cubic-bezier(.4, 0, .1, 1)',
      duration: 0.1,
      x: isHovered ? svgX : 0,
      rotation: isHovered ? -150 : -90,
    });
    gsap.to(spanRef.current, {
      ease: 'cubic-bezier(.4, 0, .1, 1)',
      duration: 0.1,
      x: isHovered ? spanX : 0,
    });
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      animateHover(hovered);
    }, linkRef);

    return () => ctx.kill();
  }, [hovered, svgX, spanX]);

  return (
    <Link
      aria-label={`Go ${title}`}
      target={target ? '_blank' : undefined}
      rel={target ? 'noopener noreferrer' : undefined}
      scroll={false}
      ref={linkRef}
      href={href}
      className={clsx(className || 'p-s', styles.root)}
    >
      <div className={styles.linkContent}>
        <svg ref={svgRef} viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.2338 12.28L14.7538 20.8V0.239998H11.3538V20.76L2.87375 12.28L0.59375 14.56L13.0738 27L25.5138 14.56L23.2338 12.28Z" />
        </svg>
        <span ref={spanRef}>
          <div>{children}</div>
        </span>
      </div>
    </Link>
  );
}

export default LinkText;
