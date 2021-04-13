/*
 * @Author: your name
 * @Date: 2021-03-25 09:40:29
 * @LastEditTime: 2021-04-13 08:42:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\router.ts
 */
import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import PostDetail from './views/PostDetail.vue'


import store from './store'


const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requiredLogin: true }
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostDetail
    },


  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const { user, token } = store.state;
  const { requiredLogin, redirectAlreadyLogin } = to.meta;

  if (!user.isLogin) {  // 未登录
    if (token) {        // 有token
      // 未登录，本地有token，帮忙自动登录
      store.dispatch("fetchCurrentUser").then(() => {
        if (redirectAlreadyLogin) {
          next('/');
        } else {
          next();
        }
      }).catch(e => {
        // token过期，相当于需要重新登录，
        // 这里要退出登录，重置token
        store.commit('logout');
        next('/login');
      });
    }
    else {            // 没有token
      if (requiredLogin) {
        next('/login');
      }
      else {
        next();
      }
    }
  }
  // 登录了
  else {
    if (redirectAlreadyLogin) {
      next('/');
    } else {
      next();
    }
  }

})

export default router