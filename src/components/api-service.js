import Notiflix from 'notiflix';
import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const KEY = '30472544-2e14e66ac2a4601c283b9c0c0';

export default class ImgApiService {
  constructor() {
    this.searchInput = '';
    this.page = 1;
    this.currentHits = 0;
  }

  async fetchImages() {
    console.log('до запроса', this);

    const searchParams = new URLSearchParams({
      key: KEY,
      q: this.searchInput,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 40,
    });

    try {
      const response = await axios.get(`${URL}?${searchParams}`);
      const { data } = response;
      this.currentHits += data.hits.length;
      if (data.total === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      if (this.currentHits >= data.totalHits) {
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
      if (this.page === 1 && data.totalHits) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }

      this.page += 1;
      console.log('посел запроса если все ОК', this);
      return data.hits;
    } catch {
      error => console.log(error);
    }
  }

  resetPage() {
    this.page = 1;
  }

  resetCurrentHits() {
    this.currentHits = 0;
  }

  get inputTitle() {
    return this.searchInput;
  }

  set inputTitle(newTitle) {
    this.searchInput = newTitle;
  }
}
