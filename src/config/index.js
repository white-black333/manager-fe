/* 
环境配置封装
*/

const env = import.meta.env.MODE || 'prod';
const EnvConfig = {
    dev: {
        baseApi: '/',
        mockApi: 'https://www.fastmock.site/mock/e7fad20cc6598563ae378d9cb1763843/api'
    },
    test: {
        baseApi: '//test.future.com/api',
        mockApi: 'https://www.fastmock.site/mock/e7fad20cc6598563ae378d9cb1763843/api'
    },
    prod: {
        baseApi: '/future.com/api',
        mockApi: 'https://www.fastmock.site/mock/e7fad20cc6598563ae378d9cb1763843/api'
    }
};
export default {
    env,
    mock: true,
    ...EnvConfig[env]





};