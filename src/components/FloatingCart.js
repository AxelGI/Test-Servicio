import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './FloatingCarts.css';

const FloatingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = auth.currentUser;
      if (user) {
        const cartRef = collection(db, 'users', user.uid, 'cart');
        const querySnapshot = await getDocs(cartRef);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCartItems(items);
      }
    };

    fetchCartItems();
  }, []);

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