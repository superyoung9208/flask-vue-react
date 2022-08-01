const TOKEN_NAME = 'madblog_token'

const getToken = () => localStorage.getItem(TOKEN_NAME)

const setToken = value => localStorage.setItem(TOKEN_NAME, value)

const removeToken = () => localStorage.removeItem(TOKEN_NAME)

const isAuth = () => !!getToken()

export {getToken, setToken, removeToken, isAuth}
