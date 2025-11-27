import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import ProductModal from './ProductModal';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'https://didactic-space-fiesta-g4r6x4549q9xfpvq5-5000.app.github.dev';
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No se encontró un token de autenticación.');
        setLoading(false);
        return;
      }
      const res = await axios.get(`${API_BASE}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data || []);
    } catch (err) {
      setError('No se pudieron cargar los productos.');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('access_token');
          await axios.delete(`${API_BASE}/api/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProducts(prev => prev.filter(p => p.id !== id));
          Swal.fire('Borrado!', 'El producto ha sido eliminado.', 'success');
        } catch (err) {
          Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
        }
      }
    });
  };

  const handleShowModal = (product = null) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleSaveProduct = async (productData) => {
    try {
      const token = localStorage.getItem('access_token');
      if (editingProduct) {
        const res = await axios.put(`${API_BASE}/api/products/${editingProduct.id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(prev => prev.map(p => (p.id === res.data.product.id ? res.data.product : p)));
      } else {
        const res = await axios.post(`${API_BASE}/api/products`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(prev => [res.data.product, ...prev]);
      }
      handleCloseModal();
    } catch (err) {
      Swal.fire('Error', 'No se pudo guardar el producto.', 'error');
    }
  };

  return (
    <div className="tw-bg-white tw-rounded-2xl tw-shadow-xl tw-p-6">
      {loading && (
        <div className="tw-flex tw-justify-center tw-items-center tw-py-20">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <div className="tw-bg-red-50 tw-border tw-border-red-200 tw-text-red-700 tw-px-4 tw-py-3 tw-rounded-xl tw-mb-4">
          <i className="fas fa-exclamation-circle tw-mr-2"></i>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {(!products || products.length === 0) ? (
            <div className="tw-text-center tw-py-12 tw-text-slate-400">
              <i className="fas fa-box-open fa-3x tw-mb-4 tw-opacity-50"></i>
              <p className="tw-text-lg">No hay productos para mostrar.</p>
            </div>
          ) : (
            <div className="tw-overflow-x-auto">
              <table className="tw-w-full">
                <thead>
                  <tr className="tw-border-b-2 tw-border-slate-200">
                    <th className="tw-text-left tw-py-4 tw-px-4 tw-font-bold tw-text-slate-700">Nombre</th>
                    <th className="tw-text-left tw-py-4 tw-px-4 tw-font-bold tw-text-slate-700">SKU</th>
                    <th className="tw-text-left tw-py-4 tw-px-4 tw-font-bold tw-text-slate-700">Descripción</th>
                    <th className="tw-text-center tw-py-4 tw-px-4 tw-font-bold tw-text-slate-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="tw-border-b tw-border-slate-100 hover:tw-bg-slate-50 tw-transition-colors">
                      <td className="tw-py-4 tw-px-4 tw-font-semibold tw-text-slate-800">{product.name}</td>
                      <td className="tw-py-4 tw-px-4 tw-text-slate-600 tw-font-mono tw-text-sm">{product.sku}</td>
                      <td className="tw-py-4 tw-px-4 tw-text-slate-600 tw-text-sm">{product.description}</td>
                      <td className="tw-py-4 tw-px-4">
                        <div className="tw-flex tw-gap-2 tw-justify-center">
                          <button
                            onClick={() => handleShowModal(product)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                            className="tw-px-4 tw-py-2 tw-rounded-lg tw-text-white tw-font-semibold tw-text-sm tw-transition-all tw-duration-200 tw-border-0"
                            style={{
                              background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
                            }}
                            title="Editar"
                          >
                            <i className="fas fa-pen tw-mr-1"></i>
                            <span className="tw-hidden md:tw-inline">Editar</span>
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                            className="tw-px-4 tw-py-2 tw-rounded-lg tw-text-white tw-font-semibold tw-text-sm tw-transition-all tw-duration-200 tw-border-0"
                            style={{
                              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                            }}
                            title="Eliminar"
                          >
                            <i className="fas fa-trash-alt tw-mr-1"></i>
                            <span className="tw-hidden md:tw-inline">Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="tw-flex tw-justify-center tw-mt-6">
            <button
              onClick={() => handleShowModal()}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              className="tw-px-4 tw-py-2 tw-rounded-lg tw-text-white tw-font-semibold tw-text-sm tw-transition-all tw-duration-200 tw-border-0"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)'
              }}
            >
              <i className="fas fa-plus tw-mr-1"></i>
              <span className="tw-hidden md:tw-inline">Crear Producto</span>
              <span className="md:tw-hidden">Crear</span>
            </button>
          </div>
        </>
      )}

      <ProductModal
        show={showModal}
        handleClose={() => {
          handleCloseModal();
          setEditingProduct(null);
        }}
        handleSubmit={handleSaveProduct}
        productData={editingProduct}
      />
    </div>
  );
}

export default AdminProducts;