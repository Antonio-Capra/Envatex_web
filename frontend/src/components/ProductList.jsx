// ProductList.jsx
// Component that displays all available products from the Envatex catalog.
//
// This component should:
// 1. Import React, useState, and useEffect from 'react'.
// 2. Import axios from 'axios'.
// 3. Import Bootstrap components: Container, Row, Col, Card, Button, Spinner from 'react-bootstrap'.
//
// 4. Create a functional component called ProductList.
// 5. Inside the component:
//    - Use useState to create a 'products' state variable, initialized as an empty array.
//    - Use useState to create a 'loading' state variable, initialized as true.
//    - Use useState to create an 'error' state variable, initialized as null.
//
// 6. Use useEffect to fetch products when the component mounts:
//    - The effect should be an async function.
//    - Use a try/catch block for error handling.
//    - Inside the try block:
//      - Make a GET request to 'http://127.0.0.1:5000/api/products' using axios.
//      - Update the 'products' state with the response data.
//    - Inside the catch block:
//      - Update the 'error' state with a user-friendly error message.
//    - In a 'finally' block:
//      - Set loading to false.
//
// 7. In the return statement (JSX):
//    - Use a main <Container> to wrap everything.
//    - Add a title like "Nuestro Catálogo de Productos".
//    - If 'loading' is true, display a Bootstrap <Spinner> animation.
//    - If 'error' is not null, display an alert with the error message.
//    - If not loading and no error, map over the 'products' array.
//    - For each product, render a <Col> inside a <Row>. The Col should be responsive (e.g., for medium screens and up, show 3 cards per row).
//    - Inside the <Col>, render a <Card>.
//    - The <Card.Body> should display:
//      - <Card.Title> with the product.name
//      - <Card.Subtitle> with the product.sku
//      - <Card.Text> with the product.description
//      - A <Button> with the text "Añadir a la cotización".
//
// 8. Export the component as default.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';

function ProductList({ onAddToCart, onRemoveItem, items = [] }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función helper para obtener la cantidad de un producto en el carrito
  const getProductQuantity = (productId) => {
    const item = items.find(it => it.product?.id === productId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_URL || 'https://didactic-space-fiesta-g4r6x4549q9xfpvq5-5000.app.github.dev';
        const res = await axios.get(`${API_BASE}/api/products`);
        if (mounted) setProducts(res.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        if (mounted) setError('No se pudieron cargar los productos. Intenta más tarde.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="tw-py-8">
      {/* Encabezado moderno */}
      <div className="tw-mb-8">
        <h2 className="tw-font-bold tw-mb-2 tw-text-slate-600 tw-leading-tight">
          Nuestros productos
        </h2>
        <p className="tw-text-slate-600 tw-text-lg">
          Selecciona los ítems que necesitas y añádelos a tu cotización.
        </p>
        <div 
          className="tw-h-1 tw-w-full tw-rounded-full tw-mt-4"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)'
          }}
        ></div>
      </div>

      {loading && (
        <div className="tw-flex tw-justify-center tw-items-center tw-py-20">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      {!loading && !error && (
        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
          {products.length === 0 && (
            <div className="tw-col-span-full tw-text-center tw-py-12 tw-text-slate-500">
              <i className="fas fa-box-open fa-3x tw-mb-4 tw-opacity-50"></i>
              <p className="tw-text-lg">No hay productos disponibles.</p>
            </div>
          )}

          {products.map((p) => (
            <div
              key={p.id}
              className="tw-bg-white tw-rounded-2xl tw-shadow-md hover:tw-shadow-xl tw-transition-all tw-duration-300 tw-overflow-hidden tw-border tw-border-slate-100 hover:tw--translate-y-1 tw-group tw-flex tw-flex-col"
            >
              {/* Imagen del producto */}
              {p.image_url ? (
                <div className="tw-h-56 tw-overflow-hidden tw-bg-slate-100">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="tw-w-full tw-h-full tw-object-cover group-hover:tw-scale-110 tw-transition-transform tw-duration-300"
                  />
                </div>
              ) : (
                <div className="tw-h-56 tw-bg-gradient-to-br tw-from-slate-100 tw-to-slate-200 tw-flex tw-items-center tw-justify-center">
                  <i className="fas fa-image fa-4x tw-text-slate-400"></i>
                </div>
              )}

              {/* Contenido del producto */}
              <div className="tw-p-6 tw-flex tw-flex-col tw-flex-1">
                <h3 className="tw-text-xl tw-font-bold tw-text-slate-700 tw-mb-3">
                  {p.name}
                </h3>
                {p.description && (
                  <p className="tw-text-slate-500 tw-mb-4 tw-line-clamp-3 tw-text-sm tw-flex-1">
                    {p.description}
                  </p>
                )}
                
                {/* Contador de producto */}
                {getProductQuantity(p.id) === 0 ? (
                  // Botón "Agregar" cuando no hay cantidad
                  <button
                    onClick={() => onAddToCart && onAddToCart(p)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    }}
                    className="tw-w-full tw-text-white tw-py-3 tw-px-6 tw-rounded-xl tw-font-semibold tw-transition-all tw-duration-300 tw-border-0"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)'
                    }}
                  >
                    Agregar <i className="fas fa-cart-plus tw-ml-2"></i>
                  </button>
                ) : (
                  // Contador con botones +/- cuando ya está agregado
                  <div className="tw-flex tw-items-center tw-justify-between tw-gap-2">
                    <button
                      onClick={() => onRemoveItem && onRemoveItem(p.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      className="tw-w-12 tw-h-12 tw-rounded-xl tw-text-white tw-font-bold tw-text-xl tw-transition-all tw-duration-200 tw-flex tw-items-center tw-justify-center tw-border-0"
                      style={{
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      }}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    
                    <div className="tw-flex-1 tw-text-center tw-py-3 tw-px-4 tw-bg-slate-100 tw-rounded-xl tw-font-bold tw-text-slate-700 tw-text-lg">
                      {getProductQuantity(p.id)}
                    </div>
                    
                    <button
                      onClick={() => onAddToCart && onAddToCart(p)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      className="tw-w-12 tw-h-12 tw-rounded-xl tw-text-white tw-font-bold tw-text-xl tw-transition-all tw-duration-200 tw-flex tw-items-center tw-justify-center tw-border-0"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)'
                      }}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
