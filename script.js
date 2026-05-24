const topbar = document.querySelector(".topbar");
const reveals = Array.from(document.querySelectorAll(".reveal"));

const updateTopbar = () => {
  if (!topbar) return;
  if (window.scrollY > 8) {
    topbar.classList.add("is-active");
  } else {
    topbar.classList.remove("is-active");
  }
};

updateTopbar();
window.addEventListener("scroll", updateTopbar, { passive: true });

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  }
);

for (const section of reveals) {
  observer.observe(section);
}

// --- Tag filtering for projects + posts ---
const setupFilter = ({ listSelector, itemSelector, emptySelector }) => {
  const list = document.querySelector(listSelector);
  if (!list) return;

  const empty = emptySelector ? document.querySelector(emptySelector) : null;
  const chips = Array.from(
    list.parentElement.querySelectorAll(".filter-chip")
  );

  const applyFilter = (filter) => {
    const items = Array.from(list.querySelectorAll(itemSelector));
    let visible = 0;
    for (const item of items) {
      const tags = (item.dataset.tags || "").toLowerCase().split(/\s+/);
      const match = filter === "all" || tags.includes(filter);
      item.style.display = match ? "" : "none";
      if (match) visible += 1;
    }
    if (empty) {
      const shouldShow = items.length === 0 || visible === 0;
      empty.classList.toggle("is-hidden", !shouldShow);
    }
  };

  for (const chip of chips) {
    chip.addEventListener("click", () => {
      for (const c of chips) c.classList.remove("is-active");
      chip.classList.add("is-active");
      applyFilter((chip.dataset.filter || "all").toLowerCase());
    });
  }

  applyFilter("all");
};

setupFilter({
  listSelector: "#project-grid",
  itemSelector: ".project-card",
  emptySelector: "#empty-state"
});

setupFilter({
  listSelector: "#post-list",
  itemSelector: ".post-item",
  emptySelector: "#post-empty"
});

// --- i18n: EN base, RU overlay; default = browser language; toggle saved in localStorage ---
const TRANSLATIONS_RU = {
  // common nav / brand
  brand_name: "михаил сизов",
  nav_home: "главная",
  nav_work: "опыт",
  nav_projects: "проекты",
  nav_posts: "посты",
  nav_contact: "контакты",

  // home — hero
  hero_tags: '<span class="tag-label">интересы</span><span class="tag-marquee"><span class="tag-track"><span class="tag-group"><span class="hashtag">#ai</span><span class="sep">·</span><span class="hashtag">#квант-финансы</span><span class="sep">·</span><span class="hashtag">#моделирование-рисков</span><span class="sep">·</span><span class="hashtag">#финтех</span><span class="sep">·</span><span class="hashtag">#инвестиции</span><span class="sep">·</span><span class="hashtag">#llm-продукты</span></span><span class="tag-group" aria-hidden="true"><span class="hashtag">#ai</span><span class="sep">·</span><span class="hashtag">#квант-финансы</span><span class="sep">·</span><span class="hashtag">#моделирование-рисков</span><span class="sep">·</span><span class="hashtag">#финтех</span><span class="sep">·</span><span class="hashtag">#инвестиции</span><span class="sep">·</span><span class="hashtag">#llm-продукты</span></span></span></span>',
  hero_name: "Михаил Сизов",
  hero_p1: "В Т-Банке руковожу командой моделирования структурных рисков.",
  hero_p2: "До этого три года занимался моделированием структурных рисков в Райффайзенбанке, а раньше моделировал риски в Банке России.",
  hero_p3: "Окончил НИУ ВШЭ: магистратура Data Science на ФКН и бакалавриат «Экономика и финансы» в МИЭФ — с двойным дипломом London School of Economics. Сертифицирован FRM (Part I & II).",
  hero_p4: "Параллельно вёл в ВШЭ курсы Quantitative Finance и Asset Pricing & Financial Markets.",
  hero_p5: "Главное удовольствие — собирать небольшие продукты в финтехе, инвестициях и риске: те, что превращают аналитические идеи во что-то, чем реально можно пользоваться.",
  cta_see_work: "посмотреть работы",
  cta_contact_me: "написать &rarr;",

  // contact footer
  contact_eyebrow: "контакты",
  contact_title: "Связаться",
  contact_cv: "резюме (pdf)",

  // work page
  cv_button: "скачать резюме",
  work_exp_eyebrow: "опыт",
  work_exp_title: "Где я работал",

  // T Bank
  t_date: "ФЕВ 2026 — Н.В.",
  t_company: "Т-Банк",
  t_meta: "Full-time · Москва",
  t_role: "Lead Analyst — руководитель команды моделирования структурных рисков",
  t_period: "Фев 2026 — наст. время",

  // Raiffeisen
  r_date: "МАЙ 2023 — ФЕВ 2026",
  r_company: "АО «Райффайзенбанк»",
  r_meta: "Full-time · 2 г 10 мес · Москва",
  r_role1: "Senior Quantitative Analyst, Vice President — Управление рисками финансовых рынков",
  r_period1: "Ноя 2024 — Фев 2026 · 1 г 4 мес",
  r_b11: "Спроектировал и развернул внутренний LLM-чат-бот: понимает вопросы пользователя, генерирует SQL и достаёт реальные риск-данные из внутренних систем.",
  r_b12: "Расширил бота: автогенерация презентаций для комитетов, what-if сценарии, объяснение динамики метрик ликвидности.",
  r_b13: "Разработал MCP-серверы для автогенерации отчётности и расчёта рисков ликвидности и процентного риска.",
  r_b14: "Собрал AI-портфель-бенчмарк для оценки фондов — отбор акций и доходность бенчмарка по структурированным данным компаний и макро, с объяснимостью.",
  r_role2: "Senior Quantitative Analyst — Управление рисками финансовых рынков",
  r_period2: "Июл 2024 — Ноя 2024 · 5 мес",
  r_b21: "Построил бенчмарки для оценки доходности паевых фондов.",
  r_b22: "Обновил модели досрочного погашения по частным кредитам и intraday-модели ликвидности по корпоративным обязательствам.",
  r_role3: "Quantitative Analyst — Управление рисками финансовых рынков",
  r_period3: "Май 2023 — Июн 2024 · 1 г 2 мес",
  r_b31: "Построил модели оценки риска ликвидности и процентного риска корпоративных и частных обязательств, включая внебалансовые компоненты.",
  r_b32: "Разработал модели расчёта вменённой волатильности валютных опционов.",

  // CBR
  cbr_date: "ДЕК 2021 — МАЙ 2023",
  cbr_company: "Банк России (ЦБ РФ)",
  cbr_meta: "Full-time · 1 г 6 мес · Москва",
  cbr_role1: "Ведущий экономист — моделирование рисков, Департамент банковского регулирования и аналитики",
  cbr_period1: "Дек 2022 — Май 2023 · 6 мес",
  cbr_b11: "Применил ML (бустинги, логиты и др.) для Early Warning System по выявлению рисковых заёмщиков банков.",
  cbr_b12: "Через симуляции присваивал PD кредитным рейтингам.",
  cbr_b13: "Валидировал модели прогноза доходов и формировал критерии к данным, которые банки передают регулятору.",
  cbr_role2: "Экономист 1-й категории — моделирование рисков, Департамент банковского регулирования и аналитики",
  cbr_period2: "Дек 2021 — Дек 2022 · 1 г 1 мес",
  cbr_b21: "Разработал стохастическую модель балансов банков на оптимизационных методах.",
  cbr_b22: "Участвовал в моделировании PD и ad-hoc аналитике по данным банков.",

  // 2021 internships
  i_date: "2021",
  i_company: "Limpid VC · Mars Wrigley · Milestone Capital",
  i_meta: "Стажировки · 2021",
  i_vc_role: "VC Analyst — Limpid VC Fund",
  i_vc_period: "Сен 2021 — Дек 2021",
  i_vc_b1: "Анализ метрик стартапов, скоринговые модели и их защита, прямое общение с фаундерами.",
  i_mars_role: "FP&amp;A Trainee — Mars Wrigley",
  i_mars_period: "Май 2021 — Окт 2021",
  i_mars_b1: "Анализ P&amp;L и cashflow, консолидация KPI, поддержка финансового планирования.",
  i_ms_role: "Private Equity Analyst Intern — Milestone Capital",
  i_ms_period: "Мар 2021 — Июн 2021",
  i_ms_b1: "Работа с базами при анализе компаний; саммари по CIM и тизерам; отраслевые исследования.",

  // education
  edu_eyebrow: "образование",
  edu_title: "Образование",
  msc_eyebrow: "2022 — 2025",
  msc_title: "Магистратура · Data Science",
  msc_p: "НИУ ВШЭ, Факультет компьютерных наук. GPA 7,95 / 10.",
  bsc_eyebrow: "2018 — 2022",
  bsc_title: "Бакалавриат · Экономика и финансы",
  bsc_p: "НИУ ВШЭ / МИЭФ (ICEF) — двойной диплом с London School of Economics. GPA 8,29 / 10.",

  // credentials
  cred_eyebrow: "сертификаты",
  cred_title: "Сертификаты и языки",
  frm_eyebrow: "авг 2025",
  frm_title: "FRM Part I &amp; II — certified",
  frm_p: "Сертификация Financial Risk Manager (GARP).",
  langs_eyebrow: "языки и инструменты",
  langs_title: "Python, SQL, R",
  langs_p: "Русский — родной, английский — fluent (IELTS 7.5).",

  // projects
  proj_eyebrow: "проекты",
  proj_title: "Что я делаю",
  proj_filter_all: "все",
  proj_empty_eyebrow: "в разработке",
  proj_empty_copy: 'Проекты появятся здесь скоро. Загляни позже или <a href="./index.html#contact">напиши</a>, если хочешь услышать о них раньше.',

  // posts
  posts_eyebrow: "посты",
  posts_title: "Заметки, ссылки, публикации",
  posts_filter_all: "все",
  posts_empty_eyebrow: "в разработке",
  posts_empty_copy: "Записи появятся здесь — короткие заметки и ссылки на Telegram, YouTube и другие площадки.",

  // page titles
  page_title_home: "Михаил Сизов",
  page_title_work: "Михаил Сизов | Опыт",
  page_title_projects: "Михаил Сизов | Проекты",
  page_title_posts: "Михаил Сизов | Посты",
};

const LANG_STORAGE_KEY = "ms-lang";

function snapshotEnglish() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    if (!el.dataset.en) el.dataset.en = el.innerHTML;
  });
  const title = document.querySelector("title[data-i18n]");
  if (title && !title.dataset.en) title.dataset.en = title.textContent;
}

function applyLang(lang) {
  const norm = lang === "ru" ? "ru" : "en";
  document.documentElement.lang = norm;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (norm === "ru" && TRANSLATIONS_RU[key]) {
      el.innerHTML = TRANSLATIONS_RU[key];
    } else {
      el.innerHTML = el.dataset.en;
    }
  });
  const title = document.querySelector("title[data-i18n]");
  if (title) {
    const key = title.dataset.i18n;
    title.textContent =
      norm === "ru" && TRANSLATIONS_RU[key] ? TRANSLATIONS_RU[key] : title.dataset.en;
  }
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.textContent = norm === "en" ? "ru" : "en";
    btn.setAttribute("aria-label", norm === "en" ? "Switch to Russian" : "Switch to English");
  });
  try {
    localStorage.setItem(LANG_STORAGE_KEY, norm);
  } catch (e) {}
}

function detectInitialLang() {
  // explicit URL override wins
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  if (urlLang === "ru" || urlLang === "en") return urlLang;
  // previous choice in this browser
  let saved = null;
  try { saved = localStorage.getItem(LANG_STORAGE_KEY); } catch (e) {}
  if (saved === "ru" || saved === "en") return saved;
  // first visit — follow the browser language
  const browser = (navigator.language || navigator.userLanguage || "en").toLowerCase();
  return browser.startsWith("ru") ? "ru" : "en";
}

// Typewriter effect for the portrait name on the home page
let _typeTimer = null;
function typewriteName() {
  const el = document.querySelector(".portrait-name");
  if (!el) return;
  if (_typeTimer) {
    clearTimeout(_typeTimer);
    _typeTimer = null;
  }
  const text = el.textContent;
  el.classList.add("typing");
  el.textContent = "";
  let i = 0;
  const tick = () => {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      _typeTimer = setTimeout(tick, 90);
    } else {
      _typeTimer = setTimeout(() => el.classList.remove("typing"), 1200);
    }
  };
  tick();
}

snapshotEnglish();
applyLang(detectInitialLang());
typewriteName();

// Tap anywhere on the interests row to pause / resume the marquee
document.querySelectorAll(".hero-tags").forEach((row) => {
  row.addEventListener("click", () => {
    row.classList.toggle("is-paused");
  });
});

document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const next = document.documentElement.lang === "ru" ? "en" : "ru";
    applyLang(next);
    typewriteName();
  });
});
