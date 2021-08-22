module.exports = async (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    const query = require("qs").parse(
        new URL("http://127.0.0.1" + req.url).search,
        {
            ignoreQueryPrefix: true,
        }
    );
    // 环境变量，如vercel内设置了则使用，但请求中的cookie优先
    let cookie = query.cookie;
    if (!cookie && process.env.mys_cookie) cookie = process.env.mys_cookie;
    // 返回
    res.end(await require("../src/sign")(cookie));
};
