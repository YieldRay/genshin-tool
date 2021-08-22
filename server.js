const http = require("http");
const func = require("./api/index");
// 配置本地cookie
// process.env.mys_cookie = "";

process.env.acao = "*";
if (process.argv.slice(2)[0]) process.env.mys_cookie = process.argv.slice(2)[0];
const port = 80;
const server = http.createServer(func);
server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});
server.on("clientError", (err, socket) => {
    if (err.code === "ECONNRESET" || !socket.writable) {
        return;
    }

    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});
