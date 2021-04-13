<!--
 * @Author: your name
 * @Date: 2021-03-25 15:21:36
 * @LastEditTime: 2021-04-04 17:50:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\components\Dropdown.vue
-->
<template>
  <div class="dropdown" ref="dropdownRef">
    <a
      href="#"
      class="btn btn-outline-light my-2 dropdown-toggle"
      @click.prevent="toggleOpen"
    >
    <!-- click.prevent防止默认行为 -->
      {{ title }}</a
    >
    <!--                      默认看不见，这里要设置为看得见    通过v-if来判断打开与否 -->
    <ul class="dropdown-menu" :style="{ display: 'block' }" v-if="isOpen">
      <!-- 插槽，只有一个插入位，就不用具名化了 -->
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import useClickOutside from "../../hooks/useClickOutside";
export default defineComponent({
  name: "Dropdown",
  props: {
    // props直接在模板里使用
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    // 下拉菜单的显示和隐藏
    const isOpen = ref(false);
    const toggleOpen = () => {
      isOpen.value = !isOpen.value;
    };

    // 通过响应式对象来获取DOM节点
    // 注意return的时候名字和上面的ref一样就行
    const dropdownRef = ref<null | HTMLElement>(null);

    // 抽离 判断是否点击外面组件 的逻辑代码
    // 传入响应式对象
    const isClickOutside = useClickOutside(dropdownRef);

    // 监听响应式对象变化
    watch(isClickOutside, () => {
      if (isOpen.value && isClickOutside.value) {
        isOpen.value = false;
      }
    });

    return {
      isOpen,
      toggleOpen,
      dropdownRef,
    };
  },
});
</script>

<style type="text/css" scoped></style>
