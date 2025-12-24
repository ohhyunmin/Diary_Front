<template>
  <div class = "app">
    <NavigationBar />
    
    
  </div>
</template>

<script>
// import axios from "axios";
import { reactive } from "vue";

import NavigationBar from './components/NavigationBar.vue'

export default {
  components: {
    NavigationBar
  },

  setup(){
    const state = reactive({
      form:{
        loginId:"",
        loginPw:""
      }
    });

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

    return {state};
  },
};
</script>
