export default {
  state: {
    roomCode: localStorage.getItem('roomCode') || null
  },
  getters: {
    getRoomCode (state: any): string {
      return state.roomCode
    }
  },
  mutations: {
    setRoomCode (state: any, roomCode: string) {
      state.roomCode = roomCode
      localStorage.setItem('roomCode', roomCode)
    },
    deleteRoomCode (state: any) {
      state.roomCode = null
      localStorage.removeItem('roomCode')
    }
  },
  actions: {
    saveRoomCode (context: any, payload: string) {
      context.commit('setRoomCode', payload)
    }
  }
}
