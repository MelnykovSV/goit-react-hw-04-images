import { PICS_PER_PAGE } from './constants';
import { IServerResponseData, IImageData } from './interfaces';
// import { IfetchResults } from './interfaces';

export function countTotalHits(serverResponse: Readonly<IServerResponseData>) {
  if (serverResponse.hits.length !== 0) {
    if (serverResponse.totalHits >= 500) {
      if (
        serverResponse.total <
        PICS_PER_PAGE * Math.ceil(500 / PICS_PER_PAGE)
      ) {
        return serverResponse.total;
      }

      return PICS_PER_PAGE * Math.ceil(500 / PICS_PER_PAGE);
    }

    return serverResponse.totalHits;
  }

  console.log(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  return 0;
}

// {  id, largeImageURL,webformatURL, tags }

export function imageDataPurifier(dirtyImageData: IImageData[]) {
  const purifiedImageData = dirtyImageData.map(
    ({ id, largeImageURL, webformatURL, tags }) => ({
      id,
      largeImageURL,
      webformatURL,
      tags,
    })
  );
  return purifiedImageData;
}

export function scrollBottomDirection() {
  window.scrollBy({
    top: 540,
    behavior: 'smooth',
  });
}
