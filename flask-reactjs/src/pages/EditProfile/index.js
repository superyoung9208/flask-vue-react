import React from 'react'
import store from '../../utils/store'
import { API } from '../../utils/api'
import { Formik } from 'formik';
import { toast } from 'react-toastify'

class EditProfile extends React.Component {
  state = {
    shareState: store.state,
    profileForm: {
      name: '',
      location: '',
      about_me: '',
    }
  }

  componentDidMount() {
    var userId = this.state.shareState.user_id
    this.getUser(userId)
  }

  async getUser(id) {
    const res = await API.get(`/users/${id}`)
    if (res.status === 200) {
      this.setState({
        profileForm: res.data
      })
    }
    else {
      console.log(res)
    }
  }

  render() {
    const { name, location, about_me, id} = this.state.profileForm
    const {history} = this.props
    return (
      <div className="container">
        <h1>Edit Your Profile</h1>
        <div className="row">
          <div className="col-md-4">
            <Formik
              enableReinitialize
              initialValues={{ name: name, location: location, about_me: about_me }}
              onSubmit={async (values) => {
                const {name, location, about_me} = values
                const res = await API.put(`/users/${id}`, {name,location,about_me})
                if (res.status === 200) {
                  toast.success('🦄 Successed modify your profile.', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  })
                  history.push('/')
                } else {
                  toast.error('🦄 Modify fail.', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  })
                }
              }}
            >{props => (
              <form onSubmit={props.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Real Name</label>
                  <input
                    type="text"
                    className="form-control" 
                    name="name"
                    value={props.values.name}
                    onChange={props.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location">location</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="location" 
                    value={props.values.location}
                    onChange={props.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="about_me">location</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="about_me" 
                    value={props.values.about_me}
                    onChange={props.handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            )}
            </Formik>
            {/* <form onSubmit={(e) => this.HandleSubmit(e)}>
              <div className="form-group">
                <label htmlFor="name">Real Name</label>
                <input type="text" className="form-control" id="name" placeholder="" value={name ? name : ''} onChange={(e) => this.setInput(e)}/>
              </div>
              <div className="form-group">
                <label htmlFor="location">location</label>
                <input type="text" className="form-control" id="location" placeholder="" value={location ? location : ''} onChange={(e) => this.setInput(e)}/>
              </div>
              <div className="form-group">
                <label htmlFor="about_me">About Me</label>
                <textarea className="form-control" id="about_me" rows="5" placeholder="" value={about_me ? about_me : ''} onChange={(e) => this.setInput(e)}></textarea>
              </div>
              <button type="submit"  className="btn btn-primary">Submit</button>
            </form> */}
          </div>
        </div>
      </div>
    )
  }
}

// EditProfile = withFormik({
//   mapPropsToValues: () => {
//     var userId = store.state.user_id
//     // const res = await API.get(`/api/users/${userId}`)
//     let initialValues = { name: '', location: '', about_me: '' }
//     API.get(`/api/users/${userId}`).then((response) => {
//       initialValues.name = response.data.name
//       initialValues.about_me = response.data.about_me
//       initialValues.location = response.data.location
//     }).catch( error => {
//       console.log(error.response)
//     })
//     console.log(initialValues)
//     return initialValues
//   },
// mapPropsToValues: async () => {
//   return {
//     name: 123,
//     location: 123,
//     about_me: 123
//   }
//   // var userId = store.state.user_id
//   // const res = await API.get(`/api/users/${userId}`)
//   // if (res.status === 200) {
//   //   let name = res.data.name
//   //   let location = res.data.location
//   //   let about_me = res.data.about_me
//   //   console.log(name, location, about_me)
//   //   return {name: 'name',location: 'location' ,about_me: 'about_me'}
//   // } else {
//   //   return { name: '', location: '', about_me: ''}
//   // }
//   // return {name: 'name',location: 'location' ,about_me: 'about_me'}
// },

// // Custom sync validation
// validationSchema: Yup.object().shape({
//   username: Yup.string()
//     .required('username required'),
//   password: Yup.string()
//     .required('passworld required'),
// }),

//   handleSubmit: async (values, { setSubmitting, props, setFieldError }) => {
//     const {username, password} = values
//     const auth = {
//       username: username,
//       password: password
//     }
//     const res = await API.post('/api/tokens',{},
//     {auth})
//     const {status, data} = res
//     if (status === 200){
//       // setToken(data.token)
//       store.loginAction()
//       setSubmitting(false)
//       const name = JSON.parse(atob(data.token.split('.')[1])).user_name
//       toast.success(`🦄 Welcome ${name}`, {
//         position: "top-center",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         });
//       props.history.push('/')
//     } else {
//       setFieldError("username", 'Invalid username or password.')
//       setFieldError("password", 'Invalid username or password.')
//     }
//   }
// })(EditProfile)


export default EditProfile