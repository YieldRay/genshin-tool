const fetch = require("node-fetch");
const thrower = require("./thrower");

module.exports = function (cookie = null, self_uid = null, target_uid = null, region = "cn_gf01") {
    //region:[cn_gf01,cn_qd01]
    const act_id = "e202009291139501";

    // debug
    if (cookie && typeof cookie !== "string") throw new Error("cookie must be string");
    if (typeof region !== "string") throw new Error("region must be string");
    if (self_uid && isNaN(Number(self_uid))) throw new Error("self_uid  must be able to be resolved to a number");
    if (self_uid && isNaN(Number(target_uid))) throw new Error("target_uid  must be able to be resolved to a number");

    // main
    async function req(url, isPOST = false, bodyReplacer) {
        try {
            bodyReplacer = bodyReplacer ? bodyReplacer : JSON.stringify({ act_id, uid: self_uid, region });
            const body = isPOST ? bodyReplacer : null;
            const hoyolabVersion = "2.11.1";
            const resp = await fetch(url, {
                method: isPOST ? "POST" : "GET",
                body,
                headers: {
                    "user-agent": `Mozilla/5.0 (Linux; Android 9; Unspecified Device) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Mobile Safari/537.36 miHoYoBBS/${hoyolabVersion}`,
                    origin: "https://webstatic.mihoyo.com",
                    referer: "https://webstatic.mihoyo.com/app/community-game-records/index.html?v=6",
                    "accept-encoding": "gzip, deflate",
                    "accept-language": "zh-CN,en-US;q=0.8",
                    "content-type": "application/json;charset=utf-8",
                    "x-requested-with": "com.mihoyo.hyperion",
                    "x-rpc-device_id": "94581081EDD446EFAA3A45B8CC636CCF",
                    "x-rpc-client_type": "5",
                    "x-rpc-app_version": hoyolabVersion,
                    accept: "application/json, text/plain, */*",
                    host: "api-takumi.mihoyo.com",
                    cookie,
                    ds: require("./ds")(url, body),
                },
            });
            const result = await resp.json();
            //console.log(result);
            if (!result.data) throw new Error(result.message);
            if (result.retcode !== 0) throw new Error(JSON.stringify(result));
            return result.data;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    req.get = async url => {
        try {
            return await req(url, false);
        } catch (e) {
            throw e;
        }
    };

    req.post = async url => {
        try {
            return await require("./oldCheckIn")(url, cookie, act_id, self_uid, region);
        } catch (e) {
            throw e;
        }
    };

    // 签到
    const selfSign = async () => {
        thrower([self_uid, "self_uid"]);
        return await req.post("https://api-takumi.mihoyo.com/event/bbs_sign_reward/sign");
    };

    // 获取签到奖励信息
    const signReward = async () => await req.get(`https://api-takumi.mihoyo.com/event/bbs_sign_reward/home?act_id=${act_id}`);

    // 获取自己的签到天数
    // {
    //     "total_sign_day": 1,
    //     "today": "2021-08-20",
    //     "is_sign": true,
    //     "first_bind": false,
    //     "is_sub": false,
    //     "month_first": false
    // }
    const signInfo = async () => {
        thrower([self_uid, "self_uid"]);
        return await req.get(`https://api-takumi.mihoyo.com/event/bbs_sign_reward/info?region=${region}&act_id=${act_id}&uid=${self_uid}`);
    };

    // 获取自己的账号信息
    // {
    //     "list": [
    //         {
    //             "game_biz": "hk4e_cn",
    //             "region": "cn_gf01",
    //             "game_uid": "123456789",
    //             "nickname": "荧",
    //             "level": 26,
    //             "is_chosen": false,
    //             "region_name": "天空岛",
    //             "is_official": true
    //         }
    //     ]
    // }
    const selfInfo = async () => {
        return await req.get(`https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn`);
    };

    // 获取指定玩家游戏的进度信息
    const gameInfo = async () => {
        thrower([target_uid, "target_uid"]);
        return await req.get(`https://api-takumi.mihoyo.com/game_record/app/genshin/api/index?role_id=${target_uid}&server=${region}`);
    };

    // 本期深渊
    const spiralAbyss1 = async () => {
        thrower([target_uid, "target_uid"]);
        return await req.get(
            `https://api-takumi.mihoyo.com/game_record/app/genshin/api/spiralAbyss?schedule_type=1&server=${region}&role_id=${target_uid}`,
        );
    };

    // 上期深渊
    const spiralAbyss2 = async () => {
        thrower([target_uid, "target_uid"]);
        return await req.get(
            `https://api-takumi.mihoyo.com/game_record/app/genshin/api/spiralAbyss?schedule_type=2&server=${region}&role_id=${target_uid}`,
        );
    };

    // 角色详情
    const charDetail = async function () {
        thrower([target_uid, "target_uid"]);
        const gameinfo = await gameInfo();
        return await req(
            `https://api-takumi.mihoyo.com/game_record/app/genshin/api/character`,
            true,
            JSON.stringify({ character_ids: gameinfo.avatars.map(item => item.id), role_id: target_uid, server: region }),
        );
    };

    return {
        selfSign,
        signInfo,
        signReward,
        selfInfo,
        gameInfo,
        spiralAbyss1,
        spiralAbyss2,
        charDetail,
    };
};
