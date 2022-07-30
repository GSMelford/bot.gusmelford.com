import { AxiosResponse } from 'axios'
import { httpClient } from '@/api/axiosConfig'

export const contentCollectorMethod = {
  async getContents (isViewed: boolean): Promise<AxiosResponse> {
    const url = `api/content-collector/contents?isViewed=${isViewed}`
    return await httpClient.get(url)
  },
  async getInfo (isViewed: boolean): Promise<AxiosResponse> {
    const url = `api/content-collector/info?isViewed=${isViewed}`
    return await httpClient.get(url)
  }
}
