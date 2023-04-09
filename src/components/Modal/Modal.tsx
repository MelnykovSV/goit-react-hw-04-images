import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { IModalProps } from '../../interfaces';

import { ThreeCircles } from 'react-loader-spinner';

import { Container } from './Modal.styled';

const modalRoot: Element | DocumentFragment =
  document.querySelector('#modal-root')!;

export const Modal = ({
  modalCloseHandler,
  largeImageUrl,
  imageTags,
}: IModalProps) => {
  const [showLoader, setShowLoader] = useState(true);

  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.keyCode === 27) {
      modalCloseHandler();
    }
  };

  const clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    const nodeName = e.target as HTMLDivElement;
    if (nodeName.nodeName === 'DIV') {
      modalCloseHandler();
    }
  };

  useEffect((): void => {
    document.addEventListener('keydown', keyDownHandler);
  }, []);

  useEffect(() => {
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  return createPortal(
    <Container onClick={clickHandler}>
      <div>
        {showLoader && (
          <ThreeCircles
            height="100"
            width="100"
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="three-circles-rotating"
            outerCircleColor="red"
            innerCircleColor="green"
            middleCircleColor="blue"
          />
        )}
        <img
          src={largeImageUrl}
          alt={imageTags}
          className="modal-image"
          onLoad={() => {
            setShowLoader(false);
          }}
        />
      </div>
    </Container>,
    modalRoot
  );
};