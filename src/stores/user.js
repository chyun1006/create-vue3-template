import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: null,
    menus: []
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },

    setToken(token) {
      this.token = token
    },

    clearUser() {
      this.userInfo = null
      this.token = null
    },

    setMenus(menus) {
      this.menus = menus
    },

  }
})
