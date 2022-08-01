import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import logo from '../../assets/logo.jpeg'
import store from '../../utils/store'
import styles from './index.module.css'

class Navbar extends Component {
  state = {
    sharedState: store.state
  }

  handlerLogout() {
    const { history } = this.props
    store.logoutAction()
    history.push('/login')
  }

  renderIsLoginButton() {
    // 登陆后显示退出按钮，未登录显示登陆
    if (!store.state.is_authenticated) {
      return <li className="nav-item">
        <Link className="nav-link" to="/login">Login</Link>
      </li>
    } else return <li className="nav-item">
      <div className="nav-link" onClick={() => this.handlerLogout()}>Loginout</div>
    </li>
  }

  render() {
    return (
      <nav className={"navbar navbar-expand-lg navbar-light bg-light "+ styles.navBottom}>
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo} width="30px" height="30px" className="d-inline-block align-top" alt="" />
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item active">
                <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link disabled" to="/#">Explore</Link>
              </li>
            </ul>
            <form className="form-inline navbar-left mr-auto">
              <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
            <ul className="nav navbar-nav navbar-right">
              <li className="nav-item">
                <Link className="nav-link disabled" to="/#">Message</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/profile/${this.state.sharedState.user_id}/Overview`}>Profile</Link>
              </li>
              {
                this.renderIsLoginButton()
              }
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(Navbar)