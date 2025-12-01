import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const API_BASE = process.env.REACT_APP_API_URL || 'https://didactic-space-fiesta-g4r6x4549q9xfpvq5-5000.app.github.dev';
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { username, password });
      const token = res.data.access_token;
      localStorage.setItem('access_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // notify other parts of the app
      try { window.dispatchEvent(new Event('authChanged')); } catch (e) {}
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Error de autenticación');
    }
  };

  return (
    <div className="tw-min-h-screen tw-bg-gradient-to-br tw-from-slate-50 tw-via-cyan-50 tw-to-blue-50 tw-flex tw-items-center tw-justify-center tw-px-4 tw-py-12">
      <div className="tw-w-full tw-max-w-md">
        {/* Logo o título superior */}
        <div className="tw-text-center tw-mb-8">
          <div className="tw-inline-flex tw-items-center tw-justify-center tw-w-16 tw-h-16 tw-rounded-full tw-shadow-lg tw-mb-4"
               style={{background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)'}}>
            <i className="fas fa-user-shield tw-text-2xl tw-text-white"></i>
          </div>
          <h2 className="tw-text-3xl tw-font-bold tw-text-slate-700 tw-tracking-tight">
            Panel de administración
          </h2>
          <p className="tw-text-slate-500 tw-mt-2">Ingresa tus credenciales para continuar</p>
        </div>

        {/* Card de login */}
        <div className="tw-bg-white tw-rounded-2xl tw-shadow-xl tw-overflow-hidden tw-border tw-border-slate-100">
          {/* Header con gradiente */}
          <div className="tw-px-8 tw-py-6"
               style={{background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)'}}>
            <h3 className="tw-text-xl tw-font-semibold tw-text-white tw-tracking-wide">
              Acceso seguro
            </h3>
          </div>

          {/* Body del formulario */}
          <div className="tw-px-8 tw-py-8">
            {/* Error alert */}
            {error && (
              <div className="tw-mb-6 tw-px-4 tw-py-3 tw-rounded-lg tw-bg-red-50 tw-border tw-border-red-200 tw-flex tw-items-start tw-gap-3">
                <i className="fas fa-exclamation-circle tw-text-red-500 tw-mt-0.5"></i>
                <p className="tw-text-red-700 tw-text-sm tw-font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="tw-space-y-6">
              {/* Campo Usuario */}
              <div>
                <label htmlFor="username" className="tw-block tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-2">
                  <i className="fas fa-user tw-mr-2 tw-text-emerald-500"></i>
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="tw-w-full tw-px-4 tw-py-3 tw-rounded-lg tw-border tw-border-slate-300 tw-bg-white tw-text-slate-900 tw-placeholder-slate-400 tw-transition-all tw-duration-200 focus:tw-outline-none focus:tw-border-transparent"
                  style={{boxShadow: 'none'}}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.3)'}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                  placeholder="Ingresa tu usuario"
                  autoFocus
                  required
                />
              </div>

              {/* Campo Contraseña */}
              <div>
                <label htmlFor="password" className="tw-block tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-2">
                  <i className="fas fa-lock tw-mr-2 tw-text-cyan-500"></i>
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="tw-w-full tw-px-4 tw-py-3 tw-rounded-lg tw-border tw-border-slate-300 tw-bg-white tw-text-slate-900 tw-placeholder-slate-400 tw-transition-all tw-duration-200 focus:tw-outline-none focus:tw-border-transparent"
                  style={{boxShadow: 'none'}}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(6, 182, 212, 0.3)'}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>

              {/* Botón de submit */}
              <button
                type="submit"
                className="tw-w-full tw-px-6 tw-py-3.5 tw-rounded-lg tw-text-white tw-font-semibold tw-text-base tw-border-none tw-cursor-pointer tw-transition-all tw-duration-300 tw-shadow-lg hover:tw-shadow-xl hover:tw--translate-y-0.5 hover:tw-scale-105 focus:tw-outline-none focus:tw-ring-offset-2"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                Iniciar sesión
                <i className="fas fa-sign-in-alt tw-ml-2"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="tw-text-center tw-mt-6">
          <p className="tw-text-sm tw-text-slate-500">
            <i className="fas fa-shield-alt tw-mr-1"></i>
            Acceso restringido solo para administradores
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
