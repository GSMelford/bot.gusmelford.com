import { AxiosResponse } from 'axios'
import { httpClient } from '@/api/axiosConfig'

export const contentCollectorMethod = {
  async getContentInfo (roomCode: string): Promise<AxiosResponse> {
    const url = `api/content-collector/room/content/info?roomCode=${roomCode}`
    return await httpClient.get(url)
  },
  async createRoom (isViewed: boolean): Promise<AxiosResponse> {
    const url = `api/content-collector/room?isViewed=${isViewed}`
    return await httpClient.post(url)
  }
}
