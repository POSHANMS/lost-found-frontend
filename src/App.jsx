import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { socket } from './utils/api'
import useAuth from './hooks/useAuth'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Browse from './pages/Browse'
import PostItem from './pages/PostItem'
import ItemDetail from './pages/ItemDetail'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Navbar from './components/Navbar'

// Toast notification component
function Toast({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: -60, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -60, x: '-50%' }}
            style={{
                position: 'fixed',
                top: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--surface)',
                border: '1px solid rgba(245,166,35,0.4)',
                borderRadius: '12px',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                zIndex: 999999,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                minWidth: '300px',
                maxWidth: '480px',
            }}
        >
            <span style={{ fontSize: '20px' }}>🔔</span>
            <p style={{
                fontSize: '14px',
                color: 'var(--text)',
                fontWeight: 500,
                flex: 1,
            }}>
                {message}
            </p>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '0 4px',
                }}
            >
                ×
            </button>
        </motion.div>
    )
}

function AppContent() {
    const { user } = useAuth()
    const [toasts, setToasts] = useState([])

    useEffect(() => {
        // listen for real time notifications
        socket.on('notification', (data) => {
            const id = Date.now()
            setToasts(prev => [...prev, { id, message: data.message }])
        })

        return () => socket.off('notification')
    }, [])

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    return (
        <>
            <Navbar />

            {/* Toast notifications */}
            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </AnimatePresence>

            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/post" element={<PostItem />} />
                <Route path="/item/:id" element={<ItemDetail />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}

function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '16px',
            textAlign: 'center',
            padding: '24px',
        }}>
            <div style={{ fontSize: '80px' }}>🔍</div>
            <h1 style={{
                fontSize: '32px',
                fontWeight: 800,
                color: 'var(--text)',
            }}>
                Page not found
            </h1>
            <p style={{
                color: 'var(--muted)',
                fontSize: '16px',
                maxWidth: '400px',
            }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                        background: 'var(--accent)',
                        color: '#0F0F1A',
                        border: 'none',
                        padding: '12px 28px',
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        marginTop: '8px',
                    }}
                >
                    Go Home →
                </motion.button>
            </Link>
        </div>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}

export default App