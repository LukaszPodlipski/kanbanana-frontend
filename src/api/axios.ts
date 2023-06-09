import axios, { AxiosInstance } from 'axios'
import stores  from '@/stores'

export const axiosApi: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
  timeout: 5000,
  // Add any other configurations you need
  transformResponse: [
    function transformResponse(data) {
      return data ? JSON.parse(data) || {} : {}
    },
  ],
})

export function authorizeAxios(token: string) {
  axiosApi.defaults.headers.common['Authorization'] = token
}

export function deauthorizeAxios() {
  delete axiosApi.defaults.headers.common['Authorization']
}

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = stores.useAuthStore();
      authStore.logout();
    }
    return Promise.reject(error);
  }
);