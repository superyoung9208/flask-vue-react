import React, { useState } from 'react'
import { API } from '../../utils/api'
import store from '../../utils/store'


const Register = ({history}) => {

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    usernameError: null,
    emailError: null,
    passwordError: null
  })

  const setInput = ({ target }) => {
    const value = target.value
    const name = target.id
    setRegisterForm((currentRegisterForm) => {
      return { ...currentRegisterForm, [name]: value, [name + 'Error']: null }
    })
  }

  const validEmail = email => {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const { username, email, password } = registerForm
    const formData = {}

    let error = 0
    // 验证邮箱名
    if (!username) {
      formData.usernameError = 'Username required'
      error++
    } else {
      formData.usernameError = null
    }
    // 验证邮箱
    if (!email) {
      formData.emailError = 'Email required'
      error++
    } else if (!validEmail(email)) {
      formData.emailError = 'Valid email required'
      error++
    } else {
      formData.emailError = null
    }
    // 验证密码
    if (!password) {
      formData.passwordError = 'Password required'
      error++
    } else {
      formData.passwordError = null
    }
    if (error > 0) {
      setRegisterForm({...registerForm, ...formData})
      return false
    }

    const payload = {
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password
    }

    const res = await API.post('/users', payload)

    if (res.status === 201) {
      store.setNewAction()
      history.push('/login')
    } else {
      const { message } = res.data
      const errorData = {}
      for (var field in message) {
        if (field === 'username') {
          errorData.usernameError = message.username
        } else if (field === 'email') {
          errorData.emailError = message.email
        } else {
          errorData.passwordError = message.password
        }
      }
      setRegisterForm((currentData) => {
        return {...currentData, ...errorData}
      })
    }
  }

  return (
    <div className="container">
      <h1>Register</h1>
      <div className="row">
        <div className="col-md-4">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input onChange={setInput} value={registerForm.username} type="text" className={['form-control', registerForm.usernameError ? 'is-invalid' : ''].join(" ")} id="username" placeholder="" />
              <div className="invalid-feedback">{registerForm.usernameError}</div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" onChange={setInput} value={registerForm.email} className={['form-control', registerForm.emailError ? 'is-invalid' : ''].join(" ")} id="email" aria-describedby="emailHelp" placeholder="" />
              <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
              <div className="invalid-feedback">{registerForm.emailError}</div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" onChange={setInput} value={registerForm.password} className={['form-control', registerForm.passwordError ? 'is-invalid' : ''].join(" ")} id="password" placeholder="" />
              <div className="invalid-feedback">{registerForm.passwordError}</div>
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register