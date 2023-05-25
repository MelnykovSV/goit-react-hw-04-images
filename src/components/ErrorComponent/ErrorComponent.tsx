import { IErrorComponentProps } from '../../interfaces';
import { Container } from './ErrorComponent.styled';

import errorImage from './errorComponentImage.jpg';

export const ErrorComponent = ({ errorMessage }: IErrorComponentProps) => {
  console.log(errorImage);
  return (
    <Container>
      <p>{errorMessage ? errorMessage : 'Some unexpected error occured'}</p>
      <img src={errorImage} alt="sad bear"></img>
    </Container>
  );
};
