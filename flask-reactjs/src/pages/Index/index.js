import React, { Component } from 'react'
import PostItem from '../../components/PostItem'
import Pagination from '../../components/Pagination'
import { API } from '../../utils/api'
import { Formik } from 'formik';
import { toast } from 'react-toastify'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import hljs from 'highlight.js'
import $ from 'jquery'
import 'highlight.js/styles/atom-one-light.css'
import 'react-markdown-editor-lite/lib/index.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'



class Index extends Component {
  MySwal = withReactContent(Swal)
  mdEditor = null
  mdUpdateEditor = null
  mdParser = null
  constructor(props) {
    super(props)
    this.mdParser = new MarkdownIt({
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
    })
    // this.renderHTML = this.renderHTML.bind(this)
    this.state = {
      posts : [],
      curPage: 1,
      perPage: 3,
      totalPages: 1,
      updatePostForm: {
        title: '',
        summary: '',
        body: '',
      },
    }
  }

  async componentDidMount() {
    console.log("我执行了")
    this.getPosts(1, 3)
    sessionStorage.getItem('body') && this.mdEditor.setText(sessionStorage.getItem('body'))
  }

  sho
  
  // 获取所有文章
  async getPosts(curPage, perPage) {
    const path = `/posts?page=${curPage}&per_page=${perPage}`
    
    const {data, status} = await API.get(path)
    if (status === 200) {
      this.setState({
        posts: data.items,
        curPage: data._meta.page,
        perPage: data._meta.per_page,
        totalPages: data._meta.total_pages,
        totalItems: data._meta.total_items
      })
    } else {
      console.log(data)
    }
  }

  // 数据分页
  goPage = (curPage,perPage) => {
    this.getPosts(curPage, perPage)
  }

  editpost = async (postId) => {
    const path = `/posts/${postId}`
    const {data, status} = await API.get(path)
    if (status === 200) {
      this.mdUpdateEditor.setText(data.body)
      this.setState({
        updatePostForm: {
          id: data.id,
          title: data.title,
          summary: data.summary,
          body: data.body
        }
      })
    }
  }

  deletePost = async (postId, postTitle) => {
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
            const {curPage,perPage} = this.state
            this.getPosts(curPage, perPage)
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

  // 渲染文章列表
  renderPostItem() {
    const posts = this.state.posts
    return posts.map(value => {
      return <PostItem post={value} key={value.id} editpost={this.editpost} deletePost={this.deletePost}/>
    })
  }

  // 处理编辑器更改
  handleEditorChange({ html, text }) {
    console.log('handleEditorChange', html, text);
  }

  render() {
    return <div className="container">
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
    <Formik
      // 初始化input的value不可以为null，当没有会话数据时使用空字符串替代
      initialValues={{ title: sessionStorage.getItem('title') ? sessionStorage.getItem('title') : '', summary: sessionStorage.getItem('summary') ? sessionStorage.getItem('summary') : ''}}
      validate={values => {
        const errors = {}
        if (!values.title) {
          errors.title = 'Title is Required'
        }
        if (!this.mdEditor.getMdValue()) {
          errors.mdEditor = 'Body is Required'
        }
        values.body = this.mdEditor.getMdValue()
        return errors
      }}
      validateOnChange={false}
      onSubmit={async (values, actions) => {
        const {title, summary, body} = values
        const res = await API.post('/posts', {title, summary, body})
        const {curPage, perPage} = this.state
        const {location} = this.props
        if (res.status === 201) {
          this.mdEditor.setText("")
          actions.resetForm({values: { title: '', summary: '', body: ''}})
          sessionStorage.removeItem('title')
          sessionStorage.removeItem('summary')
          sessionStorage.removeItem('body')
          this.getPosts(curPage, perPage)
          toast.success(`🦄 Successed add a new post`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        } else {
          title && sessionStorage.setItem('title',title)
          summary && sessionStorage.setItem('summary', summary)
          body && sessionStorage.setItem('body', body)
          toast.error(`🦄 Add post fail, Please login`, {
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
      { props => (
        <form className="g-mb-40" onSubmit={props.handleSubmit}>
        <div className={["form-group",props.errors.title && "u-has-error-v1"].join(" ")}>
          <input
            type="text"
            className="form-control"
            placeholder="标题"
            name="title"
            value={props.values.title}
            onChange={props.handleChange}
          />
          {props.errors.title && <small className="form-control-feedback">{props.errors.title}</small>}
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="摘要"
            name="summary"
            value={props.values.summary}
            onChange={props.handleChange}
          />
        </div>
        <div className={["form-group",props.errors.mdEditor && "u-has-error-v1"].join(" ")}>
          <MdEditor ref={node => this.mdEditor = node} style={{ height: '200px'}} onChange={this.handleEditorChange} renderHTML={(text) => this.mdParser.render(text)}></MdEditor>
          { props.errors.mdEditor &&  <small className="form-control-feedback">Body is require</small>}
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        {/* <button className="btn btn-primary" onClick={props.handleReset}>Submit</button> */}
      </form>
      )}
    </Formik>
    
    {/* <!-- 发表博客end --></div> */}
    {/* 卡片区域 */}
    <div className="card border-0 g-mb-15">
      {/* <!-- Panel Header 文章列表的控制面板 --> */}
      <div className="card-header d-flex align-items-center justify-content-between g-bg-gray-light-v5 border-0 g-mb-15">
        <h3 className="h6 mb-0">
          <i className="icon-bubbles g-pos-rel g-top-1 g-mr-5"></i> All Posts <small>(共 {this.state.totalItems} 篇, {this.state.totalPages} 页)</small>
        </h3>
        <div className="dropdown g-mb-10 g-mb-0--md">
          <span className="d-block g-color-primary--hover g-cursor-pointer g-mr-minus-5 g-pa-5" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i className="icon-options-vertical g-pos-rel g-top-1"></i>
          </span>
          <div className="dropdown-menu dropdown-menu-right rounded-0 g-mt-10">
            <div onClick={() => this.goPage(1,5)} className="dropdown-item g-px-10">
              <i className="icon-layers g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 5 篇
            </div>
            <div onClick={() => this.goPage(1,10)} className="dropdown-item g-px-10">
              <i className="icon-wallet g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 10 篇
            </div>
            <div onClick={() => this.goPage(1,20)} className="dropdown-item g-px-10">
              <i className="icon-fire g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 20 篇
            </div>

            <div className="dropdown-divider"></div>

            <div onClick={() => this.goPage(1,1) } className="dropdown-item g-px-10">
              <i className="icon-plus g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 1 篇
            </div>
          </div>
        </div>
      </div>
      {/* <!-- End Panel Header 文章列表的控制面板 --> */}
      {this.renderPostItem()}
    </div>
    <Pagination curPage={this.state.curPage} perPage={this.state.perPage} totalPages={this.state.totalPages} go={this.goPage}/>
  </div>
  }
}

export default Index
