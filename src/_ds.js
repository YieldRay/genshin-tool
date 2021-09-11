// Originate from https://github.com/genshin-kit/genshin-kit/tree/master/src/module [Apache-2.0]
const crypto = require("crypto");
const { stringify } = require("qs");

function randomString(e) {
    const s = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const res = [];
    for (let i = 0; i < e; ++i) {
        res.push(s[Math.floor(Math.random() * s.length)]);
    }
    return res.join("");
}

module.exports = function () {
    const t = Math.floor(Date.now() / 1000);
    const r = randomString(6);
    const m = crypto.createHash("md5").update(stringify({ salt, t, r }));
    return [t, r, m].join(",");
};
