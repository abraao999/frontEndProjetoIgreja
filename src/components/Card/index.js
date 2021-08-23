/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, ListGroup } from 'react-bootstrap';
import { AiOutlineSetting } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { Container, ContainerBox, List } from './styled';
// eslint-disable-next-line react/prop-types
export default function CardComponent({
  corHeader,
  corList,
  handleRedirect,
  list,
}) {
  // const valor = 'rgba(180,50,73)';
  const styleHeader = {
    backgroundColor: `${corHeader}`,
    color: 'white',
    fontSize: 11,
  };
  const styleList = {
    backgroundColor: `${corList}`,
    color: 'black',
    fontSize: 11,
  };

  return (
    <>
      <ContainerBox>
        <Link to="/cadMembro">
          <AiOutlineSetting size={50} />
          <span>Configuracao</span>
        </Link>
      </ContainerBox>
      {/* <Card bg="primary">
        <button style={{ background: valor }}>Featured</button>

        <button style={{ background: valor, opacity: '0.1' }}>
          Cras justo odio
        </button>
        <button>Dapibus ac facilisis in</button>
        <button>Vestibulum at eros</button>
      </Card> */}
    </>
  );
}

CardComponent.defaultProps = {
  corHeader: '',
  corList: '',
  list: [],
};
CardComponent.protoTypes = {
  corHeader: PropTypes.string,
  corList: PropTypes.string,
  handleRedirect: PropTypes.func,
  list: PropTypes.array,
};
