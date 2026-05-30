// book.jsx — shared building blocks for the "Juristenbuch" website concept.
// Themed via CSS variables on the artboard root: --paper, --ink, --accent,
// --accent-soft, --rule. All page geometry is also CSS-var driven so the
// same components render at any size.

const BOOK_FONT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Manrope:wght@200;300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
`;

if (typeof document !== 'undefined' && !document.getElementById('book-fonts')) {
  const s = document.createElement('style');
  s.id = 'book-fonts';
  s.textContent = BOOK_FONT_CSS;
  document.head.appendChild(s);
}

// Shared visual primitives — all consume CSS vars so they re-skin per variant.
const bookCSS = `
.kb-root { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--paper); color: var(--ink); font-family: 'Manrope', sans-serif;
  font-feature-settings: 'ss01','ss02'; }

/* Paper grain — extremely subtle, monochromatic, applied with multiply blend */
.kb-grain {
  position: absolute; inset: 0; pointer-events: none; mix-blend-mode: multiply;
  opacity: var(--grain-strength, 0.35);
  background-image:
    radial-gradient(circle at 13% 27%, var(--grain-dot) 0.4px, transparent 1px),
    radial-gradient(circle at 67% 41%, var(--grain-dot) 0.3px, transparent 1px),
    radial-gradient(circle at 84% 78%, var(--grain-dot) 0.5px, transparent 1px),
    radial-gradient(circle at 23% 89%, var(--grain-dot) 0.3px, transparent 1px),
    radial-gradient(circle at 41% 12%, var(--grain-dot) 0.4px, transparent 1px);
  background-size: 220px 220px, 180px 180px, 250px 250px, 200px 200px, 190px 190px;
}
.kb-grain::after {
  content: ''; position: absolute; inset: 0;
  background:
    repeating-linear-gradient(91deg, transparent 0 3px, var(--grain-dot) 3px 3.2px),
    repeating-linear-gradient(1deg, transparent 0 4px, var(--grain-dot) 4px 4.15px);
  opacity: 0.25;
}

/* Top nav — fixed-feel, sits "inside" the binding/paper */
.kb-nav {
  display: flex; align-items: baseline; justify-content: space-between;
  padding: 28px 56px 22px;
  border-bottom: 1px solid var(--rule);
  position: relative; z-index: 3;
}
.kb-nav-brand {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; font-weight: 500; letter-spacing: 0.02em;
  display: flex; align-items: baseline; gap: 10px;
}
.kb-nav-brand .kb-monogram {
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  color: var(--accent); font-weight: 500;
}
.kb-nav-brand .kb-brand-role {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.22em; text-transform: uppercase; color: var(--ink-soft);
  padding-left: 12px; margin-left: 4px; border-left: 1px solid var(--rule);
}
.kb-nav-links {
  display: flex; gap: 30px; font-family: 'JetBrains Mono', monospace;
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-soft);
}
.kb-nav-links .kb-active { color: var(--ink); position: relative; }
.kb-nav-links .kb-active::after {
  content: ''; position: absolute; left: -2px; right: -2px; bottom: -6px;
  height: 1px; background: var(--accent);
}
.kb-nav-cta {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: 0.16em; text-transform: uppercase;
  padding: 9px 14px; border: 1px solid var(--ink);
  background: transparent; color: var(--ink); cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px;
}
.kb-nav-cta .kb-dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
}

/* Margin numeral on the side — like a chapter tab */
.kb-side-numeral {
  position: absolute; left: 22px; top: 50%; transform: translateY(-50%) rotate(-90deg);
  transform-origin: left center;
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.35em; color: var(--ink-soft); text-transform: uppercase;
  white-space: nowrap;
}

/* The CLOSED BOOK — 3D-ish cover view, foil-stamped title */
.kb-cover-stage {
  position: relative; perspective: 1600px;
  display: flex; align-items: center; justify-content: center;
  height: var(--cover-stage-h, 720px);
  background: var(--paper-deep, var(--paper));
}
.kb-cover-stage::before { /* table shadow under the book */
  content: ''; position: absolute; bottom: 8%; left: 50%; transform: translateX(-50%);
  width: 60%; height: 24px; border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.18), transparent 70%);
  filter: blur(8px); pointer-events: none;
}
.kb-book {
  position: relative; width: var(--cover-w, 460px); height: var(--cover-h, 620px);
  transform-style: preserve-3d;
  transform: rotateY(-22deg) rotateX(4deg) rotateZ(-1deg);
}
.kb-book-cover, .kb-book-spine, .kb-book-pages-edge {
  position: absolute; transform-style: preserve-3d;
}
.kb-book-cover {
  inset: 0;
  background:
    linear-gradient(135deg, var(--cover-hi) 0%, var(--cover-mid) 45%, var(--cover-lo) 100%);
  box-shadow:
    inset 0 0 80px rgba(0,0,0,0.25),
    0 24px 60px rgba(0,0,0,0.28);
  padding: 60px 50px;
  display: flex; flex-direction: column; justify-content: space-between;
  color: var(--cover-fg);
  /* Foil-stamped border */
  border: 1px solid var(--cover-trim);
  border-radius: 2px 6px 6px 2px;
}
.kb-book-spine {
  width: 28px; height: 100%; left: -28px; top: 0;
  background: linear-gradient(90deg, var(--cover-lo), var(--cover-mid));
  transform: rotateY(-90deg); transform-origin: right center;
  box-shadow: inset -3px 0 8px rgba(0,0,0,0.4);
}
.kb-book-pages-edge {
  width: 14px; height: calc(100% - 12px); right: -14px; top: 6px;
  background: repeating-linear-gradient(180deg,
    var(--page-edge-light) 0, var(--page-edge-light) 1.5px,
    var(--page-edge-dark) 1.5px, var(--page-edge-dark) 2.2px);
  transform: rotateY(90deg); transform-origin: left center;
}
.kb-cover-frame {
  flex: 1; border: 1px solid var(--cover-trim);
  margin: 6px; padding: 28px 18px;
  display: flex; flex-direction: column; justify-content: space-between;
  text-align: center;
}
.kb-cover-eyebrow {
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  letter-spacing: 0.4em; text-transform: uppercase;
  color: var(--cover-fg-soft);
}
.kb-cover-name {
  font-family: 'Cormorant Garamond', serif; font-weight: 500;
  font-size: 48px; line-height: 1; letter-spacing: 0.01em;
}
.kb-cover-name em { font-style: italic; font-weight: 400; }
.kb-cover-role {
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-size: 18px; color: var(--cover-fg-soft);
}
.kb-cover-mark {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.kb-cover-edition {
  font-family: 'JetBrains Mono', monospace; font-size: 8px;
  letter-spacing: 0.35em; text-transform: uppercase; color: var(--cover-fg-soft);
}

/* The OPEN SPREAD — two pages joined by a binding gutter */
.kb-spread {
  display: flex; position: relative; margin: 0 auto;
  width: var(--spread-w, 1100px); height: var(--spread-h, 680px);
  background: var(--paper);
  box-shadow:
    0 24px 80px rgba(0,0,0,0.12),
    0 0 0 1px var(--rule);
}
.kb-spread::before { /* gutter shadow */
  content: ''; position: absolute; top: 0; bottom: 0; left: 50%; width: 60px;
  transform: translateX(-50%);
  background: linear-gradient(90deg,
    transparent 0%, rgba(0,0,0,0.04) 35%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.04) 65%, transparent 100%);
  pointer-events: none;
}
.kb-page {
  flex: 1; padding: 52px 56px; position: relative;
  display: flex; flex-direction: column;
}
.kb-page-left { padding-right: 64px; }
.kb-page-right { padding-left: 64px; }
.kb-page-marg { /* outer margin marker, top */
  position: absolute; top: 22px; font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--ink-soft);
}
.kb-page-left .kb-page-marg { left: 56px; }
.kb-page-right .kb-page-marg { right: 56px; text-align: right; }
.kb-page-num {
  position: absolute; bottom: 22px;
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--ink-soft); letter-spacing: 0.1em;
}
.kb-page-left .kb-page-num { left: 56px; }
.kb-page-right .kb-page-num { right: 56px; }

.kb-chapter-numeral {
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-weight: 400; font-size: 110px; line-height: 0.9;
  color: var(--accent); letter-spacing: -0.02em;
}
.kb-chapter-kicker {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.32em; text-transform: uppercase; color: var(--ink-soft);
  margin-top: 22px; margin-bottom: 6px;
}
.kb-chapter-title {
  font-family: 'Cormorant Garamond', serif; font-weight: 400;
  font-size: 56px; line-height: 1.02; letter-spacing: -0.005em;
  margin: 0 0 14px;
}
.kb-chapter-title em { font-style: italic; font-weight: 300; color: var(--accent); }
.kb-chapter-lede {
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-size: 22px; line-height: 1.4; color: var(--ink-soft);
  max-width: 30ch;
}

/* Drop-cap intro paragraph */
.kb-body { font-size: 13.5px; line-height: 1.72; color: var(--ink);
  font-weight: 350; max-width: 38ch; }
.kb-body p { margin: 0 0 10px; }
.kb-body p + p { text-indent: 1.2em; }
.kb-dropcap::first-letter {
  font-family: 'Cormorant Garamond', serif; font-weight: 500;
  float: left; font-size: 56px; line-height: 0.86; padding: 6px 8px 0 0;
  color: var(--accent);
}
.kb-pull {
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-size: 19px; line-height: 1.35; color: var(--ink);
  border-left: 2px solid var(--accent); padding: 4px 0 4px 14px;
  margin: 14px 0; max-width: 30ch;
}
.kb-sig {
  display: flex; align-items: center; gap: 10px; margin-top: auto;
  padding-top: 22px;
}
.kb-sig-line { flex: 0 0 38px; height: 1px; background: var(--rule); }
.kb-sig-name {
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-size: 18px;
}

/* Justitia mark — a minimalist scale built from divs */
.kb-justitia {
  --jw: var(--mark-size, 64px);
  width: var(--jw); height: var(--jw); position: relative;
  color: var(--accent);
}
.kb-justitia .kb-jus-pillar {
  position: absolute; left: 50%; top: 18%; width: 1.4px; height: 64%;
  background: currentColor; transform: translateX(-50%);
}
.kb-justitia .kb-jus-base {
  position: absolute; left: 22%; right: 22%; bottom: 14%; height: 1.4px;
  background: currentColor;
}
.kb-justitia .kb-jus-foot {
  position: absolute; left: 36%; right: 36%; bottom: 9%; height: 1.4px;
  background: currentColor;
}
.kb-justitia .kb-jus-beam {
  position: absolute; left: 12%; right: 12%; top: 22%; height: 1.4px;
  background: currentColor;
}
.kb-justitia .kb-jus-pan {
  position: absolute; top: 24%; width: 22%; height: 14%;
  border: 1.4px solid currentColor; border-top: none;
  border-radius: 0 0 100% 100% / 0 0 100% 100%;
}
.kb-justitia .kb-jus-pan.l { left: 7%; }
.kb-justitia .kb-jus-pan.r { right: 7%; }
.kb-justitia .kb-jus-pan::before {
  content: ''; position: absolute; left: 50%; top: -1px; width: 1.4px;
  height: 5px; background: currentColor; transform: translateX(-50%) translateY(-100%);
}

/* TOC list */
.kb-toc {
  display: flex; flex-direction: column; gap: 14px;
  font-family: 'Cormorant Garamond', serif;
}
.kb-toc-row {
  display: grid; grid-template-columns: 36px 1fr auto; align-items: baseline;
  gap: 18px; padding-bottom: 10px;
  border-bottom: 1px solid var(--rule);
}
.kb-toc-num {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: 0.18em; color: var(--ink-soft); padding-top: 4px;
}
.kb-toc-title {
  font-size: 28px; line-height: 1.15; font-weight: 400; letter-spacing: -0.005em;
}
.kb-toc-sub {
  font-style: italic; font-size: 14px; color: var(--ink-soft);
  display: block; margin-top: 3px; font-weight: 400;
}
.kb-toc-page {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--ink-soft); padding-top: 8px;
}

/* Rechtsgebiete grid */
.kb-rg {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 0;
  border-top: 1px solid var(--rule); margin-top: 14px;
}
.kb-rg-cell {
  padding: 18px 18px 22px; border-right: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}
.kb-rg-cell:nth-child(3n) { border-right: none; }
.kb-rg-num {
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  letter-spacing: 0.3em; color: var(--ink-soft); margin-bottom: 8px;
}
.kb-rg-title {
  font-family: 'Cormorant Garamond', serif; font-size: 19px;
  font-weight: 400; line-height: 1.1; margin-bottom: 6px;
}
.kb-rg-desc {
  font-size: 11.5px; line-height: 1.55; color: var(--ink-soft); font-weight: 350;
}

/* Photo placeholder — pinstripe with mono label */
.kb-photo {
  position: relative; background:
    repeating-linear-gradient(135deg,
      var(--photo-stripe-a) 0, var(--photo-stripe-a) 4px,
      var(--photo-stripe-b) 4px, var(--photo-stripe-b) 8px);
  border: 1px solid var(--rule);
  display: flex; align-items: center; justify-content: center;
  color: var(--ink-soft);
}
.kb-photo-label {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.18em; text-transform: uppercase;
  background: var(--paper); padding: 6px 10px; border: 1px solid var(--rule);
}

/* Calendly-ish slot picker mockup */
.kb-cal {
  border: 1px solid var(--rule); padding: 18px 20px;
  display: grid; grid-template-columns: 1fr 1.2fr; gap: 22px; align-items: flex-start;
}
.kb-cal-h {
  font-family: 'Cormorant Garamond', serif; font-size: 22px;
  font-weight: 400; margin-bottom: 4px;
}
.kb-cal-sub {
  font-size: 11.5px; line-height: 1.55; color: var(--ink-soft);
  margin-bottom: 14px;
}
.kb-cal-mode {
  display: flex; flex-direction: column; gap: 6px;
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.18em; text-transform: uppercase;
}
.kb-cal-mode-row {
  display: flex; align-items: center; gap: 10px; padding: 8px 10px;
  border: 1px solid var(--rule); color: var(--ink-soft);
}
.kb-cal-mode-row.active {
  border-color: var(--ink); color: var(--ink);
}
.kb-cal-mode-row .kb-dot {
  width: 6px; height: 6px; border-radius: 50%;
  border: 1px solid var(--ink-soft); flex: 0 0 auto;
}
.kb-cal-mode-row.active .kb-dot {
  background: var(--accent); border-color: var(--accent);
}
.kb-cal-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;
}
.kb-cal-slot {
  padding: 9px 0; text-align: center;
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing: 0.04em; border: 1px solid var(--rule);
  color: var(--ink);
}
.kb-cal-slot.muted { color: var(--ink-soft); }
.kb-cal-slot.pick { background: var(--ink); color: var(--paper); border-color: var(--ink); }

/* Footnote/marginalia helper */
.kb-marg {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
  letter-spacing: 0.06em; line-height: 1.55; color: var(--ink-soft);
}
.kb-marg-rule { width: 24px; height: 1px; background: var(--accent); margin: 6px 0; }

/* Subtle section divider */
.kb-divider {
  display: flex; align-items: center; gap: 10px;
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  letter-spacing: 0.32em; text-transform: uppercase; color: var(--ink-soft);
  padding: 0 56px; margin: 0; height: 36px;
  border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule);
}
.kb-divider .kb-fleuron { color: var(--accent); }

/* Hero-ish line under nav, with the firm's positioning */
.kb-leitsatz {
  padding: 60px 56px 30px; display: grid; grid-template-columns: 1fr auto;
  align-items: end; gap: 40px;
}
.kb-leitsatz-h {
  font-family: 'Cormorant Garamond', serif; font-weight: 400;
  font-size: 64px; line-height: 1.02; letter-spacing: -0.01em;
  max-width: 18ch;
}
.kb-leitsatz-h em { font-style: italic; color: var(--accent); }
.kb-leitsatz-meta {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 0.22em; text-transform: uppercase; color: var(--ink-soft);
  text-align: right; line-height: 1.8;
}
`;

if (typeof document !== 'undefined' && !document.getElementById('book-styles')) {
  const s = document.createElement('style');
  s.id = 'book-styles';
  s.textContent = bookCSS;
  document.head.appendChild(s);
}

// ───────────────────────────────────────────────────────────────────
// Components

function Justitia({ size = 64, style }) {
  return (
    <div className="kb-justitia" style={{ '--mark-size': `${size}px`, ...style }}>
      <div className="kb-jus-pillar" />
      <div className="kb-jus-beam" />
      <div className="kb-jus-pan l" />
      <div className="kb-jus-pan r" />
      <div className="kb-jus-base" />
      <div className="kb-jus-foot" />
    </div>
  );
}

function TopNav({ activeKey = 'I', variantNumeral = 'PRÄAMBEL' }) {
  return (
    <nav className="kb-nav">
      <div className="kb-nav-brand">
        <span>Kaan <em className="kb-monogram">Kabataş</em></span>
        <span className="kb-brand-role">Rechtsanwalt · LL.M.</span>
      </div>
      <div className="kb-nav-links">
        {[
          ['I', 'Präambel'],
          ['II', 'Vita'],
          ['III', 'Rechtsgebiete'],
          ['IV', 'Versprechen'],
          ['V', 'Mandat'],
          ['VI', 'Kontakt'],
        ].map(([n, label]) => (
          <span key={n} className={n === activeKey ? 'kb-active' : ''}>
            <span style={{ opacity: 0.55, marginRight: 6 }}>{n}.</span>{label}
          </span>
        ))}
      </div>
      <button className="kb-nav-cta">
        <span className="kb-dot" />Termin buchen
      </button>
    </nav>
  );
}

function Leitsatz() {
  return (
    <div className="kb-leitsatz">
      <h1 className="kb-leitsatz-h">
        Recht ist <em>Würde</em> —<br />
        in Form gebracht.
      </h1>
      <div className="kb-leitsatz-meta">
        Edition MMXXVI<br />
        Köln · Düsseldorf · Online<br />
        Audiatur et altera pars
      </div>
    </div>
  );
}

function ChapterDivider({ children }) {
  return (
    <div className="kb-divider">
      <span className="kb-fleuron">❦</span>
      <span>{children}</span>
      <span style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
    </div>
  );
}

// Spread: Präambel — the first proper open page
function SpreadPraeambel() {
  return (
    <div className="kb-spread">
      <div className="kb-page kb-page-left">
        <div className="kb-page-marg">Liber Primus · Praeambulum</div>
        <div style={{ marginTop: 32 }}>
          <div className="kb-chapter-numeral">I.</div>
          <div className="kb-chapter-kicker">— Präambel</div>
          <h2 className="kb-chapter-title">Recht ist <em>Würde,</em><br/>in Form gebracht.</h2>
          <p className="kb-chapter-lede">
            Der Mensch ist nicht der Akte gleich.<br/>
            Er ist ihr Ursprung — und ihr Ziel.
          </p>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Justitia size={48} />
          <div className="kb-marg" style={{ maxWidth: '22ch' }}>
            Die Waage wiegt nicht Schuld.<br/>
            Sie wiegt Aufmerksamkeit.
          </div>
        </div>
        <div className="kb-page-num">— 7 —</div>
      </div>

      <div className="kb-page kb-page-right">
        <div className="kb-page-marg">§ 1 — Leitgedanke</div>
        <div className="kb-body kb-dropcap" style={{ marginTop: 32 }}>
          <p>
            Eine Kanzlei ist kein Aktenschrank, sondern ein Versprechen: dass kein
            Anliegen liegen bleibt, weil es einen vermeintlich kleineren Streitwert
            trägt. Wir wiegen das Mandat nicht in Euro, sondern in Aufmerksamkeit.
          </p>
          <p>
            Tradition und Technologie sind hier keine Gegensätze. Recherche,
            Schriftsatz, Fristkontrolle — was Maschinen schneller können, dürfen
            sie. Was Menschen besser können — Zuhören, Abwägen, Vertreten — bleibt
            in menschlicher Hand.
          </p>
          <div className="kb-pull">
            „Effizienz ist die Demut vor der Zeit des Mandanten."
          </div>
          <p>
            Diese Webseite ist als Buch angelegt. Jedes Kapitel ein Aufschlag.
            Lesen Sie sich ein — oder springen Sie direkt zu Kapitel VI.
          </p>
        </div>
        <div className="kb-sig">
          <div className="kb-sig-line" />
          <div className="kb-sig-name">Kaan Kabataş, Rechtsanwalt</div>
        </div>
        <div className="kb-page-num">— 8 —</div>
      </div>
    </div>
  );
}

// Spread: Inhaltsverzeichnis (left) + Vita teaser (right)
function SpreadInhalt() {
  const chapters = [
    ['I', 'Präambel', 'Vom Leitgedanken einer modernen Kanzlei.', '7'],
    ['II', 'Vita', 'Werdegang, Stationen, Examina.', '15'],
    ['III', 'Rechtsgebiete', 'Wo unsere Aufmerksamkeit trägt.', '23'],
    ['IV', 'Mandantenversprechen', 'Was wir niemals liegen lassen.', '47'],
    ['V', 'Mandatsablauf', 'Online, am Telefon, oder vor Ort.', '61'],
    ['VI', 'Kontakt', 'Termin in 90 Sekunden.', '79'],
  ];
  return (
    <div className="kb-spread">
      <div className="kb-page kb-page-left">
        <div className="kb-page-marg">Index Capitulorum</div>
        <div style={{ marginTop: 36 }}>
          <div className="kb-chapter-kicker">— Inhaltsverzeichnis</div>
          <h2 className="kb-chapter-title" style={{ fontSize: 42, marginBottom: 24 }}>
            <em>Aufschlag</em> für Aufschlag.
          </h2>
          <div className="kb-toc">
            {chapters.map(([n, t, sub, p]) => (
              <div key={n} className="kb-toc-row">
                <div className="kb-toc-num">{n}.</div>
                <div>
                  <div className="kb-toc-title">{t}</div>
                  <span className="kb-toc-sub">{sub}</span>
                </div>
                <div className="kb-toc-page">{p}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="kb-page-num">— 5 —</div>
      </div>

      <div className="kb-page kb-page-right">
        <div className="kb-page-marg">II — Vita Brevis</div>
        <div style={{ marginTop: 36, display: 'flex', gap: 22 }}>
          <div className="kb-photo" style={{ width: 140, height: 180, flex: '0 0 140px' }}>
            <span className="kb-photo-label">Portrait</span>
          </div>
          <div style={{ flex: 1 }}>
            <div className="kb-chapter-kicker" style={{ marginTop: 0 }}>— Werdegang</div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400, fontSize: 28, lineHeight: 1.1, margin: '0 0 10px'
            }}>
              <em>Aus Köln.</em><br/>Für Mandantschaft, die zuhört.
            </h3>
            <div className="kb-body" style={{ maxWidth: '28ch' }}>
              <p>
                Volljurist. Erstes und Zweites Staatsexamen, beide mit Prädikat.
                Stationen in Wirtschaftskanzlei und Strafverteidigung.
              </p>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 18px',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.6, color: 'var(--ink)' }}>
          <span style={{ color: 'var(--ink-soft)' }}>2018 — 2023</span>
          <span>Studium der Rechtswissenschaften · Universität zu Köln</span>
          <span style={{ color: 'var(--ink-soft)' }}>2023 — 2024</span>
          <span>Erstes Staatsexamen · vollbefriedigend (10,8)</span>
          <span style={{ color: 'var(--ink-soft)' }}>2024 — 2025</span>
          <span>Referendariat · OLG Köln · Station Strafverteidigung</span>
          <span style={{ color: 'var(--ink-soft)' }}>2026</span>
          <span>Zulassung zur Rechtsanwaltschaft · eigene Kanzlei</span>
        </div>
        <div className="kb-marg" style={{ marginTop: 'auto' }}>
          <div className="kb-marg-rule" />
          Ein Lebenslauf ist kein Argument.<br/>
          Er ist eine Versprechensgrundlage.
        </div>
        <div className="kb-page-num">— 6 —</div>
      </div>
    </div>
  );
}

// Spread: Rechtsgebiete grid (left) + Mandatsablauf / Calendly (right)
function SpreadGebiete() {
  const cells = [
    ['§ 1', 'Zivilrecht', 'Vertrag, Schadensersatz, Mietsachen.'],
    ['§ 2', 'Familienrecht', 'Trennung, Unterhalt, Sorgerecht.'],
    ['§ 3', 'Strafrecht', 'Verteidigung in allen Instanzen.'],
    ['§ 4', 'Arbeitsrecht', 'Kündigung, Abfindung, Aufhebung.'],
    ['§ 5', 'Verkehrsrecht', 'OWi, Unfall, Fahrerlaubnis.'],
    ['§ 6', 'Erbrecht', 'Testament, Pflichtteil, Erbschein.'],
    ['§ 7', 'Mietrecht', 'Kündigung, Modernisierung, Schimmel.'],
    ['§ 8', 'Vertragsrecht', 'AGB, Verbraucher, Werkvertrag.'],
    ['§ 9', 'IT & Daten', 'DSGVO, Plattformen, KI-Compliance.'],
  ];
  return (
    <div className="kb-spread">
      <div className="kb-page kb-page-left">
        <div className="kb-page-marg">III — Rechtsgebiete</div>
        <div style={{ marginTop: 32 }}>
          <div className="kb-chapter-kicker">— Tätigkeitsfelder</div>
          <h2 className="kb-chapter-title" style={{ fontSize: 42, marginBottom: 6 }}>
            <em>Breit</em> aufgestellt.<br/>Tief vorbereitet.
          </h2>
          <p className="kb-chapter-lede" style={{ fontSize: 16, marginBottom: 10 }}>
            Eine Generalkanzlei für Mandanten,<br/>denen das ganze Leben begegnet.
          </p>
        </div>
        <div className="kb-rg">
          {cells.map(([n, t, d]) => (
            <div key={n} className="kb-rg-cell">
              <div className="kb-rg-num">{n}</div>
              <div className="kb-rg-title">{t}</div>
              <div className="kb-rg-desc">{d}</div>
            </div>
          ))}
        </div>
        <div className="kb-page-num">— 23 —</div>
      </div>

      <div className="kb-page kb-page-right">
        <div className="kb-page-marg">VI — Termin in 90 Sekunden</div>
        <div style={{ marginTop: 32 }}>
          <div className="kb-chapter-kicker">— Mandatsanfrage</div>
          <h2 className="kb-chapter-title" style={{ fontSize: 42, marginBottom: 18 }}>
            Sie wählen die <em>Form.</em>
          </h2>
          <div className="kb-cal">
            <div>
              <div className="kb-cal-h">So sprechen wir</div>
              <div className="kb-cal-sub">
                Drei Wege — keiner ist zweite Wahl. Die Anwaltsstunde gilt überall gleich.
              </div>
              <div className="kb-cal-mode">
                <div className="kb-cal-mode-row active">
                  <span className="kb-dot" />Videocall · 30 Min.
                </div>
                <div className="kb-cal-mode-row">
                  <span className="kb-dot" />Telefon · 20 Min.
                </div>
                <div className="kb-cal-mode-row">
                  <span className="kb-dot" />Vor Ort · Köln
                </div>
              </div>
            </div>
            <div>
              <div className="kb-cal-h">Mittwoch, 20. Mai</div>
              <div className="kb-cal-sub">Alle Zeiten in MEZ. Kostenfreie Erstsichtung.</div>
              <div className="kb-cal-grid">
                <div className="kb-cal-slot muted">09:00</div>
                <div className="kb-cal-slot">09:30</div>
                <div className="kb-cal-slot muted">10:00</div>
                <div className="kb-cal-slot">10:30</div>
                <div className="kb-cal-slot">11:00</div>
                <div className="kb-cal-slot pick">11:30</div>
                <div className="kb-cal-slot muted">13:00</div>
                <div className="kb-cal-slot">14:00</div>
                <div className="kb-cal-slot">14:30</div>
                <div className="kb-cal-slot">15:00</div>
                <div className="kb-cal-slot muted">15:30</div>
                <div className="kb-cal-slot">16:00</div>
              </div>
            </div>
          </div>
          <div className="kb-marg" style={{ marginTop: 18 }}>
            <div className="kb-marg-rule" />
            Wir nehmen das von Ihrer Schulter. Verfahrenslast bleibt bei uns —
            Ihre Zeit gehört Ihnen.
          </div>
        </div>
        <div className="kb-page-num">— 79 —</div>
      </div>
    </div>
  );
}

// Cover view — the closed book on its "shelf"
function ClosedCover({ title, motto, edition = 'Edition MMXXVI · No. I' }) {
  return (
    <div className="kb-cover-stage">
      <div className="kb-book">
        <div className="kb-book-spine" />
        <div className="kb-book-pages-edge" />
        <div className="kb-book-cover">
          <div className="kb-cover-frame">
            <div className="kb-cover-eyebrow">Liber Iuris · MMXXVI</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
              <Justitia size={56} style={{ color: 'var(--cover-trim)' }} />
              <div className="kb-cover-name">
                Kaan<br/><em>Kabataş</em>
              </div>
              <div className="kb-cover-role">{title}</div>
            </div>
            <div className="kb-cover-mark">
              <div style={{ width: 60, height: 1, background: 'var(--cover-trim)' }} />
              <div className="kb-cover-edition" style={{ fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: '0.04em', textTransform: 'none', color: 'var(--cover-fg-soft)' }}>{motto}</div>
              <div className="kb-cover-edition">{edition}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composite — a complete artboard rendering for a variant
function VariantBoard({ themeClass, motto = 'Audiatur et altera pars' }) {
  return (
    <div className={`kb-root ${themeClass}`}>
      <div className="kb-grain" />
      <TopNav activeKey="I" />
      <Leitsatz />
      <ChapterDivider>— Vorbemerkung des Verfassers</ChapterDivider>
      <div style={{ padding: '46px 56px' }}>
        <SpreadPraeambel />
      </div>
      <ChapterDivider>— Aufschlag II · III</ChapterDivider>
      <div style={{ padding: '46px 56px' }}>
        <SpreadInhalt />
      </div>
      <ChapterDivider>— Aufschlag IV · VI</ChapterDivider>
      <div style={{ padding: '46px 56px 64px' }}>
        <SpreadGebiete />
      </div>
      <div style={{
        padding: '28px 56px 36px', borderTop: '1px solid var(--rule)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
        letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-soft)',
      }}>
        <span>{motto}</span>
        <span>Kabataş Rechtsanwalt · Hohenzollernring · 50672 Köln</span>
        <span>© MMXXVI</span>
      </div>
    </div>
  );
}

Object.assign(window, {
  Justitia, TopNav, Leitsatz, ChapterDivider,
  SpreadPraeambel, SpreadInhalt, SpreadGebiete,
  ClosedCover, VariantBoard,
});
