/**
 * 主题配置
 */
export const themes = {
  green: {
    name: 'Green',
    label: '绿色主题',
    file: 'green.css'
  },
  blue: {
    name: 'Blue',
    label: '蓝色主题',
    file: 'blue.css'
  },
  orange: {
    name: 'Orange',
    label: '橙色主题',
    file: 'orange.css'
  },
  teal: {
    name: 'Teal',
    label: '青色主题',
    file: 'teal.css'
  }
}

/**
 * 默认主题
 */
export const DEFAULT_THEME = 'green'

/**
 * 主题管理类
 */
export class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || DEFAULT_THEME
    this.linkElement = null
  }

  /**
   * 获取存储的主题
   */
  getStoredTheme() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app-theme')
    }
    return null
  }

  /**
   * 存储主题
   */
  setStoredTheme(theme) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-theme', theme)
    }
  }

  /**
   * 加载主题
   */
  loadTheme(themeName) {
    if (!themes[themeName]) {
      console.warn(`主题 ${themeName} 不存在,使用默认主题`)
      themeName = DEFAULT_THEME
    }

    // 移除旧的主题样式
    if (this.linkElement) {
      this.linkElement.remove()
    }

    // 创建新的样式链接
    this.linkElement = document.createElement('link')
    this.linkElement.rel = 'stylesheet'
    this.linkElement.href = `/src/assets/styles/themes/${themes[themeName].file}`
    this.linkElement.id = 'theme-stylesheet'
    document.head.appendChild(this.linkElement)

    this.currentTheme = themeName
    this.setStoredTheme(themeName)
  }

  /**
   * 切换主题
   */
  switchTheme(themeName) {
    this.loadTheme(themeName)
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme() {
    return this.currentTheme
  }

  /**
   * 获取所有主题
   */
  getAllThemes() {
    return themes
  }

  /**
   * 初始化主题
   */
  init() {
    this.loadTheme(this.currentTheme)
  }
}

// 创建单例实例
export const themeManager = new ThemeManager()
