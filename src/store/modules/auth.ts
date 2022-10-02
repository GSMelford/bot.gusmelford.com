import { authMethod } from '@/api/auth/authRequest'

export default {
  state: {
    accessToken: localStorage.getItem('accessToken') || null,
    userRole: localStorage.getItem('userRole') || null,
    userFullName: localStorage.getItem('userFullName') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    tokenExpiredIn: localStorage.getItem('tokenExpiredIn') || null
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
    },
    getRefreshToken (state: any): string {
      return state.refreshToken
    },
    getTokenExpiredIn (state: any): string {
      return state.tokenExpiredIn
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
    setRefreshToken (state: any, refreshToken: string) {
      state.refreshToken = refreshToken
      localStorage.setItem('refreshToken', refreshToken)
    },
    setTokenExpiredIn (state: any, tokenExpiredIn: string) {
      state.tokenExpiredIn = tokenExpiredIn
      localStorage.setItem('tokenExpiredIn', tokenExpiredIn)
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
    },
    deleteRefreshToken (state: any) {
      state.refreshToken = null
      localStorage.removeItem('refreshToken')
    },
    deleteTokenExpiredIn (state: any) {
      state.tokenExpiredIn = null
      localStorage.removeItem('tokenExpiredIn')
    }
  },
  actions: {
    async login (context: any, payload: any): Promise<boolean> {
      const response = await authMethod.login(payload)
      if (response.status === 200) {
        context.commit('setAccessToken', response.data.accessToken)
        context.commit('setUserRole', response.data.role)
        context.commit('setUserFullName', response.data.userFullName)
        context.commit('setRefreshToken', response.data.refreshToken)
        context.commit('setTokenExpiredIn', response.data.expiredIn)
        return true
      }
      return false
    },
    logout (context: any) {
      context.commit('deleteAccessToken')
      context.commit('deleteUserRole')
      context.commit('deleteUserFullName')
      context.commit('deleteRefreshToken')
      context.commit('deleteTokenExpiredIn')
    },
    async refreshTokenIfExpired (context: any): Promise<boolean> {
      if (Date.parse(context.getters.getTokenExpiredIn) <= Date.now()) {
        let response
        try {
          response = await authMethod.refreshToken({
            accessToken: context.getters.getToken,
            refreshToken: context.getters.getRefreshToken
          })
          context.commit('setAccessToken', response.data.accessToken)
          context.commit('setUserRole', response.data.role)
          context.commit('setUserFullName', response.data.userFullName)
          context.commit('setRefreshToken', response.data.refreshToken)
          context.commit('setTokenExpiredIn', response.data.expiredIn)
          return true
        } catch (AxiosError) {
          console.log('401')
          return false
        }
      }
      return true
    }
  }
}
