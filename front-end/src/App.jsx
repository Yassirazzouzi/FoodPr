import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import { Routes, Route } from 'react-router-dom'
import Footer from './components/Footer/Footer'
import Login from './components/Login/login'
import DetailPopup from './components/DetailCart/DetailPopup'
import Contact from './components/Contact/Contact'
const App = () => {
  const [showLogin, setshowLogin] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)

  // Fonction pour ouvrir la page de détail
  const openDetail = (food) => {
    setSelectedFood(food)
    setShowDetail(true)
  }

  // Fonction pour fermer la page de détail
  const closeDetail = () => {
    setShowDetail(false)
  }

  return (
    <>
      {showLogin ? <Login setshowLogin={setshowLogin} /> : <></>}
      {showDetail && selectedFood && (
        <DetailPopup food={selectedFood} onClose={closeDetail} />
      )}
      <Navbar setshowLogin={setshowLogin} />
      <div className="app">
        <Routes>
          <Route path="/" element={<Home openDetail={openDetail} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order" element={<PlaceOrder />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
