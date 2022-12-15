import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { randerCard } from './rander-card';
import { PixabayAPI } from './pixabay-api';

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onFormSubmit);

const pixabayAPI = new PixabayAPI();
const lightbox = new SimpleLightbox('.gallery a');
const intersectionObserver = new IntersectionObserver(onEntry, {
  root: null,
  rootMargin: '150px',
  threshold: 1.0,
});

async function onFormSubmit(evt) {
  evt.preventDefault();
  refs.gallery.innerHTML = '';

  const inputValue = evt.target.elements.searchQuery.value.trim();
  if (!inputValue) {
    return '';
  }
  evt.target.reset();

  try {
    pixabayAPI.resetPage();
    pixabayAPI.query = inputValue;

    const data = await pixabayAPI.getPhotos();

    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      evt.target.reset();
      return '';
    }

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    const markup = [...data.hits].map(randerCard).join('');
    refs.gallery.innerHTML = markup;

    lightbox.refresh();

    pixabayAPI.setTotal(data.totalHits);
    if (pixabayAPI.loadMorePhotos()) {
      intersectionObserver.observe(document.querySelector('.card:last-child'));
    }
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function onEntry(entries, observer) {
  entries.forEach(async entry => {
    if (!pixabayAPI.loadMorePhotos()) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      return '';
    }

    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      pixabayAPI.incrementPage();
      try {
        const data = await pixabayAPI.getPhotos();
        const markup = [...data.hits].map(randerCard).join('');
        refs.gallery.insertAdjacentHTML('beforeend', markup);

        lightbox.refresh();

        observer.observe(document.querySelector('.card:last-child'));
      } catch (error) {
        observer.unobserve(entry.target);
        Notiflix.Notify.failure(error.message);
      }
    }
  });
}
