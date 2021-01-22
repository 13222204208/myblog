import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/info',
    method: 'get',
   // params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function userList(query) {
  return request({
    url: '/user',
    method: 'get',
    params: query
  })
}

export function delUser(id) {
  return request({
    url: '/user/'+id,
    method: 'delete',
  })
}

export function updateUser(id,data) {
  return request({
    url: '/user/'+id,
    method: 'patch',
    data
  })
}
