<!--
 * @Author: your name
 * @Date: 2021-03-25 14:58:07
 * @LastEditTime: 2021-04-11 15:17:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\components\GlobalHeader.vue
-->
<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link class="navbar-brand" to="/">者也专栏</router-link>
    <!-- 两种状态 -->
    <!-- 未登录，登录/注册 -->
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-light my-2">登陆</router-link>
      </li>
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-light my-2">注册</router-link>
      </li>
    </ul>
    <!-- 已经登录，展示用户信息 -->
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <drop-down :title="`你好 ！${user.nickName}`">
          <!-- 插槽插入 -->
          <drop-down-item><router-link to="/create" class="dropdown-item">新建文章</router-link></drop-down-item>
          <drop-down-item><a href="#" class="dropdown-item">编辑资料</a></drop-down-item>
          <drop-down-item :disabled="true"><a href="#" class="dropdown-item">退出登录</a></drop-down-item>
        </drop-down>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import DropDown from "../dropDown/Dropdown.vue";
import DropDownItem from "../dropDown/DropdownItem.vue";
import {UserProps} from '../../store'


export default defineComponent({
  name: "GlobalHeader",
  components: {
    DropDown,
    DropDownItem
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      require: true,
    },
  },
  setup() {},
});
</script>

<style type="text/css" scoped></style>
