import { forwardRef } from 'react'

const Image = forwardRef(function Image(
  { src, alt = '', fill, priority, sizes, quality, loader, placeholder, blurDataURL, unoptimized, objectFit, objectPosition, ...props },
  ref,
) {
  const resolvedSrc = typeof src === 'string' ? src : (src && (src.src || src.default)) || ''
  const fillStyle = fill
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: objectFit || 'cover',
        objectPosition: objectPosition || 'center',
      }
    : {}

  return <img ref={ref} src={resolvedSrc} alt={alt} style={{ ...fillStyle, ...props.style }} {...props} />
})

export default Image
