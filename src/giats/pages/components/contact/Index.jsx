/**
 * Contact Component
 * Dedicated contact section/page for XY Combinator.
 * Client-side contact form (opens mailto with the visitor's details on submit),
 * plus studio contact information: email, phone, and address.
 */
import { useState } from 'react';
import clsx from 'clsx';
import AppearTitle from '@src/components/animationComponents/appearTitle/Index';
import styles from '@src/pages/components/contact/styles/contact.module.scss';

const EMAIL = 'contact@xycombinator.com';
const PHONE = '+8801700000000';
const ADDRESS_LINE = 'Dhaka, Bangladesh';

const INFO = [
  { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
  { label: 'Phone', value: PHONE, href: `tel:${PHONE}` },
  { label: 'Address', value: ADDRESS_LINE, href: undefined },
];

function Contact() {
  const [status, setStatus] = useState(null); // 'sending' | 'sent' | null

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '');
    const email = String(data.get('email') || '');
    const message = String(data.get('message') || '');

    setStatus('sending');
    const subject = encodeURIComponent(`New project inquiry from ${name || 'a visitor'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    form.reset();
    setStatus('sent');
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <section
      id="contact"
      className={styles.root}
      data-header-theme="dark"
      aria-label="Contact XY Combinator"
    >
      <div className={clsx(styles.inner, 'layout-block-inner')}>
        <header className={styles.head}>
          <div className={styles.headMain}>
            <span className={styles.kicker}>Get in touch</span>
            <AppearTitle>
              <h2 className={styles.title}>Contact XY Combinator</h2>
            </AppearTitle>
          </div>
          <AppearTitle>
            <p className={styles.story}>
              Have a project in mind? Tell us what you are building and when you want to launch.
              We reply to every message, usually within 48 hours.
            </p>
          </AppearTitle>
        </header>

        <div className={styles.grid}>
          {/* Contact Form */}
          <div className={styles.formCol}>
            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label htmlFor="contact-name">Full name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-email">Email address</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Tell us about your project..."
                  required
                />
              </div>
              <button type="submit" className={styles.submit}>
                Send message
              </button>
            </form>
            {status === 'sent' && (
              <p className={styles.confirmation}>
                Thanks &mdash; your message is on its way. We&apos;ll get back to you soon.
              </p>
            )}
          </div>

          {/* Contact Info */}
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Studio contact</h3>
              {INFO.map((item) => (
                <div key={item.label} className={styles.infoRow}>
                  <span className={styles.infoLabel}>{item.label}</span>
                  {item.href ? (
                    <a href={item.href} className={styles.infoValue} rel="noopener noreferrer">
                      {item.value}
                    </a>
                  ) : (
                    <span className={styles.infoValue}>{item.value}</span>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.quickNote}>
              <p>
                Fixed quote in 48 hours &middot; First release in ~2 weeks &middot; No credit
                card, just a conversation.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.back}>
          <a href="#top" className={styles.backLink}>
            Back to top &uarr;
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
