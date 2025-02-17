import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './FloatingCarts.css';

const FloatingCart = ({ cartItems }) => {
  const location = useLocation();

  const totalQuantity = cartItems.reduce((total, item) => total + (item.cantidad || 1), 0);

  const showFloatingCart = location.pathname === '/productos' || location.pathname === '/carrito';

  if (!showFloatingCart) {
    return null; 
  }

  return (
    <div className="floating-cart">
      <Link to="/carrito">
        <button>
          🛒 {totalQuantity}
        </button>
      </Link>
    </div>
  );
};

export default FloatingCart;