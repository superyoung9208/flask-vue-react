export default {
  debug: true,
  state: {
    is_new: false,
    is_authenticated: window.localStorage.getItem('madblog-token'),
    user_id: window.localStorage.getItem('madblog-token') ? JSON.parse(atob(window.localStorage.getItem('madblog-token').split('.')[1])).user_id : 0,
    user_name: window.localStorage.getItem('madblog-token') ? JSON.parse(atob(window.localStorage.getItem('madblog-token').split('.')[1])).user_name : '',
    user_avatar: window.localStorage.getItem('madblog-token') ? atob(JSON.parse(atob(window.localStorage.getItem('madblog-token').split('.')[1])).user_avatar) : ''
  },

  setNewAction () {
    if (this.debug) { console.log('setNewAction triggered') }
    this.state.is_new = true
  },
  resetNotNewAction () {
    if (this.debug) { console.log('resetNotNewAction triggered') }
    this.state.is_new = false
  },
  loginAction () {
    if (this.debug) { console.log('loginAction triggered') }
    this.state.is_authenticated = true
    this.state.user_id = JSON.parse(window.atob(window.localStorage.getItem('madblog-token').split('.')[1])).user_id
  },
  logoutAction () {
    if (this.debug) console.log('logoutAction triggered')
    window.localStorage.removeItem('madblog-token')
    this.state.is_authenticated = false
    this.state.user_id = 0
  }
}
