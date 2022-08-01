import React from 'react'
import { Link } from 'react-router-dom'
import { API } from '../../utils/api'
import { setToken } from '../../utils/auth'
import { Field, Form, ErrorMessage, withFormik } from 'formik';
import store from '../../utils/store'
import * as Yup from 'yup';
import { toast } from 'react-toastify'


let Login = ({errors, touched, isSubmitting}) => {
  return (
      <div className="container">
        <h1>Sign In</h1>
        <div className="row">
          <div className="col-md-4">
            <Form>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Field type="text"
                  className={["form-control", errors.username && touched.username && "is-invalid"].join(" ")}
                  name="username" placeholder=""/>
                {/* <div className="invalid-feedback">{loginForm.usernameError ? loginForm.usernameError : null}</div> */}
                <ErrorMessage name="username" className="invalid-feedback" component="div"/>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field type="password"
                  className={["form-control", errors.password && touched.password && "is-invalid"].join(" ")}
                  name="password" placeholder=""/>
                <ErrorMessage name="password" className="invalid-feedback" component="div"/>
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Sign In</button>
            </Form>
          </div>
        </div>
        <br/>
        <p>New User? <Link to="register">Click to Register</Link></p>
        <p>
           Forgot Your Password?
           <Link to="register">Click to Reset It</Link>
        </p>
      </div>
  )
}

Login = withFormik({
  mapPropsToValues: () => ({ username: undefined ,password: undefined}),

  // Custom sync validation
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required('username required'),
    password: Yup.string()
      .required('passworld required'),
  }),

  handleSubmit: async (values, { setSubmitting, props, setFieldError }) => {
    const {username, password} = values
    const auth = {
      username: username,
      password: password
    }
    const res = await API.get('/tokens',{auth})
    const {status, data} = res
    if (status === 200){
      setToken(data.token)
      store.loginAction()
      setSubmitting(false)
      const name = JSON.parse(atob(data.token.split('.')[1])).user_name
      toast.success(`🦄 Welcome ${name}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
      if (!props.location.state) {
        props.history.push('/')
      } else {
        props.history.push(props.location.state.from.pathname)
      }
    } else {
      setFieldError("username", 'Invalid username or password.')
      setFieldError("password", 'Invalid username or password.')
    }
  }
})(Login);


export default Login