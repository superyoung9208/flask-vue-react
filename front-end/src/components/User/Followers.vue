<template>
  <div>
    <div class="card border-0 g-mb-15">
      <!-- Panel Header -->
      <div
        class="card-header d-flex align-items-center justify-content-between g-bg-gray-light-v5 border-0 g-mb-15"
      >
        <h3 class="h6 mb-0">
          <i class="icon-people g-pos-rel g-top-1 g-mr-5"></i>
          Followers of {{ user.name || user.username }}
          <small
            v-if="followers"
          >(共 {{ followers._meta.total_items }} 个, {{ followers._meta.total_pages }} 页)</small>
        </h3>
        <div class="dropdown g-mb-10 g-mb-0--md">
          <span
            class="d-block g-color-primary--hover g-cursor-pointer g-mr-minus-5 g-pa-5"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i class="icon-options-vertical g-pos-rel g-top-1"></i>
          </span>
          <div class="dropdown-menu dropdown-menu-right rounded-0 g-mt-10">
            <router-link
              v-bind:to="{ path: $route.path, query: { page: 1, per_page: 1 }}"
              class="dropdown-item g-px-10"
            >
              <i class="icon-plus g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 1 个
            </router-link>
            <router-link
              v-bind:to="{ path: $route.path, query: { page: 1, per_page: 5 }}"
              class="dropdown-item g-px-10"
            >
              <i class="icon-layers g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 5 个
            </router-link>
            <router-link
              v-bind:to="{ path: $route.path, query: { page: 1, per_page: 10 }}"
              class="dropdown-item g-px-10"
            >
              <i class="icon-wallet g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 10 个
            </router-link>
            <div class="dropdown-divider"></div>
            <router-link
              v-bind:to="{ path: $route.path, query: { page: 1, per_page: 20 }}"
              class="dropdown-item g-px-10"
            >
              <i class="icon-fire g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> 每页 20 个
            </router-link>
          </div>
        </div>
      </div>
      <!-- End Panel Header -->

      <!-- Panel Body -->
      <div v-if="followers" class="card-block g-pa-0">
        <member
          v-for="(follower, index) in followers.items"
          v-bind:key="index"
          v-bind:member="follower"
          v-on:follow-user="onFollowUser(follower)"
          v-on:unfollow-user="onUnfollowUser(follower)"
        ></member>
      </div>
      <!-- End Panel Body -->
    </div>

    <!-- Pagination #04 -->
    <div v-if="followers">
      <pagination
        v-bind:cur-page="followers._meta.page"
        v-bind:per-page="followers._meta.per_page"
        v-bind:total-pages="followers._meta.total_pages"
      ></pagination>
    </div>
    <!-- End Pagination #04 -->
  </div>
</template>

<script>
import Member from '../Base/Member'
import Pagination from '../Base/Pagination'
export default {
  name: 'UserFollowers', // this is the name of the component
  components: {
    Member,
    Pagination
  },
  data() {
    return {
      user: '',
      followers: ''
    }
  },
  methods: {
    getUser(id) {
      const path = `/users/${id}`
      this.$axios
        .get(path)
        .then(response => {
          // handle success
          this.user = response.data
        })
        .catch(error => {
          // handle error
          console.error(error)
        })
    },
    getUserFollowers(id) {
      let page = 1
      let perPage = 5
      if (typeof this.$route.query.page !== 'undefined') {
        page = this.$route.query.page
      }
      if (typeof this.$route.query.per_page !== 'undefined') {
        perPage = this.$route.query.per_page
      }

      const path = `/users/${id}/followers/?page=${page}&per_page=${perPage}`
      this.$axios
        .get(path)
        .then(response => {
          // handle success
          this.followers = response.data
        })
        .catch(error => {
          // handle error
          console.error(error)
        })
    },
    onFollowUser(follower) {
      const path = `/follow/${follower.id}`
      this.$axios
        .get(path)
        .then(response => {
          // handle success
          this.getUserFollowers(this.$route.params.id)
        })
        .catch(error => {
          // handle error
          console.error(error)
        })
    },
    onUnfollowUser(follower) {
      const path = `/unfollow/${follower.id}`
      this.$axios
        .get(path)
        .then(response => {
          // handle success
          this.getUserFollowers(this.$route.params.id)
        })
        .catch(error => {
          // handle error
          console.error(error)
        })
    }
  },
  created() {
    const userId = this.$route.params.id
    this.getUser(userId)
    this.getUserFollowers(userId)
  },
  // 进入子路由后重新加载数据
  beforeRouteUpdate(to, from, next) {
    next()
    this.getUser(to.params.id)
    this.getUserFollowers(to.params.id)
  }
}
</script>
