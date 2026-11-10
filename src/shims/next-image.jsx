/**
 * Next.js Image compatibility shim for Vite SPA environment.
 * Maps next/image props onto responsive HTML image elements.
 */
import { forwardRef } from 'react';

const Image = forwardRef(function Image(
  {
    src,
    alt = '',
    fill,
    _priority,
    _sizes,
    _quality,
    _loader,
    _placeholder,
    _blurDataURL,
    _unoptimized,
    objectFit,
    objectPosition,
    ...props
  },
  ref,
) {
  const resolvedSrc = typeof src === 'string' ? src : (src && (src.src || src.default)) || '';
  const fillStyle = fill
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: objectFit || 'cover',
        objectPosition: objectPosition || 'center',
      }
    : {};

  return (
    <img
      ref={ref}
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={{ ...fillStyle, ...props.style }}
      {...props}
    />
  );
});

export default Image;
