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
    { id: "nor", name: "Lando Norris", team: "迈凯伦", avatarLetter: "LN", handle: "landonorris", initialMsg: "Yo！卫冕冠军的新赛季开始了，Papaya军团已经准备好再次冲击总冠军！今年规则大改，但我们有信心。你们觉得我能卫冕吗？🧡" },
    { id: "pia", name: "Oscar Piastri", team: "迈凯伦", avatarLetter: "OP", handle: "oscarpiastri", initialMsg: "嘿！新赛季新规则，我和Lando继续并肩作战。去年离世界冠军就差一步，今年我要更进一步！澳大利亚人从不退缩。🇦🇺" },
    { id: "lec", name: "Charles Leclerc", team: "法拉利", avatarLetter: "CL", handle: "charles_leclerc", initialMsg: "Ciao！新赛季开始，SF-26感觉非常棒。和Lewis并肩作战的第二年，我们越来越默契。Forza Ferrari！让我们一起战斗吧！🐎" },
    { id: "ham", name: "Lewis Hamilton", team: "法拉利", avatarLetter: "LH", handle: "lewishamilton", initialMsg: "Ciao ragazzi！法拉利生涯第二年，我感觉前所未有的自在。SF-26和我完全融合。让我们一起创造历史，Forza Ferrari！✊🏾" },
    { id: "rus", name: "George Russell", team: "梅赛德斯", avatarLetter: "GR", handle: "georgerussell63", initialMsg: "欢迎来到新赛季！我和Kimi的搭档越来越默契。车队在冬季做了大量工作，我们期待重返巅峰。聊聊你对今年的预测？💪" },
    { id: "ant", name: "Kimi Antonelli", team: "梅赛德斯", avatarLetter: "KA", handle: "kimi.antonelli", initialMsg: "Hey！第二年F1生涯，我感觉更自在了。澳大利亚站我已经登上了领奖台，目标是今年拿到第一场胜利！🇮🇹🏆" },
    { id: "ver", name: "Max Verstappen", team: "红牛", avatarLetter: "MV", handle: "maxverstappen1", initialMsg: "新规则带来新挑战，但我们Red Bull从不退缩。和Isack搭档是个新开始。Simply push，让我们一起战斗！👊" },
    { id: "hadjar", name: "Isack Hadjar", team: "红牛", avatarLetter: "IH", handle: "isack.hadjar", initialMsg: "Salut！终于迎来了我的红牛首秀。和Max做队友压力很大，但我会证明自己的价值。期待与大家分享我的旅程！🏎️" },
    { id: "alo", name: "Fernando Alonso", team: "阿斯顿马丁", avatarLetter: "FA", handle: "fernandoalo_oficial", initialMsg: "El Plan continues！第23个赛季，我依然充满斗志。和Lance一起，我们会把绿色赛车带向领奖台。Never give up！🏁" },
    { id: "str", name: "Lance Stroll", team: "阿斯顿马丁", avatarLetter: "LS", handle: "lance.stroll", initialMsg: "嘿，第十个F1赛季了！和Fernando搭档让我学到了很多。车队在不断进步，今年我们准备好了。聊聊你对新赛季的看法？🇨🇦" },
    { id: "alb", name: "Alex Albon", team: "威廉姆斯", avatarLetter: "AA", handle: "alex.albon", initialMsg: "Williams大家庭欢迎你！和Carlos搭档让我兴奋，车队正在重回正轨。让我们拭目以待！🇹🇭" },
    { id: "sai", name: "Carlos Sainz", team: "威廉姆斯", avatarLetter: "CS", handle: "carlossainz55", initialMsg: "Hola！威廉姆斯的新篇章让我充满期待。这支传奇车队正在重建，我会倾尽所有。Gracias por el apoyo！🎯" },
    { id: "gas", name: "Pierre Gasly", team: "Alpine", avatarLetter: "PG", handle: "pierre.gasly", initialMsg: "Salut！Alpine的新篇章。和Franco搭档，车队换了新的动力单元，期待今年的进步。C'est parti！💙" },
    { id: "col", name: "Franco Colapinto", team: "Alpine", avatarLetter: "FC", handle: "franco.colapinto", initialMsg: "¡Hola！第二个F1赛季，我已经准备好了。和Pierre一起，我们会为Alpine带回更多积分。Vamos！🇦🇷" },
    { id: "oco", name: "Esteban Ocon", team: "哈斯", avatarLetter: "EO", handle: "esteban.ocon", initialMsg: "Salut！哈斯的新赛季。和Oliver搭档，车队在稳步前进。期待今年能有更好的表现！💪" },
    { id: "bea", name: "Oliver Bearman", team: "哈斯", avatarLetter: "OB", handle: "oliver.bearman", initialMsg: "Hey！第二个F1赛季，我已经更适应了。在Haas继续成长，争取今年拿到更多积分。🇬🇧" },
    { id: "hul", name: "Nico Hulkenberg", team: "奥迪", avatarLetter: "NH", handle: "nico.hulkenberg", initialMsg: "Guten Tag！奥迪F1项目正式启航。作为德国车手，带领这支传奇品牌重返F1是我的荣幸。期待你的支持！🇩🇪" },
    { id: "bor", name: "Gabriel Bortoleto", team: "奥迪", avatarLetter: "GB", handle: "gabriel.bortoleto", initialMsg: "Olá！第二个赛季和Audi一起，巴西车迷给了我无限动力。期待今年能更进一步。🇧🇷" },
    { id: "law", name: "Liam Lawson", team: "Racing Bulls", avatarLetter: "LL", handle: "liam.lawson", initialMsg: "Kia ora！继续在Racing Bulls奋战，和Arvid搭档，车队在稳步前进。期待今年的表现！🇳🇿" },
    { id: "lin", name: "Arvid Lindblad", team: "Racing Bulls", avatarLetter: "AL", handle: "arvid.lindblad", initialMsg: "Hey！我的F1新秀赛季！能加入Racing Bulls是我的梦想，感谢红牛青训。我会全力以赴！🇸🇪" },
    { id: "per", name: "Sergio Perez", team: "凯迪拉克", avatarLetter: "SP", handle: "sergio.perez", initialMsg: "¡Hola！凯迪拉克开启了F1新篇章。回归围场的感觉真好，这支车队有伟大的愿景。让我们一起创造历史！🇲🇽" },
    { id: "bot", name: "Valtteri Bottas", team: "凯迪拉克", avatarLetter: "VB", handle: "valtteri.bottas", initialMsg: "Hei！凯迪拉克的F1元年。从零开始打造一支车队，这是难得的挑战。期待你的支持！🇫🇮" }
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
    { version: "v3.10.0", content: "🖥️ 电脑端适配 & 指令强化\n• 更新了电脑端适配的UI界面\n• 强化了指令，角色对上下文的衔接更自然，不会再像以前一样那么跳跃\n• 修复了一些已知的bug 🏁" },
    { version: "v3.9.0", content: "📝 新增「关系日记」系统 & 角色表现升级\n• 车手资料卡新增精致「日记」按钮，可按日期查看和编辑关系日记\n• 支持基于当日聊天记录一键调用 AI 生成今日日记，生成后可手动二次润色\n• 日记内容已与聊天记忆、约会记忆互通，车手后续会更清楚你们的关系与经历\n• 全局 UI 再次精修：资料卡细节、主题按钮与整体质感进一步统一\n• 11 支车队主题配色重新校准，整体观感更和谐、更自然、更贴近 F1 气质\n• 优化车手输出文风：回复更细腻、更像真人，也更符合每位车手的独特性格 🏁" },
    { version: "v3.8.0", content: "📜 新增「围场往日」板块\n• 点击顶部「往日」按钮，查看 F1 历史上的今天\n• 收录经典比赛、车手诞辰、传奇时刻等丰富内容\n• 带你重温 F1 的辉煌岁月，感受赛车历史的魅力！🏁" }
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
