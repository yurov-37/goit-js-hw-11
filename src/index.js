import ImgApiService from './components/api-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const imgContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

// loadMoreBtn.style.display = 'none';

const imgApiService = new ImgApiService();
console.log(imgApiService);

searchForm.addEventListener('submit', onSearchImages);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearchImages(evt) {
  evt.preventDefault();
  clearImagesContainer();
  imgApiService.inputTitle =
    evt.currentTarget.elements.searchQuery.value.trim();

  if (imgApiService.inputTitle === '') {
    return Notiflix.Notify.warning('Поле должно быть заполнено');
  }
  imgApiService.resetPage();
  imgApiService
    .fetchImages()
    .then(hits => {
      console.log(hits);

      imgContainer.insertAdjacentHTML('beforeend', createImagesMarkup(hits));
      gallerySimpleLightbox.refresh();
    })
    .catch(err => console.log(err));
}

function onLoadMore() {
  imgApiService
    .fetchImages()
    .then(hits => {
      console.log(hits);
      imgContainer.insertAdjacentHTML('beforeend', createImagesMarkup(hits));
      gallerySimpleLightbox.refresh();
    })
    .catch(err => {
      console.log(err);
      //   loadMoreBtn.setAttribute('disabled');
      //   alert("We're sorry, but you've reached the end of search results.");
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

// webformatURL - ссылка на маленькое изображение для списка карточек.
// largeImageURL - ссылка на большое изображение.
// tags - строка с описанием изображения. Подойдет для атрибута alt.
// likes - количество лайков.
// views - количество просмотров.
// comments - количество комментариев.
// downloads - количество загрузок.

{
  /* <div class="photo-card">
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>; */
}
