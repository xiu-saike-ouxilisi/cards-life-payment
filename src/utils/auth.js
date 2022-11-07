import Cookies from 'js-cookie'

const TokenKey = 'mstkToken'
const actTypeKey = 'actType'
const actIdKey = 'actId'

// token
export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 活动类型
export function getActType() {
  return Cookies.get(actTypeKey)
}
export function setActType(token) {
  return Cookies.set(actTypeKey, token)
}

// 活动ID
export function getActId() {
  return Cookies.get(actIdKey)
}
export function setActId(token) {
  return Cookies.set(actIdKey, token)
}

