import axios from 'axios';
import { PICS_PER_PAGE, URL_BASE } from './constants';
import { IfetchResults } from './interfaces';

export async function fetchPics(
  searchInput: string,
  page: number
): Promise<Readonly<IfetchResults>> {
  return axios
    .get(
      `${URL_BASE}&q=${searchInput}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PICS_PER_PAGE}&page=${page}`
    )
    .then(response => {
      return { data: response.data, error: null };
    })
    .catch(error => {
      return { data: null, error: error };
    });
}
