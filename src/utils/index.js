import { Toast } from 'vant'
// 删除属性为空的值
export function removeProperty(object) {
  for (const prop in object) {
    // if (object[prop] === 0) break
    if ((!object[prop] || object[prop].length === 0) && object[prop] !== 0) {
      delete object[prop]
    }
    if (typeof (object[prop]) === 'object') this.removeProperty(object[prop])
  }
  return object
}
// 深度拷贝
export function deepClone(obj) {
  const _toString = Object.prototype.toString

  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true)
  }

  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime())
  }

  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    const flags = []
    if (obj.global) { flags.push('g') }
    if (obj.multiline) { flags.push('m') }
    if (obj.ignoreCase) { flags.push('i') }

    return new RegExp(obj.source, flags.join(''))
  }

  const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}

  for (const key in obj) {
    result[key] = this.deepClone(obj[key])
  }

  return result
}

// 数组的交叉合并
export function aryJoinAry(ary, ary2) {
  var itemAry = []
  var minLength
  // 先拿到两个数组中长度较短的那个数组的长度
  if (ary.length > ary2.length) {
    minLength = ary2.length
  } else {
    minLength = ary.length
  }
  // 将两个数组中较长的数组记录下来
  var longAry = arguments[0].length > arguments[1].length ? arguments[0] : arguments[1]
  // 循环范围为较短的那个数组的长度
  for (var i = 0; i < minLength; i++) {
    // 将数组放入临时数组中
    itemAry.push(ary[i])
    itemAry.push(ary2[i])
  }
  // itemAry和多余的新数组拼接起来并返回。
  return itemAry.concat(longAry.slice(minLength))
}

// 倒计时
export function countDown(data, timer, type) {
  let hour, minute, day, second
  var now_time = Date.parse(new Date()) / 1000
  var differ_time
  differ_time = data - now_time

  // console.log(differ_time, 'differ_time')
  if (type === 1) {
    if (differ_time >= 0) {
      // that.day = Math.floor(differ_time / 1000 / 60 / 60 / 24);
      day = Math.floor(differ_time / 60 / 60 / 24)
      hour = Math.floor(differ_time / 60 / 60 - day * 24)
      minute = Math.floor(
        differ_time / 60 - hour * 60 - day * 24 * 60
      )
      second = Math.floor(
        differ_time -
        hour * 60 * 60 -
        minute * 60 -
        day * 24 * 60 * 60
      )
      // 三元运算
      // let timeStr = {
      day < 10 ? (day = '0' + day) : day
      hour < 10 ? (hour = '0' + hour) : hour
      minute < 10 ? (minute = '0' + minute) : minute
      second < 10 ? (second = '0' + second) : second
      // }
      const timeStr = {
        day: day,
        hour: hour,
        minute: minute,
        second: second
      }
      return timeStr
      // return day, hour, minute, second
    } else {
      clearInterval(timer)
    }
  }
  if (type === 2 || type === 3) {
    if (differ_time >= 0) {
      // that.day = Math.floor(differ_time / 1000 / 60 / 60 / 24);
      hour = Math.floor(differ_time / 60 / 60)
      minute = Math.floor(
        differ_time / 60 - hour * 60
      )
      second = Math.floor(
        differ_time -
        hour * 60 * 60 -
        minute * 60
      )
      // 三元运算
      // let timeStr = {
      hour < 10 ? (hour = '0' + hour) : hour
      minute < 10 ? (minute = '0' + minute) : minute
      second < 10 ? (second = '0' + second) : second
      // }
      const timeStr = {
        hour: hour,
        minute: minute,
        second: second
      }
      // console.log(timeStr, '$$$$$$')
      return timeStr
      // return day, hour, minute, second
    } else {
      Toast.fail('活动已经过期！')
      clearInterval(timer)
    }
  }
}
