import React from 'react'
import { Link } from 'react-router-dom'
import { API } from '../../utils/api'
import store from '../../utils/store'
import FormatTime from '../../components/FormatTime'
import Sticky from '../../components/sticky'
import Toc from "react-toc";
import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'
import markdownItTocDoneRight from 'markdown-it-toc-done-right'
import anchor from 'markdown-it-anchor'
import emoji from 'markdown-it-emoji'
import subscript from 'markdown-it-sub'
import superscript from 'markdown-it-sup'
import footnote from 'markdown-it-footnote'
import deflist from 'markdown-it-deflist'
import abbreviation from 'markdown-it-abbr'
import insert from 'markdown-it-ins'
import mark from 'markdown-it-mark'
import tasklists from 'markdown-it-task-lists'
import styles from './index.module.css'
import '../../assets/markdown-styles/github-markdown.css'
// 模态框相关的组件
import { Formik } from 'formik'
import $ from 'jquery'
import { toast } from 'react-toastify'
import MdEditor from 'react-markdown-editor-lite';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// import { func } from 'prop-types'

// import markdownItAuthor from 'markdown-it-anchor'
// import Sticky from '../../components/Sticky'
// import toc from 'markdown-toc'
// import remarkable from 'remarkable'

export default class Post extends React.Component {

  state = {
    sharedState: store.state,
    post: {
      body: ""
    },
    updatePostForm: {
      title: '',
      summary: '',
      body: '',
    },
  }

//   {
//     tocClassName: 'table-of-contents',
//     tocFirstLevel: 1,
//     tocLastLevel: 3,
//     anchorLink: true,
//     anchorLinkSymbol: '#',
//     anchorLinkSpace: true,
//     anchorClassName: 'toc-anchor',
//     anchorLinkSymbolClassName: 'toc-anchor-link',
// }
  mdUpdateEditor = null
  MySwal = withReactContent(Swal)
  mdParser = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value
        } catch (__) {}
      }    
      return '' // use external default escaping
    }
  }).use(anchor)
    .use(markdownItTocDoneRight)
    .use(emoji)
    .use(subscript)
    .use(superscript)
    .use(footnote)
    .use(deflist)
    .use(abbreviation)
    .use(insert)
    .use(mark)
    .use(tasklists, { enabled: this.taskLists })

  async getPost(id) {
    const { data, status } = await API.get(`/posts/${id}`)
    if (status === 200) {
      this.setState({ post: data })
    }
  }
  async getEditpost(id) {
    const { data, status } = await API.get(`/posts/${id}`)
    if (status === 200) {
      this.mdUpdateEditor.setText(data.body)
      this.setState({ updatePostForm: data })
    }
  }

  // 删除文章
  deletePost = async (postId, postTitle) => {
    const { history } = this.props
    this.MySwal.fire({
      title: "Are you sure?",
      text: "该操作将彻底删除 [ " + postTitle + " ], 请慎重",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if(result.value) {
        const path = `/posts/${postId}`
          API.delete(path)
          .then((response) => {
            // handle success
            this.MySwal.fire('Deleted', 'You successfully deleted this post', 'success')
            // this.$toasted.success('Successed delete the post.', { icon: 'fingerprint' })
            history.go(-1)
          })
          .catch((error) => {
            // handle error
            console.log(error.response.data)
          })
      } else {
        this.MySwal.fire('Cancelled', 'The post is safe :)', 'error')
      }
    })
  }

  componentDidMount() {
    const { params } = this.props.match
    this.getPost(params.id)
  }

  render() {
    const { post, sharedState } = this.state
    return (
      <div className="container">
        {/* 更新文章的模态框 */}
        <div
          className="modal fade"
          id="updatePostModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="updatePostModalTitle">Update Post</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <Formik
                  initialValues={{ title: this.state.updatePostForm.title, summary: this.state.updatePostForm.summary}}
                  enableReinitialize
                  validate={values => {
                    const errors = {}
                    if (!values.title) {
                      errors.title = 'Title is Required'
                    }
                    if (!this.mdUpdateEditor.getMdValue()) {
                      errors.mdUpdateEditor = 'Body is Required'
                    }
                    values.body = this.mdUpdateEditor.getMdValue()
                    return errors
                  }}
                  onSubmit={async (values, actions) => {
                    const {title, summary, body} = values
                    const res = await API.put(`/api/posts/${this.state.updatePostForm.id}`, {title, summary, body})
                    const {curPage, perPage} = this.state
                    const {location} = this.props
                    if (res.status === 200) {
                      this.mdUpdateEditor.setText("")
                      this.setState({
                        updatePostForm: {title: '', summary: '', body: ''}
                      })
                      actions.resetForm({values: { title: '', summary: '', body: ''}})
                      this.getPosts(curPage, perPage)
                      $('#updatePostModal').modal('hide')
                      toast.success(`🦄 Successed update a post`, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      })
                    } else {
                      $('#updatePostModal').modal('hide')
                      toast.error(`🦄 Update post fail, Please login`, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      })
                      this.props.history.push('/login', {from: location})
                    }
                  }}
                >
                  {props => (
                    <form onSubmit={props.handleSubmit}>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          placeholder="标题"
                          onChange={props.handleChange}
                          value={props.values.title}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          name="summary"
                          placeholder="摘要"
                          onChange={props.handleChange}
                          value={props.values.summary}
                        />
                      </div>
                      <div className="form-group">
                        <MdEditor ref={node => this.mdUpdateEditor = node} renderHTML={(text) => this.mdParser.render(text)} style={{ height: '150px' }}></MdEditor>
                      </div>
                      <button type="reset" className="btn btn-secondary g-mr-10">Cancel</button>
                      <button type="submit" className="btn btn-primary">Update</button>
                    </form>
                  )}
                </Formik>

              </div>
            </div>
          </div>
        </div>
    {/* 添加文章区域开始 */}
        <div className="row">
          <div className="col-lg-9">
            <article className="g-mb-60 g-pt-15 g-pb-50">
              <header className="g-mb-30">
                <h1 className="g-color-primary g-mb-15">{post.title}</h1>
                <ul className="list-inline d-sm-flex g-color-gray-dark-v4 mb-0">
                  {
                    post.author && post.author.id === sharedState.user_id && <li className="list-inline-item">
                      <button className="btn btn-xs u-btn-outline-purple g-mr-5" data-toggle="modal" data-target="#updatePostModal" onClick={() => this.getEditpost(post.id)}>编辑</button>
                    </li>
                  }
                  {
                    post.author && post.author.id === sharedState.user_id && <li className="list-inline-item">
                      <button className="btn btn-xs u-btn-outline-red g-mr-5" onClick={() => this.deletePost(post.id, post.title)}>删除</button>
                    </li>
                  }
                  <li className="list-inline-item">
                    <span className="btn btn-xs u-btn-outline-aqua g-mr-10">评论</span>
                  </li>
                  {
                    post.author && <li className="list-inline-item">
                      <Link to={`profile\${post.author.id}`} className="u-link-v5 g-color-gray-dark-v4 g-color-primary--hover g-text-underline--none--hover">
                        {post.author.name ? <span>{ post.author.name }</span> : <span>{ post.author.username }</span>}
                      </Link>
                    </li>
                  }
                  <li className="list-inline-item g-mx-10">/</li>
                  <li className="list-inline-item">
                    <i className="icon-clock"></i><FormatTime>{post.timestamp}</FormatTime>
                  </li>
                  <li className="list-inline-item g-mx-10">/</li>
                  <li className="list-inline-item g-mr-10">
                    <a className="u-link-v5 g-color-gray-dark-v4 g-color-primary--hover g-text-underline--none--hover" href="#comment-list-wrap">
                      <i className="icon-bubble"></i> 0
                    </a>
                  </li>
                  <li className="list-inline-item ml-auto">
                    <i className="icon-eye"></i> {post.views} 次阅读
                  </li>
                </ul>
                <hr className="g-brd-gray-light-v4 g-my-15"></hr>
              </header>

              <div id="postBody" className="g-font-size-16 g-line-height-1_8 g-mb-30">
                {/* <ReactMarkdown className="markdown-body">{post.body}</ReactMarkdown> */}
                <div className="markdown-body" dangerouslySetInnerHTML={{ __html: this.mdParser.render(post.body) }}></div>
              </div>
            </article>
          </div>
          <div className="col-lg-3">
            <Sticky>
              <div id="tocHeader" className="u-heading-v3-1 g-mb-15">
                  <h2 className="h5 u-heading-v3__title g-color-primary text-uppercase g-brd-primary" onClick={() => this.tocAllRight()}>文章目录</h2>
              </div>
              {/* <div id="toc" className="toc"></div>  */}
              <Toc className={styles.toc} markdownText={post.body}/>
              {/* <div >123</div> */}
            </Sticky>
          </div>
        </div>
      </div>
    )
  }
}
