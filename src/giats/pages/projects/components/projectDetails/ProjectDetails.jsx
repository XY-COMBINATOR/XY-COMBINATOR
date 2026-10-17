import ButtonLink from '@src/components/animationComponents/buttonLink/Index';
/* eslint-disable react/no-array-index-key */
import clsx from 'clsx';
import styles from '@src/pages/projects/components/projectDetails/styles/projectDetails.module.scss';

function ProjectDetails({ project }) {
  return (
    <div className={styles.root}>
      <h3 className={clsx(styles.title, 'h3')}>{project.title}</h3>
      <h4 className={clsx(styles.date, 'h4')}>({project.date})</h4>
      <div className={styles.others}>
        <div className={styles.desc}>
          {project.desc.map((des, index) => (
            <div className="p-l" key={`${project.title}-${index}`}>
              {des}
            </div>
          ))}
        </div>
        {project.liveLink ? (
          <div className={styles.buttonContainer}>
            <ButtonLink target href={project.liveLink} label="VISIT LIVE SITE" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
export default ProjectDetails;
