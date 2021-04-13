
/*
 * @Author: your name
 * @Date: 2021-03-25 16:31:01
 * @LastEditTime: 2021-04-04 17:26:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\hooks\useClickOutside.ts
 */

import { ref, onMounted, onUnmounted, Ref } from "vue"

// 不能传入dom节点，要是响应式对象（Ref是类型）
const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutside = ref(false);
  const handler = (e: MouseEvent) => {
    if (elementRef.value) { // 防止为空报错
      if (elementRef.value.contains(e.target as HTMLElement)) {
        console.log(elementRef.value);
        isClickOutside.value = false;
      } else {
        isClickOutside.value = true;
      }
    }
  }
  onMounted(() => {
    document.addEventListener("click", handler);
  });

  onUnmounted(() => {
    document.removeEventListener("click", handler);
  });
  // 返回响应式对象
  return isClickOutside;
}

export default useClickOutside;