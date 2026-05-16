import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import useAuth from '../hooks/useAuth'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// fix leaflet's default marker icon broken in Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// categories must match exactly what your backend allows
const CATEGORIES = [
    'Electronics', 'Documents', 'Accessories',
    'Clothing', 'Keys', 'Bags', 'Other'
]

// which step the user is on — 3 total
const STEPS = ['Item Details', 'Photo & Location', 'Verification']

// MapPicker — handles click events on the map
function ClickHandler({ onLocationSelect }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng)
        },
    })
    return null
}

function MapPicker({ onLocationSelect, selectedLat, selectedLng }) {
    const defaultCenter = [12.9716, 77.5946]
    const [searchQuery, setSearchQuery] = useState('')
    const [searching, setSearching] = useState(false)
    const [mapCenter, setMapCenter] = useState(defaultCenter)
    const [zoom, setZoom] = useState(13)
    const mapRef = useRef(null)

    // search for a place by name
    const handleSearch = async () => {
        if (!searchQuery.trim()) return
        setSearching(true)
        try {
            // use OpenStreetMap Nominatim free geocoding API
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
            )
            const data = await res.json()
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat)
                const lng = parseFloat(data[0].lon)
                setMapCenter([lat, lng])
                setZoom(16)
                onLocationSelect(lat, lng)
                // move the map to the new location
                if (mapRef.current) {
                    mapRef.current.setView([lat, lng], 16)
                }
            } else {
                alert('Place not found. Try a different search.')
            }
        } catch (err) {
            alert('Search failed. Check your connection.')
        } finally {
            setSearching(false)
        }
    }

    // get user's current GPS location
    const handleMyLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation not supported by your browser')
            return
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude
                const lng = pos.coords.longitude
                setMapCenter([lat, lng])
                setZoom(17)
                onLocationSelect(lat, lng)
                if (mapRef.current) {
                    mapRef.current.setView([lat, lng], 17)
                }
            },
            () => alert('Could not get your location. Please allow location access.')
        )
    }

    return (
        <div>
            {/* Search bar */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '10px',
            }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="Search for a place... e.g. Library, Hostel Block A"
                    style={{
                        flex: 1,
                        background: 'var(--surface2)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        fontSize: '14px',
                        color: 'var(--text)',
                        outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={searching}
                    style={{
                        background: 'var(--accent)',
                        color: '#0F0F1A',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: searching ? 'not-allowed' : 'pointer',
                    }}
                >
                    {searching ? '...' : '🔍'}
                </button>
                <button
                    type="button"
                    onClick={handleMyLocation}
                    style={{
                        background: 'var(--surface2)',
                        color: 'var(--text)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                    }}
                >
                    📍 My Location
                </button>
            </div>

            {/* Map */}
            <div style={{
                height: '260px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border)',
            }}>
                <MapContainer
                    center={mapCenter}
                    zoom={zoom}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="© OpenStreetMap"
                    />
                    <ClickHandler onLocationSelect={onLocationSelect} />
                    {selectedLat && selectedLng && (
                        <Marker position={[selectedLat, selectedLng]} />
                    )}
                </MapContainer>
            </div>
        </div>
    )
}

function PostItem() {
    const [uploadingImage, setUploadingImage] = useState(false)
    const fileInputRef = useRef(null)
    const navigate = useNavigate()
    const { user } = useAuth()

    // current step — 0, 1, or 2
    const [step, setStep] = useState(0)

    // all form data lives in one object
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        status: 'lost',              // 'lost' or 'found'
        location_name: '',
        latitude: null,
        longitude: null,
        image_url: '',
        image_public_id: '',
        verification_question: '',
        verification_answer: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // update any field by name
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
    }

    // move to next step
    const nextStep = () => {
        // basic validation before moving forward
        if (step === 0) {
            if (!form.title || !form.description || !form.category) {
                setError('Please fill all fields before continuing')
                return
            }
        }
        if (step === 1) {
            if (!form.location_name) {
                setError('Please enter a location name')
                return
            }
        }
        setError('')
        setStep(step + 1)
    }

    const prevStep = () => setStep(step - 1)

    // final submit — sends everything to Flask backend
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.verification_question || !form.verification_answer) {
            setError('Verification question and answer are required')
            return
        }
        setLoading(true)

        try {
            const formData = new FormData()
            formData.append('title', form.title)
            formData.append('description', form.description)
            formData.append('category', form.category)
            formData.append('status', form.status)
            formData.append('location', form.location_name)
            formData.append('verification_question', form.verification_question)
            formData.append('verification_answer', form.verification_answer)
            if (form.latitude) formData.append('latitude', form.latitude)
            if (form.longitude) formData.append('longitude', form.longitude)

            if (form.image_url) formData.append('image_url', form.image_url)
            if (form.image_public_id) formData.append('image_public_id', form.image_public_id)

            await api.post('/items/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            navigate('/browse')
        } catch (err) {
            setError(err.response?.data?.error ||
                    JSON.stringify(err.response?.data?.errors) ||
                    'Failed to post item')
        } finally {
            setLoading(false)
        }
    }

    // opens the file picker when user clicks the upload area
    const handleImageUpload = () => {
        if (!uploadingImage) fileInputRef.current.click()
    }

    // called when user picks a file
    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploadingImage(true)

        try {
            // build FormData for Cloudinary
            const cloudinaryForm = new FormData()
            cloudinaryForm.append('file', file)
            cloudinaryForm.append(
                'upload_preset',
                import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
            )

            // send directly to Cloudinary — NOT to Flask
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: cloudinaryForm,
                }
            )

            const data = await res.json()

            if (data.secure_url) {
                // save the URL and public_id in our form state
                setForm(prev => ({
                    ...prev,
                    image_url: data.secure_url,
                    image_public_id: data.public_id,
                }))
            } else {
                setError('Image upload failed. Try again.')
            }
        } catch (err) {
            setError('Image upload failed. Check your connection.')
        } finally {
            setUploadingImage(false)
        }
    }

    // if not logged in, show message
    if (!user) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg)',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
                    <h2 style={{ marginBottom: '8px' }}>Login required</h2>
                    <p style={{ color: 'var(--muted)' }}>
                        You must be logged in to post an item
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg)',
            padding: '40px 24px',
        }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                {/* Page title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '32px' }}
                >
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 800,
                        letterSpacing: '-0.5px',
                        marginBottom: '8px',
                    }}>
                        Post an Item
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
                        Help your campus community find lost belongings
                    </p>
                </motion.div>

                {/* Step indicator */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '32px',
                    gap: '0',
                }}>
                    {STEPS.map((label, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            flex: i < STEPS.length - 1 ? 1 : 'none',
                        }}>
                            {/* circle */}
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: i <= step ? 'var(--accent)' : 'var(--surface2)',
                                border: `2px solid ${i <= step ? 'var(--accent)' : 'var(--border)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px',
                                fontWeight: 700,
                                color: i <= step ? '#0F0F1A' : 'var(--muted)',
                                flexShrink: 0,
                                transition: 'all 0.3s',
                            }}>
                                {i < step ? '✓' : i + 1}
                            </div>

                            {/* label below circle */}
                            <span style={{
                                fontSize: '12px',
                                color: i <= step ? 'var(--accent)' : 'var(--muted)',
                                marginLeft: '8px',
                                fontWeight: i <= step ? 600 : 400,
                                whiteSpace: 'nowrap',
                                transition: 'all 0.3s',
                            }}>
                                {label}
                            </span>

                            {/* connector line between steps */}
                            {i < STEPS.length - 1 && (
                                <div style={{
                                    flex: 1,
                                    height: '2px',
                                    background: i < step ? 'var(--accent)' : 'var(--border)',
                                    margin: '0 12px',
                                    transition: 'background 0.3s',
                                }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form card */}
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
                                background: 'rgba(255,71,87,0.1)',
                                border: '1px solid rgba(255,71,87,0.3)',
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

                    <AnimatePresence mode="wait">

                        {/* ── STEP 1 — Item Details ── */}
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                            >
                                {/* Lost or Found toggle */}
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={labelStyle}>Item Status</label>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '12px',
                                    }}>
                                        {['lost', 'found'].map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setForm({ ...form, status: s })}
                                                style={{
                                                    padding: '12px',
                                                    borderRadius: '10px',
                                                    border: `2px solid ${form.status === s
                                                        ? (s === 'lost' ? 'rgba(255,71,87,0.6)' : 'rgba(46,213,115,0.6)')
                                                        : 'var(--border)'}`,
                                                    background: form.status === s
                                                        ? (s === 'lost' ? 'rgba(255,71,87,0.1)' : 'rgba(46,213,115,0.1)')
                                                        : 'var(--surface2)',
                                                    color: form.status === s
                                                        ? (s === 'lost' ? 'var(--lost)' : 'var(--found)')
                                                        : 'var(--muted)',
                                                    fontSize: '15px',
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    textTransform: 'capitalize',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {s === 'lost' ? '😢 Lost' : '🎉 Found'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Title */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={labelStyle}>Item Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Black JBL Earphones"
                                        style={inputStyle}
                                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                                    />
                                </div>

                                {/* Description */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={labelStyle}>Description</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Describe the item in detail — color, brand, any unique marks..."
                                        rows={4}
                                        style={{
                                            ...inputStyle,
                                            resize: 'vertical',
                                            lineHeight: 1.6,
                                        }}
                                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                                    />
                                </div>

                                {/* Category */}
                                <div style={{ marginBottom: '8px' }}>
                                    <label style={labelStyle}>Category</label>
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '8px',
                                    }}>
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setForm({ ...form, category: cat })}
                                                style={{
                                                    padding: '6px 16px',
                                                    borderRadius: '100px',
                                                    border: `1px solid ${form.category === cat
                                                        ? 'rgba(245,166,35,0.5)'
                                                        : 'var(--border)'}`,
                                                    background: form.category === cat
                                                        ? 'var(--accent-dim)'
                                                        : 'var(--surface2)',
                                                    color: form.category === cat
                                                        ? 'var(--accent)'
                                                        : 'var(--muted)',
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ── STEP 2 — Photo & Location ── */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                            >
                                {/* Image upload placeholder — Cloudinary comes next */}
                                {/* Cloudinary Image Upload */}
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={labelStyle}>Item Photo</label>

                                    {form.image_url ? (
                                        // show uploaded image with option to change
                                        <div style={{
                                            border: '1px solid var(--border)',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            position: 'relative',
                                        }}>
                                            <img
                                                src={form.image_url}
                                                alt="uploaded"
                                                style={{
                                                    width: '100%',
                                                    maxHeight: '240px',
                                                    objectFit: 'cover',
                                                    display: 'block',
                                                }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '12px',
                                                right: '12px',
                                                display: 'flex',
                                                gap: '8px',
                                            }}>
                                                <button
                                                    type="button"
                                                    onClick={() => setForm({
                                                        ...form,
                                                        image_url: '',
                                                        image_public_id: ''
                                                    })}
                                                    style={{
                                                        background: 'rgba(255,71,87,0.9)',
                                                        color: '#fff',
                                                        border: 'none',
                                                        padding: '6px 14px',
                                                        borderRadius: '8px',
                                                        fontSize: '13px',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <div style={{
                                                position: 'absolute',
                                                top: '12px',
                                                left: '12px',
                                                background: 'rgba(46,213,115,0.9)',
                                                color: '#fff',
                                                padding: '4px 12px',
                                                borderRadius: '100px',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                            }}>
                                                ✓ Uploaded
                                            </div>
                                        </div>
                                    ) : (
                                        // upload area
                                        <div
                                            onClick={handleImageUpload}
                                            style={{
                                                border: '2px dashed var(--border)',
                                                borderRadius: '12px',
                                                padding: '48px 24px',
                                                textAlign: 'center',
                                                background: 'var(--surface2)',
                                                cursor: uploadingImage ? 'not-allowed' : 'pointer',
                                                transition: 'border-color 0.2s',
                                            }}
                                            onMouseEnter={e => {
                                                if (!uploadingImage)
                                                    e.currentTarget.style.borderColor = 'var(--accent)'
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = 'var(--border)'
                                            }}
                                        >
                                            {uploadingImage ? (
                                                <div>
                                                    <div style={{
                                                        fontSize: '32px',
                                                        marginBottom: '12px',
                                                    }}>⏳</div>
                                                    <p style={{
                                                        color: 'var(--accent)',
                                                        fontSize: '14px',
                                                        fontWeight: 600,
                                                    }}>
                                                        Uploading to Cloudinary...
                                                    </p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{
                                                        fontSize: '40px',
                                                        marginBottom: '12px',
                                                    }}>📷</div>
                                                    <p style={{
                                                        color: 'var(--text)',
                                                        fontSize: '15px',
                                                        fontWeight: 600,
                                                        marginBottom: '6px',
                                                    }}>
                                                        Click to upload photo
                                                    </p>
                                                    <p style={{
                                                        color: 'var(--muted)',
                                                        fontSize: '13px',
                                                    }}>
                                                        JPG, PNG up to 10MB · Optional
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* hidden file input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                </div>

                                {/* Location name */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={labelStyle}>Location Name</label>
                                    <input
                                        type="text"
                                        name="location_name"
                                        value={form.location_name}
                                        onChange={handleChange}
                                        placeholder="e.g. Library Block B, Ground Floor"
                                        style={inputStyle}
                                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                                    />
                                </div>

                                {/* Leaflet Map */}
                                <div>
                                    <label style={labelStyle}>Pin on Map (optional)</label>
                                    <p style={{
                                        fontSize: '13px',
                                        color: 'var(--muted)',
                                        marginBottom: '10px',
                                    }}>
                                        Click on the map to drop a pin at the exact location
                                    </p>
                                    <MapPicker
                                            onLocationSelect={(lat, lng) => {
                                                setForm(prev => ({ ...prev, latitude: lat, longitude: lng }))
                                            }}
                                            selectedLat={form.latitude}
                                            selectedLng={form.longitude}
                                        />
                                    {form.latitude && (
                                        <p style={{
                                            fontSize: '12px',
                                            color: 'var(--found)',
                                            marginTop: '8px',
                                        }}>
                                            ✓ Location pinned: {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* ── STEP 3 — Verification ── */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                            >
                                {/* Explanation */}
                                <div style={{
                                    background: 'var(--accent-dim)',
                                    border: '1px solid rgba(245,166,35,0.2)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '24px',
                                }}>
                                    <p style={{
                                        fontSize: '14px',
                                        color: 'var(--accent)',
                                        fontWeight: 600,
                                        marginBottom: '4px',
                                    }}>
                                        🔐 Why a verification question?
                                    </p>
                                    <p style={{
                                        fontSize: '13px',
                                        color: 'var(--muted)',
                                        lineHeight: 1.6,
                                    }}>
                                        When someone claims this item, they must answer this question correctly.
                                        Only the real owner would know. This prevents false claims.
                                    </p>
                                </div>

                                {/* Verification question */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={labelStyle}>Verification Question</label>
                                    <input
                                        type="text"
                                        name="verification_question"
                                        value={form.verification_question}
                                        onChange={handleChange}
                                        placeholder="e.g. What sticker is on the back of this laptop?"
                                        style={inputStyle}
                                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                                    />
                                </div>

                                {/* Verification answer */}
                                <div style={{ marginBottom: '8px' }}>
                                    <label style={labelStyle}>Answer (kept secret)</label>
                                    <input
                                        type="text"
                                        name="verification_answer"
                                        value={form.verification_answer}
                                        onChange={handleChange}
                                        placeholder="e.g. A NASA sticker"
                                        style={inputStyle}
                                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                                    />
                                    <p style={{
                                        fontSize: '12px',
                                        color: 'var(--muted)',
                                        marginTop: '6px',
                                    }}>
                                        This answer is never shown publicly
                                    </p>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>

                    {/* Navigation buttons */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '32px',
                        gap: '12px',
                    }}>
                        {/* Back button */}
                        {step > 0 && (
                            <motion.button
                                type="button"
                                onClick={prevStep}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    background: 'var(--surface2)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text)',
                                    padding: '12px 24px',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                ← Back
                            </motion.button>
                        )}

                        {/* Next or Submit button */}
                        <motion.button
                            type="button"
                            onClick={step === 2 ? handleSubmit : nextStep}
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            style={{
                                background: loading ? 'var(--surface2)' : 'var(--accent)',
                                color: loading ? 'var(--muted)' : '#0F0F1A',
                                border: 'none',
                                padding: '12px 28px',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                marginLeft: 'auto',
                                transition: 'background 0.2s',
                            }}
                        >
                            {step === 2
                                ? (loading ? 'Posting...' : 'Post Item →')
                                : 'Continue →'
                            }
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// shared styles — defined once, used by all inputs
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

export default PostItem