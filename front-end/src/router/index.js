import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Register from '@/components/Register'
import User from '@/components/User/User'
import Overview from '@/components/User/Overview'
import Followers from '@/components/User/Followers'
import Followeds from '@/components/User/Following'
import EditProfile from '@/components/EditProfile'
import UserPostsList from '@/components/Post/UserPostsList'
import UserFollowedsPostsList from '@/components/Post/UserFollowedsPostsList'
import Ping from '@/components/Ping'
import Posts from '@/components/Post'
import Demo from '@/components/Demo'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    // meta: {
    //   requiresAuth: true
    // }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/demo',
    name: 'Demo',
    component: Demo
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/user/:id',
    component: User,
    children: [
      { path: '', component: Overview },
      { path: 'overview', name: 'UserOverview', component: Overview },
      { path: 'followers', name: 'UserFollowers', component: Followers },
      { path: 'followeds', name: 'UserFollowing', component: Followeds },
      { path: 'posts', name: 'UserPostsList', component: UserPostsList },
      { path: 'followeds-posts', name: 'UserFollowedsPostsList', component: UserFollowedsPostsList },
    
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/edit-profile',
    name: 'EditProfile',
    component: EditProfile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/ping',
    name: 'Ping',
    component: Ping
  },
  {
    path: '/posts/:id',
    name: 'Post',
    component: Posts
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('madblog-token')
  if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (token && to.name === 'Login') {
    // 用户已登录，但又去访问登录页面时不让他过去
    next({
      path: from.fullPath
    })
  } else {
    next()
  }
})

export default router
