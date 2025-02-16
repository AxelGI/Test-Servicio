import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Products from './components/Products';
import Carts from './components/Carts';
import FloatingCart from './components/FloatingCart';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);

  // Función para agregar productos al carrito
  const addToCart = (product, talla) => {
    const productWithSize = { ...product, talla };

    setCartItems((prevItems) => {
      const existingProduct = prevItems.find(
        (item) => item.id === productWithSize.id && item.talla === productWithSize.talla
      );

      if (existingProduct) {
        return prevItems;
      }

      return [...prevItems, productWithSize];
    });
  };

  // Función para eliminar productos del carrito
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirigir la ruta "/" al Login */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/productos" element={<Products addToCart={addToCart} />} />
          <Route path="/carrito" element={<Carts cartItems={cartItems} removeFromCart={removeFromCart} />} />
        </Routes>

        {/* Carrito flotante */}
        <FloatingCart cartItems={cartItems} />
      </div>
    </Router>
  );
}

export default App;
