import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (data) => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('refreshToken', data.refreshToken)
        set({
          user: {
            id: data.id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            avatar: data.avatar,
            roles: data.roles,
          },
          token: data.token,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        })
      },

      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false })
      },

      isAdmin: () => {
        const { user } = get()
        return user?.roles?.includes('ROLE_ADMIN') || false
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
