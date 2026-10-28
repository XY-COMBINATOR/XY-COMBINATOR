/**
 * Projects Component
 * Renders dynamic horizontal carousel strips of selected creations and conceptual design studies.
 * On hover or touch, the strip gently decelerates so visitors can comfortably inspect each card.
 * No text UI labels are used — interactions are purely intuitive and visual.
 */
import { useCallback, useRef, useState } from 'react';
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
 * Continuous marquee row that smoothly decelerates on hover or touch,
 * giving visitors time to read and interact with cards.
 * No text labels or pause buttons — behavior is purely visual and intuitive.
 */
function Row({ label, items, renderItem, direction }) {
  const trackRef = useRef(null);
  const duration = Math.max(18, items.length * 3.2);

  /* On hover or touch: slow the strip to a gentle crawl (6x slower). */
  const handleSlowStart = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.style.animationDuration = `${duration * 6}s`;
    }
  }, [duration]);

  /* On leave or touch end: restore the normal speed. */
  const handleSlowEnd = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.style.animationDuration = `${duration}s`;
    }
  }, [duration]);

  return (
    <div
      className={styles.strip}
      onMouseEnter={handleSlowStart}
      onMouseLeave={handleSlowEnd}
      onTouchStart={handleSlowStart}
      onTouchEnd={handleSlowEnd}
    >
      {label && <span className={styles.stripLabel}>{label}</span>}
      <div className={styles.row}>
        <div
          ref={trackRef}
          className={clsx(
            styles.track,
            direction === 'left' ? styles.moveLeft : styles.moveRight,
          )}
          style={{ animationDuration: `${duration}s` }}
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
   * Steps forward or backward through the concept carousel.
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
