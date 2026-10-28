/**
 * Projects Component
 * Renders continuous horizontal marquee strips of selected creations and concept studies.
 *
 * Interaction model (purely intuitive, zero text labels):
 *   Hover / touch   → strip smoothly decelerates (6x slower) for comfortable reading.
 *   Pointer drag    → grabs the strip exactly like a physical conveyor belt.
 *                     Drag left/right and the content follows the hand 1:1.
 *                     On release the animation resumes seamlessly from the drag position.
 *   Cards           → moves < 6 px are treated as taps, so clicks still open projects/modals.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import concepts from '@src/constants/concepts';
import styles from '@src/pages/components/projects/styles/projects.module.scss';
import works from '@src/constants/works';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

/**
 * Card showcasing a production project with outbound link.
 */
function ProjectCard({ project, index }) {
  return (
    <Link
      className={styles.card}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View live project: ${project.name} (${project.tag})`}
      tabIndex={0}
    >
      <span className={clsx(styles.shot, styles.projectShot)}>
        <img
          src={project.img}
          alt={`${project.name} - ${project.tag} showcase preview`}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <span className={styles.view}>View project</span>
      </span>
      <span className={styles.cardHead}>
        <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.cardName}>{project.name}</span>
        <span className={styles.cardTag}>{project.tag}</span>
      </span>
    </Link>
  );
}

/**
 * Card showcasing a brand concept study with modal preview.
 */
function ConceptCard({ concept, index, onOpen }) {
  return (
    <button
      type="button"
      className={clsx(styles.card, styles.conceptCard)}
      aria-haspopup="dialog"
      aria-label={`Open concept study for ${concept.name} (${concept.brand})`}
      onClick={() => onOpen(index)}
    >
      <span className={clsx(styles.shot, styles.conceptShot)}>
        <img
          className={styles.conceptBackdrop}
          src={concept.img}
          alt=""
          aria-hidden="true"
          loading="lazy"
          draggable={false}
        />
        <img
          className={styles.conceptImage}
          src={concept.img}
          alt={concept.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <span className={styles.view}>Open study</span>
      </span>
      <span className={styles.cardHead}>
        <span className={styles.cardIndex}>C{index + 1}</span>
        <span className={styles.cardName}>{concept.name}</span>
        <span className={styles.cardTag}>{concept.brand}</span>
      </span>
    </button>
  );
}

/**
 * Returns the current translateX value in px from a computed CSS transform string.
 * Uses DOMMatrix when available (all modern browsers), falls back to regex.
 */
function readCurrentX(element) {
  const transform = getComputedStyle(element).transform;
  if (!transform || transform === 'none') return 0;
  try {
    return new DOMMatrix(transform).m41;
  } catch {
    const match = transform.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+),/);
    return match ? parseFloat(match[1]) : 0;
  }
}

/**
 * Continuous marquee row.
 *
 * Drag-to-scroll algorithm:
 *   1. pointerdown  → read animated position via DOMMatrix, pause animation, fix transform
 *   2. pointermove  → update transform = capturedX + totalDragDelta (wraps for infinite feel)
 *   3. pointerup    → calculate animation-delay that puts the animation at the current px offset,
 *                     then resume — the strip continues from exactly where the hand left it.
 */
function Row({ label, items, renderItem, direction }) {
  const stripRef = useRef(null);
  const trackRef = useRef(null);

  const baseDuration = Math.max(18, items.length * 3.2);

  /* Mutable drag state — no re-renders needed */
  const ds = useRef({
    active: false,
    startX: 0,
    totalDelta: 0,
    capturedX: 0,
    halfWidth: 0,
  });

  /* ── Decelerate on hover (when not dragging) ── */
  const onMouseEnter = useCallback(() => {
    if (!ds.current.active && trackRef.current) {
      trackRef.current.style.animationDuration = `${baseDuration * 6}s`;
    }
  }, [baseDuration]);

  const onMouseLeave = useCallback(() => {
    if (!ds.current.active && trackRef.current) {
      trackRef.current.style.animationDuration = `${baseDuration}s`;
    }
  }, [baseDuration]);

  /* ── Drag start ── */
  const onPointerDown = useCallback((e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    /* Read where the animation currently is */
    const currentX = readCurrentX(track);

    /* Freeze animation at this pixel */
    track.style.animationPlayState = 'paused';
    track.style.transform = `translateX(${currentX}px)`;

    ds.current = {
      active: true,
      startX: e.clientX,
      totalDelta: 0,
      capturedX: currentX,
      halfWidth: track.scrollWidth / 2,
    };

    /* Capture pointer for reliable move/up even outside strip */
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();

    /* Switch cursor */
    if (stripRef.current) stripRef.current.style.cursor = 'grabbing';
  }, []);

  /* ── Drag move — follows hand 1:1 ── */
  const onPointerMove = useCallback((e) => {
    const d = ds.current;
    if (!d.active) return;
    const track = trackRef.current;
    if (!track) return;

    d.totalDelta = e.clientX - d.startX;

    let newX = d.capturedX + d.totalDelta;

    /* Wrap within the infinite loop range so it never feels like it stops */
    const half = d.halfWidth;
    if (newX > 0) newX -= half;
    if (newX < -half) newX += half;

    track.style.transform = `translateX(${newX}px)`;
  }, []);

  /* ── Drag end — resume animation from current position ── */
  const onPointerUp = useCallback(() => {
    const d = ds.current;
    if (!d.active) return;
    d.active = false;

    const track = trackRef.current;
    if (!track) return;

    if (stripRef.current) stripRef.current.style.cursor = '';

    /* Read the final dragged position */
    const finalX = readCurrentX(track);
    const half = d.halfWidth || track.scrollWidth / 2;
    const dur = baseDuration;

    /*
     * Work out what animation-delay puts the animation at finalX.
     *
     * marqueeLeft  : goes 0 → -half  over `dur` seconds.
     *   progress   = finalX / (-half)         → [0, 1)
     *   delay      = -progress * dur          (negative = start partway through)
     *
     * marqueeRight : goes -half → 0 over `dur` seconds.
     *   progress   = 1 - finalX / (-half)     → [0, 1)
     */
    let progress = direction === 'left'
      ? finalX / -half
      : 1 - finalX / -half;

    /* Keep in [0, 1) */
    progress = ((progress % 1) + 1) % 1;

    /* Clear the frozen transform and resume with adjusted delay */
    track.style.transform = '';
    track.style.animationDelay = `-${progress * dur}s`;
    track.style.animationDuration = `${dur}s`;
    track.style.animationPlayState = 'running';
  }, [baseDuration, direction]);

  /* Suppress click on child if drag moved more than 6 px */
  const onClickCapture = useCallback((e) => {
    if (Math.abs(ds.current.totalDelta) >= 6) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, []);

  /* Touch-only devices: just decelerate; pointer events handle drag on hybrid */
  const onTouchStart = useCallback(() => {
    if (!ds.current.active && trackRef.current) {
      trackRef.current.style.animationDuration = `${baseDuration * 6}s`;
    }
  }, [baseDuration]);

  const onTouchEnd = useCallback(() => {
    if (!ds.current.active && trackRef.current) {
      trackRef.current.style.animationDuration = `${baseDuration}s`;
    }
  }, [baseDuration]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      ds.current.active = false;
    };
  }, []);

  return (
    <div
      ref={stripRef}
      className={styles.strip}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
    >
      {label && <span className={styles.stripLabel}>{label}</span>}
      <div className={styles.row}>
        <div
          ref={trackRef}
          className={clsx(
            styles.track,
            direction === 'left' ? styles.moveLeft : styles.moveRight,
          )}
          style={{ animationDuration: `${baseDuration}s` }}
        >
          {/* Primary stream */}
          {items.map((item, index) => (
            <div key={`primary-${index}`} className={styles.group}>
              {renderItem(item, index, 'primary')}
            </div>
          ))}
          {/* Duplicate loop stream for seamless infinite marquee */}
          {items.map((item, index) => (
            <div key={`loop-${index}`} className={styles.group}>
              {renderItem(item, index, 'loop')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Main Projects section
   ═══════════════════════════════════════════════════ */
function Projects() {
  const rootRef = useRef(null);
  const dialogRef = useRef(null);
  const [activeConcept, setActiveConcept] = useState(null);
  const [lenis] = useStore(useShallow((state) => [state.lenis]));

  /** Opens the modal for a concept study and pauses page scrolling. */
  const openConcept = useCallback(
    (index) => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      setActiveConcept(index);
      if (!dialog.open && typeof dialog.showModal === 'function') {
        dialog.showModal();
        lenis?.stop();
      }
    },
    [lenis],
  );

  /** Closes the concept modal. */
  const closeConcept = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  /** Steps through concept carousel inside the modal. */
  const stepConcept = useCallback((direction) => {
    setActiveConcept((current) =>
      current === null ? current : (current + direction + concepts.length) % concepts.length,
    );
  }, []);

  /** Resumes page scroll when modal closes. */
  const handleDialogClose = useCallback(() => {
    setActiveConcept(null);
    lenis?.start();
  }, [lenis]);

  const concept = activeConcept === null ? null : concepts[activeConcept];

  return (
    <section ref={rootRef} id="work" className={styles.root} data-header-theme="dark">
      {/* Gradient veil that blends the studio section into this one */}
      <span className={styles.topFade} aria-hidden="true" />
      <span className={styles.bgMesh} aria-hidden="true" />

      <div className={clsx(styles.head, 'layout-block-inner')}>
        <p className={styles.kicker}>Our work</p>
        <div className={styles.headRow}>
          <h2 className={styles.title}>Selected Creations</h2>
          <div className={styles.meta}>
            <span>{String(works.length).padStart(2, '0')} projects</span>
            <span>{String(concepts.length).padStart(2, '0')} visual concepts</span>
          </div>
        </div>
      </div>

      <div className={styles.strips}>
        <Row
          label={`${String(works.length).padStart(2, '0')} PROJECTS`}
          items={works}
          direction="left"
          renderItem={(item, index, streamPrefix) => (
            <ProjectCard key={`p-${streamPrefix}-${index}`} project={item} index={index} />
          )}
        />
        <Row
          label={`${String(concepts.length).padStart(2, '0')} VISUAL CONCEPTS`}
          items={concepts}
          direction="right"
          renderItem={(item, index, streamPrefix) => (
            <ConceptCard
              key={`c-${streamPrefix}-${index}`}
              concept={item}
              index={index}
              onOpen={openConcept}
            />
          )}
        />
      </div>

      <div className={clsx(styles.foot, 'layout-block-inner')}>
        <p>Designed, built and shipped by XY Combinator.</p>
        <a href="mailto:contact@xycombinator.com" rel="noopener noreferrer">
          contact@xycombinator.com
        </a>
      </div>

      {/* Accessible Modal Dialog for Concept Studies */}
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={concept ? 'concept-dialog-title' : undefined}
        data-lenis-prevent-wheel
        onClose={handleDialogClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeConcept();
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            stepConcept(1);
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            stepConcept(-1);
          } else if (event.key === 'Escape') {
            closeConcept();
          }
        }}
      >
        {concept && (
          <div className={styles.dialogInner}>
            <img
              className={styles.dialogImage}
              src={concept.img}
              alt={concept.alt}
              decoding="async"
              draggable={false}
            />
            <div className={styles.dialogMeta}>
              <p className={styles.dialogTitle} id="concept-dialog-title">
                {concept.name}
                <span>{concept.brand}</span>
              </p>
              <p className={styles.dialogNote}>Independent concept study. Not commissioned work.</p>
            </div>
            <div className={styles.dialogNav}>
              <button
                type="button"
                className={styles.dialogArrow}
                aria-label="Previous concept study"
                onClick={() => stepConcept(-1)}
              >
                &larr;
              </button>
              <span className={styles.dialogCounter} aria-live="polite">
                {String(activeConcept + 1).padStart(2, '0')} / {String(concepts.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                className={styles.dialogArrow}
                aria-label="Next concept study"
                onClick={() => stepConcept(1)}
              >
                &rarr;
              </button>
            </div>
            <button
              type="button"
              className={styles.dialogClose}
              aria-label="Close concept view"
              onClick={closeConcept}
            >
              &times;
            </button>
          </div>
        )}
      </dialog>
    </section>
  );
}

export default Projects;
