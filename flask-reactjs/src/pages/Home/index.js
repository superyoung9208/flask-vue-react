import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Login from '../../pages/Login'
import Alert from '../../components/Alert'
import Register from '../../pages/Register'
import Profile from '../../pages/Profile'
import EditProfile from '../../pages/EditProfile'
import Index from '../../pages/Index'
import Post from '../Post'
import store from '../../utils/store'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AuthRoute from '../../components/AuthRoute'

let alerts = [
  {
    showAlert: true,
    alertVariant: 'danger',
    alertMessage: 0
  },
  {
    showAlert: true,
    alertVariant: 'info',
    alertMessage: 1
  },
  {
    showAlert: true,
    alertVariant: 'dark',
    alertMessage: 2
  }
]

class Home extends Component {
  state = {
    userId: store.state.user_id
  }
  renderAlert = () => {
    return alerts.map(item => item.showAlert ? <Alert variant={item.alertVariant} key={item.alertVariant}>{item.alertMessage}</Alert> : null)
  }

  render() {
    return <div className="home">
      <Navbar/>
      <ToastContainer />
      {/* {this.renderAlert()} */}
      <AuthRoute exact path="/" component={Index}/>
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route path="/posts/:id" component={Post} />
      <AuthRoute path="/profile/:id" component={Profile} />
      <AuthRoute path="/edit-profile" component={EditProfile} />
      {/* <Route path="/edit-profile" component={EditProfile} /> */}
    </div>
  }
}

export default Home
