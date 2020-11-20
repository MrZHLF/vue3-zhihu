<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <Uploader
      action="/upload"
      :beforeUpload="uploadCheck"
      @file-uploaded="handleFileUploaded"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only"></span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadeData.data.url"/>
      </template>
    </Uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <validate-input
          type="text"
          :rules="titleRules"
          placeholder="请输入文章标题"
          v-model="titleVal"
        ></validate-input>
      </div>
      <div class="mb-3">
        <validate-input
          type="text"
          :rules="contenRules"
          row="10"
          tag="textarea"
          placeholder="输入文章详情"
          v-model="contentVal"
        ></validate-input>
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">发表文章</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateForm from './../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from './../components/ValidateInput.vue'
import Uploader from './../components/Uploader.vue'
import { GlobalDataProps,PostProps , ResponseType, ImageProps } from './../store'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import router from '@/router'
import createMessage from './../components/createMessage'
import { beforeUploadCheck } from '@/helper'
export default defineComponent({
  name: 'create',
  components: {
    ValidateForm,
    ValidateInput,
    Uploader,
  },
  setup() {
    const titleVal = ref('')
    const contentVal = ref('')
    let imageId = ''
    const store = useStore<GlobalDataProps>()
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' },
    ]
    const contenRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' },
    ]
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if(rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }
          store.dispatch('createPost', newPost).then(() =>{
            createMessage('发表成功,2秒后跳转到文章', 'success',2000)
            setTimeout(() =>{
              router.push({ name: 'column', params: { id: column } })    
            },2000)
          })
        }
      }
    }
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是 JPG/PNG 格式!', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不能超过 1Mb', 'error')
      }
      return passed
    }
    return {
      titleVal,
      titleRules,
      contentVal,
      contenRules,
      onFormSubmit,
      uploadCheck,
      handleFileUploaded
    }
  },
})
</script>

<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded-area {
  position: relative;
}
.uploaded-area:hover h3 {
  display: block;
}
.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top: 50%;
}
</style>