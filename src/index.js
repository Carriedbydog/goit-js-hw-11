import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { ImageApi } from './pixabayApi';

// =======================================================================
const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const imageApi = new ImageApi();
let maxPage = 1;
let lightbox;
refs.loadMoreBtn.classList.add('visually-hidden');
// =======================================================================
refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
// =======================================================================

async function onFormSubmit(e) {
  e.preventDefault();
  const query = e.target.elements.searchQuery.value.trim();
  try {
    if (query.length === 0) {
      return Notiflix.Notify.failure('Please fill something in the field');
    }
    imageApi.query = query;
    imageApi.page = 1;

    const data = await imageApi.getImages(query);
    maxPage = Math.ceil(data.hits / imageApi.perPage);

    refs.loadMoreBtn.classList.remove('visually-hidden');
    lightbox = new SimpleLightbox('.gallery a');

    if (data.total === 0) {
      e.target.reset();
      refs.loadMoreBtn.classList.add('visually-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (data.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);
      if (data.totalHits < 40) {
        refs.loadMoreBtn.classList.add('visually-hidden');
      } else {
        refs.loadMoreBtn.classList.remove('visually-hidden');
      }
    }
    refs.gallery.innerHTML = '';
    renderImages(data.hits);

    lightbox.refresh();
    updateStatusBtn();

    e.target.reset();
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Ooops something went wrong!!!');
  }
}

async function onLoadMoreClick(e) {
  imageApi.page += 1;
  updateStatusBtn();
  try {
    const data = await imageApi.getImages(imageApi.page);
    renderImages(data.hits);
    if (data.hits < 40) {
      refs.loadMoreBtn.classList.add('visually-hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      refs.loadMoreBtn.classList.remove('visually-hidden');
    }

    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

function updateStatusBtn() {
  if (imageApi.page === maxPage) {
    refs.loadMoreBtn.classList.add('visually-hidden');
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
