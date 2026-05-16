import axios from "axios"

// create an Axios instance with base URL from .env
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api',
})

// interceptor — runs before every request
// automatically adds the JWT token to every request header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = 'Bearer ${token}'
    }
    return config
})

export default api