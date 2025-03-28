import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AuthPage from './login'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from './profile'
import UserPage from './users'
import { ToastContainer } from 'react-toastify'
import Navbar from './Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
       <ToastContainer position="top-right" autoClose={3000} />
       <Navbar />
      <Routes>
       
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="*" element={<AuthPage />}  />
      </Routes>
    </Router>
  )
}

export default App
