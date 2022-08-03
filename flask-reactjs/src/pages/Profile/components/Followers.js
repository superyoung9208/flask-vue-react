import React, { useEffect, useState } from 'react'
// import PostItem from '../../../components/PostItem'
import { API } from "../../../utils/api"

const Followers = ({ params, editpost, deletePost, user }) => {

  const [followers, setFollowers] = useState({})

  useEffect(() => {
    user.id && getUserFollowers(user.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id])

  const getUserFollowers = (id) => {
    let page = params.page ? params.page : 1
    let perPage = params.perPage ? params.perPage : 5

    const path = `/users/${id}/followers/?page=${page}&per_page=${perPage}`
    API.get(path)
      .then(response => {
        // handle success
        setFollowers(response.data)
      })
      .catch(error => {
        // handle error
        console.error(error)
      })
  }

  // // 渲染文章列表
  // const renderPostItem = () => {
  //   const posts = this.state.posts
  //   return posts.map(value => {
  //     return <PostItem post={value} key={value.id} editpost={editpost} deletePost={deletePost} />
  //   })
  // }
  return (
    <div>
      <div className="card border-0 g-mb-15">
        <div className="card-header d-flex align-items-center justify-content-between g-bg-gray-light-v5 border-0 g-mb-15">
          <h3 className="h6 mb-0">
            <i className="icon-people g-pos-rel g-top-1 g-mr-5"></i>
            Followers of {user.name || user.username}
            {
              followers && <small
              >(共 {followers?._meta?.total_items || 0} 个, {followers?._meta?.total_pages || 0} 页)
              </small>
            }
          </h3>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default Followers