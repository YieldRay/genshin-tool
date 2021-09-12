const fetch = require("node-fetch");
const md5 = require("md5");
const { stringify } = require("qs");

const salt = "h8w582wxwgqvahcdkpvdhbh2w9casgfl";
function randomString(e) {
    const s = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const res = [];
    for (let i = 0; i < e; ++i) {
        res.push(s[Math.floor(Math.random() * s.length)]);
    }
    return res.join("");
}
function ds() {
    const t = Math.floor(Date.now() / 1000);
    const r = randomString(6);
    const m = md5(stringify({ salt, t, r }));
    return [t, r, m].join(",");
}

module.exports = async function (url, cookie, act_id, uid, region) {
    try {
        const resp = await fetch(url, {
            headers: {
                "x-rpc-device_id": "94581081EDD446EFAA3A45B8CC636CCF",
                "x-rpc-client_type": "5",
                "x-rpc-app_version": "2.3.0",
                "user-agent":
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/2.3.0",
                origin: "https://webstatic.mihoyo.com",
                referer: `https://webstatic.mihoyo.com/bbs/event/signin-ys/index.html?bbs_auth_required=true&act_id=${act_id}&utm_source=bbs&utm_medium=mys&utm_campaign=icon`,
                cookie,
                ds: ds(),
            },
            method: "POST",
            body: JSON.stringify({ act_id, uid, region }),
        });

        const result = await resp.json();
        if (result.data === null && result.message) throw new Error(result.message);
        if (result.retcode !== 0) throw new Error(JSON.stringify(result));
        return result.data;
    } catch (e) {
        throw e;
    }
};
