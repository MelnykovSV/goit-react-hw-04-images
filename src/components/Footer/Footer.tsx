import { IFooter } from '../../interfaces';
import { Container } from './Footer.styled';

export const Footer = ({ children }: IFooter) => {
  return <Container>{children}</Container>;
};
