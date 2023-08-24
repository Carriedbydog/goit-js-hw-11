import axios from 'axios';
// =======================================================================

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '39010552-8e1294040e1d3b982f9767e41';

export class ImageApi {
  query = '';
  #per_page = 40;
  page = 1;

  async getImages() {
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
    const res = await axios(url).then(res => {
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
