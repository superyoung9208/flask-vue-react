import { getToken, removeToken } from "./auth"

const store = {
  debug: true,
  state: {
    is_new: false,
    is_authenticated: getToken(),
    user_id: getToken() ? JSON.parse(atob(getToken().split('.')[1])).user_id : 0
  },


  setNewAction() {
    if (this.debug) { console.log('setNewAction triggered') }
    this.state.is_new = true
  },

  // resetNotNewAction() {
  //   if (this.debug) { console.log('resetNotNewAction triggered') }
  //   this.state.is_new = false
  // },

  loginAction() {
    if (this.debug) {console.log('loginAction triggered') }
    this.state.is_authenticated = true
    this.state.user_id = JSON.parse(atob(getToken().split('.')[1])).user_id
  },

  logoutAction() {
    if (this.debug) {console.log('logoutAction triggered')}
    removeToken()
    this.state.is_authenticated = false
    this.state.user_id = 0
  }

}

export default store