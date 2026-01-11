import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null,
    loginForm: null
  }),
  actions: {
    setToken(token) {
      this.accessToken = token
    },
    setLoginForm(form) {
      this.loginForm = form
    },
    clearLoginForm() {
      this.loginForm = null
    },
    clear() {
      this.accessToken = null
      this.loginForm = null
    }
  }
})
