import axios from 'axios'
import { getToken, removeToken } from './auth'
import store from './store'
// import { BASE_URL } from './url'
// getToken

const API = axios.create({
    baseURL: '/api'
})

API.interceptors.request.use( config => {    
    const token = getToken()
    console.log(token)
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

API.interceptors.response.use( response => {
    return response
}, error => {
    console.log(error.response)
    switch (error.response.status) {
      case 401:
        store.logoutAction()
        removeToken()
        break
      case 400:
        store.logoutAction()
        removeToken()
        break
      default:
        break
    }
    return Promise.resolve(error.response)
}) 

export { API }
