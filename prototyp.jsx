// prototyp.jsx · v2
// Light stage, intro-plate left of the closed book, book slides to center as it opens.
// Page content trimmed so each face fits — no overflow.

const { useState, useEffect, useRef, useMemo, useCallback } = React;
const { TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakSlider } = window;

const SHEET_COUNT = 7;
const FLIP_COUNT  = 6;

const CHAPTERS = [
  { n: 'I',   key: 'praeambel',     title: 'Präambel' },
  { n: 'II',  key: 'vita',          title: 'Vita' },
  { n: 'III', key: 'rechtsgebiete', title: 'Rechtsgebiete' },
  { n: 'IV',  key: 'versprechen',   title: 'Versprechen' },
  { n: 'V',   key: 'mandat',        title: 'Mandat' },
  { n: 'VI',  key: 'kontakt',       title: 'Kontakt' },
];

const easeInOut = (t) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

function chapterIndexFromProgress(p) {
  if (p < 0.5) return -1;
  return clamp(Math.ceil(p) - 1, 0, CHAPTERS.length - 1);
}

// ───── Justitia mark ───────────────────────────────────────────────
function Jus({ size = 64, style }) {
  return (
    <div className="jus" style={{ width: size, height: size, ...style }}>
      <div className="pl" /><div className="bm" /><div className="ba" /><div className="ft" />
      <div className="pan l" /><div className="pan r" />
    </div>
  );
}

// ───── COVER FACES ────────────────────────────────────────────────
function CoverFace() {
  return (
    <div className="face front cover-face">
      <div className="scaler cover-scaler">
        <div className="cover-frame">
          <div className="cover-eyebrow">Liber Iuris · MMXXVI</div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 18 }}>
            <Jus size={64} style={{ color: 'var(--cover-trim)' }} />
            <div className="cover-name">Kaan<br/><em>Kabataş</em></div>
            <div className="cover-role">Rechtsanwalt · LL.M.</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 8 }}>
            <div style={{ width: 60, height: 1, background: 'var(--cover-trim)' }} />
            <div className="cover-motto">— Verbum tenere —</div>
            <div className="cover-edition">Edition MMXXVI · No. I</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackCoverContent() {
  return (
    <div className="face back cover-face">
      <div className="scaler cover-scaler">
        <div className="cover-frame">
        <div style={{ flex: 1 }} />
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 12 }}>
          <Jus size={44} style={{ color: 'var(--cover-trim)' }} />
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic',
              fontSize: 16, color: 'var(--cover-fg-soft)', textAlign:'center',
              maxWidth: '22ch', lineHeight: 1.4 }}>
            Was hier endet,<br/>hat im Mandat begonnen.
          </div>
        </div>
        <div className="cover-edition">— Colophon —</div>
      </div>
      </div>
    </div>
  );
}

// ───── PAGE SHELLS ────────────────────────────────────────────────
function ChapterTitlePage({ numeral, kicker, title, lede, pageNum }) {
  // Back face of the rotating leaf: own rotateY(180°) via .face.back unmirrors
  // when the parent .page is at -180°, so the content reads normally when
  // the leaf has flipped flat onto the left. During rotation 90°→180° the
  // content emerges naturally from edge-on to flat — like a real book leaf.
  return (
    <div className="face back">
      <div className="scaler">
        <div className="pg pg-left">
          <div className="pg-marg">Liber Iuris · Cap. {numeral}</div>
          <div className="pg-title-block">
            <div className="pg-numeral">{numeral}.</div>
            <div className="pg-kicker">— {kicker}</div>
            <h2 className="pg-title" dangerouslySetInnerHTML={{ __html: title }} />
            <p className="pg-lede" dangerouslySetInnerHTML={{ __html: lede }} />
          </div>
          <div className="pg-pagenum">{pageNum}</div>
        </div>
      </div>
    </div>
  );
}

function ChapterBodyPage({ side, marg, pageNum, children }) {
  return (
    <div className={`face ${side === 'front' ? 'front' : 'back'}`}>
      <div className="scaler">
        <div className="pg pg-right">
          <div className="pg-marg">{marg}</div>
          <div style={{ marginTop: 28, flex: 1, display:'flex', flexDirection:'column' }}>
            {children}
          </div>
          <div className="pg-pagenum">{pageNum}</div>
        </div>
      </div>
    </div>
  );
}

// ───── CHAPTER BODIES ─────────────────────────────────────────────
function PraeambelBody() {
  return (
    <ChapterBodyPage side="front" marg="§ 1 · Leitgedanke" pageNum="— 2 —">
      <p className="pg-pull" style={{ fontSize: 22, marginTop: 4, marginBottom: 22 }}>
        „Eine Kanzlei ist kein Aktenschrank — sondern ein Versprechen."
      </p>
      <div className="pg-body" style={{ maxWidth:'36ch' }}>
        <p>
          Wir wiegen das Mandat nicht in Euro, sondern in Aufmerksamkeit.
          Kein Anliegen bleibt liegen, weil es einen vermeintlich kleineren
          Streitwert trägt.
        </p>
        <p>
          Tradition und Technologie sind keine Gegensätze. Was Maschinen
          schneller können, dürfen sie. Was Menschen besser können — Zuhören,
          Abwägen, Vertreten — bleibt in menschlicher Hand.
        </p>
      </div>
      <div className="pg-sig">
        <div className="pg-sig-line" />
        <div className="pg-sig-name">Kaan Kabataş</div>
      </div>
    </ChapterBodyPage>
  );
}

function VitaBody() {
  const rows = [
    ['2018 — 23', 'Studium · Universität Bremen'],
    ['2023 — 24', 'Erstes Staatsexamen · vollbefr. (10,8)'],
    ['2024 — 25', 'Referendariat · LG Bremerhaven'],
    ['2025',      'Zweites Staatsexamen · vollbefr. (10,4)'],
    ['2026',      'Zulassung · Gründung der Kanzlei'],
  ];
  return (
    <ChapterBodyPage side="front" marg="II · Stationen" pageNum="— 4 —">
      <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic',
          fontSize: 17, color:'var(--ink-soft)', maxWidth:'32ch', marginBottom: 16,
          lineHeight: 1.45 }}>
        Zwei Examina mit Prädikat. Stationen in Wirtschaftsrecht,
        Strafverteidigung und im Ausland.
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'14px 22px',
          fontFamily:"'JetBrains Mono', monospace", fontSize: 11.5, lineHeight: 1.55,
          color:'var(--ink)' }}>
        {rows.map(([y, t]) => (
          <React.Fragment key={y}>
            <span style={{ color:'var(--ink-soft)', letterSpacing:'0.08em' }}>{y}</span>
            <span>{t}</span>
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 18,
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9.5,
          letterSpacing:'0.10em', lineHeight: 1.7, color:'var(--ink-soft)' }}>
        Mitglied im Deutschen Anwaltverein.<br/>
        Fachanwaltsausbildung: Strafrecht & Arbeitsrecht.
      </div>
    </ChapterBodyPage>
  );
}

function RechtsgebieteBody() {
  // Three columns: Bereich (area), Stichworte (keywords), Honorarmodell.
  // Reads like a proper directory entry, not just labelled tiles.
  const rows = [
    ['Zivilrecht',     'Vertrag · Schaden · Miete',         'Festpreis ab'],
    ['Familienrecht',  'Trennung · Unterhalt · Sorgerecht',  'Stundensatz'],
    ['Strafrecht',     'Verteidigung · alle Instanzen',     'Stundensatz'],
    ['Arbeitsrecht',   'Kündigung · Abfindung · AGB',       'Festpreis ab'],
    ['Verkehrsrecht',  'OWi · Unfall · Führerschein',       'Festpreis'],
    ['Erbrecht',       'Testament · Pflichtteil · Erbschein','Festpreis'],
    ['Mietrecht',      'Kündigung · Schimmel · Modernisierung','Festpreis'],
    ['IT & Daten',     'DSGVO · Plattformen · KI-Compliance', 'Stundensatz'],
  ];
  return (
    <ChapterBodyPage side="front" marg="III · Tätigkeitsfelder" pageNum="— 6 —">
      <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic',
          fontSize: 17, color:'var(--ink-soft)', maxWidth:'34ch', marginBottom: 14,
          lineHeight: 1.45 }}>
        Eine Generalkanzlei. Wer alles erlebt, soll nicht überall woanders fragen müssen.
      </div>
      <div className="rg-table">
        <div className="rg-head">
          <span>Bereich</span>
          <span>Stichworte</span>
          <span>Honorar</span>
        </div>
        {rows.map(([t, k, h], i) => (
          <div key={t} className="rg-row">
            <span className="rg-rn">{String(i + 1).padStart(2, '0')}</span>
            <span className="rg-rt">{t}</span>
            <span className="rg-rk">{k}</span>
            <span className="rg-rh">{h}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, fontFamily:"'JetBrains Mono', monospace",
          fontSize: 9, letterSpacing:'0.18em', color:'var(--ink-soft)',
          textTransform:'uppercase' }}>
        — Ihr Fall passt in keine Schublade? · Wir lotsen.
      </div>
    </ChapterBodyPage>
  );
}

function VersprechenBody() {
  const items = [
    ['01', 'Niemand bleibt liegen.',
      'Jede Anfrage — binnen 24 Stunden eine persönliche Antwort. Auch im Zweifel: kurze Einschätzung statt Schweigen.'],
    ['02', 'Klarheit, kein Jargon.',
      'Einfaches Deutsch. Präzise dort, wo es wirkt — nicht dort, wo es imponiert.'],
    ['03', 'Digital, wo es zählt.',
      'KI-gestützte Recherche, durchsuchbare Akten, Video-Termine. Ihre Zeit für Ihre Sache.'],
    ['04', 'Fehlerquote nahe Null.',
      'Doppelte Fristkontrolle, gegengelesene Schriftssätze. Maschinen sichern — Menschen entscheiden.'],
  ];
  return (
    <ChapterBodyPage side="front" marg="IV · Versprechen" pageNum="— 8 —">
      <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic',
          fontSize: 15, color:'var(--ink-soft)', maxWidth:'34ch', marginBottom: 12,
          lineHeight: 1.4 }}>
        Vier Sätze, die wir vor jeder Mandatsannahme unterschreiben.
      </div>
      <div className="promise-list" style={{ gap: 10 }}>
        {items.map(([n, h, d]) => (
          <div key={n} className="promise">
            <div className="promise-n">{n}</div>
            <div>
              <h4 className="promise-h" style={{ fontSize: 17 }}>{h}</h4>
              <p className="promise-d" style={{ fontSize: 11 }}>{d}</p>
            </div>
          </div>
        ))}
      </div>
    </ChapterBodyPage>
  );
}

function MandatBody() {
  const steps = [
    ['I',   'Schildern.',  'In eigenen Worten — Web, Telefon, oder Video.'],
    ['II',  'Sichten.',    'Erste Einordnung binnen 24h. Kostenfrei.'],
    ['III', 'Vereinbaren.','Strategie, Aufwand und Honorar — schriftlich, vor Beginn.'],
    ['IV',  'Vertreten.',  'Schriftsätze, Termine, Verhandlung. Sie bleiben auf dem Laufenden.'],
    ['V',   'Abschließen.','Schlussbrief. Akte 7 Jahre verschlüsselt verfügbar.'],
  ];
  return (
    <ChapterBodyPage side="front" marg="V · So arbeiten wir" pageNum="— 10 —">
      <div className="step-list">
        {steps.map(([n, h, d]) => (
          <div key={n} className="step">
            <div className="step-n">{n}.</div>
            <div>
              <h4 className="step-h">{h}</h4>
              <p className="step-d">{d}</p>
            </div>
          </div>
        ))}
      </div>
    </ChapterBodyPage>
  );
}

function KontaktBody() {
  const [mode, setMode] = useState(0);
  // Calendar view state: which month is currently shown
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(4); // 0=Jan, 4=May
  // Selected date (could be in a different month than the viewed one)
  const [selected, setSelected] = useState({ y: 2026, m: 4, d: 20 });
  const [slot, setSlot] = useState(5);

  const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  const DOW = ['Mo','Di','Mi','Do','Fr','Sa','So'];

  // Build the day grid for the viewed month (week starts Monday).
  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay  = new Date(viewYear, viewMonth + 1, 0);
  const startCol = (firstDay.getDay() + 6) % 7; // Mon=0
  const daysInMonth = lastDay.getDate();
  const cells = [];
  for (let i = 0; i < startCol; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const today = { y: 2026, m: 4, d: 17 };
  const isPast = (d) => {
    if (!d) return false;
    if (viewYear < today.y) return true;
    if (viewYear > today.y) return false;
    if (viewMonth < today.m) return true;
    if (viewMonth > today.m) return false;
    return d < today.d;
  };
  const isWeekend = (d) => {
    if (!d) return false;
    const wd = new Date(viewYear, viewMonth, d).getDay();
    return wd === 0 || wd === 6;
  };
  const isSel = (d) =>
    d === selected.d && viewMonth === selected.m && viewYear === selected.y;
  const isToday = (d) =>
    d === today.d && viewMonth === today.m && viewYear === today.y;

  const navMonth = (delta) => {
    let m = viewMonth + delta;
    let y = viewYear;
    while (m < 0) { m += 12; y -= 1; }
    while (m > 11) { m -= 12; y += 1; }
    setViewMonth(m); setViewYear(y);
  };
  const navYear = (delta) => setViewYear((y) => y + delta);

  // Mock available-slot generator: weekends muted; some random-ish weekdays
  // have fewer slots so it feels real.
  const slots = ['09:00','09:30','10:00','10:30','11:00','11:30','13:00','14:00','14:30','15:00','15:30','16:00'];
  const slotKey = `${selected.y}-${selected.m}-${selected.d}`;
  const mutedSet = new Set();
  if (isWeekend(selected.d)) {
    slots.forEach((_, i) => mutedSet.add(i));
  } else {
    // Deterministic pseudo-random based on day so it doesn't reshuffle.
    const seed = (selected.y * 13 + selected.m * 7 + selected.d) % 12;
    [seed % 12, (seed + 3) % 12, (seed + 7) % 12, (seed + 10) % 12].forEach((i) => mutedSet.add(i));
  }

  const selectedDate = new Date(selected.y, selected.m, selected.d);
  const selectedLabel = selectedDate.toLocaleDateString('de-DE',
    { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <ChapterBodyPage side="front" marg="VI · Termin in 90 Sek." pageNum="— 12 —">
      <div className="cal-modes-row">
        {['Videocall', 'Telefon', 'Vor Ort'].map((m, i) => (
          <button key={m} type="button"
            className={`cal-mode-pill ${i === mode ? 'active' : ''}`}
            onClick={() => setMode(i)}>
            {m}
          </button>
        ))}
        <span className="cal-mode-meta">
          {mode === 0 ? '30 Min. · Video' : mode === 1 ? '20 Min. · Telefon' : 'Bremerhaven · vor Ort'}
        </span>
      </div>

      <div className="cal-head">
        <button className="cal-nav" onClick={() => navMonth(-1)}>‹</button>
        <div className="cal-head-label">
          <div className="cal-month">{MONTHS[viewMonth]}</div>
          <div className="cal-year-row">
            <button className="cal-yr" onClick={() => navYear(-1)}>‹</button>
            <span>{viewYear}</span>
            <button className="cal-yr" onClick={() => navYear(+1)}>›</button>
          </div>
        </div>
        <button className="cal-nav" onClick={() => navMonth(+1)}>›</button>
      </div>

      <div className="cal-dow">
        {DOW.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="cal-days">
        {cells.map((d, i) => {
          if (d === null) return <span key={i} className="cal-day empty" />;
          const past = isPast(d);
          const we = isWeekend(d);
          return (
            <button key={i} type="button"
              disabled={past}
              className={`cal-day${isSel(d) ? ' sel' : ''}${past ? ' past' : ''}${we ? ' weekend' : ''}${isToday(d) ? ' today' : ''}`}
              onClick={() => !past && setSelected({ y: viewYear, m: viewMonth, d })}>
              {d}
            </button>
          );
        })}
      </div>

      <div className="cal-selected">
        <span className="cal-selected-label">{selectedLabel}</span>
        <span className="cal-selected-meta">
          {[...mutedSet].length >= 12 ? 'keine Termine'
            : `${12 - mutedSet.size} Slots verfügbar`}
        </span>
      </div>

      <div className="cal-grid">
        {slots.map((s, i) => (
          <button key={s} type="button"
            className={`cal-slot ${mutedSet.has(i) ? 'muted' : ''} ${i === slot ? 'picked' : ''}`}
            disabled={mutedSet.has(i)}
            onClick={() => { if (!mutedSet.has(i)) setSlot(i); }}>
            {s}
          </button>
        ))}
      </div>

      <button className="cal-confirm">
        <span>Termin bestätigen</span>
        <span style={{ color:'var(--accent)' }}>→</span>
      </button>
    </ChapterBodyPage>
  );
}

// ───── CHAPTER TITLES (left pages) ────────────────────────────────
function PraeambelTitle() {
  return <ChapterTitlePage numeral="I" kicker="Präambel"
    title='Recht ist <em>Würde,</em><br/>in Form gebracht.'
    lede='Der Mensch ist nicht der Akte gleich. Er ist ihr Ursprung — und ihr Ziel.'
    pageNum="— 1 —" />;
}
function VitaTitle() {
  // Naked left-page content with a full-bleed portrait placeholder.
  // Sheet wraps this in .static-back-page; we just deliver the .scaler.
  return (
    <div className="face back">
      <div className="scaler">
        <div className="pg pg-left" style={{ padding: '0' }}>
        <div className="pg-marg" style={{ position:'absolute', top: 22, left: 64 }}>
          Liber Iuris · Cap. II
        </div>
        {/* Full-page portrait placeholder */}
        <div style={{
          position: 'absolute', inset: '64px 64px 110px 64px',
          background:
            'linear-gradient(160deg, rgba(13,22,38,0.10) 0%, rgba(13,22,38,0.03) 60%),'+
            'repeating-linear-gradient(135deg, rgba(13,22,38,0.06) 0 6px, rgba(13,22,38,0.015) 6px 12px)',
          border: '1px solid var(--rule)',
          display: 'flex', alignItems: 'flex-end', padding: 28,
        }}>
          <div>
            <div style={{
              fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
              letterSpacing:'0.36em', textTransform:'uppercase',
              color: 'var(--ink-soft)', marginBottom: 10,
            }}>
              Portrait · Bildplatzhalter
            </div>
            <div className="pg-numeral" style={{ marginTop: 0, fontSize: 84 }}>II.</div>
            <div style={{
              fontFamily:"'Cormorant Garamond', serif", fontWeight: 400,
              fontSize: 32, lineHeight: 1.05, marginTop: 6,
              color: 'var(--ink)',
            }}>
              Aus <em style={{ color:'var(--accent)' }}>Bremerhaven.</em><br/>
              Für Menschen, die zuhören.
            </div>
          </div>
        </div>
        <div style={{
          position: 'absolute', top: 64, right: 80,
          fontFamily:"'JetBrains Mono', monospace", fontSize: 9,
          letterSpacing:'0.22em', textTransform:'uppercase',
          color: 'var(--ink-soft)',
          border: '1px solid var(--rule)', padding: '5px 9px',
          background: 'rgba(255,255,255,0.5)',
        }}>
          □  Foto folgt
        </div>
        <div className="pg-pagenum">— 3 —</div>
      </div>
      </div>
    </div>
  );
}
function RechtsgebieteTitle() {
  return <ChapterTitlePage numeral="III" kicker="Rechtsgebiete"
    title='<em>Breit</em> aufgestellt.<br/>Tief vorbereitet.'
    lede='Acht Säulen — von Zivil über Straf bis IT. Wenn Ihr Fall daneben liegt, lotsen wir Sie.'
    pageNum="— 5 —" />;
}
function VersprechenTitle() {
  return <ChapterTitlePage numeral="IV" kicker="Versprechen"
    title='Was wir<br/><em>niemals</em> liegen<br/>lassen.'
    lede='Vier Sätze, die wir vor jeder Mandatsannahme unterschreiben.'
    pageNum="— 7 —" />;
}
function MandatTitle() {
  return <ChapterTitlePage numeral="V" kicker="Mandatsablauf"
    title='<em>Fünf</em> Schritte<br/>von Sorge<br/>zu Ruhe.'
    lede='Jeder Schritt vorher angekündigt. Jede Frist von uns überwacht.'
    pageNum="— 9 —" />;
}
function KontaktTitle() {
  return <ChapterTitlePage numeral="VI" kicker="Kontakt"
    title='Sie wählen<br/>die <em>Form.</em>'
    lede='Video, Telefon, Schreibtisch. Die Anwaltsstunde gilt überall gleich.'
    pageNum="— 11 —" />;
}

// ───── INTRO PLATE (left of closed book) ──────────────────────────
function IntroPlate({ visibility, x, width }) {
  const opacity = clamp(visibility, 0, 1);
  if (opacity < 0.02) return null;
  return (
    <div className="intro-plate"
      style={{
        left: x,
        width,
        opacity,
        // Translate ONLY horizontally for the entry/exit shift. Vertical
        // positioning is now driven by the CSS `top: 110px; bottom: 70px`
        // box — a translateY here would override that and lift the plate up
        // behind the navbar (which is exactly the bug the user saw).
        transform: `translateX(${(1 - visibility) * -28}px)`,
      }}>
      <div className="intro-meta">
        <span className="ruler" />
        <span>Liber Iuris · MMXXVI · Vol. I</span>
      </div>
      {/* Hero — photographic Lady-Justice scales as the visual anchor for
          the closed book. Image is from Unsplash (Tingey Injury Law). */}
      <div className="intro-hero">
        <svg viewBox="0 -30 200 280" className="intro-hero-svg"
             preserveAspectRatio="xMidYMid meet"
             aria-label="Justitia" role="img">
          {/* Soft warm spotlight behind the figure */}
          <defs>
            <radialGradient id="halo" cx="50%" cy="42%" r="55%">
              <stop offset="0%" stopColor="rgba(255,220,150,0.18)" />
              <stop offset="100%" stopColor="rgba(255,220,150,0)" />
            </radialGradient>
          </defs>
          <rect width="200" height="240" fill="url(#halo)" />

          {/* === Justitia silhouette (gold strokes) === */}
          {/* Head + crown of hair */}
          <g stroke="var(--cover-trim)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="100" cy="50" rx="10" ry="11" />
            {/* Hair line */}
            <path d="M89 47 C 90 38, 110 38, 111 47" />
            {/* Blindfold */}
            <rect x="89" y="48" width="22" height="4.5" fill="var(--cover-trim)" opacity="0.85" />
            {/* Neck */}
            <path d="M96 61 L96 66 M104 61 L104 66" />

            {/* Shoulders & robe upper */}
            <path d="M80 70 C 82 70, 96 66, 100 66 C 104 66, 118 70, 120 70" />
            {/* Robe sides flowing down */}
            <path d="M80 70 C 74 100, 70 150, 64 200" />
            <path d="M120 70 C 126 100, 130 150, 136 200" />
            {/* Center robe folds */}
            <path d="M100 66 L100 200" opacity="0.5" />
            <path d="M93 75 L90 200" opacity="0.4" />
            <path d="M107 75 L110 200" opacity="0.4" />
            {/* Robe hem flare */}
            <path d="M64 200 C 70 210, 100 215, 136 200" />
            <path d="M58 215 C 80 222, 120 222, 142 215" opacity="0.6" />

            {/* === Scales (raised left arm) === */}
            {/* Arm */}
            <path d="M80 75 C 60 70, 40 55, 28 38" strokeWidth="1.6" />
            {/* Beam */}
            <line x1="14" y1="34" x2="64" y2="34" strokeWidth="1.4" />
            {/* Vertical from beam center to hand */}
            <line x1="39" y1="34" x2="34" y2="38" strokeWidth="1" />
            {/* Chains */}
            <line x1="18" y1="34" x2="14" y2="48" />
            <line x1="22" y1="34" x2="26" y2="48" />
            <line x1="56" y1="34" x2="52" y2="48" />
            <line x1="60" y1="34" x2="64" y2="48" />
            {/* Pans */}
            <path d="M10 48 Q 20 56, 30 48" fill="var(--cover-trim)" fillOpacity="0.12" />
            <path d="M48 48 Q 58 56, 68 48" fill="var(--cover-trim)" fillOpacity="0.12" />

            {/* === Sword (right arm down) === */}
            {/* Arm */}
            <path d="M120 75 C 138 95, 152 130, 162 165" strokeWidth="1.6" />
            {/* Hand grip */}
            <line x1="160" y1="166" x2="166" y2="172" strokeWidth="2" />
            {/* Crossguard */}
            <line x1="152" y1="174" x2="172" y2="166" strokeWidth="1.6" />
            {/* Blade */}
            <line x1="160" y1="174" x2="186" y2="226" strokeWidth="1.4" />
            {/* Blade tip */}
            <path d="M184 220 L188 228 L184 228 Z" fill="var(--cover-trim)" />

            {/* === Decorative aura lines === */}
            <path d="M30 10 L100 6 L170 10" opacity="0.35" />
            <path d="M14 22 L186 22" opacity="0.18" strokeDasharray="2 6" />
          </g>
        </svg>
        <div className="intro-hero-caption">
          <span>Audiatur et altera pars</span>
        </div>
      </div>
      <h1 className="intro-h">
        Recht ist <em>Würde,</em><br/>in Form gebracht.
      </h1>
      <p className="intro-sub">
        Eine Kanzlei für alles, was Ihnen im Recht begegnet —
        modern, persönlich, in Bremerhaven.
      </p>
      {/* Intro-foot removed — the footer strip already carries kanzlei
          address, sprechzeit and erstsichtung, so duplicating them here
          made the intro plate run into the footer and the values read as
          oversized body text. The hero + headline + sub now stand alone. */}
    </div>
  );
}

// ───── TOP NAV ────────────────────────────────────────────────────
function TopNav({ activeChapter, jumpTo }) {
  return (
    <div className="topbar">
      <div className="topbar-brand">
        Kaan <em>Kabataş</em>
        <span className="role">Rechtsanwalt · LL.M.</span>
      </div>
      <div className="topbar-links">
        {CHAPTERS.map((c, i) => (
          <button key={c.n} className={activeChapter === i ? 'active' : ''}
            onClick={() => jumpTo(i + 1)}>
            <span style={{ opacity: 0.55, marginRight: 6 }}>{c.n}.</span>{c.title}
          </button>
        ))}
      </div>
      <button className="topbar-cta" onClick={() => jumpTo(6)}>
        <span className="dot" />Termin buchen
      </button>
    </div>
  );
}

// ───── PROGRESS RAIL ──────────────────────────────────────────────
function ProgressRail({ progress, jumpTo, visible }) {
  if (!visible) return null;
  const active = chapterIndexFromProgress(progress);
  const items = [{ key: 'cover', label: 'Einband', target: 0 },
    ...CHAPTERS.map((c, i) => ({ key: c.key, label: `${c.n}. ${c.title}`, target: i + 1 }))];
  return (
    <div className="progress">
      {items.map((it, i) => {
        const isActive = (i === 0 && active === -1) || (i - 1 === active);
        return (
          <button key={it.key} onClick={() => jumpTo(it.target)}
            className={isActive ? 'active' : ''}>
            <span className="pip" />
            <span className="tip">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ───── THE SHEET ──────────────────────────────────────────────────
// Each scroll-unit corresponds to ONE chapter. The flip animation itself
// runs in the first FLIP_RANGE of the unit. Content reveal happens LATE
// in the flip (fp >= CONTENT_START) so that the rotating page — with its
// blank back face — is fully visible through the rotation before the new
// spread crossfades in over the flat page.
const FLIP_RANGE    = 0.40;
const CONTENT_START = 0.82;
const CONTENT_END   = 1.00;

function Sheet({ index, progress, totalSheets, curlIntensity, frontFace, backContent }) {
  const raw = progress - index;
  const fp = clamp(raw / FLIP_RANGE, 0, 1);
  const eased = easeInOut(fp);
  const rot = -180 * eased;

  // Z-index: rotating sheet on top while in flight; afterwards drops to
  // the back-stack (left). Before the flip, stacks on the right with later
  // sheets behind. The NEXT sheet (index+1) below this one shows through
  // gradually as this sheet rotates away — physical reveal, no swap.
  let z;
  if (fp >= 1) z = 100 + index;
  else if (raw <= 0) z = totalSheets - index;
  else z = 1000 + Math.round(eased * 50);

  const tilt = Math.sin(eased * Math.PI);
  const shadeFront = tilt * 0.28 * curlIntensity;
  const shadeBack = tilt * 0.18 * curlIntensity;

  // Pure 3D rotation. Both faces are children of .page (which has
  // transform-style: preserve-3d). The .face.back element carries its own
  // rotateY(180°) so its content reads normally when the leaf is fully
  // flipped. Browser's backface-visibility handles WHICH face is visible
  // based on rotation — no JS toggles, no opacity tricks, no overlay layers.
  //
  // NOTE: We intentionally do NOT apply `filter: drop-shadow(...)` here.
  // CSS filters create a new flat rendering context, which collapses the
  // 3D space and breaks backface-visibility (root cause of the mirrored-
  // content-bleed-through bug). Page shadow is handled by per-face
  // box-shadows instead.
  return (
    <div className="page" style={{
      transform: `rotateY(${rot}deg)`,
      zIndex: z,
      '--shade-r': shadeFront,
      '--shade-l': shadeBack,
    }}>
      {frontFace}
      {backContent}
    </div>
  );
}

// ───── MOBILE SINGLE-PAGE READER ──────────────────────────────────
// On narrow screens the two-page spread is unreadable (each page would be
// ~150px wide). Instead we show ONE page at a time, near full-width, and
// turn pages with a 3D leaf-flip driven by the same scroll progress.
// Desktop is untouched — this component is only rendered when isNarrow.
function MobileBook({ progress, pages, viewport }) {
  const RATIO = 680 / 490; // reference page aspect (h/w)
  const availW = viewport.w - 28;          // 14px side margins
  const availH = viewport.h - 150;         // room for nav + footer + rail
  let pageW = Math.min(availW, availH / RATIO);
  pageW = Math.max(pageW, 240);
  const pageH = pageW * RATIO;
  const scale = pageH / 680;

  const N = pages.length;
  const fpos = clamp((progress / FLIP_COUNT) * (N - 1), 0, N - 1);
  const cur = clamp(Math.floor(fpos), 0, N - 2);
  const frac = clamp(fpos - cur, 0, 1);
  const eased = easeInOut(frac);
  const turn = -172 * eased;               // current page lifts & turns away left

  // Two layers: the next page rests beneath; the current page turns on top.
  const layers = [
    { idx: cur + 1, rot: 0,    z: 1, turning: false },
    { idx: cur,     rot: turn, z: 2, turning: true },
  ];

  return (
    <div className="mobile-book" style={{ width: `${pageW}px`, height: `${pageH}px` }}>
      <div className="mb-stack" style={{ width: `${pageW}px`, height: `${pageH}px` }}>
        {layers.map((L) => (
          <div key={L.turning ? 'top' : 'bottom'} className="mb-page"
            style={{
              width: `${pageW}px`, height: `${pageH}px`,
              '--page-scale': scale,
              transform: `rotateY(${L.rot}deg)`,
              zIndex: L.z,
            }}>
            {pages[L.idx]}
            {L.turning && frac > 0.002 &&
              <div className="mb-turn-shade" style={{ opacity: Math.sin(eased * Math.PI) * 0.5 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ───── APP ────────────────────────────────────────────────────────
function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "theme": "verbum",
    "curlIntensity": 1,
    "showProgress": true,
    "showHint": true,
    "showIntro": true,
    "bookSize": 820
  }/*EDITMODE-END*/;
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [progress, setProgress] = useState(0);
  const [viewport, setViewport] = useState({ w: 1280, h: 800 });
  const driverRef = useRef(null);

  // Drive progress + viewport off of scroll/resize
  useEffect(() => {
    const onScroll = () => {
      const driver = driverRef.current;
      if (!driver) return;
      const rect = driver.getBoundingClientRect();
      const total = driver.offsetHeight - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, total);
      const p = (scrolled / total) * FLIP_COUNT;
      setProgress(p);
    };
    const onResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      onScroll();
    };
    onResize();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const jumpTo = useCallback((targetProgress) => {
    const driver = driverRef.current;
    if (!driver) return;
    const total = driver.offsetHeight - window.innerHeight;
    const targetScroll = (targetProgress / FLIP_COUNT) * total + driver.offsetTop;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        jumpTo(clamp(Math.floor(progress) + 1, 0, FLIP_COUNT));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        jumpTo(clamp(Math.ceil(progress) - 1, 0, FLIP_COUNT));
      } else if (e.key === 'Home') jumpTo(0);
      else if (e.key === 'End')   jumpTo(FLIP_COUNT);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [progress, jumpTo]);

  const activeChapter = chapterIndexFromProgress(progress);

  // Sheet content: each sheet has a frontFace (right page when unflipped)
  // and a backContent (left page after flipping, rendered as a static layer).
  // backIsCover flags the trailing sheet (back cover) so its static layer
  // gets navy-gradient styling instead of paper.
  const sheetContents = [
    { front: <CoverFace key="cover" />,           back: <PraeambelTitle key="praeambel-t" />, frontIsCover: true },
    { front: <PraeambelBody key="praeambel-b" />, back: <VitaTitle key="vita-t" /> },
    { front: <VitaBody key="vita-b" />,           back: <RechtsgebieteTitle key="recht-t" /> },
    { front: <RechtsgebieteBody key="recht-b" />, back: <VersprechenTitle key="versp-t" /> },
    { front: <VersprechenBody key="versp-b" />,   back: <MandatTitle key="mandat-t" /> },
    { front: <MandatBody key="mandat-b" />,       back: <KontaktTitle key="kontakt-t" /> },
    { front: <KontaktBody key="kontakt-b" />,     back: <BackCoverContent key="back-cover" />, backIsCover: true },
  ];

  // Reading-order flattening for the mobile single-page reader:
  // [Cover, Präambel-Titel, Präambel-Text, Vita-Titel, … Kontakt-Text, Rückseite]
  const mobilePages = [];
  sheetContents.forEach((sc) => { mobilePages.push(sc.front); mobilePages.push(sc.back); });

  // ─── Layout math ───
  // Book geometry is responsive: bookH clamps to viewport height so the
  // book always fits with room for the nav (~75px) and bottom hint (~50px).
  // The book width is ALWAYS the full spread; opening is a horizontal
  // SHIFT, not a width morph. Each .page is half the spread (= 1 page).
  const pageRatio = 0.72;
  const bookH = Math.min(t.bookSize, Math.max(420, viewport.h * 0.84), viewport.w * 0.56);
  const pageW = bookH * pageRatio;
  const spreadW = pageW * 2;
  const bookW = spreadW;

  // openness ∈ [0, 1]: how "open" the book is, position-wise.
  // We tie this to the first flip — by the time the cover is fully flipped
  // (progress = 1), the book has slid to viewport center.
  const openness = clamp(progress / FLIP_RANGE, 0, 1);
  const easedOpen = easeInOut(openness);

  // Closed position: the cover (right page) sits centered at ~70% of the
  // viewport, leaving the left half clear for the intro plate.
  // Cover center horizontally = bookCenter + pageW/2 (since spine = bookCenter).
  const isWide = viewport.w > 940;
  const isNarrow = viewport.w <= 760;   // mobile single-page reading mode
  const closedCoverCenter = viewport.w * (isWide ? 0.68 : 0.58);
  const closedBookCenter = closedCoverCenter - pageW / 2;
  const openBookCenter = viewport.w / 2;
  const bookCenterX = lerp(closedBookCenter, openBookCenter, easedOpen);
  const bookOffsetFromCenter = bookCenterX - viewport.w / 2;

  // Intro plate: sits on the left side when closed, fades out as we open.
  const introMaxRight = closedBookCenter - pageW / 2 - 40; // don't overlap book
  const introWidth = Math.min(440, introMaxRight - viewport.w * 0.05);
  const introX = viewport.w * 0.05;
  const introVisibility = 1 - clamp(progress * 5, 0, 1);  // gone by progress=0.2 — fast retreat
  const showIntro = t.showIntro && isWide && introWidth > 220;

  return (
    <div ref={driverRef} id="scroll-driver" style={{ height: `${100 + FLIP_COUNT * 100}vh` }}>
      <div className="stage" data-theme={t.theme} data-book-open={progress > 0.25 ? 'true' : 'false'}>
        <TopNav activeChapter={activeChapter} jumpTo={jumpTo} />

        <div className="stage-ornament left">
          <span className="orn-rule" />
          <span>Pacta Servanda</span>
          <span className="orn-rule" />
        </div>
        <div className="stage-ornament right">
          <span className="orn-rule" />
          <span>Ars Aequi</span>
          <span className="orn-rule" />
        </div>
        <div className="stage-corner top-left">
          <span className="fleuron">❦</span>
          <span>Liber I</span>
        </div>
        <div className="stage-corner top-right">
          <span className="fleuron">§</span>
          <span>Anno MMXXVI</span>
        </div>
        <div className="stage-corner bottom-left">
          <span className="fleuron">❦</span>
          <span>Bremerhaven</span>
        </div>
        <div className="stage-corner bottom-right">
          <span className="fleuron">§</span>
          <span>Editio Prima</span>
        </div>
        <div className="stage-spine-mark top" />
        <div className="stage-spine-mark bottom" />

        {showIntro && <IntroPlate visibility={introVisibility} x={introX} width={introWidth} />}

        {isNarrow ? (
          <MobileBook progress={progress} pages={mobilePages} viewport={viewport} />
        ) : (
        <div className="book-wrap"
          style={{
            transform: `translate(${bookOffsetFromCenter}px, 0)`,
          }}>
          <div className="book"
            data-closed={progress < 0.06}
            style={{
              '--book-w': `${bookW}px`,
              '--book-h': `${bookH}px`,
              '--page-scale': bookH / 680,
              transform: `translate(-50%, -50%) rotateX(${2 - easedOpen * 1.5}deg)`,
            }}>
            {sheetContents.map((sc, i) => (
              <Sheet key={i} index={i} progress={progress} totalSheets={SHEET_COUNT}
                curlIntensity={t.curlIntensity}
                frontFace={sc.front}
                backContent={sc.back}
                frontIsCover={!!sc.frontIsCover}
                backIsCover={!!sc.backIsCover} />
            ))}
            <div className="spine-shadow" />
          </div>
        </div>
        )}

        <ProgressRail progress={progress} jumpTo={jumpTo} visible={t.showProgress} />

        {/* Scroll-hint removed — the closed book is self-evident, and the
            footer strip already anchors the bottom. */}
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Materialität">
          <TweakRadio label="Variante" value={t.theme} onChange={(v) => setTweak('theme', v)}
            options={[
              { label: 'I · Audi.',  value: 'audiatur' },
              { label: 'II · Verb.', value: 'verbum' },
              { label: 'III · Ver.', value: 'veritas' },
            ]} />
        </TweakSection>
        <TweakSection label="Buch">
          <TweakSlider label="Größe" min={520} max={840} step={20} unit="px"
            value={t.bookSize} onChange={(v) => setTweak('bookSize', v)} />
          <TweakSlider label="Page-Curl" min={0} max={2} step={0.1}
            value={t.curlIntensity} onChange={(v) => setTweak('curlIntensity', v)} />
        </TweakSection>
        <TweakSection label="UI">
          <TweakToggle label="Linkes Manifest" value={t.showIntro}
            onChange={(v) => setTweak('showIntro', v)} />
          <TweakToggle label="Kapitel-Leiste rechts" value={t.showProgress}
            onChange={(v) => setTweak('showProgress', v)} />
          <TweakToggle label="Scroll-Hinweis" value={t.showHint}
            onChange={(v) => setTweak('showHint', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
