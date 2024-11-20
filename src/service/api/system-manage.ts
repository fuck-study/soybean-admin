import {request} from '../request';

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

export function fetchFreeList() {
    return request<Api.SystemManage.User>({
        url: '/api/freeList',
        method: 'get',
    });
}
export function fetchFreePlat() {
    return request<Api.SystemManage.User>({
        url: '/api/free',
        method: 'get',
    });
}


export function fetchNoticeList() {
  return request<Api.SystemManage.User>({
    url: '/api/notice',
    method: 'get',
  });
}

export function fetchAddNotice(data:any) {
  return request<Api.SystemManage.User>({
    url: '/api/notice',
    method: 'post',
    data
  });
}

/** get report list */
export function fetchReportList(params?: Api.SystemManage.UserSearchParams) {
  return request({
    url: '/api/report',
    method: 'get',
    params
  });
}

export function fetchBuDan(data: any) {
  return request({
    url: '/api/budan',
    method: 'post',
    data
  });
}


export function fetchNoAnswerList(params?: Api.SystemManage.UserSearchParams) {
  return request({
    url: '/api/no',
    method: 'get',
    params
  });
}
export function fetchFilesList(params?: Api.SystemManage.UserSearchParams) {
  return request({
    url: '/api/file/list',
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
        timeout: 60 * 1000,
        url: '/api/user',
        method: 'post',
        data
    });
}


export function updateIntegral(id: number, money:number,data?: Api.SystemManage.User) {
    return request<Api.SystemManage.User>({
        url: `/api/user/${id}/money/${money}`,
        method: 'put',
        data
    });
}


export async function getCourse(data: any, plat: number) {
    return request({
        timeout: 60 * 1000,
        url: `/api/query/${plat}`,
        method: 'post',
        data,
    });
}

export async function submitCourse(data: any, plat: number) {
    return request({
        url: `/api/submit/${plat}`,
        method: 'post',
        data,
    });
}


export function fetchPostOrder(data?: Api.SystemManage.Order) {
    return request<Api.SystemManage.Order>({
        url: `/api/queryOrders`,
        method: 'post',
        data,
    });
}

export function fetchPostExportOrder(data?: Api.SystemManage.Order) {
  return request<Api.SystemManage.Order>({
    url: `/api/exportOrders`,
    method: 'post',
    data,
    responseType:'blob',
    timeout: 60 * 1000
  });
}


export function fetchGetOrder(params?: Api.SystemManage.Order) {
    return request<Api.SystemManage.Order>({
        url: `/api/getOrderList`,
        params,
    });
}


export function reportQuestion(data: any) {
    return request({
        url: `/api/report`,
        method: 'post',
        data,
    });
}

export function putReport(data: any) {
  return request({
    url: `/api/report/${data.id}`,
    method: 'put',
    data,
  });
}

export function avtTime() {
  return request({
    url: `/api/avgTime`,
    method: 'get',
  });
}

export function fetchDeleteReport(id) {
  return request({
    url: `/api/report/${id}`,
    method: 'delete',
  });
}

export function fetchDeleteFile(id) {
  return request({
    url: `/api/file/${id}`,
    method: 'delete',
  });
}

export function fetchCreateFile(data) {
  return request({
    url: `/api/file/create`,
    method: 'post',
    data
  });
}

export function resetOrder(uuid:string,data: any) {
  return request({
    url: `/api/editOrder/${uuid}`,
    method: 'post',
    data,
  });
}

export function fetchBatchEditOrders(data: any) {
  return request({
    url: `/api/editOrders`,
    method: 'post',
    data,
  });
}

export function editOrder(data: any) {
    return request({
        url: `/api/refreshOrders`,
        method: 'put',
        data,
    });
}

export function delOrder(data: any) {
    return request({
        url: `/api/deleteOrders`,
        method: 'delete',
        data,
    });
}


export function updateUser(id: number, data?: Api.SystemManage.User) {
    return request<Api.SystemManage.User>({
        url: `/api/user/${id}`,
        method: 'put',
        data
    });
}

/** delete user info */
export function fetchDeleteUser(id: number) {
    return request({url: `/api/user/${id}`, method: 'delete'});
}

export async function fetchUserInfo() {
    return request({url: `/api/info`, method: 'get'});
}


export async function fetchUserDev() {
    return request({url: `/api/dev`, method: 'get'});
}


export async function getUserData() {
    return request({url: `/api/dashboard`, method: 'get'});
}

/** get menu list */
export function fetchGetMenuList() {
    return request<Api.SystemManage.Menu[]>({
        url: '/systemManage/getMenuList',
        method: 'get'
    });
}


export async function getTemplet() {
    return request({url: `/api/template`, method: 'get'});
}

export async function addTemplet(data: any) {
    return request({url: `/api/template`, method: 'post', data});
}

export async function updateTemplet(data: any,id:number) {
  return request({url: `/api/template/${id}`, method: 'put', data});
}


export async function delTemplet(id:number) {
  return request({url: `/api/template/${id}`, method: 'delete', });
}
