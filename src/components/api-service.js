import Notiflix from 'notiflix';

const URL = 'https://pixabay.com/api';
const KEY = '30472544-2e14e66ac2a4601c283b9c0c0';

export default class ImgApiService {
  constructor() {
    this.searchInput = '';
    this.page = 1;
  }

  fetchImages() {
    // console.log('до запроса', this);
    return fetch(
      `${URL}/?key=${KEY}&q=${this.searchInput}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    )
      .then(response => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then(({ hits, total, totalHits }) => {
        this.page += 1;
        // console.log('посел запроса если все ОК', this);
        // console.log(hits);
        // console.log(totalHits);
        if (total === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          return;
        }

        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        return hits;
      })
      .catch(error => console.log(error));
  }

  resetPage() {
    this.page = 1;
  }

  get inputTitle() {
    return this.searchInput;
  }

  set inputTitle(newTitle) {
    this.searchInput = newTitle;
  }
}
