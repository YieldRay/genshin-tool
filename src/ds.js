// Originate from https://github.com/genshin-kit/genshin-kit/tree/master/src/module [Apache-2.0]
const crypto = require("crypto");
const { stringify, parse } = require("qs");

// 按首字母排序 object
function sortKeys(obj) {
    const copy = {};
    const allKeys = Object.keys(obj).sort();
    allKeys.forEach(key => {
        copy[key] = obj[key];
    });
    return copy;
}


module.exports = function (url, body) {
    const query = parse(new URL(url).search.slice(1));
    const salt = "xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs";
    const time = Math.floor(Date.now() / 1000);
    // Integer between 10000 - 200000
    const random = Math.floor(Math.random() * (200000 - 100000 + 1) + 100000);

    const b = body ? JSON.stringify(sortKeys(JSON.parse(body))) : "";
    const q = query ? stringify(sortKeys(query)) : "";

    const check = crypto.createHash("md5").update(`salt=${salt}&t=${time}&r=${random}&b=${b}&q=${q}`).digest("hex");

    return `${time},${random},${check}`;
};
