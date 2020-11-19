<template>
  <div>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label" >邮箱地址</label>
        <validate-input :rules="emailRules" placeholder="请输入邮箱地址" v-model="formData.email" type="email"></validate-input>
      </div>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label" >昵称</label>
        <validate-input :rules="nickNameRules" placeholder="请输入昵称" v-model="formData.nickName" type="text"></validate-input>
      </div>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label" >密码</label>
        <validate-input :rules="passwordRules" placeholder="请输入密码" v-model="formData.password" type="password"></validate-input>
      </div>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label" >确认密码</label>
        <validate-input :rules="repeatPasswordRules" placeholder="请输入确认密码" v-model="formData.repeatPassword" type="password"></validate-input>
      </div>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ValidateInput, {RulesProp} from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import createMessage from './../components/createMessage'
export default defineComponent({
  components:{
    ValidateInput,
    ValidateForm
  },
  setup () {
    const router = useRouter()
    const formData = reactive({
      email: "",
      nickName: "",
      password: "",
      repeatPassword: ""
    })
    const emailRules: RulesProp = [
      {type: 'required', message: '邮箱地址不能为空'},
      {type: 'email', message: '请输入正确的邮箱地址'}
    ]
    const nickNameRules: RulesProp = [
      {type: 'required', message: '昵称不能为空'},
    ]
    const passwordRules: RulesProp = [
      {type: 'required', message: '密码不能为空'},
    ]
    const repeatPasswordRules: RulesProp = [
      {type: 'required', message: '确认密码不能为空'},
      {
        type: 'custom',
        validator: () => {
          return formData.password === formData.repeatPassword
        },
        message: '密码不相同'
      }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: formData.email,
          nickName: formData.nickName,
          password: formData.password
        }
        axios.post('/users/',payload).then((res) => {
          createMessage('注册成功 正在跳转登录页面', 'success')
          setTimeout(() => {
            router.push('/login')
          },2000)
        }).catch(e => {
          console.log(e);
        })
      }
    }
    return {
      emailRules,
      nickNameRules,
      passwordRules,
      repeatPasswordRules,
      formData,
      onFormSubmit
    }
  }
})
</script>

<style scoped>

</style>