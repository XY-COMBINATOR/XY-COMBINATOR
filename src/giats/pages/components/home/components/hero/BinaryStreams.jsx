/**
 * BinaryStreams Component
 * Renders clean, sequential streams of binary digits (0 and 1) flowing in organized
 * parallel arcs around the hero product showcase. Bits move like a tape in one
 * direction with consistent spacing and subtle, non-distracting flicker.
 */
import { useCallback, useEffect, useRef } from 'react';

const MONO_FONT = '"SF Mono", "Cascadia Mono", Consolas, "Roboto Mono", Menlo, monospace';

const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Calculates cubic bezier coordinates at parametric time t.
 */
const pointOnBezier = (p0, p1, p2, p3, t) => {
  const mt = 1 - t;
  const a = mt * mt * mt;
  const b = 3 * mt * mt * t;
  const c = 3 * mt * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
};

/**
 * Calculates cubic bezier tangent vector at parametric time t.
 */
const tangentOnBezier = (p0, p1, p2, p3, t) => {
  const mt = 1 - t;
  const a = 3 * mt * mt;
  const b = 6 * mt * t;
  const c = 3 * t * t;
  return {
    x: a * (p1.x - p0.x) + b * (p2.x - p1.x) + c * (p3.x - p2.x),
    y: a * (p1.y - p0.y) + b * (p2.y - p1.y) + c * (p3.y - p2.y),
  };
};

/**
 * Fixed stream bundles arranged around the product box, matching the
 * reference composition: a fan of parallel lines from the top-left, a pair
 * from the top-right, a horizontal bundle on the right and a bundle running
 * down from the bottom edge. Corner coordinates are expressed in box
 * half-extents, angles in radians (canvas space, y-down).
 */
const BACK_BUNDLES = [
  { corner: [-1, -1], angle: (234 * Math.PI) / 180, count: 4, spacing: 0.038, length: 1.15, bend: 0.05, sizes: [8, 13] },
  { corner: [1, -1], angle: (-71 * Math.PI) / 180, count: 2, spacing: 0.03, length: 1.15, bend: -0.04, sizes: [8, 12] },
  { corner: [1, 0], angle: 2 * (Math.PI / 180), count: 3, spacing: 0.055, length: 0.52, bend: 0.05, sizes: [10, 14] },
  { corner: [-0.1, 1], angle: (86 * Math.PI) / 180, count: 4, spacing: 0.05, length: 0.52, bend: -0.04, sizes: [8, 12] },
];

const FRONT_BUNDLES = [
  { corner: [-0.2, -1.15], angle: (94 * Math.PI) / 180, count: 3, spacing: 0.03, length: 0.55, bend: 0.06, sizes: [6, 10] },
];

/**
 * Builds every sequential binary stream for one layer (back/front).
 * Bits are placed at even intervals along a bezier path and flow together
 * like a tape. Geometry is fully fixed; only the 0/1 characters are random.
 */
const createStreams = (width, height, anchor, isMobile, variant) => {
  const front = variant === 'front';
  const maxDim = Math.max(width, height);
  const scale = Math.min(1.15, Math.max(0.6, maxDim / 1400));
  const half = isMobile ? { w: width * 0.24, h: height * 0.1 } : { w: width * 0.11, h: height * 0.16 };
  const bundles = front ? FRONT_BUNDLES : BACK_BUNDLES;
  const streams = [];

  bundles.forEach((bundle) => {
    const dir = { x: Math.cos(bundle.angle), y: Math.sin(bundle.angle) };
    const perp = { x: -dir.y, y: dir.x };
    const length = bundle.length * maxDim;
    const spacing = bundle.spacing * maxDim;

    for (let i = 0; i < bundle.count; i += 1) {
      const streamIndex = streams.length;
      const offset = (i - (bundle.count - 1) / 2) * spacing;
      const origin = {
        x: anchor.x + bundle.corner[0] * half.w + perp.x * offset,
        y: anchor.y + bundle.corner[1] * half.h + perp.y * offset,
      };
      const far = { x: origin.x + dir.x * length, y: origin.y + dir.y * length };
      const bend = bundle.bend * length;
      const c1 = {
        x: lerp(origin.x, far.x, 0.33) + perp.x * bend,
        y: lerp(origin.y, far.y, 0.33) + perp.y * bend,
      };
      const c2 = {
        x: lerp(origin.x, far.x, 0.67) + perp.x * bend * 0.5,
        y: lerp(origin.y, far.y, 0.67) + perp.y * bend * 0.5,
      };

      // Smaller near the box, larger toward the far end (depth cue)
      const sizeNear = bundle.sizes[0] * scale;
      const sizeFar = bundle.sizes[1] * scale;
      const count = Math.round(Math.max(14, length / (sizeNear * 2)));
      const bits = [];

      // Random binary characters, chosen once per build so they do not flicker per frame
      for (let b = 0; b < count; b += 1) {
        const slot = count === 1 ? 0 : b / (count - 1);
        bits.push({
          slot,
          char: Math.random() < 0.5 ? '1' : '0',
          size: lerp(sizeNear, sizeFar, slot),
          alpha: 0.5 + 0.5 * Math.sin(slot * Math.PI), // fade in/out along path
        });
      }

      streams.push({
        p0: origin,
        p1: c1,
        p2: c2,
        p3: far,
        bits,
        phase: streamIndex * 0.07, // staggered start per stream
        speed: front ? 0.02 : 0.015, // consistent speed, all streams move together
        front,
      });
    }
  });

  return streams;
};


/**
 * Draws an individual sequential stream. Bits flow along the bezier path together.
 */
const drawStream = (ctx, stream, pointer, dpr, time) => {
  const { p0, p1, p2, p3, bits, phase, speed } = stream;
  const count = bits.length;

  // Global stream progress moves over time (tape-like flow)
  const flow = (phase + time * speed) % 1;

  for (let i = 0; i < count; i += 1) {
    const bit = bits[i];
    // Each bit follows the flow with its slot offset
    const t = (bit.slot + flow) % 1;
    const point = pointOnBezier(p0, p1, p2, p3, t);
    const tangent = tangentOnBezier(p0, p1, p2, p3, t);
    const mag = Math.hypot(tangent.x, tangent.y) || 1;
    const cos = tangent.x / mag;
    const sin = tangent.y / mag;

    // Fade based on position along path (dim at ends, bright in middle)
    const pathAlpha = Math.sin(t * Math.PI);
    const alpha = pathAlpha * bit.alpha;

    if (alpha <= 0.03) continue;

    ctx.globalAlpha = alpha;
    ctx.font = `${bit.size}px ${MONO_FONT}`;
    ctx.setTransform(
      cos * dpr,
      sin * dpr,
      -sin * dpr,
      cos * dpr,
      (point.x + pointer.x) * dpr,
      (point.y + pointer.y) * dpr,
    );
    ctx.fillText(bit.char, 0, 0);
  }
};

function BinaryStreams({ anchor, isMobile, variant = 'back', className }) {
  const canvasRef = useRef(null);
  const anchorRef = useRef(anchor);
  const mobileRef = useRef(isMobile);
  const streamsRef = useRef([]);
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    anchorRef.current = anchor;
    mobileRef.current = isMobile;
  }, [anchor, isMobile]);

  /**
   * Rebuilds the animated streams based on container dimensions.
   */
  const buildStreams = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return [];
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return [];
    const currentAnchor = anchorRef.current;
    const anchorPx = { x: currentAnchor.x * rect.width, y: currentAnchor.y * rect.height };
    return createStreams(rect.width, rect.height, anchorPx, mobileRef.current, variant);
  }, [variant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let visible = true;

    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      streamsRef.current = buildStreams();
    };

    const render = (now) => {
      const time = (now - startTimeRef.current) / 1000;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(228, 234, 255, 0.92)';
      streamsRef.current.forEach((stream) => {
        drawStream(ctx, stream, pointer, dpr, time);
      });
      ctx.globalAlpha = 1;
    };

    const loop = (now) => {
      rafId = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      render(now);
    };

    const handlePointer = (event) => {
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * 14;
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * 10;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) startTimeRef.current = performance.now();
    });
    observer.observe(canvas);

    const resizeObserver = new ResizeObserver(() => sizeCanvas());
    resizeObserver.observe(canvas);

    sizeCanvas();
    window.addEventListener('pointermove', handlePointer, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointer);
    };
  }, [buildStreams]);

  useEffect(() => {
    const next = buildStreams();
    if (next.length) streamsRef.current = next;
  }, [anchor.x, anchor.y, isMobile, buildStreams]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

export default BinaryStreams;
