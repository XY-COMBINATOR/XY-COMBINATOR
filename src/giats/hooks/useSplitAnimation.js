import SplitType from 'split-type';
import { gsap } from 'gsap';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';

const useSplitAnimation = (ref, styles) => {
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const splitted = new SplitType(ref.current, {
        types: 'chars',
        tagName: 'span',
        charClass: styles.char,
      });

      splitted.chars.forEach((char, i) => {
        char.style.setProperty('--i', i);
      });

      return () => {
        splitted.kill();
      };
    }, ref);

    return () => ctx.kill();
  }, []);
};

export default useSplitAnimation;
