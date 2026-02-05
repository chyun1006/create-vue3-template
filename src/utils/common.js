import dayjs from 'dayjs'

/**
 * 格式化日期
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!date) return ''
    return dayjs(date).format(format)
}

/**
 * 防抖函数
 */
export const debounce = (fn, delay = 300) => {
    let timer = null
    return function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

/**
 * 节流函数
 */
export const throttle = (fn, delay = 300) => {
    let last = 0
    return function (...args) {
        const now = Date.now()
        if (now - last > delay) {
            last = now
            fn.apply(this, args)
        }
    }
}

/**
 * 获取 URL 参数
 */
export const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
}

/**
 * 深拷贝 (简单版)
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj
    try {
        return JSON.parse(JSON.stringify(obj))
    } catch (e) {
        console.error('deepClone error:', e)
        return obj
    }
}

/**
 * 判空函数
 */
export const isEmpty = (val) => {
    if (val === null || val === undefined) return true
    if (typeof val === 'string' && val.trim() === '') return true
    if (Array.isArray(val) && val.length === 0) return true
    if (Object.prototype.toString.call(val) === '[object Object]' && Object.keys(val).length === 0) return true
    return false
}
