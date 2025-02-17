import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import Login from './components/Login';
import Register from './components/Register';
import Products from './components/Products';
import Carts from './components/Carts';
import FloatingCart from './components/FloatingCart';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);

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

  const addToCart = async (product) => {
    const user = auth.currentUser;
    if (!user) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }

    const uniqueId = `${product.id}_${product.talla}`;

    const cartRef = collection(db, 'users', user.uid, 'cart');
    const cartItemRef = doc(cartRef, uniqueId);

    await setDoc(cartItemRef, {
      productId: product.id,
      nombre: product.nombre,
      precio: product.precio,
      talla: product.talla,
      imagen: product.imagen,
      email: user.email,
    });

    setCartItems((prevItems) => [
      ...prevItems,
      {
        id: uniqueId,
        productId: product.id,
        nombre: product.nombre,
        precio: product.precio,
        talla: product.talla,
        imagen: product.imagen,
      },
    ]);
  };

  const removeFromCart = async (id) => {
    const user = auth.currentUser;
    if (!user) {
      alert('Debes iniciar sesión para eliminar productos del carrito.');
      return;
    }

    const cartItemRef = doc(db, 'users', user.uid, 'cart', id);
    await deleteDoc(cartItemRef);

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