// raceSession.js - 2026 赛季分站状态与上下文

const F1_RACE_DATABASE = {
    currentRound: 7,
    currentRaceName: '加拿大大奖赛',
    races: [
        {
            round: 1,
            name: '澳大利亚大奖赛',
            location: '墨尔本',
            date: '2026-03-08',
            sprintWeekend: false,
            status: 'completed',
            qualifying: [
                { pos: 1, driver: 'George Russell', team: 'Mercedes', time: '1:25.234' },
                { pos: 2, driver: 'Kimi Antonelli', team: 'Mercedes', time: '1:25.412' },
                { pos: 3, driver: 'Charles Leclerc', team: 'Ferrari', time: '1:25.687' }
            ],
            race: [
                { pos: 1, driver: 'George Russell', team: 'Mercedes', points: 25 },
                { pos: 2, driver: 'Kimi Antonelli', team: 'Mercedes', points: 18 },
                { pos: 3, driver: 'Charles Leclerc', team: 'Ferrari', points: 15 },
                { pos: 4, driver: 'Lewis Hamilton', team: 'Ferrari', points: 12 },
                { pos: 5, driver: 'Lando Norris', team: 'McLaren', points: 10 },
                { pos: 6, driver: 'Oscar Piastri', team: 'McLaren', points: 8 },
                { pos: 7, driver: 'Oliver Bearman', team: 'Haas', points: 6 },
                { pos: 8, driver: 'Pierre Gasly', team: 'Alpine', points: 4 },
                { pos: 9, driver: 'Max Verstappen', team: 'Red Bull Racing', points: 2 },
                { pos: 10, driver: 'Liam Lawson', team: 'Racing Bulls', points: 1 }
            ]
        },
        {
            round: 2,
            name: '中国大奖赛',
            location: '上海',
            date: '2026-03-15',
            sprintWeekend: true,
            status: 'completed',
            qualifying: [
                { pos: 1, driver: 'Kimi Antonelli', team: 'Mercedes', time: '1:25.892' },
                { pos: 2, driver: 'George Russell', team: 'Mercedes', time: '1:26.031' },
                { pos: 3, driver: 'Charles Leclerc', team: 'Ferrari', time: '1:26.287' }
            ],
            sprint: [
                { pos: 1, driver: 'George Russell', team: 'Mercedes', points: 8 },
                { pos: 2, driver: 'Lewis Hamilton', team: 'Ferrari', points: 7 },
                { pos: 3, driver: 'Charles Leclerc', team: 'Ferrari', points: 6 },
                { pos: 4, driver: 'Lando Norris', team: 'McLaren', points: 5 },
                { pos: 5, driver: 'Oscar Piastri', team: 'McLaren', points: 4 },
                { pos: 6, driver: 'Kimi Antonelli', team: 'Mercedes', points: 3 },
                { pos: 7, driver: 'Oliver Bearman', team: 'Haas', points: 2 },
                { pos: 8, driver: 'Pierre Gasly', team: 'Alpine', points: 1 }
            ],
            race: [
                { pos: 1, driver: 'Kimi Antonelli', team: 'Mercedes', points: 25 },
                { pos: 2, driver: 'George Russell', team: 'Mercedes', points: 18 },
                { pos: 3, driver: 'Lewis Hamilton', team: 'Ferrari', points: 15 },
                { pos: 4, driver: 'Charles Leclerc', team: 'Ferrari', points: 12 },
                { pos: 5, driver: 'Lando Norris', team: 'McLaren', points: 10 },
                { pos: 6, driver: 'Oscar Piastri', team: 'McLaren', points: 8 },
                { pos: 7, driver: 'Oliver Bearman', team: 'Haas', points: 6 },
                { pos: 8, driver: 'Pierre Gasly', team: 'Alpine', points: 4 }
            ]
        },
        {
            round: 3,
            name: '日本大奖赛',
            location: '铃鹿',
            date: '2026-03-29',
            sprintWeekend: false,
            status: 'completed',
            qualifying: [
                { pos: 1, driver: 'Kimi Antonelli', team: 'Mercedes', time: '1:28.778' },
                { pos: 2, driver: 'George Russell', team: 'Mercedes', time: '1:29.076' },
                { pos: 3, driver: 'Oscar Piastri', team: 'McLaren', time: '1:29.132' }
            ],
            race: [
                { pos: 1, driver: 'Kimi Antonelli', team: 'Mercedes', points: 25 },
                { pos: 2, driver: 'Oscar Piastri', team: 'McLaren', points: 18 },
                { pos: 3, driver: 'Charles Leclerc', team: 'Ferrari', points: 15 },
                { pos: 4, driver: 'George Russell', team: 'Mercedes', points: 12 },
                { pos: 5, driver: 'Lando Norris', team: 'McLaren', points: 10 },
                { pos: 6, driver: 'Lewis Hamilton', team: 'Ferrari', points: 8 },
                { pos: 7, driver: 'Pierre Gasly', team: 'Alpine', points: 6 },
                { pos: 8, driver: 'Max Verstappen', team: 'Red Bull Racing', points: 4 },
                { pos: 9, driver: 'Liam Lawson', team: 'Racing Bulls', points: 2 },
                { pos: 10, driver: 'Esteban Ocon', team: 'Haas', points: 1 }
            ]
        },
        {
            round: 4,
            name: '巴林大奖赛',
            location: '萨基尔',
            date: '2026-04-10',
            sprintWeekend: false,
            status: 'cancelled',
            note: '2026 赛季巴林大奖赛未举行。'
        },
        {
            round: 5,
            name: '沙特阿拉伯大奖赛',
            location: '吉达',
            date: '2026-04-17',
            sprintWeekend: false,
            status: 'cancelled',
            note: '2026 赛季沙特阿拉伯大奖赛未举行。'
        },
        {
            round: 6,
            name: '迈阿密大奖赛',
            location: '迈阿密',
            date: '2026-05-04',
            sprintWeekend: true,
            status: 'completed',
            qualifying: [
                { pos: 1, driver: 'Kimi Antonelli', team: 'Mercedes', time: '1:26.482' },
                { pos: 2, driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:26.536' },
                { pos: 3, driver: 'Charles Leclerc', team: 'Ferrari', time: '1:26.543' }
            ],
            sprint: [
                { pos: 1, driver: 'Lando Norris', team: 'McLaren', points: 8 },
                { pos: 2, driver: 'Oscar Piastri', team: 'McLaren', points: 7 },
                { pos: 3, driver: 'Charles Leclerc', team: 'Ferrari', points: 6 },
                { pos: 4, driver: 'George Russell', team: 'Mercedes', points: 5 },
                { pos: 5, driver: 'Max Verstappen', team: 'Red Bull Racing', points: 4 },
                { pos: 6, driver: 'Kimi Antonelli', team: 'Mercedes', points: 3 },
                { pos: 7, driver: 'Lewis Hamilton', team: 'Ferrari', points: 2 },
                { pos: 8, driver: 'Pierre Gasly', team: 'Alpine', points: 1 }
            ],
            race: [
                { pos: 1, driver: 'Kimi Antonelli', team: 'Mercedes', points: 25 },
                { pos: 2, driver: 'Lando Norris', team: 'McLaren', points: 18 },
                { pos: 3, driver: 'Oscar Piastri', team: 'McLaren', points: 15 },
                { pos: 4, driver: 'George Russell', team: 'Mercedes', points: 12 },
                { pos: 5, driver: 'Max Verstappen', team: 'Red Bull Racing', points: 10 },
                { pos: 6, driver: 'Lewis Hamilton', team: 'Ferrari', points: 8 },
                { pos: 7, driver: 'Franco Colapinto', team: 'Alpine', points: 6 },
                { pos: 8, driver: 'Charles Leclerc', team: 'Ferrari', points: 4 },
                { pos: 9, driver: 'Carlos Sainz', team: 'Williams', points: 2 },
                { pos: 10, driver: 'Alexander Albon', team: 'Williams', points: 1 }
            ]
        },
        {
            round: 7,
            name: '加拿大大奖赛',
            location: '蒙特利尔',
            date: '2026-05-24',
            sprintWeekend: true,
            status: 'upcoming',
            note: '当前焦点已经切到加拿大站赛前阶段，围场会逐步转向下一场比赛。'
        }
    ]
};

window.f1RaceDatabase = F1_RACE_DATABASE;
var f1RaceDatabase = window.f1RaceDatabase;

function findDriverMatch(driverName, candidateName) {
    const left = String(driverName || '').trim().toLowerCase();
    const right = String(candidateName || '').trim().toLowerCase();
    if (!left || !right) return false;
    if (left === right) return true;
    return left.includes(right) || right.includes(left);
}

function getCompletedRaces() {
    return (window.f1RaceDatabase?.races || []).filter(race => race.status === 'completed');
}

function getDriverRaceResult(driverName, round) {
    const race = (window.f1RaceDatabase?.races || []).find(item => Number(item.round) === Number(round));
    if (!race) return null;
    const result = {};
    if (Array.isArray(race.qualifying)) {
        const qualifying = race.qualifying.find(item => findDriverMatch(driverName, item.driver));
        if (qualifying) result.qualifying = qualifying.pos;
    }
    if (Array.isArray(race.sprint)) {
        const sprint = race.sprint.find(item => findDriverMatch(driverName, item.driver));
        if (sprint) result.sprint = { pos: sprint.pos, points: sprint.points };
    }
    if (Array.isArray(race.race)) {
        const mainRace = race.race.find(item => findDriverMatch(driverName, item.driver));
        if (mainRace) result.race = { pos: mainRace.pos, points: mainRace.points };
    }
    return Object.keys(result).length ? result : null;
}

function getDriverSeasonSummary(driverName) {
    let totalPoints = 0;
    let wins = 0;
    let podiums = 0;
    const raceResults = [];
    getCompletedRaces().forEach(race => {
        const sprintResult = Array.isArray(race.sprint) ? race.sprint.find(item => findDriverMatch(driverName, item.driver)) : null;
        const raceResult = Array.isArray(race.race) ? race.race.find(item => findDriverMatch(driverName, item.driver)) : null;
        if (sprintResult) totalPoints += Number(sprintResult.points || 0);
        if (raceResult) {
            totalPoints += Number(raceResult.points || 0);
            raceResults.push({
                round: race.round,
                name: race.name,
                position: raceResult.pos,
                points: raceResult.points
            });
            if (Number(raceResult.pos) === 1) wins += 1;
            if (Number(raceResult.pos) <= 3) podiums += 1;
        }
    });
    return { totalPoints, wins, podiums, races: raceResults };
}

function buildSeasonStandingsFromDatabase() {
    const driverMap = new Map();
    const driverSeed = Array.isArray(window.defaultDriverStandings) ? window.defaultDriverStandings : [];
    driverSeed.forEach(item => {
        const name = String(item?.name || '').trim();
        if (!name) return;
        driverMap.set(name, { name, team: item.team || '', points: 0, wins: 0 });
    });

    getCompletedRaces().forEach(race => {
        (Array.isArray(race.sprint) ? race.sprint : []).forEach(item => {
            const current = driverMap.get(item.driver) || { name: item.driver, team: item.team || '', points: 0, wins: 0 };
            current.team = current.team || item.team || '';
            current.points += Number(item.points || 0);
            driverMap.set(item.driver, current);
        });
        (Array.isArray(race.race) ? race.race : []).forEach(item => {
            const current = driverMap.get(item.driver) || { name: item.driver, team: item.team || '', points: 0, wins: 0 };
            current.team = current.team || item.team || '';
            current.points += Number(item.points || 0);
            if (Number(item.pos) === 1) current.wins += 1;
            driverMap.set(item.driver, current);
        });
    });

    const drivers = Array.from(driverMap.values())
        .sort((left, right) => {
            if (right.points !== left.points) return right.points - left.points;
            if (right.wins !== left.wins) return right.wins - left.wins;
            return left.name.localeCompare(right.name, 'en');
        })
        .map((item, index) => ({
            pos: index + 1,
            name: item.name,
            team: item.team,
            points: item.points,
            wins: item.wins
        }));

    const teamMap = new Map();
    drivers.forEach(item => {
        const key = item.team || 'Team';
        const current = teamMap.get(key) || { name: key, points: 0 };
        current.points += Number(item.points || 0);
        teamMap.set(key, current);
    });

    const teams = Array.from(teamMap.values())
        .sort((left, right) => {
            if (right.points !== left.points) return right.points - left.points;
            return left.name.localeCompare(right.name, 'en');
        })
        .map((item, index) => ({
            pos: index + 1,
            name: item.name,
            points: item.points
        }));

    return { drivers, teams };
}

function initRaceSessionData() {
    const standings = buildSeasonStandingsFromDatabase();
    window.raceSessionData = {
        currentRound: 7,
        qualifying: {
            round: '加拿大站 排位赛',
            date: '2026-05-23',
            location: '蒙特利尔',
            top10: []
        },
        sprint: {
            round: '加拿大站 冲刺赛',
            date: '2026-05-23',
            distance: '100km',
            top10: []
        },
        race: {
            round: '加拿大站 正赛',
            date: '2026-05-24',
            distance: '305km',
            status: '待开赛',
            gridOrder: [],
            raceResult: []
        },
        seasonStandings: standings,
        pastRaces: getCompletedRaces().map(race => ({
            round: `第 ${race.round} 站 ${race.name}`,
            date: race.date,
            winner: race.race?.[0]?.driver || '待补充',
            top3: (race.race || []).slice(0, 3).map(item => item.driver)
        })),
        cancelledRaces: (window.f1RaceDatabase?.races || [])
            .filter(race => race.status === 'cancelled')
            .map(race => ({
                round: `第 ${race.round} 站 ${race.name}`,
                date: race.date,
                reason: race.note || '该分站未举行。'
            }))
    };
}

function getRaceSessionContext() {
    if (!window.raceSessionData) initRaceSessionData();
    const standings = window.raceSessionData.seasonStandings || { drivers: [], teams: [] };
    const topDrivers = (standings.drivers || []).slice(0, 3)
        .map(item => `P${item.pos} ${item.name} - ${item.points}分`)
        .join('\n');
    const latestRace = getCompletedRaces().slice(-1)[0];
    const cancelled = (window.raceSessionData.cancelledRaces || []).map(item => `- ${item.round}：${item.reason}`).join('\n');
    let context = '【2026 赛季最新信息】\n';
    context += `当前焦点：第 ${window.raceSessionData.currentRound} 站 加拿大大奖赛（赛前倒计时）\n`;
    context += '当前分站还未开始，围场语境应该转向加拿大站的准备节奏，而不是继续把迈阿密当作进行中。\n';
    if (latestRace?.race?.[0]) {
        context += `最近一站已完赛分站：${latestRace.name}，冠军 ${latestRace.race[0].driver}。\n`;
    }
    if (topDrivers) {
        context += `赛季积分榜 Top3：\n${topDrivers}\n`;
    }
    if (cancelled) {
        context += `未举行分站：\n${cancelled}\n`;
    }
    return context.trim();
}

function formatRankingForChat(driverId) {
    const driver = (window.DRIVERS || []).find(item => item.id === driverId);
    if (!driver) return '';
    if (!window.raceSessionData) initRaceSessionData();
    const standing = (window.raceSessionData.seasonStandings?.drivers || []).find(item => findDriverMatch(item.name, driver.name));
    const rankText = standing ? `我目前赛季积分 ${standing.points} 分，排在第 ${standing.pos} 位` : '我这边的赛季积分还在统计中';
    return `${rankText}。加拿大站还没开始，当前更多是在做赛前准备。`;
}

function getSeasonSummary() {
    const standings = buildSeasonStandingsFromDatabase().drivers.slice(0, 3);
    const topText = standings.map(item => `${item.pos}. ${item.name} ${item.points}分`).join('，');
    const completedCount = getCompletedRaces().length;
    return `当前积分榜前列是：${topText}。目前已完成 ${completedCount} 站比赛，迈阿密已经完赛，当前焦点转向加拿大。`;
}

function getDriverRankingAnalysis(driverName) {
    const summary = getDriverSeasonSummary(driverName);
    const standings = buildSeasonStandingsFromDatabase().drivers;
    const standing = standings.find(item => findDriverMatch(item.name, driverName));
    if (!standing) return '';
    const bestRace = summary.races.reduce((best, race) => {
        if (!best) return race;
        return Number(race.position) < Number(best.position) ? race : best;
    }, null);
    let text = `我目前排在第 ${standing.pos} 位，拿到 ${standing.points} 分`;
    if (summary.wins > 0) text += `，已经赢下 ${summary.wins} 场`;
    if (summary.podiums > 0) text += `，站上领奖台 ${summary.podiums} 次`;
    if (bestRace) {
        text += `。截至迈阿密之后，我最好的一站是 ${bestRace.name}`;
        text += Number(bestRace.position) === 1 ? '夺冠。' : `拿到第 ${bestRace.position} 名。`;
    } else {
        text += '。';
    }
    return text;
}

function parseRaceDate(dateStr) {
    const range = parseRaceDateRange(dateStr);
    return range.start;
}

function parseRaceDateRange(dateStr) {
    const text = String(dateStr || '');
    const match = text.match(/(\d+)月(\d+)(?:日)?(?:\D+(?:(\d+)月)?(\d+)(?:日)?)?/);
    if (!match) {
        const fallback = new Date(2026, 0, 1);
        fallback.setHours(0, 0, 0, 0);
        return { start: fallback, end: fallback };
    }
    const startMonth = Number(match[1]) - 1;
    const startDay = Number(match[2]);
    const endMonth = Number(match[3] || match[1]) - 1;
    const endDay = Number(match[4] || match[2]);
    const start = new Date(2026, startMonth, startDay);
    const end = new Date(2026, endMonth, endDay);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
}

function getDateDiffInDays(from, to) {
    const left = new Date(from);
    const right = new Date(to);
    left.setHours(0, 0, 0, 0);
    right.setHours(0, 0, 0, 0);
    return Math.round((right - left) / 86400000);
}

function getRaceWeekendPhase(referenceDate, race) {
    if (!race) return null;
    if (race.status === 'completed' || race.status === 'cancelled') return null;
    const { start, end } = parseRaceDateRange(race.date);
    const diffToStart = getDateDiffInDays(referenceDate, start);
    const diffToEnd = getDateDiffInDays(referenceDate, end);
    if (diffToStart >= 0 && diffToStart <= 2) {
        const labels = ['媒体日', '练习赛日', '练习赛日'];
        return {
            id: 'practice',
            label: labels[diffToStart] || '练习赛日',
            note: '这一站已经进入比赛周准备阶段，围场讨论会更偏向调校、轮胎窗口和短中长距离节奏。',
            short: '比赛周',
            live: true,
            daysToRace: diffToEnd
        };
    }
    if (diffToStart === -1) {
        return {
            id: race.sprint ? 'sprint_day' : 'qualifying',
            label: race.sprint ? '冲刺赛日' : '排位赛日',
            note: race.sprint ? '冲刺赛和正赛前的节奏会一起把话题推高。' : '单圈速度、失误和赛道窗口会成为焦点。',
            short: race.sprint ? '冲刺赛' : '排位赛',
            live: true,
            daysToRace: diffToEnd
        };
    }
    if (diffToEnd === 0) {
        return {
            id: 'race_day',
            label: '正赛日',
            note: '围场会集中到发车、策略、节奏和赛后情绪上。',
            short: '正赛日',
            live: true,
            daysToRace: 0
        };
    }
    if (diffToEnd === -1) {
        return {
            id: 'post_race',
            label: '赛后余波',
            note: '赛后总结、媒体复盘和车手情绪还没有完全散去。',
            short: '赛后余波',
            live: true,
            daysToRace: -1
        };
    }
    return null;
}

function getCurrentRaceWeekendEvent() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const races = window.F1_CALENDAR || [];
    if (!races.length) return null;

    let current = null;
    let next = null;

    races.forEach(race => {
        if (race.status === 'cancelled' || race.status === 'completed') return;
        const { start, end } = parseRaceDateRange(race.date);
        const phase = getRaceWeekendPhase(today, race);
        if (!current && phase) {
            current = { race, phase, start, end, status: 'live' };
        }
        if (!next && start >= today) {
            next = { race, start, end, status: 'upcoming' };
        }
    });

    if (current) return current;
    if (next) {
        const daysToStart = getDateDiffInDays(today, next.start);
        return {
            race: next.race,
            start: next.start,
            end: next.end,
            status: 'countdown',
            phase: {
                id: 'countdown',
                label: '下一站倒计时',
                note: daysToStart <= 7
                    ? '围场话题已经开始朝下一站聚拢。'
                    : '目前处于两站之间的准备期，但焦点已经切到下一站。',
                short: '倒计时',
                live: false,
                daysToRace: daysToStart
            }
        };
    }

    const lastCompleted = races.filter(race => race.status === 'completed').slice(-1)[0] || races[races.length - 1];
    const lastRange = parseRaceDateRange(lastCompleted?.date || '2026-01-01');
    return {
        race: lastCompleted,
        start: lastRange.start,
        end: lastRange.end,
        status: 'season_complete',
        phase: {
            id: 'season_complete',
            label: '休赛期',
            note: '本赛季赛程已经全部完成。',
            short: '休赛期',
            live: false,
            daysToRace: null
        }
    };
}

function getRaceWeekendHeadline(event) {
    if (!event?.race || !event?.phase) return '暂无比赛周信息';
    if (event.status === 'season_complete') return `本赛季已结束，最后一站是 ${event.race.gp || event.race.name}`;
    if (event.status === 'countdown') return `${event.race.gp || event.race.name} 倒计时 ${event.phase.daysToRace} 天`;
    return `${event.race.gp || event.race.name} · ${event.phase.label}`;
}

function getRaceWeekendPromptContext() {
    const event = getCurrentRaceWeekendEvent();
    if (!event?.race || !event?.phase) return '';
    if (event.status === 'season_complete') return '当前赛程状态：本赛季已完成。';
    if (event.status === 'countdown') {
        return `当前比赛周状态：距离 ${event.race.gp || event.race.name} 还有 ${event.phase.daysToRace} 天，地点 ${event.race.location}。阶段：${event.phase.label}。${event.phase.note}`;
    }
    return `当前比赛周状态：${event.race.gp || event.race.name} 正处于 ${event.phase.label}，地点 ${event.race.location}。${event.phase.note}`;
}

function getCurrentRaceContext() {
    const event = getCurrentRaceWeekendEvent();
    if (!event?.race) return '暂无赛历信息。';
    if (event.status === 'season_complete') {
        return `本赛季已经结束。最后一站是 ${event.race.date} ${event.race.gp || event.race.name}，地点 ${event.race.location}。`;
    }
    if (event.status === 'countdown') {
        const sprintText = event.race.sprint ? '，含冲刺赛周末' : '';
        return `下一站是第 ${event.race.round} 站 ${event.race.gp || event.race.name}，时间 ${event.race.date}，地点 ${event.race.location}${sprintText}。当前阶段：${event.phase.label}。${event.phase.note}`;
    }
    return `当前正在经历 ${event.race.gp || event.race.name} 的 ${event.phase.label}，地点 ${event.race.location}。${event.phase.note}`;
}

function getUpcomingRacesPreview(limit = 3) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (window.F1_CALENDAR || [])
        .filter(race => race.status !== 'cancelled' && race.status !== 'completed')
        .map(race => {
            const range = parseRaceDateRange(race.date);
            return { race, start: range.start };
        })
        .filter(item => item.start >= today)
        .sort((left, right) => left.start - right.start)
        .slice(0, limit)
        .map(item => `${item.race.gp}（${item.race.date}）`);
}

window.getDriverRaceResult = getDriverRaceResult;
window.getDriverSeasonSummary = getDriverSeasonSummary;
window.initRaceSessionData = initRaceSessionData;
window.getRaceSessionContext = getRaceSessionContext;
window.formatRankingForChat = formatRankingForChat;
window.getSeasonSummary = getSeasonSummary;
window.getDriverRankingAnalysis = getDriverRankingAnalysis;
window.parseRaceDate = parseRaceDate;
window.parseRaceDateRange = parseRaceDateRange;
window.getCurrentRaceWeekendEvent = getCurrentRaceWeekendEvent;
window.getRaceWeekendPromptContext = getRaceWeekendPromptContext;
window.getRaceWeekendHeadline = getRaceWeekendHeadline;
window.getCurrentRaceContext = getCurrentRaceContext;
window.getUpcomingRacesPreview = getUpcomingRacesPreview;

initRaceSessionData();
