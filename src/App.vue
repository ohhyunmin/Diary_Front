<template>
  <div class = "app">
    <NavigationBar @route-change="handleRouteChange" />
    <HomePage v-if="state.currentRoute === '/'" />
    <CardPage v-if="state.currentRoute === '/cardPage'" />
    <BoardPage v-if="state.currentRoute === '/boardPage'" />
  </div>
</template>

<script>

import { reactive } from "vue";
import NavigationBar from './components/NavigationBar.vue'
import CardPage from './components/CardPage.vue'
import HomePage from './components/HomePage.vue'
import BoardPage from './components/BoardPage.vue'

export default {
  components: {
    NavigationBar,
    CardPage,
    HomePage,
    BoardPage
  },

  setup(){
    const state = reactive({
      form:{
        loginId:"",
        loginPw:""
      },
      currentRoute: '/'
    });

    const handleRouteChange = (route) => {
      state.currentRoute = route;
    };
    return {
      state,
      handleRouteChange
    };
  },
};
</script>
