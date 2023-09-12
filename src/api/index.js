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
            mock: true
        });
    },
    getmenuList() {
        return request({
            method: 'post',
            url: '/menu/list',
            data: {
                // menuName: "系统管理",
                // menuState: 1
            },
            mock: true
        });
    },
    getUserList(params) {
        return request({
            method: 'get',
            url: '/users/list',
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
    getRoleList(params) {
        return request({
            method: 'get',
            url: '/roles/allList',
            data: params,
            mock: true
        });
    },
    getDeptList(params) {
        return request({
            method: 'get',
            url: '/dept/list',
            data: params,
            mock: true
        });
    },
    submitUser(params) {
        return request({
            method: 'post',
            url: '/users/operate',
            data: params,
        });
    },
};