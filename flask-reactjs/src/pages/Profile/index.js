import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { API } from "../../utils/api"
import { Route } from 'react-router-dom'
import store from '../../utils/store'
import Overview from './components/Overview'
import Followers from './components/Followers'
import Following from './components/Following'
import Posts from './components/Posts'
import FollowingPosts from './components/FollowingPosts'
// import FormatTime from '../../components/FormatTime'
import { toast } from 'react-toastify'
// import Alert from '../../components/Alert'


const userInitData = {
  username: '',
  email: '',
  name: '',
  location: '',
  about_me: '',
  member_since: '',
  last_seen: '',
  _links: {
    self: '',
    avatar: ''
  }
}

const navItemList = ['Overview', 'Followers', 'Following', 'Posts', 'FollowingPosts']
const navItemCountkeys = ['', 'followers_count', 'followeds_count', 'posts_count', 'followed_posts_count']
const navItemColorkeys = ['g-bg-primary', "g-bg-blue", 'g-bg-pink', 'g-bg-cyan', 'g-bg-blue']

const Profile = ({ match, history, location }) => {
  const [userData, setUserData] = useState(userInitData)
  const [currentIndex, setCurrentIndex] = useState(location.pathname)

  const getUser = useCallback(async (id) => {
    const res = await API.get(`/users/${id}`)
    if (res.status === 200) {
      setUserData(res?.data)
    } else if (res.status === 404) {
      toast.error('🦄 Not Found.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      getUser(1)
      history.push('/profile/1')
      return false
    }
    else {
      console.log(res)
    }
  }, [history])

  useEffect(() => {
    const { params } = match
    getUser(params.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.id])

  const handleFollow = async () => {
    const path = `/follow/${userData.id}`
    const resp = await API.get(path)
    const {data, status} = resp
    if(status === 200) {
      const { params } = match
      getUser(params.id)
    } else {
      console.log(data.message)
    }
  }

  const handleUnFollow = async () => {
    const path = `/unfollow/${userData.id}`
    const resp = await API.get(path)
    const {data, status} = resp
    if(status === 200) {
      const { params } = match
      getUser(params.id)
    } else {
      console.log(data.message)
    }
  }

  return (
    <div className='container'>
      <div className="g-brd-around g-brd-gray-light-v4 g-pa-20 g-mb-40">
        <div className='row'>
          <div className="col-sm-3 g-mb-40 g-mb-0--lg">
            <div className="g-mb-20">
              <img className="img-fluid w-100" src={userData._links.avatar} alt="" />
            </div>
            {
              userData.id === store.state.user_id ? <Link to="/edit-profile" className="btn btn-block u-btn-outline-primary g-rounded-50 g-py-12 g-mb-10">
                <i className="icon-user-follow g-pos-rel g-top-1 g-mr-5"></i> Setting
              </Link> : userData.is_following ?
                <button type="button" className="btn btn-block u-btn-outline-red g-rounded-50 g-py-12 g-mb-10"
                  onClick={handleUnFollow}
                >
                  <i class="icon-user-unfollow g-pos-rel g-top-1 g-mr-5"></i>
                  Unfollow
                </button>
                :
                <button type="button" className="btn btn-block u-btn-outline-primary g-rounded-50 g-py-12 g-mb-10"
                  onClick={handleFollow}
                >
                  <i class="icon-user-follow g-pos-rel g-top-1 g-mr-5"></i>
                  Follow
                </button>
            }
          </div>
          <div className="col-sm-9">
            <ul className="nav nav-tabs g-mb-20">
              {navItemList.map((item, index) => {
                return (
                  <li className="nav-item" key={item} onClick={() => setCurrentIndex(`${match.url}/${item}`)}>
                    <Link to={`${match.url}/${item}`} className={["nav-link", `${match.url}/${item}` === currentIndex && "active"].join(" ")}>
                      {item}
                      <span className={["u-label",
                        "g-font-size-11", navItemColorkeys[index], "g-rounded-20", "g-px-10"].join(" ")}>
                        {index !== 0 ? userData[navItemCountkeys[index]] : <i className="icon-layers g-pos-rel g-top-1 g-mr-8"></i>}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <Route path="/profile/:id/Overview" exact render={(props) => <Overview {...props} user={userData} />} />
            <Route path="/profile/:id/Followers" exact render={(props) => <Followers {...props} params={match.params} user={userData} />} />
            <Route path="/profile/:id/Following" exact component={Following} />
            <Route path="/profile/:id/Posts" exact component={Posts} />
            <Route path="/profile/:id/FollowingPosts" exact component={FollowingPosts} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
