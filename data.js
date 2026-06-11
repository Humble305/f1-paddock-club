// data.js - 所有静态数据

const TEAM_COLORS = {
    "法拉利": "#DC0000",
    "梅赛德斯": "#00D2BE",
    "红牛": "#3671C6",
    "迈凯伦": "#FF8700",
    "阿斯顿马丁": "#229971",
    "威廉姆斯": "#005AFF",
    "哈斯": "#B6BABD",
    "Alpine": "#2293D1",
    "Racing Bulls": "#2B6E9F",
    "奥迪": "#1A1C2B",
    "凯迪拉克": "#C1C6D1"
};

// 车手身份、人设、资料卡正文已经迁移到 data/drivers/*.json，
// 这里仅保留兼容壳，避免继续在 data.js 维护第二套人物真相。
const DRIVERS = [];
const DRIVER_PROFILES = {};

const teamStandings = [
    { name: "梅赛德斯 (Mercedes)", points: 135, color: "#00D2BE" },
    { name: "法拉利 (Ferrari)", points: 90, color: "#DC0000" },
    { name: "迈凯伦 (McLaren)", points: 46, color: "#FF8700" },
    { name: "哈斯 (Haas)", points: 18, color: "#B6BABD" },
    { name: "Alpine", points: 16, color: "#2293D1" },
    { name: "红牛 (Red Bull)", points: 16, color: "#3671C6" },
    { name: "Racing Bulls", points: 14, color: "#2B6E9F" },
    { name: "奥迪 (Audi)", points: 2, color: "#1A1C2B" },
    { name: "威廉姆斯 (Williams)", points: 2, color: "#005AFF" },
    { name: "凯迪拉克 (Cadillac)", points: 0, color: "#C1C6D1" },
    { name: "阿斯顿马丁 (Aston Martin)", points: 0, color: "#229971" }
];

const driverStandings = [
    { name: "Kimi Antonelli", team: "梅赛德斯", points: 72 },
    { name: "George Russell", team: "梅赛德斯", points: 63 },
    { name: "Charles Leclerc", team: "法拉利", points: 49 },
    { name: "Lewis Hamilton", team: "法拉利", points: 41 },
    { name: "Lando Norris", team: "迈凯伦", points: 25 },
    { name: "Oscar Piastri", team: "迈凯伦", points: 21 },
    { name: "Oliver Bearman", team: "哈斯", points: 17 },
    { name: "Pierre Gasly", team: "Alpine", points: 15 },
    { name: "Max Verstappen", team: "红牛", points: 12 },
    { name: "Liam Lawson", team: "Racing Bulls", points: 10 },
    { name: "Arvid Lindblad", team: "Racing Bulls", points: 4 },
    { name: "Isack Hadjar", team: "红牛", points: 4 },
    { name: "Gabriel Bortoleto", team: "奥迪", points: 2 },
    { name: "Carlos Sainz", team: "威廉姆斯", points: 2 },
    { name: "Esteban Ocon", team: "哈斯", points: 1 },
    { name: "Franco Colapinto", team: "Alpine", points: 1 },
    { name: "Nico Hulkenberg", team: "奥迪", points: 0 },
    { name: "Alexander Albon", team: "威廉姆斯", points: 0 },
    { name: "Valtteri Bottas", team: "凯迪拉克", points: 0 },
    { name: "Sergio Perez", team: "凯迪拉克", points: 0 },
    { name: "Fernando Alonso", team: "阿斯顿马丁", points: 0 },
    { name: "Lance Stroll", team: "阿斯顿马丁", points: 0 }
];

const DATE_SCENES = [
    { id: "beach", name: "🏖️ 海边漫步", desc: "夕阳下的沙滩，海浪轻拍" },
    { id: "restaurant", name: "🍽️ 高级餐厅", desc: "烛光晚餐，优雅氛围" },
    { id: "paddock", name: "🏎️ 围场参观", desc: "近距离感受赛车，私密导览" }
];

const F1_CALENDAR = [
    { round: 1, date: "3月6-8日", gp: "澳大利亚大奖赛", location: "墨尔本阿尔伯特公园", sprint: false },
    { round: 2, date: "3月13-15日", gp: "中国大奖赛", location: "上海国际赛车场", sprint: true },
    { round: 3, date: "3月27-29日", gp: "日本大奖赛", location: "铃鹿赛道", sprint: false },
    { round: 6, date: "5月1-3日", gp: "迈阿密大奖赛", location: "迈阿密国际赛车场", sprint: true },
    {
        round: 7,
        date: "5月22-24日",
        gp: "加拿大大奖赛",
        location: "蒙特利尔",
        sprint: true,
        dateRange: {
            start: "2026-05-22T00:00:00+08:00",
            end: "2026-05-24T23:59:59+08:00"
        },
        predictionDeadline: "2026-05-24T04:00:00+08:00"
    },
    { round: 8, date: "6月5-7日", gp: "摩纳哥大奖赛", location: "摩纳哥赛道", sprint: false },
    { round: 9, date: "6月12-14日", gp: "西班牙大奖赛", location: "巴塞罗那-加泰罗尼亚赛道", sprint: false },
    { round: 10, date: "6月26-28日", gp: "奥地利大奖赛", location: "红牛环赛道", sprint: false },
    { round: 11, date: "7月3-5日", gp: "英国大奖赛", location: "银石赛道", sprint: true },
    { round: 12, date: "7月17-19日", gp: "比利时大奖赛", location: "斯帕-弗朗科尔尚赛道", sprint: false },
    { round: 13, date: "7月24-26日", gp: "匈牙利大奖赛", location: "亨格罗宁赛道", sprint: false },
    { round: 14, date: "8月21-23日", gp: "荷兰大奖赛", location: "赞德福特赛道", sprint: true },
    { round: 15, date: "9月4-6日", gp: "意大利大奖赛", location: "蒙扎国家赛车场", sprint: false },
    { round: 16, date: "9月11-13日", gp: "马德里大奖赛", location: "马德里街道赛道", sprint: false },
    { round: 17, date: "9月24-26日", gp: "阿塞拜疆大奖赛", location: "巴库市街赛道", sprint: false },
    { round: 18, date: "10月9-11日", gp: "新加坡大奖赛", location: "滨海湾市街赛道", sprint: true },
    { round: 19, date: "10月23-25日", gp: "美国大奖赛", location: "美洲赛道", sprint: false },
    { round: 20, date: "10月30日-11月1日", gp: "墨西哥城大奖赛", location: "罗德里格斯兄弟赛道", sprint: false },
    { round: 21, date: "11月6-8日", gp: "圣保罗大奖赛", location: "若泽·卡洛斯·帕斯赛道", sprint: false },
    { round: 22, date: "11月19-21日", gp: "拉斯维加斯大奖赛", location: "拉斯维加斯街道赛道", sprint: false },
    { round: 23, date: "11月27-29日", gp: "卡塔尔大奖赛", location: "卢塞尔国际赛道", sprint: false },
    { round: 24, date: "12月4-6日", gp: "阿布扎比大奖赛", location: "亚斯码头赛道", sprint: false }
];

const ANNOUNCEMENTS = [
    {
        version: "v4.9.0",
        content: "🚥 开屏动画上线 & 约会次数进入每日限制\n• 游戏现在加入了全屏发车灯式开屏动画：每次进入都会先经过一段更有 F1 仪式感的 lights out 首屏，再切入主界面\n• 约会系统加入了每日次数限制：单人约会和群约会现在都会跟随系统时间按天刷新，不再可以无限连续约\n• 当天次数用完后，玩家依然可以支付 50 围场币额外开启 1 次当日约会，围场币终于不只是摆设，而是开始真正参与玩法循环"
    },
    {
        version: "v4.8.0",
        content: "🌙 群约会上线 & 预测奖励开始结算\n• 约会模块正式加入群约会：现在可以把两位好感达标的车手一起约出去，临时组局、一起接话，整体气氛会更像真实多人相处\n• 群约会不只会留下摘要，还会把这次组局的关键互动沉进记忆里，后续再聊到同一晚时，角色会更容易记得当时说过什么\n• 赛前预测的围场币奖励已经开始结算：比赛结果出来后，系统会按你的预测命中情况发放奖励，并在登录时给出对应反馈\n• 赛历这条线现在不只是能猜，还能完整走到赛后结算，围场币循环终于真正闭环了 🏆"
    },
    {
        version: "v4.7.0",
        content: "🎯 赛历档案扩展 & 赛前预测小游戏上线\n• 赛历页右侧升级成更完整的分站档案：点到任意分站时，不只会显示赛道资料，还会带出更完整的赛事信息与周末状态\n• 积分榜数据源已经独立拆分，后续不管是手动维护、远程 JSON，还是再接自动更新接口，都不需要重写积分榜界面本身\n• 赛前预测小游戏正式接入赛历模块：可以直接预测这一站的杆位、冠军和领奖台，结果会跟随对应分站一起展示\n• 预测提交后会直接锁定进本地数据，比赛周开始后自动封盘；完赛后系统会按结果自动结算围场币奖励 🏁"
    }
];
let mediaNewsItems = [
    { id: 1, source: "PA Media", sourceIcon: "PA", title: "维斯塔潘比赛工程师GP确认2028年加盟迈凯伦，四冠王F1未来再生变数", summary: "维斯塔潘的长期比赛工程师詹皮耶罗·兰比亚斯（GP）已确认将在2028年合同到期后加盟迈凯伦，担任首席比赛官。此举引发了对维斯塔潘可能提前告别F1的广泛猜测。[reference:0][reference:1]", url: "https://www.bernama.com/en/world/news.php?id=2543059", timestamp: "2026-04-09T10:00:00Z" },
    { id: 2, source: "搜狐体育", sourceIcon: "SS", title: "FIA紧急召开会议，计划调整2026混动规则以解决车速差问题", summary: "针对新规下赛车功率不稳及最高70公里时速差问题，FIA已召开紧急会议。计划通过限制排位赛电机功率或调整能量回收策略进行修复，最终方案预计于4月20日敲定。[reference:2]", url: "https://www.sohu.com/a/1008076289_114760", timestamp: "2026-04-11T01:56:00Z" },
    { id: 3, source: "澎湃新闻", sourceIcon: "PP", title: "安东内利日本站再夺杆位，梅赛德斯强势包揽头排", summary: "2026赛季F1日本大奖赛排位赛，梅赛德斯车手安东内利延续强势表现，背靠背夺得杆位。队友拉塞尔排名第二，帮助车队实现头排发车。[reference:3]", url: "https://www.thepaper.cn/newsDetail_forward_32851868", timestamp: "2026-04-01T06:18:00Z" },
    { id: 4, source: "Motorsport.com", sourceIcon: "MS", title: "瓦塞尔：迈阿密站将成'新赛季'起点，各队将疯狂升级", summary: "法拉利领队瓦塞尔表示，因巴林和沙特站取消而迎来的五周休整期，将使各队在五月初的迈阿密大奖赛推出重大升级，这将是'新赛季'的起点。[reference:4]", url: "https://www.motorsport.com/f1/news/why-miami-will-be-the-start-of-a-new-f1-championship-as-teams-push-like-crazy/10810302/", timestamp: "2026-04-01T06:30:00Z" },
    { id: 5, source: "PlanetF1", sourceIcon: "PF", title: "FIA确认召开系列会议，讨论2026规则'微调'", summary: "FIA确认已召开系列会议，讨论2026年F1规则的优化方案。会议聚焦'能量管理'等'困难议题'，旨在对现有规则进行'微调'，后续会议将持续至4月下旬。[reference:5]", url: "https://www.planetf1.com/news/fia-f1-2026-meeting-agenda", timestamp: "2026-04-10T09:30:00Z" },
    { id: 6, source: "GPblog", sourceIcon: "GP", title: "汉密尔顿完成两天雨胎测试，梅赛德斯与迈凯伦将接力", summary: "汉密尔顿在法拉利菲奥拉诺赛道完成了为期两天的倍耐力雨胎测试，总里程达884公里。梅赛德斯与迈凯伦也计划于4月14-15日在纽博格林进行干地测试。[reference:6][reference:7]", url: "https://www.gpblog.com/en/news/lewis-hamilton-completes-wet-weather-pirelli-test-at-ferraris-fiorano-track", timestamp: "2026-04-10T13:00:00Z" },
    { id: 7, source: "Crash.net", sourceIcon: "CN", title: "五周休整期谁是赢家？迈凯伦与法拉利升级或威胁梅奔优势", summary: "巴林与沙特站取消带来五周休整期。分析指出，这给了迈凯伦和法拉利推出重大升级的机会，可能打破梅赛德斯赛季初的统治地位，其中迈凯伦的升级尤其值得关注。[reference:8][reference:9]", url: "https://www.crash.net/f1/feature/1068247/1/biggest-winners-and-losers-f1s-surprise-fiveweek-break", timestamp: "2026-04-10T11:00:00Z" },
    { id: 8, source: "新华社", sourceIcon: "XH", title: "F1中国大奖赛落幕，维斯塔潘夺冠周冠宇主场完赛", summary: "2026赛季F1中国大奖赛正赛在上海国际赛车场落幕。红牛车手维斯塔潘轻松夺冠，中国车手周冠宇从第16位发车，最终以第14名完赛。[reference:10]", url: "https://app.xinhuanet.com/news/article.html?articleId=685797cd4ea225b704887ca6bf350b25", timestamp: "2026-03-16T09:42:00Z" },
    { id: 9, source: "Motorsport.com", sourceIcon: "MS", title: "安东内利成最年轻积分领跑者，梅赛德斯车队优势明显", summary: "随着安东内利在日本大奖赛连续第二场夺冠，20岁的意大利小将成为F1历史上最年轻的积分榜领跑者，目前以72分领先队友拉塞尔9分。梅赛德斯在车队积分榜上领先法拉利45分。[reference:11]", url: "https://www.motorsport.com/f1/news/championship-antonelli-is-the-youngest-leader/10809324/", timestamp: "2026-03-29T10:00:00Z" }
];

// 挂载到 window 对象，供主脚本使用
window.TEAM_COLORS = TEAM_COLORS;
window.DRIVERS = DRIVERS;
window.DRIVER_PROFILES = DRIVER_PROFILES;
window.teamStandings = teamStandings;
window.driverStandings = driverStandings;
const DATE_SCENES_UI = [
    { id: "beach", name: "海边漫步", iconKey: "palm", desc: "夕阳下的沙滩，海浪轻拍" },
    { id: "restaurant", name: "晚餐约会", iconKey: "wine", desc: "灯光昏黄的餐厅，氛围刚刚好" },
    { id: "paddock", name: "围场参观", iconKey: "wheel", desc: "近距离感受赛车，私密导览" }
];
window.DATE_SCENES = DATE_SCENES_UI;
window.F1_CALENDAR = F1_CALENDAR;
window.ANNOUNCEMENTS = ANNOUNCEMENTS.map(item => ({ ...item }));
window.mediaNewsItems = mediaNewsItems;
