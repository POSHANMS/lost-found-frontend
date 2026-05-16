import { createContext, useState, useEffect } from 'react'
import api, { socket } from '../utils/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    // notification count for navbar badge
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        if (token) {
            api.get('/auth/me')
                .then(res => {
                    setUser(res.data.user)
                    connectSocket(res.data.user)
                })
                .catch(() => setUser(null))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const connectSocket = (userData) => {
        // connect socket and join user's personal room
        socket.connect()
        socket.emit('join', { user_id: userData.id })

        // listen for new notifications
        socket.on('notification', (data) => {
            setUnreadCount(prev => prev + 1)
            // show browser notification if permission granted
            if (Notification.permission === 'granted') {
                new Notification('FindIt', { body: data.message })
            }
        })
    }

    const login = (userData, token) => {
        localStorage.setItem('access_token', token)
        setUser(userData)
        connectSocket(userData)
    }

    const logout = () => {
        localStorage.removeItem('access_token')
        setUser(null)
        setUnreadCount(0)
        socket.disconnect()
        api.post('/auth/logout')
    }

    return (
        <AuthContext.Provider value={{
            user, setUser, login, logout, loading, unreadCount, setUnreadCount
        }}>
            {children}
        </AuthContext.Provider>
    )
}