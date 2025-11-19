import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductList from '../components/ProductList';
import QuotationForm from '../components/QuotationForm';

// Home.jsx
// The main page for customers, showing products and the quotation form.

function Home({ items = [], onAddToCart, onRemoveItem, onClearCart }) {
  return (
    <>
      <style>
        {`
            @media (max-width: 768px) {
              .sticky-col {
                position: static;
                top: auto;
              }
            }

            @media (min-width: 769px) {
              .sticky-col {
                position: fixed;
                top: 120px;
                right: 0;
                z-index: 5;
                width: 33.333%;
              }
            }
          `}
      </style>
      <Container className="my-4" style={{ overflow: 'visible' }}>
        <Row>
          <Col md={8}>
            <ProductList onAddToCart={onAddToCart} />
          </Col>
          <Col md={4}>
            <div style={{ position: 'sticky', top: '100px' }}>
              <QuotationForm items={items} onRemoveItem={onRemoveItem} onClearCart={onClearCart} />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
