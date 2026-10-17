import { forwardRef } from 'react'

const Link = forwardRef(function Link({ children, href = '#', scroll, replace, prefetch, legacyBehavior, passHref, locale, shallow, ...props }, ref) {
  const resolvedHref = typeof href === 'string' ? href : (href && href.pathname) || '#'

  return (
    <a ref={ref} href={resolvedHref} {...props}>
      {children}
    </a>
  )
})

export default Link
