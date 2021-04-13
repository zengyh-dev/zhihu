<!--
 * @Author: your name
 * @Date: 2021-04-12 10:31:06
 * @LastEditTime: 2021-04-12 22:30:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\components\Modal.vue
-->
<template>
  <!-- 弹出框传送 -->
  <teleport to="#modal">
    <div class="modal d-block" tabindex="-1" v-if="visible">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <!-- 核心按钮 -->
            <button type="button" class="close" aria-label="Close" @click="onClose">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>{{ content }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="onClose">取消</button>
            <button type="button" class="btn btn-primary" @click="onConfirm">确定</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// 创建节点
import useDOMCreate from "../hooks/useDOMCreate";
export default defineComponent({
  name: "modal",
  props: {
    content: String,
    title: String,
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["modal-on-close", "modal-on-confirm"],
  setup(props, context) {
    useDOMCreate("modal"); 
    // 关闭信号
    const onClose = () => {
      context.emit("modal-on-close");
    };
    // 确认信号
    const onConfirm = () => {
      context.emit("modal-on-confirm");
    };
    return {
      onClose,
      onConfirm,
    };
  },
});
</script>
