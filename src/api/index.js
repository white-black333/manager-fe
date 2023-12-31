/* api管理 */

import request from "../utils/request";

// 登录方法  传参，路由跳转
export default {
    login(params) {
        // request.post('/users/login', params, { mock: false });
        return request({
            method: 'post',
            url: '/users/login',
            data: params,
            // mock: false// 局部mock设置
        });
    },
    noticeCount() {
        return request({
            method: 'get',
            url: '/leave/count',
            data: {},
        });
    },
    getUserList(params) {
        return request({
            method: 'get',
            url: '/users/list',
            data: params,
        });
    },
    getPermissionList() {
        return request({
            method: 'get',
            url: '/users/getPermissionList',
            data: {},
        });
    },
    getUserAllList(params) {
        return request({
            method: 'get',
            url: '/users/all/list',
            data: params,
        });
    },
    userDel(params) {
        return request({
            method: 'post',
            url: '/users/delete',
            data: params,
        });
    },
    submitUser(params) {
        return request({
            method: 'post',
            url: '/users/operate',
            data: params,
        });
    },
    getMenuList(params) {
        return request({
            method: 'post',
            url: '/menu/list',
            data: params,
        });
    },
    submitMenu(params) {
        return request({
            method: 'post',
            url: '/menu/operate',
            data: params,
        });
    },
    getRoleAllList(params) {
        return request({
            method: 'get',
            url: '/roles/allList',
            data: params,
        });
    },
    getRoleList(params) {
        return request({
            method: 'get',
            url: '/roles/list',
            data: params,
        });
    },
    submitRole(params) {
        return request({
            method: 'post',
            url: '/roles/operate',
            data: params,
        });
    },
    updatePermission(params) {
        return request({
            method: 'post',
            url: '/roles/update/permission',
            data: params,
        });
    },
    getDeptList(params) {
        return request({
            method: 'get',
            url: '/dept/list',
            data: params,
        });
    },
    submitDept(params) {
        return request({
            method: 'post',
            url: '/dept/operate',
            data: params,
        });
    },
    getApplyList(params) {
        return request({
            method: 'get',
            url: '/leave/list',
            data: params,
        });
    },
    submitApply(params) {
        return request({
            method: 'post',
            url: '/leave/operate',
            data: params,
        });
    },
    submitApprove(params) {
        return request({
            method: 'post',
            url: '/leave/approve',
            data: params,
        });
    },
};