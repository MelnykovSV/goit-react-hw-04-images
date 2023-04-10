import React, { useState, useEffect } from 'react';

import { PICS_PER_PAGE } from '../../constants';
import { IImageData } from '../../interfaces';

import { Searchbar } from '../Searchbar/Searchbar';
import { Button } from '../Button/Button';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Modal } from '../Modal/Modal';
import { Footer } from '../Footer/Footer';
import { ErrorComponent } from '../ErrorComponent/ErrorComponent';
import { Dna } from 'react-loader-spinner';

import { IfetchResults } from '../../interfaces';
import { fetchPics } from '../../api';

import {
  countTotalHits,
  imageDataPurifier,
  scrollBottomDirection,
} from '../../helpers';

import { Container } from './App.styled';

export const App = () => {
  const [status, setStatus] = useState('idle');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [picsToRender, setPicsToRender] = useState<IImageData[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [modalURL, setModalURL] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTags, setModalTags] = useState('');

  //Writes new array of pictures to rendder  to state if search input was changed

  useEffect(() => {
    if (searchInput) {
      fetchPics(searchInput, page).then(data => {
        serverResponseHandler(data, 'initial');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  //Updates an array of pictures to render to state if user requested new page

  useEffect(() => {
    if (page !== 1) {
      fetchPics(searchInput, page).then(data => {
        serverResponseHandler(data, 'following');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  //   // Scrolls to bottom after new portion of pictures rendered after click on "Get more"

  useEffect(() => {
    scrollBottomDirection();
  }, [picsToRender]);

  //   // Opens modal by click on the picture

  useEffect(() => {
    if (modalURL !== '') {
      setIsModalOpen(true);
    }
  }, [modalURL]);

  const serverResponseHandler = (
    { data, error }: IfetchResults,
    handleType: 'initial' | 'following'
  ) => {
    if (data) {
      setStatus('resolved');
      setError(null);

      switch (handleType) {
        case 'initial':
          setTotalHits(countTotalHits(data));
          setPicsToRender(imageDataPurifier(data.hits));
          break;
        case 'following':
          setPicsToRender((prevState: IImageData[]) => [
            ...prevState,
            ...imageDataPurifier(data.hits),
          ]);
      }
    } else {
      setStatus('rejected');
      setError(error);
      setTotalHits(0);
      setPicsToRender([]);
    }
  };

  // const serverResponseHandler = ({ data, error }: IfetchResults) => {};

  const incrementPages = () => {
    setPage(prevState => prevState + 1);
  };

  const handleFormSubmit = (value: Readonly<string>) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleImageClick = (
    imageURL: Readonly<string>,
    tags: Readonly<string>
  ): void => {
    setModalURL(imageURL);
    setModalTags(tags);
  };

  const handleModalClose = (): void => {
    setModalURL('');
    setModalTags('');
    setIsModalOpen(false);
  };

  /// IDLE
  if (status === 'idle') {
    return (
      <Container>
        <Searchbar submitHandler={handleFormSubmit} />
      </Container>
    );
  }

  /// PENDING
  else if (status === 'pending') {
    return (
      <Container>
        {isModalOpen && (
          <Modal
            modalCloseHandler={handleModalClose}
            largeImageUrl={modalURL}
            imageTags={modalTags}
          ></Modal>
        )}
        <Searchbar submitHandler={handleFormSubmit} />
        <ImageGallery
          imageClickHandler={handleImageClick}
          picsToRender={picsToRender}
        ></ImageGallery>
        <Footer>
          <Dna />
        </Footer>
      </Container>
    );
  }

  /// RESOLVED
  else if (status === 'resolved') {
    return (
      <Container>
        {isModalOpen && (
          <Modal
            modalCloseHandler={handleModalClose}
            largeImageUrl={modalURL}
            imageTags={modalTags}
          ></Modal>
        )}
        <Searchbar submitHandler={handleFormSubmit} />
        <ImageGallery
          imageClickHandler={handleImageClick}
          picsToRender={picsToRender}
        ></ImageGallery>
        <Footer>
          {page !== Math.ceil(totalHits / PICS_PER_PAGE) &&
            totalHits >= PICS_PER_PAGE && (
              <Button pageIncrementor={incrementPages} />
            )}

          {totalHits === 0 && (
            <ErrorComponent errorMessage="Sorry, there are no images matching your search query. Please try again." />
          )}
        </Footer>
      </Container>
    );
  }

  /// REJECTED
  else if (status === 'rejected') {
  }
  return (
    <Container>
      {isModalOpen && (
        <Modal
          modalCloseHandler={handleModalClose}
          largeImageUrl={modalURL}
          imageTags={modalTags}
        ></Modal>
      )}
      <Searchbar submitHandler={handleFormSubmit} />
      <Footer>
        <ErrorComponent errorMessage={error} />
      </Footer>
    </Container>
  );
};
