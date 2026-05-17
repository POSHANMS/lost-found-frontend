import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import useAuth from '../hooks/useAuth'

function Admin() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('stats')
    const [stats, setStats] = useState(null)
    const [users, setUsers] = useState([])
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    // redirect if not admin
    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/')
        }
    }, [user])

    useEffect(() => {
        if (!user || user.role !== 'admin') return
        fetchAll()
    }, [user])

    const fetchAll = async () => {
        setLoading(true)

        try {
            const statsRes = await api.get('/admin/stats')
            setStats(statsRes.data)
        } catch (err) {
            console.error('Stats error:', err)
        }

        try {
            const usersRes = await api.get('/admin/users')
            setUsers(usersRes.data.users || [])
        } catch (err) {
            console.error('Users error:', err)
        }

        try {
            const itemsRes = await api.get('/items/')
            setItems(itemsRes.data.items || [])
        } catch (err) {
            console.error('Items error:', err)
        }

        setLoading(false)
    }

    const banUser = async (userId, isBanned) => {
        try {
            await api.put(`/admin/users/${userId}/ban`, { is_banned: !isBanned })
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, is_banned: !isBanned } : u
            ))
        } catch (err) {
            console.error('Ban error:', err)
        }
    }

    const deleteItem = async (itemId) => {
        if (!window.confirm('Delete this item permanently?')) return
        try {
            await api.delete(`/admin/items/${itemId}`)
            setItems(prev => prev.filter(i => i.id !== itemId))
        } catch (err) {
            console.error('Delete error:', err)
        }
    }

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'var(--bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--muted)',
            }}>
                Loading admin panel...
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg)',
            padding: '40px 24px',
        }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '32px' }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                    }}>
                        <div style={{
                            background: 'rgba(255,71,87,0.1)',
                            border: '1px solid rgba(255,71,87,0.3)',
                            color: 'var(--lost)',
                            padding: '4px 12px',
                            borderRadius: '100px',
                            fontSize: '12px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}>
                            Admin Panel
                        </div>
                    </div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 800,
                        letterSpacing: '-0.5px',
                    }}>
                        Control Center
                    </h1>
                </motion.div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '32px',
                }}>
                    {['stats', 'users', 'items'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: activeTab === tab ? 'var(--accent)' : 'var(--surface)',
                                color: activeTab === tab ? '#0F0F1A' : 'var(--muted)',
                                border: activeTab === tab ? 'none' : '1px solid var(--border)',
                                padding: '8px 20px',
                                borderRadius: '100px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s',
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">

                    {/* ── STATS TAB ── */}
                    {activeTab === 'stats' && stats && (
                        <motion.div
                            key="stats"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: '16px',
                                marginBottom: '24px',
                            }}>
                                {[
                                    { label: 'Total Users', value: stats.total_users, emoji: '👥' },
                                    { label: 'Total Items', value: stats.total_items, emoji: '📦' },
                                    { label: 'Lost Items', value: stats.lost_items, emoji: '😢' },
                                    { label: 'Found Items', value: stats.found_items, emoji: '🎉' },
                                    { label: 'Resolved', value: stats.resolved_items, emoji: '✅' },
                                    { label: 'Total Claims', value: stats.total_claims, emoji: '🙋' },
                                ].map(stat => (
                                    <motion.div
                                        key={stat.label}
                                        whileHover={{ y: -2 }}
                                        style={{
                                            background: 'var(--surface)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '16px',
                                            padding: '24px',
                                        }}
                                    >
                                        <div style={{
                                            fontSize: '28px',
                                            marginBottom: '8px',
                                        }}>
                                            {stat.emoji}
                                        </div>
                                        <div style={{
                                            fontSize: '32px',
                                            fontWeight: 800,
                                            color: 'var(--accent)',
                                            marginBottom: '4px',
                                        }}>
                                            {stat.value}
                                        </div>
                                        <div style={{
                                            fontSize: '13px',
                                            color: 'var(--muted)',
                                        }}>
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── USERS TAB ── */}
                    {activeTab === 'users' && (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                            }}>
                                {/* Table header */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 120px 100px 100px',
                                    padding: '14px 20px',
                                    background: 'var(--surface2)',
                                    borderBottom: '1px solid var(--border)',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: 'var(--muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                }}>
                                    <span>Name</span>
                                    <span>Email</span>
                                    <span>Department</span>
                                    <span>Role</span>
                                    <span>Action</span>
                                </div>

                                {/* Table rows */}
                                {users.length === 0 ? (
                                    <div style={{
                                        padding: '40px',
                                        textAlign: 'center',
                                        color: 'var(--muted)',
                                    }}>
                                        No users found
                                    </div>
                                ) : (
                                    users.map((u, i) => (
                                        <div
                                            key={u.id}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr 120px 100px 100px',
                                                padding: '14px 20px',
                                                borderBottom: i < users.length - 1
                                                    ? '1px solid var(--border)'
                                                    : 'none',
                                                alignItems: 'center',
                                                opacity: u.is_banned ? 0.5 : 1,
                                            }}
                                        >
                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: 'var(--text)',
                                            }}>
                                                {u.name}
                                            </span>
                                            <span style={{
                                                fontSize: '13px',
                                                color: 'var(--muted)',
                                            }}>
                                                {u.email}
                                            </span>
                                            <span style={{
                                                fontSize: '13px',
                                                color: 'var(--muted)',
                                            }}>
                                                {u.department}
                                            </span>
                                            <span style={{
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                color: u.role === 'admin'
                                                    ? 'var(--accent)'
                                                    : 'var(--muted)',
                                                textTransform: 'capitalize',
                                            }}>
                                                {u.role}
                                            </span>
                                            <button
                                                onClick={() => banUser(u.id, u.is_banned)}
                                                disabled={u.role === 'admin'}
                                                style={{
                                                    background: u.is_banned
                                                        ? 'rgba(46,213,115,0.1)'
                                                        : 'rgba(255,71,87,0.1)',
                                                    border: u.is_banned
                                                        ? '1px solid rgba(46,213,115,0.3)'
                                                        : '1px solid rgba(255,71,87,0.3)',
                                                    color: u.is_banned
                                                        ? 'var(--found)'
                                                        : 'var(--lost)',
                                                    padding: '5px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    cursor: u.role === 'admin'
                                                        ? 'not-allowed'
                                                        : 'pointer',
                                                    opacity: u.role === 'admin' ? 0.3 : 1,
                                                }}
                                            >
                                                {u.is_banned ? 'Unban' : 'Ban'}
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* ── ITEMS TAB ── */}
                    {activeTab === 'items' && (
                        <motion.div
                            key="items"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                            }}>
                                {/* Table header */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 120px 100px 100px 80px',
                                    padding: '14px 20px',
                                    background: 'var(--surface2)',
                                    borderBottom: '1px solid var(--border)',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: 'var(--muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                }}>
                                    <span>Title</span>
                                    <span>Category</span>
                                    <span>Status</span>
                                    <span>Posted By</span>
                                    <span>Action</span>
                                </div>

                                {items.length === 0 ? (
                                    <div style={{
                                        padding: '40px',
                                        textAlign: 'center',
                                        color: 'var(--muted)',
                                    }}>
                                        No items found
                                    </div>
                                ) : (
                                    items.map((item, i) => (
                                        <div
                                            key={item.id}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 120px 100px 100px 80px',
                                                padding: '14px 20px',
                                                borderBottom: i < items.length - 1
                                                    ? '1px solid var(--border)'
                                                    : 'none',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span style={{
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: 'var(--text)',
                                            }}>
                                                {item.title}
                                            </span>
                                            <span style={{
                                                fontSize: '13px',
                                                color: 'var(--muted)',
                                            }}>
                                                {item.category}
                                            </span>
                                            <span style={{
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                color: item.status === 'lost'
                                                    ? 'var(--lost)'
                                                    : 'var(--found)',
                                                textTransform: 'uppercase',
                                            }}>
                                                {item.status}
                                            </span>
                                            <span style={{
                                                fontSize: '13px',
                                                color: 'var(--muted)',
                                            }}>
                                                {item.posted_by}
                                            </span>
                                            <button
                                                onClick={() => deleteItem(item.id)}
                                                style={{
                                                    background: 'rgba(255,71,87,0.1)',
                                                    border: '1px solid rgba(255,71,87,0.3)',
                                                    color: 'var(--lost)',
                                                    padding: '5px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}

export default Admin