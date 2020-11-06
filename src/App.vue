<template>
  <div class="container">
    <global-header :user="user"></global-header>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader, {UserProps} from './components/GlobalHeader.vue'
const currentUser: UserProps = {
  isLogin: false,
  name: "小周"
}
export default defineComponent({
  components: {
    GlobalHeader,
  },
  setup () {
    return {
      user:currentUser,
    }
  }
})
</script>
<style lang="scss">
html,body,#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
