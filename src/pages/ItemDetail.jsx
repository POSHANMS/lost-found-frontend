import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import useAuth from '../hooks/useAuth'

function ItemDetail() {
    const { id } = useParams()        // grabs the :id from the URL
    const navigate = useNavigate()
    const { user } = useAuth()

    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // claim modal state
    const [showClaim, setShowClaim] = useState(false)
    const [claimAnswer, setClaimAnswer] = useState('')
    const [claimMessage, setClaimMessage] = useState('')
    const [claimLoading, setClaimLoading] = useState(false)
    const [claimError, setClaimError] = useState('')
    const [claimSuccess, setClaimSuccess] = useState(false)

    // fetch item when page loads
    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await api.get(`/items/${id}`)
                setItem(res.data)
            } catch (err) {
                setError('Item not found')
            } finally {
                setLoading(false)
            }
        }
        fetchItem()
    }, [id]) // re-fetch if id changes

    // submit a claim
    const handleClaim = async () => {
        if (!claimAnswer) {
            setClaimError('Please answer the verification question')
            return
        }
        setClaimLoading(true)
        setClaimError('')
        try {
            await api.post(`/claims/${id}`, {
                answer: claimAnswer,
                message: claimMessage,
            })
            setClaimSuccess(true)
        } catch (err) {
            setClaimError(err.response?.data?.error || 'Claim failed')
        } finally {
            setClaimLoading(false)
        }
    }

    // loading state
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'var(--bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{ color: 'var(--muted)', fontSize: '15px' }}>
                    Loading item...
                </div>
            </div>
        )
    }

    // error state
    if (error || !item) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'var(--bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '16px',
            }}>
                <div style={{ fontSize: '48px' }}>🔍</div>
                <h2 style={{ color: 'var(--text)' }}>Item not found</h2>
                <Link to="/browse" style={{
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    fontWeight: 600,
                }}>
                    ← Back to Browse
                </Link>
            </div>
        )
    }

    // is this the owner viewing their own item?
    const isOwner = user && user.id === item.user_id

    // can this user claim? must be logged in and not the owner
    const canClaim = user && !isOwner && !item.is_resolved

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg)',
            padding: '40px 24px',
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Back button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ marginBottom: '24px' }}
                >
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--muted)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: 0,
                        }}
                    >
                        ← Back
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Main card */}
                    <div style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                    }}>

                        <div style={{
                            height: '320px',
                            background: '#ffffff',
                            position: 'relative',
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
                                    fontSize: '80px',
                                }}>
                                    📦
                                </div>
                            )}

                            {/* Status badge */}
                            <div style={{
                                position: 'absolute',
                                top: '16px',
                                left: '16px',
                                background: item.status === 'lost'
                                    ? 'rgba(255,71,87,0.9)'
                                    : 'rgba(46,213,115,0.9)',
                                color: '#fff',
                                padding: '6px 16px',
                                borderRadius: '100px',
                                fontSize: '13px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}>
                                {item.status}
                            </div>

                            {/* Resolved badge */}
                            {item.is_resolved && (
                                <div style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: 'rgba(245,166,35,0.9)',
                                    color: '#0F0F1A',
                                    padding: '6px 16px',
                                    borderRadius: '100px',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                }}>
                                    ✓ Resolved
                                </div>
                            )}
                        </div>

                        {/* Content section */}
                        <div style={{ padding: '32px' }}>

                            {/* Title + category */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                                gap: '16px',
                            }}>
                                <h1 style={{
                                    fontSize: '28px',
                                    fontWeight: 800,
                                    letterSpacing: '-0.5px',
                                    color: 'var(--text)',
                                }}>
                                    {item.title}
                                </h1>
                                <span style={{
                                    background: 'var(--surface2)',
                                    color: 'var(--muted)',
                                    padding: '6px 16px',
                                    borderRadius: '100px',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    flexShrink: 0,
                                }}>
                                    {item.category}
                                </span>
                            </div>

                            {/* Meta info */}
                            <div style={{
                                display: 'flex',
                                gap: '24px',
                                marginBottom: '24px',
                                flexWrap: 'wrap',
                            }}>
                                <span style={{
                                    fontSize: '14px',
                                    color: 'var(--muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}>
                                    📍 {item.location}
                                </span>
                                <span style={{
                                    fontSize: '14px',
                                    color: 'var(--muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}>
                                    👤 Posted by {item.posted_by}
                                </span>
                                <span style={{
                                    fontSize: '14px',
                                    color: 'var(--muted)',
                                }}>
                                    🗓 {new Date(item.created_at).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>

                            {/* Divider */}
                            <div style={{
                                height: '1px',
                                background: 'var(--border)',
                                marginBottom: '24px',
                            }} />

                            {/* Description */}
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: 'var(--muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    marginBottom: '10px',
                                }}>
                                    Description
                                </h3>
                                <p style={{
                                    fontSize: '16px',
                                    color: 'var(--text)',
                                    lineHeight: 1.7,
                                }}>
                                    {item.description}
                                </p>
                            </div>

                            {/* Claim button */}
                            {canClaim && (
                                <motion.button
                                    onClick={() => setShowClaim(true)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        width: '100%',
                                        background: 'var(--accent)',
                                        color: '#0F0F1A',
                                        border: 'none',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                    }}
                                >
                                    🙋 Claim This Item
                                </motion.button>
                            )}

                            {/* Owner message */}
                            {isOwner && (
                                <div style={{
                                    background: 'var(--accent-dim)',
                                    border: '1px solid rgba(245,166,35,0.2)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    textAlign: 'center',
                                    color: 'var(--accent)',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                }}>
                                    ✓ This is your item
                                </div>
                            )}

                            {/* Not logged in message */}
                            {!user && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '16px',
                                    color: 'var(--muted)',
                                    fontSize: '14px',
                                }}>
                                    <Link to="/login" style={{
                                        color: 'var(--accent)',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                    }}>
                                        Login
                                    </Link>
                                    {' '}to claim this item
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── CLAIM MODAL ── */}
            <AnimatePresence>
                {showClaim && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '24px',
                            zIndex: 200,
                        }}
                        onClick={(e) => {
                            // close modal if clicking backdrop
                            if (e.target === e.currentTarget) setShowClaim(false)
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '20px',
                                padding: '32px',
                                width: '100%',
                                maxWidth: '480px',
                            }}
                        >
                            {claimSuccess ? (
                                // success state
                                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                                        🎉
                                    </div>
                                    <h3 style={{
                                        fontSize: '20px',
                                        fontWeight: 700,
                                        marginBottom: '8px',
                                    }}>
                                        Claim submitted!
                                    </h3>
                                    <p style={{
                                        color: 'var(--muted)',
                                        fontSize: '14px',
                                        marginBottom: '24px',
                                        lineHeight: 1.6,
                                    }}>
                                        The owner will review your claim and
                                        get back to you via notification.
                                    </p>
                                    <button
                                        onClick={() => setShowClaim(false)}
                                        style={{
                                            background: 'var(--accent)',
                                            color: '#0F0F1A',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: '10px',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                        }}
                                    >
                                        Done
                                    </button>
                                </div>
                            ) : (
                                // claim form
                                <div>
                                    <h3 style={{
                                        fontSize: '20px',
                                        fontWeight: 700,
                                        marginBottom: '8px',
                                    }}>
                                        Claim this item
                                    </h3>
                                    <p style={{
                                        color: 'var(--muted)',
                                        fontSize: '14px',
                                        marginBottom: '24px',
                                    }}>
                                        Answer the verification question to prove ownership
                                    </p>

                                    {claimError && (
                                        <div style={{
                                            background: 'rgba(255,71,87,0.1)',
                                            border: '1px solid rgba(255,71,87,0.3)',
                                            color: 'var(--lost)',
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            fontSize: '14px',
                                            marginBottom: '16px',
                                        }}>
                                            {claimError}
                                        </div>
                                    )}

                                    {/* Verification question */}
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
                                            Verification Question
                                        </label>
                                        <div style={{
                                            background: 'var(--surface2)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '10px',
                                            padding: '12px 16px',
                                            fontSize: '15px',
                                            color: 'var(--text)',
                                        }}>
                                            {item.verification_question}
                                        </div>
                                    </div>

                                    {/* Answer input */}
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
                                            Your Answer
                                        </label>
                                        <input
                                            type="text"
                                            value={claimAnswer}
                                            onChange={e => setClaimAnswer(e.target.value)}
                                            placeholder="Type your answer..."
                                            style={{
                                                width: '100%',
                                                background: 'var(--surface2)',
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
                                    </div>

                                    {/* Optional message */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: 'var(--muted)',
                                            marginBottom: '8px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                        }}>
                                            Message to owner (optional)
                                        </label>
                                        <textarea
                                            value={claimMessage}
                                            onChange={e => setClaimMessage(e.target.value)}
                                            placeholder="Add any extra details..."
                                            rows={3}
                                            style={{
                                                width: '100%',
                                                background: 'var(--surface2)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '10px',
                                                padding: '12px 16px',
                                                fontSize: '15px',
                                                color: 'var(--text)',
                                                outline: 'none',
                                                resize: 'vertical',
                                            }}
                                            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                            onBlur={e => e.target.style.borderColor = 'var(--border)'}
                                        />
                                    </div>

                                    {/* Buttons */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '12px',
                                    }}>
                                        <button
                                            onClick={() => setShowClaim(false)}
                                            style={{
                                                flex: 1,
                                                background: 'var(--surface2)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text)',
                                                padding: '12px',
                                                borderRadius: '10px',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <motion.button
                                            onClick={handleClaim}
                                            disabled={claimLoading}
                                            whileHover={{ scale: claimLoading ? 1 : 1.02 }}
                                            whileTap={{ scale: claimLoading ? 1 : 0.98 }}
                                            style={{
                                                flex: 2,
                                                background: claimLoading
                                                    ? 'var(--surface2)'
                                                    : 'var(--accent)',
                                                color: claimLoading ? 'var(--muted)' : '#0F0F1A',
                                                border: 'none',
                                                padding: '12px',
                                                borderRadius: '10px',
                                                fontSize: '14px',
                                                fontWeight: 700,
                                                cursor: claimLoading ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            {claimLoading ? 'Submitting...' : 'Submit Claim →'}
                                        </motion.button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ItemDetail