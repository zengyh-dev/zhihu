import { onUnmounted } from 'vue'

function useDOMCreate(nodeId: string) {
  // 手动创建结点
  const node = document.createElement('div')
  node.id = nodeId
  // 添加结点到最外层的body上，和app同级别
  document.body.appendChild(node)
  // 页面跳转后，每次都要load，不能累加前面的div，要及时删除
  onUnmounted(() => {
    document.body.removeChild(node)
  })
}

export default useDOMCreate
