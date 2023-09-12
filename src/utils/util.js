/* 工具函数封装 */


// 日期格式化函数封装
export default {
    dataFormater(date, fmt) {
        fmt = fmt || "yyyy-MM-dd hh:mm:ss"; //没有规则默认日期格式
        date = new Date(date);
        if (/(y+)/.test(fmt)) {
            const t = (/(y+)/.exec(fmt)[1]);
            fmt = fmt.replace(t, date.getFullYear());
        }
        const o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
        };
        for (let k in o) {
            const reg = new RegExp(`(${k})`);
            if (reg.test(fmt)) {
                const t = reg.exec(fmt)[1];
                // console.log(t.length);
                // console.log(o[k]);
                // fmt = fmt.replace(t, o[k]);
                fmt = fmt.replace(t, t.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return fmt;
    }
};
// obj.dataFormater("2024-01-17T13:32:06.381Z");