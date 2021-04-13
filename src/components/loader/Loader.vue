<!--
 * @Author: your name
 * @Date: 2021-04-09 15:31:51
 * @LastEditTime: 2021-04-10 16:50:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\components\loader\Loader.vue
-->
<template>
  <!-- 传送门 -->
  <teleport to="#back">
    <div
      class="d-flex justify-content-center align-items-center h-100 w-100 loading-container"
      :style="{ backgroundColor: background || '' }"
    >
      <div class="loading-content">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">{{ text || "loading" }}</span>
        </div>
        <p v-if="text" class="text-primary small">{{ text }}</p>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from "vue";
import useDOMCreate from "../../hooks/useDOMCreate";

export default defineComponent({
  props: {
    text: {
      type: String,
    },
    background: {
      type: String,
    },
  },
  // 还未挂载 DOM
  setup() {
    useDOMCreate("back");
  },
});
</script>

<style>
.loading-container {
  background: rgba(255, 255, 255, 0.5);
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
}
.loading-container {
  text-align: center;
}
</style>
