// AuthContext.jsx — the global security desk for the entire app
// Any component anywhere can ask "is user logged in?" from here
import { createContext, useState, useEffect } from "react"
import api from '../utils/api'

// Step 1: create the context — think of this as creating the security desk
export const AuthContext = createContext(null)

// Step 2: create the Provider — this wraps the whole app and shares the data
export function AuthProvider({ children }) {

    // user = the logged in user object (name, email, role etc) or null if not logged in
    const [user, setUser] = useState(null)

    // loading = true while we check if user is already logged in (on page refresh)
    const [loading, setLoading] = useState(true)

    // When app first loads, check if user is already logged in
    // We do this by calling /api/auth/me with the stored access token
    useEffect(() => {
        const token = localStorage.getItem('access_token')

        if (token) {
            // if token exists, fetch the user's info from backend
            api.get('/auth/me')
                .then(res => setUser(res.data.user))
                .catch(() => setUser(null))
                .finally(() => setLoading(false))
        } else {
            // no token = not logged in
            setLoading(false)
        }
    }, [])  // empty [] = run only once when app first loads
    
    // login function — called after successful login API response
    const login = (userData, token) => {
        localStorage.setItem('access_token', token) // save token in browser
        setUser(userData)                           // save user in state
    }

    // logout function — clears everything
    const logout = () => {
        localStorage.removeItem('access_token')     // delete token from browser
        setUser(null)                               // clear user from state
        api.post('auth/logout')                     // tell backend to revoke refresh token                
    }

    // share these values with every component in the app
    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}