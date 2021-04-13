/*
 * @Author: your name
 * @Date: 2021-04-08 23:10:41
 * @LastEditTime: 2021-04-13 08:29:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\network\request.ts
 */
import axios, { Method,AxiosRequestConfig } from 'axios'
import store from '../store';

/**
 * @description: axios封装，请求数据
 * @param {string}              请求地址
 * @param {Method}              请求方法
 * @param {any}                 负载数据
 * @param {AxiosRequestConfig}  axios请求配置
 * @return {any}                返回的数据
 */
export function request(url: string, method?: Method, data?: any, config?: AxiosRequestConfig) {


  // 一、创建 axios的实例
  const instance = axios.create({
    // 通用配置
    baseURL: 'http://apis.imooc.com/api/',
    timeout: 10000,
    method: method || 'get',
    headers: {
      'Authorization': `Bearer ${store.state.token}`,
    }
  })



  // 二、axios拦截器
  // (1) 请求拦截器
  instance.interceptors.request.use(config => {

    // 请求前要显示loading
    if (!data) {
      store.commit('setLoading', true)
    }

    store.commit('setError', { status: false, message: '' });

    console.log(config);
    console.log(config.headers);

    // (1) get 请求，添加到 url 中
    config.params = { ...config.params, icode: 'C8235EAFAD961413' }

    // (2)其他请求，添加到 body 中
    // (2.1)如果是上传文件，添加到 FormData 中
    if (config.data instanceof FormData) {

      config.data.append('icode', 'C8235EAFAD961413')
      console.log(config.data.has('icode'));
    } else {
      // (2.2)普通的 body 对象，添加到 data 中
      config.data = { ...config.data, icode: 'C8235EAFAD961413' }
    }
    return config
  })


  // (2) 响应拦截
  // 两个处理函数，成功和失败
  instance.interceptors.response.use(res => {
    store.commit('setLoading', false) // loading完了
    console.log(res.data);

    // 返回响应主体信息，在外面去then，处理数据
    return res;
  }, e => {
    store.commit('setLoading', false);
    // 失败的统一处理
    console.log(e);
    let { error } = e.response.data;
    // 设置错误信息
    store.commit('setError', { status: true, message: error });
    // loading完了

    return Promise.reject(error);
  });



  // 三、发送真正的网络请求

  switch (method) {
    case 'post':
      return instance.post(url, data, config);
    case 'get':
      return instance.get(url, config);
    case 'patch':
      return instance.patch(url, data, config);
    case 'delete':
      return instance.delete(url, config);
    default:
      return instance.get(url, config);
  }

}




