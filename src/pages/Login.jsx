/* eslint-disable react/no-unescaped-entities */
// pages/Login.js

import { useState,useEffect } from "react";
import { auth, googleProvider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Form, Button, Alert } from "react-bootstrap";
import { FaExclamationCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
//import { toast, ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types';

const Login = ({user}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();



  // Use useEffect to clear the error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(""); // Clear the error message
      }, 3000); // 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer on unmount or error change
    }
  }, [error]); // Run this effect whenever `error` changes

  const validateForm = () => {
    if (!email.trim()) {
      setError("Enter Email");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address.");
      return false;
    }
    if (!password.trim()) {
      setError("Enter valid password");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
     // toast.success("Logged in successfully!");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError("Error logging in. Please try again.");
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
     // toast.success("Signed in with Google successfully!");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      setError("Error signing in with Google. Please try again.");
    }
  };

  return (
    
    <Form className="w-50 mx-auto mt-5">
    {/* {<ToastContainer />} */}
      { user ? (
        <p className="text-center fw-bold">You are already logged in. Redirecting to home...</p>
      ) : (
        <>
      <h3 className="mb-4 text-center text-primary">
     
        Login <small className="text-dark">to your account</small>
      </h3>
      {error && (
              <Alert variant="danger" className="custom-alert text-center">
                <FaExclamationCircle className="me-2" /> {/* Add icon */}
                <span className="d-inline-block">{error}</span> {/* Ensure text wraps */}
              </Alert>
            )}
      <Form.Group controlId="email">
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
      <Button variant="primary" onClick={handleLogin} size="sm" className="w-100 mt-3">
        LOG IN
      </Button>
      <p className="text-center fw-bold mt-1 mb-0">OR</p>
      <Button
        variant="danger"
        onClick={signInWithGoogle}
        className="w-100 mt-1"
        size="sm"
      >
        Sign In with Google
      </Button>
      <p className="text-center mt-2">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      </>
      )}
    </Form>
  
  );
};

Login.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

export default Login;
