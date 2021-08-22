const md5 = require("md5");
const { generate } = require("randomstring");
const { stringify } = require("qs");

const salt = "4a8knnbk5pbjqsrudp3dq484m9axoc5g";

module.exports = () => {
    const t = Math.floor(Date.now() / 1000);
    const r = generate({
        length: 6,
        charset: "abcdefghijklmnopqrstuvwxyz0123456789",
    });
    const m = md5(stringify({ salt, t, r }));
    return [t, r, m].join(",");
};
