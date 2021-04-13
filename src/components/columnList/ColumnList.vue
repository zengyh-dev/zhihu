<!--
 * @Author: your name
 * @Date: 2021-03-25 10:04:31
 * @LastEditTime: 2021-04-08 20:22:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\components\ColumnList.vue
-->

<template>
  <div class="row">
    <!-- 一行为12 12/4 = 3  这里三等分 -->
    <div v-for="column in columnList" :key="column._id" class="col-4 mb-4">
      <!-- card样式 -->
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img
            :src="column.avatar && column.avatar.url"
            :alt="column.title"
            class="rounded-circle border border-light my-3"
          />
          <h5 class="card-title">{{ column.title }}</h5>
          <p class="card-text text-left">{{ column.description }}</p>
          <!-- 动态跳转 -->
          <router-link :to="`/column/${column._id}`" class="btn btn-outline-primary"
            >进入专栏</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { ColumnProps } from "../../store";

export default defineComponent({
  name: "ColumnList",
  props: {
    list: {
      // 这里特别有一点，我们现在的 Array 是没有类型的，
      // 只是一个数组，我们希望它是一个 ColomnProps 的数组，
      // 那么我们是否可以使用了类型断言直接写成 ColomnProps[]，显然是不行的 ，
      // 因为 Array 是一个数组的构造函数不是类型，
      // 我们可以使用 PropType 这个方法，
      // 它接受一个泛型，将 Array 构造函数返回传入的泛型类型。
      type: Array as PropType<ColumnProps[]>,
      required: true,
    },
  },
  setup(props) {
    // 计算属性
    const columnList = computed(() => {
      //
      return props.list.map((column) => {
        if (!column.avatar) {
          column.avatar = {
            url: require("@/assets/column.png"),
          };
        } else {
          // 添加参数改变大小
          column.avatar.url =
            column.avatar.url + "?x-oss-process=image/resize,m_pad,h_50,w_50";
        }
        return column;
      });
    });
    return {
      columnList,
    };
  },
});
</script>

<style type="text/css" scoped>
/* 改变大小 */
.card-body img {
  width: 80px;
  height: 80px;
}
</style>
