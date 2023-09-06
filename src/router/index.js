import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import storage from '../utils/storage';
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

            },
            {
                name: 'vue',
                path: 'vue',
                meta: {
                    title: 'vue'
                },
                component: () => import('../views/Welcome.vue'),
                children: [
                    {
                        name: 'vite',
                        path: 'vite', //子路由共用父路由路径，不要叫‘/’
                        meta: {
                            title: 'vite'
                        },
                        component: () => import('../views/Welcome.vue'),
                        children: [
                            {
                                name: 'elplus',
                                path: 'elplus', //子路由共用父路由路径，不要叫‘/’
                                meta: {
                                    title: 'elplus'
                                },
                                component: () => import('../views/Welcome.vue'),

                            }
                        ]
                    }
                ]
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