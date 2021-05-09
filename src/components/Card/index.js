/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import * as colors from '../../config/colors';
import { CancelarButton } from './styled';
// eslint-disable-next-line react/prop-types
export default function CardComponent({
  title,
  text,
  handleClose,
  show,
  buttonCancel,
  buttonConfirm,
  handleFunctionConfirm,
}) {
  return (
    <>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Card Subtitle
          </Card.Subtitle>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the content.
          </Card.Text>
          <Card.Link href="#">Card Link</Card.Link>
          <Card.Link href="#">Another Link</Card.Link>
        </Card.Body>
      </Card>
    </>
  );
}

CardComponent.defaultProps = {
  title: '',
  text: '',
  buttonCancel: '',
  buttonConfirm: '',
  show: false,
};
CardComponent.protoTypes = {
  nome: PropTypes.string,
  text: PropTypes.string,
  buttonConfirm: PropTypes.string,
  buttonCancel: PropTypes.string,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  handleFunctionConfirm: PropTypes.func,
};
