/*
 * @Author: your name
 * @Date: 2021-04-13 16:14:56
 * @LastEditTime: 2021-04-13 16:41:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\hooks\useLoadMore.ts
 */
// customRef 用于自定义返回一个 ref 对象，可以显式地控制依赖追踪和触发响应，接受工厂函数
import { ref, computed, ComputedRef } from 'vue'
import { useStore } from 'vuex'

// 加载参数
interface LoadPrams {
  currentPage?: number; // 当前页码
  pageSize?: number;    // 内容项个数
  [key: string]: any;   // id
}

/**
 * @description: 
 * @param {string} actionName 地址
 * @param {ComputedRef} total 总页面数
 * @param {LoadPrams} params 加载参数
 * @param {number} pageSize 内容项个数
 * @return {function} 
 */
const useLoadMore = (actionName: string, total: ComputedRef<number>,
  params: LoadPrams = { }, pageSize = 5) => {
  const store = useStore();
  // current page should equals 1, start from the second page
  // 
  const currentPage = ref((params && params.currentPage) || 1);

  // 需要使用computed计算属性包裹，才能获得最新的数据
  const requestParams = computed(() => {
    return {
      ...params,
      currentPage: currentPage.value + 1,  // 请求页码 = 当前页+1
    }
  })
  

  // 触发加载更多的方法
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++;
    })
  }

  // 最后一页的判断（不能显示加载更多的button，没有更多内容）
  const isLastPage = computed(() => {
    return Math.ceil((total.value || 1) / pageSize) === currentPage.value;
  })
  return {
    currentPage,
    loadMorePage,
    isLastPage
  }
}

export default useLoadMore
