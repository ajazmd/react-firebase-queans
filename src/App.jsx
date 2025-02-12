// App.js
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Home from './pages/Home';
import AskQuestion from './pages/AskQuestion';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  return (
  <Router>
    <div className="d-flex flex-column min-vh-100">
    <Navigation user={user}/>
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<Home user={user}/>} />
        <Route path="/ask" element={<AskQuestion />} />
        <Route path="/login" element={<Login user={user}/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Container>
    <Footer/>
    </div>
  </Router>
  );
};

export default App;