const STORAGE_KEY = 'storyvocab-state-v1';

const ui = {
  librarySearch: '',
  libraryCategory: 'all',
  libraryType: 'all',
  vocabularySearch: '',
  vocabularyFilter: 'all',
  exerciseSubmissions: {},
  review: { ids: [], index: 0, selected: null, revealed: false },
  currentRoute: '',
  currentStoryId: null
};

let data = { stories: [], vocabulary: [], categories: [] };
let state = loadState();

const ICONS = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"/><path d="M9 21v-7h6v7"/>',
  'book-open': '<path d="M3 4.8A2.8 2.8 0 0 1 5.8 2H21v17H5.8A2.8 2.8 0 0 0 3 21.8V4.8Z"/><path d="M3 21.8A2.8 2.8 0 0 1 5.8 19H21M8 6h8M8 10h6"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.8-4L3 10"/><path d="M3 4v6h6M4 13a8 8 0 0 0 14.8 4L21 14"/><path d="M21 20v-6h-6"/>',
  bookmark: '<path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V21l-6-3.7L6 21V3.5Z"/>',
  chart: '<path d="M4 19V5M4 19h17"/><path d="m7 15 3-4 3 2 5-7"/><path d="M18 6h3v3"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  settings: '<path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/><path d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3.1 1.3v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-3.1-1.3l-.1.1a1.8 1.8 0 0 1-2.5-2.5l.1-.1A1.8 1.8 0 0 0 3.3 12a1.8 1.8 0 0 1 0-3.6h.2a1.8 1.8 0 0 0 1.3-3.1l-.1-.1a1.8 1.8 0 0 1 2.5-2.5l.1.1A1.8 1.8 0 0 0 10.4 1.5h.2a1.8 1.8 0 0 1 3.6 0v.2a1.8 1.8 0 0 0 3.1 1.3l.1-.1a1.8 1.8 0 0 1 2.5 2.5l-.1.1A1.8 1.8 0 0 0 21.1 8h.2a1.8 1.8 0 0 1 0 3.6h-.2a1.8 1.8 0 0 0-1.7 3.4Z"/>',
  arrow: '<path d="M4 12h16M13 5l7 7-7 7"/>',
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  check: '<path d="m5 12 4.2 4.2L19 6.5"/>',
  spark: '<path d="m12 2 1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M16 2v5M8 2v5M3 9h18"/>',
  trash: '<path d="M4 7h16M10 11v5M14 11v5M6 7l1 14h10l1-14M9 7V3h6v4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3"/>',
  book: '<path d="M5 3h12a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2V3Z"/><path d="M5 19a2 2 0 0 1 2-2h12M9 7h6M9 11h5"/>',
  down: '<path d="m6 9 6 6 6-6"/>'
};

function icon(name, className = '') {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.info}</svg>`;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeRegExp(value = '') {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function loadState() {
  const empty = { stories: {}, words: [], activity: {}, streak: { current: 0, lastDate: null } };
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored) return empty;
    return {
      stories: stored.stories || {},
      words: Array.isArray(stored.words) ? stored.words : [],
      activity: stored.activity || {},
      streak: stored.streak || empty.streak
    };
  } catch (error) {
    return empty;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromKey(key) {
  if (!key) return new Date();
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function addDays(key, days) {
  const date = fromKey(key);
  date.setDate(date.getDate() + days);
  return todayKey(date);
}

function dayDifference(a, b) {
  const one = fromKey(a).getTime();
  const two = fromKey(b).getTime();
  return Math.round((two - one) / 86400000);
}

function formatDate(key, withYear = false) {
  if (!key) return '—';
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}) }).format(fromKey(key)).replace('.', '');
}

function longToday() {
  const label = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function relativeDate(key) {
  if (!key) return 'sin fecha';
  const diff = dayDifference(todayKey(), key);
  if (diff === 0) return 'hoy';
  if (diff === 1) return 'mañana';
  if (diff === -1) return 'ayer';
  if (diff > 1 && diff < 7) return `en ${diff} días`;
  if (diff < -1 && diff > -7) return `hace ${Math.abs(diff)} días`;
  return formatDate(key);
}

function getStory(id) { return data.stories.find((story) => Number(story.id) === Number(id)); }
function getVocab(id) { return data.vocabulary.find((word) => Number(word.id) === Number(id)); }
function getCategory(id) { return data.categories.find((category) => category.id === id); }
function getWordRecord(id) { return state.words.find((word) => Number(word.vocabId) === Number(id)); }
function getStoryProgress(id) { return state.stories[String(id)] || {}; }
function typeLabel(type) { return type === 'fiction' ? 'Ficción' : 'No ficción'; }
function categoryLabel(id) { return getCategory(id)?.shortName || id; }
function statusLabel(status) { return ({ new: 'Nueva', learning: 'Aprendiendo', review: 'En repaso', mastered: 'Dominada' })[status] || 'Nueva'; }
function statusPriority(status) { return ({ new: 0, learning: 1, review: 2, mastered: 3 })[status] ?? 3; }

function stats() {
  const words = state.words;
  const statusCount = (status) => words.filter((word) => word.status === status).length;
  const dueWords = getDueWords();
  const storyValues = Object.values(state.stories);
  const completed = storyValues.filter((story) => story.completed).length;
  const read = storyValues.filter((story) => story.read).length;
  const allReviews = words.flatMap((word) => word.history || []);
  const recentReviews = allReviews.filter((review) => dayDifference(review.date, todayKey()) >= 0 && dayDifference(review.date, todayKey()) <= 7).length;
  const retentionReviews = allReviews.filter((review) => review.response >= 3);
  const retention = allReviews.length ? Math.round((retentionReviews.length / allReviews.length) * 100) : 0;
  return {
    totalWords: words.length,
    newWords: statusCount('new'),
    learningWords: statusCount('learning'),
    reviewWords: statusCount('review'),
    masteredWords: statusCount('mastered'),
    due: dueWords.length,
    completed,
    read,
    totalReviews: allReviews.length,
    weekReviews: recentReviews,
    retention,
    currentStreak: state.streak.current || 0,
    timeSpent: storyValues.reduce((sum, story) => sum + (story.timeSpent || 0), 0)
  };
}

function getDueWords() {
  const today = todayKey();
  return [...state.words]
    .filter((word) => !word.nextReviewDate || word.nextReviewDate <= today)
    .sort((a, b) => statusPriority(a.status) - statusPriority(b.status) || String(a.nextReviewDate).localeCompare(String(b.nextReviewDate)) || Number(a.vocabId) - Number(b.vocabId));
}

function touchActivity(kind = 'session') {
  const today = todayKey();
  const previous = state.streak.lastDate;
  if (!previous) state.streak.current = 1;
  else if (previous !== today) state.streak.current = dayDifference(previous, today) === 1 ? (state.streak.current || 0) + 1 : 1;
  state.streak.lastDate = today;
  if (!state.activity[today]) state.activity[today] = { stories: 0, reviews: 0, sessions: 0 };
  state.activity[today].sessions += kind === 'session' ? 1 : 0;
  state.activity[today].stories += kind === 'story' ? 1 : 0;
  state.activity[today].reviews += kind === 'review' ? 1 : 0;
  const oldKeys = Object.keys(state.activity).sort().slice(0, -100);
  oldKeys.forEach((key) => delete state.activity[key]);
  saveState();
}

function markStoryOpened(story) {
  const key = String(story.id);
  const previous = state.stories[key] || {};
  if (!previous.read) {
    state.stories[key] = { ...previous, storyId: story.id, read: true, readDate: todayKey(), wordsLearned: previous.wordsLearned || 0, timeSpent: previous.timeSpent || 0 };
    touchActivity('story');
  }
}

function markStoryComplete(storyId, score = 0, timeSpent = 0) {
  const key = String(storyId);
  const previous = state.stories[key] || {};
  state.stories[key] = { ...previous, storyId: Number(storyId), read: true, completed: true, completedDate: todayKey(), score, timeSpent: Math.max(previous.timeSpent || 0, timeSpent || 0), wordsLearned: Math.max(previous.wordsLearned || 0, getStory(storyId)?.keyVocabularyIds?.filter((id) => getWordRecord(id)).length || 0) };
  touchActivity('session');
}

function addWord(vocabId, storyId = null) {
  const existing = getWordRecord(vocabId);
  if (existing) {
    if (storyId && !existing.storyId) {
      existing.storyId = storyId;
      saveState();
    }
    return false;
  }
  const entry = getVocab(vocabId);
  if (!entry) return false;
  const now = todayKey();
  state.words.push({
    vocabId: entry.id,
    storyId,
    dateAdded: now,
    status: 'new',
    reviewCount: 0,
    interval: 1,
    easeFactor: 2.5,
    nextReviewDate: now,
    history: []
  });
  saveState();
  return true;
}

function removeWord(vocabId) {
  state.words = state.words.filter((word) => Number(word.vocabId) !== Number(vocabId));
  saveState();
}

function calculateSRS(record, response) {
  let easeFactor = (record.easeFactor || 2.5) + (0.1 - (5 - response) * (0.08 + (5 - response) * 0.02));
  easeFactor = Math.max(1.3, Number(easeFactor.toFixed(2)));
  let interval;
  if (response < 3) interval = 1;
  else if (!record.reviewCount) interval = 3;
  else if (record.interval <= 1) interval = 3;
  else interval = Math.max(1, Math.round((record.interval || 1) * easeFactor));
  return { interval, easeFactor };
}

function recordReview(vocabId, response) {
  const record = getWordRecord(vocabId);
  if (!record) return;
  const beforeInterval = record.interval || 1;
  const { interval, easeFactor } = calculateSRS(record, response);
  record.history = record.history || [];
  record.history.push({ date: todayKey(), response, intervalBefore: beforeInterval, intervalAfter: interval, easeFactor });
  record.reviewCount = (record.reviewCount || 0) + 1;
  record.interval = interval;
  record.easeFactor = easeFactor;
  record.lastReviewDate = todayKey();
  record.nextReviewDate = addDays(todayKey(), interval);
  if (response < 3) record.status = 'learning';
  else if (record.reviewCount >= 5 && interval >= 21 && easeFactor >= 2.6) record.status = 'mastered';
  else if (record.reviewCount >= 2) record.status = 'review';
  else record.status = 'learning';
  touchActivity('review');
}

function refreshShell() {
  const currentStats = stats();
  const due = currentStats.due;
  const dueCount = document.getElementById('due-count');
  const mobileDue = document.getElementById('mobile-due-count');
  if (dueCount) { dueCount.textContent = due || ''; dueCount.style.display = due ? 'inline-grid' : 'none'; }
  if (mobileDue) { mobileDue.textContent = due; mobileDue.style.display = due ? 'grid' : 'none'; }
  const storyCount = document.getElementById('story-count');
  if (storyCount) storyCount.textContent = data.stories.length;
  const streak = document.getElementById('sidebar-streak');
  if (streak) streak.textContent = `${currentStats.currentStreak} ${currentStats.currentStreak === 1 ? 'día' : 'días'}`;
  const week = document.getElementById('sidebar-week-count');
  if (week) week.textContent = getWeekSessionCount();
  const fill = document.getElementById('streak-fill');
  if (fill) fill.style.width = `${Math.min(100, (getWeekSessionCount() / 5) * 100)}%`;
  document.querySelectorAll('[data-nav]').forEach((link) => {
    const section = routeParts()[0] || 'home';
    link.classList.toggle('active', link.dataset.nav === section);
  });
}

function getWeekSessionCount() {
  const today = fromKey(todayKey());
  let count = 0;
  for (let i = 0; i < 7; i += 1) {
    const key = todayKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - i));
    if (state.activity[key]?.sessions || state.activity[key]?.stories || state.activity[key]?.reviews) count += 1;
  }
  return count;
}

function routeParts() {
  const raw = (window.location.hash || '#home').replace(/^#/, '').replace(/\/$/, '');
  return raw.split('/').filter(Boolean);
}

function navigate(route) {
  window.location.hash = `#${route}`;
}

function setTopbarContext(section) {
  const labels = { home: 'TU ESPACIO DE APRENDIZAJE', library: 'BIBLIOTECA DE HISTORIAS', read: 'MODO LECTURA', exercise: 'PRACTICA CON CONTEXTO', review: 'REPASO ESPACIADO', vocabulary: 'TU BANCO DE PALABRAS', stats: 'TU RECORRIDO' };
  const element = document.getElementById('topbar-context');
  if (element) element.textContent = labels[section] || labels.home;
}

function renderHome() {
  const current = stats();
  const recommended = data.stories.slice(0, 4);
  return `
    <section class="home-intro">
      <div><span class="eyebrow">${longToday()}</span><h1>Haz que cada palabra<br><em>cuente una historia.</em></h1></div>
      <p class="home-intro-copy">Inglés avanzado, una lectura estimulante cada vez. Tu contexto de hoy está listo.</p>
    </section>
    <section class="hero-card">
      <div class="hero-copy">
        <span class="eyebrow">Tu siguiente lectura</span>
        <h2>Una historia.<br>Un mundo de palabras.</h2>
        <p>Lee, descubre y vuelve a encontrar vocabulario C1 en contextos que merecen ser recordados.</p>
        <div class="hero-actions"><button class="btn btn-primary" data-route="read/${recommended[0]?.id || 1}">Empezar a leer ${icon('arrow', 'btn-icon')}</button><button class="btn btn-secondary" data-route="library">Explorar historias</button></div>
      </div>
      <div class="hero-art" aria-hidden="true"><div class="book-orbit"><div class="book-shape"></div></div></div>
    </section>
    <section class="stats-row" aria-label="Resumen de actividad">
      <div class="stat-card"><span class="stat-symbol">${icon('spark')}</span><div class="stat-data"><span class="stat-label">Racha actual</span><strong class="stat-value">${current.currentStreak}</strong><span class="stat-note">${current.currentStreak === 1 ? 'día' : 'días'}</span></div></div>
      <div class="stat-card"><span class="stat-symbol">${icon('bookmark')}</span><div class="stat-data"><span class="stat-label">Palabras guardadas</span><strong class="stat-value">${current.totalWords}</strong><span class="stat-note">${current.masteredWords} dominadas</span></div></div>
      <div class="stat-card"><span class="stat-symbol">${icon('refresh')}</span><div class="stat-data"><span class="stat-label">Para repasar hoy</span><strong class="stat-value">${current.due}</strong><span class="stat-note">${current.due ? 'tu sesión te espera' : 'todo al día'}</span></div></div>
    </section>
    <div class="home-columns">
      <section><div class="section-heading"><div><h2>Una historia para hoy</h2><p>Lecturas cortas, vocabulario que se queda.</p></div><a href="#library" class="text-link">Ver todas <span>→</span></a></div><div class="story-list">${recommended.map((story, index) => renderStoryRow(story, index)).join('')}</div></section>
      <aside class="category-side"><h3>Explora por territorio</h3>${data.categories.map((category) => { const count = data.stories.filter((story) => story.category === category.id).length; return `<a href="#library" class="category-item" data-category-link="${category.id}"><i class="category-swatch" style="background:${category.color}"></i><div class="category-item-content"><strong>${escapeHtml(category.name)}</strong><span>${escapeHtml(category.description.split(',')[0])}</span></div><b class="category-count">${count}</b></a>`; }).join('')}</aside>
    </div>`;
}

function renderStoryRow(story, index = 0) {
  const progress = getStoryProgress(story.id);
  const learned = story.keyVocabularyIds.filter((id) => getWordRecord(id)).length;
  const percent = story.keyVocabularyIds.length ? Math.round((learned / story.keyVocabularyIds.length) * 100) : 0;
  return `<article class="story-row"><div class="story-index">${String(index + 1).padStart(2, '0')}</div><div class="story-row-content"><div class="story-row-top"><div><h3>${escapeHtml(story.title)}</h3><p class="story-row-description">${escapeHtml(story.description)}</p></div><span class="story-tag">${escapeHtml(categoryLabel(story.category))}</span></div><div class="story-meta-row"><span>${icon('clock')}${story.estimatedTimeMinutes} min</span><span>${icon('layers')}${story.wordCount} palabras</span><span class="mini-progress" title="${learned} de ${story.keyVocabularyIds.length} palabras guardadas"><i style="width:${percent}%"></i></span><span>${learned}/${story.keyVocabularyIds.length}</span></div></div><div class="story-row-action"><button class="btn btn-secondary" data-route="read/${story.id}">${progress.completed ? 'Releer' : 'Leer'} ${icon('arrow', 'btn-icon')}</button></div></article>`;
}

function renderLibrary() {
  const featured = data.stories[0];
  const search = ui.librarySearch.toLowerCase().trim();
  const stories = data.stories.filter((story) => {
    const matchesSearch = !search || `${story.title} ${story.description}`.toLowerCase().includes(search);
    const matchesCategory = ui.libraryCategory === 'all' || story.category === ui.libraryCategory;
    const matchesType = ui.libraryType === 'all' || story.type === ui.libraryType;
    return matchesSearch && matchesCategory && matchesType;
  });
  return `<section class="page-header"><div><span class="eyebrow">Biblioteca editorial</span><h1>Historias que<br>abren puertas.</h1></div><p>${data.stories.length} lecturas originales para acercarte al inglés C1 a través de negocios, ciencia, cultura y las preguntas que nos hacen humanos.</p></section>
    ${featured ? `<section class="library-feature"><div class="library-feature-copy"><span class="eyebrow">Lectura destacada · ${escapeHtml(categoryLabel(featured.category))}</span><h2>${escapeHtml(featured.title)}</h2><p>${escapeHtml(featured.description)}</p><div class="feature-meta"><span><strong>C1</strong> · ${typeLabel(featured.type)}</span><span>${icon('clock')}${featured.estimatedTimeMinutes} min</span><span>${featured.keyVocabularyIds.length} palabras clave</span></div></div><div class="library-feature-art" aria-hidden="true"><i class="feature-line"></i><i class="feature-dot"></i></div></section>` : ''}
    <div class="filter-bar"><label class="search-field">${icon('search')}<input id="library-search" type="search" placeholder="Buscar por título o tema" value="${escapeHtml(ui.librarySearch)}" autocomplete="off"></label><label class="select-wrap"><select id="library-category"><option value="all">Todas las categorías</option>${data.categories.map((category) => `<option value="${category.id}" ${ui.libraryCategory === category.id ? 'selected' : ''}>${escapeHtml(category.shortName)}</option>`).join('')}</select></label><label class="select-wrap"><select id="library-type"><option value="all">Todo tipo</option><option value="fiction" ${ui.libraryType === 'fiction' ? 'selected' : ''}>Ficción</option><option value="non-fiction" ${ui.libraryType === 'non-fiction' ? 'selected' : ''}>No ficción</option></select></label><span class="filter-count">${stories.length} resultados</span></div>
    <div class="library-grid">${stories.length ? stories.map((story) => renderLibraryCard(story)).join('') : renderEmpty('No encontramos esa historia', 'Prueba con otro título, categoría o tipo de lectura.', 'book-open', 'Limpiar filtros', 'clear-library')}</div>`;
}

function renderLibraryCard(story) {
  const progress = getStoryProgress(story.id);
  const learned = story.keyVocabularyIds.filter((id) => getWordRecord(id)).length;
  const percent = Math.round((learned / story.keyVocabularyIds.length) * 100);
  return `<article class="library-card"><div class="library-card-top"><span class="story-number">${String(story.id).padStart(2, '0')} / ${String(data.stories.length).padStart(2, '0')}</span><span class="story-tag">${escapeHtml(categoryLabel(story.category))}</span></div><h3>${escapeHtml(story.title)}</h3><p>${escapeHtml(story.description)}</p><div class="card-footer"><div class="card-footer-meta"><span>${icon('clock')}${story.estimatedTimeMinutes} min</span><span>${story.wordCount} palabras</span><span class="type-pill">${typeLabel(story.type)}</span></div><span class="mini-progress" title="${learned} de ${story.keyVocabularyIds.length} palabras guardadas"><i style="width:${percent}%"></i></span><button class="btn btn-primary btn-small" data-route="read/${story.id}">${progress.read ? 'Continuar' : 'Leer'} ${icon('arrow', 'btn-icon')}</button></div></article>`;
}

function renderEmpty(title, copy, iconName = 'info', actionText = '', action = '') {
  return `<div class="empty-state"><span class="empty-icon">${icon(iconName)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(copy)}</p>${actionText ? `<button class="btn btn-secondary" data-action="${action}">${escapeHtml(actionText)}</button>` : ''}</div>`;
}

function highlightText(text, ids) {
  const entries = ids.map((id) => getVocab(id)).filter(Boolean).sort((a, b) => b.word.length - a.word.length);
  if (!entries.length) return escapeHtml(text);
  const regex = new RegExp(`(${entries.map((entry) => escapeRegExp(entry.word)).join('|')})`, 'gi');
  let output = '';
  let last = 0;
  text.replace(regex, (match, _group, offset) => {
    output += escapeHtml(text.slice(last, offset));
    const entry = entries.find((candidate) => candidate.word.toLowerCase() === match.toLowerCase());
    if (entry) output += `<button class="vocab-token" data-vocab-id="${entry.id}" aria-label="Ver definición de ${escapeHtml(match)}">${escapeHtml(match)}</button>`;
    else output += escapeHtml(match);
    last = offset + match.length;
    return match;
  });
  output += escapeHtml(text.slice(last));
  return output;
}

function renderReader(story) {
  markStoryOpened(story);
  const progress = getStoryProgress(story.id);
  const keyWords = story.keyVocabularyIds.map((id) => getVocab(id)).filter(Boolean);
  const learned = keyWords.filter((word) => getWordRecord(word.id)).length;
  const percent = Math.round((learned / keyWords.length) * 100);
  const paragraphs = story.content.split(/\n\s*\n/).map((paragraph) => `<p class="story-paragraph">${highlightText(paragraph, story.keyVocabularyIds)}</p>`).join('');
  return `<a href="#library" class="reader-back">${icon('back')} Volver a historias</a><div class="reader-layout"><article><header class="reader-head"><span class="eyebrow">${escapeHtml(categoryLabel(story.category))} · ${typeLabel(story.type)}</span><h1>${escapeHtml(story.title)}</h1><p class="reader-description">${escapeHtml(story.description)}</p><div class="reader-meta"><span>${icon('clock')}${story.estimatedTimeMinutes} minutos de lectura</span><span>${icon('book')}${story.wordCount} palabras</span><span>${icon('target')}Nivel ${story.difficulty}</span><span>Por ${escapeHtml(story.author)}</span></div></header><div class="reader-content">${paragraphs}</div><footer class="reader-foot"><p class="reader-foot-note">${icon('spark')} Las palabras subrayadas guardan una pista. Haz clic para descubrirla.</p><div class="reader-actions"><button class="btn btn-secondary" data-route="library">Guardar y salir</button><button class="btn btn-primary" data-route="exercise/${story.id}">Hacer ejercicios ${icon('arrow', 'btn-icon')}</button></div></footer></article><aside class="reader-rail"><div class="rail-card dark"><div class="rail-label"><span>Tu progreso</span><strong>${percent}%</strong></div><div class="progress-track"><span style="width:${percent}%"></span></div><div class="rail-progress-copy"><span>${learned} guardadas</span><span>${keyWords.length} clave</span></div></div><div class="rail-card"><h3>Palabras de esta historia</h3><div class="vocab-list-mini">${keyWords.map((word) => { const saved = getWordRecord(word.id); return `<button class="vocab-mini-item ${saved ? 'is-saved' : ''}" data-vocab-id="${word.id}"><i class="vocab-mini-dot"></i><span class="vocab-mini-word">${escapeHtml(word.word)}</span><span class="vocab-mini-status">${saved ? 'guardada' : 'ver definición'}</span></button>`; }).join('')}</div></div><div class="quote-card"><p>“El contexto convierte una palabra en una experiencia.”</p><small>La idea detrás de StoryVocab</small></div></aside></div>`;
}

function renderExercises(story) {
  const submission = ui.exerciseSubmissions[story.id];
  const answers = submission?.answers || {};
  const questions = story.exercises || [];
  const correct = submission?.correct || 0;
  const score = questions.length ? Math.round((correct / questions.length) * 100) : 0;
  return `<a href="#read/${story.id}" class="reader-back">${icon('back')} Volver a la historia</a><section class="exercise-header"><span class="eyebrow">Después de leer · ${escapeHtml(categoryLabel(story.category))}</span><h1>Ahora haz que<br>la historia sea tuya.</h1><p>Cuatro preguntas para comprobar comprensión y fijar el vocabulario en la memoria.</p></section><div class="exercise-layout"><form class="exercise-form" id="exercise-form" data-story-id="${story.id}">${questions.map((question, index) => renderExerciseCard(question, index, answers, submission)).join('')}<div class="exercise-submit-row">${submission ? '<button class="btn btn-secondary" type="button" data-route="read/' + story.id + '">Releer el texto</button>' : ''}<button class="btn btn-primary" type="submit">${submission ? 'Intentarlo de nuevo' : 'Comprobar respuestas'} ${icon('check', 'btn-icon')}</button></div></form><aside class="exercise-summary" style="--score-angle:${Math.round((score / 100) * 360)}deg"><h3>Tu resultado</h3><div class="score-ring"><div><strong>${submission ? score : '—'}${submission ? '%' : ''}</strong><small>${submission ? `${correct} de ${questions.length}` : 'pendiente'}</small></div></div><ul class="summary-list"><li><span>Comprensión</span><strong>${submission ? `${correct}/${questions.length}` : '—'}</strong></li><li><span>Palabras activadas</span><strong>${story.keyVocabularyIds.length}</strong></li><li><span>Próximo paso</span><strong>${stats().due ? 'Repaso de hoy' : 'Guardar palabras'}</strong></li></ul><p class="summary-note">${icon('info')} Tus palabras clave se incorporan al repaso espaciado al enviar este ejercicio.</p></aside></div>`;
}

function renderExerciseCard(question, index, answers, submission) {
  const answer = answers[question.id];
  const correctIndex = question.type === 'cloze' ? question.options.indexOf(question.blankWord) : question.correctAnswer;
  const isCorrect = submission ? Number(answer) === Number(correctIndex) : false;
  const type = question.type === 'cloze' ? 'Completa la frase' : question.type === 'comprehension' ? 'Comprensión' : 'Vocabulario en contexto';
  let prompt = question.sentence || question.question || `¿Qué significa “${question.word}”?`;
  if (question.sentence) prompt = escapeHtml(prompt).replace('___', '<span class="blank">_____</span>');
  else prompt = escapeHtml(prompt);
  return `<fieldset class="exercise-card ${submission ? (isCorrect ? 'correct' : 'incorrect') : ''}"><legend class="exercise-type">${type} · ${index + 1}</legend><div class="exercise-question">${prompt}</div><div class="option-list">${question.options.map((option, optionIndex) => { const selected = String(answer) === String(optionIndex); const correctOption = submission && optionIndex === correctIndex; const wrongOption = submission && selected && !isCorrect; return `<label class="option-label ${correctOption ? 'is-correct' : ''} ${wrongOption ? 'is-wrong' : ''}"><input type="radio" name="${question.id}" value="${optionIndex}" ${selected ? 'checked' : ''}><i class="option-marker">${correctOption ? '✓' : wrongOption ? '×' : '·'}</i><span>${escapeHtml(option)}</span></label>`; }).join('')}</div>${submission ? `<div class="exercise-feedback ${isCorrect ? 'correct' : 'incorrect'}">${icon(isCorrect ? 'check' : 'info')}<span><strong>${isCorrect ? '¡Muy bien!' : 'Casi.'}</strong> ${escapeHtml(question.explanation || '')}${!isCorrect ? ` La respuesta era “${escapeHtml(question.options[correctIndex])}”.` : ''}</span></div>` : ''}</fieldset>`;
}

function getReviewOptions(entry) {
  const pool = data.vocabulary.filter((word) => word.id !== entry.id && word.definition?.es).sort((a, b) => ((a.id * 17 + entry.id * 3) % 101) - ((b.id * 17 + entry.id * 3) % 101));
  const distractors = pool.slice(0, 3).map((word) => word.definition.es);
  const correctIndex = entry.id % 4;
  const options = [];
  let distractorIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    options[index] = index === correctIndex ? entry.definition.es : distractors[distractorIndex++];
  }
  return { options, correctIndex };
}

function renderReview() {
  if (!ui.review.ids.length) ui.review.ids = getDueWords().map((word) => word.vocabId);
  const total = ui.review.ids.length;
  const currentRecord = ui.review.ids[ui.review.index] ? getWordRecord(ui.review.ids[ui.review.index]) : null;
  const currentEntry = currentRecord ? getVocab(currentRecord.vocabId) : null;
  const currentStats = stats();
  return `<section class="review-header"><div><span class="eyebrow">Memoria a largo plazo</span><h1>Repaso de hoy.</h1></div><span class="review-counter">${Math.min(ui.review.index, total)} de ${total || currentStats.due} completadas</span></section>${currentEntry ? renderReviewCard(currentEntry, currentRecord, total) : renderReviewEmpty(currentStats)}<div class="review-side"><section class="review-side-card"><h3>Tu ritmo de repaso</h3><div class="review-side-stats"><div class="review-side-stat"><strong>${currentStats.due}</strong><span>Pendientes hoy</span></div><div class="review-side-stat"><strong>${currentStats.weekReviews}</strong><span>Esta semana</span></div><div class="review-side-stat"><strong>${currentStats.retention}%</strong><span>Retención</span></div><div class="review-side-stat"><strong>${currentStats.totalReviews}</strong><span>Respuestas</span></div></div></section><section class="review-tip"><strong>Una pista útil</strong><p>Si una palabra te cuesta, no es un fallo: es una señal para volver a verla con más frecuencia.</p></section></div>`;
}

function renderReviewCard(entry, record, total) {
  const { options, correctIndex } = getReviewOptions(entry);
  const selected = ui.review.selected;
  const revealed = ui.review.revealed;
  const isCorrect = revealed && Number(selected) === Number(correctIndex);
  const completed = Math.min(ui.review.index, total);
  return `<div class="review-layout"><section class="review-card"><div class="review-card-top"><span>Palabra ${completed + 1} de ${total}</span><strong>${statusLabel(record.status)}</strong></div><div class="review-prompt"><small>¿Qué significa?</small><h2>${escapeHtml(entry.word)}</h2><p>${escapeHtml(entry.partOfSpeech)} · ${escapeHtml(entry.pronunciation || '')}</p></div><div class="review-options">${options.map((option, index) => `<button class="review-option ${selected === index ? 'selected' : ''} ${revealed && index === correctIndex ? 'correct' : ''} ${revealed && selected === index && index !== correctIndex ? 'wrong' : ''}" data-action="select-review-option" data-option-index="${index}" ${revealed ? 'disabled' : ''}>${escapeHtml(option)}</button>`).join('')}</div><div class="review-card-bottom">${revealed ? `<div class="review-result ${isCorrect ? '' : 'wrong'}">${icon(isCorrect ? 'check' : 'info')}<span>${isCorrect ? 'Tu elección es correcta.' : `La respuesta era: ${escapeHtml(entry.definition.es)}`}</span></div><div class="rating-row"><span>¿Cómo se sintió?</span><button class="rating-btn" data-action="rate-review" data-response="1">No lo recuerdo</button><button class="rating-btn" data-action="rate-review" data-response="2">Difícil</button><button class="rating-btn" data-action="rate-review" data-response="3">Bien</button><button class="rating-btn easy" data-action="rate-review" data-response="4">Fácil</button></div>` : `<div class="review-confirm"><button class="btn btn-primary" data-action="confirm-review" ${selected === null ? 'disabled' : ''}>Comprobar respuesta ${icon('check', 'btn-icon')}</button></div>`}</div></section></div>`;
}

function renderReviewEmpty(currentStats) {
  return `<div class="review-empty"><div class="review-empty-inner"><span class="empty-icon">${icon('check')}</span><h2>Todo al día por ahora.</h2><p>No hay palabras pendientes. Lee otra historia para llenar tu próxima sesión de repaso.</p><button class="btn btn-primary" data-route="library">Elegir una historia ${icon('arrow', 'btn-icon')}</button></div></div>`;
}

function renderVocabulary() {
  const current = stats();
  const search = ui.vocabularySearch.toLowerCase().trim();
  const words = state.words.map((record) => ({ record, entry: getVocab(record.vocabId) })).filter(({ entry, record }) => {
    if (!entry) return false;
    const matchesFilter = ui.vocabularyFilter === 'all' || record.status === ui.vocabularyFilter;
    const matchesSearch = !search || `${entry.word} ${entry.definition.en} ${entry.definition.es}`.toLowerCase().includes(search);
    return matchesFilter && matchesSearch;
  }).sort((a, b) => String(b.record.dateAdded).localeCompare(String(a.record.dateAdded)));
  return `<section class="page-header"><div><span class="eyebrow">Tu colección personal</span><h1>Mi vocabulario.</h1></div><p>Cada palabra que guardas abre una nueva ruta. Vuelve a ellas justo cuando tu memoria lo necesita.</p></section>${current.due ? `<div class="vocab-callout"><div class="vocab-callout-copy">${icon('refresh')}<p><strong>${current.due} ${current.due === 1 ? 'palabra necesita' : 'palabras necesitan'}</strong> un repaso hoy.</p></div><button class="btn btn-primary btn-small" data-route="review">Practicar ahora ${icon('arrow', 'btn-icon')}</button></div>` : ''}<div class="vocab-summary-row"><div class="vocab-summary"><i class="vocab-summary-dot"></i><div><strong>${current.totalWords}</strong><span>Total guardadas</span></div></div><div class="vocab-summary"><i class="vocab-summary-dot"></i><div><strong>${current.newWords}</strong><span>Nuevas</span></div></div><div class="vocab-summary"><i class="vocab-summary-dot"></i><div><strong>${current.learningWords + current.reviewWords}</strong><span>En aprendizaje</span></div></div><div class="vocab-summary"><i class="vocab-summary-dot"></i><div><strong>${current.masteredWords}</strong><span>Dominadas</span></div></div></div><div class="vocab-toolbar"><div class="filter-tabs">${[['all','Todas'],['new','Nuevas'],['learning','Aprendiendo'],['mastered','Dominadas']].map(([value, label]) => `<button class="filter-tab ${ui.vocabularyFilter === value ? 'active' : ''}" data-vocab-filter="${value}">${label}</button>`).join('')}</div><label class="search-field">${icon('search')}<input id="vocabulary-search" type="search" placeholder="Buscar palabra o significado" value="${escapeHtml(ui.vocabularySearch)}" autocomplete="off"></label></div><div class="vocab-grid">${words.length ? words.map(({ record, entry }) => renderVocabCard(record, entry)).join('') : renderEmpty(state.words.length ? 'No hay palabras aquí todavía' : 'Tu colección empieza con una historia', state.words.length ? 'Prueba otro filtro o término de búsqueda.' : 'Haz clic en una palabra subrayada mientras lees para guardarla.', 'bookmark', state.words.length ? 'Ver todas' : 'Explorar historias', state.words.length ? 'clear-vocab-filter' : 'go-library')}</div>`;
}

function renderVocabCard(record, entry) {
  const last = record.lastReviewDate ? `Último repaso ${relativeDate(record.lastReviewDate)}` : `Guardada ${relativeDate(record.dateAdded)}`;
  const next = record.nextReviewDate ? `Próxima: ${relativeDate(record.nextReviewDate)}` : 'Sin próxima fecha';
  return `<article class="vocab-card"><div class="vocab-card-head"><div class="vocab-word"><h3>${escapeHtml(entry.word)}</h3><span class="vocab-pos">${escapeHtml(entry.partOfSpeech)} · ${entry.level}</span></div><span class="status-pill ${record.status}">${statusLabel(record.status)}</span></div><p class="vocab-meaning"><strong>${escapeHtml(entry.definition.es)}</strong><br>${escapeHtml(entry.definition.en)}</p><div class="vocab-card-meta"><span>${icon('refresh')}${last} · ${next}</span><div class="vocab-card-actions"><button data-action="show-word" data-vocab-id="${entry.id}">Detalles</button><button data-action="remove-word" data-vocab-id="${entry.id}" aria-label="Eliminar ${escapeHtml(entry.word)}">Eliminar</button></div></div></article>`;
}

function renderStats() {
  const current = stats();
  const activity = getActivityDays();
  const maxActivity = Math.max(1, ...activity.map((day) => day.value));
  const categoryData = data.categories.map((category) => ({ category, count: state.words.filter((record) => getStory(record.storyId)?.category === category.id).length })).sort((a, b) => b.count - a.count);
  const maxCategory = Math.max(1, ...categoryData.map((item) => item.count));
  const allReviewRecords = state.words.flatMap((record) => (record.history || []).map((review) => ({ ...review, entry: getVocab(record.vocabId) }))).filter((item) => item.entry);
  const best = allReviewRecords.length ? getPerformanceWords('best')[0] : null;
  const hard = allReviewRecords.length ? getPerformanceWords('hard')[0] : null;
  const hours = (current.timeSpent / 3600).toFixed(1);
  return `<section class="dashboard-header"><span class="eyebrow">Una mirada a tu proceso</span><h1>Tu progreso,<br>en contexto.</h1><p>La constancia no siempre hace ruido. Aquí puedes ver cómo se está acumulando.</p></section><div class="dashboard-metrics"><div class="dashboard-metric"><span class="dashboard-metric-label">Historias completadas</span><strong class="dashboard-metric-value">${current.completed}<small> / ${data.stories.length}</small></strong><span class="dashboard-metric-note">${current.read} empezadas</span></div><div class="dashboard-metric"><span class="dashboard-metric-label">Palabras guardadas</span><strong class="dashboard-metric-value">${current.totalWords}</strong><span class="dashboard-metric-note">${current.masteredWords} dominadas</span></div><div class="dashboard-metric"><span class="dashboard-metric-label">Racha de días</span><strong class="dashboard-metric-value">${current.currentStreak}</strong><span class="dashboard-metric-note">La próxima sesión suma uno</span></div><div class="dashboard-metric"><span class="dashboard-metric-label">Tiempo de lectura</span><strong class="dashboard-metric-value">${hours}<small> h</small></strong><span class="dashboard-metric-note">Registrado en este dispositivo</span></div></div><div class="dashboard-grid"><section class="dashboard-panel"><div class="panel-title-row"><div><h3>Actividad reciente</h3><span class="panel-caption">Historias, repaso y pequeñas victorias</span></div><span class="type-pill">Últimos 7 días</span></div><div class="activity-chart">${activity.map((day) => `<div class="activity-column"><div class="activity-bar-wrap" title="${day.value} acciones"><i class="activity-bar" style="height:${Math.max(day.value ? 8 : 3, (day.value / maxActivity) * 100)}%"></i></div><strong>${day.value || 0}</strong><small>${day.label}</small></div>`).join('')}</div><div class="chart-legend"><span><i></i> Lectura y sesiones</span><span><i></i> Repaso</span></div></section><section class="dashboard-panel"><h3>Palabras por estado</h3><div class="status-bars"><div class="status-bar-row"><span>Nuevas</span><div><i style="width:${current.totalWords ? (current.newWords / current.totalWords) * 100 : 0}%"></i></div><strong>${current.newWords}</strong></div><div class="status-bar-row"><span>Aprendiendo</span><div><i style="width:${current.totalWords ? ((current.learningWords + current.reviewWords) / current.totalWords) * 100 : 0}%"></i></div><strong>${current.learningWords + current.reviewWords}</strong></div><div class="status-bar-row"><span>Dominadas</span><div><i style="width:${current.totalWords ? (current.masteredWords / current.totalWords) * 100 : 0}%"></i></div><strong>${current.masteredWords}</strong></div></div><div class="dashboard-empty-note" style="margin-top:24px">${current.totalWords ? `${current.retention}% de retención en tus respuestas.` : 'Guarda palabras mientras lees para empezar a ver tu mapa.'}</div></section><section class="dashboard-panel"><h3>Territorios que exploras</h3><div class="category-bars">${categoryData.map(({ category, count }) => `<div class="category-bar-row"><span>${escapeHtml(category.shortName)}</span><div><i style="width:${(count / maxCategory) * 100}%;background:${category.color}"></i></div><strong>${count}</strong></div>`).join('')}</div></section><section class="dashboard-panel"><h3>Tu relación con las palabras</h3><div class="performance-list">${best ? `<div class="performance-item good"><small>Mejor retenida</small><strong>${escapeHtml(best.entry.word)}</strong><span>${best.retention}% de aciertos</span></div>` : `<div class="performance-item good"><small>Mejor retenida</small><strong>—</strong><span>Aún estamos conociéndote</span></div>`}${hard ? `<div class="performance-item hard"><small>Pide otra vuelta</small><strong>${escapeHtml(hard.entry.word)}</strong><span>${hard.retention}% de aciertos</span></div>` : `<div class="performance-item hard"><small>Pide otra vuelta</small><strong>—</strong><span>Tu primer repaso te lo dirá</span></div>`}</div></section><section class="dashboard-panel full"><div class="panel-title-row"><div><h3>Próximos hitos</h3><span class="panel-caption">La ruta se construye con pasos pequeños</span></div></div><div class="milestone-row"><div class="milestone ${current.totalWords >= 1 ? 'reached' : ''}"><span>${current.totalWords >= 1 ? '✓' : '01'}</span><strong>Primera palabra</strong><small>Guarda una palabra desde una historia</small></div><div class="milestone ${current.completed >= 3 ? 'reached' : ''}"><span>${current.completed >= 3 ? '✓' : '03'}</span><strong>Tres historias</strong><small>Encuentra tres perspectivas distintas</small></div><div class="milestone ${current.masteredWords >= 10 ? 'reached' : ''}"><span>${current.masteredWords >= 10 ? '✓' : '10'}</span><strong>Diez dominadas</strong><small>Deja que el SRS haga su trabajo</small></div></div></section></div>`;
}

function getActivityDays() {
  const today = fromKey(todayKey());
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (6 - index));
    const key = todayKey(date);
    const item = state.activity[key] || {};
    return { key, value: (item.stories || 0) + (item.reviews || 0) + (item.sessions || 0), label: new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date).replace('.', '').slice(0, 3) };
  });
}

function getPerformanceWords(mode) {
  return state.words.map((record) => {
    const history = record.history || [];
    const correct = history.filter((review) => review.response >= 3).length;
    return { record, entry: getVocab(record.vocabId), retention: history.length ? Math.round((correct / history.length) * 100) : 0, count: history.length };
  }).filter((item) => item.entry && item.count).sort((a, b) => mode === 'best' ? b.retention - a.retention || b.count - a.count : a.retention - b.retention || b.count - a.count);
}

function renderApp() {
  const parts = routeParts();
  const section = parts[0] || 'home';
  const id = parts[1];
  const previousSection = ui.currentRoute.split('/')[0];
  if (section === 'review' && previousSection !== 'review') ui.review = { ids: [], index: 0, selected: null, revealed: false };
  if (section !== 'read') ui.currentStoryId = null;
  ui.currentRoute = `${section}${id ? `/${id}` : ''}`;
  setTopbarContext(section);
  let html;
  if (section === 'home') html = renderHome();
  else if (section === 'library') html = renderLibrary();
  else if (section === 'read') { ui.currentStoryId = Number(id); const story = getStory(id); html = story ? renderReader(story) : renderNotFound(); }
  else if (section === 'exercise') { ui.currentStoryId = Number(id); const story = getStory(id); html = story ? renderExercises(story) : renderNotFound(); }
  else if (section === 'review') html = renderReview();
  else if (section === 'vocabulary') html = renderVocabulary();
  else if (section === 'stats') html = renderStats();
  else html = renderNotFound();
  const view = document.getElementById('app-view');
  if (view) view.innerHTML = html;
  refreshShell();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderNotFound() {
  return `<div class="empty-state"><span class="empty-icon">${icon('book-open')}</span><h3>Esta página se ha perdido entre las páginas.</h3><p>Vuelve al inicio para continuar tu recorrido.</p><a class="btn btn-primary" href="#home">Ir al inicio</a></div>`;
}

function showToast(message, type = 'success') {
  const region = document.getElementById('toast-region');
  if (!region) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${icon(type === 'success' ? 'check' : 'info')}<span>${escapeHtml(message)}</span>`;
  region.appendChild(toast);
  window.setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(5px)'; window.setTimeout(() => toast.remove(), 220); }, 2800);
}

function closePopover() {
  const layer = document.getElementById('popover-layer');
  if (layer) layer.innerHTML = '';
}

function showVocabPopover(vocabId, target) {
  const entry = getVocab(vocabId);
  if (!entry || !target) return;
  const layer = document.getElementById('popover-layer');
  const saved = getWordRecord(entry.id);
  layer.innerHTML = `<div class="term-popover" role="dialog" aria-label="Definición de ${escapeHtml(entry.word)}"><div class="term-popover-head"><div><h3>${escapeHtml(entry.word)}</h3><p class="term-pronunciation">${escapeHtml(entry.pronunciation || '')}</p></div><span class="term-pos">${escapeHtml(entry.partOfSpeech)}</span><button class="close-popover" data-action="close-popover" aria-label="Cerrar">×</button></div><p class="term-definition"><strong>EN</strong> ${escapeHtml(entry.definition.en)}<br><strong>ES</strong> ${escapeHtml(entry.definition.es)}</p><p class="term-example">“${escapeHtml(entry.examples?.[0]?.sentence || '')}”</p><div class="term-actions"><button class="btn ${saved ? 'btn-secondary' : 'btn-primary'} btn-small" data-action="add-word" data-vocab-id="${entry.id}" ${saved ? 'disabled' : ''}>${saved ? '✓ Guardada' : '+ Guardar palabra'}</button><button class="btn btn-secondary btn-small" data-action="show-word" data-vocab-id="${entry.id}">Detalles</button></div></div>`;
  const popover = layer.querySelector('.term-popover');
  const rect = target.getBoundingClientRect();
  const width = Math.min(315, window.innerWidth - 28);
  let left = Math.min(Math.max(14, rect.left - 10), window.innerWidth - width - 14);
  let top = rect.bottom + 12;
  if (top + 260 > window.innerHeight) { top = Math.max(14, rect.top - 270); popover.classList.add('flip'); }
  popover.style.left = `${left}px`;
  popover.style.top = `${top}px`;
}

function showWordModal(vocabId) {
  closePopover();
  const entry = getVocab(vocabId);
  const record = getWordRecord(vocabId);
  if (!entry) return;
  const layer = document.getElementById('modal-layer');
  layer.innerHTML = `<div class="modal-backdrop" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true" aria-label="Detalles de ${escapeHtml(entry.word)}"><div class="term-popover-head"><div><h3>${escapeHtml(entry.word)}</h3><p class="term-pronunciation">${escapeHtml(entry.pronunciation || '')}</p></div><span class="term-pos">${escapeHtml(entry.partOfSpeech)} · ${entry.level}</span></div><p class="term-definition"><strong>EN</strong> ${escapeHtml(entry.definition.en)}<br><strong>ES</strong> ${escapeHtml(entry.definition.es)}</p><p class="term-example">“${escapeHtml(entry.examples?.[0]?.sentence || '')}”</p><p style="font-size:11px;color:var(--ink-soft);margin-bottom:16px"><strong>Sinónimos:</strong> ${escapeHtml((entry.synonyms || []).join(', '))}<br><strong>Collocation:</strong> ${escapeHtml((entry.collocations || []).join(' · '))}${record ? `<br><strong>Repasos:</strong> ${record.reviewCount} · <strong>Próxima:</strong> ${relativeDate(record.nextReviewDate)}` : ''}</p><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Cerrar</button>${record ? `<button class="btn btn-primary" data-action="remove-word" data-vocab-id="${entry.id}">Eliminar de mi lista</button>` : `<button class="btn btn-primary" data-action="add-word-modal" data-vocab-id="${entry.id}">Guardar palabra</button>`}</div></div></div>`;
}

function closeModal() {
  const layer = document.getElementById('modal-layer');
  if (layer) layer.innerHTML = '';
}

function openResetModal() {
  const layer = document.getElementById('modal-layer');
  layer.innerHTML = `<div class="modal-backdrop" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true"><h3>¿Empezar de nuevo?</h3><p>Se borrarán tus palabras guardadas, repasos, historias y estadísticas de este dispositivo. Esta acción no se puede deshacer.</p><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="confirm-reset">Borrar progreso</button></div></div></div>`;
}

function handleClick(event) {
  const routeElement = event.target.closest('[data-route]');
  if (routeElement) {
    event.preventDefault();
    navigate(routeElement.dataset.route);
    closePopover();
    return;
  }
  const categoryLink = event.target.closest('[data-category-link]');
  if (categoryLink) {
    event.preventDefault();
    ui.libraryCategory = categoryLink.dataset.categoryLink;
    navigate('library');
    return;
  }
  const vocabFilter = event.target.closest('[data-vocab-filter]');
  if (vocabFilter) {
    ui.vocabularyFilter = vocabFilter.dataset.vocabFilter;
    renderApp();
    return;
  }
  const token = event.target.closest('.vocab-token, .vocab-mini-item');
  if (token && token.dataset.vocabId) {
    event.stopPropagation();
    showVocabPopover(Number(token.dataset.vocabId), token);
    return;
  }
  const actionElement = event.target.closest('[data-action]');
  if (!actionElement) {
    if (!event.target.closest('.term-popover')) closePopover();
    return;
  }
  const action = actionElement.dataset.action;
  if (action === 'close-popover') { closePopover(); return; }
  if (action === 'close-modal') { if (event.target === actionElement) closeModal(); return; }
  if (action === 'add-word' || action === 'add-word-modal') {
    const id = Number(actionElement.dataset.vocabId);
    const added = addWord(id, ui.currentStoryId || null);
    if (added) showToast(`“${getVocab(id)?.word}” se añadió a tu lista.`);
    else showToast('Esta palabra ya está en tu lista.', 'info');
    if (action === 'add-word-modal') { closeModal(); renderApp(); }
    else showVocabPopover(id, document.querySelector(`[data-vocab-id="${id}"]`) || actionElement);
    refreshShell();
    return;
  }
  if (action === 'show-word') { showWordModal(Number(actionElement.dataset.vocabId)); return; }
  if (action === 'remove-word') {
    const id = Number(actionElement.dataset.vocabId);
    const entry = getVocab(id);
    if (window.confirm(`¿Eliminar “${entry?.word || 'esta palabra'}” de tu lista?`)) { removeWord(id); closeModal(); renderApp(); showToast('Palabra eliminada.', 'info'); }
    return;
  }
  if (action === 'clear-library') { ui.librarySearch = ''; ui.libraryCategory = 'all'; ui.libraryType = 'all'; renderApp(); return; }
  if (action === 'clear-vocab-filter') { ui.vocabularySearch = ''; ui.vocabularyFilter = 'all'; renderApp(); return; }
  if (action === 'go-library') { navigate('library'); return; }
  if (action === 'reset-progress') { openResetModal(); return; }
  if (action === 'confirm-reset') { localStorage.removeItem(STORAGE_KEY); state = loadState(); closeModal(); ui.exerciseSubmissions = {}; ui.review = { ids: [], index: 0, selected: null, revealed: false }; renderApp(); showToast('Tu recorrido se ha reiniciado.', 'info'); return; }
  if (action === 'select-review-option') {
    if (!ui.review.revealed) { ui.review.selected = Number(actionElement.dataset.optionIndex); renderApp(); }
    return;
  }
  if (action === 'confirm-review') {
    if (ui.review.selected === null) { showToast('Elige una respuesta antes de comprobar.', 'info'); return; }
    ui.review.revealed = true; renderApp(); return;
  }
  if (action === 'rate-review') {
    const id = ui.review.ids[ui.review.index];
    recordReview(id, Number(actionElement.dataset.response));
    ui.review.index += 1;
    ui.review.selected = null;
    ui.review.revealed = false;
    renderApp();
    showToast('Repaso guardado. Tu próxima fecha se ha actualizado.');
  }
}

function handleInput(event) {
  if (event.target.id === 'library-search') { ui.librarySearch = event.target.value; renderApp(); focusInput('library-search'); }
  if (event.target.id === 'vocabulary-search') { ui.vocabularySearch = event.target.value; renderApp(); focusInput('vocabulary-search'); }
}

function handleChange(event) {
  if (event.target.id === 'library-category') { ui.libraryCategory = event.target.value; renderApp(); }
  if (event.target.id === 'library-type') { ui.libraryType = event.target.value; renderApp(); }
}

function focusInput(id) {
  const element = document.getElementById(id);
  if (element) { element.focus(); element.setSelectionRange(element.value.length, element.value.length); }
}

function handleSubmit(event) {
  if (event.target.id !== 'exercise-form') return;
  event.preventDefault();
  const story = getStory(event.target.dataset.storyId);
  if (!story) return;
  const formData = new FormData(event.target);
  const answers = {};
  let correct = 0;
  story.exercises.forEach((question) => {
    const value = formData.get(question.id);
    answers[question.id] = value === null ? '' : value;
    const correctIndex = question.type === 'cloze' ? question.options.indexOf(question.blankWord) : question.correctAnswer;
    if (Number(value) === Number(correctIndex)) correct += 1;
  });
  ui.exerciseSubmissions[story.id] = { answers, correct, submittedAt: todayKey() };
  story.keyVocabularyIds.forEach((id) => addWord(id, story.id));
  markStoryComplete(story.id, Math.round((correct / story.exercises.length) * 100));
  renderApp();
  showToast(`${correct} de ${story.exercises.length} respuestas correctas. Palabras añadidas al repaso.`);
}

function handleKeydown(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    navigate('library');
    window.setTimeout(() => document.getElementById('library-search')?.focus(), 80);
  }
  if (event.key === 'Escape') { closePopover(); closeModal(); }
}

async function loadData() {
  try {
    const [storiesResponse, vocabularyResponse, categoriesResponse] = await Promise.all([
      fetch('./data/stories.json'), fetch('./data/vocabulary.json'), fetch('./data/categories.json')
    ]);
    if (!storiesResponse.ok || !vocabularyResponse.ok || !categoriesResponse.ok) throw new Error('No se pudo cargar el contenido');
    const [stories, vocabulary, categories] = await Promise.all([storiesResponse.json(), vocabularyResponse.json(), categoriesResponse.json()]);
    data = { stories: stories.stories || stories, vocabulary: vocabulary.vocabulary || vocabulary, categories: categories.categories || categories };
    renderApp();
  } catch (error) {
    const view = document.getElementById('app-view');
    if (view) view.innerHTML = renderEmpty('No se pudo abrir la biblioteca', 'Comprueba que los archivos de datos estén disponibles y vuelve a cargar la página.', 'info', 'Reintentar', 'retry-data');
  }
}

document.addEventListener('click', handleClick);
document.addEventListener('input', handleInput);
document.addEventListener('change', handleChange);
document.addEventListener('submit', handleSubmit);
document.addEventListener('keydown', handleKeydown);
window.addEventListener('hashchange', renderApp);
document.addEventListener('click', (event) => {
  if (event.target.closest('[data-action="retry-data"]')) window.location.reload();
});

loadData();
