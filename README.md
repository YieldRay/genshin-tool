# genshin-tool

## _请务必保护好自己的 cookie，不要在不受信任的地址输入自己的 cookie!_
预览：<https://genshin-tool.vercel.app/>

## 获取米游社 cookie

登录[米游社](https://bbs.mihoyo.com/ys/)后，在地址栏输入 `javascript:alert(document.cookie)` 弹出窗口内显示 cookie

![step1](https://i.w3tt.com/2021/08/21/q6gH1.png)

![step2](https://i.w3tt.com/2021/08/21/q6y1G.png)

## module

```js
const api = require("./index")(cookie, self_uid, target_uid, region);
const selfInfo = await api.selfInfo();
const signReward = await api.signReward();
```

简而言之，查询他人信息时只需要 自己的 cookie 和 target_uid，并且只有玩家注册米游社后方可查询其信息

## server

统一返回格式

```
{
    time: 当前时间戳|Number,
    data: 成功返回的数据|Object,
    success: 是否成功|Boolean,
    msg: 错误详情|String,
};

```

```

支持 GET 和 POST 请求
为了保护cookie，建议只使用 POST
example:
GET  http://localhost/?self_uid=...&target_uid=...&cookie=...&action=...
POST  http://localhost/   -j-s-o-n->   body = { self_uid: '', target_uid: '', cookie='', action='' }


```

```
action:{
    selfSign, // 执行签到  需要self_uid
    signInfo, // 签到信息  需要self_uid
    signReward, // 签到奖励  不需要 cookie 和 self_uid
    selfInfo, // 账号信息， 据此查询self_uid，然后再签到和查询签到信息 需要self_uid,不需要target_uid
    gameInfo, // 游戏信息，精确到拥有的角色、探索度等  不需要self_uid,需要target_uid
    spiralAbyss1, // 本期深渊  不需要self_uid,需要target_uid
    spiralAbyss2, // 上期深渊  不需要self_uid,需要target_uid
    charDetail, // 角色详情，精确到角色装备的武器、圣遗物、命座  不需要self_uid,需要target_uid
}
```

| 参数       | 说明                                                 |
| ---------- | ---------------------------------------------------- |
| self_uid   | 自己的 uid，即 cookie 对应账号的 uid                 |
| target_uid | 欲查询的 uid                                         |
| cookie     | 米游社 cookie                                        |
| region     | 游戏服务器，默认为 cn_gf01(国服)，可选 cn_qd01(渠道) |
| action     | 请求的方法名，上文已述                               |

### 本地部署

```sh
$ npm install
$ node server
or $ node server "米游社cookie"
```

### 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCrazy-White%2Fgenshin-tool&env=mys_cookie,acao&envDescription=mys_cookie(%E5%8F%AF%E9%80%89)%3A%20%E7%B1%B3%E6%B8%B8%E7%A4%BEcookie%20%20%7C%20%20acao(%E5%8F%AF%E9%80%89)%3A%20%E8%AE%BE%E7%BD%AE%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%8F%91%E9%80%81%E7%9A%84Access-Control-Allow-Origin%E7%9A%84%E5%80%BC%20&demo-url=https%3A%2F%2Fgenshin-tool.vercel.app%2Fapi>)  
可选环境变量 `mys_cookie` ，其值应为米游社 cookie  
可选环境变量`acao`,设置服务器发送的 Access-Control-Allow-Origin 的值  
实例：<https://genshin-tool.vercel.app/api?action=gameInfo&target_uid=100000100>

## 签到

### API 形式

部署到 vercel 后，访问 https://?.vecel.app/api/chechin?cookie=...  
若填写了环境变量`mys_cookie`，直接访问 https://?.vecel.app/api/chechin  
实例：<https://genshin-tool.vercel.app/api/checkin>

### CLI 形式

```sh
$ npm install
$ node checkin "填写cookie"
```

### Github Action

代码抄的<https://github.com/yinghualuowu/GenshinDailyHelper>  
workflow 加后缀.yml，secrets 中的 `mys_cookie` 填写米游社 cookie，支持数组

## 其他

Vercel 环境变量
![vercel](https://i.w3tt.com/2021/08/21/q6JxD.png)

```js
const url = "https://genshin-tool.vercel.app/api";
const data = {
    cookie: "_MHYUUID=....",
    //self_uid: "123456789",
    target_uid: "100010001",
    action: "getCharInfo",
    //region: "cn_gf01",
};

fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
})
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));
```