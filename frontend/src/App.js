// App.js
// Main component of the Envatex application.

// 1. Import React.
// 2. Import the main CSS file './App.css'.
// 3. Import the ProductList component from './components/ProductList'.
// 4. Import a simple Navbar from 'react-bootstrap' to give the page a header.

import React, { useState, useCallback } from 'react';
import './App.css';
import axios from 'axios';

// Routing
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

// Pages (to be created)
import Landing from './pages/Landing';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

// Components
import Navbar from './components/Navbar';

// App.js
// Main component that sets up routing for the application.

function App() {
  // Global cart state
  const [quotationItems, setQuotationItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('access_token'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Configurar interceptor de axios para manejar tokens expirados
  React.useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Si recibimos un 401 (no autorizado) o 422 (token inválido/expirado), cerrar sesión
        if (error.response && (error.response.status === 401 || error.response.status === 422)) {
          // Verificar si es un error de JWT específicamente
          const errorMsg = error.response.data?.msg || '';
          const isJWTError = errorMsg.includes('Token') || 
                           errorMsg.includes('token') || 
                           errorMsg.includes('Signature') ||
                           error.response.status === 422;
          
          if (isJWTError || error.response.status === 401) {
            // Limpiar token y redirigir al login
            localStorage.removeItem('access_token');
            delete axios.defaults.headers.common['Authorization'];
            setIsAuthenticated(false);
            window.dispatchEvent(new Event('authChanged'));
            
            // Si no estamos ya en login, redirigir
            if (!window.location.pathname.includes('/admin/login')) {
              navigate('/admin/login');
            }
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup: remover interceptor cuando el componente se desmonte
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  React.useEffect(() => {
    const onAuth = () => setIsAuthenticated(!!localStorage.getItem('access_token'));
    window.addEventListener('storage', onAuth);
    window.addEventListener('authChanged', onAuth);
    return () => {
      window.removeEventListener('storage', onAuth);
      window.removeEventListener('authChanged', onAuth);
    };
  }, []);

  const handleAddToCart = useCallback((product) => {
    setQuotationItems((prev) => {
      const existing = prev.find((it) => it.product.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.product.id === product.id ? { ...it, quantity: it.quantity + 1 } : it
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const handleRemoveFromCart = useCallback((productId) => {
    setQuotationItems((prev) =>
      prev
        .map((it) => {
          if (it.product.id === productId) {
            if ((it.quantity ?? 1) > 1) return { ...it, quantity: it.quantity - 1 };
            return null;
          }
          return it;
        })
        .filter(Boolean)
    );
  }, []);

  // NUEVO: función para limpiar el carrito
  const handleClearCart = useCallback(() => {
    setQuotationItems([]);
  }, []);

  return (
      <div className="App">
        <Navbar 
          isAuthenticated={isAuthenticated}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/cotizar"
              element={
                <Home
                  items={quotationItems}
                  onAddToCart={handleAddToCart}
                  onRemoveItem={handleRemoveFromCart}
                  onClearCart={handleClearCart}
                />
              }
            />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;

