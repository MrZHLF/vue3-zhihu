<template>
  <div class="container">
    <global-header :user="user"></global-header>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import { useStore } from 'vuex'
export default defineComponent({
  components: {
    GlobalHeader,
  },
  setup () {
    const store = useStore();
    const user = computed(() => store.state.user)
    return {
      user
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
