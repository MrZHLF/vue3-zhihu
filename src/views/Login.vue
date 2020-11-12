<template>
  <div>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">邮箱地址</label>
        <validate-input :rules="emailRules" v-model="emailValue" placeholder="请输入邮箱地址" type="email"></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input :rules="passwordRules" v-model="passwordlValue" placeholder="请输入密码" type="password"></validate-input>
      </div>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateInput, {RulesProp} from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import { useRouter} from 'vue-router'
import {useStore} from 'vuex'
export default defineComponent({
  components:{
    ValidateInput,
    ValidateForm
  },
  setup () {
    const router = useRouter()
    const store = useStore()
    const inputRef = ref<any>()
    const emailValue = ref('13@qq.com')
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const passwordlValue = ref('1515')
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        router.push('/')
        store.commit('login')
      }
    }
    return {
      emailRules,
      passwordRules,
      passwordlValue,
      emailValue,
      onFormSubmit,
      inputRef
    }
  }
})
</script>

<style scoped>

</style>