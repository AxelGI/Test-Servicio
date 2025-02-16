import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario logueado:", userCredential.user);
      window.location.href = "/productos"; // Redirigir después del login
    } catch (error) {
      // Manejo de errores
      if (error.code === 'auth/user-not-found') {
        setError("No hay ningún usuario registrado con este correo.");
      } else if (error.code === 'auth/wrong-password') {
        setError("La contraseña es incorrecta.");
      } else {
        setError("Error al iniciar sesión. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>¿No tienes una cuenta? <a href="/registro">Regístrate</a></p>
    </div>
  );
};

export default Login;