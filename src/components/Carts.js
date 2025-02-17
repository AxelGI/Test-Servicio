import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from './CheckOut.js'; 

const stripePromise = loadStripe("STRIPE_SECRET_KEY");

const Cart = ({ cartItems, removeFromCart }) => {
  const [checkout, setCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((total, item) => total + item.precio, 0);

  const handleContinueShopping = () => {
    navigate("/productos");
  };

  const handleCheckout = () => {
    setCheckout(true);
  };

  return (
    <div className="cart">
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <div>
          <p>El carrito está vacío.</p>
          <button onClick={handleContinueShopping}>Seguir Comprando</button>
        </div>
      ) : checkout ? (
        <Elements stripe={stripePromise}>
          <CheckoutForm
            totalPrice={totalPrice}
            cartItems={cartItems}
            setPaymentSuccess={setPaymentSuccess}
          />
        </Elements>
      ) : paymentSuccess ? (
        <div>
          <h3>Ticket de compra</h3>
          <p>Gracias por tu compra. Aquí está el resumen de tu pedido:</p>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                <p>{item.nombre} - {item.talla}</p>
                <p>Precio: ${item.precio}</p>
              </li>
            ))}
          </ul>
          <p>Total: ${totalPrice}</p>
          <button onClick={handleContinueShopping}>Seguir Comprando</button>
        </div>
      ) : (
        <div>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                <h3>{item.nombre}</h3>
                <p>Precio: ${item.precio}</p>
                {item.talla && <p>Talla: {item.talla}</p>}
                <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
          <h3>Total: ${totalPrice}</h3>
          <div className="cart-actions">
            <button onClick={handleContinueShopping}>Seguir Comprando</button>
            <button onClick={handleCheckout}>Pagar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;