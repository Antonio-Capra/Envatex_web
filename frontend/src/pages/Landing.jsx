import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: 'fa-tshirt',
      title: 'Productos personalizados',
      desc: 'Soluciones textiles adaptadas a las necesidades de tu empresa, con calidad garantizada.',
      color: '#10b981' // Verde esmeralda
    },
    {
      icon: 'fa-shipping-fast',
      title: 'Envíos rápidos',
      desc: 'Logística eficiente para que recibas tus productos en tiempo récord, en todo el país.',
      color: '#06b6d4' // Cyan
    },
    {
      icon: 'fa-user-shield',
      title: 'Atención especializada',
      desc: 'Nuestro equipo te acompaña en cada paso, desde la cotización hasta la entrega final.',
      color: '#3b82f6' // Azul
    },
  ];

  return (
    <div className="tw-min-h-screen tw-bg-gradient-to-br tw-from-slate-50 tw-via-green-50 tw-to-emerald-50">
      {/* HERO ELEGANTE */}
      <div className="tw-max-w-[85rem] tw-mx-auto tw-px-4 tw-pt-12 tw-pb-16">
        <div className="tw-relative tw-bg-white tw-rounded-[2rem] tw-overflow-hidden tw-border tw-border-black/5" 
             style={{boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)'}}>
          
          <div className="tw-px-8 tw-py-12 md:tw-py-16 tw-text-center">
            {/* Logo más compacto */}
            <div className="tw-mb-6 tw-flex tw-justify-center">
              <img 
                src="/2.png" 
                alt="Logo Envatex" 
                className="tw-h-32 md:tw-h-36 tw-w-auto"
                style={{filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'}}
              />
            </div>

            {/* Título elegante */}
            <h1 className="tw-font-bold tw-mb-4 tw-text-slate-600 tw-leading-tight" 
                style={{
                  fontSize: 'clamp(1.75rem, 5vw, 3rem)',
                  letterSpacing: '-0.02em'
                }}>
              Soluciones textiles profesionales
            </h1>

            {/* Descripción refinada */}
            <p className="tw-text-slate-500 tw-mb-8 tw-max-w-[45rem] tw-mx-auto tw-leading-relaxed tw-font-normal"
               style={{fontSize: 'clamp(1rem, 2vw, 1.25rem)'}}>
              Impulsa tu empresa con productos textiles de alta calidad, atención personalizada y entregas rápidas en todo el país.
            </p>

            {/* Botón elegante */}
            <button
              onClick={() => navigate('/cotizar')}
              className="tw-text-white tw-px-14 tw-py-5 tw-rounded-2xl tw-text-lg tw-font-semibold tw-border-none tw-cursor-pointer tw-transition-all tw-duration-300 tw-tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
              }}
            >
              Solicitar cotización
              <i className="fas fa-arrow-right tw-ml-3"></i>
            </button>
          </div>
        </div>
      </div>

      {/* FEATURES con colores del logo */}
      <div className="tw-max-w-[80rem] tw-mx-auto tw-px-4 tw-pb-20">
        <div className="tw-grid tw-gap-8" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'}}>
          {features.map((f, idx) => (
            <div
              key={idx}
              className="tw-bg-white tw-rounded-2xl tw-p-8 tw-border tw-border-slate-100 tw-transition-all tw-duration-300 tw-cursor-pointer hover:tw--translate-y-2"
              style={{boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-0.5rem)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div className="tw-flex tw-justify-center tw-mb-6">
                <div className="tw-w-24 tw-h-24 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-text-white tw-transition-transform tw-duration-300 hover:tw-scale-110"
                     style={{
                       background: f.color,
                       boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                     }}>
                  <i className={`fas ${f.icon} tw-text-4xl`}></i>
                </div>
              </div>
              <h3 className="tw-text-xl tw-font-bold tw-text-slate-800 tw-mb-3 tw-text-center">
                {f.title}
              </h3>
              <p className="tw-text-slate-500 tw-text-center tw-leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Llamado a la acción mejorado */}
      <div className="tw-max-w-[70rem] tw-mx-auto tw-px-4 tw-pb-24">
        <div className="tw-relative tw-rounded-[2rem] tw-px-8 tw-py-16 tw-text-center tw-overflow-hidden"
             style={{
               background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)',
               boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)'
             }}>
          {/* Patrón decorativo */}
          <div className="tw-absolute tw-inset-0 tw-pointer-events-none" 
               style={{
                 backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)'
               }}>
          </div>

          <div className="tw-relative tw-z-10">
            <div className="tw-mb-6">
              <i className="fas fa-rocket tw-text-5xl tw-text-white tw-opacity-90"></i>
            </div>
            
            <h2 className="tw-font-extrabold tw-text-white tw-mb-4"
                style={{
                  fontSize: 'clamp(1.875rem, 4vw, 3rem)',
                  textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
              ¿Listo para llevar tu empresa <br /> al siguiente nivel?
            </h2>
            
            <p className="tw-text-white/95 tw-mb-10 tw-max-w-[40rem] tw-mx-auto tw-font-normal"
               style={{fontSize: 'clamp(1.125rem, 2vw, 1.375rem)'}}>
              Contacta con nosotros y descubre cómo podemos ayudarte con soluciones textiles de calidad profesional
            </p>
            
            <button
              onClick={() => navigate('/cotizar')}
              className="tw-bg-white tw-text-blue-800 tw-px-14 tw-py-5 tw-rounded-2xl tw-text-lg tw-font-bold tw-border-none tw-cursor-pointer tw-transition-all tw-duration-300"
              style={{boxShadow: '0 10px 30px rgba(0,0,0,0.15)'}}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
              }}
            >
              Comenzar ahora
              <i className="fas fa-arrow-right tw-ml-3"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


