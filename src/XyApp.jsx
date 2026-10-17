import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import './index.css'
import arishImg from './assets/work-imgs/arish-travels.webp'
import idiotBoxImg from './assets/work-imgs/idiot-box.webp'
import innovickImg from './assets/work-imgs/innovick.webp'
import jcreationImg from './assets/work-imgs/jcreation.webp'
import kasemImg from './assets/work-imgs/kasem-garments.webp'
import slrImg from './assets/work-imgs/slr-playground.webp'
import slrHeroImg from './assets/slr-hero.jpg'
import './App.css'

const EMAIL = 'hello@xycombinators.com'

const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Studio', href: '#studio' },
  { label: 'Pricing', href: '#pricing' },
]

const STACK = ['React', 'Next.js', 'React Native', 'Firebase', 'Vercel', 'SEO', 'GSAP', 'Motion']

const PROJECTS = [
  {
    name: 'J Creation',
    tag: 'E-commerce',
    image: jcreationImg,
    href: 'https://jcreationbd.com/shop',
    desc: "Grooms' exclusive wear — catalog, product pages and checkout that converts.",
  },
  {
    name: 'Arish Travels',
    tag: 'Website',
    image: arishImg,
    href: 'https://arishbd.com/',
    desc: 'Hajj & Umrah agency site with packages, visa guidance and pre-registration.',
  },
  {
    name: 'SLR Playground',
    tag: 'Catalog site',
    image: slrImg,
    href: 'https://slrplaygroundmalaysia.com/',
    desc: 'Playground supplier catalog & project gallery for the Malaysian market.',
  },
  {
    name: 'Kasem Garments',
    tag: 'Mobile app',
    image: kasemImg,
    href: 'https://github.com/mihsanalam/Kasem-Garments',
    desc: 'Inventory app with stock, sales and invoicing. React Native + Firebase.',
  },
  {
    name: 'Innovick',
    tag: 'Studio site',
    image: innovickImg,
    href: 'https://innovick.vercel.app/',
    desc: 'Fast, minimal studio site for the team behind these builds.',
  },
  {
    name: 'Idiot Box',
    tag: 'Desktop IDE',
    image: idiotBoxImg,
    href: 'https://thewonderlandstudio.github.io/Idiot_Box/',
    desc: 'Free & open-source code editor for Windows. One calm window.',
  },
]

const SERVICES = [
  {
    t: 'Product design',
    d: 'Flows, wireframes, UI and a design system you can keep building on. Prototypes you can click in days, not decks in weeks.',
    pills: ['UI/UX', 'Prototypes', 'Design systems'],
  },
  {
    t: 'Websites that rank',
    d: 'Marketing sites, e-commerce and catalogs. Fast, SEO-ready, analytics wired from day one.',
    pills: ['Marketing', 'E-commerce', 'SEO'],
  },
  {
    t: 'Mobile apps',
    d: 'Cross-platform apps from first build to store release. One codebase, native feel, backend included.',
    pills: ['React Native', 'Expo', 'Firebase'],
  },
  {
    t: 'Launch & iterate',
    d: 'Deployment, analytics and iteration after day one. We stay till it works in production.',
    pills: ['Deploy', 'Analytics', 'Growth'],
  },
]

const RISKS = [
  { risk: 'Endless discovery decks', fix: 'Fixed scope and timeline before we start. You know the price on day one.' },
  { risk: 'Designs that never ship', fix: 'Weekly clickable releases. You test real software, not screenshots.' },
  { risk: 'Slow, invisible websites', fix: 'Performance and SEO budget as standard. Fast scores, real rankings.' },
  { risk: 'Vanishing after handoff', fix: 'We stay through launch and iteration — the part that actually matters.' },
  { risk: 'Middlemen & miscommunication', fix: 'You talk directly to the designers and engineers building it.' },
]

const VALUES = [
  {
    t: 'Shipping, not decoration',
    d: 'Every screen should earn attention, hierarchy or conversion. If it does not earn its place, it does not ship.',
  },
  {
    t: 'Source & process you see',
    d: 'Weekly drops, inspectable progress, no black box. You watch your product come alive in the open.',
  },
  {
    t: 'Honest stack',
    d: 'React, Next.js, React Native, Firebase — serious tools your team can hire for. No mystery layer.',
  },
  {
    t: 'Refined on real launches',
    d: 'These workflows are battle-tested on stores, catalogs and apps doing real business today.',
  },
]

const PLANS = [
  {
    name: 'Fixed Project',
    for: 'For founders with a defined launch',
    points: ['Fixed scope & fixed price', 'Design + build + launch', 'Weekly clickable releases', 'SEO & analytics included', '30 days post-launch support'],
    cta: 'Get a quote',
    hot: false,
  },
  {
    name: 'Product Partner',
    for: 'For teams shipping every month',
    points: ['Dedicated design + engineering', 'Pause or cancel monthly', 'Priority turnaround', 'Continuous iteration & growth', 'Everything you ship stays yours'],
    cta: 'Become a partner',
    hot: true,
  },
]

const FAQS = [
  {
    q: 'What does XY Combinators actually do?',
    a: 'We are a design & engineering studio. We take products from idea to live users — product design, websites, e-commerce, mobile apps, and the launch support after day one.',
  },
  {
    q: 'How fast can we start?',
    a: 'A 30-minute intro call, scoped proposal within 48 hours, kickoff within a week. First clickable release typically lands in two weeks.',
  },
  {
    q: 'How much does it cost?',
    a: 'Fixed projects are scoped and priced upfront — no hourly black box. Product Partner is a flat monthly rate. Tell us what you are building and we will give you a number within 48 hours.',
  },
  {
    q: 'Do we own the code and designs?',
    a: 'Yes. Everything — code, designs, accounts, analytics — is yours from day one, in your repos, under your accounts.',
  },
  {
    q: 'Do you work with early-stage founders?',
    a: 'That is our home turf. Most clients arrive with an idea, a rough deck, or a half-built product. We meet you where you are and get you to launch.',
  },
]

/* ---------- helpers ---------- */

const EASE = [0.22, 1, 0.36, 1]

function Reveal({ children, delay = 0, y = 28, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function Words({ text, className }) {
  const words = text.split(' ')
  return (
    <span className={className} style={{ display: 'inline' }}>
      {words.map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.045, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* ---------- tuning playground ---------- */

function TuneDemo() {
  const [duration, setDuration] = useState(0.7)
  const [stagger, setStagger] = useState(0.08)
  const [key, setKey] = useState(0)
  const sample = 'Your headline, perfectly timed.'
  return (
    <div className="tune">
      <div className="tune-stage" key={key}>
        <p className="tune-line">
          {sample.split(' ').map((w, i) => (
            <span key={i} className="tune-mask">
              <motion.span
                className="tune-word"
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration, delay: 0.15 + i * stagger, ease: EASE }}
              >
                {w}
                {i < sample.split(' ').length - 1 ? ' ' : ''}
              </motion.span>
            </span>
          ))}
        </p>
        <button className="btn-dark btn-sm" onClick={() => setKey((k) => k + 1)}>
          ↻ Replay
        </button>
      </div>
      <div className="tune-controls">
        <label>
          <span>
            Duration <b>{duration.toFixed(2)}s</b>
          </span>
          <input type="range" min="0.2" max="1.4" step="0.05" value={duration} onChange={(e) => setDuration(+e.target.value)} />
        </label>
        <label>
          <span>
            Stagger <b>{stagger.toFixed(3)}s</b>
          </span>
          <input type="range" min="0" max="0.2" step="0.005" value={stagger} onChange={(e) => setStagger(+e.target.value)} />
        </label>
        <p className="tune-hint">Try it — this is how we tune every reveal before it ships.</p>
      </div>
    </div>
  )
}

/* ---------- app ---------- */

export default function App() {
  const [open, setOpen] = useState(false)
  const [faq, setFaq] = useState(0)

  return (
    <div className="vx">
      {/* NAV */}
      <div className="nav-wrap">
        <motion.header
          className="nav"
          initial={{ y: -32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <a href="#top" className="brand">
            <span className="brand-mark">XY</span>
            <span className="brand-name">XY Combinators</span>
          </a>
          <nav className="nav-links">
            {NAV.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav-right">
            <a href={`mailto:${EMAIL}`} className="btn-dark btn-sm hide-sm">
              Start a project
            </a>
            <button className="burger" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              <span />
              <span />
            </button>
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                className="mobile-menu"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {NAV.map((l) => (
                  <a key={l.label} href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                ))}
                <a href={`mailto:${EMAIL}`} className="btn-dark">
                  Start a project
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </div>

      {/* HERO */}
      <section id="top" className="hero">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="dot" />
          Design × Engineering studio — booking new projects
        </motion.div>
        <h1 className="hero-title">
          <Words text="The design & engineering team your startup is missing." />
        </h1>
        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
        >
          Websites, apps &amp; e-commerce — from first sketch to live users in weeks.
          Fixed scope, weekly releases, no endless decks.
        </motion.p>
        <motion.div
          className="hero-btns"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
        >
          <a href="#work" className="btn-dark btn-lg">
            See the work
          </a>
          <a href={`mailto:${EMAIL}`} className="btn-light btn-lg">
            Start a project
          </a>
        </motion.div>
        <motion.div
          className="hero-proof"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
        >
          <div className="avatars">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=64&auto=format&fit=crop" alt="Client" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&auto=format&fit=crop" alt="Client" />
            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=64&auto=format&fit=crop" alt="Client" />
          </div>
          <div className="proof-text">
            <span className="stars">★★★★★</span>
            <span>
              Trusted by <b>50+ founders</b> across 4 countries
            </span>
          </div>
        </motion.div>

        <motion.div
          className="hero-shot"
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
        >
          <div className="browser browser-hero">
            <div className="browser-bar">
              <span />
              <span />
              <span />
              <em>slrplaygroundmalaysia.com — designed &amp; shipped by XY</em>
            </div>
            <div className="browser-hero-img">
              <img src={slrHeroImg} alt="SLR Playground website designed and built by XY Combinators" />
            </div>
            <motion.a
              href="https://slrplaygroundmalaysia.com/"
              target="_blank"
              rel="noreferrer"
              className="float-card float-live"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: [0, -7, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 1 },
                y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
              }}
            >
              <span className="live-dot" /> Live site — visit ↗
            </motion.a>
            <motion.div
              className="float-card float-review"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: [0, -7, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 1.1 },
                y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.1 },
              }}
            >
              <div className="stars">★★★★★</div>
              <p>&ldquo;Weekly drops, zero hand-holding needed.&rdquo;</p>
              <span>Ops Lead, SLR Playground</span>
            </motion.div>
            <motion.div
              className="float-card float-stat"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: [0, -7, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 1.2 },
                y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
              }}
            >
              <strong>+120%</strong>
              <span>inbound leads after launch</span>
            </motion.div>
          </div>
          <div className="hero-cards">
            <motion.div
              className="mini-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
            >
              <strong>2 wks</strong>
              <span>to first release</span>
            </motion.div>
            <motion.div
              className="mini-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
            >
              <strong>50+</strong>
              <span>products shipped</span>
            </motion.div>
            <motion.div
              className="mini-card accent"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1, ease: EASE }}
            >
              <strong>0 → 100</strong>
              <span>idea to launch</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* STACK MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <p className="marquee-label">Built on the tools your team already trusts</p>
        <div className="marquee-view">
          <div className="marquee-track">
            {[0, 1].map((c) => (
              <span key={c} className="marquee-copy">
                {STACK.map((s) => (
                  <span key={`${c}-${s}`} className="marquee-item">
                    {s}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SPLIT FEATURE 1 */}
      <section className="split">
        <Reveal className="split-copy">
          <span className="kicker">How we work</span>
          <h2>One team. Real releases, every week.</h2>
          <p>
            No account managers, no handoffs into the void. You work directly with the designers
            and engineers building your product — and you click new progress every single week.
          </p>
          <ul className="ticks">
            {['Fixed scope & price before we start', 'Clickable release every week', 'SEO, speed & analytics baked in', 'We stay through launch, not just handoff'].map((t) => (
              <li key={t}>
                <i>✓</i> {t}
              </li>
            ))}
          </ul>
          <a href="#process" className="text-link">
            See the process →
          </a>
        </Reveal>
        <Reveal className="split-visual" delay={0.1}>
          <div className="code-card">
            <div className="code-head">
              <span />
              <span />
              <span />
              <em>week-02 release — shipped</em>
            </div>
            <img src={arishImg} alt="Arish Travels website release" loading="lazy" />
            <div className="code-foot">
              <span className="added">+ storefront</span>
              <span className="added">+ checkout</span>
              <span className="added">+ SEO</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* TUNE PLAYGROUND */}
      <section className="split flip">
        <Reveal className="split-copy">
          <span className="kicker">Motion with restraint</span>
          <h2>Tuned until it feels right.</h2>
          <p>
            Anyone can add a fade. What is hard is timing, restraint and performance. Drag the
            sliders and feel the difference good defaults make.
          </p>
          <div className="ease-row">
            {['Subtle', 'Confident', 'Playful'].map((e, i) => (
              <span key={e} className={i === 1 ? 'on' : ''}>
                {e}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal className="split-visual" delay={0.1}>
          <TuneDemo />
        </Reveal>
      </section>

      {/* STATEMENT */}
      <section className="statement">
        <Reveal>
          <p>
            Scroll systems, text reveals, page flow and launch discipline — refined on real client
            launches. It is not decoration. It is the difference between a site that looks done
            and a product that <b>is done.</b>
          </p>
        </Reveal>
      </section>

      {/* RISKS TABLE */}
      <section id="process" className="section">
        <Reveal>
          <span className="kicker">Why projects fail</span>
          <h2 className="h2">Good execution is harder than it looks.</h2>
          <p className="lede">
            Most agencies sell screens. The risk is everything around them — timing, scope,
            performance, follow-through. We engineer around that by default.
          </p>
        </Reveal>
        <div className="risk-table">
          <div className="risk-head">
            <span>The risk</span>
            <span>What XY does</span>
          </div>
          {RISKS.map((r, i) => (
            <motion.div
              key={r.risk}
              className="risk-row"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
            >
              <span className="risk">{r.risk}</span>
              <span className="fix">{r.fix}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section id="services" className="section">
        <Reveal>
          <span className="kicker">Services & principles</span>
          <h2 className="h2">Everything to go 0 → 100.</h2>
        </Reveal>
        <div className="value-grid">
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.t}
              className="value-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: EASE }}
              whileHover={{ y: -5 }}
            >
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <div className="pills">
                {s.pills.map((p) => (
                  <span key={p}>{p}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
        <div className="value-grid two">
          {VALUES.map((v, i) => (
            <motion.article
              key={v.t}
              className="value-card ghost"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: (i % 2) * 0.08, ease: EASE }}
            >
              <h3>{v.t}</h3>
              <p>{v.d}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="section">
        <Reveal>
          <span className="kicker">Selected work</span>
          <h2 className="h2">Shipped, live, making money.</h2>
          <p className="lede">A few things we designed and shipped — click any card to visit it live.</p>
        </Reveal>
        <div className="work-grid">
          {PROJECTS.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="work-card"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
              whileHover={{ y: -6 }}
            >
              <div className="work-img">
                <img src={p.image} alt={p.name} loading="lazy" />
                <span className="work-tag">{p.tag}</span>
              </div>
              <div className="work-body">
                <div className="work-top">
                  <h3>{p.name}</h3>
                  <span className="explore">Explore →</span>
                </div>
                <p>{p.desc}</p>
              </div>
            </motion.a>
          ))}
        </div>
        <Reveal className="more-row">
          <div className="more-imgs">
            <img src={kasemImg} alt="Kasem Garments app" loading="lazy" />
            <img src={innovickImg} alt="Innovick studio site" loading="lazy" />
          </div>
          <p>Plus internal tools, dashboards and MVPs under NDA. Ask on the intro call — we will show you.</p>
        </Reveal>
      </section>

      {/* PRICING / ENGAGEMENT */}
      <section id="pricing" className="section">
        <Reveal>
          <span className="kicker">Engagement</span>
          <h2 className="h2">Two ways to work with us.</h2>
        </Reveal>
        <div className="plans">
          {PLANS.map((p, i) => (
            <motion.div
              key={p.name}
              className={`plan ${p.hot ? 'hot' : ''}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
            >
              {p.hot && <span className="hot-badge">Most popular</span>}
              <h3>{p.name}</h3>
              <p className="plan-for">{p.for}</p>
              <ul>
                {p.points.map((pt) => (
                  <li key={pt}>
                    <i>✓</i> {pt}
                  </li>
                ))}
              </ul>
              <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(p.name + ' — XY Combinators')}`} className={p.hot ? 'btn-dark' : 'btn-light btn-border'}>
                {p.cta}
              </a>
            </motion.div>
          ))}
        </div>
        <Reveal>
          <p className="plan-note">Fixed quote in 48 hours · Everything you ship stays in your repo · Cancel partner plan monthly</p>
        </Reveal>
      </section>

      {/* FAQ */}
      <section id="studio" className="section faq">
        <Reveal>
          <span className="kicker">Questions, answered</span>
          <h2 className="h2">Everything founders ask us.</h2>
        </Reveal>
        <div className="faq-list">
          {FAQS.map((f, i) => {
            const isOpen = faq === i
            return (
              <div key={f.q} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button onClick={() => setFaq(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span>{f.q}</span>
                  <motion.em animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.25 }}>
                    +
                  </motion.em>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="cta">
        <Reveal>
          <span className="kicker light">Have a project in mind?</span>
          <h2>
            Build the product
            <br />
            your startup is missing.
          </h2>
          <p>Tell us what you are building and when you want to launch. We reply to every message.</p>
          <div className="cta-btns">
            <a href={`mailto:${EMAIL}`} className="btn-light btn-lg">
              {EMAIL}
            </a>
            <a href="#work" className="btn-ghost-dark btn-lg">
              Revisit the work
            </a>
          </div>
          <p className="cta-note">Fixed quote in 48 hrs · First release in ~2 weeks · No credit card, just a conversation</p>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="foot-top">
          <div className="foot-brand">
            <span className="brand-mark">XY</span>
            <div>
              <strong>XY Combinators</strong>
              <span>A design &amp; engineering studio for founders who move fast.</span>
            </div>
          </div>
          <a href={`mailto:${EMAIL}`} className="btn-dark btn-sm">
            {EMAIL}
          </a>
        </div>
        <div className="foot-cols">
          <div>
            <h4>Studio</h4>
            <a href="#work">Work</a>
            <a href="#services">Services</a>
            <a href="#process">Process</a>
            <a href="#pricing">Engagement</a>
          </div>
          <div>
            <h4>Live clients</h4>
            <a href="https://jcreationbd.com/shop" target="_blank" rel="noreferrer">J Creation</a>
            <a href="https://arishbd.com/" target="_blank" rel="noreferrer">Arish Travels</a>
            <a href="https://slrplaygroundmalaysia.com/" target="_blank" rel="noreferrer">SLR Playground</a>
            <a href="https://innovick.vercel.app/" target="_blank" rel="noreferrer">Innovick</a>
          </div>
          <div>
            <h4>Contact</h4>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
        <div className="foot-base">
          <span>© 2026 XY Combinators. All rights reserved.</span>
          <span>Designed &amp; shipped by XY — obviously.</span>
        </div>
      </footer>
    </div>
  )
}
