// node checkin "cookie"
// node checkin '["cookie1", "cookie2", ...]'

const allCookie = process.argv.slice(2)[0] ? process.argv.slice(2)[0] : process.env.mys_cookie;

if (!allCookie) {
    console.error(log("错误！未设置cookie！"));
    throw new Error("未设置cookie");
}

if (allCookie.startsWith("[") && allCookie.endsWith("]")) {
    let arr;
    try {
        arr = JSON.parse(allCookie);
    } catch (e) {
        console.error(log("错误！json 不合法"));
        throw new Error("json 不合法");
    }
    if (arr.length === 0) {
        console.error(log("错误！未设置cookie！"));
        throw new Error("未设置cookie！");
    }
    arr.forEach(checkin);
} else {
    checkin(allCookie);
}

async function checkin(cookie) {
    try {
        let api;
        if (!cookie) throw new Error("cookie为空");
        if (typeof cookie !== "string") throw new Error("cookie必须为字符串");
        cookie = cookie.trim();
        if (cookie.startsWith('"') && cookie.endsWith('"')) cookie = cookie.replace(/"/g, "");
        if (cookie.startsWith("'") && cookie.endsWith("'")) cookie = cookie.replace(/'/g, "");
        const arr = [];
        arr.push(log(`开始签到，当前cookie为 ${cookie.slice(0, 15)}......`));
        api = require("./src/main")(cookie);
        const selfInfo = await api.selfInfo();
        const { region, region_name, game_uid, nickname, level } = selfInfo.list[0];
        arr.push(log(`区域 ${region_name} |  昵称 ${nickname} | 等级 ${level}`)); // uid ${game_uid}
        api = require("./src/main")(cookie, game_uid, null, region);
        const signInfo = await api.signInfo();
        const { is_sign, total_sign_day, today } = signInfo;
        arr.push(log("今日为" + today));
        if (is_sign) {
            arr.push(log(`今天已经签过到了，已签到${total_sign_day}天`));
        } else {
            const selfSign = await api.selfSign();
            arr.push(log(`签到成功，已签到${total_sign_day}天`));
        }
        console.log(arr);
    } catch (e) {
        if (e.message === "登录失效，请重新登录") console.error(log("cookie错误或失效"));
        else console.error(log(e.message));
        throw e;
    }
}

function log(msg) {
    return `[${new Date().toLocaleString()}]:  ${msg}`;
}
