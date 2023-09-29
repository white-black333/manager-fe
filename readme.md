## **Vue3+ElementPlus+Koa2 全栈开发后台系统\**

## 一、**项目概述**

https://blog.51cto.com/u_15703678/5438806

开发服务器 (`dev` 命令) 运行在 `development` (开发) 模式

而 `build` 命令则运行在 `production` (生产) 模式。

## 二、**项目依赖**

项目初始化,vite创建项目,插件安装,目录结构,环境配置

https://blog.51cto.com/u_15082391/4517419、

1.-D会被记录到devDependencies【开发环境】  等于 npm中--save-dev

2.-S 会被记录到dependencies【生产环境】   等于npm中--save

 

element-plus官网  学习手册

https://element-plus.org/zh-CN/guide/quickstart.html

 

开发依赖包和生产依赖包安装反了怎么办？

删除yarn.lock,node_modules文件,直接在package.json中调换依赖包的位置 再执行 yarn命令（yarn install）

Yarn.lock作用：锁定版本，安装时会根据yarn.lock中指定的版本安装。

## 三、**项目配置**

1. Vite配置（[开发服务器选项](https://cn.vitejs.dev/config/server-options.html)）

```js
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 8080
  },
  plugins: [vue()],
})
```



2. [环境变量](https://cn.vitejs.dev/guide/env-and-mode.html)：process.env  --> import.meta.env

 

3. .env 文件:

> package.json设置"dev": "vite --mode dev"，才能获取.env文件中的变量

为了防止意外地将一些环境变量泄漏到客户端，只有以 **VITE_** 为前缀的变量才会暴露给经过 vite 处理的代码。

4. package.json说明

   ```json
   * 真实的package.json没有注释（json文件不存在注释）
   {
     "name": "package",//项目名称
     "version": "1.0.0",//项目版本
     "description": "",//项目描述
     "main": "index.js",//主文件（比如默认是index.js，项目名称叫package。那么require(‘package’)将返回index.js返回的内容）
     "scripts": {//指定了运行脚本命令的npm命令行缩写，比如start指定了运行npm run start时，所要执行的命令。
       "test": "echo \"Error: no test specified\" && exit 1"
     },
     "author": "",//作者
     "license": "ISC",//协议
     "devDependencies": {},//devDependencies指定项目开发所需要的模块。
     "dependencies": {},//dependencies字段指定了项目运行所依赖的模块
   }
   ```

5. 引入插件 elementplus
   完整引入`app.use(ElementPlus)`
   [Element Plus官方文档](https://element-plus.org/zh-CN/guide/quickstart.html)

## 四、**路由封装**

### 基本设置

- **配置main.js**

引入router对象 `	import router from './router'`
注册   ``app.use(router)``

-   **css使用路由**

​	`<router-view></router-view>`

- **创建路由对象并配置路由**

引入vue-router以及相关的路由组件
`import { createRouter, createWebHashHistory } from 'vue-router';`

在/src/router/index.js中创建 Router对象并暴露


### 配置路由

1. 路由模式 ： [hash和history区别](https://www.bilibili.com/video/BV1GB4y1R7r6/)

2. 创建路由规则数组routes，它定义了路由组件的父子关系

3. 使用`router-view`加载路由组件

4. [路由跳转三种方式](https://juejin.cn/post/7108176713351168037)：

   ```js
   1.
   <router-link to=''>   
   2.
   this.$router.push  
   3. 
   const router = useRouter();
   router.push('/welcome')；
   ```

   

## 五、环境配置封装

```js
const env = import.meta.env.MODE || 'prod';
//尽量把配置封装 根据env选择不同配置
const EnvConfig = {
    dev: {
        baseApi: '/',
        mockApi: 'https://www.fastmock.site/mock/xxx/api'
    },
    test: {
        baseApi: '//test.future.com/api',
        mockApi: 'https://www.fastmock.site/mock/xxx/api'
    },
    prod: {
        baseApi: '/future.com/api',
        mockApi: 'https://www.fastmock.site/mock/xxx/api'
    }
};
export default {
    env,
    mock: true,
    ...EnvConfig[env]
};
```



### axios二次封装

axios是基于 promise的网络请求库

使用axios.create()创建axios实例对象。axios.create()是添加了自定义配置的新的axios。

### post get

post请求方法,`data` 是作为post请求体被发送的数据

get请求方法，`params` 是与get请求一起发送的 URL 参数

### Storage二次封装







