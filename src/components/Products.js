import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTalla, setSelectedTalla] = useState({});
  const [selectedCantidad, setSelectedCantidad] = useState({}); // Estado para la cantidad seleccionada

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

    const cantidad = selectedCantidad[product.id] || 1; // Cantidad seleccionada (por defecto 1)
    const productWithTalla = { ...product, talla: selectedTalla[product.id], cantidad };

    const cartRef = collection(db, 'users', user.uid, 'cart');
    const cartItemRef = doc(cartRef, product.id); // Usamos el ID del producto como ID del documento en el carrito

    const cartItemDoc = await getDoc(cartItemRef);

    if (cartItemDoc.exists()) {
      // Si el producto ya está en el carrito, actualiza la cantidad
      await updateDoc(cartItemRef, {
        cantidad: cartItemDoc.data().cantidad + cantidad,
      });
    } else {
      // Si el producto no está en el carrito, crea un nuevo documento
      await setDoc(cartItemRef, {
        productId: product.id,
        nombre: product.nombre,
        precio: product.precio,
        talla: productWithTalla.talla,
        cantidad: productWithTalla.cantidad,
        imagen: product.imagen,
        email: user.email, // Guardamos el correo del usuario
      });
    }

    setMessage(`${product.nombre} (${selectedTalla[product.id]}) agregado al carrito!`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleTallaChange = (productId, talla) => {
    setSelectedTalla((prev) => ({
      ...prev,
      [productId]: talla,
    }));
  };

  const handleCantidadChange = (productId, cantidad) => {
    setSelectedCantidad((prev) => ({
      ...prev,
      [productId]: cantidad,
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

            <div>
              <p><strong>Cantidad:</strong></p>
              <input
                type="number"
                min="1"
                value={selectedCantidad[product.id] || 1}
                onChange={(e) => handleCantidadChange(product.id, parseInt(e.target.value))}
              />
            </div>

            <button onClick={() => handleAddToCart(product)}>Agregar al carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;