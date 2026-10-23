import { useCallback, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import Link from 'next/link';
import concepts from '@src/constants/concepts';
import styles from '@src/pages/components/projects/styles/projects.module.scss';
import works from '@src/constants/works';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';

function ProjectCard({ project, index }) {
  return (
    <Link
      className={styles.card}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={false}
      tabIndex={0}
    >
      <span className={clsx(styles.shot, styles.projectShot)}>
        <img src={project.img} alt={`${project.name}, ${project.tag} project`} loading="lazy" decoding="async" />
        <span className={styles.view}>View project ↗</span>
      </span>
      <span className={styles.cardHead}>
        <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.cardName}>{project.name}</span>
        <span className={styles.cardTag}>{project.tag}</span>
      </span>
    </Link>
  );
}

function ConceptCard({ concept, index, onOpen }) {
  return (
    <button type="button" className={clsx(styles.card, styles.conceptCard)} aria-haspopup="dialog" onClick={() => onOpen(index)}>
      <span className={clsx(styles.shot, styles.conceptShot)}>
        <img className={styles.conceptBackdrop} src={concept.img} alt="" aria-hidden="true" loading="lazy" />
        <img className={styles.conceptImage} src={concept.img} alt={concept.alt} loading="lazy" decoding="async" />
        <span className={styles.view}>Open study ↗</span>
      </span>
      <span className={styles.cardHead}>
        <span className={styles.cardIndex}>C{index + 1}</span>
        <span className={styles.cardName}>{concept.name}</span>
        <span className={styles.cardTag}>{concept.brand}</span>
      </span>
    </button>
  );
}

function Row({ label, items, renderItem, direction }) {
  return (
    <div className={styles.strip}>
      {label && <span className={styles.stripLabel}>{label}</span>}
      <div className={styles.row}>
        <div className={clsx(styles.track, direction === 'left' ? styles.moveLeft : styles.moveRight)}>
          {items.map((item, index) => (
            <div key={index} className={styles.group}>
              {renderItem(item, index)}
            </div>
          ))}
          {items.map((item, index) => (
            <div key={index + items.length} className={styles.group}>
              {renderItem(item, index)}
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

  const closeConcept = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const stepConcept = useCallback((direction) => {
    setActiveConcept((current) => (current === null ? current : (current + direction + concepts.length) % concepts.length));
  }, []);

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
          label="06 PROJECTS"
          items={works}
          direction="left"
          renderItem={(item, index) => <ProjectCard key={`p-${index}`} project={item} index={index} />}
        />
        <Row
          label="04 VISUAL CONCEPTS"
          items={concepts}
          direction="right"
          renderItem={(item, index) => <ConceptCard key={`c-${index}`} concept={item} index={index} onOpen={openConcept} />}
        />
      </div>

      <div className={clsx(styles.foot, 'layout-block-inner')}>
        <p>Designed, built and shipped by XY Combinator.</p>
        <a href="mailto:contact@xycombinator.com">contact@xycombinator.com</a>
      </div>

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
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            stepConcept(-1);
          }
        }}
      >
        {concept && (
          <div className={styles.dialogInner}>
            <img className={styles.dialogImage} src={concept.img} alt={concept.alt} decoding="async" />
            <div className={styles.dialogMeta}>
              <p className={styles.dialogTitle} id="concept-dialog-title">
                {concept.name}
                <span>{concept.brand}</span>
              </p>
              <p className={styles.dialogNote}>Independent concept study. Not commissioned work.</p>
            </div>
            <div className={styles.dialogNav}>
              <button type="button" className={styles.dialogArrow} aria-label="Previous concept" onClick={() => stepConcept(-1)}>
                ←
              </button>
              <span className={styles.dialogCounter}>
                {String(activeConcept + 1).padStart(2, '0')} / {String(concepts.length).padStart(2, '0')}
              </span>
              <button type="button" className={styles.dialogArrow} aria-label="Next concept" onClick={() => stepConcept(1)}>
                →
              </button>
            </div>
            <button type="button" className={styles.dialogClose} aria-label="Close concept" onClick={closeConcept}>
              ✕
            </button>
          </div>
        )}
      </dialog>
    </section>
  );
}

export default Projects;
