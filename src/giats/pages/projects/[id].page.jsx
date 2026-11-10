/**
 * Project Detail Page Component
 * Renders individual project showcases with pinned sticky meta information,
 * dynamic theme color adaptation, and next project recommendations.
 */
/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useMemo, useRef } from 'react';
import CustomHead from '@src/components/dom/CustomHead';
import NextProject from '@src/pages/projects/components/nextProject/NextProject';
import ProjectDetails from '@src/pages/projects/components/projectDetails/ProjectDetails';
import ProjectImages from '@src/pages/projects/components/projectsImages/ProjectImages';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import clsx from 'clsx';
import { gsap } from 'gsap';
import projects from '@src/constants/projects';
import styles from '@src/pages/projects/project.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';
import { useIsomorphicLayoutEffect } from '@src/hooks/useIsomorphicLayoutEffect';
import { useShallow } from 'zustand/react/shallow';
import { useStore } from '@src/store';
import { useWindowSize } from '@darkroom.engineering/hamo';

function Page({ id }) {
  const isMobile = useIsMobile();
  const rightContainerRef = useRef(null);
  const leftContainerRef = useRef(null);
  const [isLoading, setFluidColor] = useStore(useShallow((state) => [state.isLoading, state.setFluidColor]));
  const windowSize = useWindowSize();

  const projectIndex = useMemo(() => {
    const idx = projects.findIndex((project) => project.id === id);
    return idx !== -1 ? idx : 0;
  }, [id]);

  const currentProject = useMemo(() => projects[projectIndex], [projectIndex]);

  const updateCSSVariables = (project) => {
    if (!project) return;
    gsap.set('html', {
      '--black': project.primary,
      '--white': project.secondary,
      '--accentColor': project.accentColor,
      '--fillColor': project.fillColor,
      '--menuColor': project.menuColor,
      '--menuFontColor': project.menuFontColor,
    });
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!isLoading && !isMobile && rightContainerRef.current && leftContainerRef.current) {
        ScrollTrigger.create({
          id: 'project',
          trigger: rightContainerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: leftContainerRef.current,
          scrub: true,
          scroller: document?.querySelector('main'),
          invalidateOnRefresh: true,
          pinSpacing: false,
        });
      }
    });

    return () => {
      ctx.kill();
      ScrollTrigger.getById('project')?.kill();
    };
  }, [isMobile, isLoading, windowSize.width]);

  useEffect(() => {
    if (currentProject) {
      updateCSSVariables(currentProject);
      setFluidColor(currentProject.fluidColor);
    }
    return () => {
      updateCSSVariables({
        primary: '#28282b',
        secondary: '#f0f4f1',
        accentColor: '#f9f9f9',
        fillColor: '#f2ffbd',
        menuColor: '#28282b',
        menuFontColor: '#f0f4f1',
      });
      setFluidColor('#d7d7d4');
    };
  }, [currentProject, setFluidColor]);

  const seo = useMemo(
    () => ({
      title: `XY Combinator — ${currentProject?.title || 'Project'}`,
      description: `Explore the ${currentProject?.title || 'showcase'} built by XY Combinator, delivering high-performance design and engineering.`,
      keywords: [
        'XY Combinator',
        currentProject?.title,
        'Design Studio',
        'Engineering Studio',
        'Web Development',
        'React',
        'Next.js',
      ].filter(Boolean),
    }),
    [currentProject],
  );

  if (!currentProject) return null;

  return (
    <>
      <CustomHead {...seo} />
      <section className={clsx(styles.root, 'layout-grid-inner')}>
        <div ref={leftContainerRef} className={styles.leftContainer}>
          <ProjectDetails project={currentProject} />
        </div>
        <div ref={rightContainerRef} className={styles.rightContainer}>
          <ProjectImages project={currentProject} />
        </div>
      </section>
      <NextProject nextProject={projectIndex === projects.length - 1 ? projects[0] : projects[projectIndex + 1]} />
    </>
  );
}

export default Page;
