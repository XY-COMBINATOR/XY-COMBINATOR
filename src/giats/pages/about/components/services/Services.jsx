import clsx from 'clsx';

import styles from '@src/pages/about/components/services/styles/services.module.scss';
import { useState } from 'react';

import Other from '@src/pages/about/components/services/Other';

import Portal from '@src/pages/about/components/portal/Portal';

function Services() {
  const [portals, setPortals] = useState([]);

  return (
    <>
      <Other setPortals={setPortals} />
      {portals.map((portal) => (
        <Portal fadeIn={portal.fadeIn} key={portal.title}>
          <div className={clsx(styles.hoverTextContainer, portal.fadeIn ? 'fade-in' : 'fade-out')}>
            <div className={clsx('p-l', styles.hoverText)}>{portal.title}</div>
            <div className={clsx('p-l', styles.hoverText)}>{portal.desc}</div>
          </div>
        </Portal>
      ))}
    </>
  );
}

export default Services;
