import { Container } from './Button.styled';
import { IButtonProps } from '../../interfaces';

export const Button = ({ pageIncrementor }: IButtonProps) => {
  return (
    <Container type="button" onClick={pageIncrementor}>
      Get more
    </Container>
  );
};
