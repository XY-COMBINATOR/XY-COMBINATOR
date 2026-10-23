import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';

const easeOutExpo = (t) => Math.min(1, 1.001 - 2 ** (-10 * t));

const isTextInput = (target) =>
  target instanceof Element && Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));

const isInteractive = (target) =>
  target instanceof Element && Boolean(target.closest('a, button, [role="button"], summary, [tabindex]'));

function useSmoothScrollInteractions(lenis) {
  useIsomorphicLayoutEffect(() => {
    if (!lenis) return undefined;

    const onClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
      if (!link) return;
      if (link.closest('header') || link.closest('#menu')) return;

      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const node = document.querySelector(hash);
      if (!node || lenis.isStopped) return;

      event.preventDefault();
      lenis.scrollTo(node, { duration: 1.5, force: true, easing: easeOutExpo });

      if (window.history?.replaceState) {
        window.history.replaceState(null, '', hash);
      }
    };

    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTextInput(event.target) || lenis.isStopped) return;

      const viewport = window.innerHeight;
      let next = null;

      switch (event.key) {
        case 'ArrowDown':
          next = lenis.scroll + 120;
          break;
        case 'ArrowUp':
          next = lenis.scroll - 120;
          break;
        case 'PageDown':
          next = lenis.scroll + viewport * 0.9;
          break;
        case 'PageUp':
          next = lenis.scroll - viewport * 0.9;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = lenis.limit;
          break;
        case ' ':
          if (isInteractive(event.target)) return;
          next = lenis.scroll + (event.shiftKey ? -viewport * 0.9 : viewport * 0.9);
          break;
        default:
          return;
      }

      event.preventDefault();
      lenis.scrollTo(next, { duration: 0.6, easing: easeOutExpo });
    };

    document.addEventListener('click', onClick);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lenis]);
}

export default useSmoothScrollInteractions;
