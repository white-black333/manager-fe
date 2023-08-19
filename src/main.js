import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import axios from 'axios'; //Axios 是一个基于 promise 的网络请求库
import config from './config';

// 使用axios.get（）方法发起get网络请求，并获取数据
axios.get(config.mockApi + '/login').then((res) => {
    console.log(res);
});

// console.log('环境变量', process.env);//使用vite创建vue项目，process.env已经被移除了
console.log('环境变量', import.meta.env); //vite配置中环境变量的位置
const app = createApp(App);
// 将router对象挂载到vue实例身上
app.use(router).use(ElementPlus).mount('#app');
