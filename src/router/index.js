import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './../components/Home.vue';

// 配置路由规则数组routes
const routes = [
    {
        name: 'home',
        path: '/',
        meta: {
            title: '首页'
        },
        component: Home,
        redirect: '/welcome',
        children: [
            {
                name: 'Welcome',
                path: '/welcome',
                meta: {
                    title: '欢迎页'
                },
                component: () => import('../views/Welcome.vue'),

            }
        ]

    },
    {
        name: 'Login',
        path: '/login',
        meta: {
            title: '登录'
        },
        component: () => import('../views/Login.vue'),

    }
];

// 创建路由对象
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;