/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { AiOutlineSetting } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
// eslint-disable-next-line react/prop-types
export default function CardComponent({ corHeader }) {
  return (
    <>
      <Carousel fade style={{ width: 500 }}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            // src="holder.js/800x400?text=First slide&bg=373940"
            src="https://scontent.fsjp11-1.fna.fbcdn.net/v/t1.6435-9/160623839_2582889168678641_2023677560455990448_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=e3f864&_nc_ohc=VXdbgUjiTmUAX8Mlmw2&_nc_ht=scontent.fsjp11-1.fna&oh=021388397c918663258084b1b7f0bb4d&oe=6151FAD3"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="holder.js/800x400?text=Second slide&bg=282c34"
            alt="Second slide"
          />

          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="holder.js/800x400?text=Third slide&bg=20232a"
            alt="Third slide"
          />

          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
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
