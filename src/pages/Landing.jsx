import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import heroImg from '../assets/hero.png'

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
}

const stagger = {
    visible: { transition: { staggerChildren: 0.15 } }
}

function Landing() {
    const [stats, setStats] = useState({
        total_items: 0,
        resolved_items: 0,
        total_users: 0,
    })

    useEffect(() => {
        api.get('/admin/stats')
            .then(res => setStats(res.data))
            .catch(() => {})
    }, [])

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

            {/* ── HERO SECTION ── */}
            <section style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '100px 24px 80px',
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
                            marginBottom: '28px',
                        }}>
                            🎓 Built for campus life
                        </span>
                    </motion.div>

                    {/* Headline — BIGGER */}
                    <motion.h1 variants={fadeUp} style={{
                        fontSize: 'clamp(48px, 6vw, 76px)',
                        fontWeight: 800,
                        lineHeight: 1.05,
                        letterSpacing: '-2px',
                        marginBottom: '24px',
                    }}>
                        Lost something?<br />
                        <span style={{ color: 'var(--accent)' }}>
                            We'll find it.
                        </span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p variants={fadeUp} style={{
                        fontSize: '18px',
                        color: 'var(--muted)',
                        lineHeight: 1.8,
                        marginBottom: '40px',
                        maxWidth: '440px',
                    }}>
                        Report lost or found items on campus.
                        Connect with your community and get
                        your belongings back — fast.
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
                                    padding: '16px 32px',
                                    borderRadius: '12px',
                                    fontSize: '16px',
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
                                    padding: '16px 32px',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Report Lost Item
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Stats — BIGGER */}
                    <motion.div variants={fadeUp} style={{
                        display: 'flex',
                        gap: '40px',
                        marginTop: '56px',
                        paddingTop: '32px',
                        borderTop: '1px solid var(--border)',
                    }}>
                        {[
                            { number: stats.resolved_items || '10+', label: 'Items Returned' },
                            { number: stats.total_users || '50+', label: 'Students' },
                            { number: stats.total_items || '25+', label: 'Items Posted' },
                        ].map(stat => (
                            <div key={stat.label}>
                                <div style={{
                                    fontSize: '36px',
                                    fontWeight: 800,
                                    color: 'var(--accent)',
                                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                                    letterSpacing: '-1px',
                                }}>
                                    {stat.number}
                                </div>
                                <div style={{
                                    fontSize: '13px',
                                    color: 'var(--muted)',
                                    marginTop: '4px',
                                    fontWeight: 500,
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right — hero image */}
                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    style={{
                        position: 'relative',
                        height: '520px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Glow blob */}
                    <div style={{
                        position: 'absolute',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, rgba(245,166,35,0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                    }} />

                    {/* Hero image */}
                    <motion.img
                        src={heroImg}
                        alt="FindIt hero"
                        animate={{ y: [0, -16, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            height: 'auto',
                            objectFit: 'contain',
                            position: 'relative',
                            zIndex: 1,
                            filter: 'drop-shadow(0 24px 80px rgba(245,166,35,0.2))',
                        }}
                    />
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
                    style={{ textAlign: 'center', marginBottom: '64px' }}
                >
                    <h2 style={{
                        fontSize: '48px',
                        fontWeight: 800,
                        letterSpacing: '-1px',
                        marginBottom: '16px',
                    }}>
                        How it works
                    </h2>
                    <p style={{
                        color: 'var(--muted)',
                        fontSize: '17px',
                        maxWidth: '400px',
                        margin: '0 auto',
                        lineHeight: 1.6,
                    }}>
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
                            color: 'rgba(245,166,35,0.08)',
                            border: 'rgba(245,166,35,0.2)',
                        },
                        {
                            step: '02',
                            emoji: '🔍',
                            title: 'Browse & Match',
                            desc: 'Search through reported items. Filter by category, location, or date to find your match.',
                            color: 'rgba(46,213,115,0.06)',
                            border: 'rgba(46,213,115,0.15)',
                        },
                        {
                            step: '03',
                            emoji: '🤝',
                            title: 'Claim & Reunite',
                            desc: 'Submit a claim with proof. The owner reviews and approves. Item returned.',
                            color: 'rgba(0,180,216,0.06)',
                            border: 'rgba(0,180,216,0.15)',
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            whileHover={{ y: -6 }}
                            style={{
                                background: item.color,
                                border: `1px solid ${item.border}`,
                                borderRadius: '24px',
                                padding: '40px 32px',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Step number — more visible */}
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                right: '24px',
                                fontSize: '56px',
                                fontWeight: 900,
                                color: 'rgba(255,255,255,0.06)',
                                fontFamily: 'Plus Jakarta Sans, sans-serif',
                                lineHeight: 1,
                            }}>
                                {item.step}
                            </div>

                            {/* Step pill */}
                            <div style={{
                                display: 'inline-block',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--muted)',
                                padding: '4px 12px',
                                borderRadius: '100px',
                                fontSize: '12px',
                                fontWeight: 700,
                                marginBottom: '20px',
                                letterSpacing: '1px',
                            }}>
                                STEP {item.step}
                            </div>

                            <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                                {item.emoji}
                            </div>
                            <h3 style={{
                                fontSize: '22px',
                                fontWeight: 700,
                                marginBottom: '12px',
                                color: 'var(--text)',
                            }}>
                                {item.title}
                            </h3>
                            <p style={{
                                color: 'var(--muted)',
                                fontSize: '15px',
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
                margin: '0 auto 100px',
                padding: '0 24px',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(245,166,35,0.2) 0%, rgba(46,213,115,0.12) 50%, rgba(0,180,216,0.1) 100%)',
                        border: '1px solid rgba(245,166,35,0.25)',
                        borderRadius: '28px',
                        padding: '80px 60px',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Background glow */}
                    <div style={{
                        position: 'absolute',
                        width: '600px',
                        height: '300px',
                        background: 'radial-gradient(ellipse, rgba(245,166,35,0.08) 0%, transparent 70%)',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                    }} />

                    <h2 style={{
                        fontSize: '52px',
                        fontWeight: 800,
                        marginBottom: '16px',
                        letterSpacing: '-1.5px',
                        position: 'relative',
                    }}>
                        Lost something today?
                    </h2>
                    <p style={{
                        color: 'var(--muted)',
                        fontSize: '18px',
                        marginBottom: '40px',
                        position: 'relative',
                    }}>
                        Join students already using FindIt on campus.
                        It's free, fast, and it works.
                    </p>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                        <motion.button
                            whileHover={{ scale: 1.04, background: '#E09520' }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                background: 'var(--accent)',
                                color: '#0F0F1A',
                                border: 'none',
                                padding: '18px 44px',
                                borderRadius: '14px',
                                fontSize: '17px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                position: 'relative',
                            }}
                        >
                            Get Started — It's Free →
                        </motion.button>
                    </Link>
                </motion.div>
            </section>
        </div>
    )
}

export default Landing