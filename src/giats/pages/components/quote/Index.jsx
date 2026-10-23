import clsx from 'clsx';
import styles from '@src/pages/components/quote/styles/quote.module.scss';

function Quote() {
  return (
    <section className={clsx(styles.root, 'layout-block-inner')}>
      <h3 className={clsx(styles.text, 'h3')}>
        Most agencies sell screens. The risk is everything around them — timing, scope, performance, follow-through. We engineer around that by default, so what we hand over actually works after launch day.
      </h3>
    </section>
  );
}

export default Quote;
