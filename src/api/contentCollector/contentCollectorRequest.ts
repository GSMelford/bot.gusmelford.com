import { AxiosResponse } from 'axios'
import { httpClient } from '@/api/axiosConfig'

export const contentCollectorMethod = {
  async getContents (isViewed: boolean): Promise<AxiosResponse> {
    const url = `api/content-collector/contents?isViewed=${isViewed}`
    return await httpClient.get(url)
  }
}
