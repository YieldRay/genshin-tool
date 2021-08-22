const qs = require("qs");
const thrower = require("../src/thrower");

module.exports = async (req, res) => {
    if (process.env.acao) res.setHeader("Access-Control-Allow-Origin", process.env.acao);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    const data = { time: new Date().getTime() };
    let query;
    switch (
        req.method // 判断请求类型，并统一得到query，然后调用writeResp
    ) {
        case "GET":
            query = qs.parse(new URL("http://127.0.0.1" + req.url).search, {
                ignoreQueryPrefix: true,
            });
            writeResp();
            break;
        case "POST":
            let post = "";
            req.on("data", chunk => (post += chunk));
            req.on("end", () => {
                query = JSON.parse(post);
                writeResp();
            });
            break;
        default:
            query = {};
            data.msg = "method is not allowed";
            res.end(JSON.stringify(data));
    }

    async function writeResp() {
        // 转发请求

        // 环境变量，如vercel内设置了则使用，但请求中的cookie优先
        if (!query.cookie && process.env.mys_cookie) query.cookie = process.env.mys_cookie;

        const ip =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        console.log(new Date(), ip, req.method, query);
        const { action = null, cookie = null, self_uid, target_uid, region = "cn_gf01" } = query;

        const api = require("../src/main")(cookie, self_uid, target_uid, region);

        try {
            if (action !== "signReward") thrower([cookie, "cookie"]);
            if (action in api) {
                // 是否存在该action
                data.data = await api[action]();
                data.success = true;
                data.msg = "success";
            } else {
                data.success = false;
                data.msg = `action '${action}' does not exist`;
            }
        } catch (e) {
            data.success = false;
            data.msg = e.message;
        }

        res.end(JSON.stringify(data));
    }
};
