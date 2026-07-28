const APP_USERNAME = import.meta.env.VITE_APP_USERNAME
const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD

export const validateCredentials = (username, password) => {
  return username === APP_USERNAME && password === APP_PASSWORD
}

export const isAuthenticated = () => {
  return sessionStorage.getItem('isAuthenticated') === 'true'
}

export const setAuthenticated = (value) => {
  if (value) {
    sessionStorage.setItem('isAuthenticated', 'true')
  } else {
    sessionStorage.removeItem('isAuthenticated')
  }
}

export const logout = () => {
  sessionStorage.removeItem('isAuthenticated')
}
