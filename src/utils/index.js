/**
 * 通用工具函数库
 * 包含导入、导出等常用功能
 */

// ============================================
// 1. 导出功能
// ============================================

/**
 * 导出为 JSON 文件
 * @param {Object|Array} data - 要导出的数据
 * @param {string} filename - 文件名（不含扩展名）
 */
export function exportToJSON(data, filename = 'export') {
    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' })
    downloadBlob(blob, `${filename}.json`)
}

/**
 * 导出为 CSV 文件
 * @param {Array} data - 要导出的数组数据
 * @param {string} filename - 文件名（不含扩展名）
 * @param {Object} options - 配置选项
 * @param {string} options.separator - 分隔符，默认逗号
 * @param {Array} options.headers - 自定义表头
 * @param {Array} options.keys - 要导出的字段
 */
export function exportToCSV(data, filename = 'export', options = {}) {
    const { separator = ',', headers, keys } = options

    if (!Array.isArray(data) || data.length === 0) {
        console.warn('导出数据为空或格式不正确')
        return
    }

    // 获取所有字段
    const fieldKeys = keys || Object.keys(data[0])
    const headerRow = headers || fieldKeys

    // 构建 CSV 内容
    const csvRows = []

    // 添加表头
    csvRows.push(headerRow.map(h => escapeCSVField(h, separator)).join(separator))

    // 添加数据行
    for (const row of data) {
        const values = fieldKeys.map(key => {
            const value = row[key]
            return escapeCSVField(value, separator)
        })
        csvRows.push(values.join(separator))
    }

    // 添加 BOM 以支持中文
    const BOM = '\uFEFF'
    const csvContent = BOM + csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    downloadBlob(blob, `${filename}.csv`)
}

/**
 * 导出为 Excel 文件 (xlsx)
 * 依赖 xlsx 库：npm install xlsx
 * @param {Array} data - 要导出的数组数据
 * @param {string} filename - 文件名（不含扩展名）
 * @param {Object} options - 配置选项
 * @param {string} options.sheetName - 工作表名称
 * @param {Array} options.headers - 自定义表头
 * @param {Array} options.keys - 要导出的字段
 */
export async function exportToExcel(data, filename = 'export', options = {}) {
    const { sheetName = 'Sheet1', headers, keys } = options

    try {
        const XLSX = await import('xlsx')

        if (!Array.isArray(data) || data.length === 0) {
            console.warn('导出数据为空或格式不正确')
            return
        }

        // 处理数据
        const fieldKeys = keys || Object.keys(data[0])
        const headerRow = headers || fieldKeys

        // 构建工作表数据
        const wsData = [headerRow]
        for (const row of data) {
            wsData.push(fieldKeys.map(key => row[key] ?? ''))
        }

        // 创建工作簿和工作表
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(wsData)
        XLSX.utils.book_append_sheet(wb, ws, sheetName)

        // 导出文件
        XLSX.writeFile(wb, `${filename}.xlsx`)
    } catch (error) {
        console.error('导出 Excel 失败，请确保已安装 xlsx 库:', error)
        throw error
    }
}

/**
 * 导出为 TXT 文件
 * @param {string|Array} data - 要导出的数据
 * @param {string} filename - 文件名（不含扩展名）
 * @param {string} separator - 数组元素分隔符
 */
export function exportToTXT(data, filename = 'export', separator = '\n') {
    const content = Array.isArray(data) ? data.join(separator) : String(data)
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    downloadBlob(blob, `${filename}.txt`)
}

/**
 * 导出为 XML 文件
 * @param {Object|Array} data - 要导出的数据
 * @param {string} filename - 文件名（不含扩展名）
 * @param {string} rootName - 根节点名称
 */
export function exportToXML(data, filename = 'export', rootName = 'root') {
    const xmlContent = jsonToXML(data, rootName)
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' })
    downloadBlob(blob, `${filename}.xml`)
}

// ============================================
// 2. 导入功能
// ============================================

/**
 * 从 JSON 文件导入数据
 * @param {File} file - 文件对象
 * @returns {Promise<Object|Array>}
 */
export function importFromJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result)
                resolve(data)
            } catch (error) {
                reject(new Error('JSON 解析失败: ' + error.message))
            }
        }
        reader.onerror = () => reject(new Error('文件读取失败'))
        reader.readAsText(file, 'utf-8')
    })
}

/**
 * 从 CSV 文件导入数据
 * @param {File} file - 文件对象
 * @param {Object} options - 配置选项
 * @param {string} options.separator - 分隔符，默认逗号
 * @param {boolean} options.hasHeader - 是否有表头，默认 true
 * @returns {Promise<Array>}
 */
export function importFromCSV(file, options = {}) {
    const { separator = ',', hasHeader = true } = options

    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const content = e.target.result
                const lines = content.split(/\r?\n/).filter(line => line.trim())

                if (lines.length === 0) {
                    resolve([])
                    return
                }

                const parseRow = (row) => {
                    const result = []
                    let current = ''
                    let inQuotes = false

                    for (let i = 0; i < row.length; i++) {
                        const char = row[i]

                        if (char === '"') {
                            if (inQuotes && row[i + 1] === '"') {
                                current += '"'
                                i++
                            } else {
                                inQuotes = !inQuotes
                            }
                        } else if (char === separator && !inQuotes) {
                            result.push(current.trim())
                            current = ''
                        } else {
                            current += char
                        }
                    }
                    result.push(current.trim())
                    return result
                }

                if (hasHeader) {
                    const headers = parseRow(lines[0])
                    const data = lines.slice(1).map(line => {
                        const values = parseRow(line)
                        const obj = {}
                        headers.forEach((header, index) => {
                            obj[header] = values[index] ?? ''
                        })
                        return obj
                    })
                    resolve(data)
                } else {
                    resolve(lines.map(line => parseRow(line)))
                }
            } catch (error) {
                reject(new Error('CSV 解析失败: ' + error.message))
            }
        }
        reader.onerror = () => reject(new Error('文件读取失败'))
        reader.readAsText(file, 'utf-8')
    })
}

/**
 * 从 Excel 文件导入数据
 * 依赖 xlsx 库：npm install xlsx
 * @param {File} file - 文件对象
 * @param {Object} options - 配置选项
 * @param {number} options.sheetIndex - 工作表索引，默认 0
 * @param {boolean} options.hasHeader - 是否有表头，默认 true
 * @returns {Promise<Array>}
 */
export async function importFromExcel(file, options = {}) {
    const { sheetIndex = 0, hasHeader = true } = options

    try {
        const XLSX = await import('xlsx')

        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const workbook = XLSX.read(e.target.result, { type: 'array' })
                    const sheetName = workbook.SheetNames[sheetIndex]
                    const worksheet = workbook.Sheets[sheetName]

                    const data = XLSX.utils.sheet_to_json(worksheet, {
                        header: hasHeader ? undefined : 1,
                        defval: ''
                    })
                    resolve(data)
                } catch (error) {
                    reject(new Error('Excel 解析失败: ' + error.message))
                }
            }
            reader.onerror = () => reject(new Error('文件读取失败'))
            reader.readAsArrayBuffer(file)
        })
    } catch (error) {
        console.error('导入 Excel 失败，请确保已安装 xlsx 库:', error)
        throw error
    }
}

/**
 * 从 TXT 文件导入数据
 * @param {File} file - 文件对象
 * @param {Object} options - 配置选项
 * @param {string} options.lineSeparator - 行分隔符
 * @param {boolean} options.asArray - 是否返回数组
 * @returns {Promise<string|Array>}
 */
export function importFromTXT(file, options = {}) {
    const { lineSeparator = '\n', asArray = false } = options

    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const content = e.target.result
            if (asArray) {
                resolve(content.split(lineSeparator).map(line => line.trim()).filter(Boolean))
            } else {
                resolve(content)
            }
        }
        reader.onerror = () => reject(new Error('文件读取失败'))
        reader.readAsText(file, 'utf-8')
    })
}

/**
 * 通用文件选择器
 * @param {Object} options - 配置选项
 * @param {string} options.accept - 接受的文件类型
 * @param {boolean} options.multiple - 是否多选
 * @returns {Promise<File|FileList>}
 */
export function selectFile(options = {}) {
    const { accept = '*', multiple = false } = options

    return new Promise((resolve) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = accept
        input.multiple = multiple

        input.onchange = (e) => {
            const files = e.target.files
            resolve(multiple ? files : files[0])
        }

        input.click()
    })
}

// ============================================
// 3. 辅助函数
// ============================================

/**
 * 下载 Blob 文件
 * @param {Blob} blob - Blob 对象
 * @param {string} filename - 文件名
 */
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

/**
 * 转义 CSV 字段
 * @param {any} value - 字段值
 * @param {string} separator - 分隔符
 * @returns {string}
 */
function escapeCSVField(value, separator) {
    if (value === null || value === undefined) {
        return ''
    }
    const str = String(value)
    // 如果包含分隔符、换行符或双引号，需要用双引号包裹
    if (str.includes(separator) || str.includes('\n') || str.includes('"')) {
        return '"' + str.replace(/"/g, '""') + '"'
    }
    return str
}

/**
 * JSON 转 XML
 * @param {Object|Array} data - 数据
 * @param {string} rootName - 根节点名称
 * @returns {string}
 */
function jsonToXML(data, rootName = 'root') {
    const convert = (obj, nodeName) => {
        if (obj === null || obj === undefined) {
            return `<${nodeName}/>`
        }

        if (Array.isArray(obj)) {
            return obj.map((item, index) => convert(item, 'item')).join('\n')
        }

        if (typeof obj === 'object') {
            const children = Object.entries(obj)
                .map(([key, value]) => convert(value, key))
                .join('\n')
            return `<${nodeName}>\n${children}\n</${nodeName}>`
        }

        // 转义特殊字符
        const escaped = String(obj)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')

        return `<${nodeName}>${escaped}</${nodeName}>`
    }

    return '<?xml version="1.0" encoding="UTF-8"?>\n' + convert(data, rootName)
}

// ============================================
// 4. 其他常用工具函数
// ============================================

/**
 * 防抖函数
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
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
 * @param {Function} fn - 要节流的函数
 * @param {number} interval - 间隔时间（毫秒）
 * @returns {Function}
 */
export function throttle(fn, interval = 300) {
    let lastTime = 0
    return function (...args) {
        const now = Date.now()
        if (now - lastTime >= interval) {
            lastTime = now
            fn.apply(this, args)
        }
    }
}

/**
 * 深拷贝
 * @param {any} obj - 要拷贝的对象
 * @returns {any}
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime())
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj)
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item))
    }

    const cloned = {}
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key])
        }
    }
    return cloned
}

/**
 * 格式化日期
 * @param {Date|string|number} date - 日期
 * @param {string} format - 格式化模板
 * @returns {string}
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = date instanceof Date ? date : new Date(date)

    if (isNaN(d.getTime())) {
        return ''
    }

    const pad = (n) => String(n).padStart(2, '0')

    const tokens = {
        YYYY: d.getFullYear(),
        MM: pad(d.getMonth() + 1),
        DD: pad(d.getDate()),
        HH: pad(d.getHours()),
        mm: pad(d.getMinutes()),
        ss: pad(d.getSeconds()),
    }

    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => tokens[match])
}

/**
 * 生成唯一 ID
 * @param {number} length - ID 长度
 * @returns {string}
 */
export function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @param {number} decimals - 小数位数
 * @returns {string}
 */
export function formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

/**
 * 判断数据类型
 * @param {any} value - 值
 * @returns {string}
 */
export function getType(value) {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

/**
 * 判断是否为空
 * @param {any} value - 值
 * @returns {boolean}
 */
export function isEmpty(value) {
    if (value === null || value === undefined) return true
    if (typeof value === 'string') return value.trim() === ''
    if (Array.isArray(value)) return value.length === 0
    if (typeof value === 'object') return Object.keys(value).length === 0
    return false
}