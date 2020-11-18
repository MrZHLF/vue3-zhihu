<template>
  <div class="container">
    <global-header :user="user"></global-header>
    <loader v-if="isLoading" text="加载中" background="rgba(0,0,0,.8)"></loader>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from './components/Loader.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from './store'
import createMessage from './components/createMessage'
import axios from 'axios'
export default defineComponent({
  components: {
    GlobalHeader,
    Loader
  },
  setup () {
    const store = useStore<GlobalDataProps>();
    const isLoading = computed(() => store.state.loading)
    const user = computed(() => store.state.user)
    const token = computed(() => store.state.token)
    const error = computed(() => store.state.error)
    onMounted(() => {
      if(!user.value.isLogin &&token.value) {
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`;
        store.dispatch('fetchCurrentUser')
      }
    })
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error')
      }
    })
    return {
      user,
      isLoading
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
