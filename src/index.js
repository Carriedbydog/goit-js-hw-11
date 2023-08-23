// =======================================================================

const BASE_URL = 'https://pixabay.com/api';
const KEY = '39010552-8e1294040e1d3b982f9767e41';

export function getImages(query) {
  const PARAMS = new URLSearchParams({
    key: KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  });
  const url = `${BASE_URL}?${PARAMS}`;
  return fetch(url).then(res => {
    if (!res.ok) {
      throw new Error('Error', res.statusText);
    }
    return res.json();
  });
}
// =======================================================================
const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

// =======================================================================
refs.form.addEventListener('submit', onFormSubmit);
// =======================================================================

function onFormSubmit(e) {
  e.preventDefault();
  const query = e.target.elements.searchQuery.value;
  getImages(query).then(data => {
    refs.gallery.innerHTML = '';
    renderImages(data.hits);
  });
}

function templateImages({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
      <img class="image" src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes ${likes}</b>
        </p>
        <p class="info-item">
          <b>Views ${views}</b>
        </p>
        <p class="info-item">
          <b>Comments ${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads ${downloads}</b>
        </p>
      </div>
    </div>`;
}

function renderImages(image) {
  const markup = image.map(templateImages).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
