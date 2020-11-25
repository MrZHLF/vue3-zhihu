import { Commit, createStore } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from '@/helper'

export interface ResponseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}

export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}
export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}

export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}

export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
}

interface ListProps<P> {
  [id: string]: P;
}

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

export interface GlobalDataProps { 
  error: GlobalErrorProps;
  token: string;
  columns: ListProps<ColumnProps>;
  posts: ListProps<PostProps>;
  user: UserProps;
  loading: boolean;
}

const getAndCommit = async (url: string, mutationsName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationsName, data)
  return data
}

const postAndCommit = async (url: string, mutationsName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url,payload)
  commit(mutationsName, data)
  return data
}

const asyncAndCommit = async (url: string, mutationsName: string, commit: Commit,config: AxiosRequestConfig = { method: 'get' }) => {
  const { data } = await axios(url, config)
  commit(mutationsName,data)
  return data
}

export default createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('ZhToken') ||  '',
    loading: false,
    columns:{},
    posts: {},
    user: { isLogin: false }
  },
  mutations: {
    login (state,rawData) {
      console.log(rawData,'rawData');
      const { token } = rawData.data
      localStorage.setItem('ZhToken', token )
      state.token = token
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    logout (state) {
      state.token = ''
      localStorage.removeItem('ZhToken')
      delete axios.defaults.headers.common.Authorization
    },
    fetchCurrentUser(state,rawData) {
      state.user = { isLogin: true, ...rawData.data}
    },
    createPost(state, newPost) {
      state.posts[newPost._id] = newPost
    },
    fetchColumns(state,rawData) {
      state.columns = arrToObj(rawData.data.list)
    },
    fetchColumn(state,rawData) {
      state.columns[rawData.data._id] =rawData.data
    },
    fetchPost(state,rawData) {
      state.posts[rawData.data._id] =rawData.data
    },
    fetchPosts(state,rawData) {
      state.posts = arrToObj(rawData.data.list)
    },
    deletePost(state,{ data }) {
      delete state.posts[data._id]
    },
    updatePost(state, { data }) {
      state.posts[data._id] = data
    },
    setLoading(state,status) {
      //加载
      state.loading = status
    },
    setError(state,e: GlobalErrorProps) {
      //信息提醒
      state.error = e
    }
  },
  actions: {
    fetchColumns({ commit }) {
      return getAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn({ commit }, cid) {
      return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPost({ commit }, cid) {
      return getAndCommit(`/posts/${cid}`, 'fetchPost', commit)
    },
    fetchPosts({ commit }, cid) {
      return getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    updatePost({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    deletePost({ commit }, id) {
      // 删除文章
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, {
        method: 'delete'
      })
    },
    fetchCurrentUser( {commit} ) {
      //获取用户信息
      return getAndCommit('/user/current','fetchCurrentUser',commit)
    },
    login ({ commit }, payload) {
      // 登录
      return postAndCommit(`/user/login`, 'login', commit , payload)
    },
    createPost ({ commit }, payload) {
      // 创建文章
      return postAndCommit(`/posts`, 'createPost', commit , payload)
    },
    loginAndFetch({ dispatch },loginData) {
      return dispatch('login',loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns[id]
    },
    getPostsById: (state)  => (cid: string) => {
      return objToArr(state.posts).filter(post => post.column == cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts[id]
    }
  }
})
