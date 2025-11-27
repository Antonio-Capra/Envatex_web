import React, { useState, useEffect } from 'react';
import AdminQuotations from '../components/admin/AdminQuotations';
import AdminProducts from '../components/admin/AdminProducts';

function Admin() {
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
  const [activeTab, setActiveTab] = useState('quotations');

  useEffect(() => {
    const onAuth = () => setToken(localStorage.getItem('access_token') || null);
    window.addEventListener('authChanged', onAuth);
    window.addEventListener('storage', onAuth);
    return () => {
      window.removeEventListener('authChanged', onAuth);
      window.removeEventListener('storage', onAuth);
    };
  }, []);

  if (!token) {
    return null;
  }

  return (
    <div className="tw-min-h-screen tw-bg-gradient-to-br tw-from-slate-50 tw-via-cyan-50 tw-to-blue-50 tw-py-8">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4">
        {/* Header */}
        <div 
          className="tw-mb-8 tw-p-6 tw-rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
          }}
        >
          <h2 className="tw-text-white tw-font-bold tw-text-3xl tw-flex tw-items-center tw-gap-3">
            <i className="fas fa-tools"></i>
            Panel de Administración
          </h2>
        </div>

        {/* Tabs */}
        <div className="tw-mb-6">
          <div className="tw-flex tw-gap-2 tw-bg-white tw-p-2 tw-rounded-xl tw-shadow-md">
            <button
              onClick={() => setActiveTab('quotations')}
              className={`tw-flex-1 tw-py-3 tw-px-6 tw-rounded-lg tw-font-semibold tw-transition-all tw-duration-300 tw-border-0 ${
                activeTab === 'quotations' 
                  ? 'tw-text-white' 
                  : 'tw-text-slate-600 hover:tw-bg-slate-100'
              }`}
              style={activeTab === 'quotations' ? {
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)'
              } : {}}
            >
              <i className="fas fa-file-invoice tw-mr-2"></i>
              Cotizaciones
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`tw-flex-1 tw-py-3 tw-px-6 tw-rounded-lg tw-font-semibold tw-transition-all tw-duration-300 tw-border-0 ${
                activeTab === 'products' 
                  ? 'tw-text-white' 
                  : 'tw-text-slate-600 hover:tw-bg-slate-100'
              }`}
              style={activeTab === 'products' ? {
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)'
              } : {}}
            >
              <i className="fas fa-box tw-mr-2"></i>
              Productos
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'quotations' && <AdminQuotations />}
          {activeTab === 'products' && <AdminProducts />}
        </div>
      </div>
    </div>
  );
}

export default Admin;
