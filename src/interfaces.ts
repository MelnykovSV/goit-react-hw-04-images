export interface IAppState {
  status: string;

  searchInput: string;

  page: number;
  picsToRender: IImageData[];
  totalHits: number;
  error: unknown | null;

  modalURL: string;
  isModalOpen: boolean;
  modalTags: string;
}

export interface IImageData {
  id: number;
  largeImageURL: string;
  tags: string;
  webformatURL: string;
}

export interface ISearchbarProps {
  submitHandler: (value: string) => void;
}

export interface IServerResponseData {
  total: number;
  totalHits: number;
  hits: IImageData[];
}

export interface IButtonProps {
  pageIncrementor: () => void;
}

export interface IModalProps {
  modalCloseHandler: () => void;
  largeImageUrl: string;
  imageTags: string;
}

export interface IModalState {
  showLoader: boolean;
}

export interface IImageGalleryProps {
  imageClickHandler: (imageURL: string, tags: string) => void;
  picsToRender: IImageData[];
}

export interface IImageGalleryItemProps {
  webformatURL: string;
  tags: string;
  largeImageURL: string;
  imageClickHandler: (imageURL: string, tags: string) => void;
  key: number;
}

export interface IFooter {
  children?: React.ReactNode;
}

export interface IErrorComponentProps {
  errorMessage: string | null;
}

export interface IfetchResults {
  data: IServerResponseData | null;
  error: null | string;
}
