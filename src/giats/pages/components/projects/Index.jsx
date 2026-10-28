/**
 * Projects Component
 * Renders dynamic horizontal carousel strips of selected creations and conceptual design studies.
 *
 * Interaction model:
 *   - The strips auto-scroll continuously via CSS animation.
 *   - On hover/touch START: the strip decelerates smoothly (6x slower) so visitors can inspect cards.
 *   - Pointer DRAG: grab the strip and drag horizontally — it follows the hand precisely.
 *     Release it and the animation resumes from the current drag-offset position, then eases back to normal.
 *   - Cards remain fully clickable; a short drag (< 6 px) is treated as a tap/click.
 *   - No text UI labels are ever shown — all interactions are purely intuitive.
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
 * Continuous marquee row with:
 *   - Smooth deceleration on hover (6x slower, CSS transition on animation-duration)
 *   - Pointer drag-to-scroll: grab and move horizontally; drag follows the hand
 *   - Post-drag: animation resumes; drag offset eases back to 0 over ~600 ms
 *   - Click vs drag: moves < 6 px count as taps so card clicks still fire
 */
function Row({ label, items, renderItem, direction }) {
  const stripRef = useRef(null);
  const trackRef = useRef(null);
  const rowRef = useRef(null);

  /* Base animation duration from item count */
  const baseDuration = Math.max(18, items.length * 3.2);

  /* Drag state — kept in a ref to avoid re-renders on every pointer move */
  const drag = useRef({
    active: false,
    startX: 0,
    lastX: 0,
    delta: 0,       /* total px dragged this session */
    velocity: 0,    /* px / ms at release */
    rafId: null,
    offset: 0,      /* accumulated drag offset in px, persists across sessions */
  });

  /* Apply current drag offset to the track as a translateX transform that
     stacks ON TOP of the CSS keyframe animation (which drives translateX via
     the animation engine). We use a wrapper layer approach: the `.row` clips,
     the `.track` animates normally, and a `data-drag-wrap` div inside `.row`
     carries the drag translation. */
  const applyOffset = useCallback((px) => {
    const wrap = rowRef.current;
    if (!wrap) return;
    wrap.style.transform = `translateX(${px}px)`;
  }, []);

  /* Ease the drag offset back to 0 after release */
  const easeBack = useCallback(() => {
    const d = drag.current;
    if (d.rafId) cancelAnimationFrame(d.rafId);

    let start = null;
    const from = d.offset;
    const duration = 600;

    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      /* Ease-out cubic */
      const eased = 1 - (1 - progress) ** 3;
      const current = from * (1 - eased);
      d.offset = current;
      applyOffset(current);
      if (progress < 1) {
        d.rafId = requestAnimationFrame(step);
      } else {
        d.offset = 0;
        applyOffset(0);
      }
    }

    d.rafId = requestAnimationFrame(step);
  }, [applyOffset]);

  /* Slow-down on hover (not active drag) */
  const handleMouseEnter = useCallback(() => {
    if (drag.current.active) return;
    if (trackRef.current) {
      trackRef.current.style.animationDuration = `${baseDuration * 6}s`;
    }
  }, [baseDuration]);

  const handleMouseLeave = useCallback(() => {
    if (drag.current.active) return;
    if (trackRef.current) {
      trackRef.current.style.animationDuration = `${baseDuration}s`;
    }
  }, [baseDuration]);

  /* ---- Pointer drag handlers ---- */
  const onPointerDown = useCallback((e) => {
    /* Only primary button / single touch */
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const d = drag.current;
    if (d.rafId) cancelAnimationFrame(d.rafId);

    d.active = true;
    d.startX = e.clientX;
    d.lastX = e.clientX;
    d.delta = 0;
    d.velocity = 0;

    /* Slow animation while dragging */
    if (trackRef.current) {
      trackRef.current.style.animationDuration = `${baseDuration * 6}s`;
    }

    /* Capture pointer so move/up fire even outside element */
    e.currentTarget.setPointerCapture(e.pointerId);

    /* Prevent text selection during drag */
    e.preventDefault();
  }, [baseDuration]);

  const onPointerMove = useCallback((e) => {
    const d = drag.current;
    if (!d.active) return;

    const dx = e.clientX - d.lastX;
    d.velocity = dx;
    d.lastX = e.clientX;
    d.delta = e.clientX - d.startX;
    d.offset += dx;

    applyOffset(d.offset);
  }, [applyOffset]);

  const onPointerUp = useCallback((e) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;

    /* Restore normal animation speed */
    if (trackRef.current) {
      trackRef.current.style.animationDuration = `${baseDuration}s`;
    }

    /* If the pointer barely moved, treat it as a click — do nothing special */
    if (Math.abs(d.delta) < 6) {
      easeBack();
      return;
    }

    /* Apply a momentum flick, then ease back */
    d.offset += d.velocity * 8;
    applyOffset(d.offset);
    easeBack();
  }, [baseDuration, applyOffset, easeBack]);

  /* Touch equivalents (for devices that only fire touch, not pointer) */
  const onTouchStart = useCallback(() => {
    if (trackRef.current && !drag.current.active) {
      trackRef.current.style.animationDuration = `${baseDuration * 6}s`;
    }
  }, [baseDuration]);

  const onTouchEnd = useCallback(() => {
    if (!drag.current.active && trackRef.current) {
      trackRef.current.style.animationDuration = `${baseDuration}s`;
    }
  }, [baseDuration]);

  /* Suppress clicks on child elements if the user dragged more than 6 px */
  const onClickCapture = useCallback((e) => {
    if (Math.abs(drag.current.delta) >= 6) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, []);

  /* Cleanup any pending rAF on unmount */
  useEffect(() => {
    return () => {
      if (drag.current.rafId) cancelAnimationFrame(drag.current.rafId);
    };
  }, []);

  return (
    <div
      ref={stripRef}
      className={styles.strip}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {label && <span className={styles.stripLabel}>{label}</span>}

      {/* The .row clips overflow; the drag wrapper shifts without clipping */}
      <div className={styles.row}>
        <div
          ref={rowRef}
          className={styles.dragWrap}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={onClickCapture}
        >
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
            {/* Duplicate loop stream for seamless continuous marquee */}
            {items.map((item, index) => (
              <div key={`loop-${index}`} className={styles.group}>
                {renderItem(item, index, 'loop')}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const rootRef = useRef(null);
  const dialogRef = useRef(null);
  const [activeConcept, setActiveConcept] = useState(null);
  const [lenis] = useStore(useShallow((state) => [state.lenis]));

  /**
   * Opens the modal dialog for a selected concept study and pauses page scrolling.
   */
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

  /**
   * Closes the dialog modal.
   */
  const closeConcept = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  /**
   * Steps forward or backward through the concept carousel inside the modal.
   */
  const stepConcept = useCallback((direction) => {
    setActiveConcept((current) =>
      current === null ? current : (current + direction + concepts.length) % concepts.length,
    );
  }, []);

  /**
   * Resumes page scroll when dialog is closed via escape key or close button.
   */
  const handleDialogClose = useCallback(() => {
    setActiveConcept(null);
    lenis?.start();
  }, [lenis]);

  const concept = activeConcept === null ? null : concepts[activeConcept];

  return (
    <section ref={rootRef} id="work" className={styles.root} data-header-theme="dark">
      {/* Top fade — blends the dark studio section into this section */}
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
