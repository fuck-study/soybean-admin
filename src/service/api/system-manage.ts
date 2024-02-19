import { request } from '../request';

/** get role list */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/systemManage/getRoleList',
    method: 'get',
    params
  });
}

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllRoles() {
  return request<Api.SystemManage.AllRole[]>({
    url: '/systemManage/getAllRoles',
    method: 'get'
  });
}

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/api/getUserList',
    method: 'get',
    params
  });
}

/** get log list */
export function fetchLogList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/api/logs',
    method: 'get',
    params
  });
}

export function fetchPlat() {
  return request<Api.SystemManage.User>({
    url: '/api/plat',
    method: 'get',
  });
}

/** get log list */
export function fetchCreateUser(data?: Api.SystemManage.User) {
  return request<Api.SystemManage.User>({
    url: '/api/user',
    method: 'post',
    data
  });
}

export async function getCourse(data:any, plat:number) {
  return request({
    url: `/api/query/${plat}`,
    method: 'post',
    data,
  });
}

export async function submitCourse(data:any, plat:number) {
  return request({
    url: `/api/submit/${plat}`,
    method: 'post',
    data,
  });
}



export function fetchPostOrder(data?: Api.SystemManage.Order) {
  return request<Api.SystemManage.Order>({
    url: `/api/queryOrders`,
    method: 'post', // 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options
    data,
  });
}


export function fetchGetOrder(params?: Api.SystemManage.Order) {
  return request<Api.SystemManage.Order>({
    url: `/api/getOrderList`,
    params,
  });
}



export function editOrder(data:any) {
  return request({
    url: `/api/refreshOrders`,
    method: 'put',
    data,
  });
}

export function delOrder(data:any) {
  return request({
    url: `/api/deleteOrders`,
    method: 'delete',
    data,
  });
}


export function updateUser(id:number,data?: Api.SystemManage.User) {
  return request<Api.SystemManage.User>({
    url: `/api/user/${id}`,
    method: 'put',
    data
  });
}

/** delete user info */
export function fetchDeleteUser(id: number) {
  return request({ url: `/api/user/${id}`,method:'delete' });
}

export async function fetchUserInfo() {
  return request({ url: `/api/info`,method:'get' });
}


export async function getUserData() {
    return request({ url: `/api/dashboard`,method:'get' });
}
/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.Menu[]>({
    url: '/systemManage/getMenuList',
    method: 'get'
  });
}
