import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

// animation variants — reusable animation configs
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
}

const stagger = {
    visible: { transition: { staggerChildren: 0.15 } }
}

function Landing() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

            {/* ── HERO SECTION ── */}
            <section style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '80px 24px 60px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '60px',
                alignItems: 'center',
            }}>
                {/* Left — text */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Badge */}
                    <motion.div variants={fadeUp}>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'var(--accent-dim)',
                            border: '1px solid rgba(245,166,35,0.3)',
                            color: 'var(--accent)',
                            padding: '6px 14px',
                            borderRadius: '100px',
                            fontSize: '13px',
                            fontWeight: 600,
                            marginBottom: '24px',
                        }}>
                            🎓 Built for campus life
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1 variants={fadeUp} style={{
                        fontSize: 'clamp(36px, 5vw, 60px)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        letterSpacing: '-1.5px',
                        marginBottom: '20px',
                    }}>
                        Lost something?<br />
                        <span style={{ color: 'var(--accent)' }}>We'll help</span>{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, var(--found), #00B4D8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            find it.
                        </span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p variants={fadeUp} style={{
                        fontSize: '18px',
                        color: 'var(--muted)',
                        lineHeight: 1.7,
                        marginBottom: '40px',
                        maxWidth: '480px',
                    }}>
                        The smartest way to report, find, and return lost items on campus.
                        Connect with your community and get your stuff back.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div variants={fadeUp} style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap',
                    }}>
                        <Link to="/browse" style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ scale: 1.04, background: '#E09520' }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    background: 'var(--accent)',
                                    color: '#0F0F1A',
                                    border: 'none',
                                    padding: '14px 28px',
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                Browse Items →
                            </motion.button>
                        </Link>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    background: 'transparent',
                                    color: 'var(--text)',
                                    border: '1px solid var(--border)',
                                    padding: '14px 28px',
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Report Lost Item
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div variants={fadeUp} style={{
                        display: 'flex',
                        gap: '32px',
                        marginTop: '48px',
                    }}>
                        {[
                            { number: '500+', label: 'Items Returned' },
                            { number: '2k+', label: 'Students' },
                            { number: '95%', label: 'Success Rate' },
                        ].map(stat => (
                            <div key={stat.label}>
                                <div style={{
                                    fontSize: '24px',
                                    fontWeight: 800,
                                    color: 'var(--accent)',
                                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                                }}>
                                    {stat.number}
                                </div>
                                <div style={{
                                    fontSize: '13px',
                                    color: 'var(--muted)',
                                    marginTop: '2px',
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right — glass cards visual */}
                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    style={{ position: 'relative', height: '480px' }}
                >
                    {/* Glow blob */}
                    <div style={{
                        position: 'absolute',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)',
                        borderRadius: '50%',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                    }} />

                    {/* Floating cards */}
                    {[
                        { top: '10%', left: '5%', emoji: '👜', title: 'Black Backpack', status: 'lost', delay: 0 },
                        { top: '35%', right: '0%', emoji: '🔑', title: 'Room Keys', status: 'found', delay: 0.15 },
                        { top: '62%', left: '10%', emoji: '💻', title: 'MacBook Pro', status: 'lost', delay: 0.3 },
                        { top: '15%', right: '5%', emoji: '📱', title: 'iPhone 15', status: 'found', delay: 0.1 },
                    ].map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + card.delay, duration: 0.5 }}
                            style={{
                                position: 'absolute',
                                top: card.top,
                                left: card.left,
                                right: card.right,
                                background: 'rgba(26, 26, 46, 0.8)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '16px',
                                padding: '16px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                minWidth: '200px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                            }}
                        >
                            <span style={{ fontSize: '28px' }}>{card.emoji}</span>
                            <div>
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: 'var(--text)',
                                }}>
                                    {card.title}
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: card.status === 'lost' ? 'var(--lost)' : 'var(--found)',
                                    marginTop: '2px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                }}>
                                    {card.status}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '80px 24px',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: 'center', marginBottom: '60px' }}
                >
                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: 800,
                        letterSpacing: '-0.5px',
                        marginBottom: '12px',
                    }}>
                        How it works
                    </h2>
                    <p style={{ color: 'var(--muted)', fontSize: '16px' }}>
                        Three simple steps to reunite with your belongings
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '24px',
                }}>
                    {[
                        {
                            step: '01',
                            emoji: '📝',
                            title: 'Report It',
                            desc: 'Post a lost or found item with photos, location, and description in under 2 minutes.',
                        },
                        {
                            step: '02',
                            emoji: '🔍',
                            title: 'Browse & Match',
                            desc: 'Search through reported items. Filter by category, location, or date to find your match.',
                        },
                        {
                            step: '03',
                            emoji: '🤝',
                            title: 'Claim & Reunite',
                            desc: 'Submit a claim with proof. The owner reviews and approves. Item returned.',
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            whileHover={{ y: -4 }}
                            style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '20px',
                                padding: '32px',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Step number watermark */}
                            <div style={{
                                position: 'absolute',
                                top: '16px',
                                right: '20px',
                                fontSize: '48px',
                                fontWeight: 900,
                                color: 'rgba(255,255,255,0.04)',
                                fontFamily: 'Plus Jakarta Sans, sans-serif',
                                lineHeight: 1,
                            }}>
                                {item.step}
                            </div>

                            <div style={{ fontSize: '36px', marginBottom: '16px' }}>
                                {item.emoji}
                            </div>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: 700,
                                marginBottom: '10px',
                                color: 'var(--text)',
                            }}>
                                {item.title}
                            </h3>
                            <p style={{
                                color: 'var(--muted)',
                                fontSize: '14px',
                                lineHeight: 1.7,
                            }}>
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section style={{
                maxWidth: '1200px',
                margin: '0 auto 80px',
                padding: '0 24px',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(245,166,35,0.15) 0%, rgba(46,213,115,0.1) 100%)',
                        border: '1px solid rgba(245,166,35,0.2)',
                        borderRadius: '24px',
                        padding: '60px',
                        textAlign: 'center',
                    }}
                >
                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: 800,
                        marginBottom: '12px',
                        letterSpacing: '-0.5px',
                    }}>
                        Lost something today?
                    </h2>
                    <p style={{
                        color: 'var(--muted)',
                        fontSize: '16px',
                        marginBottom: '32px',
                    }}>
                        Join thousands of students already using FindIt on campus.
                    </p>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                        <motion.button
                            whileHover={{ scale: 1.04, background: '#E09520' }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                background: 'var(--accent)',
                                color: '#0F0F1A',
                                border: 'none',
                                padding: '16px 36px',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            Get Started — It's Free
                        </motion.button>
                    </Link>
                </motion.div>
            </section>
        </div>
    )
}

export default Landing