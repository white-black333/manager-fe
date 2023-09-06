/* axios 二次封装 */

import axios from "axios";
import config from "../config";
/* Message 可以接收一个字符串或一个 VNode 作为参数，它会被显示为正文内容。 
type:'success' | 'warning' | 'info' | 'error',每个type也是一个方法*/
import { ElMessage } from 'element-plus';//单独引入Message。此时调用方法为 ElMessage()
import router from "../router";
import storage from './storage';

const TOKEN_INVALID = '登录过期，请重新登录';
const NTEWORK_ERROR = '网络异常，请稍后再试';

// 创建axios实例对象，添加全局请求配置
const service = axios.create({
    baseURL: config.baseApi,   // `baseURL` 将自动加在 `url` 前面
    timeout: 1000,// `timeout` 指定请求超时的毫秒数。如果请求时间超过 `timeout` 的值，则请求会被中断
});

// 请求拦截
service.interceptors.request.use((req) => {
    // 在发送请求之前添加认证头
    const headers = req.headers;
    if (!headers.Authorization) {
        const { token = "" } = storage.getItem('userInfo') || {};
        headers.Authorization = "Bearer " + token;
    };
    return req;
},
    // 拦截失败
    (error) => {
        return Promise.reject(error);
    });

// 响应拦截
service.interceptors.response.use((res) => {
    // console.log(res);//返回的res有config,data,headers,request,status,statusText属性
    const { code, data, msg } = res.data;//res.data是返回的json对象
    if (code === 200) {
        return data;
    } else if (code === 40001) {
        // 页面弹窗，提示用户错误信息
        ElMessage.error(TOKEN_INVALID);
        setTimeout(() => {
            // 跳转到登录组件
            router.push('/login');
        }, 15000);
        return Promise.reject(TOKEN_INVALID);
    } else {
        ElMessage.error(msg || NTEWORK_ERROR);
        return Promise.reject(msg || NTEWORK_ERROR);
    }
});


/* 请求核心函数 */
function request(options) {
    options.method = options.method || 'get';//请求的方法get/post
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data;  // `params` 是与get请求一起发送的 URL 参数
    }

    // 局部mock设置
    if (typeof options.mock != 'undefined') {
        config.mock = options.mock;
    }
    // 项目上线时
    if (config.env === 'prod') {
        // 网络请求 设置axios的baseURL 为上线接口，防止其使用mock接口数据，出现错误
        service.defaults.baseURL = config.baseApi;
    } else {
        // service.defaults 自定义axios实例默认值
        service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi;
    }

    return service(options);
}

// 进一步封装,给request函数添加方法 request.get()
['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
    request[item] = (url, data, options) => {
        return request({
            method: item,
            url,
            data,
            ...options // mock, loading
        });
    };
});


export default request;