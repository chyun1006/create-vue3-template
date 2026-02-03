import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    // 侧边栏是否收起
    sidebarCollapsed: false,
    // 设备类型
    device: 'desktop'
  }),
  
  getters: {
    isMobile: (state) => state.device === 'mobile'
  },
  
  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    
    setSidebarCollapsed(collapsed) {
      this.sidebarCollapsed = collapsed
    },
    
    setDevice(device) {
      this.device = device
    }
  }
})
