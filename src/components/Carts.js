// src/components/Cart.js
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("STRIPE_SECRET_KEY");

const CheckoutForm = ({ totalPrice, cartItems, setPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentId, setPaymentId] = useState(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    // Verifica que todos los campos estén completos
    if (!name || !phone || !address) {
      setMessage("Por favor, completa todos los campos.");
      return;
    }

    const response = await fetch("http://localhost:4000/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        amount: totalPrice * 100, // Convertir a centavos
        name,
        phone,
        address,
        cartItems, // Enviar los productos con las tallas seleccionadas
      }),
    });

    const { clientSecret, paymentId } = await response.json();
    setPaymentId(paymentId);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (result.error) {
      setMessage("Error en el pago: " + result.error.message);
    } else {
      setMessage("Pago autorizado. Se capturará en 5 minutos si no cancelas.");
      setPaymentSuccess(true); // Marcar como pago exitoso

      // 🔥 Iniciar el proceso automático de captura
      fetch("http://localhost:4000/capture-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
    }
  };

  const handleCancel = async () => {
    if (!paymentId) return;

    await fetch("http://localhost:4000/cancel-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId }),
    });

    setMessage("Pago cancelado exitosamente.");
  };

  return (
    <div>
      <h3>Total a pagar: ${totalPrice.toFixed(2)}</h3>

      {/* Formulario para datos de envío */}
      <div>
        <input
          type="text"
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Celular"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dirección de envío"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <CardElement />
      <button onClick={handlePayment}>Pagar</button>
      {paymentId && <button onClick={handleCancel}>Cancelar Pago</button>}
      {message && <p>{message}</p>}
    </div>
  );
};

const Cart = ({ cartItems, removeFromCart }) => {
    const navigate = useNavigate();
    const [checkout, setCheckout] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
  
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
            <p>Nombre: {cartItems[0].name}</p>
            <p>Celular: {cartItems[0].phone}</p>
            <p>Dirección: {cartItems[0].address}</p>
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
