// ============================================================
// LangToggle — KO / EN pill
// Props: { lang, setLang, ui }
// ============================================================
function LangToggle({ lang, setLang, ui }) {
  const t = window.t;
  return (
    <div className="lang" role="group" aria-label="language">
      <button className={lang === 'kor' ? 'on' : ''} onClick={() => setLang('kor')}>
        {t(ui.langKo, lang)}
      </button>
      <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
        {t(ui.langEn, lang)}
      </button>
    </div>
  );
}

window.LangToggle = LangToggle;
