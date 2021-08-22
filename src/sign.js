module.exports = function (cookie) {
    return (async function () {
        let json = {};
        try {
            let api;
            if (cookie === undefined) throw new Error("cookie is required");
            if (typeof cookie !== "string") throw new Error("cookie must be string");
            cookie = cookie.trim();
            api = require("./main")(cookie);
            const selfInfo = await api.selfInfo();
            const { region, region_name, game_uid, nickname, level } = selfInfo.list[0];
            api = require("./main")(cookie, game_uid, null, region);
            const signInfo = await api.signInfo();
            const { is_sign, total_sign_day, today } = signInfo;
            json = { today, region_name, nickname, level };
            if (is_sign) {
                json.msg = `今天已经签过到了，已签到${total_sign_day}天`;
            } else {
                const selfSign = await api.selfSign();
                json.msg = `签到成功，已签到${total_sign_day}天`;
            }
        } catch (e) {
            json.msg = e.message;
            //throw e;
        }
        return JSON.stringify(json, null, 4);
    })();
};
// require("./sign")(cookie).then(console.log);
