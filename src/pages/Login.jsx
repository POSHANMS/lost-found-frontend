import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'
import useAuth from '../hooks/useAuth'

function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('') // clear error when user types
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await api.post('/auth/login', form)
            login(res.data.user, res.data.access_token)
            navigate('/browse')
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'var(--bg)',
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    width: '100%',
                    maxWidth: '420px',
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#F5A623',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                        }}>
                            <svg width="28" height="28" viewBox="-12 -12 24 24" fill="none">
                                <circle cx="0" cy="0" r="11" stroke="#0F0F1A" strokeWidth="1.8" opacity="0.3"/>
                                <circle cx="0" cy="0" r="7" stroke="#0F0F1A" strokeWidth="1.8" opacity="0.5"/>
                                <circle cx="0" cy="0" r="2.5" fill="#0F0F1A"/>
                                <line x1="0" y1="0" x2="9" y2="-6" stroke="#0F0F1A" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M 6.5 -4.5 A 11 11 0 0 1 11 0" fill="none" stroke="#0F0F1A" strokeWidth="3.5" strokeLinecap="round" opacity="0.35"/>
                            </svg>
                        </div>
                    </Link>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 800,
                        letterSpacing: '-0.5px',
                        marginBottom: '8px',
                    }}>
                        Welcome back
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
                        Sign in to your FindIt account
                    </p>
                </div>

                {/* Form Card */}
                <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    padding: '32px',
                }}>
                    {/* Error message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: 'rgba(255, 71, 87, 0.1)',
                                border: '1px solid rgba(255, 71, 87, 0.3)',
                                color: 'var(--lost)',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                fontSize: '14px',
                                marginBottom: '20px',
                            }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--muted)',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}>
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@college.edu"
                                required
                                style={{
                                    width: '100%',
                                    background: 'var(--surface2)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '10px',
                                    padding: '12px 16px',
                                    fontSize: '15px',
                                    color: 'var(--text)',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '28px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--muted)',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%',
                                        background: 'var(--surface2)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '10px',
                                        padding: '12px 44px 12px 16px',
                                        fontSize: '15px',
                                        color: 'var(--text)',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--muted)',
                                        fontSize: '16px',
                                        padding: '4px',
                                    }}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            style={{
                                width: '100%',
                                background: loading ? 'var(--surface2)' : 'var(--accent)',
                                color: loading ? 'var(--muted)' : '#0F0F1A',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '14px',
                                fontSize: '15px',
                                fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s',
                            }}
                        >
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </motion.button>
                    </form>
                </div>

                {/* Footer */}
                <p style={{
                    textAlign: 'center',
                    marginTop: '24px',
                    color: 'var(--muted)',
                    fontSize: '14px',
                }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{
                        color: 'var(--accent)',
                        fontWeight: 600,
                        textDecoration: 'none',
                    }}>
                        Register
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}

export default Login