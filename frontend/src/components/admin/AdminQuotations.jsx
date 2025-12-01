import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

function AdminQuotations() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseTexts, setResponseTexts] = useState({});
  const [submitStatus, setSubmitStatus] = useState({});
  const [openQuotations, setOpenQuotations] = useState({ 0: true }); // Estado para controlar qué cotizaciones están abiertas
  const API_BASE = process.env.REACT_APP_API_URL || 'https://didactic-space-fiesta-g4r6x4549q9xfpvq5-5000.app.github.dev';

  const fetchQuotations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No se encontró un token de autenticación.');
        setLoading(false);
        return;
      }
      const res = await axios.get(`${API_BASE}/api/quotations`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setQuotations(res.data || []);
    } catch (err) {
      setError('No se pudieron cargar las cotizaciones.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  const handleDeleteQuotation = async (id) => {
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
          await axios.delete(`${API_BASE}/api/quotations/${id}`, {
            headers: { Authorization: 'Bearer ' + token }
          });
          setQuotations(prev => prev.filter(q => q.id !== id));
          Swal.fire('Borrado!', 'La cotización ha sido eliminada.', 'success');
        } catch (err) {
          Swal.fire('Error', 'No se pudo eliminar la cotización.', 'error');
        }
      }
    });
  };

  const handleResponseChange = (id, text) => {
    setResponseTexts(prev => ({ ...prev, [id]: text }));
    setSubmitStatus(prev => ({ ...prev, [id]: null }));
  };

  const handleSendResponse = async (id) => {
    const text = (responseTexts[id] || '').trim();
    console.log('📤 Sending response for quotation', id, 'Text:', text);
    
    if (!text) {
      setSubmitStatus(prev => ({ ...prev, [id]: { error: 'La respuesta no puede estar vacía.' } }));
      return;
    }

    setSubmitStatus(prev => ({ ...prev, [id]: { loading: true } }));
    try {
      const token = localStorage.getItem('access_token');
      console.log('🔑 Token:', token ? 'Found' : 'Missing');
      
      const res = await axios.patch(`${API_BASE}/api/quotations/${id}`, { admin_response: text }, {
        headers: { Authorization: 'Bearer ' + token }
      });
      
      console.log('✅ Response sent successfully:', res.data);
      
      const updated = res.data?.quotation;
      if (updated) {
        setQuotations(prev => prev.map(q => (q.id === updated.id ? updated : q)));
        setSubmitStatus(prev => ({ ...prev, [id]: { success: 'Respuesta enviada.' } }));
      }
    } catch (err) {
      console.error('❌ Error sending response:', err);
      setSubmitStatus(prev => ({ ...prev, [id]: { error: 'Error al enviar la respuesta.' } }));
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
          {(!quotations || quotations.length === 0) ? (
            <div className="tw-text-center tw-py-12 tw-text-slate-400">
              <i className="fas fa-file-invoice fa-3x tw-mb-4 tw-opacity-50"></i>
              <p className="tw-text-lg">No hay cotizaciones para mostrar.</p>
            </div>
          ) : (
            <div className="tw-space-y-4">
              {quotations.map((quotation, idx) => {
                const isOpen = openQuotations[quotation.id ?? idx] ?? false;
                
                return (
                  <div key={quotation.id ?? idx} className="tw-border tw-border-slate-200 tw-rounded-xl tw-overflow-hidden">
                    {/* Header */}
                    <div className="tw-w-full tw-px-6 tw-py-4 tw-bg-slate-50 tw-flex tw-items-center tw-justify-between">
                      <button
                        onClick={() => setOpenQuotations(prev => ({ ...prev, [quotation.id ?? idx]: !isOpen }))}
                        className="tw-flex tw-items-center tw-gap-3 tw-flex-1 tw-border-0 tw-bg-transparent tw-text-left hover:tw-opacity-80 tw-transition-opacity"
                      >
                        {quotation.admin_response || quotation.status === 'Responded' ? (
                          <i className="fas fa-circle-check tw-text-green-500"></i>
                        ) : quotation.status === 'Pending' ? (
                          <i className="fas fa-circle tw-text-slate-400"></i>
                        ) : (
                          <i className="fas fa-square-xmark tw-text-red-500"></i>
                        )}
                        <span className="tw-font-bold tw-text-slate-700">
                          {`Cotización #${quotation.id ?? idx} - ${quotation.customer_name ?? 'Sin nombre'}`}
                        </span>
                      </button>
                      
                      <div className="tw-flex tw-items-center tw-gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuotation(quotation.id);
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          className="tw-w-8 tw-h-8 tw-rounded-lg tw-text-white tw-flex tw-items-center tw-justify-center tw-transition-all tw-duration-200 tw-border-0"
                          style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                          }}
                          title="Eliminar"
                        >
                          <i className="fas fa-trash-alt tw-text-sm"></i>
                        </button>
                        
                        <button
                          onClick={() => setOpenQuotations(prev => ({ ...prev, [quotation.id ?? idx]: !isOpen }))}
                          className="tw-border-0 tw-bg-transparent tw-text-slate-400 hover:tw-text-slate-600 tw-transition-colors"
                        >
                          <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
                        </button>
                      </div>
                    </div>

                    {/* Body */}
                    {isOpen && (
                      <div className="tw-p-6 tw-bg-white">
                        <div className="tw-mb-6 tw-space-y-2">
                          <p className="tw-text-slate-600">
                            <span className="tw-font-semibold tw-text-slate-700">Email:</span> {quotation.customer_email ?? '—'}
                          </p>
                          <p className="tw-text-slate-600">
                            <span className="tw-font-semibold tw-text-slate-700">Estado:</span>{' '}
                            <span className={`tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-semibold ${
                              quotation.status === 'Responded' 
                                ? 'tw-bg-green-100 tw-text-green-700' 
                                : 'tw-bg-slate-100 tw-text-slate-700'
                            }`}>
                              {quotation.status ?? '—'}
                            </span>
                          </p>
                          {quotation.customer_comments && (
                            <div className="tw-mt-4 tw-p-4 tw-bg-blue-50 tw-rounded-lg tw-border tw-border-blue-200">
                              <p className="tw-font-semibold tw-text-slate-700 tw-mb-2 tw-flex tw-items-center tw-gap-2">
                                <i className="fas fa-comment tw-text-blue-500"></i>
                                Comentarios del cliente:
                              </p>
                              <p className="tw-text-slate-600 tw-italic">{quotation.customer_comments}</p>
                            </div>
                          )}
                        </div>

                        {/* Items */}
                        <div className="tw-mb-6">
                          <h5 className="tw-font-bold tw-text-slate-700 tw-mb-3 tw-flex tw-items-center tw-gap-2">
                            <i className="fas fa-box tw-text-slate-500"></i>
                            Items
                          </h5>
                          <div className="tw-space-y-2">
                            {(quotation.items || []).map((it, i) => (
                              <div 
                                key={i} 
                                className="tw-flex tw-justify-between tw-items-center tw-p-3 tw-bg-white tw-rounded-lg tw-border tw-border-slate-200"
                              >
                                <span className="tw-text-slate-700">
                                  {it.product?.name ?? it.name ?? `Producto ${it.product_id ?? i}`}
                                </span>
                                <span className="tw-font-bold tw-text-slate-600 tw-px-3 tw-py-1 tw-rounded-lg tw-text-sm tw-bg-slate-50">
                                  Cantidad: {it.quantity ?? 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Response Form */}
                        <div>
                          <label className="tw-block tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-2">
                            <i className="fas fa-reply tw-mr-2 tw-text-slate-500"></i>
                            Respuesta del administrador
                          </label>
                          <textarea
                            rows={3}
                            value={responseTexts[quotation.id] || ''}
                            onChange={(e) => handleResponseChange(quotation.id, e.target.value)}
                            className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-slate-300 tw-rounded-xl focus:tw-ring-2 focus:tw-ring-emerald-500 focus:tw-border-transparent tw-transition-all tw-mb-3"
                            placeholder="Escribe tu respuesta aquí..."
                          />
                          
                          {submitStatus[quotation.id]?.error && (
                            <div className="tw-bg-red-50 tw-border tw-border-red-200 tw-text-red-700 tw-px-4 tw-py-2 tw-rounded-lg tw-mb-3 tw-text-sm">
                              <i className="fas fa-exclamation-circle tw-mr-2"></i>
                              {submitStatus[quotation.id].error}
                            </div>
                          )}
                          
                          {submitStatus[quotation.id]?.success && (
                            <div className="tw-bg-green-50 tw-border tw-border-green-200 tw-text-green-700 tw-px-4 tw-py-2 tw-rounded-lg tw-mb-3 tw-text-sm">
                              <i className="fas fa-check-circle tw-mr-2"></i>
                              {submitStatus[quotation.id].success}
                            </div>
                          )}
                          
                          <div className="tw-flex tw-justify-end">
                            <button
                              onClick={() => handleSendResponse(quotation.id)}
                              disabled={submitStatus[quotation.id]?.loading}
                              onMouseEnter={(e) => {
                                if (!submitStatus[quotation.id]?.loading) {
                                  e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                              }}
                              className="tw-px-6 tw-py-3 tw-rounded-xl tw-text-white tw-font-bold tw-transition-all tw-duration-300 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-border-0"
                              style={{
                                background: submitStatus[quotation.id]?.loading 
                                  ? '#94a3b8' 
                                  : 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)'
                              }}
                            >
                              <i className="fas fa-paper-plane tw-mr-2"></i>
                              Enviar respuesta
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminQuotations;