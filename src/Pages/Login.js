import React, { useState } from "react";
import { loginUser } from "../authHelper";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Login</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "2rem",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "8px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  input: {
    padding: "10px",
    fontSize: "16px"
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#DF8EC1",
    color: "#fff",
    border: "none"
  },
  error: {
    color: "red"
  }
};

export default Login;