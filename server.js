// 配置本地cookie
// process.env.mys_cookie = "";
// 配置Access-Control-Allow-Origin
process.env.acao = "*";
// 配置端口
const port = 80;

/* 请求 /checkin 返回签到接口 */
const http = require("http");
const qs = require("qs");
const fs = require("fs");
const thrower = require("./src/thrower");
if (process.argv.slice(2)[0]) process.env.mys_cookie = process.argv.slice(2)[0];
const server = http.createServer(httpConfig);
server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});
server.on("clientError", (err, socket) => {
    if (err.code === "ECONNRESET" || !socket.writable) {
        return;
    }

    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

async function httpConfig(req, res) {
    if (req.url === "/" || req.url === "index.htm" || req.url === "index.html") {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(fs.existsSync("./public/index.html") ? fs.readFileSync("./public/index.html") : fs.readFileSync("./index.html"));
        return;
    }
    if (req.url.startsWith("/api")) {
        if (process.env.acao) res.setHeader("Access-Control-Allow-Origin", process.env.acao);
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        const data = { time: new Date().getTime() };
        let query;
        const writeResp = req.url.startsWith("/api/checkin") ? writeCheckinResp : writeApiResp;
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

        async function writeApiResp() {
            config();
            const { action = null, cookie = null, self_uid, target_uid, region = "cn_gf01" } = query;
            const api = require("./src/main")(cookie, self_uid, target_uid, region);
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

        async function writeCheckinResp() {
            config();
            res.end(await require("./src/sign")(query.cookie));
        }

        function config() {
            // 请求中的cookie优先
            if (!query.cookie && process.env.mys_cookie) query.cookie = process.env.mys_cookie;
            const ip =
                req.headers["x-forwarded-for"] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
            console.log(new Date(), ip, req.method, query);
        }
    } else {
        res.end("<h1>404 Not Found</h1>");
    }
}
