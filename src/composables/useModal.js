import { h, ref, provide, inject, onBeforeUnmount, createApp, getCurrentInstance, withDirectives, resolveDirective } from 'vue'
import { ElDialog, ElButton, ElConfigProvider, ElIcon, ElLoading } from 'element-plus'
import { Check } from 'lucide-vue-next'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const MODAL_STYLES = `
    .el-dialog__header {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
        margin-right: 0 !important;
        padding: 14px 50px 14px 20px !important;
        border-bottom: 1px solid rgba(0,0,0,0.03);
        border-radius: 12px 12px 0 0;
    }
    .el-dialog__footer {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
        border-top: 1px solid rgba(0,0,0,0.03);
        padding: 14px 20px !important;
        border-radius: 0 0 12px 12px;
    }
    .el-dialog__title {
        font-weight: 900 !important;
        color: #1e293b !important;
        font-size: 18px !important;
    }

    .el-dialog__header.show-close .el-dialog__headerbtn {
        top: 5px !important;
        right: 0px !important;
        z-index: 101;
    }

    /* 针对“无标题”场景进行物理占位抹平 */
    .modal-style-no-header .el-dialog__header { 
        position: absolute; 
        top: 0; 
        right: 0; 
        padding: 0 !important; 
        margin: 0 !important; 
        width: 100%;
        height: 0;
        z-index: 10;
        background: transparent !important;
        border: none !important;
    }
    /* 增强权重，确保在无标题模式下关闭按钮位置正确 */
    .modal-style-no-header .el-dialog__headerbtn {
        top: 14px !important;
        right: 14px !important;
        z-index: 101;
    }
    .modal-style-no-header .el-dialog__title {
        display: none !important;
    }
    .modal-style-no-header .el-dialog__body {
        padding-top: 0 !important;
    }

    /* 通用的 Footer 隐藏逻辑 */
    .modal-style-no-footer .el-dialog__footer { 
        display: none !important; 
    }
`

const MODAL_CONTEXT = Symbol('modalContext')

// 默认配置
const DEFAULT_OPTIONS = {
    width: '50%',
    closeOnClickModal: true,
    closeOnPressEscape: true,
    showClose: true,
    destroyOnClose: true
}

/**
 * useModal - 命令式弹窗管理
 *
 * @example
 * const modal = useModal()
 *
 * modal.open(UserForm, {
 *   params: { userId: 123 },
 *   title: '编辑用户',
 *   width: '600px',
 *   onOk: (data) => { console.log(data) },
 *   onClose: () => { console.log('关闭') }
 * })
 */
export const useModal = function () {
    const instance = getCurrentInstance()
    const appContext = instance?.appContext

    let childApp = null
    let el = null

    // 响应式状态
    const visible = ref(true)
    const confirmLoading = ref(false)
    const contentLoading = ref(false)

    // 回调处理器
    let confirmHandler = null
    let closeHandler = null
    let callbacks = {}

    /**
     * 关闭弹窗
     */
    const close = () => {
        visible.value = false
        // 等待动画完成后再销毁
        setTimeout(() => {
            if (childApp) {
                childApp.unmount()
                childApp = null
            }
            if (el) {
                el.remove()
                el = null
            }
        }, 300)
    }

    /**
     * Dialog 关闭事件处理
     */
    const onDialogClose = () => {
        if (closeHandler) {
            closeHandler()
        } else {
            callbacks.onClose?.()
            close()
        }
    }

    /**
     * Dialog 确认事件处理
     */
    const onDialogConfirm = () => {
        if (confirmHandler) {
            confirmHandler()
        } else {
            callbacks.onOk?.()
            close()
        }
    }

    /**
     * 创建 modalContext 上下文
     */
    const createModalContext = () => ({
        // 注册确认按钮回调
        onConfirm: (handler) => {
            confirmHandler = handler
        },
        // 注册关闭按钮回调
        onClose: (handler) => {
            closeHandler = handler
        },
        // 确认并关闭,触发 onOk 回调
        handleOk: (data) => {
            callbacks.onOk?.(data)
            close()
        },
        // 取消并关闭,触发 onClose 回调
        handleClose: () => {
            callbacks.onClose?.()
            close()
        },
        // 控制确认按钮 loading
        toggleConfirmLoading: (flag) => {
            confirmLoading.value = flag
        },
        // 控制内容区 loading
        toggleLoading: (flag) => {
            contentLoading.value = flag
        }
    })

    /**
     * 打开弹窗
     * @param {Component} component - 业务组件
     * @param {Object} options - 配置选项
     * @param {Object} options.params - 传递给业务组件的 props
     * @param {String} options.title - Dialog 标题
     * @param {String} options.width - Dialog 宽度
     * @param {Function} options.onOk - 确认回调
     * @param {Function} options.onClose - 关闭回调
     * @param {Object} ...dialogOptions - 其他 Element Plus Dialog 配置
     */
    const open = (component, options = {}) => {
        const { params = {}, onOk, onClose, ...dialogOptions } = options

        // 保存回调函数
        callbacks = { onOk, onClose }

        // 重置状态
        visible.value = true
        confirmLoading.value = false
        contentLoading.value = false
        confirmHandler = null
        closeHandler = null

        // 合并配置
        const finalDialogOptions = {
            ...DEFAULT_OPTIONS,
            ...dialogOptions
        }

        // 创建 DOM 元素
        el = document.createElement('div')
        document.body.appendChild(el)

        // 创建独立应用实例
        childApp = createApp({
            setup() {
                const modalContext = createModalContext()
                provide(MODAL_CONTEXT, modalContext)

                return {
                    visible,
                    confirmLoading,
                    contentLoading,
                    finalDialogOptions,
                    component,
                    params,
                    onDialogClose,
                    onDialogConfirm,
                    ElButton
                }
            },
            render() {
                const { title, showClose, footer } = this.finalDialogOptions
                const isHeaderless = !title && showClose === false
                
                // 动态构建插槽对象
                const slots = {
                    default: () => {
                        const loadingDirective = resolveDirective('loading')
                        const contentNode = h(
                            'div',
                            {
                                style: 'min-height: 100px'
                            },
                            [h(this.component, { ...this.params })]
                        )
                        return withDirectives(contentNode, [[loadingDirective, this.contentLoading]])
                    }
                }

                if (footer !== false) {
                    slots.footer = () =>
                        h('span', { class: 'dialog-footer' }, [
                            h(this.ElButton, { link: true, onClick: this.onDialogClose }, { default: () => '取消' }),
                            h(
                                this.ElButton,
                                { type: 'primary', loading: this.confirmLoading, onClick: this.onDialogConfirm },
                                {
                                    default: () => [
                                        h(ElIcon, { style: { marginRight: '6px' } }, { default: () => h(Check) }),
                                        ' 确定'
                                    ]
                                }
                            )
                        ])
                }

                const isNoHeader = !title

                // 强制样式注入：使用 innerHTML 确保 CSS 不被转义
                const styleHelper = h('style', { innerHTML: MODAL_STYLES })

                const dialogClasses = [
                    this.finalDialogOptions.class,
                    isNoHeader ? 'modal-style-no-header' : '',
                    footer === false ? 'modal-style-no-footer' : ''
                ]
                    .filter(Boolean)
                    .join(' ')

                return h(
                    ElConfigProvider,
                    { locale: zhCn },
                    {
                        default: () => [
                            styleHelper,
                            h(
                                ElDialog,
                                {
                                    ...this.finalDialogOptions,
                                    class: dialogClasses,
                                    modelValue: this.visible,
                                    'onUpdate:modelValue': (val) => {
                                        this.visible = val
                                        if (!val) this.onDialogClose()
                                    }
                                },
                                slots
                            )
                        ]
                    }
                )
            }
        })

        // 继承父应用上下文
        if (appContext) {
            Object.assign(childApp._context, appContext)
        }

        // 挂载应用
        childApp.mount(el)
    }

    // 组件卸载时清理
    onBeforeUnmount(() => {
        close()
        confirmHandler = null
        closeHandler = null
        callbacks = {}
    })

    return {
        open,
        close
    }
}

/**
 * useModalContext - 获取弹窗上下文
 *
 * 业务组件内使用此函数获取控制方法
 *
 * @example
 * const { onConfirm, handleOk, toggleLoading } = useModalContext() || {}
 *
 * onConfirm?.(() => {
 *   toggleLoading?.(true)
 *   api.save().then(() => {
 *     handleOk?.({ success: true })
 *   })
 * })
 */
export const useModalContext = () => {
    return inject(MODAL_CONTEXT, null)
}
