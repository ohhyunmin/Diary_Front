<template>
  <div class = "app">
    <NavigationBar @route-change="handleRouteChange" />
    <HomePage v-if="state.currentRoute === '/'" />
    <CardPage v-if="state.currentRoute === '/cardPage'" 
      :post="state.currentPost"
    />
    <BoardPage 
      v-if="state.currentRoute === '/boardPage'" 
      @navigate="handleRouteChange"
      :loginForm="state.loginForm"
    />
    <BoardWrite 
      v-if="state.currentRoute === '/boardWrite'"
      @submit="handlePostSubmit"
      @cancel="handleRouteChange('/boardPage')"
      @registerPost="registerPost"
      :loginForm="state.loginForm"
    />
    <BoardDetail 
      v-if="state.currentRoute === '/boardDetail'"
      @navigate="handleRouteChange"
      :loginForm="state.loginForm"
      :post="state.currentPost"
    />
    <BoardUpdate
      v-if="state.currentRoute === '/boardUpdate'"
      @navigate="handleRouteChange"
      :loginForm="state.loginForm"
      :post="state.currentPost"
    />
  </div>
</template>

<script>

import { reactive, onMounted  } from "vue";
import NavigationBar from './components/NavigationBar.vue'
import CardPage from './components/CardPage.vue'
import HomePage from './components/HomePage.vue'
import BoardPage from './components/BoardPage.vue'
import BoardWrite from './components/BoardWrite.vue'
import BoardDetail from './components/BoardDetail.vue';
import BoardUpdate from './components/BoardUpdate.vue';

export default {
  components: {
    NavigationBar,
    CardPage,
    HomePage,
    BoardPage,
    BoardWrite,
    BoardDetail,
    BoardUpdate
  },

  setup(){
    const state = reactive({
      currentRoute: '/',
      loginForm: null,
      currentPost: null
    });

    const handleRouteChange = (payload) => {
      if (typeof payload === 'string') {
        state.currentRoute = payload;
      } else if (payload && typeof payload === 'object') {
        state.currentRoute = payload.route || state.currentRoute;
        state.loginForm = payload.loginForm || null;
        state.currentPost = payload.post || null;
      }
    };

    const handlePostSubmit = () => {
      handleRouteChange('/boardPage');
    };

    const registerPost = () => {
      handleRouteChange('/boardPage');
    };

    return {
      onMounted,
      state,
      handleRouteChange,
      handlePostSubmit,
      registerPost
    };
  },
};
</script>
