// 实现多cookie
const allCookie = process.argv.slice(2)[0] ? process.argv.slice(2)[0] : process.env.mys_cookie;

async function checkin(cookie) {
    try {
        if (cookie.startsWith('"') && cookie.endsWith('"')) cookie = cookie.replace(/"/g, "");
        const res = await require("./src/sign")(cookie);
        console.log(res);
        return res;
    } catch (e) {
        throw e;
    }
}

if (allCookie.startsWith("[") && allCookie.endsWith("]")) {
    let arr;
    try {
        arr = JSON.parse(allCookie);
    } catch (e) {
        throw new Error("json 不合法");
    }
    arr.forEach(checkin);
} else {
    checkin(allCookie);
}
// node checkin "_MHYUUID=A-B-C-D; ltoken=ABC; ltuid=12345678; cookie_token=ABC; account_id=12345678; login_uid=123456789; login_ticket=ABC"
// node checkin "['cookie1', 'cookie2', ...]"
