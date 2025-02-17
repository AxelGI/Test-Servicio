import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const CheckoutForm = ({ totalPrice, cartItems, setPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    if (!name || !phone || !address) {
      setMessage("Por favor, completa todos los campos.");
      return;
    }

    const response = await fetch("http://localhost:4000/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        amount: totalPrice,
        name,
        phone,
        address,
        cartItems,
      }),
    });

    const { clientSecret, paymentId } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (result.error) {
      setMessage("Error en el pago: " + result.error.message);
    } else {
      setMessage("Pago autorizado. Se capturará en 5 minutos si no cancelas.");
      setPaymentSuccess(true);
    }
  };

  return (
    <div>
      <h3>Total a pagar: ${totalPrice.toFixed(2)}</h3>

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
      {message && <p>{message}</p>}
    </div>
  );
};

export default CheckoutForm;