import { authMethod } from '@/api/auth/authRequest'

export default {
  state: {
    accessToken: localStorage.getItem('accessToken') || null,
    userRole: localStorage.getItem('userRole') || null,
    userFullName: localStorage.getItem('userFullName') || null
  },
  getters: {
    getToken (state: any): string {
      return state.accessToken
    },
    getAuthState (state: any): boolean {
      return state.accessToken !== null
    },
    getUserRole (state: any): string {
      return state.userRole
    },
    getUserFullName (state: any): string {
      return state.userFullName
    }
  },
  mutations: {
    setAccessToken (state: any, accessToken: string) {
      state.accessToken = accessToken
      localStorage.setItem('accessToken', accessToken)
    },
    setUserRole (state: any, userRole: string) {
      state.userRole = userRole
      localStorage.setItem('userRole', userRole)
    },
    setUserFullName (state: any, userFullName: string) {
      state.userFullName = userFullName
      localStorage.setItem('userFullName', userFullName)
    },
    deleteAccessToken (state: any) {
      state.accessToken = null
      localStorage.removeItem('accessToken')
    },
    deleteUserRole (state: any) {
      state.userRole = null
      localStorage.removeItem('userRole')
    },
    deleteUserFullName (state: any) {
      state.userFullName = null
      localStorage.removeItem('userFullName')
    }
  },
  actions: {
    async login (context: any, payload: any): Promise<boolean> {
      const response = await authMethod.login(payload)
      if (response.status === 200) {
        context.commit('setAccessToken', response.data.accessToken)
        context.commit('setUserRole', response.data.role)
        context.commit('setUserFullName', response.data.userFullName)
        return true
      }
      return false
    },
    logout (context: any) {
      context.commit('deleteAccessToken')
      context.commit('deleteUserRole')
      context.commit('deleteUserFullName')
    }
  }
}
