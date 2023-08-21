/* Storage二次封装 
    1. 给Storage设置名空间，防止同一页面使用相同的密钥/key值
*/

import config from '../config';
// 封装后的Storage对象 有以下几种 方法(对象的属性值为函数则称为方法)
// this:  对象中的方法可以通过this访问当前对象的属性/方法
export default {
    setItem(key, val) {
        // JSON.stringify() 将对象或值转换为 JSON 字符串
        const storage = this.getStorage();
        storage[key] = val;
        window.localStorage.setItem(config.nameSpace, JSON.stringify(storage));
    },
    getItem(key) {
        return this.getStorage()[key];
    },
    getStorage() {
        // JSON.parse()  JSON字符串转对象格式
        return JSON.parse(window.localStorage.getItem(config.nameSpace) || '{}');
    },
    removeItem(key) {
        const storage = this.getStorage();
        delete storage[key];
        window.localStorage.setItem(config.nameSpace, JSON.stringify(storage));
    },
    clearAll() {
        window.localStorage.clearAll();
    }

};