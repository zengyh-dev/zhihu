<!--
 * @Author: your name
 * @Date: 2021-03-25 18:06:20
 * @LastEditTime: 2021-04-12 20:18:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\components\validateInput\ValidateInput.vue
-->
<template>
  <div class="validate-input-container pb-3">
    <!--  -->
    <!-- 数据双向绑定使用 v-model，负责监听用户的输入事件来更新数据 -->
    <!-- 动态class，值为true，就有键class -->
    <!-- 父组件使用时 要让传递的属性加到指定的元素上，使用 v-bind="$attrs"-->
    <!-- blur失去焦点时触发验证 -->
    <input
      v-if="tag !== 'textarea'"
      type="text"
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
    />
    <textarea
      v-else
      type="text"
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
    />
    <!-- 展示错误信息 invalid-feedback -->
    <span v-if="inputRef.error" class="invalid-feedback">
      {{ inputRef.message }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, onMounted, watch, computed } from "vue";
import { emitter } from "./ValidateForm.vue";

const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// 规则类型+错误信息
interface RuleProp {
  type: "required" | "email" | "custom" | "range"; // 各种规则类型
  message?: string; // 错误信息
  validator?: () => boolean; // 返回布尔类型的函数函数
  min?: { length: number; message: string }; // 最短
  max?: { length: number; message: string }; // 最长
}

// 规则数组
export type RulesProp = RuleProp[];

export type TagType = "input" | "textarea";
export default defineComponent({
  data() {
    return {};
  },
  props: {
    // 要使用规则验证，需要传入（规则类型+错误信息）数组，
    rules: Array as PropType<RulesProp>,
    modelValue: String, // 1. 自定义组件双向绑定：需要modelValue属性
    // 输入域类型，可以是input（默认）也可以是textarea
    tag: {
      type: String as PropType<TagType>,
      default: "input",
    },
  },
  // 不希望父组件使用时 传递的属性 直接放到子元素的根节点上
  inheritAttrs: false,
  setup(props, context) {
    // context.attrs是个proxy对象：实现响应式对象的基础类型
    // console.log(context.attrs);

    // 输入的数据对象，包括数据和错误信息
    // inputRef只有第一次setup中设置为了下面的值，后面更改就不会更新
    // 这里我们使用计算属性的set，每次更新值的时候，发射更新函数
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue || "",
        set: val => context.emit("update:modelValue", val)
      }),
      error: false,
      message: "",
    });

    // 规则验证
    const validateInput = () => {
      if (props.rules) {
        // 所有输入的规则校验都去 校验输入的数据
        // every 要每个都是 true才会为true
        const allPassed = props.rules.every((rule) => {
          let passed = true; // 临时变量
          inputRef.message = rule.message || "";
          // 多种规则，使用switch
          switch (rule.type) {
            case "required":
              passed = inputRef.val.trim() !== "";
              break;
            case "email":
              passed = emailReg.test(inputRef.val);
              break;
            case "custom": // 自定义规则执行
              passed = rule.validator ? rule.validator() : true;
              break;
            default:
              break;
          }
          return passed;
        });
        // 是否出错
        inputRef.error = !allPassed;
        return allPassed;
      }
    };

    const clearInput = () => {};
    // 挂载后，
    onMounted(() => {
      emitter.emit("form-item-created", validateInput);
    });
    return {
      inputRef,
      validateInput,
    };
  },
});
</script>
