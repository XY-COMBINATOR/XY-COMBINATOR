/**
 * useDoubleFBO Hook
 * Creates a ping-pong Frame Buffer Object (FBO) pair for iterative GPU shader computations.
 * Allows swapping between read and write buffers seamlessly across simulation steps.
 */
import { useFBO } from '@react-three/drei';
import { useMemo } from 'react';

const useDoubleFBO = (width, height, options) => {
  const read = useFBO(width, height, options);
  const write = useFBO(width, height, options);

  const doubleFBO = useMemo(() => {
    const state = {
      read,
      write,
      swap: () => {
        const temp = state.read;
        state.read = state.write;
        state.write = temp;
      },
      dispose: () => {
        read.dispose();
        write.dispose();
      },
    };
    return state;
  }, [read, write]);

  return doubleFBO;
};

export default useDoubleFBO;
