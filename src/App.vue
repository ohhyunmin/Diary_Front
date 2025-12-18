<template>
  <div class = "app">
    <div v-if="state.account.username">안녕하세요. {{state.account.id}} 번, {{ state.account.username }} 님 !
      <button @click="logout">로그아웃</button>
    </div>
    
    <div v-else>
      <label for="loginId">
        <span>아이디</span>
        <input type="text" id="loginId" v-model="state.form.loginId"/>
      </label>
      <label for="loginPw">
        <span>패스워드</span>
        <input type="password" id="loginPw" v-model="state.form.loginPw"/>
      </label>
      <button @click="submit">로그인</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {reactive} from "vue";
export default {
  setup(){
    const state = reactive({
      account:{
        id:null,
        username:""
      },
      form:{
        loginId:"",
        loginPw:""
      }
    });

    const submit = () =>{
      
      const args = {
        username : state.form.loginId,
        password : state.form.loginPw
      };
      
      axios.post("/api/Login", args).then((res)=>{
        state.account = res.data;
      });
    };
    
    const logout = () =>{
      axios.get("/api/Login/logout").then();
    };

    axios.get("/api/Login/detail").then((res)=>{
      state.account = res.data;
    });

    return {state, submit, logout};
  },
};
</script>
