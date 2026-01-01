import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null
  }),
  actions: {
    setToken(token) {
      this.accessToken = token
    },
    clear() {
      this.accessToken = null
    }
  }
})
