/**
 * MenuButton Component
 * Accessible trigger for the fullscreen navigation overlay.
 * Synchronizes with ARIA accessibility states (aria-expanded, aria-controls).
 */
import PerspectiveText from '@src/components/animationComponents/perspectiveText/Index';
import clsx from 'clsx';
import styles from '@src/components/dom/navbar/styles/menuButton.module.scss';
import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function MenuButton() {
  const [isMenuOpen, setIsMenuOpen, lenis, isLoading] = useStore(
    useShallow((state) => [state.isMenuOpen, state.setIsMenuOpen, state.lenis, state.isLoading]),
  );

  const handleClick = useCallback(() => {
    if (!isLoading) {
      setIsMenuOpen(true);
      lenis?.stop();
    }
  }, [isLoading, setIsMenuOpen, lenis]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Open main navigation menu"
      aria-expanded={isMenuOpen}
      aria-controls="menu"
      className={clsx('p-xs', styles.button)}
    >
      <PerspectiveText label="Menu" className={clsx('p-x', styles.label)} />
    </button>
  );
}

export default MenuButton;
