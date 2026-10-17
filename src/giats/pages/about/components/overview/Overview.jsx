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
            <h3 className="h3">The front-end developer&apos;s role </h3>
            <h3 className="h3">
              is like a kind host, <span className="medium">ensuring</span>
            </h3>
            <h3 className="h3">
              visitors have a <span className="medium">smooth</span> and
            </h3>
            <h3 className="h3">
              <span className="medium">enjoyable</span> experience.
            </h3>
          </AppearTitle>
        ) : (
          <AppearTitle key="desktop-queto">
            <h3 className="h3">The front-end developer&apos;s role is like a</h3>
            <h3 className="h3">
              kind host, <span className="medium">ensuring</span> visitors have
            </h3>
            <h3 className="h3">
              a <span className="medium">smooth</span> and <span className="medium">enjoyable</span> experience.
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
            <h6 className="h6">Hey there! I&apos;m a 26-year-old front-end developer from Greece with a </h6>
            <h6 className="h6">passion for crafting amazing digital experiences. I studied software</h6>
            <h6 className="h6">engineering to deepen my understanding of how to build sleek and </h6>
            <h6 className="h6">efficient websites and apps.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>When I&apos;m not busy coding, you&apos;ll often find me soaking up inspiration from</h6>
            <h6 className="h6">the world of design. Whether it&apos;s exploring new color palettes or refining</h6>
            <h6 className="h6">user interfaces, I love bringing creativity into my work.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>When I&apos;m not immersed in coding, I enjoy staying active. I love swimming, </h6>
            <h6 className="h6">rowing, and playing intense PC games to relax and recharge.</h6>

            <h6 className={clsx(styles.paddingTop, 'h6')}>I&apos;m looking forward to collaborating and creating something great!</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>Evangelos Giatsidis.</h6>
          </AppearTitle>
        ) : (
          <AppearTitle key="mobile-overview">
            <h6 className="h6">Hey there! I&apos;m a 26-year-old front-end developer from Greece </h6>
            <h6 className="h6">with a passion for crafting amazing digital experiences. I studied </h6>
            <h6 className="h6">software engineering to deepen my understanding of how to </h6>
            <h6 className="h6">build sleek and efficient websites and apps.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>When I&apos;m not busy coding, you&apos;ll often find me soaking up </h6>
            <h6 className="h6">inspiration from the world of design. Whether it&apos;s exploring new</h6>
            <h6 className="h6">color palettes or refining user interfaces, I love bringing</h6>
            <h6 className="h6">creativity into my work.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>When I&apos;m not immersed in coding, I enjoy staying active. I love</h6>
            <h6 className="h6">swimming, rowing, and playing intense PC games to relax</h6>
            <h6 className="h6">and recharge.</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>I&apos;m looking forward to collaborating and creating something</h6>
            <h6 className="h6">great!</h6>
            <h6 className={clsx(styles.paddingTop, 'h6')}>Evangelos Giatsidis.</h6>
          </AppearTitle>
        )}
      </div>
    </section>
  );
}
export default Overview;
