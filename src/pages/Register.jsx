import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'
import useAuth from '../hooks/useAuth'

function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        department: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await api.post('/auth/register', form)
            login(res.data.user, res.data.access_token)
            navigate('/browse')
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Try again.')
        } finally {
            setLoading(false)
        }
    }

    const inputStyle = {
        width: '100%',
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '12px 16px',
        fontSize: '15px',
        color: 'var(--text)',
        outline: 'none',
        transition: 'border-color 0.2s',
    }

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--muted)',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    }

    const departments = [
        'Computer Science',
        'Electronics & Communication',
        'Mechanical',
        'Civil',
        'Information Science',
        'Electrical',
        'MBA',
        'MCA',
        'Other',
    ]

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
            background: 'var(--bg)',
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', maxWidth: '480px' }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 800,
                        letterSpacing: '-0.5px',
                        marginBottom: '8px',
                    }}>
                        Create account
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
                        Join FindIt and help your campus community
                    </p>
                </div>

                {/* Form Card */}
                <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    padding: '32px',
                }}>
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

                        {/* Name */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Walter White"
                                required
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@college.edu"
                                required
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>

                        {/* Phone + Department side by side */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px',
                            marginBottom: '20px',
                        }}>
                            <div>
                                <label style={labelStyle}>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="9999999999"
                                    required
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Department</label>
                                <select
                                    name="department"
                                    value={form.department}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        ...inputStyle,
                                        cursor: 'pointer',
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                                >
                                    <option value="" disabled>Select</option>
                                    {departments.map(d => (
                                        <option key={d} value={d}
                                            style={{ background: 'var(--surface2)' }}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '28px' }}>
                            <label style={labelStyle}>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Min 6 characters"
                                required
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                            />
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
                            {loading ? 'Creating account...' : 'Create Account →'}
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
                    Already have an account?{' '}
                    <Link to="/login" style={{
                        color: 'var(--accent)',
                        fontWeight: 600,
                        textDecoration: 'none',
                    }}>
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}

export default Register