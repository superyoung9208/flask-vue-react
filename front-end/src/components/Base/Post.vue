<template>
  <div class="media g-brd-around g-brd-gray-light-v4 g-pa-20 g-mb-20">
    <router-link
      v-bind:to="{ name: 'Profile', params: { id: post.author.id }}"
      v-bind:title="post.author.name || post.author.username"
    >
      <img
        class="d-flex g-width-50 g-height-50 g-mt-3 g-mr-20"
        v-bind:src="post.author._links.avatar"
        v-bind:alt="post.author.name || post.author.username"
      >
    </router-link>

    <div class="media-body">
      <div class="d-sm-flex justify-content-sm-between align-items-sm-center g-mb-15 g-mb-10--sm">
        <h5 class="h4 g-font-weight-300 g-mr-10 g-mb-5 g-mb-0--sm">
          <router-link
            v-bind:to="{ name: 'Post', params: { id: post.id }}"
            class="g-text-underline--none--hover"
          >{{ post.title }}</router-link>
        </h5>
        <div class="text-nowrap g-font-size-12">
          <span>{{ $moment(post.timestamp).fromNow() }}</span> /
          <router-link v-bind:to="{ name: 'Profile', params: { id: post.author.id }}">
            <span v-if="post.author.name">{{ post.author.name }}</span>
            <span v-else>{{ post.author.username }}</span>
          </router-link>
        </div>
      </div>

      <!-- vue-markdown 开始解析markdown，它是子组件，通过 props 给它传值即可
      v-highlight 是自定义指令，用 highlight.js 语法高亮-->
      <vue-markdown :source="post.summary" class="markdown-body g-mb-15" v-highlight></vue-markdown>

      <div class="d-flex justify-content-start">
        <ul class="list-inline mb-0">
          <li class="list-inline-item g-mr-20">
            <a
              class="g-color-gray-dark-v5 g-text-underline--none--hover"
              href="page-profile-comments-1.html#"
            >
              <i class="icon-eye g-pos-rel g-top-1 g-mr-3"></i>
              {{ post.views }}
            </a>
          </li>
        </ul>
        <ul class="list-inline mb-0 ml-auto">
          <li class="list-inline-item g-mr-5">
            <router-link
              v-bind:to="{ name: 'Post', params: { id: post.id }}"
              class="btn btn-xs u-btn-outline-primary"
            >阅读全文</router-link>
          </li>
          <li v-if="post.author.id == sharedState.user_id" class="list-inline-item g-mr-5">
            <button
              v-on:click="$emit('edit-post')"
              class="btn btn-xs u-btn-outline-purple"
              data-toggle="modal"
              data-target="#updatePostModal"
            >编辑</button>
          </li>
          <li v-if="post.author.id == sharedState.user_id" class="list-inline-item">
            <button v-on:click="$emit('delete-post')" class="btn btn-xs u-btn-outline-red">删除</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import store from '../../store'
import VueMarkdown from 'vue-markdown'

export default {
  components: {
    VueMarkdown
  },
  props: ['post'],
  data() {
    return {
      sharedState: store.state
    }
  }
}
</script>
