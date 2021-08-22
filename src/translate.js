module.exports = function (origin) {
    const rplc = e =>
        e
            .replace(/Anemo/g, "风")
            .replace(/Geo/g, "岩")
            .replace(/Hydro/g, "水")
            .replace(/Pyro/g, "火")
            .replace(/Cryo/g, "冰")
            .replace(/Electro/g, "雷")
            .replace(/Reputation/g, "声望");

    switch (typeof origin) {
        case "object":
            return JSON.parse(rplc(JSON.stringify(origin)));
            break;
        case "string":
            return rplc(origin);
            break;
        default:
            throw new Error("fail to translate, not an object or string");
    }
};
// 替换对象或字符串中的文字
