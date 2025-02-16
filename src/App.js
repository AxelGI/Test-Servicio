import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Products from './components/Products';
import Carts from './components/Carts';
import FloatingCart from './components/FloatingCart';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, talla) => {
    const productWithSize = { ...product, talla }; // Crear un nuevo objeto con la talla seleccionada
  
    setCartItems((prevItems) => {
      // Verificar si ya existe el mismo producto con la misma talla en el carrito
      const existingProduct = prevItems.find(
        (item) => item.id === productWithSize.id && item.talla === productWithSize.talla
      );
  
      if (existingProduct) {
        return prevItems; // No agregar si ya existe el producto con esa talla
      }
  
      return [...prevItems, productWithSize]; // Agregar si no existe
    });
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart); // Actualiza el estado del carrito sin ese producto
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/productos" element={<Products addToCart={addToCart} />} />
          <Route path="/carrito" element={<Carts cartItems={cartItems} removeFromCart={removeFromCart} />} />
        </Routes>

        <FloatingCart cartItems={cartItems} />
      </div>
    </Router>
  );
}

export default App;
