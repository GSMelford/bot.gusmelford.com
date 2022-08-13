import { AxiosResponse } from 'axios'
import { httpClient } from '@/api/axiosConfig'

export const authMethod = {
  async login (data: { telegramId: number, password: string }): Promise<AxiosResponse> {
    const url = 'api/auth/login'
    return await httpClient.post(url, data)
  }
}
