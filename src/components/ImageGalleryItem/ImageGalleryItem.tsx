import React from 'react'
import { IImageGalleryItemProps } from '../../interfaces'
import { Container } from './ImageGalleryItem.styled'

export class ImageGalleryItem extends React.Component<Readonly<IImageGalleryItemProps>> {
  state = {
    largeImageURL: this.props.largeImageURL,
  }

  imageUrlDetector = () => {
    this.props.imageClickHandler(this.state.largeImageURL, this.props.tags)
  }
  render() {
    return (
      <Container className='gallery-item' onClick={this.imageUrlDetector}>
        <img src={this.props.webformatURL} alt={this.props.tags} />
      </Container>
    )
  }
}
