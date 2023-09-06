import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import request from './utils/request';
import storage from "./utils/storage";
import * as ElementPlusIconsVue from '@element-plus/icons-vue';//导入el-icon
import api from './api';
import store from './store';

// console.log('环境变量', process.env);//使用vite创建vue项目，process.env已经被移除了
console.log('环境变量', import.meta.env); //vite配置中环境变量的位置
const app = createApp(App);

// 给globalProperties添加对象，即将request添加到全局vue实例身上
app.config.globalProperties.$request = request;
// 将storage对象挂载到vue实例(app)身上
app.config.globalProperties.$storage = storage;
// 将router对象挂载到vue实例身上
app.config.globalProperties.$api = api;

// 注册el-icon  key,component => iconName及其对应的组件
// Object.entries(): Returns an array of key / values of the enumerable properties of an object
/* for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
} */
// app.component()方法，让组件在当前vue实例中全局可用。=>全局注册
for (const iconName in ElementPlusIconsVue) {
    app.component(iconName, ElementPlusIconsVue[iconName]);
}

app.use(router).use(ElementPlus).use(store).mount('#app');



