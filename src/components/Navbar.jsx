import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuth from '../hooks/useAuth'

function LogoIcon() {
    return (
        <div style={{
            width: '38px', height: '38px',
            background: '#F5A623',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(245,166,35,0.35)',
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
    const { user, logout, unreadCount, loading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const isActive = (path) => location.pathname === path

    const navLinks = [
        { path: '/browse', label: 'Browse' },
        ...(user ? [{ path: '/post', label: 'Post Item' }] : []),
        ...(user ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
        ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin' }] : []),
    ]

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
                background: 'rgba(15, 15, 26, 0.92)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 24px',
                height: '68px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>

                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <LogoIcon />
                        <span style={{
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            fontWeight: 800,
                            fontSize: '21px',
                            color: '#FFFFFF',
                            letterSpacing: '-0.5px',
                        }}>
                            Find<span style={{ color: 'var(--accent)' }}>It</span>
                        </span>
                    </motion.div>
                </Link>

                {/* Nav Links */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px',
                    padding: '4px',
                }}>
                    {navLinks.map(link => (
                        <Link key={link.path} to={link.path} style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    padding: '7px 16px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: isActive(link.path) ? 600 : 500,
                                    color: isActive(link.path) ? '#0F0F1A' : 'rgba(255,255,255,0.6)',
                                    background: isActive(link.path) ? 'var(--accent)' : 'transparent',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {link.label}
                                {/* notification dot on Dashboard */}
                                {link.path === '/dashboard' && unreadCount > 0 && (
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '18px',
                                        height: '18px',
                                        background: 'var(--lost)',
                                        color: '#fff',
                                        borderRadius: '50%',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        marginLeft: '6px',
                                        verticalAlign: 'middle',
                                    }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {loading ? (
                        // show nothing while checking auth status
                        <div style={{ width: '140px' }} />
                    ) : !user ? (
                        <>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <motion.button
                                    whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.3)' }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        color: 'rgba(255,255,255,0.8)',
                                        padding: '9px 20px',
                                        borderRadius: '10px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    Login
                                </motion.button>
                            </Link>
                            <Link to="/register" style={{ textDecoration: 'none' }}>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        background: 'var(--accent)',
                                        border: 'none',
                                        color: '#0F0F1A',
                                        padding: '9px 20px',
                                        borderRadius: '10px',
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(245,166,35,0.3)',
                                    }}
                                >
                                    Register
                                </motion.button>
                            </Link>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* User avatar pill */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 14px 6px 6px',
                                background: 'var(--surface)',
                                borderRadius: '100px',
                                border: '1px solid var(--border)',
                            }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: 'var(--accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: '#0F0F1A',
                                    flexShrink: 0,
                                }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: 'var(--text)',
                                }}>
                                    {user.name.split(' ')[0]}
                                </span>
                            </div>

                            {/* Logout */}
                            <motion.button
                                onClick={handleLogout}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    background: 'rgba(255, 71, 87, 0.08)',
                                    border: '1px solid rgba(255, 71, 87, 0.25)',
                                    color: 'var(--lost)',
                                    padding: '9px 18px',
                                    borderRadius: '10px',
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