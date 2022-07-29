import axios from 'axios'
import { systemConstants } from '@/api/constants'

const config = {
  baseURL: systemConstants.baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
}

const httpClient = axios.create(config)

export { httpClient }
