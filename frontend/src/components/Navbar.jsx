import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar({ isAuthenticated, isMenuOpen, setIsMenuOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="custom-navbar tw-py-3">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4 lg:tw-px-6">
        <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="navbar-brand tw-inline-block tw-py-1 tw-transition-transform tw-duration-300"
            onMouseEnter={(e) => {
              if (window.innerWidth >= 1024) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.querySelector('img').style.filter = 'brightness(0) invert(1) drop-shadow(0 6px 12px rgba(0,0,0,0.2))';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.querySelector('img').style.filter = 'brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.1))';
            }}
          >
            <img
              src="/2.png"
              alt="Envatex"
              className="navbar-logo"
              style={{ filter: 'brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            />
          </Link>

          {/* Hamburger button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:tw-hidden tw-p-2 tw-rounded-lg tw-border-2 tw-border-white/20 tw-bg-white/5 tw-transition-all tw-duration-300 hover:tw-bg-white/15 hover:tw-border-white/40 hover:tw-scale-105 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-white/30"
            aria-label="Toggle menu"
          >
            <svg className="tw-w-6 tw-h-6 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Menu */}
          <div className={`tw-w-full lg:tw-w-auto lg:tw-flex lg:tw-items-center lg:tw-flex-1 ${isMenuOpen ? 'tw-block' : 'tw-hidden'}`}>
            {!isAuthenticated && (
              <>
                {/* Desktop layout */}
                <div className="tw-hidden lg:tw-flex lg:tw-items-center lg:tw-flex-1">
                  <div className="lg:tw-ml-8">
                    <Link 
                      to="/" 
                      className="navbar-link tw-text-white/90 tw-font-medium tw-px-5 tw-py-2 tw-mx-1 tw-rounded-lg tw-transition-all tw-duration-300 hover:tw-text-white tw-relative tw-inline-block tw-no-underline"
                      style={{textDecoration: 'none'}}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      HOME
                    </Link>
                  </div>
                  
                  <div className="tw-ml-auto tw-flex tw-items-center tw-gap-3">
                    {location.pathname !== '/' && location.pathname !== '/cotizar' && (
                      <Link to="/cotizar">
                        <button className="custom-btn-primary tw-px-5 tw-py-2 tw-rounded-lg tw-font-semibold tw-text-sm tw-text-white tw-border-none tw-cursor-pointer tw-transition-all tw-duration-300 tw-whitespace-nowrap"
                                style={{
                                  background: 'linear-gradient(135deg, #10b981, #06b6d4)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}>
                          Solicitar cotización
                        </button>
                      </Link>
                    )}
                    <Link 
                      to="/admin/login" 
                      className="navbar-link tw-text-white/50 tw-px-3 tw-py-2 tw-rounded-lg tw-transition-all tw-duration-300 hover:tw-text-white tw-relative tw-inline-block"
                      style={{textDecoration: 'none'}}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <i className="fas fa-user-shield tw-text-lg"></i>
                    </Link>
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="lg:tw-hidden tw-w-full tw-mt-4 tw-px-2">
                  <Link 
                    to="/" 
                    onClick={() => setIsMenuOpen(false)}
                    className="tw-flex tw-items-center tw-justify-center tw-text-white/90 tw-px-4 tw-py-4 tw-mx-2 tw-my-1 tw-transition-transform tw-duration-200"
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <i className="fas fa-home tw-text-2xl"></i>
                  </Link>
                  
                  {location.pathname !== '/' && location.pathname !== '/cotizar' && (
                    <Link 
                      to="/cotizar" 
                      onClick={() => setIsMenuOpen(false)} 
                      className="tw-flex tw-items-center tw-justify-center tw-text-white/90 tw-px-4 tw-py-4 tw-mx-2 tw-my-1 tw-transition-transform tw-duration-200"
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <i className="fas fa-clipboard-list tw-text-2xl"></i>
                    </Link>
                  )}
                  
                  <Link 
                    to="/admin/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="tw-flex tw-items-center tw-justify-center tw-text-white/90 tw-px-4 tw-py-4 tw-mx-2 tw-my-1 tw-transition-transform tw-duration-200"
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <i className="fas fa-user-shield tw-text-2xl"></i>
                  </Link>
                </div>
              </>
            )}

            {isAuthenticated && (
              <>
                {/* Desktop admin layout */}
                <div className="tw-hidden lg:tw-flex lg:tw-items-center lg:tw-gap-3 lg:tw-ml-auto">
                  {location.pathname !== '/admin' && (
                    <Link 
                      to="/admin" 
                      className="tw-px-5 tw-py-2 tw-rounded-lg tw-text-white tw-font-semibold tw-text-sm tw-border-none tw-transition-all tw-duration-300 tw-no-underline"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
                    >
                      <i className="fas fa-columns tw-mr-2"></i>
                      Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      localStorage.removeItem('access_token');
                      window.dispatchEvent(new Event('authChanged'));
                      navigate('/admin/login');
                    }}
                    className="tw-px-5 tw-py-2 tw-rounded-lg tw-text-white tw-font-semibold tw-text-sm tw-cursor-pointer tw-transition-all tw-duration-300 tw-border-none"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
                  >
                    <i className="fas fa-sign-out-alt tw-mr-2"></i>
                    Cerrar sesión
                  </button>
                </div>

                {/* Mobile admin layout */}
                <div className="lg:tw-hidden tw-w-full tw-mt-4 tw-px-2">
                  {location.pathname !== '/admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsMenuOpen(false)} 
                      className="tw-block tw-mx-2 tw-my-2 tw-no-underline"
                      style={{textDecoration: 'none'}}
                    >
                      <button 
                        className="tw-w-full tw-px-5 tw-py-3.5 tw-rounded-lg tw-text-white tw-font-semibold tw-text-sm tw-border-none tw-cursor-pointer tw-transition-all tw-duration-200"
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <i className="fas fa-columns tw-mr-2"></i>
                        Panel
                      </button>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      localStorage.removeItem('access_token');
                      window.dispatchEvent(new Event('authChanged'));
                      navigate('/admin/login');
                      setIsMenuOpen(false);
                    }}
                    className="tw-w-full tw-mx-2 tw-my-2 tw-px-5 tw-py-3.5 tw-rounded-lg tw-text-white tw-font-semibold tw-text-sm tw-cursor-pointer tw-transition-all tw-duration-200 tw-border-none"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <i className="fas fa-sign-out-alt tw-mr-2"></i>
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
