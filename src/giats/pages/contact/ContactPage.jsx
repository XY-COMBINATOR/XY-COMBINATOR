import { useRef, useState } from 'react';
import CustomHead from '@src/components/dom/CustomHead';
import styles from './contact.module.scss';

const EMAIL = 'contact@xycombinator.com';

const steps = [
  {
    key: 'projectType',
    question: 'What are you looking to build?',
    kind: 'choice',
    options: ['A website', 'An e-commerce store', 'A mobile app', 'Product design', 'Something else'],
  },
  {
    key: 'projectDetails',
    question: 'Tell us a little about it.',
    kind: 'textarea',
    placeholder: 'What are you building, and who is it for?',
  },
  {
    key: 'budget',
    question: 'What range are you working with?',
    kind: 'choice',
    options: ['$2k–$5k', '$5k–$10k', '$10k–$25k', '$25k+', 'Not sure yet'],
  },
  {
    key: 'timeline',
    question: 'When would you like to get started?',
    kind: 'choice',
    options: ['As soon as possible', 'In the next month', 'In 1–3 months', 'Just exploring'],
  },
  {
    key: 'name',
    question: 'What should we call you?',
    kind: 'text',
    placeholder: 'Your name',
    autoComplete: 'name',
  },
  {
    key: 'email',
    question: 'Where can we reach you?',
    kind: 'email',
    placeholder: 'you@example.com',
    autoComplete: 'email',
  },
];

function ContactPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const formRef = useRef(null);
  const currentStep = steps[stepIndex];

  const updateAnswer = (key, value) => {
    setAnswers((previousAnswers) => ({ ...previousAnswers, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formRef.current?.reportValidity()) return;

    if (stepIndex < steps.length - 1) {
      setStepIndex((currentIndex) => currentIndex + 1);
      return;
    }

    const { VITE_WEB3FORMS_ACCESS_KEY } = import.meta.env;

    if (!VITE_WEB3FORMS_ACCESS_KEY) {
      setSubmissionError('The contact form is not configured yet. Please email us directly instead.');
      return;
    }

    setIsSending(true);
    setSubmissionError('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: VITE_WEB3FORMS_ACCESS_KEY,
          subject: `New project enquiry from ${answers.name}`,
          from_name: 'XY Combinator website',
          name: answers.name,
          email: answers.email,
          replyto: answers.email,
          project_type: answers.projectType,
          project_details: answers.projectDetails,
          budget: answers.budget,
          timeline: answers.timeline,
          message: [
            `Project type: ${answers.projectType}`,
            `Budget: ${answers.budget}`,
            `Timeline: ${answers.timeline}`,
            '',
            answers.projectDetails,
          ].join('\n'),
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Web3Forms returned status ${response.status}`);
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Unable to send the contact form through Web3Forms.', error);
      setSubmissionError('We couldn’t send your message. Please try again or email us directly.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <CustomHead
        title="Get in touch | XY Combinator"
        description="Tell XY Combinator about your next digital product, website, or app. Start a project conversation one step at a time."
      />
      <section className={styles.page} data-header-theme="dark" aria-labelledby="contact-title">
        <div className={styles.content}>
          <div className={styles.intro}>
            <span className={styles.eyebrow}>LET&apos;S MAKE SOMETHING MATTER</span>
            <h1 id="contact-title">Start a project.</h1>
            <p>A few quick questions help us understand what you have in mind.</p>
          </div>

          <div className={styles.formCard}>
            {submitted ? (
              <div className={styles.success} role="status">
                <span className={styles.eyebrow}>THANK YOU</span>
                <h2>Your message is on its way.</h2>
                <p>Thanks for reaching out. We’ll get back to you as soon as we can.</p>
                <a className={styles.backToStudio} href="/">
                  Back to the studio
                </a>
              </div>
            ) : (
              <>
                <div className={styles.progressHeader}>
                  <span className={styles.stepCount}>
                    {String(stepIndex + 1).padStart(2, '0')} <span>/</span>{' '}
                    {String(steps.length).padStart(2, '0')}
                  </span>
                  <span className={styles.stepHint}>YOUR PROJECT, YOUR PACE</span>
                </div>
                <div
                  className={styles.progressTrack}
                  role="progressbar"
                  aria-label="Contact form progress"
                  aria-valuemin={1}
                  aria-valuemax={steps.length}
                  aria-valuenow={stepIndex + 1}
                >
                  <span style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
                </div>

                <form ref={formRef} onSubmit={handleSubmit} aria-busy={isSending}>
                  <div className={styles.step} key={currentStep.key}>
                    {currentStep.kind === 'choice' ? (
                      <fieldset className={styles.choiceFieldset}>
                        <legend className={styles.question}>{currentStep.question}</legend>
                        <div className={styles.options}>
                          {currentStep.options.map((option) => (
                            <label className={styles.option} key={option}>
                              <input
                                type="radio"
                                name={currentStep.key}
                                value={option}
                                checked={answers[currentStep.key] === option}
                                onChange={(event) => updateAnswer(currentStep.key, event.target.value)}
                                required
                              />
                              <span>{option}</span>
                              <span className={styles.optionArrow} aria-hidden="true">
                                ↗
                              </span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ) : currentStep.kind === 'textarea' ? (
                      <>
                        <label className={styles.question} htmlFor={`answer-${currentStep.key}`}>
                          {currentStep.question}
                        </label>
                        <textarea
                          id={`answer-${currentStep.key}`}
                          name={currentStep.key}
                          value={answers[currentStep.key] || ''}
                          onChange={(event) => updateAnswer(currentStep.key, event.target.value)}
                          placeholder={currentStep.placeholder}
                          rows={3}
                          required
                        />
                      </>
                    ) : (
                      <>
                        <label className={styles.question} htmlFor={`answer-${currentStep.key}`}>
                          {currentStep.question}
                        </label>
                        <input
                          id={`answer-${currentStep.key}`}
                          name={currentStep.key}
                          type={currentStep.kind}
                          value={answers[currentStep.key] || ''}
                          onChange={(event) => updateAnswer(currentStep.key, event.target.value)}
                          placeholder={currentStep.placeholder}
                          autoComplete={currentStep.autoComplete}
                          required
                        />
                      </>
                    )}
                  </div>

                  <div className={styles.controls}>
                    <button
                      className={styles.backButton}
                      type="button"
                      onClick={() => setStepIndex((currentIndex) => Math.max(0, currentIndex - 1))}
                      disabled={stepIndex === 0}
                    >
                      <span aria-hidden="true">←</span> Back
                    </button>
                    <button className={styles.nextButton} type="submit" disabled={isSending}>
                      {isSending
                        ? 'Sending…'
                        : stepIndex === steps.length - 1
                          ? 'Send your enquiry'
                          : 'Continue'}
                      <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </form>
                {submissionError && (
                  <p className={styles.errorMessage} role="alert">
                    {submissionError}
                  </p>
                )}
                <p className={styles.privacyNote}>
                  No pressure, no spam. Or email us directly at{' '}
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
                </p>
              </>
            )}
          </div>
        </div>
        <div className={styles.watermark} aria-hidden="true">
          XY
        </div>
      </section>
    </>
  );
}

export default ContactPage;
