/**
 * FAQ Component
 * Frequently asked questions section/page for XY Combinator.
 * Accessible accordion built with framer-motion, one answer open at a time.
 */
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';
import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import styles from '@src/pages/components/faq/styles/faq.module.scss';

const FAQS = [
  {
    q: 'What does XY Combinator actually do?',
    a:
      'We are a design & engineering studio for founders who move fast. We take products from idea to live users &mdash; product design, brand strategy, websites, e-commerce, mobile apps, and launch support after day one.',
  },
  {
    q: 'How fast can we start?',
    a:
      'A 30-minute intro call, a scoped proposal within 48 hours, and kickoff within a week. The first clickable release typically lands in two weeks.',
  },
  {
    q: 'How long does a project take?',
    a:
      'Timelines depend on scope. Brand strategy and identity usually take 6&ndash;8 weeks, digital experience design 4&ndash;6 weeks, web development 8&ndash;12 weeks, and application development 12&ndash;16 weeks. These are estimates and vary with project specifics.',
  },
  {
    q: 'How much does it cost?',
    a:
      'Fixed projects are scoped and priced upfront &mdash; no hourly black box. Tell us what you are building and we will give you a number within 48 hours.',
  },
  {
    q: 'Do we own the code and designs?',
    a:
      'Yes. Everything &mdash; code, designs, accounts, analytics &mdash; is yours from day one, in your repos, under your accounts.',
  },
  {
    q: 'Do you work with early-stage founders?',
    a:
      'That is our home turf. Most clients arrive with an idea, a rough deck, or a half-built product. We meet you where you are and get you to launch.',
  },
  {
    q: 'Do you offer ongoing support after launch?',
    a:
      'Yes. We provide maintenance and support to keep your site secure, up-to-date, and optimized for performance long after launch.',
  },
  {
    q: 'Will my website be optimized for search engines?',
    a:
      'Yes. SEO foundations are built in from the start &mdash; clean code architecture, fast load speeds, mobile responsiveness, structured metadata, and configured sitemaps.',
  },
  {
    q: 'Is my website mobile-friendly?',
    a:
      'Yes. We use responsive design principles so your site adapts seamlessly across all screen sizes and devices.',
  },
  {
    q: 'How do you handle website security?',
    a:
      'We use SSL certificates, regular software updates, and proactive monitoring to protect your site and ensure data integrity.',
  },
  {
    q: 'Can you integrate third-party tools?',
    a:
      'Yes. We integrate CRM systems, marketing platforms, analytics tools, and other services to extend your site&rsquo;s functionality.',
  },
];

function FAQ() {
  const [open, setOpen] = useState(null); // index of the open answer, or null

  const toggle = (index) => {
    setOpen(open === index ? null : index);
  };

  return (
    <section id="faq" className={styles.root} data-header-theme="dark" aria-label="Frequently asked questions">
      <div className={clsx(styles.inner, 'layout-block-inner')}>
        <header className={styles.head}>
          <div className={styles.headMain}>
            <span className={styles.kicker}>Questions, answered</span>
            <AppearTitle>
              <h2 className={styles.title}>Frequently Asked Questions</h2>
            </AppearTitle>
          </div>
          <AppearTitle>
            <p className={styles.story}>
              Everything founders ask us before starting a project. Still curious? Get in touch.
            </p>
          </AppearTitle>
        </header>

        <div className={styles.list}>
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={clsx(styles.item, isOpen && styles.open)}>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.question}>{item.q}</span>
                  <motion.em
                    className={styles.toggle}
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    &plus;
                  </motion.em>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className={styles.answer}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className={styles.cta}>
          <a href="#contact" className={styles.ctaLink}>
            Ready to start? &rarr; Contact us
          </a>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
