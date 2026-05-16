import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import useAuth from '../hooks/useAuth'

// ── Tab button component ────────────────────────────────────────────────────
function Tab({ label, active, count, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: active ? 'var(--accent)' : 'var(--surface2)',
                color: active ? '#0F0F1A' : 'var(--muted)',
                border: active ? 'none' : '1px solid var(--border)',
                padding: '8px 20px',
                borderRadius: '100px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
            }}
        >
            {label}
            {count > 0 && (
                <span style={{
                    background: active ? 'rgba(0,0,0,0.2)' : 'var(--surface)',
                    color: active ? '#0F0F1A' : 'var(--muted)',
                    padding: '1px 7px',
                    borderRadius: '100px',
                    fontSize: '12px',
                    fontWeight: 700,
                }}>
                    {count}
                </span>
            )}
        </button>
    )
}

// ── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const colors = {
        lost: { bg: 'rgba(255,71,87,0.1)', color: 'var(--lost)', border: 'rgba(255,71,87,0.3)' },
        found: { bg: 'rgba(46,213,115,0.1)', color: 'var(--found)', border: 'rgba(46,213,115,0.3)' },
        pending: { bg: 'rgba(245,166,35,0.1)', color: 'var(--accent)', border: 'rgba(245,166,35,0.3)' },
        approved: { bg: 'rgba(46,213,115,0.1)', color: 'var(--found)', border: 'rgba(46,213,115,0.3)' },
        rejected: { bg: 'rgba(255,71,87,0.1)', color: 'var(--lost)', border: 'rgba(255,71,87,0.3)' },
    }
    const c = colors[status] || colors.pending
    return (
        <span style={{
            background: c.bg,
            color: c.color,
            border: `1px solid ${c.border}`,
            padding: '3px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        }}>
            {status}
        </span>
    )
}

// ── Main Dashboard ──────────────────────────────────────────────────────────
function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('posts')
    const [posts, setPosts] = useState([])
    const [claims, setClaims] = useState([])
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [receivedClaims, setReceivedClaims] = useState([])

    // redirect if not logged in
    useEffect(() => {
        if (!user && !loading) navigate('/login')
    }, [user, loading])

    // fetch all data on load
    useEffect(() => {
        if (!user) return
        fetchAll()
    }, [user])

    const fetchAll = async () => {
        setLoading(true)
        try {
            // fetch each separately so one failure doesn't kill the others
            const postsRes = await api.get('/items/?my=true')
            setPosts(postsRes.data.items || [])
        } catch (err) {
            console.error('Posts fetch error:', err)
        }

        try {
            const claimsRes = await api.get('/claims/mine')
            setClaims(claimsRes.data.claims || [])
        } catch (err) {
            console.error('Claims fetch error:', err)
            setClaims([])
        }

        try {
            const notifsRes = await api.get('/notifications/')
            setNotifications(notifsRes.data.notifications || [])
        } catch (err) {
            console.error('Notifications fetch error:', err)
            setNotifications([])
        }
        // fetch claims on MY items
        try {
            // get all my posts first, then get claims for each
            const postsRes2 = await api.get('/items/?my=true')
            const myPosts = postsRes2.data.items || []
            
            const allReceivedClaims = []
            for (const post of myPosts) {
                try {
                    const claimsRes = await api.get(`/claims/${post.id}`)
                    const claims = claimsRes.data.claims || []
                    // add item title to each claim
                    claims.forEach(c => {
                        allReceivedClaims.push({ ...c, item_title: post.title, item_id: post.id })
                    })
                } catch (err) {
                    // no claims for this item
                }
            }
            setReceivedClaims(allReceivedClaims)
        } catch (err) {
            console.error('Received claims error:', err)
        }

        setLoading(false)
    }

    const respondToClaim = async (claimId, status) => {
        try {
            await api.put(`/claims/${claimId}/respond`, { status })
            setReceivedClaims(prev => prev.map(c =>
                c.id === claimId ? { ...c, status } : c
            ))
        } catch (err) {
            console.error('Respond error:', err)
        }
    }

    // mark notification as read
    const markRead = async (id) => {
        try {
            await api.put('/notifications/read', { notification_id: id })
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            )
        } catch (err) {
            console.error('Failed to mark read:', err)
        }
    }

    // delete own post
    const deletePost = async (itemId) => {
        if (!window.confirm('Delete this item?')) return
        try {
            await api.delete(`/items/${itemId}`)
            setPosts(prev => prev.filter(p => p.id !== itemId))
        } catch (err) {
            console.error('Failed to delete:', err)
        }
    }

    const markResolved = async (itemId) => {
        if (!window.confirm('Mark this item as resolved?')) return
        try {
            await api.put(`/items/${itemId}`, { is_resolved: true })
            setPosts(prev => prev.map(p =>
                p.id === itemId ? { ...p, is_resolved: true } : p
            ))
        } catch (err) {
            console.error('Failed to mark resolved:', err)
        }
}

    const unreadCount = notifications.filter(n => !n.is_read).length

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
                Loading dashboard...
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg)',
            padding: '40px 24px',
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '32px' }}
                >
                    {/* User info card */}
                    <div style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '16px',
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '24px',
                    }}>
                        {/* Avatar */}
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: 'var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '22px',
                            fontWeight: 700,
                            color: '#0F0F1A',
                            flexShrink: 0,
                        }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: 700,
                                color: 'var(--text)',
                                marginBottom: '4px',
                            }}>
                                {user?.name}
                            </h2>
                            <p style={{
                                fontSize: '14px',
                                color: 'var(--muted)',
                            }}>
                                {user?.email} · {user?.department || 'Student'}
                            </p>
                        </div>

                        {/* Quick stats */}
                        <div style={{
                            marginLeft: 'auto',
                            display: 'flex',
                            gap: '24px',
                        }}>
                            {[
                                { label: 'Posts', value: posts.length },
                                { label: 'Claims', value: claims.length },
                            ].map(stat => (
                                <div key={stat.label} style={{ textAlign: 'center' }}>
                                    <div style={{
                                        fontSize: '24px',
                                        fontWeight: 800,
                                        color: 'var(--accent)',
                                    }}>
                                        {stat.value}
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: 'var(--muted)',
                                    }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Tab
                            label="My Posts"
                            active={activeTab === 'posts'}
                            count={posts.length}
                            onClick={() => setActiveTab('posts')}
                        />
                        <Tab
                            label="My Claims"
                            active={activeTab === 'claims'}
                            count={claims.length}
                            onClick={() => setActiveTab('claims')}
                        />
                        <Tab
                            label="Claims Received"
                            active={activeTab === 'received'}
                            count={receivedClaims.length}
                            onClick={() => setActiveTab('received')}
                        />
                        <Tab
                            label="Notifications"
                            active={activeTab === 'notifications'}
                            count={unreadCount}
                            onClick={() => setActiveTab('notifications')}
                        />
                        
                    </div>
                </motion.div>

                {/* Tab content */}
                <AnimatePresence mode="wait">

                    {/* ── MY POSTS ── */}
                    {activeTab === 'posts' && (
                        <motion.div
                            key="posts"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {posts.length === 0 ? (
                                <EmptyState
                                    emoji="📭"
                                    title="No posts yet"
                                    desc="You haven't posted any items"
                                    linkTo="/post"
                                    linkLabel="Post an Item"
                                />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {posts.map(post => (
                                        <motion.div
                                            key={post.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{
                                                background: 'var(--surface)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '14px',
                                                padding: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '16px',
                                            }}
                                        >
                                            {/* Image or emoji */}
                                            <div style={{
                                                width: '56px',
                                                height: '56px',
                                                borderRadius: '10px',
                                                background: 'var(--surface2)',
                                                overflow: 'hidden',
                                                flexShrink: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '24px',
                                            }}>
                                                {post.image_url
                                                    ? <img src={post.image_url} alt={post.title}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    : '📦'
                                                }
                                            </div>

                                            {/* Info */}
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    marginBottom: '4px',
                                                }}>
                                                    <h3 style={{
                                                        fontSize: '16px',
                                                        fontWeight: 700,
                                                        color: 'var(--text)',
                                                    }}>
                                                        {post.title}
                                                    </h3>
                                                    <StatusBadge status={post.status} />
                                                    {post.is_resolved && (
                                                        <StatusBadge status="resolved" />
                                                    )}
                                                </div>
                                                <p style={{
                                                    fontSize: '13px',
                                                    color: 'var(--muted)',
                                                }}>
                                                    📍 {post.location} · {new Date(post.created_at).toLocaleDateString()}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Link to={`/item/${post.id}`}>
                                                    <button style={{
                                                        background: 'var(--surface2)',
                                                        border: '1px solid var(--border)',
                                                        color: 'var(--text)',
                                                        padding: '7px 14px',
                                                        borderRadius: '8px',
                                                        fontSize: '13px',
                                                        fontWeight: 500,
                                                        cursor: 'pointer',
                                                    }}>
                                                        View
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => deletePost(post.id)}
                                                    style={{
                                                        background: 'rgba(255,71,87,0.1)',
                                                        border: '1px solid rgba(255,71,87,0.3)',
                                                        color: 'var(--lost)',
                                                        padding: '7px 14px',
                                                        borderRadius: '8px',
                                                        fontSize: '13px',
                                                        fontWeight: 500,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            {!post.is_resolved && (
                                                <button
                                                    onClick={() => markResolved(post.id)}
                                                    style={{
                                                        background: 'rgba(46,213,115,0.1)',
                                                        border: '1px solid rgba(46,213,115,0.3)',
                                                        color: 'var(--found)',
                                                        padding: '7px 14px',
                                                        borderRadius: '8px',
                                                        fontSize: '13px',
                                                        fontWeight: 500,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    ✓ Resolved
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── MY CLAIMS ── */}
                    {activeTab === 'claims' && (
                        <motion.div
                            key="claims"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {claims.length === 0 ? (
                                <EmptyState
                                    emoji="🙋"
                                    title="No claims yet"
                                    desc="You haven't claimed any items"
                                    linkTo="/browse"
                                    linkLabel="Browse Items"
                                />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {claims.map(claim => (
                                        <motion.div
                                            key={claim.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{
                                                background: 'var(--surface)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '14px',
                                                padding: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '16px',
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    marginBottom: '4px',
                                                }}>
                                                    <h3 style={{
                                                        fontSize: '16px',
                                                        fontWeight: 700,
                                                        color: 'var(--text)',
                                                    }}>
                                                        {claim.item_title || 'Item'}
                                                    </h3>
                                                    <StatusBadge status={claim.status} />
                                                </div>
                                                <p style={{
                                                    fontSize: '13px',
                                                    color: 'var(--muted)',
                                                }}>
                                                    Claimed on {new Date(claim.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Link to={`/item/${claim.item_id}`}>
                                                <button style={{
                                                    background: 'var(--surface2)',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--text)',
                                                    padding: '7px 14px',
                                                    borderRadius: '8px',
                                                    fontSize: '13px',
                                                    cursor: 'pointer',
                                                }}>
                                                    View Item
                                                </button>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── NOTIFICATIONS ── */}
                    {activeTab === 'notifications' && (
                        <motion.div
                            key="notifications"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {notifications.length === 0 ? (
                                <EmptyState
                                    emoji="🔔"
                                    title="No notifications"
                                    desc="You're all caught up"
                                />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {notifications.map(notif => (
                                        <motion.div
                                            key={notif.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() => !notif.is_read && markRead(notif.id)}
                                            style={{
                                                background: notif.is_read
                                                    ? 'var(--surface)'
                                                    : 'rgba(245,166,35,0.05)',
                                                border: `1px solid ${notif.is_read
                                                    ? 'var(--border)'
                                                    : 'rgba(245,166,35,0.2)'}`,
                                                borderRadius: '14px',
                                                padding: '16px 20px',
                                                cursor: notif.is_read ? 'default' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                            }}
                                        >
                                            {/* Unread dot */}
                                            {!notif.is_read && (
                                                <div style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: 'var(--accent)',
                                                    flexShrink: 0,
                                                }} />
                                            )}
                                            <p style={{
                                                fontSize: '14px',
                                                color: notif.is_read ? 'var(--muted)' : 'var(--text)',
                                                lineHeight: 1.5,
                                                flex: 1,
                                            }}>
                                                {notif.message}
                                            </p>
                                            <span style={{
                                                fontSize: '12px',
                                                color: 'var(--muted)',
                                                flexShrink: 0,
                                            }}>
                                                {new Date(notif.created_at).toLocaleDateString()}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                {/* ── CLAIMS RECEIVED ── */}
                {activeTab === 'received' && (
                    <motion.div
                        key="received"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {receivedClaims.length === 0 ? (
                            <EmptyState
                                emoji="📭"
                                title="No claims received"
                                desc="Nobody has claimed your items yet"
                            />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {receivedClaims.map(claim => (
                                    <motion.div
                                        key={claim.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            background: 'var(--surface)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '14px',
                                            padding: '20px',
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '12px',
                                        }}>
                                            <div>
                                                <h3 style={{
                                                    fontSize: '16px',
                                                    fontWeight: 700,
                                                    color: 'var(--text)',
                                                    marginBottom: '4px',
                                                }}>
                                                    {claim.claimant_name} wants your item
                                                </h3>
                                                <p style={{
                                                    fontSize: '13px',
                                                    color: 'var(--muted)',
                                                }}>
                                                    Item: {claim.item_title} · {new Date(claim.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <StatusBadge status={claim.status} />
                                        </div>

                                        {claim.message && (
                                            <div style={{
                                                background: 'var(--surface2)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                marginBottom: '16px',
                                                fontSize: '14px',
                                                color: 'var(--text)',
                                                lineHeight: 1.6,
                                            }}>
                                                💬 "{claim.message}"
                                            </div>
                                        )}

                                        {claim.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <motion.button
                                                    onClick={() => respondToClaim(claim.id, 'approved')}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    style={{
                                                        background: 'rgba(46,213,115,0.1)',
                                                        border: '1px solid rgba(46,213,115,0.4)',
                                                        color: 'var(--found)',
                                                        padding: '8px 20px',
                                                        borderRadius: '8px',
                                                        fontSize: '14px',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    ✓ Approve
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => respondToClaim(claim.id, 'rejected')}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    style={{
                                                        background: 'rgba(255,71,87,0.1)',
                                                        border: '1px solid rgba(255,71,87,0.4)',
                                                        color: 'var(--lost)',
                                                        padding: '8px 20px',
                                                        borderRadius: '8px',
                                                        fontSize: '14px',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    ✗ Reject
                                                </motion.button>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

            </AnimatePresence>
            </div>
        </div>
    )
}

// ── Reusable empty state ────────────────────────────────────────────────────
function EmptyState({ emoji, title, desc, linkTo, linkLabel }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                textAlign: 'center',
                padding: '60px 24px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
            }}
        >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{emoji}</div>
            <h3 style={{
                fontSize: '18px',
                fontWeight: 700,
                marginBottom: '8px',
                color: 'var(--text)',
            }}>
                {title}
            </h3>
            <p style={{
                color: 'var(--muted)',
                fontSize: '14px',
                marginBottom: linkTo ? '24px' : 0,
            }}>
                {desc}
            </p>
            {linkTo && (
                <Link to={linkTo} style={{ textDecoration: 'none' }}>
                    <button style={{
                        background: 'var(--accent)',
                        color: '#0F0F1A',
                        border: 'none',
                        padding: '10px 24px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                    }}>
                        {linkLabel}
                    </button>
                </Link>
            )}
        </motion.div>
    )
}

export default Dashboard