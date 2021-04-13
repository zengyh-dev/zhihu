<!--
 * @Author: your name
 * @Date: 2021-03-26 15:35:59
 * @LastEditTime: 2021-04-12 14:39:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\components\postList\postList.vue
-->
<template>
  <div class="post-list">
    <article v-for="post in posts" :key="post._id" class="card mb-3 shadow-sm">
      <div class="card-body">
        <h4>
          <!-- 带着id跳转到对应页面 -->
          <router-link :to="`/posts/${post._id}/`">{{ post.title }}</router-link>
        </h4>
        <div class="row my-3 align-items-center">
          <!-- 这里注意，要手动加条件促成type guard -->
          <div v-if="post.image && typeof post.image !== 'string'" class="col-4">
            <img :src="post.image.fitUrl" :alt="post.title" class="rounded-lg w-100" />
          </div>
          <p :class="{ 'col-8': post.image }" class="text-muted">{{ post.excerpt }}</p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { PostProps, ImageProps } from "../../store";
import { generateFitUrl } from "../../helper";
export default defineComponent({
  props: {
    list: {
      required: true,
      type: Array as PropType<PostProps[]>,
    },
  },
  setup(props) {
    const posts = computed(() => {
      return props.list.map((post) => {
        // 生成图片地址
        generateFitUrl(post.image as ImageProps, 200, 110, ["m_fill"]);
        return post;
      });
    });
    return {
      posts,
    };
  },
});
</script>

<style scoped>
.post-list h4 a {
  text-decoration: none;
  color: #1a1a1a;
}
.post-list h4 a:hover {
  color: #0d6efd;
}
</style>
