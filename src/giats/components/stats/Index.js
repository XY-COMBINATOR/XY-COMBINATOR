import { useFrame } from '@darkroom.engineering/hamo';
import { useMemo } from 'react';
import _Stats from 'stats.js';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';

function Stats() {
  const stats = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new _Stats();
    }
    return undefined;
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(stats.dom);
    }

    return () => {
      stats.dom.remove();
    };
  }, [stats]);

  useFrame(() => {
    stats.begin();
  }, -Infinity);

  useFrame(() => {
    stats.end();
  }, Infinity);

  return null;
}
export default Stats;
