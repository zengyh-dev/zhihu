<!--
 * @Author: your name
 * @Date: 2021-03-26 09:06:35
 * @LastEditTime: 2021-04-06 22:29:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\components\validateForm\ValidateForm.vue
-->
<template>
  <form class="validate-form-container">
    <!-- 插槽1：表单项目，默认插入位置 -->
    <slot name="default"></slot>
    <!-- 表单提交 -->
    <div class="submit-area" @click.prevent="submitForm">
      <!-- 插槽2：提交按钮，可以自定义 -->
      <slot name="submit">
        <!-- 可以添加默认内容 -->
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from "vue";
import mitt, { Handler } from "mitt";
type ValidateFunc = () => boolean;
type ClearFunc = () => void;

// 给validateinput用
export const emitter = mitt();

export default defineComponent({
  name: "ValidateForm",
  emits: ["form-submit"], // 没有事件验证，就可以用数组定义名称
  setup(props, context) {
    // 一组函数
    let funcArr: ValidateFunc[] = [];
    let clearArr: ClearFunc[] = [];

    // 表单提交，循环验证
    const submitForm = () => {
      // every提前停止循环，只要有错的，后面就不运行了
      // 使用map返回布尔数组
      const result = funcArr.map((func) => func()).every((result) => result)
      // 验证出错，清空所有的
      if (!result) {

      } else {
        context.emit("form-submit", result);
      }
    };

    // 监听器响应函数
    const callback: Handler = (func: ValidateFunc) => {
      // 放入数组存起来
      funcArr.push(func);
    };

    // 事件监听器
    emitter.on("form-item-created", callback);
    onUnmounted(() => {
      emitter.off("form-item-created", callback);
    });
    return {
      submitForm,
    };
  },
});
</script>

<style type="text/css" scoped></style>
