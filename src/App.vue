<!--
 * @Author: your name
 * @Date: 2021-03-25 09:36:01
 * @LastEditTime: 2021-04-11 16:27:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\App.vue
-->
<template>
  <!-- boostrap要用container包裹 -->
  <div class="container">
    <!-- 固定的全局顶栏 -->
    <global-header :user="currentUser"></global-header>

    <loader v-if="isLoading" text="拼命加载中" background="rgba(0, 0, 0, 0.8)"></loader>
    <!-- 页面内容/路由出口 -->
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2020 者也专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import "bootstrap/dist/css/bootstrap.min.css";
import { defineComponent, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { GlobalDataProps,  } from "./store";
import GlobalHeader from "./components/globalheader/GlobalHeader.vue";
import Loader from "./components/loader/Loader.vue";
import createMessage from "./components/createMessage";

export default defineComponent({
  name: "App",
  components: {
    GlobalHeader,
    Loader,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const currentUser = computed(() => store.state.user);
    const isLoading = computed(() => store.state.loading);
    const token = computed(() => store.state.token);
    const error = computed(() => store.state.error);



    watch(
      () => error.value.status,
      () => {
        const { status, message } = error.value;
        if (status && message) {
          createMessage(message, "error");
        }
      }
    );



    return {
      currentUser,
      isLoading,
      error,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
