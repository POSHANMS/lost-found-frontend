import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuth from '../hooks/useAuth'

function LogoB() {
    return (
        <div style={{
            width: '36px', height: '36px',
            background: '#F5A623',
            borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
        }}>
            <svg width="22" height="22" viewBox="-12 -12 24 24" fill="none">
                <circle cx="0" cy="0" r="11" stroke="#0F0F1A" strokeWidth="1.8" opacity="0.3"/>
                <circle cx="0" cy="0" r="7" stroke="#0F0F1A" strokeWidth="1.8" opacity="0.5"/>
                <circle cx="0" cy="0" r="2.5" fill="#0F0F1A"/>
                <line x1="0" y1="0" x2="9" y2="-6" stroke="#0F0F1A" strokeWidth="2" strokeLinecap="round"/>
                <path d="M 6.5 -4.5 A 11 11 0 0 1 11 0" fill="none" stroke="#0F0F1A" strokeWidth="3.5" strokeLinecap="round" opacity="0.35"/>
            </svg>
        </div>
    )
}

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const isActive = (path) => location.pathname === path

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
                background: 'rgba(15, 15, 26, 0.85)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 24px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>

                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <LogoB />
                        <span style={{
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            fontWeight: 800,
                            fontSize: '20px',
                            color: 'var(--text)',
                            letterSpacing: '-0.5px',
                        }}>
                            Find<span style={{ color: 'var(--accent)' }}>It</span>
                        </span>
                    </motion.div>
                </Link>

                {/* Nav Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {[
                        { path: '/browse', label: 'Browse' },
                        ...(user ? [{ path: '/post', label: 'Post Item' }] : []),
                        ...(user ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
                        ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin' }] : []),
                    ].map(link => (
                        <Link key={link.path} to={link.path} style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: isActive(link.path) ? 'var(--accent)' : 'var(--muted)',
                                    background: isActive(link.path) ? 'var(--accent-dim)' : 'transparent',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {link.label}
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {!user ? (
                        <>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--border)',
                                        color: 'var(--text)',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Login
                                </motion.button>
                            </Link>
                            <Link to="/register" style={{ textDecoration: 'none' }}>
                                <motion.button
                                    whileHover={{ scale: 1.03, background: '#E09520' }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        background: 'var(--accent)',
                                        border: 'none',
                                        color: '#0F0F1A',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Register
                                </motion.button>
                            </Link>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 12px',
                                background: 'var(--surface)',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                            }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: 'var(--accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: '#0F0F1A',
                                }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: 'var(--text)',
                                }}>
                                    {user.name.split(' ')[0]}
                                </span>
                            </div>
                            <motion.button
                                onClick={handleLogout}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    background: 'rgba(255, 71, 87, 0.1)',
                                    border: '1px solid rgba(255, 71, 87, 0.3)',
                                    color: 'var(--lost)',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                }}
                            >
                                Logout
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar