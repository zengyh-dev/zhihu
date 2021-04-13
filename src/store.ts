/*
 * @Author: your name
 * @Date: 2021-03-25 09:40:18
 * @LastEditTime: 2021-04-13 17:08:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\store.ts
 */

import { Method, AxiosRequestConfig } from 'axios'
import { request } from './network/request'
import { createStore, Commit } from 'vuex'
import { objToArr, arrToObj } from './helper'

// 定义所有的数据结构


export interface ResponseType<P = {}> { // 返回格式
  code: number;
  msg: string;
  data: P;        // 泛型
}

export interface UserProps {    // 用户信息
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}

export interface ImageProps {   // 图片
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}

export interface ColumnProps {  // 专栏
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}

export interface PostProps {    // 文章信息
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;  // 文章头图需要id
  createdAt?: string;
  column: string;
  author?: string | UserProps;
  isHTML?: boolean;             // 是否是普通文本
}

export interface GlobalErrorProps {     // 错误信息
  status: boolean;
  message?: string;
}


interface ListProps<P> {                // 列表类型
  [id: string]: P;
}

export interface GlobalColumnsProps {   // 专栏数据
  currentColumns: ListProps<ColumnProps>;
  currentPage: number;
  total?: number;
}

export interface GlobalPostsProps {     // 文章数据
  currentPosts: ListProps<PostProps>;
  // 存储所有加载过的专栏的id ，对应的文章总数，当前页码
  loadedColumns: ListProps<{ total?: number; currentPage?: number }>;
}

// 确定store类型
export interface GlobalDataProps {      // 全局数据
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: GlobalColumnsProps;
  posts: GlobalPostsProps;
  user: UserProps;
}



/**
 * @description: 异步请求封装, 请求数据+修改数据
 * @param {string}              请求地址
 * @param {Method}              请求方法
 * @param {string}              触发的状态修改函数
 * @param {Commit}              commit 类型
 * @param {any}                 数据负载
 * @param {AxiosRequestConfig}  axios 配置
 * @param {any}                 extraData 额外数据
 * @return {any}                返回的raw数据
 */
const asyncAndCommit = async function (
  url: string,          // 
  method: Method,
  mutationName: string, // 触发的 mutation
  commit: Commit,       // commit 类型
  payload?: any,
  config?: AxiosRequestConfig,
  extraData?: any
) {
  // 异步数据请求
  const { data } = await request(url, method, payload, config);

  // 到对应的 mutation 里修改状态
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}



// store对象
const store = createStore<GlobalDataProps>({
  // 初始化
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '', // 从本地获取，没有就为空
    loading: false,
    columns: { currentColumns: {}, currentPage: 0 },
    posts: { currentPosts: {}, loadedColumns: {} },
    user: { isLogin: false }
  },
  // mutations是同步操作，要异步操作还得看actions
  mutations: {
    // 第二个参数用来传递参数
    fetchColumns(state, rawData) {                                // 专栏列表
      const { currentColumns } = state.columns                    // 当前专栏
      const { list, count, currentPage } = rawData.data           // 获得专栏列表相关信息
      state.columns = {
        currentColumns: { ...currentColumns, ...arrToObj(list) }, // 专栏添加
        currentPage: currentPage * 1,                             // 转数字类型
        total: count
      }
    },
    fetchColumn(state, { data }) {
      state.columns.currentColumns[data._id] = data   // 专栏详情
    },
    updateColumn(state, { data }) {
      state.columns.currentColumns[data._id] = data
    },
    createPost(state, { post }) {
      state.posts.currentPosts[post._id] = post                   // 文章
    },
    //                  直接展开 取别名
    fetchPosts(state, { data: rawData, extraData: columnId }) {
      // 专栏的文章列表
      const { currentPosts, loadedColumns } = state.posts;
      const { list, count, currentPage } = rawData.data;
      const listData = list as PostProps[];

      //  spread语法 ： 原来的 + 请求的
      state.posts.currentPosts = { ...currentPosts, ...arrToObj(listData) };
      loadedColumns[columnId] = {
        total: count,
        currentPage
      };
    },
    fetchPost(state, { data }) {            // 获得文章
      state.posts.currentPosts[data._id] = data;
    },
    updatePost(state, { data }) {           // 更新文章
      state.posts.currentPosts[data._id] = data;
    },
    deletePost(state, { data }) {           // 删除文章
      delete state.posts.currentPosts[data._id];
    },
    fetchCurrentUser(state, rawData) {      // 当前用户
      state.user = { isLogin: true, ...rawData.data };
    },
    setLoading(state, status) {             // 设置加载
      state.loading = status;
    },
    setError(state, e: GlobalErrorProps) {  // 设置错误信息
      state.error = e;
    },
    login(state, rawData) {
      const { token } = rawData.data        // 获取token
      state.token = token;
      localStorage.setItem('token', token); // 本地存储
    },
    logout(state) {
      state.token = '';
      localStorage.removeItem('token');
    }

  },
  // 异步操作的actions
  actions: {
    // Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象
    // 因此你可以调用 context.commit 提交一个 mutation
    // 或者通过 context.state 和 context.getters 来获取 state 和 getters
    fetchColumns({ commit, state }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params;
      // 页码判断，当前页码小于要请求的页码，就要请求数据，
      // 大于说明请求过了
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`,
          'get', 'fetchColumns', commit);
      }
    },
    fetchColumn({ commit }, cid) {
      return asyncAndCommit(`/columns/${cid}`, 'get', 'fetchColumn', commit)
    },
    fetchPosts({ commit, state }, params = {}) {

      const { cid, currentPage = 1, pageSize = 5 } = params;
      // ？？？
      const { loadedColumns } = state.posts;

      const loadedCurentPage = (loadedColumns[cid] && loadedColumns[cid].currentPage) || 0;

      if (!Object.keys(loadedColumns).includes(cid) || loadedCurentPage < currentPage) {
        return asyncAndCommit(`/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`,
          'get', 'fetchPosts', commit, null, {}, cid); // 额外的cid信息
      }
    },
    fetchPost({ commit, state }, id) {
      // we don't have this post or post detail is not loaded
      const { currentPosts } = state.posts;
      // 查看要获取的文章是否有存储
      const certainPost = currentPosts[id];
      //  文章没有内容：注意，查看swagger可以发现，文章的请求有两种方式，
      // 一种是请求缩略版本的文章，主要用来在专栏里展示，不包含content
      // 另一种是请求文章全文，有包含content
      if (!certainPost || !certainPost.content) { // 没有存储
        return asyncAndCommit(`/posts/${id}`, 'get', 'fetchPost', commit)
      } else {
        // 没有新数据的时候，也要返回 promise对象，因为编辑模式需要用到then
        return Promise.resolve({ data: certainPost })
      }
    },
    fetchCurrentUser({ commit }) {
      return asyncAndCommit(`/user/current`, 'get', 'fetchCurrentUser', commit);
    },
    login({ commit }, payload) {
      return asyncAndCommit(`/user/login`, 'post', 'login', commit, payload);
    },
    loginAndFetch({ dispatch }, loginData) {
      // 组合dispatch
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser');
      })
    },
    deletePost({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'delete', 'deletePost', commit);
    },
    createPost({ commit }, payload) {
      return asyncAndCommit('/posts', 'post', 'createPost', commit, payload);
    },
    updatePost({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'patch', 'updatePost', commit, payload);
    },

  },

  // Vuex 允许我们在 store 中定义 “getter”（可以认为是 store 的计算属性）。
  // 就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，
  // 且只有当它的依赖值发生了改变才会被重新计算。
  getters: {
    // 单个专栏获取
    getColumnById: (state) => (id: string) => {
      return state.columns.currentColumns[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      // 根据时间来排序
      return objToArr(state.posts.currentPosts).filter(post => post.column === cid).sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      })
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.currentPosts[id]
    },
    getPostsCountByCid: (state) => (cid: string) => {
      if (state.posts.loadedColumns[cid]) {
        return state.posts.loadedColumns[cid].total
      } else {
        return 0
      }
    },
    getPostsCurrentPageByCid: (state) => (cid: string) => {
      if (state.posts.loadedColumns[cid]) {
        return state.posts.loadedColumns[cid].currentPage
      } else {
        return 0
      }
    }
  }
})

export default store