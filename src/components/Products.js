// src/components/Products.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // Estado para el mensaje de confirmación

  const [selectedTalla, setSelectedTalla] = useState({}); // Estado para almacenar la talla seleccionada por producto

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(productsArray);  // Verifica los productos
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
  

  const handleAddToCart = (product) => {
    if (!selectedTalla[product.id]) {
      setMessage('Por favor, selecciona una talla para agregar al carrito.');
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const productWithTalla = { ...product, talla: selectedTalla[product.id] };
    addToCart(productWithTalla); // Envía el producto con la talla seleccionada
    setMessage(`${product.nombre} (${selectedTalla[product.id]}) agregado al carrito!`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleTallaChange = (productId, talla) => {
    setSelectedTalla((prev) => ({
      ...prev,
      [productId]: talla, // Guardamos la talla seleccionada por producto
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
      {message && <p className="confirmation-message">{message}</p>} {/* Mensaje de confirmación */}
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-item">
            <img src={product.imagen} alt={product.nombre} />
            <h2>{product.nombre}</h2>
            <p>{product.descripcion}</p>
            <p>Precio: ${product.precio}</p>

            {/* Mostrar el selector de tallas si existen */}
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
