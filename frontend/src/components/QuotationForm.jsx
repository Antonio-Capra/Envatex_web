import React, { useState } from 'react';
import axios from 'axios';
import { Card, Button, Form, Table, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';

function QuotationForm({ items = [], onRemoveItem, onClearCart, onAddToCart }) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerComments, setCustomerComments] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('loading');
    setErrorMsg(null);
    try {
      const API_BASE = process.env.REACT_APP_API_URL || 'https://didactic-space-fiesta-g4r6x4549q9xfpvq5-5000.app.github.dev';
      const payloadItems = items.map((it) => ({
        product_id: it.product?.id ?? it.product_id ?? it.productId ?? null,
        quantity: it.quantity ?? 1,
      }));
      const payload = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_comments: customerComments,
        items: payloadItems,
      };
      await axios.post(`${API_BASE}/api/quotations`, payload);
      setCustomerName('');
      setCustomerEmail('');
      setCustomerComments('');
      if (typeof onClearCart === 'function') onClearCart();
      setSubmissionStatus('success');
      await Swal.fire({
        title: '¡Cotización Enviada!',
        text: 'Nos pondremos en contacto contigo pronto a ' + customerEmail,
        icon: 'success',
        confirmButtonColor: 'var(--secondary-blue)',
        confirmButtonText: 'Genial'
      });
      setSubmissionStatus(null);
    } catch (err) {
      setSubmissionStatus('error');
      setErrorMsg('No se pudo enviar la solicitud. Intenta más tarde.');
    } finally {
      setSubmissionStatus(null);
    }
  };

  return (
    <div className="tw-bg-white tw-rounded-2xl tw-shadow-xl tw-overflow-hidden tw-border tw-border-slate-200">
      {/* Header moderno con gradiente */}
      <div 
        className="tw-px-6 tw-py-5"
        style={{
          background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
        }}
      >
        <h4 className="tw-text-white tw-font-bold tw-text-xl tw-flex tw-items-center tw-gap-3">
          <i className="fas fa-file-invoice-dollar"></i>
          Resumen de cotización
        </h4>
      </div>

      <div className="tw-p-6">
        {errorMsg && (
          <Alert variant="danger">{errorMsg}</Alert>
        )}

        {/* Lista de items */}
        {items.length === 0 ? (
          <div className="tw-text-center tw-py-12 tw-text-slate-400">
            <i className="fas fa-shopping-cart fa-3x tw-mb-3 tw-opacity-30"></i>
            <p className="tw-text-lg">Tu carrito está vacío</p>
            <p className="tw-text-sm">Agrega productos para cotizar</p>
          </div>
        ) : (
          <div className="tw-mb-6 tw-space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.product.id ?? item.product_id ?? idx}
                className="tw-flex tw-items-center tw-justify-between tw-p-4 tw-bg-white tw-rounded-xl tw-gap-4 tw-border tw-border-slate-200"
              >
                <div className="tw-flex-1 tw-min-w-0">
                  <p className="tw-font-semibold tw-text-slate-800 tw-truncate">
                    {item.product?.name ?? item.name}
                  </p>
                </div>
                
                {/* Contador +/- */}
                <div className="tw-flex tw-items-center tw-gap-2 tw-flex-shrink-0">
                  <button
                    onClick={() => onRemoveItem(item.product?.id ?? item.product_id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    className="tw-w-8 tw-h-8 tw-rounded-lg tw-text-white tw-font-bold tw-text-sm tw-transition-all tw-duration-200 tw-flex tw-items-center tw-justify-center tw-border-0"
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    }}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  
                  <div className="tw-w-10 tw-text-center tw-py-1 tw-px-2 tw-bg-white tw-rounded-lg tw-font-bold tw-text-slate-700 tw-text-sm">
                    {item.quantity}
                  </div>
                  
                  <button
                    onClick={() => onAddToCart && onAddToCart(item.product)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    className="tw-w-8 tw-h-8 tw-rounded-lg tw-text-white tw-font-bold tw-text-sm tw-transition-all tw-duration-200 tw-flex tw-items-center tw-justify-center tw-border-0"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)'
                    }}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulario */}
        <Form onSubmit={handleSubmit}>
          <div className="tw-mb-4">
            <label className="tw-block tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-slate-300 tw-rounded-xl focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-transition-all"
              placeholder="Ej: Juan Pérez"
              required
            />
          </div>

          <div className="tw-mb-4">
            <label className="tw-block tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-slate-300 tw-rounded-xl focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-transition-all"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="tw-mb-6">
            <label className="tw-block tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-2">
              Comentarios o requisitos especiales
              <span className="tw-text-slate-400 tw-font-normal tw-ml-1">(Opcional)</span>
            </label>
            <textarea
              value={customerComments}
              onChange={(e) => setCustomerComments(e.target.value)}
              className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-slate-300 tw-rounded-xl focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent tw-transition-all tw-resize-none"
              placeholder="Ej: necesito entrega urgente, colores específicos, cantidades grandes..."
              rows="4"
            />
          </div>

          <button
            type="submit"
            disabled={submissionStatus === 'loading' || items.length === 0}
            onMouseEnter={(e) => {
              if (submissionStatus !== 'loading' && items.length > 0) {
                e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
            }}
            className="tw-w-full tw-text-white tw-py-4 tw-px-6 tw-rounded-xl tw-font-bold tw-text-lg disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-transition-all tw-duration-300 tw-border-0"
            style={{
              background: submissionStatus === 'loading' || items.length === 0 
                ? '#94a3b8' 
                : 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)'
            }}
          >
            {submissionStatus === 'loading' ? (
              <>
                <i className="fas fa-spinner fa-spin tw-mr-2"></i>
                Enviando...
              </>
            ) : (
              <>
                Enviar Solicitud
                <i className="fas fa-paper-plane tw-ml-2"></i>
              </>
            )}
          </button>
        </Form>
      </div>
    </div>
  );
}

export default QuotationForm;
