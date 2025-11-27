import React from 'react';
import ProductList from '../components/ProductList';
import QuotationForm from '../components/QuotationForm';

function Home({ items = [], onAddToCart, onRemoveItem, onClearCart }) {
  return (
    <div className="tw-min-h-screen tw-bg-gradient-to-br tw-from-slate-50 tw-via-cyan-50 tw-to-blue-50 tw-py-8">
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4">
        <div className="tw-grid lg:tw-grid-cols-3 tw-gap-8">
          {/* Productos */}
          <div className="lg:tw-col-span-2">
            <ProductList onAddToCart={onAddToCart} items={items} onRemoveItem={onRemoveItem} />
          </div>

          {/* Formulario sticky */}
          <div className="lg:tw-col-span-1">
            <div className="tw-sticky tw-top-24">
              <QuotationForm items={items} onRemoveItem={onRemoveItem} onClearCart={onClearCart} onAddToCart={onAddToCart} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
