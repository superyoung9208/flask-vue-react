import React from 'react'
import { Link } from 'react-router-dom'
import FormatTime from '../../components/FormatTime'
import ReactMarkdown from 'react-markdown'
import store from '../../utils/store'

export default class PostItem extends React.Component {

  render() {
    const { post, editpost,deletePost } = this.props
    return (
      <div className="card-block g-pa-0" >
        <div className="media g-brd-around g-brd-gray-light-v4 g-pa-20 g-mb-20">
          <Link to={{pathname:`/profile/${post.author.id}`}} title={post.author.name || post.author.username}>
            <img className="d-flex g-width-50 g-height-50 g-mt-3 g-mr-20" src={post.author._links.avatar} alt={post.author.name || post.author.username} />
          </Link>

          <div className="media-body">
            <div className="d-sm-flex justify-content-sm-between align-items-sm-center g-mb-15 g-mb-10--sm">
              <h5 className="h4 g-font-weight-300 g-mr-10 g-mb-5 g-mb-0--sm">
                <Link to={{pathname:`/posts/${post.id}`}}  className="g-text-underline--none--hover">{post.title}</Link>
              </h5>
              <div className="text-nowrap g-font-size-12">
                <span><FormatTime>{post.timestamp}</FormatTime></span> / <Link to={{pathname:`/profile/${post.author.id}`}}><span>{post.author.name ? post.author.name : post.author.username}</span></Link>
              </div>
            </div>
            <ReactMarkdown className="markdown-body g-mb-15">{post.summary}</ReactMarkdown>
            <div className="d-flex justify-content-start">
              <ul className="list-inline mb-0">
                <li className="list-inline-item g-mr-20">
                  <a className="g-color-gray-dark-v5 g-text-underline--none--hover" href="page-profile-comments-1.html#">
                    <i className="icon-eye g-pos-rel g-top-1 g-mr-3"></i> {post.view}
                  </a>
                </li>
              </ul>
              <ul className="list-inline mb-0 ml-auto">
                <li className="list-inline-item g-mr-5">
                  <Link to={{pathname:`/posts/${post.id}`}} className="btn btn-xs u-btn-outline-primary">阅读全文</Link>
                </li>
                {
                  post.author.id === store.state.user_id && <li className="list-inline-item g-mr-5">
                  <button className="btn btn-xs u-btn-outline-purple" onClick={() => editpost(post.id)} data-toggle="modal" data-target="#updatePostModal">编辑</button>
                </li>
                }
                {
                  post.author.id === store.state.user_id && <li className="list-inline-item">
                  <button className="btn btn-xs u-btn-outline-red"  onClick={() => deletePost(post.id,post.title)}>删除</button>
                </li>
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}