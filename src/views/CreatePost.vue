<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
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
import { GlobalDataProps } from './../store'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import router from '@/router'
export default defineComponent({
  name: 'create',
  components: {
    ValidateForm,
    ValidateInput,
  },
  setup() {
    const titleVal = ref('')
    const contentVal = ref('')
    const store = useStore<GlobalDataProps>()
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' },
    ]
    const contenRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' },
    ]

    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { columnId } = store.state.user
        if (columnId) {
          const newPost = {
            id: new Date().getTime(),
            title: titleVal.value,
            content: contentVal.value,
            columnId,
            createdAt: new Date().toLocaleString()
          }
          store.commit('createPost', newPost)
          router.push({name: 'column', params: {id: columnId} })
        } 
      }
    }

    return {
      titleVal,
      titleRules,
      contentVal,
      contenRules,
      onFormSubmit
    }
  },
})
</script>

<style scoped></style>
