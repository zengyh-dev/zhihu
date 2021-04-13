<!--
 * @Author: your name
 * @Date: 2021-03-26 11:11:30
 * @LastEditTime: 2021-04-12 19:59:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\views\Login.vue
-->
<template>
  <div class="login-page">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules"
          v-model="emailVal"
          placeholder="请输入邮箱地址"
          type="text"
          ref="inputRef"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules"
          v-model="passwordVal"
        />
      </div>
      <!-- 这里有具名插槽，可以自定义提交按钮 -->
      <!-- <template #submit>
        <span class="btn btn-danger">submit </span>
      </template> -->
    </validate-form>
  </div>
</template>

<script lang="ts">
import ValidateInput, { RulesProp } from "../components/validation/ValidateInput.vue";
import ValidateForm from "../components/validation/ValidateForm.vue";

// useRouter: 定义路由行为
// useRoute:  获取路由信息
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { defineComponent, ref, onMounted } from "vue";
import createMessage from "../components/createMessage";

export default defineComponent({
  name: "Login",
  components: {
    ValidateInput,
    ValidateForm,
  },
  onMounted() {
    console.log(ValidateForm.hasOwnProperty("data"));
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    // 邮箱值和验证
    const emailVal = ref("");
    const emailRules: RulesProp = [
      { type: "required", message: "电子邮箱地址不能为空" },
      { type: "email", message: "请输入正确的电子邮箱格式" },
    ];

    // 密码值和验证
    const passwordVal = ref("");
    const passwordRules: RulesProp = [{ type: "required", message: "密码不能为空" }];

    const onFormSubmit = (result: boolean) => {
      console.log("result", result);
      if (result) {
        const payload = {
          email: emailVal.value,
          password: passwordVal.value,
        };
        store
          .dispatch("loginAndFetch", payload)
          .then((data) => {
            createMessage("登录成功", "success");
            setTimeout(() => {
              router.push("/");
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
    return {
      emailRules,
      emailVal,
      passwordVal,
      passwordRules,
      onFormSubmit,
    };
  },
});
</script>
