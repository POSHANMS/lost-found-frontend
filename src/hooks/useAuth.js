import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

// custom hook — instead of writing useContext(AuthContext) everywhere
// any component just writes: const { user, login, logout } = useAuth()
function useAuth() {
    return useContext(AuthContext)
}

export default useAuth