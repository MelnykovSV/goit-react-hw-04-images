import React from 'react';

import { PICS_PER_PAGE, URL_BASE } from '../../constants';
import { IAppState, IServerResponseData } from '../../interfaces';

import { Searchbar } from '../Searchbar/Searchbar';
import { Button } from '../Button/Button';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Modal } from '../Modal/Modal';
import { Footer } from '../Footer/Footer';
import { ErrorComponent } from '../ErrorComponent/ErrorComponent';
import { Dna } from 'react-loader-spinner';

import { Container } from './App.styled';

export class App extends React.Component<Readonly<{}>, Readonly<IAppState>> {
  state = {
    status: 'idle',

    searchInput: '',

    page: 1,
    picsToRender: [],
    totalHits: 0,
    error: null,

    modalURL: '',
    isModalOpen: false,
    modalTags: '',
  };

  // myref = React.createRef<HTMLDivElement>()

  componentDidUpdate(
    prevProps: Readonly<IAppState>,
    prevState: Readonly<IAppState>
  ): void {
    //Writes new array of pictures to rendder  to state if search input was changed
    if (this.state.searchInput !== prevState.searchInput) {
      this.fetchPics().then(data => {
        if (data) {
          const purifiedData = data.hits.map(
            ({ id, largeImageURL, webformatURL, tags }) => {
              return { id, largeImageURL, webformatURL, tags };
            }
          );
          this.setState({ picsToRender: purifiedData });
        }
      });

      return;
    }

    //Updates an array of pictures to render to state if user requested new page
    if (this.state.page !== prevState.page && this.state.page !== 1) {
      this.fetchPics().then(data => {
        if (data) {
          this.setState(prevState => ({
            picsToRender: [...prevState.picsToRender, ...data.hits],
          }));
        }
      });
    }

    // Scrolls to bottom after new portion of pictures rendered after click on "Get more"
    if (this.state.picsToRender !== prevState.picsToRender) {
      this.scrollToBottom();
    }

    // Opens modal by click on the picture
    if (
      this.state.modalURL !== prevState.modalURL &&
      this.state.modalURL !== ''
    ) {
      this.setState({ isModalOpen: true });
    }
  }

  //// Method to fetch pictures
  fetchPics = async (): Promise<Readonly<IServerResponseData | void>> => {
    this.setState({ status: 'pending' });
    try {
      const response = await fetch(
        `${URL_BASE}&q=${this.state.searchInput}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PICS_PER_PAGE}&page=${this.state.page}`
      );
      if (response.ok) {
        this.setState({ error: null });
        const data = await response.json();
        this.checkTotalHits(data);
        return data;
      } else {
        Promise.reject(new Error('Something went wrong!'));
      }
    } catch (error) {
      this.setState({ status: 'rejected', error });

      throw error;
    } finally {
      this.setState({ status: 'resolved' });
    }
  };

  //// Method to count a real number of hits from pixabay

  checkTotalHits = (serverResponse: Readonly<IServerResponseData>) => {
    if (serverResponse.hits.length !== 0) {
      if (serverResponse.totalHits >= 500) {
        if (
          serverResponse.total <
          PICS_PER_PAGE * Math.ceil(500 / PICS_PER_PAGE)
        ) {
          this.setState({ totalHits: serverResponse.total });

          return;
        }

        this.setState({
          totalHits: PICS_PER_PAGE * Math.ceil(500 / PICS_PER_PAGE),
        });

        return;
      }

      this.setState({ totalHits: serverResponse.totalHits });

      return;
    }

    console.log(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    this.setState({ totalHits: 0 });
  };

  incrementPages = () => {
    this.setState(prevState => {
      return { page: prevState.page + 1 };
    });
  };

  handleFormSubmit = (value: Readonly<string>) => {
    this.setState({ searchInput: value, page: 1 });
  };

  handleImageClick = (
    imageURL: Readonly<string>,
    tags: Readonly<string>
  ): void => {
    this.setState({ modalURL: imageURL, modalTags: tags });
  };
  handleModalClose = (): void => {
    this.setState({ modalURL: '', modalTags: '', isModalOpen: false });
  };

  scrollToBottom = () => {
    window.scrollBy({
      top: 260 * 2,
      behavior: 'smooth',
    });
  };

  render() {
    /// IDLE
    if (this.state.status === 'idle') {
      return (
        <Container>
          {this.state.isModalOpen && (
            <Modal
              modalCloseHandler={this.handleModalClose}
              largeImageUrl={this.state.modalURL}
              imageTags={this.state.modalTags}
            ></Modal>
          )}
          <Searchbar submitHandler={this.handleFormSubmit} />
        </Container>
      );
    }

    /// PENDING
    else if (this.state.status === 'pending') {
      return (
        <Container>
          {this.state.isModalOpen && (
            <Modal
              modalCloseHandler={this.handleModalClose}
              largeImageUrl={this.state.modalURL}
              imageTags={this.state.modalTags}
            ></Modal>
          )}
          <Searchbar submitHandler={this.handleFormSubmit} />
          <ImageGallery
            imageClickHandler={this.handleImageClick}
            picsToRender={this.state.picsToRender}
          ></ImageGallery>
          <Footer>
            <Dna />
          </Footer>
        </Container>
      );
    }

    /// RESOLVED
    else if (this.state.status === 'resolved') {
      return (
        <Container>
          {this.state.isModalOpen && (
            <Modal
              modalCloseHandler={this.handleModalClose}
              largeImageUrl={this.state.modalURL}
              imageTags={this.state.modalTags}
            ></Modal>
          )}
          <Searchbar submitHandler={this.handleFormSubmit} />
          <ImageGallery
            imageClickHandler={this.handleImageClick}
            picsToRender={this.state.picsToRender}
          ></ImageGallery>
          <Footer>
            {this.state.page !==
              Math.ceil(this.state.totalHits / PICS_PER_PAGE) &&
              this.state.totalHits >= PICS_PER_PAGE && (
                <Button pageIncrementor={this.incrementPages} />
              )}

            {this.state.totalHits === 0 && (
              <ErrorComponent errorMessage="Sorry, there are no images matching your search query. Please try again." />
            )}
          </Footer>
        </Container>
      );
    }

    /// REJECTED
    else if (this.state.status === 'rejected') {
    }
    return (
      <Container>
        {this.state.isModalOpen && (
          <Modal
            modalCloseHandler={this.handleModalClose}
            largeImageUrl={this.state.modalURL}
            imageTags={this.state.modalTags}
          ></Modal>
        )}
        <Searchbar submitHandler={this.handleFormSubmit} />
        <Footer>
          <ErrorComponent errorMessage={this.state.error} />
        </Footer>
      </Container>
    );
  }
}
