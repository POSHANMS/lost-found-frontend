// App.jsx — the root component, controls all routing
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// importing all pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Browse from './pages/Browse'
import PostItem from './pages/PostItem'
import ItemDetail from './pages/ItemDetail'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'

// importing navbar which shows on every page
import Navbar from './components/Navbar'

function App() {
  return (
    // BrowserRouter enables React Router — without this, routing won't work
    <BrowserRouter>
    {/* Navbar sits outside Routes so it shows on every page */}
    <Navbar />

    {/* Routes is the container that holds all our page routes */}
    <Routes>
    {/* each Route maps a URL path to a page component */}
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/browse" element={<Browse />} />
    <Route path="/post" element={<PostItem />} />
    <Route path="/item/:id" element={<ItemDetail />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/admin" element={<Admin />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App