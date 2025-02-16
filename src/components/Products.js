import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTalla, setSelectedTalla] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsArray);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!selectedTalla[product.id]) {
      setMessage('Por favor, selecciona una talla para agregar al carrito.');
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setMessage('Debes iniciar sesión para agregar productos al carrito.');
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const productWithTalla = { ...product, talla: selectedTalla[product.id] };

    // Llamar a la función addToCart pasada como prop desde App.js
    addToCart(productWithTalla);

    setMessage(`${product.nombre} (${selectedTalla[product.id]}) agregado al carrito!`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleTallaChange = (productId, talla) => {
    setSelectedTalla((prev) => ({
      ...prev,
      [productId]: talla,
    }));
  };

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="product-page">
      <h1>Productos</h1>
      {message && <p className="confirmation-message">{message}</p>}
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-item">
            <img src={product.imagen} alt={product.nombre} />
            <h2>{product.nombre}</h2>
            <p>{product.descripcion}</p>
            <p>Precio: ${product.precio}</p>

            {product.tallas && product.tallas.length > 0 && (
              <div>
                <p><strong>Tallas disponibles:</strong></p>
                <select 
                  value={selectedTalla[product.id] || ''}
                  onChange={(e) => handleTallaChange(product.id, e.target.value)}
                >
                  <option value="">Selecciona una talla</option>
                  {product.tallas.map((talla, index) => (
                    <option key={index} value={talla}>{talla}</option>
                  ))}
                </select>
              </div>
            )}

            <button onClick={() => handleAddToCart(product)}>Agregar al carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;