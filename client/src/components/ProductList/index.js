import React from 'react';
import { toMoneyFormat } from '../../utils/helpers';

const ProductList = ({ products, title }) => {
  if (!products.length) {
    return <h3>No Products Found</h3>;
  }

  return (
    <div>
      <h3>{title}</h3>
      {products &&
        products.map(product => (
          <div key={product.id} className="card">
            <div className="card-header">
              {product.name}
              {toMoneyFormat(product.price)}
            </div>
            <div className="card-body">
              <p>{product.description}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProductList;