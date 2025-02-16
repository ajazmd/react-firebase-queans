// pages/Register.js
import { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Form, Button, Alert } from "react-bootstrap";
import { FaExclamationCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Use useEffect to clear the error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(""); // Clear the error message
      }, 2000); // 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer on unmount or error change
    }
  }, [error]); // Run this effect whenever `error` changes

  const validateForm = () => {
    if (!name.trim()) {
      setError("Enter your name");
      return false;
    }
    if (!email.trim()) {
      setError("Enter your email");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password.trim()) {
      setError("Enter password");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    setError("");
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      navigate("/ask"); // Redirect to ask question page
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email already exists. Use a different email.");
      } else {
        console.error("Error registering user: ", error);
        setError("Error registering user. Please try again.");
      }
    }
  };

  return (
    <Form className="w-50 mx-auto mt-5">
      <h3 className="mb-4 text-center text-primary">
        Register <small className="text-dark">to Unlock Answers!</small>
      </h3>
      {error && (
        <Alert variant="danger" className="custom-alert text-center">
          <FaExclamationCircle className="me-2" /> {/* Add icon */}
          <span className="d-inline-block">{error}</span> {/* Ensure text wraps */}
        </Alert>
      )}
      <Form.Group controlId="name">
        <Form.Label className="fw-semibold">Name</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
      </Form.Group>
      <Form.Group controlId="email" className="mt-2">
        <Form.Label className="fw-semibold">Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
      </Form.Group>
      <Form.Group controlId="password" className="mt-2">
        <Form.Label className="fw-semibold">Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </Form.Group>
      <Button variant="primary" onClick={handleRegister} size="sm" className="w-100 mt-4">
        REGISTER
      </Button>
      <p className="text-center mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </Form>
  );
};

export default Register;
