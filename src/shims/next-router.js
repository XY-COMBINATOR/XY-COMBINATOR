const noop = () => {}

const currentPath = () => (typeof window !== 'undefined' ? window.location.pathname : '/')

const events = { on: noop, off: noop, emit: noop }

export function useRouter() {
  const pathname = currentPath()

  return {
    pathname,
    asPath: pathname,
    route: pathname,
    basePath: '',
    isReady: true,
    query: {},
    push: async () => true,
    replace: async () => true,
    reload: noop,
    back: () => (typeof window !== 'undefined' ? window.history.back() : undefined),
    forward: () => (typeof window !== 'undefined' ? window.history.forward() : undefined),
    prefetch: async () => undefined,
    beforePopState: noop,
    events,
    isFallback: false,
  }
}

export default { useRouter }
