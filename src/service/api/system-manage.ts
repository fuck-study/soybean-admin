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



/** get log list */
export function fetchCreateUser(data?: Api.SystemManage.User) {
  return request<Api.SystemManage.User>({
    url: '/api/user',
    method: 'post',
    data
  });
}


/** delete user info */
export function fetchDeleteUser(id: number) {
  return request({ url: `/api/user/${id}`,method:'delete' });
}

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.Menu[]>({
    url: '/systemManage/getMenuList',
    method: 'get'
  });
}
