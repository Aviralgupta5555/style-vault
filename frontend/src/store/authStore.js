import { create } from 'zustand'

const useAuthStore = create((set) => {
  const storedToken = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  return {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!(storedToken && storedToken.length > 10),

  login: (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    set({ user: userData, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null, isAuthenticated: false })
  },
  }
})



export default useAuthStore
