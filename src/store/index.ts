import { createStore } from 'vuex'
import { testData, testPosts, PostProps } from './../testData'
import axios from 'axios'

interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?: number;
}
interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}

export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}

export interface GlobalDataProps { 
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
export default createStore<GlobalDataProps>({
  state: {
    columns: [],
    posts: testPosts,
    user: { isLogin: false, name: '小周', columnId: 1 }
  },
  mutations: {
    login (state) {
      state.user = { ...state.user, isLogin:true, name:"小周" }
    },
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns(state,rawData) {
      state.columns = rawData.data.list
    }
  },
  actions: {
    fetchColumns(context) {
      axios.get('/columns').then(resp => {
        context.commit('fetchColumns', resp.data)
      })
    }
  },
  getters: {
    getColumnById: (state) => (id: number) => {
      // return state.columns.find(c => c._id == id)
    },
    getPostsById: (state)  => (cid: number) => {
      return state.posts.filter(post => post.columnId == cid)
    }
  }
})
