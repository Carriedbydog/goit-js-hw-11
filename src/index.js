// =======================================================================

const BASE_URL = 'https://pixabay.com/api';
const KEY = '39010552-8e1294040e1d3b982f9767e41';

class ImageApi {
  query = '';
  #per_page = 40;
  page = 1;

  getImages() {
    const PARAMS = new URLSearchParams({
      key: KEY,
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.#per_page,
      page: this.page,
    });

    const url = `${BASE_URL}?${PARAMS}`;
    return fetch(url).then(res => {
      if (!res.ok) {
        throw new Error('Error', res.statusText);
      }
      return res.json();
    });
  }
  get perPage() {
    return this.#per_page;
  }
}

// =======================================================================
const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const imageApi = new ImageApi();
let maxPage = 1;
refs.loadMoreBtn.disabled = true;
// =======================================================================
refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
// =======================================================================

function onFormSubmit(e) {
  e.preventDefault();
  const query = e.target.elements.searchQuery.value;
  imageApi.query = query;
  imageApi.page = 1;
  imageApi.getImages(query).then(data => {
    maxPage = Math.ceil(data.hits / imageApi.perPage);
    refs.gallery.innerHTML = '';
    renderImages(data.hits);
    refs.loadMoreBtn.disabled = false;
    updateStatusBtn();
  });
  e.target.reset();
}

function onLoadMoreClick(e) {
  imageApi.page += 1;
  imageApi.getImages().then(data => {
    renderImages(data.hits);
    refs.loadMoreBtn.disabled = false;
    updateStatusBtn();
  });
}

function updateStatusBtn() {
  if (imageApi.page === maxPage) {
    refs.loadMoreBtn.disabled = true;
  }
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
