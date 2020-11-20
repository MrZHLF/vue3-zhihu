<template>
  <div>
    <h1>{{currentPost.title}}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { GlobalDataProps } from './../store'
import axios from 'axios'
export default defineComponent({
  setup () {
    const route = useRoute()
    const store = useStore()
    const currentPost=ref({})
    const currentId = route.params.id
    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })
    axios.get(`/posts/${currentId}`).then((res) => {
      console.log(res.data.data);
      currentPost.value =res.data.data
    })
    return {
      currentPost
    }
  }
})
</script>

<style scoped>

</style>