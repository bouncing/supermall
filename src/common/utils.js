// 公共方法工具

/**
 * 防抖函数
 * @param {*} func
 * @param {*} delay
 */
export function debounce (func, delay) {
  let timer = null
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
