import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import clsx from 'clsx';
import styles from '@src/pages/about/components/overview/styles/overview.module.scss';
import useIsMobile from '@src/hooks/useIsMobile';

function Overview() {
  const isMobile = useIsMobile();

  return (
    <section className={clsx(styles.root, 'layout-grid-inner')}>
      <div className={styles.title}>
        {isMobile ? (
          <AppearTitle key="mobile-queto">
            <h3 className="h3">The studio&apos;s job is like a</h3>
            <h3 className="h3">
              good host, <span className="medium">making sure</span>
            </h3>
            <h3 className="h3">
              people get a <span className="medium">smooth</span> and
            </h3>
            <h3 className="h3">
              <span className="medium">easy</span> experience.
            </h3>
          </AppearTitle>
        ) : (
          <AppearTitle key="desktop-queto">
            <h3 className="h3">The studio&apos;s job is like a</h3>
            <h3 className="h3">
              good host, <span className="medium">making sure</span> people get
            </h3>
            <h3 className="h3">
              a <span className="medium">smooth</span> and <span className="medium">easy</span> experience.
            </h3>
          </AppearTitle>
        )}
      </div>
      <div className={clsx(styles.text, 'p-l', styles.myStory)}>
        <AppearTitle>
          <span>Some words</span>
        </AppearTitle>
      </div>
      <div className={styles.desc}>
        {!isMobile ? (
          <AppearTitle key="desktop-overview">
            <h6 className="h6">Hey there. We&apos;re a small team of designers and</h6>
            <h6 className="h6">engineers who like turning half-formed ideas into working</h6>
            <h6 className="h6">products. Most of our work starts the same way: someone</h6>
            <h6 className="h6">has an idea and needs it online, fast.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>We care about the parts people actually notice —</h6>
            <h6 className="h6">a page that loads before they give up, a form that does</h6>
            <h6 className="h6">what they expected, a product that feels solid in the hand.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>No big teams, no layers of account management.</h6>
            <h6 className="h6">You talk to the people writing the code.</h6>

            <h6 className={clsx(styles.paddingTop, 'h6')}>XY Combinators.</h6>
          </AppearTitle>
        ) : (
          <AppearTitle key="mobile-overview">
            <h6 className="h6">Hey there. We&apos;re a small team of designers and</h6>
            <h6 className="h6">engineers who like turning half-formed ideas into working</h6>
            <h6 className="h6">products. Most of our work starts the same way: someone</h6>
            <h6 className="h6">has an idea and needs it online, fast.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>We care about the parts people actually notice —</h6>
            <h6 className="h6">a page that loads before they give up, a form that does</h6>
            <h6 className="h6">what they expected, a product that feels solid in the hand.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>No big teams, no layers of account management.</h6>
            <h6 className="h6">You talk to the people writing the code.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>XY Combinators.</h6>
          </AppearTitle>
        )}
      </div>
    </section>
  );
}
export default Overview;
