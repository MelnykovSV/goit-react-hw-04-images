import React from 'react';
import { IImageGalleryItemProps } from '../../interfaces';
import { Container } from './ImageGalleryItem.styled';

export const ImageGalleryItem = ({
  webformatURL,
  tags,
  largeImageURL,
  imageClickHandler,
}: IImageGalleryItemProps) => {
  const imageUrlDetector = () => {
    imageClickHandler(largeImageURL, tags);
  };

  return (
    <Container className="gallery-item" onClick={imageUrlDetector}>
      <img src={webformatURL} alt={tags} />
    </Container>
  );
};
