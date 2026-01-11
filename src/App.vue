<template>
  <div class = "app">
    <NavigationBar />
    <router-view />
  </div>
</template>

<script>

import { onMounted  } from "vue";
import NavigationBar from './components/NavigationBar.vue'

export default {
  components: { NavigationBar },
  setup(){
    return { onMounted }
  }
};
</script>
