import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AboutUs from './pages/AboutUs'
import Login from './pages/Login'

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setInputValue(inputValue)
    }, 500);

    return () => clearTimeout(timer)
  }, [inputValue]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <BrowserRouter>

      
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

    <main style={{flex: 1}}>
      <Routes>
        <Route path="/" element={<Home searchTerm={searchTerm} />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </main>

      <Footer />
    </BrowserRouter>
    </div>
  )
}

export default App
