// raceSession.js - 赛季数据与相关查询
window.f1RaceDatabase = {
    currentRound: 3,
    currentRaceName: "日本大奖赛",
    races: [
        {
            round: 1,
            name: "澳大利亚大奖赛",
            location: "墨尔本",
            date: "2026-03-08",
            sprint: false,
            status: "completed",
            qualifying: [
                { pos: 1, driver: "George Russell", team: "梅赛德斯", time: "1:25.234" },
                { pos: 2, driver: "Kimi Antonelli", team: "梅赛德斯", time: "1:25.412" },
                { pos: 3, driver: "Charles Leclerc", team: "法拉利", time: "1:25.687" },
                { pos: 4, driver: "Lewis Hamilton", team: "法拉利", time: "1:25.934" },
                { pos: 5, driver: "Lando Norris", team: "迈凯伦", time: "1:26.123" },
                { pos: 6, driver: "Oscar Piastri", team: "迈凯伦", time: "1:26.456" },
                { pos: 7, driver: "Oliver Bearman", team: "哈斯", time: "1:26.723" },
                { pos: 8, driver: "Pierre Gasly", team: "Alpine", time: "1:26.945" },
                { pos: 9, driver: "Max Verstappen", team: "红牛", time: "1:27.134" },
                { pos: 10, driver: "Liam Lawson", team: "Racing Bulls", time: "1:27.354" }
            ],
            race: [
                { pos: 1, driver: "George Russell", team: "梅赛德斯", points: 25 },
                { pos: 2, driver: "Kimi Antonelli", team: "梅赛德斯", points: 18 },
                { pos: 3, driver: "Charles Leclerc", team: "法拉利", points: 15 },
                { pos: 4, driver: "Lewis Hamilton", team: "法拉利", points: 12 },
                { pos: 5, driver: "Lando Norris", team: "迈凯伦", points: 10 },
                { pos: 6, driver: "Oscar Piastri", team: "迈凯伦", points: 8 },
                { pos: 7, driver: "Oliver Bearman", team: "哈斯", points: 6 },
                { pos: 8, driver: "Pierre Gasly", team: "Alpine", points: 4 },
                { pos: 9, driver: "Max Verstappen", team: "红牛", points: 2 },
                { pos: 10, driver: "Liam Lawson", team: "Racing Bulls", points: 1 }
            ]
        },
        {
            round: 2,
            name: "中国大奖赛",
            location: "上海",
            date: "2026-03-15",
            sprint: true,
            status: "completed",
            qualifying: [
                { pos: 1, driver: "Kimi Antonelli", team: "梅赛德斯", time: "1:25.892" },
                { pos: 2, driver: "George Russell", team: "梅赛德斯", time: "1:26.031" },
                { pos: 3, driver: "Charles Leclerc", team: "法拉利", time: "1:26.287" },
                { pos: 4, driver: "Lewis Hamilton", team: "法拉利", time: "1:26.534" },
                { pos: 5, driver: "Lando Norris", team: "迈凯伦", time: "1:26.712" },
                { pos: 6, driver: "Oscar Piastri", team: "迈凯伦", time: "1:26.945" },
                { pos: 7, driver: "Oliver Bearman", team: "哈斯", time: "1:27.123" },
                { pos: 8, driver: "Pierre Gasly", team: "Alpine", time: "1:27.354" },
                { pos: 9, driver: "Max Verstappen", team: "红牛", time: "1:27.586" },
                { pos: 10, driver: "Liam Lawson", team: "Racing Bulls", time: "1:27.798" }
            ],
            sprint: [
                { pos: 1, driver: "George Russell", team: "梅赛德斯", points: 8 },
                { pos: 2, driver: "Lewis Hamilton", team: "法拉利", points: 7 },
                { pos: 3, driver: "Charles Leclerc", team: "法拉利", points: 6 },
                { pos: 4, driver: "Lando Norris", team: "迈凯伦", points: 5 },
                { pos: 5, driver: "Oscar Piastri", team: "迈凯伦", points: 4 },
                { pos: 6, driver: "Kimi Antonelli", team: "梅赛德斯", points: 3 },
                { pos: 7, driver: "Oliver Bearman", team: "哈斯", points: 2 },
                { pos: 8, driver: "Pierre Gasly", team: "Alpine", points: 1 }
            ],
            race: [
                { pos: 1, driver: "Kimi Antonelli", team: "梅赛德斯", points: 25 },
                { pos: 2, driver: "George Russell", team: "梅赛德斯", points: 18 },
                { pos: 3, driver: "Lewis Hamilton", team: "法拉利", points: 15 },
                { pos: 4, driver: "Charles Leclerc", team: "法拉利", points: 12 },
                { pos: 5, driver: "Lando Norris", team: "迈凯伦", points: 10 },
                { pos: 6, driver: "Oscar Piastri", team: "迈凯伦", points: 8 },
                { pos: 7, driver: "Oliver Bearman", team: "哈斯", points: 6 },
                { pos: 8, driver: "Pierre Gasly", team: "Alpine", points: 4 }
            ]
        },
        {
            round: 3,
            name: "日本大奖赛",
            location: "铃鹿",
            date: "2026-03-29",
            sprint: false,
            status: "completed",
            qualifying: [
                { pos: 1, driver: "Kimi Antonelli", team: "Mercedes", time: "1:28.778" },
                { pos: 2, driver: "George Russell", team: "Mercedes", time: "1:29.076" },
                { pos: 3, driver: "Oscar Piastri", team: "McLaren", time: "1:29.132" },
                { pos: 4, driver: "Charles Leclerc", team: "Ferrari", time: "1:29.405" },
                { pos: 5, driver: "Lando Norris", team: "McLaren", time: "1:29.409" },
                { pos: 6, driver: "Lewis Hamilton", team: "Ferrari", time: "1:29.567" },
                { pos: 7, driver: "Pierre Gasly", team: "Alpine", time: "1:29.691" },
                { pos: 8, driver: "Isack Hadjar", team: "Red Bull Racing", time: "1:29.978" },
                { pos: 9, driver: "Gabriel Bortoleto", team: "Audi", time: "1:30.274" },
                { pos: 10, driver: "Arvid Lindblad", team: "Racing Bulls", time: "1:30.319" }
            ],
            race: [
                { pos: 1, driver: "Kimi Antonelli", team: "Mercedes", points: 25 },
                { pos: 2, driver: "Oscar Piastri", team: "McLaren", points: 18 },
                { pos: 3, driver: "Charles Leclerc", team: "Ferrari", points: 15 },
                { pos: 4, driver: "George Russell", team: "Mercedes", points: 12 },
                { pos: 5, driver: "Lando Norris", team: "McLaren", points: 10 },
                { pos: 6, driver: "Lewis Hamilton", team: "Ferrari", points: 8 },
                { pos: 7, driver: "Pierre Gasly", team: "Alpine", points: 6 },
                { pos: 8, driver: "Max Verstappen", team: "Red Bull Racing", points: 4 },
                { pos: 9, driver: "Liam Lawson", team: "Racing Bulls", points: 2 },
                { pos: 10, driver: "Esteban Ocon", team: "Haas F1 Team", points: 1 },
                { pos: 11, driver: "Nico Hulkenberg", team: "Audi", points: 0 },
                { pos: 12, driver: "Isack Hadjar", team: "Red Bull Racing", points: 0 },
                { pos: 13, driver: "Gabriel Bortoleto", team: "Audi", points: 0 },
                { pos: 14, driver: "Arvid Lindblad", team: "Racing Bulls", points: 0 },
                { pos: 15, driver: "Carlos Sainz", team: "Williams", points: 0 },
                { pos: 16, driver: "Franco Colapinto", team: "Alpine", points: 0 },
                { pos: 17, driver: "Sergio Perez", team: "Cadillac", points: 0 },
                { pos: 18, driver: "Fernando Alonso", team: "Aston Martin", points: 0 },
                { pos: 19, driver: "Valtteri Bottas", team: "Cadillac", points: 0 },
                { pos: 20, driver: "Alexander Albon", team: "Williams", points: 0 },
                { pos: "NC", driver: "Lance Stroll", team: "Aston Martin", points: 0 },
                { pos: "NC", driver: "Oliver Bearman", team: "Haas F1 Team", points: 0 }
            ]
        },
        {
            round: 4,
            name: "迈阿密大奖赛",
            location: "迈阿密",
            date: "2026-05-03",
            sprint: true,
            status: "upcoming"
        }
    ]
};
var f1RaceDatabase = window.f1RaceDatabase;

function getDriverRaceResult(driverName, round) {
    const race = window.f1RaceDatabase.races.find(r => r.round === round);
    if (!race) return null;
    const result = {};
    if (race.qualifying) {
        const qualResult = race.qualifying.find(r => r.driver.includes(driverName) || driverName.includes(r.driver.split(' ')[0]));
        if (qualResult) result.qualifying = qualResult.pos;
    }
    if (race.sprint) {
        const sprintResult = race.sprint.find(r => r.driver.includes(driverName) || driverName.includes(r.driver.split(' ')[0]));
        if (sprintResult) {
            result.sprint = { pos: sprintResult.pos, points: sprintResult.points };
        }
    }
    if (race.race) {
        const raceResult = race.race.find(r => r.driver.includes(driverName) || driverName.includes(r.driver.split(' ')[0]));
        if (raceResult) {
            result.race = { pos: raceResult.pos, points: raceResult.points };
        }
    }
    return Object.keys(result).length > 0 ? result : null;
}

function getDriverSeasonSummary(driverName) {
    let totalPoints = 0;
    let wins = 0;
    let podiums = 0;
    const raceResults = [];
    for (let race of window.f1RaceDatabase.races) {
        if (race.status !== "completed") break;
        const raceResult = race.race?.find(r => r.driver.includes(driverName) || driverName.includes(r.driver.split(' ')[0]));
        if (raceResult) {
            totalPoints += raceResult.points;
            raceResults.push({ round: race.round, name: race.name, position: raceResult.pos, points: raceResult.points });
            if (raceResult.pos === 1) wins++;
            if (raceResult.pos <= 3) podiums++;
        }
    }
    return { totalPoints, wins, podiums, races: raceResults };
}

function initRaceSessionData() {
    window.raceSessionData = {
        currentRound: 3,
        qualifying: {
            round: "日本站 排位赛",
            date: "2026-03-28",
            location: "铃鹿",
            top10: [
                { pos: 1, driver: "安东内利（Kimi Antonelli）", team: "Mercedes", time: "1:28.778" },
                { pos: 2, driver: "罗素（George Russell）", team: "Mercedes", time: "1:29.076" },
                { pos: 3, driver: "皮亚斯特里（Oscar Piastri）", team: "McLaren", time: "1:29.132" },
                { pos: 4, driver: "勒克莱尔（Charles Leclerc）", team: "Ferrari", time: "1:29.405" },
                { pos: 5, driver: "诺里斯（Lando Norris）", team: "McLaren", time: "1:29.409" },
                { pos: 6, driver: "汉密尔顿（Lewis Hamilton）", team: "Ferrari", time: "1:29.567" },
                { pos: 7, driver: "加斯利（Pierre Gasly）", team: "Alpine", time: "1:29.691" },
                { pos: 8, driver: "哈贾尔（Isack Hadjar）", team: "Red Bull Racing", time: "1:29.978" },
                { pos: 9, driver: "博托莱托（Gabriel Bortoleto）", team: "Audi", time: "1:30.274" },
                { pos: 10, driver: "林德布拉德（Arvid Lindblad）", team: "Racing Bulls", time: "1:30.319" }
            ]
        },
        sprint: {
            round: "日本站 无冲刺赛",
            date: "2026-03-28",
            distance: "N/A",
            top10: []
        },
        race: {
            round: "日本站 正赛",
            date: "2026-03-29",
            distance: "307km",
            status: "已完成",
            gridOrder: [],   // ✅ 添加缺失的 gridOrder 属性
            raceResult: [
                { pos: 1, driver: "安东内利（Kimi Antonelli）", team: "梅赛德斯", points: 25 },
                { pos: 2, driver: "皮亚斯特里（Oscar Piastri）", team: "迈凯伦", points: 18 },
                { pos: 3, driver: "勒克莱尔（Charles Leclerc）", team: "法拉利", points: 15 },
                { pos: 4, driver: "拉塞尔（George Russell）", team: "梅赛德斯", points: 12 },
                { pos: 5, driver: "诺里斯（Lando Norris）", team: "迈凯伦", points: 10 },
                { pos: 6, driver: "汉密尔顿（Lewis Hamilton）", team: "法拉利", points: 8 },
                { pos: 7, driver: "加斯利（Pierre Gasly）", team: "Alpine", points: 6 },
                { pos: 8, driver: "维斯塔潘（Max Verstappen）", team: "红牛", points: 4 },
                { pos: 9, driver: "劳森（Liam Lawson）", team: "Racing Bulls", points: 2 },
                { pos: 10, driver: "奥康（Esteban Ocon）", team: "哈斯", points: 1 },
                { pos: 11, driver: "霍肯伯格（Nico Hulkenberg）", team: "Audi", points: 0 },
                { pos: 12, driver: "哈贾尔（Isack Hadjar）", team: "红牛", points: 0 },
                { pos: 13, driver: "博托莱托（Gabriel Bortoleto）", team: "Audi", points: 0 },
                { pos: 14, driver: "林德布拉德（Arvid Lindblad）", team: "Racing Bulls", points: 0 },
                { pos: 15, driver: "塞恩斯（Carlos Sainz）", team: "威廉姆斯", points: 0 },
                { pos: 16, driver: "科拉平托（Franco Colapinto）", team: "Alpine", points: 0 },
                { pos: 17, driver: "佩雷兹（Sergio Perez）", team: "凯迪拉克", points: 0 },
                { pos: 18, driver: "阿隆索（Fernando Alonso）", team: "阿斯顿马丁", points: 0 },
                { pos: 19, driver: "博塔斯（Valtteri Bottas）", team: "凯迪拉克", points: 0 },
                { pos: 20, driver: "阿尔本（Alexander Albon）", team: "威廉姆斯", points: 0 },
                { pos: "NC", driver: "斯特罗尔（Lance Stroll）", team: "阿斯顿马丁", points: 0 },
                { pos: "NC", driver: "贝尔曼（Oliver Bearman）", team: "哈斯", points: 0 }
            ]
        },   // ✅ 这里必须有逗号！
        seasonStandings: {
            drivers: [
                { pos: 1, name: "安东内利（Kimi Antonelli）", team: "梅赛德斯", points: 72, wins: 2 },
                { pos: 2, name: "罗素（George Russell）", team: "梅赛德斯", points: 63, wins: 1 },
                { pos: 3, name: "勒克莱尔（Charles Leclerc）", team: "法拉利", points: 49, wins: 0 },
                { pos: 4, name: "汉密尔顿（Lewis Hamilton）", team: "法拉利", points: 41, wins: 0 },
                { pos: 5, name: "诺里斯（Lando Norris）", team: "迈凯伦", points: 25, wins: 0 },
                { pos: 6, name: "皮亚斯特里（Oscar Piastri）", team: "迈凯伦", points: 21, wins: 0 },
                { pos: 7, name: "贝尔曼（Oliver Bearman）", team: "哈斯", points: 17, wins: 0 },
                { pos: 8, name: "加斯利（Pierre Gasly）", team: "Alpine", points: 15, wins: 0 },
                { pos: 9, name: "维斯塔潘（Max Verstappen）", team: "红牛", points: 12, wins: 0 },
                { pos: 10, name: "劳森（Liam Lawson）", team: "Racing Bulls", points: 10, wins: 0 },
                { pos: 11, name: "林德布拉德（Arvid Lindblad）", team: "Racing Bulls", points: 4, wins: 0 },
                { pos: 12, name: "哈贾尔（Isack Hadjar）", team: "红牛", points: 4, wins: 0 },
                { pos: 13, name: "博托莱托（Gabriel Bortoleto）", team: "Audi", points: 2, wins: 0 },
                { pos: 14, name: "塞恩斯（Carlos Sainz）", team: "威廉姆斯", points: 2, wins: 0 },
                { pos: 15, name: "奥康（Esteban Ocon）", team: "哈斯", points: 1, wins: 0 },
                { pos: 16, name: "科拉平托（Franco Colapinto）", team: "Alpine", points: 1, wins: 0 },
                { pos: 17, name: "霍肯伯格（Nico Hulkenberg）", team: "Audi", points: 0, wins: 0 },
                { pos: 18, name: "阿尔本（Alexander Albon）", team: "威廉姆斯", points: 0, wins: 0 },
                { pos: 19, name: "博塔斯（Valtteri Bottas）", team: "凯迪拉克", points: 0, wins: 0 },
                { pos: 20, name: "佩雷兹（Sergio Perez）", team: "凯迪拉克", points: 0, wins: 0 },
                { pos: 21, name: "阿隆索（Fernando Alonso）", team: "阿斯顿马丁", points: 0, wins: 0 },
                { pos: 22, name: "斯特罗尔（Lance Stroll）", team: "阿斯顿马丁", points: 0, wins: 0 }
            ],
            teams: [
                { pos: 1, name: "梅赛德斯", points: 135 },
                { pos: 2, name: "法拉利", points: 90 },
                { pos: 3, name: "迈凯伦", points: 46 },
                { pos: 4, name: "哈斯", points: 18 },
                { pos: 5, name: "Alpine", points: 16 },
                { pos: 6, name: "红牛", points: 16 },
                { pos: 7, name: "Racing Bulls", points: 14 },
                { pos: 8, name: "Audi", points: 2 },
                { pos: 9, name: "威廉姆斯", points: 2 },
                { pos: 10, name: "凯迪拉克", points: 0 },
                { pos: 11, name: "阿斯顿马丁", points: 0 }
            ]
        },
        pastRaces: [
            { round: "第1站 澳大利亚 墨尔本", date: "2026-03-08", winner: "罗素（George Russell）", top3: ["罗素", "安东内利", "勒克莱尔"] },
            { round: "第2站 中国 上海", date: "2026-03-15", winner: "安东内利（Kimi Antonelli）", top3: ["安东内利", "罗素", "汉密尔顿"] },
            { round: "第3站 日本 铃鹿", date: "2026-03-29", winner: "安东内利（Kimi Antonelli）", top3: ["安东内利", "皮亚斯特里", "勒克莱尔"] }
        ],
        cancelledRaces: [
            { round: "第4站 巴林 萨基尔", date: "2026-04-XX", reason: "由于中东地区地缘政治局势（伊朗战争），2026赛季巴林大奖赛已正式取消" },
            { round: "第5站 沙特阿拉伯 吉达", date: "2026-04-XX", reason: "由于中东地区地缘政治局势（伊朗战争），2026赛季沙特阿拉伯大奖赛已正式取消" }
        ]
    };
}

function getRaceSessionContext() {
    const qualifying = window.raceSessionData.qualifying;
    const sprint = window.raceSessionData.sprint;
    const race = window.raceSessionData.race;
    const standings = window.raceSessionData.seasonStandings;
    let context = "📊 **2026赛季最新信息：**\n";
    context += `\n🏁 **当前：第${window.raceSessionData.currentRound}站 ${qualifying.round.split(' ')[0]}**\n`;
    if (qualifying.top10 && qualifying.top10.length > 0) {
        context += `\n⏱️ **排位赛 Top3:**\n`;
        context += qualifying.top10.slice(0, 3).map(d => `  P${d.pos} ${d.driver} - ${d.time}`).join("\n");
    }
    if (sprint.top10 && sprint.top10.length > 0) {
        context += `\n⚡ **冲刺赛 Top3:**\n`;
        context += sprint.top10.slice(0, 3).map(d => `  P${d.pos} ${d.driver} - ${d.points}pt`).join("\n");
    }
    if (race.gridOrder && race.gridOrder.length > 0) {
        context += `\n🎯 **正赛发车顺序 Top3:** [${race.distance}]\n`;
        context += race.gridOrder.slice(0, 3).map(d => `  Grid ${d.grid} ${d.driver}`).join("\n");
    }
    if (standings && standings.drivers) {
        context += `\n🏆 **赛季积分榜 Top3:**\n`;
        context += standings.drivers.slice(0, 3).map(d => `  P${d.pos} ${d.name} - ${d.points}pt`).join("\n");
    }
    if (window.raceSessionData.cancelledRaces && window.raceSessionData.cancelledRaces.length > 0) {
        context += `\n🚫 **2026赛季取消的分站：**\n`;
        context += window.raceSessionData.cancelledRaces.map(r => `  • ${r.round}\n    原因：${r.reason}`).join("\n");
    }
    return context;
}

function formatRankingForChat(driverId) {
    const driver = window.DRIVERS.find(d => d.id === driverId);
    if (!driver) return "";
    let ranking = "";
    const driverNameVariants = [driver.name, driver.name.split('（')[0]];
    const seasonStanding = window.raceSessionData.seasonStandings?.drivers?.find(d => driverNameVariants.some(variant => d.name.includes(variant)));
    if (seasonStanding) {
        ranking += `我目前赛季积分${seasonStanding.points}分，排名第${seasonStanding.pos}位`;
    }
    const qualPos = window.raceSessionData.qualifying.top10?.find(d => driverNameVariants.some(variant => d.driver.includes(variant)));
    if (qualPos) {
        ranking += ranking ? "，" : "";
        ranking += `日本站排位赛获得第${qualPos.pos}名，圈速${qualPos.time}`;
    } else {
        ranking += ranking ? "，" : "";
        ranking += "日本站排位赛未进入前10名";
    }
    const sprintPos = window.raceSessionData.sprint.top10?.find(d => driverNameVariants.some(variant => d.driver.includes(variant)));
    if (sprintPos) {
        ranking += ranking ? "，" : "";
        ranking += `冲刺赛第${sprintPos.pos}名，获得${sprintPos.points}分`;
    }
    const gridPos = window.raceSessionData.race.gridOrder?.find(d => driverNameVariants.some(variant => d.driver.includes(variant)));
    if (gridPos) {
        ranking += ranking ? "，" : "";
        ranking += `将在今天正赛第${gridPos.grid}排发车`;
    }
    return ranking ? ranking + "。" : "";
}

function getSeasonSummary() {
    const allDriversPoints = {};
    for (let race of window.f1RaceDatabase.races) {
        if (race.status !== "completed") break;
        if (race.race) {
            for (let result of race.race) {
                const driver = result.driver;
                if (!allDriversPoints[driver]) { allDriversPoints[driver] = 0; }
                allDriversPoints[driver] += result.points;
            }
        }
        if (race.sprint) {
            for (let result of race.sprint) {
                const driver = result.driver;
                if (!allDriversPoints[driver]) { allDriversPoints[driver] = 0; }
                allDriversPoints[driver] += result.points;
            }
        }
    }
    const standings = Object.entries(allDriversPoints).sort((a,b)=>b[1]-a[1]).map((entry,index)=>({ driver: entry[0], points: entry[1], pos: index+1 }));
    const top3 = standings.slice(0,3);
    const topDriversText = top3.map((d,i)=>`${i+1}. ${d.driver.split(' ')[1] || d.driver} ${d.points}分`).join('、');
    const completedRaces = window.f1RaceDatabase.races.filter(r => r.status === "completed").length;
    let summary = `现在的积分榜：${topDriversText}。`;
    summary += `已进行${completedRaces}站比赛。`;
    summary += `2026赛季取消了巴林和沙特（共22站）。`;
    return summary;
}

function getDriverRankingAnalysis(driverName) {
    const seasonSummary = getDriverSeasonSummary(driverName);
    const allDriversPoints = {};
    for (let race of window.f1RaceDatabase.races) {
        if (race.status !== "completed") break;
        if (race.race) {
            for (let result of race.race) {
                const driver = result.driver;
                if (!allDriversPoints[driver]) { allDriversPoints[driver] = 0; }
                allDriversPoints[driver] += result.points;
            }
        }
        if (race.sprint) {
            for (let result of race.sprint) {
                const driver = result.driver;
                if (!allDriversPoints[driver]) { allDriversPoints[driver] = 0; }
                allDriversPoints[driver] += result.points;
            }
        }
    }
    const standings = Object.entries(allDriversPoints).sort((a,b)=>b[1]-a[1]).map((entry,index)=>({ driver: entry[0], points: entry[1], pos: index+1 }));
    const driverStanding = standings.find(s => s.driver.includes(driverName) || driverName.includes(s.driver.split('（')[0].split(' ')[0]));
    if (!driverStanding) return "";
    let analysis = `我目前排名第${driverStanding.pos}位，积${driverStanding.points}分`;
    if (seasonSummary.wins > 0) { analysis += `，${seasonSummary.races.length}场赛事中赢了${seasonSummary.wins}场`; }
    if (seasonSummary.podiums > 0) { analysis += `，站上领奖台${seasonSummary.podiums}次`; }
    const bestRace = seasonSummary.races.reduce((best, race) => !best || race.position < best.position ? race : best, null);
    if (bestRace) {
        analysis += `。` + (bestRace.position === 1 ? `最好成绩是在${bestRace.name}夺冠` : `最好成绩是在${bestRace.name}第${bestRace.position}名`);
    }
    return analysis;
}

function parseRaceDate(dateStr) {
    const match = dateStr.match(/(\d+)月(\d+)/);
    if (!match) return new Date(2026, 0, 1);
    const month = parseInt(match[1]) - 1;
    const day = parseInt(match[2]);
    return new Date(2026, month, day);
}

function getCurrentRaceContext() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let nextRace = null;
    for (let i = 0; i < window.F1_CALENDAR.length; i++) {
        const race = window.F1_CALENDAR[i];
        const raceDate = parseRaceDate(race.date);
        if (raceDate >= today) {
            nextRace = race;
            break;
        }
    }
    if (!nextRace && window.F1_CALENDAR.length > 0) {
        const lastRace = window.F1_CALENDAR[window.F1_CALENDAR.length - 1];
        return `本赛季已结束。最后一站是：${lastRace.date} ${lastRace.gp}（${lastRace.location}）${lastRace.sprint ? '（含冲刺赛）' : ''}。`;
    }
    if (!nextRace) return "暂无赛历信息。";
    const sprintText = nextRace.sprint ? " 🏁 含冲刺赛" : "";
    return `下一场比赛：${nextRace.date} · ${nextRace.gp}（${nextRace.location}）${sprintText}。第${nextRace.round}站。`;
}

function getUpcomingRacesPreview(monthsAhead = 2) {
    const today = new Date();
    const currentMonth = today.getMonth();
    const upcoming = window.F1_CALENDAR.filter(race => {
        const raceDate = parseRaceDate(race.date);
        return raceDate >= today && raceDate.getMonth() <= currentMonth + monthsAhead;
    });
    if (upcoming.length === 0) return "";
    let preview = "近期赛历：";
    upcoming.forEach(race => { preview += ` ${race.date} ${race.gp}；`; });
    return preview.slice(0, -1);
}

// 暴露到全局
window.getDriverRaceResult = getDriverRaceResult;
window.getDriverSeasonSummary = getDriverSeasonSummary;
window.initRaceSessionData = initRaceSessionData;
window.getRaceSessionContext = getRaceSessionContext;
window.formatRankingForChat = formatRankingForChat;
window.getSeasonSummary = getSeasonSummary;
window.getDriverRankingAnalysis = getDriverRankingAnalysis;
window.parseRaceDate = parseRaceDate;
window.getCurrentRaceContext = getCurrentRaceContext;
window.getUpcomingRacesPreview = getUpcomingRacesPreview;
