<!--
 * @Author: your name
 * @Date: 2021-03-26 11:11:23
 * @LastEditTime: 2021-04-13 16:59:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\views\Home.vue
-->
<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50" />
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <router-link to="/create" class="btn btn-primary my-2"
              >开始写文章</router-link
            >
            <!-- <a href="#" class="btn btn-primary my-2">开始写文章</a> -->
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list :list="list"></column-list>
    <button
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25"
      @click="loadMorePage"
      v-if="!isLastPage"
    >
      加载更多
    </button>
  </div>
</template>

<script lang="ts">
import ColumnList from "../components/columnList/ColumnList.vue";

import { defineComponent, computed, onMounted } from "vue";
import { GlobalDataProps } from "../store";
import { useStore } from "vuex";
import { objToArr } from "../helper";
import useLoadMore from "../hooks/useLoadMore";

export default defineComponent({
  name: "Home",
  components: {
    ColumnList,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const totalColumns = computed(() => store.state.columns.total || 0);
    const currentPage = computed(() => store.state.columns.currentPage || 0);

    onMounted(() => {
      store.dispatch("fetchColumns");
    });

    const list = computed(() => objToArr(store.state.columns.currentColumns));
    const { loadMorePage, isLastPage } = useLoadMore(
      "fetchColumns",
      totalColumns,
      { currentPage: currentPage.value },
      6
    );

    return {
      list,
      loadMorePage,
      isLastPage,
    };
  },
});
</script>
