import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './FloatingCarts.css';

const FloatingCart = ({ cartItems }) => {
  const location = useLocation();

  // Calcular la suma total de las cantidades
  const totalQuantity = cartItems.reduce((total, item) => total + (item.cantidad || 1), 0);

  // Verifica si la ruta actual es /productos o /carrito
  const showFloatingCart = location.pathname === '/productos' || location.pathname === '/carrito';

  if (!showFloatingCart) {
    return null; // No renderiza el carrito flotante si no está en las rutas deseadas
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