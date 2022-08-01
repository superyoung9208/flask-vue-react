<template>
  <div>
    <div
      class="modal fade"
      id="updatePostModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="updatePostModalTitle">Update Post</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form
              @submit.prevent="onSubmitUpdate"
              @reset.prevent="onResetUpdate"
              id="editForm"
            >
              <div
                class="form-group"
                v-bind:class="{ 'u-has-error-v1': editForm.titleError }"
              >
                <input
                  type="text"
                  v-model="editForm.title"
                  class="form-control"
                  id="editForm_title"
                  placeholder="标题"
                />
                <small
                  class="form-control-feedback"
                  v-show="editForm.titleError"
                  >{{ editForm.titleError }}</small
                >
              </div>
              <div class="form-group">
                <input
                  type="text"
                  v-model="editForm.summary"
                  class="form-control"
                  id="editForm_summary"
                  placeholder="摘要"
                />
              </div>
              <div class="form-group">
                <textarea
                  v-model="editForm.body"
                  class="form-control"
                  id="editForm_body"
                  rows="5"
                  placeholder=" 内容"
                ></textarea>
                <small
                  class="form-control-feedback"
                  v-show="editForm.bodyError"
                  >{{ editForm.bodyError }}</small
                >
              </div>
              <button type="reset" class="btn btn-secondary g-mr-10">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 g-mb-15">
      <!-- Panel Header -->
      <div
        class="
          card-header
          d-flex
          align-items-center
          justify-content-between
          g-bg-gray-light-v5
          border-0
          g-mb-15
        "
      >
        <h3 class="h6 mb-0">
          <i class="icon-bubbles g-pos-rel g-top-1 g-mr-5"></i> Posts of Followeds
          <small v-if="posts"
            >(共 {{ posts._meta.total_items }} 篇,
            {{ posts._meta.total_pages }} 页)</small
          >
        </h3>
        <div class="dropdown g-mb-10 g-mb-0--md">
          <span
            class="
              d-block
              g-color-primary--hover
              g-cursor-pointer g-mr-minus-5 g-pa-5
            "
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i class="icon-options-vertical g-pos-rel g-top-1"></i>
          </span>
          <div class="dropdown-menu dropdown-menu-right rounded-0 g-mt-10">
            <router-link
              v-bind:to="{ path: $route.path, query: { page: 1, per_page: 1 } }"
              class="dropdown-item g-px-10"
            >
              <i
                class="icon-plus g-font-size-12 g-color-gray-dark-v5 g-mr-5"
              ></i>
              每页 1 篇
            </router-link>
            <router-link
              v-bind:to="{ path: $route.path, query: { page: 1, per_page: 5 } }"
              class="dropdown-item g-px-10"
            >
              <i
                class="icon-layers g-font-size-12 g-color-gray-dark-v5 g-mr-5"
              ></i>
              每页 5 篇
            </router-link>
            <router-link
              v-bind:to="{
                path: $route.path,
                query: { page: 1, per_page: 10 },
              }"
              class="dropdown-item g-px-10"
            >
              <i
                class="icon-wallet g-font-size-12 g-color-gray-dark-v5 g-mr-5"
              ></i>
              每页 10 篇
            </router-link>

            <div class="dropdown-divider"></div>

            <router-link
              v-bind:to="{
                path: $route.path,
                query: { page: 1, per_page: 20 },
              }"
              class="dropdown-item g-px-10"
            >
              <i
                class="icon-fire g-font-size-12 g-color-gray-dark-v5 g-mr-5"
              ></i>
              每页 20 篇
            </router-link>
          </div>
        </div>
      </div>
      <!-- Panel Header end -->
      <!-- Panel Body -->
      <div v-if="posts" class="card-block g-pa-0">
        <post
          v-for="(post, index) in posts.items"
          v-bind:key="index"
          v-bind:post="post"
          v-on:edit-post="onEditPost(post)"
          v-on:delete-post="onDeletePost(post)"
        >
        </post>
      </div>
      <!-- End Panel Body -->
    </div>
    <!-- Pagination #04 -->
    <div v-if="posts">
      <pagination
        v-bind:cur-page="posts._meta.page"
        v-bind:per-page="posts._meta.per_page"
        v-bind:total-pages="posts._meta.total_pages"
      >
      </pagination>
    </div>
    <!-- End Pagination #04 -->
  </div>
</template>
<script>
import Pagination from '../Base/Pagination.vue'
import Post from '../Base/Post.vue'
import $ from 'jquery'

export default {
  components: {
    Pagination,
    Post
  },
  data() {
    return {
      user: '',
      posts: '',
      editForm: {
        title: '',
        summary: '',
        body: '',
        errors: 0, // 表单是否在前端验证通过，0 表示没有错误，验证通过
        titleError: null,
        bodyError: null
      }
    }
  },
  methods: {
    getUser(id) {
      const path = `/users/${id}`
      this.$axios
        .get(path)
        .then((response) => {
          // handle success
          this.user = response.data
        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    },
    getFollowedsPosts(id) {
      let page = 1
      let perPage = 5
      if (typeof this.$route.query.page !== 'undefined') {
        page = this.$route.query.page
      }
      if (typeof this.$route.query.per_page !== 'undefined') {
        perPage = this.$route.query.per_page
      }

      const path = `/users/${id}/followeds-posts/?page=${page}&per_page=${perPage}`
      this.$axios
        .get(path)
        .then((response) => {
          // handle success
          this.posts = response.data
        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    },
    onEditPost(post) {
      this.editForm = Object.assign({}, post)
    },
    onDeletePost(post) {
      this.$swal({
        title: 'Are you sure?',
        text: '该操作将彻底删除[' + post.title + '], 请慎重。',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!'
      }).then(result => {
        if (result.isConfirmed) {
          const path = `/posts/${post.id}`
          this.$axios.delete(path)
            .then(response => {
              this.$swal('Deleted', 'You successfully deleted this post', 'success')
              this.getUserPosts(this.$route.params.id)
            })
            .catch(error => {
              console.error(error.response.data)
            })
        } else {
          this.$swal('Cancelled', 'The post is safe :)', 'error')
        }
      })
    },
    onResetUpdate() {
      // 移除错误信息
      $('#editForm .form-control-feedback').remove()
      $('#editForm .form-group.u-has-error-v1').removeClass('u-has-error-v1')
      // 隐藏modal
      $('#updatePostModal').modal('hide')
      this.$toasted.info('Cancelled, the post is not update.', { icon: 'fingerprint' })
    },
    onSubmitUpdate() {
      this.editForm.errors = 0
      // 移除错误信息
      $('#editForm .form-control-feedback').remove()
      $('#editForm .form-group.u-has-error-v1').removeClass('u-has-error-v1')
      if (!this.editForm.title) {
        this.editForm.errors += 1
        this.editForm.titleError = 'Title is require'
        $('#editForm_title').closest('.form-group').addClass('u-has-error-v1') // Bootstrap 4
        $('#editForm_title').after('<small class="form-control-feedback">' + this.editForm.titleError + '</small>')
      } else {
        this.editForm.titleError = null
      }
      if (!this.editForm.body) {
        this.editForm.errors += 1
        this.editForm.bodyError = 'Body is require'
      } else {
        this.editForm.bodyError = null
      }

      if (this.editForm.errors > 0) {
        // 表单验证不通过不予执行
        return false
      }

      // 先隐藏modal
      $('#updatePostModal').modal('hide')

      const path = `/posts/${this.editForm.id}`
      const payload = {
        title: this.editForm.title,
        summary: this.editForm.summary,
        body: this.editForm.body
      }
      this.$axios.get(path, payload)
        .then(response => {
          // handle success
          this.getFollowedsPosts(this.$route.params.id)
          this.$toasted.success('Success update the post', { icon: 'fingerprint' })
        })
        .catch(error => {
          console.log(error.response.data)
        })
    }
  },
  created() {
    var userId = this.$route.params.id
    this.getUser(userId)
    this.getFollowedsPosts(userId)
    // 初始化 bootstrap-markdown 插件
    $(document).ready(function () {
      $('#editForm_body').markdown({
        autofocus: false,
        savable: false,
        iconlibrary: 'fa', // 使用Font Awesome图标
        language: 'zh'
      })
    })
  },
  // 进入子路由后重新加载数据
  beforeRouteUpdate(to, from, next) {
    next()
    this.getUser(to.params.id)
    this.getUserPosts(to.params.id)
    // 初始化 bootstrap-markdown 插件
    $(document).ready(function () {
      $('#editForm_body').markdown({
        autofocus: false,
        savable: false,
        iconlibrary: 'fa', // 使用Font Awesome图标
        language: 'zh'
      })
    })
  }
}
</script>
