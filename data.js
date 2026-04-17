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

const DRIVERS = [
    { id: "nor", name: "Lando Norris", team: "迈凯伦", avatarLetter: "LN", handle: "landonorris", initialMsg: "新赛季终于开始了。卫冕听起来很酷，但我更在意的是把每个周末都跑得足够好。规则变了不少，不过我们已经准备好了。你觉得今年会是什么走向？" },
    { id: "pia", name: "Oscar Piastri", team: "迈凯伦", avatarLetter: "OP", handle: "oscarpiastri", initialMsg: "新赛季，新规则，我和 Lando 还会继续并肩作战。去年离世界冠军只差一点，今年我当然想再往前走一步。先看看这个赛季会把我们带到哪里吧。" },
    { id: "lec", name: "Charles Leclerc", team: "法拉利", avatarLetter: "CL", handle: "charles_leclerc", initialMsg: "新赛季开始了，赛车给我的感觉很不错。和 Lewis 搭档来到第二年，很多东西都比以前更顺了。我很期待这个赛季，也很想知道你最关注什么。" },
    { id: "ham", name: "Lewis Hamilton", team: "法拉利", avatarLetter: "LH", handle: "lewishamilton", initialMsg: "来到法拉利的第二年，我的状态比刚开始时更稳定，也更自在了。这台车还在继续进化，我也一样。接下来会很有意思，你可以和我聊聊你对这个赛季的期待。" },
    { id: "rus", name: "George Russell", team: "梅赛德斯", avatarLetter: "GR", handle: "georgerussell63", initialMsg: "欢迎来到新赛季。我和 Kimi 的配合比之前更顺，车队这个冬天也做了很多扎实的工作。现在最重要的是把这些东西兑现到赛道上。你怎么看今年的竞争格局？" },
    { id: "ant", name: "Kimi Antonelli", team: "梅赛德斯", avatarLetter: "KA", handle: "kimi.antonelli", initialMsg: "第二个 F1 赛季开始之后，我整个人确实更放松了一点。之前拿到领奖台让我更确定自己能做到什么，现在目标当然是继续往前。希望今年能给大家带来更多惊喜。" },
    { id: "ver", name: "Max Verstappen", team: "红牛", avatarLetter: "MV", handle: "maxverstappen1", initialMsg: "新规则就是新的挑战，仅此而已。和新的队友合作也意味着要重新建立一些节奏，不过这没什么。车还是要开，比赛还是要赢。你要是愿意，可以直接告诉我你最想看什么。" },
    { id: "hadjar", name: "Isack Hadjar", team: "红牛", avatarLetter: "IH", handle: "isack.hadjar", initialMsg: "终于正式来到红牛了，说不紧张肯定是假的，但更多还是兴奋。和 Max 做队友的压力很真实，不过我也很清楚自己为什么会站在这里。接下来我会一步一步证明自己。" },
    { id: "alo", name: "Fernando Alonso", team: "阿斯顿马丁", avatarLetter: "FA", handle: "fernandoalo_oficial", initialMsg: "来到第 23 个赛季，我还是会对新的挑战有感觉。经验当然重要，但真正让我留在这里的，还是那种想继续往前的念头。只要赛车还有潜力，我就不会轻易停下。" },
    { id: "str", name: "Lance Stroll", team: "阿斯顿马丁", avatarLetter: "LS", handle: "lance.stroll", initialMsg: "第十个 F1 赛季了，时间过得确实很快。和 Fernando 继续搭档让我学到了很多，车队也还在一点点往前推。希望今年能把一些该拿到的结果真正拿回来。" },
    { id: "alb", name: "Alex Albon", team: "威廉姆斯", avatarLetter: "AA", handle: "alex.albon", initialMsg: "欢迎来到威廉姆斯。今年和 Carlos 一起搭档，我对很多事情都挺期待的。车队这段时间一直在努力把节奏拉回正轨，现在就是看看我们能把它带到什么位置。" },
    { id: "sai", name: "Carlos Sainz", team: "威廉姆斯", avatarLetter: "CS", handle: "carlossainz55", initialMsg: "加入威廉姆斯以后，我能很明显感觉到这支车队想往前走的决心。重建从来都不是一句好听的话，而是很多具体又耐心的工作。我会把自己该做的部分做到最好。" },
    { id: "gas", name: "Pierre Gasly", team: "Alpine", avatarLetter: "PG", handle: "pierre.gasly", initialMsg: "Alpine 今年又是新的开始。车队做了不少调整，我和 Franco 也在慢慢把配合找出来。赛季会很长，所以我更在意的是每一站都能不能比上一站更好一点。" },
    { id: "col", name: "Franco Colapinto", team: "Alpine", avatarLetter: "FC", handle: "franco.colapinto", initialMsg: "第二个 F1 赛季开始之后，我的感觉和去年已经很不一样了。很多东西不再只是新鲜，而是真的要去扛起来。和 Pierre 一起，我想帮车队带回更多像样的结果。" },
    { id: "oco", name: "Esteban Ocon", team: "哈斯", avatarLetter: "EO", handle: "esteban.ocon", initialMsg: "哈斯的新赛季已经开始了。车队现在最重要的事还是稳稳往前走，把该抓住的机会抓住。和 Oliver 一起搭档会是新的节奏，我希望今年能把表现再往上提一截。" },
    { id: "bea", name: "Oliver Bearman", team: "哈斯", avatarLetter: "OB", handle: "oliver.bearman", initialMsg: "第二个 F1 赛季让我感觉踏实了不少。很多去年还在适应的东西，现在终于开始有了熟悉感。接下来我还是想继续成长，然后把积分一点点争回来。" },
    { id: "hul", name: "Nico Hulkenberg", team: "奥迪", avatarLetter: "NH", handle: "nico.hulkenberg", initialMsg: "奥迪正式进入 F1，这对很多人来说都是一件大事。对我而言，这也是一段很有分量的新篇章。把一支全新的项目真正带上正轨，会是很难但也很值得的挑战。" },
    { id: "bor", name: "Gabriel Bortoleto", team: "奥迪", avatarLetter: "GB", handle: "gabriel.bortoleto", initialMsg: "和奥迪一起进入第二个赛季，我心里还是会有那种很新的期待。巴西车迷给了我很多力量，但最后还是要回到赛道上把事情做好。希望今年我能比去年更成熟一点。" },
    { id: "law", name: "Liam Lawson", team: "Racing Bulls", avatarLetter: "LL", handle: "liam.lawson", initialMsg: "继续留在 Racing Bulls，对我来说最重要的就是把位置坐稳，然后把该跑出来的东西跑出来。和 Arvid 搭档会有新的化学反应，车队也在继续往前。这个赛季会很有看头。" },
    { id: "lin", name: "Arvid Lindblad", team: "Racing Bulls", avatarLetter: "AL", handle: "arvid.lindblad", initialMsg: "这是我的 F1 新秀赛季，到现在还是会觉得一切有点不真实。能走到这一步，我当然很兴奋，但真正开始之后就只剩下专注了。我会尽全力把每一次机会都用好。" },
    { id: "per", name: "Sergio Perez", team: "凯迪拉克", avatarLetter: "SP", handle: "sergio.perez", initialMsg: "重新回到围场的感觉很好，而且这次还是和一支全新的车队一起开始。凯迪拉克有很大的野心，也有很多事情要一步步搭起来。我喜欢这样的挑战，也想把这段路走漂亮一点。" },
    { id: "bot", name: "Valtteri Bottas", team: "凯迪拉克", avatarLetter: "VB", handle: "valtteri.bottas", initialMsg: "凯迪拉克的 F1 元年，听起来就已经很有分量了。从零开始搭一支车队当然不轻松，但这也是这件事最有意思的地方。我们有很多工作要做，不过我还挺享受这种过程的。" }
];

const DRIVER_PROFILES = {
    "nor": { fullName:"Lando Norris", team:"迈凯伦车队", nationality:"英国", birthDate:"1999年11月13日", age:27, height:"177 cm", weight:"64 kg", f1Debut:"2019年澳大利亚大奖赛", championships:[{year:2025,desc:"迈凯伦车队，生涯首个世界冠军"}], wins:[{year:2024,race:"迈阿密大奖赛",desc:"F1生涯首胜"}], totalWins:11, totalPoles:8, totalPodiums:28 },
    "pia": { fullName:"Oscar Piastri", team:"迈凯伦车队", nationality:"澳大利亚", birthDate:"2001年4月6日", age:25, height:"178 cm", weight:"68 kg", f1Debut:"2023年巴林大奖赛", championships:[], wins:[{year:2024,race:"匈牙利大奖赛",desc:"F1生涯首胜"}], totalWins:3, totalPoles:1, totalPodiums:9 },
    "lec": { fullName:"Charles Leclerc", team:"法拉利车队", nationality:"摩纳哥", birthDate:"1997年10月16日", age:29, height:"180 cm", weight:"62 kg", f1Debut:"2018年澳大利亚大奖赛", championships:[], wins:[{year:2019,race:"比利时大奖赛",desc:"F1生涯首胜"},{year:2019,race:"意大利大奖赛",desc:"蒙扎主场夺冠"},{year:2024,race:"摩纳哥大奖赛",desc:"主场首冠"}], totalWins:8, totalPoles:23, totalPodiums:38 },
    "ham": { fullName:"Lewis Hamilton", team:"法拉利车队", nationality:"英国", birthDate:"1985年1月7日", age:41, height:"175 cm", weight:"66 kg", f1Debut:"2007年澳大利亚大奖赛", championships:[{year:2008,desc:"迈凯伦车队"},{year:2014,desc:"梅赛德斯车队"},{year:2015,desc:"梅赛德斯车队"},{year:2017,desc:"梅赛德斯车队"},{year:2018,desc:"梅赛德斯车队"},{year:2019,desc:"梅赛德斯车队"},{year:2020,desc:"梅赛德斯车队"}], wins:[{year:2007,race:"加拿大大奖赛",desc:"F1生涯首胜"},{year:2019,race:"中国大奖赛",desc:"F1历史第1000站冠军"}], totalWins:103, totalPoles:104, totalPodiums:197 },
    "rus": { fullName:"George Russell", team:"梅赛德斯车队", nationality:"英国", birthDate:"1998年2月15日", age:28, height:"185 cm", weight:"66 kg", f1Debut:"2019年澳大利亚大奖赛", championships:[], wins:[{year:2022,race:"巴西大奖赛",desc:"F1生涯首胜"}], totalWins:3, totalPoles:4, totalPodiums:14 },
    "ant": { fullName:"Kimi Antonelli", team:"梅赛德斯车队", nationality:"意大利", birthDate:"2006年8月25日", age:20, height:"172 cm", weight:"63 kg", f1Debut:"2025年澳大利亚大奖赛", championships:[], wins:[{year:2026,race:"中国大奖赛",desc:"F1生涯首胜"}], totalWins:2, totalPoles:1, totalPodiums:5 },
    "ver": { fullName:"Max Verstappen", team:"红牛车队", nationality:"荷兰", birthDate:"1997年9月30日", age:29, height:"181 cm", weight:"72 kg", f1Debut:"2015年澳大利亚大奖赛", championships:[{year:2021,desc:"红牛车队"},{year:2022,desc:"红牛车队"},{year:2023,desc:"红牛车队"},{year:2024,desc:"红牛车队"}], wins:[{year:2016,race:"西班牙大奖赛",desc:"F1生涯首胜"}], totalWins:63, totalPoles:40, totalPodiums:112 },
    "hadjar": { fullName:"Isack Hadjar", team:"红牛车队", nationality:"法国", birthDate:"2004年9月28日", age:22, height:"178 cm", weight:"65 kg", f1Debut:"2025年澳大利亚大奖赛", championships:[], wins:[], totalWins:0, totalPoles:0, totalPodiums:0 },
    "alo": { fullName:"Fernando Alonso", team:"阿斯顿·马丁车队", nationality:"西班牙", birthDate:"1981年7月29日", age:45, height:"171 cm", weight:"68 kg", f1Debut:"2001年澳大利亚大奖赛", championships:[{year:2005,desc:"雷诺车队"},{year:2006,desc:"雷诺车队"}], wins:[{year:2003,race:"匈牙利大奖赛",desc:"F1生涯首胜"}], totalWins:32, totalPoles:22, totalPodiums:106 },
    "str": { fullName:"Lance Stroll", team:"阿斯顿·马丁车队", nationality:"加拿大", birthDate:"1998年10月29日", age:28, height:"182 cm", weight:"70 kg", f1Debut:"2017年澳大利亚大奖赛", championships:[], wins:[], totalWins:0, totalPoles:1, totalPodiums:3 },
    "alb": { fullName:"Alexander Albon", team:"威廉姆斯车队", nationality:"泰国", birthDate:"1996年3月23日", age:30, height:"186 cm", weight:"74 kg", f1Debut:"2019年澳大利亚大奖赛", championships:[], wins:[], totalWins:0, totalPoles:0, totalPodiums:2 },
    "sai": { fullName:"Carlos Sainz", team:"威廉姆斯车队", nationality:"西班牙", birthDate:"1994年9月1日", age:32, height:"178 cm", weight:"68 kg", f1Debut:"2015年澳大利亚大奖赛", championships:[], wins:[{year:2022,race:"英国大奖赛",desc:"F1生涯首胜"}], totalWins:2, totalPoles:5, totalPodiums:18 },
    "gas": { fullName:"Pierre Gasly", team:"Alpine车队", nationality:"法国", birthDate:"1996年2月7日", age:30, height:"177 cm", weight:"70 kg", f1Debut:"2017年马来西亚大奖赛", championships:[], wins:[{year:2020,race:"意大利大奖赛",desc:"F1生涯首胜"}], totalWins:1, totalPoles:0, totalPodiums:4 },
    "col": { fullName:"Franco Colapinto", team:"Alpine车队", nationality:"阿根廷", birthDate:"2003年5月27日", age:23, height:"176 cm", weight:"68 kg", f1Debut:"2024年意大利大奖赛", championships:[], wins:[], totalWins:0, totalPoles:0, totalPodiums:0 },
    "oco": { fullName:"Esteban Ocon", team:"哈斯车队", nationality:"法国", birthDate:"1996年9月17日", age:30, height:"186 cm", weight:"66 kg", f1Debut:"2016年比利时大奖赛", championships:[], wins:[{year:2021,race:"匈牙利大奖赛",desc:"F1生涯首胜"}], totalWins:1, totalPoles:0, totalPodiums:3 },
    "bea": { fullName:"Oliver Bearman", team:"哈斯车队", nationality:"英国", birthDate:"2005年5月8日", age:21, height:"178 cm", weight:"65 kg", f1Debut:"2025年澳大利亚大奖赛", championships:[], wins:[], totalWins:0, totalPoles:0, totalPodiums:0 },
    "hul": { fullName:"Nico Hulkenberg", team:"奥迪车队", nationality:"德国", birthDate:"1987年8月19日", age:39, height:"184 cm", weight:"78 kg", f1Debut:"2010年巴林大奖赛", championships:[], wins:[], totalWins:0, totalPoles:1, totalPodiums:1 },
    "bor": { fullName:"Gabriel Bortoleto", team:"奥迪车队", nationality:"巴西", birthDate:"2004年10月14日", age:22, height:"175 cm", weight:"65 kg", f1Debut:"2025年澳大利亚大奖赛", championships:[], wins:[], totalWins:0, totalPoles:0, totalPodiums:0 },
    "law": { fullName:"Liam Lawson", team:"Racing Bulls车队", nationality:"新西兰", birthDate:"2002年2月11日", age:24, height:"175 cm", weight:"65 kg", f1Debut:"2023年荷兰大奖赛", championships:[], wins:[], totalWins:0, totalPoles:0, totalPodiums:0 },
    "lin": { fullName:"Arvid Lindblad", team:"Racing Bulls车队", nationality:"瑞典", birthDate:"2007年8月8日", age:19, height:"175 cm", weight:"65 kg", f1Debut:"2026年澳大利亚大奖赛", championships:[], wins:[], totalWins:0, totalPoles:0, totalPodiums:0 },
    "per": { fullName:"Sergio Perez", team:"凯迪拉克车队", nationality:"墨西哥", birthDate:"1990年1月26日", age:36, height:"173 cm", weight:"66 kg", f1Debut:"2011年澳大利亚大奖赛", championships:[], wins:[{year:2020,race:"萨基尔大奖赛",desc:"F1生涯首胜"},{year:2021,race:"阿塞拜疆大奖赛",desc:"巴库冠军"},{year:2022,race:"摩纳哥大奖赛",desc:"摩纳哥冠军"},{year:2022,race:"新加坡大奖赛",desc:"新加坡冠军"}], totalWins:6, totalPoles:1, totalPodiums:39 },
    "bot": { fullName:"Valtteri Bottas", team:"凯迪拉克车队", nationality:"芬兰", birthDate:"1989年8月28日", age:37, height:"173 cm", weight:"69 kg", f1Debut:"2013年澳大利亚大奖赛", championships:[], wins:[{year:2017,race:"俄罗斯大奖赛",desc:"F1生涯首胜"},{year:2017,race:"阿布扎比大奖赛",desc:"赛季收官战冠军"}], totalWins:10, totalPoles:20, totalPodiums:67 }
};

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
    { round: 4, date: "4月10-12日", gp: "巴林大奖赛", location: "萨基尔赛道", sprint: false },
    { round: 5, date: "4月17-19日", gp: "沙特阿拉伯大奖赛", location: "吉达街道赛道", sprint: false },
    { round: 6, date: "5月1-3日", gp: "迈阿密大奖赛", location: "迈阿密国际赛车场", sprint: true },
    { round: 7, date: "5月22-24日", gp: "加拿大大奖赛", location: "蒙特利尔", sprint: true },
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
    { version: "v4.0.0", content: "💻 电脑端桌面化升级 & 资料卡证件化\n• 类电脑端聊天界面与桌面化样式全面优化，操作更接近原生桌面应用\n• 手机端聊天小窗显示与顶部栏隐藏问题修复，沉浸体验更佳\n• 约会页输入框贴底与聊天面板化调整，输入更顺手\n• 接入本地 drivers/{id}.jpg 初始头像，无需网络即可显示\n• 资料卡头像更换/重置交互优化，操作更直观\n• 车手资料卡重构为证件卡样式，加入2026车手编号底图，更具收藏感 🏁" },
    { version: "v3.9.0", content: "📝 新增「关系日记」系统 & 角色表现升级\n• 车手资料卡新增精致「日记」按钮，可按日期查看和编辑关系日记\n• 支持基于当日聊天记录一键调用 AI 生成今日日记，生成后可手动二次润色\n• 日记内容已与聊天记忆、约会记忆互通，车手后续会更清楚你们的关系与经历\n• 全局 UI 再次精修：资料卡细节、主题按钮与整体质感进一步统一\n• 11 支车队主题配色重新校准，整体观感更和谐、更自然、更贴近 F1 气质\n• 优化车手输出文风：回复更细腻、更像真人，也更符合每位车手的独特性格 🏁" }
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
window.DATE_SCENES = DATE_SCENES;
window.F1_CALENDAR = F1_CALENDAR;
window.ANNOUNCEMENTS = ANNOUNCEMENTS;
window.mediaNewsItems = mediaNewsItems;
