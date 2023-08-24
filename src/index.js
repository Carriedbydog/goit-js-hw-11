import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { ImageApi } from './pixabayApi';

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
let lightbox;
// =======================================================================
refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
// =======================================================================

function onFormSubmit(e) {
  e.preventDefault();
  const query = e.target.elements.searchQuery.value.trim();
  if (query.length === 0) {
    return Notiflix.Notify.failure('Please fill something in the field');
  }
  imageApi.query = query;
  imageApi.page = 1;
  imageApi.getImages(query).then(data => {
    if (data.total === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (data.total > 0) {
      Notiflix.Notify.success('Hooray! We found totalHits images.');
    }

    maxPage = Math.ceil(data.hits / imageApi.perPage);
    refs.gallery.innerHTML = '';
    renderImages(data.hits);

    lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();

    refs.loadMoreBtn.disabled = false;
    updateStatusBtn();
  });

  e.target.reset();
}

function onLoadMoreClick(e) {
  imageApi.page += 1;
  imageApi.getImages().then(data => {
    renderImages(data.hits);
    lightbox.refresh();
    refs.loadMoreBtn.disabled = false;

    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
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
  <a href="${largeImageURL}">
  <img class="gallery-image" src="${webformatURL}"  alt="${tags}" loading="lazy" width="360" height ="240"/>
  </a>
      <div class="info">
        <p class="info-item">
          <b> Likes </b>
          ${likes}
        </p>
        <p class="info-item">
          <b> Views </b>
          ${views}
        </p>
        <p class="info-item">
          <b> Comments </b>
          ${comments}
        </p>
        <p class="info-item">
          <b> Downloads </b>
          ${downloads}
        </p>
      </div>
    </div>`;
}

function renderImages(image) {
  const markup = image.map(templateImages).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
