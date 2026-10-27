/**
 * BinaryStreams Component
 * Renders curved streams of binary digits (0 and 1) emanating from the 3D product showcase box.
 * Optimized with high-efficiency 2D canvas transforms, requestAnimationFrame interpolation,
 * and ResizeObserver/IntersectionObserver lifecycle management.
 */
import { useCallback, useEffect, useRef } from 'react';

const MONO_FONT = '"SF Mono", "Cascadia Mono", Consolas, "Roboto Mono", Menlo, monospace';

const rand = (min, max) => min + Math.random() * (max - min);

const lerp = (a, b, t) => a + (b - a) * t;

const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

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
 * Factory for creating an individual animated binary stream path.
 */
const createStream = (width, height, anchor, isMobile, variant) => {
  const front = variant === 'front';
  const maxDim = Math.max(width, height);
  const scale = Math.min(1.15, Math.max(0.6, maxDim / 1400));
  const radiusX = (isMobile ? 86 : 140) * scale;
  const radiusY = (isMobile ? 56 : 94) * scale;

  const angle = front ? rand(Math.PI * 0.22, Math.PI * 0.78) : rand(0, Math.PI * 2);
  const length = front ? maxDim * rand(0.3, 0.52) : maxDim * rand(0.55, 1.05);
  const dir = { x: Math.cos(angle), y: Math.sin(angle) };
  const perp = { x: -dir.y, y: dir.x };

  const origin = front
    ? { x: anchor.x + radiusX * 0.3 + rand(-14, 14), y: anchor.y + radiusY * 0.72 + rand(-6, 10) }
    : { x: anchor.x + dir.x * radiusX * rand(0.94, 1.04), y: anchor.y + dir.y * radiusY * rand(0.94, 1.04) };

  const far = { x: origin.x + dir.x * length, y: origin.y + dir.y * length };
  const bend = rand(-0.15, 0.15) * length;
  const c1 = {
    x: lerp(origin.x, far.x, 0.34) + perp.x * bend,
    y: lerp(origin.y, far.y, 0.34) + perp.y * bend,
  };
  const c2 = {
    x: lerp(origin.x, far.x, 0.72) + perp.x * bend * 0.5,
    y: lerp(origin.y, far.y, 0.72) + perp.y * bend * 0.5,
  };

  const sizeNear = (front ? rand(11, 14) : rand(9, 12)) * scale;
  const sizeFar = (front ? rand(19, 26) : rand(15, 23)) * scale;
  const count = Math.round(Math.min(front ? 36 : 44, Math.max(front ? 16 : 20, length / (sizeNear * 1.35))));
  const bits = [];

  for (let i = 0; i < count; i += 1) {
    const slot = count === 1 ? 0 : i / (count - 1);
    if (i > 0 && i < count - 1 && Math.random() < 0.06) continue;
    bits.push({
      slot,
      char: Math.random() > 0.5 ? '1' : '0',
      alpha: rand(0.7, 1),
      offset: rand(-0.0015, 0.0015),
      cos: 0,
      sin: 0,
      x: 0,
      y: 0,
      size: 0,
      visible: false,
    });
  }

  return {
    p0: origin,
    p1: c1,
    p2: c2,
    p3: far,
    sizeNear,
    sizeFar,
    phase: Math.random(),
    speed: front ? rand(0.016, 0.026) : rand(0.012, 0.022),
    bits,
    front,
  };
};

/**
 * Draws an individual stream and its associated glyphs onto the canvas context.
 */
const drawStream = (ctx, stream, pointer, dpr) => {
  const { p0, p1, p2, p3, sizeNear, sizeFar, phase, bits, front } = stream;
  const count = bits.length;

  for (let i = 0; i < count; i += 1) {
    const bit = bits[i];
    const t = (bit.slot + phase + bit.offset + 1) % 1;
    const progress = easeOutQuad(t);

    const point = pointOnBezier(p0, p1, p2, p3, progress);
    const tangent = tangentOnBezier(p0, p1, p2, p3, progress);
    const mag = Math.hypot(tangent.x, tangent.y) || 1;
    const cos = tangent.x / mag;
    const sin = tangent.y / mag;

    const size = Math.round(lerp(sizeNear, sizeFar, progress));
    const distFade = Math.sin(t * Math.PI);
    const baseAlpha = front ? 0.95 : 0.85;
    const alpha = distFade * baseAlpha * bit.alpha;

    if (alpha <= 0.02) continue;

    ctx.globalAlpha = alpha;
    ctx.font = `500 ${size}px ${MONO_FONT}`;
    ctx.setTransform(cos * dpr, sin * dpr, -sin * dpr, cos * dpr, (point.x + pointer.x) * dpr, (point.y + pointer.y) * dpr);
    ctx.fillText(bit.char, 0, 0);

    // Subtle dynamic bit flipping effect
    if (Math.random() < 0.0035) bit.char = bit.char === '0' ? '1' : '0';
  }
};

function BinaryStreams({ anchor, isMobile, variant = 'back', className }) {
  const canvasRef = useRef(null);
  const anchorRef = useRef(anchor);
  const mobileRef = useRef(isMobile);
  const streamsRef = useRef([]);

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
    const count = variant === 'front' ? (mobileRef.current ? 2 : 3) : mobileRef.current ? 8 : 14;
    return Array.from({ length: count }, () => createStream(rect.width, rect.height, anchorPx, mobileRef.current, variant));
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
    let lastTime = performance.now();

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

    const render = (dt) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(228, 234, 255, 0.92)';
      streamsRef.current.forEach((stream) => {
        stream.phase = (stream.phase + stream.speed * dt) % 1;
        drawStream(ctx, stream, pointer, dpr);
      });
      ctx.globalAlpha = 1;
    };

    const loop = (now) => {
      rafId = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      if (!visible || document.hidden) return;

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      render(dt);
    };

    const handlePointer = (event) => {
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * 18;
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * 12;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) lastTime = performance.now();
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
