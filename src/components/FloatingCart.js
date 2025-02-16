// src/components/FloatingCart.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './FloatingCarts.css';

const FloatingCart = ({ cartItems }) => {
  const location = useLocation(); // Obtiene la ubicación actual

  // Verifica si la ruta actual es /productos o /carrito
  const showFloatingCart = location.pathname === '/productos' || location.pathname === '/carrito';

  if (!showFloatingCart) {
    return null; // No renderiza el carrito flotante si no está en las rutas deseadas
  }

  return (
    <div className="floating-cart">
      <Link to="/carrito">
        <button>
          🛒 {cartItems.length}
        </button>
      </Link>
    </div>
  );
};

export default FloatingCart;