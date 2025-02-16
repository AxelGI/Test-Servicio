require("dotenv").config(); // Cargar las variables del archivo .env
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Usar la clave desde las variables de entorno

const app = express();
app.use(cors());
app.use(express.json());

const payments = new Map(); // Guardará los pagos pendientes

// 🟢 1️⃣ Endpoint para crear un Payment Intent (Autorización)
app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
      capture_method: "manual", // No capturar de inmediato
    });

    // Guardar el pago para capturarlo en 5 minutos
    payments.set(paymentIntent.id, setTimeout(async () => {
      try {
        await stripe.paymentIntents.capture(paymentIntent.id);
        console.log(`Pago ${paymentIntent.id} capturado`);
      } catch (error) {
        console.error("Error al capturar:", error);
      }
    }, 5 * 60 * 1000)); // 5 minutos

    res.json({ clientSecret: paymentIntent.client_secret, paymentId: paymentIntent.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🟡 2️⃣ Endpoint para cancelar un pago
app.post("/cancel-payment", async (req, res) => {
  const { paymentId } = req.body;

  try {
    clearTimeout(payments.get(paymentId)); // Evita la captura automática
    await stripe.paymentIntents.cancel(paymentId);
    payments.delete(paymentId);
    res.json({ message: "Pago cancelado exitosamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(4000, () => {
  console.log("Servidor en http://localhost:4000");
});
