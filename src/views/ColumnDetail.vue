<template>
  <div class="column-detail-page w-690">
    55558
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { testData, testPosts } from './../testData'
export default defineComponent({
  setup () {
    const route = useRoute()
    const currentId = +route.params.id //路由跳转id
    const column = testData.find(c => c.id === currentId)
    const list = testPosts.filter(post => post.columnId === currentId)
    return {
      column,
      list
    }
  }
})
</script>

<style scoped>

</style>