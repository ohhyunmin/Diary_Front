<template>
  <div class = "app">
    <NavigationBar @route-change="handleRouteChange" />
    <HomePage v-if="state.currentRoute === '/'" />
    <CardPage v-if="state.currentRoute === '/cardPage'" />
    <BoardPage 
      v-if="state.currentRoute === '/boardPage'" 
      @navigate="handleRouteChange"
      :newPost="state.newPost"
    />
    <BoardWrite 
      v-if="state.currentRoute === '/boardWrite'"
      @submit="handlePostSubmit"
      @cancel="handleRouteChange('/boardPage')"
      @registerPost="registerPost"
    />
  </div>
</template>

<script>

import { reactive } from "vue";
import NavigationBar from './components/NavigationBar.vue'
import CardPage from './components/CardPage.vue'
import HomePage from './components/HomePage.vue'
import BoardPage from './components/BoardPage.vue'
import BoardWrite from './components/BoardWrite.vue'

export default {
  components: {
    NavigationBar,
    CardPage,
    HomePage,
    BoardPage,
    BoardWrite
  },

  setup(){
    const state = reactive({
      form:{
        loginId:"",
        loginPw:""
      },
      currentRoute: '/',
      newPost: null
    });

    const handleRouteChange = (route) => {
      state.currentRoute = route;
    };

    const handlePostSubmit = (post) => {
      // 새 글 데이터를 state에 저장하고 BoardPage로 이동
      state.newPost = post;
      handleRouteChange('/boardPage');
    };

    const registerPost = () => {
      handleRouteChange('/boardPage');
    };

    return {
      state,
      handleRouteChange,
      handlePostSubmit,
      registerPost
    };
  },
};
</script>
