/**
 * FAQ Component
 * Frequently asked questions section/page for XY Combinator.
 *
 * SEO / Crawlability (Issue #6):
 * - All questions and answers are rendered directly in the initial DOM payload
 *   (no client-side lazy injection or conditional DOM removal), so search
 *   engine bots index the full text immediately.
 * - Semantic HTML: <h2> for the section title, <h3> for each question,
 *   accessible accordion buttons with aria-expanded / aria-controls.
 * - Valid FAQPage JSON-LD structured data is injected from the same single
 *   source of truth data array used to render the UI, so visible copy and
 *   schema markup never drift out of sync.
 * - Smooth expand/collapse transitions use max-height / opacity (no
 *   display: none on answer text) so content stays in the DOM and
 *   Cumulative Layout Shift is minimized.
 * - Chevron animation is GPU-composited (transform) for smooth mobile
 *   performance. Header rows meet the 48px min touch-target guideline.
 */
import { useState } from 'react';
import clsx from 'clsx';
import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import { FAQS } from '@src/constants/faqs';
import styles from '@src/pages/components/faq/styles/faq.module.scss';

const faqColumns = [
  FAQS.slice(0, 4),
  FAQS.slice(4, 8),
];

const ToggleIcon = ({ isOpen }) => (
  <svg
    className={clsx(styles.toggleIcon, isOpen && styles.toggleIconOpen)}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M5 12h14M12 5v14" />
  </svg>
);

/**
 * Generates FAQPage JSON-LD structured data from the same FAQS array
 * used to render the UI, keeping visible copy and schema in sync.
 */
const getFAQPageSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((item) => ({
    '@type': 'Question',
    // Brand guideline: schema entries strictly omit hyphens and dashes
    name: item.q.replace(/[-—–]/g, ' ').replace(/\s+/g, ' ').trim(),
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a.replace(/[-—–]/g, ' ').replace(/\s+/g, ' ').trim(),
    },
  })),
});

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

        <div className={styles.columns}>
          {faqColumns.map((column, colIndex) => (
            <div key={`faq-column-${colIndex}`} className={styles.column}>
              {column.map((item, rowIndex) => {
                const absoluteIndex = colIndex * 4 + rowIndex;
                const isOpen = open === absoluteIndex;
                const id = `faq-question-${absoluteIndex}`;
                const answerId = `faq-answer-${absoluteIndex}`;

                return (
                  <div key={item.q} className={clsx(styles.item, isOpen && styles.open)}>
                    <button
                      type="button"
                      className={styles.button}
                      id={id}
                      aria-controls={answerId}
                      aria-expanded={isOpen}
                      onClick={() => toggle(absoluteIndex)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          toggle(absoluteIndex);
                        }
                      }}
                    >
                      <h3 className={clsx(styles.question, styles.questionHeading)}>{item.q}</h3>
                      <ToggleIcon isOpen={isOpen} />
                    </button>
                    <div
                      id={answerId}
                      className={clsx(styles.answer, isOpen && styles.answerOpen)}
                    >
                      <p>{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <a href="#contact" className={styles.ctaLink}>
            Ready to start? &rarr; Contact us
          </a>
        </div>

        {/* FAQPage JSON-LD structured data (crawlable rich results) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getFAQPageSchema()),
          }}
        />
      </div>
    </section>
  );
}

export default FAQ;
