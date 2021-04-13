<!--
 * @Author: your name
 * @Date: 2021-04-10 21:24:49
 * @LastEditTime: 2021-04-12 19:43:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\components\upLoad\uploader.vue
-->
<template>
  <div class="file-upload">
    <!-- 触发上传按钮                                                父组件要给自组件添加的样式  -->
    <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
      <!-- slot的自定义模板 -->
      <!-- 1. 上传中的样式 -->
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <!-- 2. 上传成功样式 -->
      <!-- slot也可以传入参数   这里传入了uploadedData 用于显示加载的图片-->
      <slot
        v-else-if="fileStatus === 'success'"
        name="uploaded"
        :uploadedData="uploadedData"
      >
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <!-- 3. 初始上传样式 -->
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <!-- 实际上传 -->
    <!-- d-none隐藏起来 -->
    <input
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, watch } from "vue";
import { request } from "../../network/request";

// 上传的几个状态 ：    准备       上传中        成功        错误
type UploadStatus = "ready" | "loading" | "success" | "error";
type CheckFunction = (file: File) => boolean;
export default defineComponent({
  props: {
    // 发送的地址
    action: {
      type: String,
      required: true,
    },
    // 发送内容的检查函数（非必须）
    beforeUpload: {
      type: Function as PropType<CheckFunction>,
    },
    // 更新模式时候把请求到的数据放这里
    uploaded: {
      type: Object,
    },
  },
  // 不要继承到根组件上
  inheritAttrs: false,
  // 自定义发射事件
  emits: ["file-uploaded", "file-uploaded-error"],
  setup(props, context) {
    // input类型的响应式对象，return同名，上面定义同名ref就可以获得
    const fileInput = ref<null | HTMLInputElement>(null);
    //                                   已经上传了（更新模式用）        准备上传（创建模式用）
    const fileStatus = ref<UploadStatus>(props.uploaded ? "success" : "ready");

    const uploadedData = ref(props.uploaded);

    // 追踪uploaded数据更新
    // 第一个参数要是响应式对象
    // 但是uploaded是个普通obj
    // 所以用第二种参数：返回函数
    watch(
      () => props.uploaded,
      (newValue) => {
        if (newValue) {
          fileStatus.value = "success";
          uploadedData.value = newValue;
        } else {
          fileStatus.value = "ready";
        }
      }
    );
    // 触发上传
    const triggerUpload = () => {
      if (fileInput.value) {
        // 相当于帮用户点击input
        fileInput.value.click();
      }
    };
    // 上传事件
    const handleFileChange = (e: Event) => {
      // 获取当前点击的input元素
      const currentTarget = e.target as HTMLInputElement;
      // 获取文件列表，有文件才处理
      if (currentTarget.files) {
        const files = Array.from(currentTarget.files); // 文件列表转为数组
        // 是否有文件检查函数
        if (props.beforeUpload) {
          // 检查文件
          const result = props.beforeUpload(files[0]);
          if (!result) {
            return; // 不满足
          }
        }

        fileStatus.value = "loading"; // loading状态

        const formData = new FormData();
        formData.append("file", files[0]);
        // 提交请求
        request(props.action, "post", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
          .then((resp) => {
            fileStatus.value = "success";
            uploadedData.value = resp.data;
            // 成功，发射数据给父组件
            context.emit("file-uploaded", resp.data);
          })
          .catch((error) => {
            fileStatus.value = "error";
            // 失败，发射错误原因给父组件
            context.emit("file-uploaded-error", { error });
          })
          .finally(() => {
            if (fileInput.value) {
              fileInput.value.value = "";
            }
          });
      }
    };
    return {
      fileInput,
      triggerUpload,
      fileStatus,
      uploadedData,
      handleFileChange,
    };
  },
});
</script>
