import { IImageGalleryProps } from '../../interfaces';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import { Container } from './ImageGallery.styled';

export const ImageGallery = ({
  picsToRender,
  imageClickHandler,
}: IImageGalleryProps) => {
  return (
    <Container className="gallery">
      {picsToRender.map(item => {
        return (
          <ImageGalleryItem
            webformatURL={item.webformatURL}
            tags={item.tags}
            largeImageURL={item.largeImageURL}
            imageClickHandler={imageClickHandler}
            key={item.id}
          />
        );
      })}
    </Container>
  );
};
