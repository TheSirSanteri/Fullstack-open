import axios from 'axios'
const baseUrl = '/api/login'

const login = async (credentials) => {
  try {
    const response = await axios.post(baseUrl, credentials)
    return response.data
  } catch (error) {
    const message = error.response?.data?.error || 'login failed'
    throw new Error(message)
  }
}

export default { login }