import React, { useState, useEffect } from 'react';

function ProductModal({ show, handleClose, handleSubmit, productData }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (productData) {
      setFormData(productData);
      setImageFile(null);
    } else {
      setFormData({ name: '', sku: '', description: '', image_url: '' });
      setImageFile(null);
    }
  }, [productData]);

  useEffect(() => {
    if (show === false) {
      setFormData({ name: '', sku: '', description: '', image_url: '' });
      setImageFile(null);
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setImageFile(file || null);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('name', formData.name || '');
    fd.append('sku', formData.sku || '');
    fd.append('description', formData.description || '');
    if (imageFile) {
      fd.append('image', imageFile);
    } else if (formData.image_url) {
      fd.append('image_url', formData.image_url);
    }

    handleSubmit(fd);
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-z-50 tw-flex tw-items-center tw-justify-center tw-p-4"
        onClick={handleClose}
      >
        {/* Modal */}
        <div 
          className="tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-w-full tw-max-w-2xl tw-max-h-[90vh] tw-overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            className="tw-px-6 tw-py-5 tw-flex tw-items-center tw-justify-between"
            style={{
              background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
            }}
          >
            <h3 className="tw-text-white tw-font-bold tw-text-2xl tw-flex tw-items-center tw-gap-3">
              <i className={`fas ${productData ? 'fa-edit' : 'fa-plus-circle'}`}></i>
              {productData ? 'Editar producto' : 'Crear producto'}
            </h3>
            <button
              onClick={handleClose}
              className="tw-text-white hover:tw-text-slate-200 tw-transition-colors tw-border-0 tw-bg-transparent tw-text-2xl"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Body */}
          <div className="tw-p-6 tw-overflow-y-auto tw-max-h-[calc(90vh-140px)]">
            <form onSubmit={onSubmit} className="tw-space-y-5">
              {/* Nombre */}
              <div>
                <label className="tw-block tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-2">
                  <i className="fas fa-tag tw-mr-2 tw-text-slate-500"></i>
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-slate-300 tw-rounded-xl focus:tw-ring-2 focus:tw-ring-emerald-500 focus:tw-border-transparent tw-transition-all"
                  placeholder="Ej: Envase PET 500cc"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="tw-block tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-2">
                  <i className="fas fa-barcode tw-mr-2 tw-text-slate-500"></i>
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-slate-300 tw-rounded-xl focus:tw-ring-2 focus:tw-ring-emerald-500 focus:tw-border-transparent tw-transition-all"
                  placeholder="Ej: ENV-PET-500"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="tw-block tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-2">
                  <i className="fas fa-align-left tw-mr-2 tw-text-slate-500"></i>
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-slate-300 tw-rounded-xl focus:tw-ring-2 focus:tw-ring-emerald-500 focus:tw-border-transparent tw-transition-all tw-resize-none"
                  placeholder="Describe las características del producto..."
                />
              </div>

              {/* Imagen */}
              <div>
                <label className="tw-block tw-text-sm tw-font-semibold tw-text-slate-700 tw-mb-2">
                  <i className="fas fa-image tw-mr-2 tw-text-slate-500"></i>
                  Imagen del producto
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-slate-300 tw-rounded-xl focus:tw-ring-2 focus:tw-ring-emerald-500 focus:tw-border-transparent tw-transition-all tw-text-sm tw-text-slate-600 file:tw-mr-4 file:tw-py-2 file:tw-px-4 file:tw-rounded-lg file:tw-border-0 file:tw-text-sm file:tw-font-semibold file:tw-bg-slate-100 file:tw-text-slate-700 hover:file:tw-bg-slate-200 file:tw-cursor-pointer"
                />
                {imageFile && (
                  <p className="tw-text-sm tw-text-slate-500 tw-mt-2">
                    <i className="fas fa-check-circle tw-text-green-500 tw-mr-1"></i>
                    Archivo seleccionado: {imageFile.name}
                  </p>
                )}
              </div>

              {/* Botones */}
              <div className="tw-flex tw-gap-3 tw-justify-end tw-pt-4 tw-border-t tw-border-slate-200">
                <button
                  type="button"
                  onClick={handleClose}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  className="tw-px-6 tw-py-3 tw-rounded-xl tw-font-semibold tw-transition-all tw-duration-200 tw-border-0 tw-bg-slate-200 tw-text-slate-700 hover:tw-bg-slate-300"
                >
                  <i className="fas fa-times tw-mr-2"></i>
                  Cancelar
                </button>
                <button
                  type="submit"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  }}
                  className="tw-px-6 tw-py-3 tw-rounded-xl tw-text-white tw-font-bold tw-transition-all tw-duration-300 tw-border-0"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)'
                  }}
                >
                  <i className={`fas ${productData ? 'fa-save' : 'fa-plus'} tw-mr-2`}></i>
                  {productData ? 'Guardar cambios' : 'Crear producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductModal;