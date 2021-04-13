/*
 * @Author: your name
 * @Date: 2021-03-25 09:36:01
 * @LastEditTime: 2021-04-08 23:22:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\main.ts
 */
import { createApp } from 'vue'

import store from './store'
import router from './router'
import App from './App.vue'
import axios from 'axios'

// // 替换 baseURL
// axios.defaults.baseURL = 'http://apis.imooc.com/api/'
// // 下面的 icode 值是从慕课网获取的 token 值，可以在课程右侧的项目接口校验码找到
// axios.interceptors.request.use(config => {
//   // ... 其他代码
//   // (1)get 请求，添加到 url 中
//   config.params = { ...config.params, icode: 'C8235EAFAD961413' }
  
//   // (2)其他请求，添加到 body 中
//   // (2.1)如果是上传文件，添加到 FormData 中
//   if (config.data instanceof FormData) {
//     config.data.append('icode', 'C8235EAFAD961413')
//   } else {
//     // (2.2)普通的 body 对象，添加到 data 中
//     config.data = { ...config.data, icode: 'C8235EAFAD961413' }
//   }
//   return config
// })

// app是根组件
const app = createApp(App)
// 配置根组件
app.use(router)
app.use(store)

// 当我们挂载应用时，该组件被用作渲染的起点
// 一个应用需要被挂载到一个 DOM 元素中
// mount 不返回应用本身，返回的是根组件实例
app.mount('#app')
