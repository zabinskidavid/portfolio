const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const media = document.getElementById('modal-media');
const description = document.getElementById('modal-description');
const buttons = document.querySelectorAll('.filter-button');

let projects = [];

function shuffle(items) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderGallery(category = 'Wszystkie') {
  gallery.innerHTML = '';
  const filtered = category === 'Wszystkie'
    ? projects
    : projects.filter(project => Array.isArray(project.categories) && project.categories.includes(category));

  const list = shuffle(filtered);

  if (!list.length) {
    gallery.innerHTML = '<p class="empty">Brak prac w tej kategorii.</p>';
    return;
  }

  list.forEach((project, index) => {
    const article = document.createElement('article');
    article.className = 'project';
    article.style.animationDelay = `${Math.min(index * 35, 300)}ms`;

    const wrapper = document.createElement('div');
    wrapper.className = 'project-thumb-wrap';

    const img = document.createElement('img');
    img.className = 'project-thumb';
    img.src = project.thumbnail;
    img.alt = project.description || 'Praca z portfolio';
    img.loading = 'lazy';

    wrapper.appendChild(img);
    article.appendChild(wrapper);
    article.addEventListener('click', () => openModal(project));
    gallery.appendChild(article);
  });
}

function getYouTubeId(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      return parsed.pathname.split('/').filter(Boolean)[0] || null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v');
      if (parsed.pathname.startsWith('/shorts/')) return parsed.pathname.split('/')[2] || null;
      if (parsed.pathname.startsWith('/embed/')) return parsed.pathname.split('/')[2] || null;
    }
  } catch (_) {}
  return null;
}

function getMediaSource(project) {
  // Current JSON uses "preview" for both images and video sources.
  return project.video || project.preview || '';
}

function createYouTubeEmbed(url) {
  const id = getYouTubeId(url);
  if (!id) return null;

  const wrap = document.createElement('div');
  wrap.className = 'youtube-wrap';

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
  iframe.title = 'YouTube video';
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';

  wrap.appendChild(iframe);
  return wrap;
}

function openModal(project) {
  media.innerHTML = '';
  const type = (project.type || 'image').toLowerCase();
  const source = getMediaSource(project);

  if (type === 'mp4') {
    const video = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = source;
    video.addEventListener('error', () => {
      media.innerHTML = '<p class="media-error">Nie udało się wczytać filmu. Sprawdź ścieżkę do pliku MP4 oraz jego kodek.</p>';
    });
    media.appendChild(video);
    video.load();
  } else if (type === 'youtube') {
    const embed = createYouTubeEmbed(source);
    if (embed) {
      media.appendChild(embed);
    } else {
      media.innerHTML = '<p class="media-error">Nieprawidłowy adres YouTube w projects.json.</p>';
    }
  } else {
    const img = document.createElement('img');
    img.src = source;
    img.alt = project.description || 'Podgląd pracy';
    img.onerror = () => {
      media.innerHTML = '<p class="media-error">Nie udało się wczytać obrazu. Sprawdź ścieżkę w projects.json.</p>';
    };
    media.appendChild(img);
  }

  description.textContent = project.description || '';
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  setTimeout(() => {
    if (!modal.classList.contains('is-open')) media.innerHTML = '';
  }, 250);
}

async function loadProjects() {
  try {
    const response = await fetch('./projects.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('projects.json musi zawierać tablicę');
    projects = data;
    renderGallery('Wszystkie');
  } catch (error) {
    console.error('Nie udało się wczytać portfolio:', error);
    gallery.innerHTML = '<p class="empty">Nie udało się wczytać portfolio. Sprawdź plik <strong>projects.json</strong>.</p>';
  }
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    renderGallery(button.dataset.category);
  });
});

document.querySelectorAll('[data-close-modal]').forEach(element => {
  element.addEventListener('click', closeModal);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

loadProjects();
