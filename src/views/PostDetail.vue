<template>
  <div>
    <Modal title="删除文章" 
      :visible="modalIsVisible" 
      @modal-on-close="modalIsVisible=false" 
      @modal-on-confirm="hideAndDelete">
      <p>确定要删除这篇文章吗？</p>
    </Modal>
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
      
      <img :src="currentImageUrl" alt="currentPost.title" class="rounded-lg img-fluid my-4" v-if="currentImageUrl">
      <h2 class="mb-4">{{currentPost.title}}</h2>
      <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
        <div class="col">
          <user-profile :user="currentPost.author"></user-profile>
        </div>
        <span class="text-muted col text-right font-italic">发表于:{{currentPost.createdAt}}</span>
      </div>
      <div v-html="currentPost.content"></div>
      <div v-if="showEditArea" class="btn-group mt-5">
        <router-link
          type="button"
          class="btn btn-success"
          :to="{name: 'create', query: { id: currentPost._id}}"
        >
          编辑
        </router-link>
        <button type="button" class="btn btn-danger" @click.prevent="modalIsVisible = true" >删除</button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { GlobalDataProps, ImageProps, UserProps, ResponseType, PostProps } from './../store'
import axios from 'axios'
import UserProfile from './../components/UserProfile.vue'
import Modal from './../components/Modal.vue'
import createMessage from './../components/createMessage'
export default defineComponent({
  components: {
    UserProfile,
    Modal
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const currentPost=ref()
    const currentId = route.params.id
    const modalIsVisible = ref(false)
    onMounted(() => {
      store.dispatch('fetchPosts', currentId)
    })
    axios.get(`/posts/${currentId}`).then((res) => {
      if (res.data.code ==0) {
        console.log(res.data.data);
        currentPost.value =res.data.data
      }
    })
    const currentImageUrl = computed(() => {
      if (currentPost.value) {
        const { image } = currentPost.value;
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })
    const showEditArea = computed(() => {
      const { isLogin, _id } = store.state.user
      if (currentPost.value && currentPost.value.author && isLogin) {
        const postAuthor = currentPost.value.author as UserProps
        return postAuthor._id === _id
      } else {
        return false
      }
    })
    const hideAndDelete = () => {
      modalIsVisible.value = false
      store.dispatch('deletePost', currentId).then((rawData: ResponseType<PostProps>) => {
        createMessage('删除成功,2秒后跳转到专栏首页', 'success',2000)
        setTimeout(() => {
          router.push({name: 'column', params: { id: rawData.data.column }})
        }, 2000)
      })
    }
    return {
      currentPost,
      currentImageUrl,
      showEditArea,
      modalIsVisible,
      hideAndDelete
    }
  }
})
</script>

<style scoped>

</style>