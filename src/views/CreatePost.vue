<!--
 * @Author: your name
 * @Date: 2021-03-26 19:10:53
 * @LastEditTime: 2021-04-13 16:08:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\views\CreatePost.vue
-->
<template>
  <div class="create-post-page">
    <h4>{{ isEditMode ? "编辑文章" : "创建文章" }}</h4>
    <!-- 只有字符串才不用 : ,传其他的都要:， 子组件发射出来的用@  -->
    <uploader
      action="upload"
      :beforeUpload="commonUploadCheck"
      @file-uploaded="handleFileUploaded"
      :uploaded="uploadedData"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <!-- 父组件createpost拿到了子组件uploader的属性 -->
      <template #uploaded="dataProps">
        <div class="uploaded-area">
          <!-- 上传完成后获得图片 -->
          <img :src="dataProps.uploadedData.data.url" />
          <h3>点击重新上传</h3>
        </div>
      </template>
    </uploader>

    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情（支持markdown格式）：</label>
        <validate-input
          rows="10"
          type="text"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">
          {{ isEditMode ? "更新文章" : "发表文章" }}
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";

import { useRouter, useRoute } from "vue-router";
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from "../store";
import { commonUploadCheck } from "../helper";

import ValidateInput, { RulesProp } from "../components/validation/ValidateInput.vue";
import ValidateForm from "../components/validation/ValidateForm.vue";
import Uploader from "../components/upLoad/Uploader.vue";
import createMessage from "../components/createMessage";

export default defineComponent({
  name: "Login",
  components: {
    ValidateInput,
    ValidateForm,
    Uploader,
  },
  setup() {
    const router = useRouter();
    const store = useStore<GlobalDataProps>();
    const route = useRoute();

    // 两个感叹号来转布尔类型，判断是否存在
    // 页面跳转过来的时候会带着，就可以用一个页面实现两个功能（两个页面非常像）
    const isEditMode = !!route.query.id;
    const uploadedData = ref();

    const titleVal = ref("");
    const titleRules: RulesProp = [{ type: "required", message: "文章标题不能为空" }];

    const contentVal = ref("");
    const contentRules: RulesProp = [{ type: "required", message: "文章详情不能为空" }];

    let imageId = "";

    // 创建模式，需要直接填充数据
    onMounted(() => {
      if (isEditMode) {
        store
          .dispatch("fetchPost", route.query.id)
          .then((post: ResponseType<PostProps>) => {
            // 1. 头图
            const currentPost = post.data;
            if (currentPost.image) {
              uploadedData.value = { data: currentPost.image };
            }
            // 2. 文章标题
            titleVal.value = currentPost.title;
            // 3. 文章内容
            contentVal.value = currentPost.content || "";
          });
      }
    });

    const onFormSubmit = (result: boolean) => {
      if (result) {
        // 对象结构赋值
        const { column, _id } = store.state.user;
        if (column) {
          // content需要支持markdown
          //
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id,
            // createdAt: new Date().toLocaleString(),
          };
          if (imageId) {
            newPost.image = imageId;
          }

          const actionName = isEditMode ? "updatePost" : "createPost";
          const sendData = isEditMode
            ? {
                id: route.query.id, // 更新文章需要原来的id
                payload: newPost,
              }
            : newPost;

          // 更新文章/创建文章
          store.dispatch(actionName, sendData).then(() => {
            createMessage("发表成功, 2秒后跳转到新的文章", "success", 2000);
            setTimeout(() => {
              // 跳转到详情页面
              router.push({ name: "column", params: { id: column } });
            }, 2000);
          });
        }
      }
    };

    // 图片上传完成后，返回图片的id
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id;
      }
    };

    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      commonUploadCheck,
      handleFileUploaded,
      uploadedData,
      onFormSubmit,
      isEditMode,
    };
  },
});
</script>
<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #ccc;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.uploaded-area {
  position: relative;
  height: 100%;
}
.uploaded-area:hover h3 {
  display: block;
}
.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  height: 50%;
  top: 50%;
}
</style>
