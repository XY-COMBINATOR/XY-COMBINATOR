/**
 * BinaryStreams Component
 * Renders clean, sequential streams of binary digits (0 and 1) flowing in organized
 * parallel arcs around the hero product showcase. Bits move like a tape in one
 * direction with consistent spacing and subtle, non-distracting flicker.
 */
import { useCallback, useEffect, useRef } from 'react';

const MONO_FONT = '"SF Mono", "Cascadia Mono", Consolas, "Roboto Mono", Menlo, monospace';

const rand = (min, max) => min + Math.random() * (max - min);

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
 * Factory for creating an individual sequential binary stream.
 * Bits are placed at even intervals along a bezier path and flow together like a tape.
 */
const createStream = (width, height, anchor, isMobile, variant, streamIndex, totalStreams) => {
  const front = variant === 'front';
  const maxDim = Math.max(width, height);
  const scale = Math.min(1.15, Math.max(0.6, maxDim / 1400));

  // Organized angles: 11 streams distributed as 2 top + 3 left + 3 right + 3 bottom
  let angle;
  if (front) {
    angle = rand(Math.PI * 0.35, Math.PI * 0.65);
  } else {
    // Distribution: indices 0-1 → top (2 streams), 2-4 → left (3 streams),
    //               indices 5-7 → right (3 streams), 8-10 → bottom (3 streams)
    const idx = streamIndex;
    if (idx <= 1) {
      // 2 from top: angles near 3PI/2 (upward in math, upward on screen since y-down)
      angle = rand(Math.PI * 1.2, Math.PI * 1.3);
    } else if (idx <= 4) {
      // 3 from left: angles near PI (leftward)
      angle = rand(Math.PI - 0.3, Math.PI + 0.3);
    } else if (idx <= 7) {
      // 3 from right: angles near 0 (rightward)
      angle = rand(-Math.PI * 0.15, Math.PI * 0.15);
    } else {
      // 3 from bottom: angles near PI/2 (downward)
      angle = rand(Math.PI * 0.45, Math.PI * 0.55);
    }
  }

  const length = front ? maxDim * rand(0.28, 0.42) : maxDim * rand(0.45, 0.75);
  const dir = { x: Math.cos(angle), y: Math.sin(angle) };
  const perp = { x: -dir.y, y: dir.x };

  // Origin points organized around anchor with slight perpendicular offset per stream
  const originOffset = (streamIndex - (totalStreams - 1) / 2) * (isMobile ? 16 : 26);
  const origin = {
    x: anchor.x + perp.x * originOffset + dir.x * (isMobile ? 40 : 70) * scale,
    y: anchor.y + perp.y * originOffset + dir.y * (isMobile ? 40 : 70) * scale,
  };

  const far = { x: origin.x + dir.x * length, y: origin.y + dir.y * length };

  // Gentle consistent bend, alternating direction per stream
  const bend = (streamIndex % 2 === 0 ? 1 : -1) * rand(0.08, 0.14) * length;
  const c1 = {
    x: lerp(origin.x, far.x, 0.33) + perp.x * bend,
    y: lerp(origin.y, far.y, 0.33) + perp.y * bend,
  };
  const c2 = {
    x: lerp(origin.x, far.x, 0.67) + perp.x * bend * 0.5,
    y: lerp(origin.y, far.y, 0.67) + perp.y * bend * 0.5,
  };

  // Consistent sizes: smaller near origin, larger toward far end
  const sizeNear = (front ? 10 : 8) * scale;
  const sizeFar = (front ? 16 : 13) * scale;

  // Even bit count with consistent spacing along the path
  const count = front ? Math.round(Math.max(14, length / (sizeNear * 1.5))) : Math.round(Math.max(18, length / (sizeNear * 1.4)));
  const bits = [];

  // Pre-generate a pseudo-random binary sequence that stays fixed (no random flipping per frame)
  for (let i = 0; i < count; i += 1) {
    const slot = count === 1 ? 0 : i / (count - 1);
    const char = (i * 3 + streamIndex * 7) % 3 === 0 ? '1' : '0';
    bits.push({
      slot,
      char,
      size: lerp(sizeNear, sizeFar, slot),
      alpha: 0.5 + 0.5 * Math.sin(slot * Math.PI), // fade in/out along path
      x: 0,
      y: 0,
      cos: 1,
      sin: 0,
    });
  }

  return {
    p0: origin,
    p1: c1,
    p2: c2,
    p3: far,
    bits,
    phase: streamIndex * 0.07, // staggered start per stream
    speed: front ? 0.02 : 0.015, // consistent speed, all streams move together
    front,
  };
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
    // 3 from bottom + 3 from right + 3 from left + 2 from top = 11 total streams
    const total = 11;
    const count = variant === 'front' ? (mobileRef.current ? 2 : 3) : total;
    return Array.from({ length: count }, (_, i) =>
      createStream(rect.width, rect.height, anchorPx, mobileRef.current, variant, i, total),
    );
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
