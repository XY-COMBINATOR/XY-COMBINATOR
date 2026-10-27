/**
 * Next.js Link compatibility shim for Vite SPA environment.
 * Maps next/link props onto standard semantic HTML anchor tags.
 */
import { forwardRef } from 'react';

const Link = forwardRef(function Link(
  {
    children,
    href = '#',
    _scroll,
    _replace,
    _prefetch,
    _legacyBehavior,
    _passHref,
    _locale,
    _shallow,
    ...props
  },
  ref,
) {
  const resolvedHref = typeof href === 'string' ? href : (href && href.pathname) || '#';

  return (
    <a ref={ref} href={resolvedHref} {...props}>
      {children}
    </a>
  );
});

export default Link;
