import React, { useState, useEffect } from 'react';

import { PICS_PER_PAGE, URL_BASE } from '../../constants';
import { IImageData, IServerResponseData } from '../../interfaces';

import { Searchbar } from '../Searchbar/Searchbar';
import { Button } from '../Button/Button';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Modal } from '../Modal/Modal';
import { Footer } from '../Footer/Footer';
import { ErrorComponent } from '../ErrorComponent/ErrorComponent';
import { Dna } from 'react-loader-spinner';

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
      fetchPics().then(data => {
        if (data) {
          const purifiedData = data.hits.map(
            ({ id, largeImageURL, webformatURL, tags }) => {
              return { id, largeImageURL, webformatURL, tags };
            }
          );
          // this.setState({ picsToRender: purifiedData });
          setPicsToRender(purifiedData);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  //Updates an array of pictures to render to state if user requested new page

  useEffect(() => {
    if (page !== 1) {
      fetchPics().then(data => {
        if (data) {
          setPicsToRender((prevState: IImageData[]) => [
            ...prevState,
            ...data.hits,
          ]);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  //   // Scrolls to bottom after new portion of pictures rendered after click on "Get more"

  useEffect(() => {
    scrollToBottom();
  }, [picsToRender]);

  //   // Opens modal by click on the picture

  useEffect(() => {
    if (modalURL !== '') {
      // this.setState({ isModalOpen: true });
      setIsModalOpen(true);
    }
  }, [modalURL]);

  //// Method to fetch pictures
  const fetchPics = async (): Promise<Readonly<IServerResponseData | void>> => {
    setStatus('pending');
    try {
      const response = await fetch(
        `${URL_BASE}&q=${searchInput}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PICS_PER_PAGE}&page=${page}`
      );
      if (response.ok) {
        setError(null);
        const data = await response.json();
        checkTotalHits(data);
        return data;
      } else {
        Promise.reject(new Error('Something went wrong!'));
      }
    } catch (error) {
      setStatus('rejected');
      setError(error as string);

      throw error;
    } finally {
      setStatus('resolved');
    }
  };

  //// Method to count a real number of hits from pixabay

  const checkTotalHits = (serverResponse: Readonly<IServerResponseData>) => {
    if (serverResponse.hits.length !== 0) {
      if (serverResponse.totalHits >= 500) {
        if (
          serverResponse.total <
          PICS_PER_PAGE * Math.ceil(500 / PICS_PER_PAGE)
        ) {
          setTotalHits(serverResponse.total);

          return;
        }

        setTotalHits(PICS_PER_PAGE * Math.ceil(500 / PICS_PER_PAGE));

        return;
      }

      setTotalHits(serverResponse.totalHits);

      return;
    }

    console.log(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    setTotalHits(0);
  };

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

  const scrollToBottom = () => {
    window.scrollBy({
      top: 260 * 2,
      behavior: 'smooth',
    });
  };

  /// IDLE
  if (status === 'idle') {
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
