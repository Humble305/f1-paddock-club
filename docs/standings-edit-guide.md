# 积分数据手改说明

后面如果你要自己改积分，先看你是怎么打开网站的：

- 直接双击 `index.html` 打开：改 `standings.live.bundle.js`
- 走本地服务器、GitHub Pages 或其他 `http/https` 地址打开：改 `standings.live.json`

如果你两种方式都会用，最稳的是两份一起改，内容保持一致。

不要去改这些运行文件：

- `modules/app-standings-data.js`
- `modules/app-pages-settings.js`
- `raceSession.js`

这些是读取逻辑，不是手改积分入口。

## 你真正要改的字段

无论是 `standings.live.bundle.js` 还是 `standings.live.json`，核心结构都一样：

```json
{
  "meta": {
    "source": "formula1.com",
    "season": 2026,
    "raceLabel": "Miami Grand Prix",
    "updatedAt": "2026-05-05T10:00:00+08:00"
  },
  "predictionResult": {
    "round": 6,
    "pole": "Kimi Antonelli",
    "winner": "Kimi Antonelli",
    "podium": ["Lando Norris", "Oscar Piastri"]
  },
  "teamStandings": [],
  "driverStandings": []
}
```

平时只需要改这 5 块：

1. `meta.raceLabel`
   写这次更新对应的分站名。
2. `meta.updatedAt`
   写你这次手改的北京时间，推荐格式：`2026-06-11T23:30:00+08:00`
3. `predictionResult`
   这是预测结算用的数据。
   `round` = 已完赛站次编号
   `pole` = 杆位车手
   `winner` = 正赛冠军
   `podium` = 只写 P2 和 P3，按顺序放两个名字
4. `teamStandings`
   车队总积分
5. `driverStandings`
   车手总积分

## 必须保持的规则

- 车手名必须和站内现有名字完全一致
  例如：`Charles Leclerc`、`Lando Norris`、`Kimi Antonelli`
- 车队名尽量只用这一套
  `Mercedes`
  `Ferrari`
  `McLaren`
  `Red Bull`
  `Aston Martin`
  `Williams`
  `Haas`
  `Alpine`
  `Racing Bulls`
  `Audi`
  `Cadillac`
- `predictionResult.podium` 里只放两个人
  第一个是 P2，第二个是 P3
- 如果你改的是 `standings.live.json`，它必须保持合法 JSON
  不能写注释，逗号不能漏
- 如果你改的是 `standings.live.bundle.js`，只改 `window.STANDINGS_LIVE_PAYLOAD = { ... }` 里面那份数据，不要碰外层代码

## 改完以后会发生什么

只要页面重新读到这份数据：

- 总积分会更新
- `predictionResult` 会同步到赛前预测结算
- 如果玩家已经预测过这一站，系统会按这份结果自动结算
- 奖励围场币会照常发放

## 最稳的修改顺序

1. 先改 `predictionResult`
2. 再改 `teamStandings`
3. 再改 `driverStandings`
4. 最后改 `meta.raceLabel` 和 `meta.updatedAt`

## 参考文件

- [standings.live.bundle.js](/E:/个人文件/f1-paddock-club-main/standings.live.bundle.js)
- [standings.live.json](/E:/个人文件/f1-paddock-club-main/standings.live.json)
- [standings.example.json](/E:/个人文件/f1-paddock-club-main/standings.example.json)
- [standings.manual-template.json](/E:/个人文件/f1-paddock-club-main/standings.manual-template.json)
