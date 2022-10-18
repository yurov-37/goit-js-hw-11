import ImgApiService from './components/api-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const formInput = document.querySelector('.search-text');
const imgContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const preloader = document.querySelectorAll('.lds-roller div');

const imgApiService = new ImgApiService();
let gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

loadMoreBtn.style.display = 'none';
preloader.forEach(e => {
  e.style.display = 'none';
});

searchForm.addEventListener('submit', onSearchImages);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearchImages(evt) {
  evt.preventDefault();

  imgApiService.inputTitle =
    evt.currentTarget.elements.searchQuery.value.trim();

  if (imgApiService.inputTitle === '') {
    Notiflix.Notify.warning('Field must not be empty');
    formInput.value = '';
    return;
  }

  preloader.forEach(e => {
    e.style.display = 'block';
  });
  loadMoreBtn.style.display = 'none';

  imgApiService.resetPage();
  imgApiService.resetCurrentHits();
  clearImagesContainer();
  formInput.value = '';

  imgApiService
    .fetchImages()
    .then(hits => {
      imgContainer.insertAdjacentHTML('beforeend', createImagesMarkup(hits));
      gallerySimpleLightbox.refresh();
      preloader.forEach(e => {
        e.style.display = 'none';
      });
      loadMoreBtn.style.display = 'block';
      if (hits.length < 40) {
        loadMoreBtn.style.display = 'none';
      }
    })
    .catch(err => {
      console.log(err);
      preloader.forEach(e => {
        e.style.display = 'none';
      });
    });
}

function onLoadMore() {
  loadMoreBtn.style.display = 'none';
  preloader.forEach(e => {
    e.style.display = 'block';
  });
  imgApiService
    .fetchImages()
    .then(hits => {
      imgContainer.insertAdjacentHTML('beforeend', createImagesMarkup(hits));
      gallerySimpleLightbox.refresh();
      preloader.forEach(e => {
        e.style.display = 'none';
      });
      loadMoreBtn.style.display = 'block';
      const { height: cardHeight } =
        imgContainer.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      if (hits.length < 40) {
        loadMoreBtn.style.display = 'none';
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function createImagesMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  
  <div class="info">
    <p class="info-item">
      <b>Likes </b>${likes}
    </p>
    <p class="info-item">
      <b>Views </b>${views}
    </p>
    <p class="info-item">
      <b>Comments </b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads </b>${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
}

function clearImagesContainer() {
  imgContainer.innerHTML = '';
}
