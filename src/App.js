import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';

// components
import AppNavbar from './components/AppNavbar';
import Loading from './components/Loading';

// pages
import Error from './pages/Error';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductView from './pages/ProductView';
import AddProduct from './pages/AddProduct';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';



function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });
  const [isLoading, setIsLoading] = useState(true);

  function unsetUser() {
    localStorage.clear();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      fetch('http://localhost:4000/users/details', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.error === "User not found") {
          setUser({ id: null, isAdmin: null });
        } 
        else if (data.auth === "Failed. No Token") {
          setUser({ id: null, isAdmin: null });
        } 
        else if (data._id) {
          setUser({
            id: data._id,
            isAdmin: data.isAdmin
          });
        }
        else {
          console.error("Unexpected response:", data);
          setUser({ id: null, isAdmin: null });
        }
      })
      .catch(err => {
        console.error("Request failed:", err);
        setUser({ id: null, isAdmin: null });
      })
      .finally(() => {
        setIsLoading(false);
      });
    } else {
      setUser({ id: null, isAdmin: null });
      setIsLoading(false);
    }
  }, []);


  if (isLoading) {
    return <Loading />; 
  }

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container fluid className="p-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Error />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<ProductView />} />
            <Route path="/addProduct" element={<AddProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/myOrders" element={<MyOrders />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  )
}

export default App;