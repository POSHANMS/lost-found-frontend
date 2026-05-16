import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../utils/api'

// ── Skeleton loader — shows while data is loading ──────────────────────────
function ItemSkeleton() {
    return (
        <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            overflow: 'hidden',
        }}>
            <div style={{
                height: '180px',
                background: 'var(--surface2)',
                animation: 'pulse 1.5s ease-in-out infinite',
            }} />
            <div style={{ padding: '16px' }}>
                <div style={{
                    height: '16px',
                    background: 'var(--surface2)',
                    borderRadius: '6px',
                    marginBottom: '10px',
                    width: '70%',
                    animation: 'pulse 1.5s ease-in-out infinite',
                }} />
                <div style={{
                    height: '12px',
                    background: 'var(--surface2)',
                    borderRadius: '6px',
                    width: '50%',
                    animation: 'pulse 1.5s ease-in-out infinite',
                }} />
            </div>
        </div>
    )
}

// ── Single item card ────────────────────────────────────────────────────────
function ItemCard({ item }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
        >
            <Link to={`/item/${item.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,166,35,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                    {/* Image */}
                    <div style={{
                        height: '180px',
                        background: '#ffffff',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {item.image_url ? (
                            <img
                                src={item.image_url}
                                alt={item.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '48px',
                            }}>
                                {getCategoryEmoji(item.category)}
                            </div>
                        )}

                        {/* Status badge */}
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            background: item.status === 'lost'
                                ? 'rgba(255,71,87,0.9)'
                                : 'rgba(46,213,115,0.9)',
                            color: '#fff',
                            padding: '4px 10px',
                            borderRadius: '100px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            backdropFilter: 'blur(4px)',
                        }}>
                            {item.status}
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '14px 16px' }}>
                        <h3 style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: 'var(--text)',
                            marginBottom: '6px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            {item.title}
                        </h3>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <span style={{
                                fontSize: '12px',
                                color: 'var(--muted)',
                            }}>
                                📍 {item.location}
                            </span>
                            <span style={{
                                fontSize: '11px',
                                color: 'var(--muted)',
                            }}>
                                {new Date(item.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div style={{
                            marginTop: '8px',
                            display: 'inline-block',
                            background: 'var(--surface2)',
                            color: 'var(--muted)',
                            padding: '3px 10px',
                            borderRadius: '100px',
                            fontSize: '11px',
                            fontWeight: 500,
                        }}>
                            {item.category}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

function getCategoryEmoji(category) {
    const map = {
        'Electronics': '💻',
        'Documents': '📄',
        'Accessories': '👜',
        'Clothing': '👕',
        'Keys': '🔑',
        'Bags': '🎒',
        'Other': '📦',
    }
    return map[category] || '📦'
}

// ── Main Browse page ────────────────────────────────────────────────────────
function Browse() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [category, setCategory] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    const categories = [
        'Electronics', 'Documents', 'Accessories',
        'Clothing', 'Keys', 'Bags', 'Other'
    ]

    useEffect(() => {
        fetchItems()
    }, [status, category, page])

    const fetchItems = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (status) params.append('status', status)
            if (category) params.append('category', category)
            if (search) params.append('search', search)
            params.append('page', page)

            const res = await api.get(`/items/?${params}`)
            setItems(res.data.items)
            setTotalPages(res.data.pages)
            setTotal(res.data.total)
        } catch (err) {
            console.error('Failed to fetch items:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setPage(1)
        fetchItems()
    }

    const handleFilterChange = (type, value) => {
        setPage(1)
        if (type === 'status') setStatus(prev => prev === value ? '' : value)
        if (type === 'category') setCategory(prev => prev === value ? '' : value)
    }

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 24px',
        }}>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '32px' }}
            >
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 800,
                    letterSpacing: '-0.5px',
                    marginBottom: '8px',
                }}>
                    Browse Items
                </h1>
                <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
                    {total > 0 ? `${total} items reported` : 'No items yet'}
                </p>
            </motion.div>

            {/* Search bar */}
            <form onSubmit={handleSearch} style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
            }}>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by title..."
                    style={{
                        flex: 1,
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        fontSize: '15px',
                        color: 'var(--text)',
                        outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                        background: 'var(--accent)',
                        color: '#0F0F1A',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '12px 24px',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer',
                    }}
                >
                    Search
                </motion.button>
            </form>

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '32px',
            }}>
                {/* Status filters */}
                {['lost', 'found'].map(s => (
                    <motion.button
                        key={s}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleFilterChange('status', s)}
                        style={{
                            background: status === s
                                ? (s === 'lost' ? 'rgba(255,71,87,0.2)' : 'rgba(46,213,115,0.2)')
                                : 'var(--surface)',
                            border: `1px solid ${status === s
                                ? (s === 'lost' ? 'rgba(255,71,87,0.5)' : 'rgba(46,213,115,0.5)')
                                : 'var(--border)'}`,
                            color: status === s
                                ? (s === 'lost' ? 'var(--lost)' : 'var(--found)')
                                : 'var(--muted)',
                            padding: '6px 16px',
                            borderRadius: '100px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                        }}
                    >
                        {s === 'lost' ? '🔴' : '🟢'} {s}
                    </motion.button>
                ))}

                <div style={{
                    width: '1px',
                    background: 'var(--border)',
                    margin: '0 4px',
                }} />

                {/* Category filters */}
                {categories.map(c => (
                    <motion.button
                        key={c}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleFilterChange('category', c)}
                        style={{
                            background: category === c ? 'var(--accent-dim)' : 'var(--surface)',
                            border: `1px solid ${category === c ? 'rgba(245,166,35,0.4)' : 'var(--border)'}`,
                            color: category === c ? 'var(--accent)' : 'var(--muted)',
                            padding: '6px 16px',
                            borderRadius: '100px',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        {getCategoryEmoji(c)} {c}
                    </motion.button>
                ))}
            </div>

            {/* Items Grid */}
            {loading ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '20px',
                }}>
                    {[...Array(8)].map((_, i) => <ItemSkeleton key={i} />)}
                </div>
            ) : items.length === 0 ? (
                // Empty state
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        textAlign: 'center',
                        padding: '80px 24px',
                    }}
                >
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        marginBottom: '8px',
                    }}>
                        No items found
                    </h3>
                    <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
                        Try adjusting your filters or search term
                    </p>
                    <Link to="/post" style={{ textDecoration: 'none' }}>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            style={{
                                background: 'var(--accent)',
                                color: '#0F0F1A',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '12px 24px',
                                fontSize: '14px',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            Post an Item
                        </motion.button>
                    </Link>
                </motion.div>
            ) : (
                <AnimatePresence>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '20px',
                    }}>
                        {items.map(item => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </AnimatePresence>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '40px',
                }}>
                    {[...Array(totalPages)].map((_, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setPage(i + 1)}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: page === i + 1 ? 'var(--accent)' : 'var(--surface)',
                                color: page === i + 1 ? '#0F0F1A' : 'var(--muted)',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            {i + 1}
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Skeleton pulse animation */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
        </div>
    )
}

export default Browse