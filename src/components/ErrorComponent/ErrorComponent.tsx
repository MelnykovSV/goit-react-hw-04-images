import { IErrorComponentProps } from '../../interfaces'
import { Container } from './ErrorComponent.styled'

///TODO: check this import
const errorImage = require('./errorComponentImage.jpg')

export const ErrorComponent = ({ errorMessage }: IErrorComponentProps) => {
  console.log(errorImage)
  return (
    <Container>
      <p>{errorMessage ? errorMessage : 'Some unexpected error occured'}</p>
      <img src={errorImage} alt='sad bear'></img>
    </Container>
  )
}
