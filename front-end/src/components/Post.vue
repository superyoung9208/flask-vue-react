<template>
  <div class="container">
    <!-- Modal: Edit Post -->
    <div class="modal fade" id="updatePostModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="updatePostModalTitle">Update Post</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">

            <form @submit.prevent="onSubmitUpdate" @reset.prevent="onResetUpdate">
              <div class="form-group" v-bind:class="{'u-has-error-v1': editForm.titleError}">
                <input type="text" v-model="editForm.title" class="form-control" id="editForm_title" placeholder="标题">
                <small class="form-control-feedback" v-show="editForm.titleError">{{ editForm.titleError }}</small>
              </div>
              <div class="form-group">
                <input type="text" v-model="editForm.summary" class="form-control" id="editForm_summary" placeholder="摘要">
              </div>
              <div class="form-group">
                <textarea v-model="editForm.body" class="form-control" id="editForm_body" rows="5" placeholder=" 内容"></textarea>
                <small class="form-control-feedback" v-show="editForm.bodyError">{{ editForm.bodyError }}</small>
              </div>
              <button type="reset" class="btn btn-secondary g-mr-10">Cancel</button>

              <button type="submit" class="btn btn-primary">Update</button>
            </form>

          </div>
        </div>
      </div>
    </div>
    <!-- End Modal: Edit Post -->
    <div class="row">
      <div class="col-lg-9">
        <article class="g-mb-60 g-pt-15 g-pb-50">
          <header class="g-mb-30">
            <h1 class="g-color-primary g-mb-15">{{ post.title }}</h1>

            <ul class="list-inline d-sm-flex g-color-gray-dark-v4 mb-0">
              <li v-if="post.author && post.author.id == sharedState.user_id" class="list-inline-item">
                <button v-on:click="onEditPost(post)" class="btn btn-xs u-btn-outline-purple g-mr-5" data-toggle="modal" data-target="#updatePostModal">编辑</button>
              </li>
              <li v-if="post.author && post.author.id == sharedState.user_id" class="list-inline-item">
                <button v-on:click="onDeletePost(post)" class="btn btn-xs u-btn-outline-red g-mr-5">删除</button>
              </li>
              <li class="list-inline-item">
                <span class="btn btn-xs u-btn-outline-aqua g-mr-10">评论</span>
              </li>
              <li v-if="post.author" class="list-inline-item">
                <router-link v-bind:to="{ name: 'Profile', params: { id: post.author.id }}" class="u-link-v5 g-color-gray-dark-v4 g-color-primary--hover g-text-underline--none--hover"><span v-if="post.author.name">{{ post.author.name }}</span><span v-else>{{ post.author.username }}</span></router-link>
              </li>
              <li class="list-inline-item g-mx-10">/</li>
              <li class="list-inline-item">
                <i class="icon-clock"></i> {{ $moment(post.timestamp).format('LLL') }}
              </li>
              <li class="list-inline-item g-mx-10">/</li>
              <li class="list-inline-item g-mr-10">
                <a class="u-link-v5 g-color-gray-dark-v4 g-color-primary--hover g-text-underline--none--hover" href="#comment-list-wrap">
                  <i class="icon-bubble"></i> 0
                </a>
              </li>
              <li class="list-inline-item ml-auto">
                <i class="icon-eye"></i> {{ post.views }} 次阅读
              </li>
            </ul>

            <hr class="g-brd-gray-light-v4 g-my-15">
          </header>

          <div id="postBody" class="g-font-size-16 g-line-height-1_8 g-mb-30">
            <!-- vue-markdown 开始解析markdown，它是子组件，通过 props 给它传值即可
            要指定TOC的级数哦，如果要修改TOC的样式，要在toc-rendered指定的函数中操作，因为要等它把TOC给创建出来
             -->
            <vue-markdown
              :source="post.body"
              :toc="showToc"
              :toc-first-level="1"
              :toc-last-level="3"
              v-on:toc-rendered="tocAllRight"
              toc-id="toc"
              class="markdown-body">
            </vue-markdown>

          </div>

        </article>
      </div>
      <div class="col-lg-3">
        <div id="sticker" class="g-mb-50">
          <div id="tocHeader" class="u-heading-v3-1 g-mb-15">
              <h2 class="h5 u-heading-v3__title g-color-primary text-uppercase g-brd-primary">文章目录</h2>
          </div>
          <div id="toc" class="toc"></div>
        </div>
      </div>
    </div>
    <div id="comment-list-wrap" class="card border-0 g-mb-15">
      <!-- Panel Header -->
      <div class="card-header d-flex align-items-center justify-content-between g-bg-gray-light-v5 border-0 g-mb-15">
        <h3 class="h6 mb-0">
          <i class="icon-bubbles g-pos-rel g-top-1 g-mr-5"></i> Comments
        </h3>
        <div class="dropdown g-mb-10 g-mb-0--md">
          <span class="d-block g-color-primary--hover g-cursor-pointer g-mr-minus-5 g-pa-5" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="icon-options-vertical g-pos-rel g-top-1"></i>
          </span>
          <div class="dropdown-menu dropdown-menu-right rounded-0 g-mt-10">
            <router-link v-bind:to="{ path: $route.path, query: { page: 1, per_page: 1 }}" class="dropdown-item g-px-10">
              <i class="icon-plus g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 1 条顶层评论
            </router-link>
            <router-link v-bind:to="{ path: $route.path, query: { page: 1, per_page: 5 }}" class="dropdown-item g-px-10">
              <i class="icon-layers g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 5 条顶层评论
            </router-link>
            <router-link v-bind:to="{ path: $route.path, query: { page: 1, per_page: 10 }}" class="dropdown-item g-px-10">
              <i class="icon-wallet g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 10 条顶层评论
            </router-link>

            <div class="dropdown-divider"></div>

            <router-link v-bind:to="{ path: $route.path, query: { page: 1, per_page: 20 }}" class="dropdown-item g-px-10">
              <i class="icon-fire g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 20 条顶层评论
            </router-link>

          </div>
        </div>
      </div>
      <!-- End Panel Header -->
      <!-- Add Comment Form -->
      <form id="addCommentForm" v-if="sharedState.is_authenticated" @submit.prevent="onSubmitAddComment" @reset.prevent="onResetAddComment" class="g-mb-40">
        <div class="form-group">
          <textarea v-model="commentForm.body" class="form-control" id="commentFormBody" rows="5" placeholder=" 写下你的评论 ..."></textarea>
          <small class="form-control-feedback" v-show="commentForm.bodyError">{{ commentForm.bodyError }}</small>
        </div>
        <button type="reset" class="btn btn-secondary">Cancel</button>
        <button type="submit" class="btn btn-primary g-ml-15">Submit</button>
      </form>
      <!-- End Add Comment Form -->
      <div v-else class="btn-group g-mr-10 g-mb-50 g-px-10">
        <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          发表评论前，请先登录 ...
        </button>
        <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; transform: translate3d(0px, 35px, 0px); top: 0px; left: 0px; will-change: transform;">
          <router-link v-bind:to="{ path: '/login', query: { redirect: $route.fullPath } }" class="dropdown-item">站内账号</router-link>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="javascript:;">Github</a>
          <a class="dropdown-item" href="javascript:;">Facebook</a>
          <a class="dropdown-item" href="javascript:;">微信</a>
        </div>
      </div>
      <div v-if="comments" class="card-block g-pa-0" >
      </div>
    </div>
  </div>
</template>
<script>
import VueMarkdown from 'vue-markdown'
import store from '../store.js'
import hljs from 'highlight.js'
import $ from 'jquery'
// 固定 TOC
import '../assets/jquery.sticky'
const highlightCode = () => {
  const blocks = document.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
}

export default {
  name: 'Post',
  components: {
    VueMarkdown
  },
  data() {
    return {
      sharedState: store.state,
      post: {},
      commentForm: {
        bodyError: null,
        body: ''
      },
      editForm: {
        title: '',
        summary: '',
        body: '',
        errors: 0, // 表单是否在前端验证通过，0 表示没有错误，验证通过
        titleError: null,
        bodyError: null
      },
      showToc: true
    }
  },
  methods: {
    getPost (id) {
      const path = `/posts/${id}`
      this.$axios.get(path)
        .then((response) => {
          this.post = response.data
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error)
        })
    },
    onEditPost (post) {
      this.editForm = Object.assign({}, post)
    },
    onSubmitUpdate () {
      this.editForm.errors = 0 // 重置
      // 每次提交前先移除错误，不然错误就会累加
      $('.form-control-feedback').remove()
      $('.form-group.u-has-error-v1').removeClass('u-has-error-v1')

      if (!this.editForm.title) {
        this.editForm.errors++
        this.editForm.titleError = 'Title is require.'
        // boostrap4 modal依赖jQuery，不兼容 vue.js 的双向绑定。所以要手动添加警示样式和错误提示
        $('#editForm_title').closest('.form-group').addClass('u-has-error-v1') // Bootstrap 4
        $('#editForm_title').after('<small class="form-control-feedback">' + this.editForm.titleError + '</small>')
      } else {
        this.editForm.titleError = null
      }

      if (!this.editForm.body) {
        this.editForm.errors++
        this.editForm.bodyError = 'Body is required.'
        // boostrap4 modal依赖jQuery，不兼容 vue.js 的双向绑定。所以要手动添加警示样式和错误提示
        // 给 bootstrap-markdown 编辑器内容添加警示样式，而不是添加到 #post_body 上
        $('.md-editor').closest('.form-group').addClass('u-has-error-v1') // Bootstrap 4
        $('.md-editor').after('<small class="form-control-feedback">' + this.editForm.bodyError + '</small>')
      } else {
        this.editForm.bodyError = null
      }
      if (this.editForm.errors > 0) {
        // 表单验证没通过时，不继续往下执行，即不会通过 axios 调用后端API
        return false
      }

      // 先隐藏 Modal
      $('#updatePostModal').modal('hide')

      const path = `/posts/${this.editForm.id}`
      const payload = {
        title: this.editForm.title,
        summary: this.editForm.summary,
        body: this.editForm.body
      }
      this.$axios.put(path, payload)
        .then((response) => {
          // handle success
          this.getPost(this.editForm.id)
          this.$toasted.success('Successed update the post.', { icon: 'fingerprint' })
          this.editForm.title = ''
          this.editForm.summary = ''
          this.editForm.body = ''
        })
        .catch((error) => {
          // handle error
          console.log(error.response.data)
        })
    },
    onResetUpdate () {
      // 先隐藏 Modal
      $('#updatePostModal').modal('hide')
      // this.getPosts()
      this.$toasted.info('Cancelled, the post is not update.', { icon: 'fingerprint' })
    },

    onSubmitAddComment() {
      return true
    },

    onResetAddComment() {

    },

    tocAllRight: function (tocHtmlStr) {
      console.log('toc is parsed :', tocHtmlStr)
      // 必须等 vue-markdown 生成 TOC 之后，再用 jquery 操作 DOM!!!
      // 非默认的列表样式
      $('.toc').find('ul').addClass('u-list-inline')
      // 2、3级目录缩进
      $('.toc ul li ul li').addClass('g-ml-15')
      $('.toc ul li ul li ul li').addClass('g-ml-15')
      // 链接颜色，鼠标悬停颜色
      $('.toc').find('a').addClass('u-link-v5 g-color-aqua g-color-red--hover')
    }
  },
  created() {
    const postId = this.$route.params.id
    this.getPost(postId)
    // 初始化 bootstrap-markdown 编辑器
    $(document).ready(function() {
      $('#editForm_body').markdown({
        autofocus: false,
        savable: false,
        iconlibrary: 'fa', // 使用Font Awesome图标
        language: 'zh'
      })
    })
    // 使用 jquery.sticker.js 插件让 TOC 固定位置
    $(document).ready(function() {
      $('#sticker').sticky({ topSpacing: 10 })
    })
  },
  // 当 id 变化后重新加载数据
  beforeRouteUpdate (to, from, next) {
    this.getPost(to.params.id)
    next()
  },
  mounted () {
    highlightCode()
  },
  updated () {
    highlightCode()
  }
}
</script>
