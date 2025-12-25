<template>
  <div class = "app">
    <NavigationBar @route-change="handleRouteChange" />
    <HomePage v-if="state.currentRoute === '/'" />
    <CardPage v-if="state.currentRoute === '/about'" />
  </div>
</template>

<script>
// import axios from "axios";
import { reactive } from "vue";
import NavigationBar from './components/NavigationBar.vue'
import CardPage from './components/CardPage.vue'
import HomePage from './components/HomePage.vue'

export default {
  components: {
    NavigationBar,
    CardPage,
    HomePage
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

    // const submit = () =>{
      
    //   const args = {
    //     username : state.form.loginId,
    //     password : state.form.loginPw
    //   };
      
    //   // axios.post("/api/Login", args).then((res)=>{
    //   //   state.account = res.data;
    //   // });
    // };
    
    // const logout = () =>{
    //   axios.get("/api/Login/logout").then();
    // };

    // axios.get("/api/Login/detail").then((res)=>{
    //   state.account = res.data;
    // });

    return {
      state,
      handleRouteChange
    };
  },
};
</script>
