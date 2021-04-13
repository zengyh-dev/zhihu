/*
 * @Author: your name
 * @Date: 2021-04-10 17:28:38
 * @LastEditTime: 2021-04-12 09:08:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\components\createMessage.ts
 */
import { createApp } from 'vue'
import Message from './message/Message.vue'
export type MessageType = 'success' | 'error' | 'default'

// 函数创建组件
const createMessage = (message: string, type: MessageType, timeout = 2000) => {
  // createApp来创建组件的实例
  // 第一个参数是 组件本身，第二个是 props
  const messageInstance = createApp(Message, {
    message,
    type
  })
  // 新建结点
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  // 挂载到上面创建的 dom结点上
  messageInstance.mount(mountNode)

  // 定时删除这个组件
  setTimeout(() => {
    messageInstance.unmount();
    document.body.removeChild(mountNode)
  }, timeout)
}

export default createMessage
