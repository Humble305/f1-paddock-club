// raceSession.js - 2026 赛季上下文、比赛周焦点与聊天辅助摘要

const COMPLETED_RACE_RESULTS = {
    1: {
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
            { pos: 9, driver: 'Max Verstappen', team: 'Red Bull', points: 2 },
            { pos: 10, driver: 'Liam Lawson', team: 'Racing Bulls', points: 1 }
        ]
    },
    2: {
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
    3: {
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
            { pos: 8, driver: 'Max Verstappen', team: 'Red Bull', points: 4 },
            { pos: 9, driver: 'Liam Lawson', team: 'Racing Bulls', points: 2 },
            { pos: 10, driver: 'Esteban Ocon', team: 'Haas', points: 1 }
        ]
    },
    6: {
        qualifying: [
            { pos: 1, driver: 'Kimi Antonelli', team: 'Mercedes', time: '1:26.482' },
            { pos: 2, driver: 'Max Verstappen', team: 'Red Bull', time: '1:26.536' },
            { pos: 3, driver: 'Charles Leclerc', team: 'Ferrari', time: '1:26.543' }
        ],
        sprint: [
            { pos: 1, driver: 'Lando Norris', team: 'McLaren', points: 8 },
            { pos: 2, driver: 'Oscar Piastri', team: 'McLaren', points: 7 },
            { pos: 3, driver: 'Charles Leclerc', team: 'Ferrari', points: 6 },
            { pos: 4, driver: 'George Russell', team: 'Mercedes', points: 5 },
            { pos: 5, driver: 'Max Verstappen', team: 'Red Bull', points: 4 },
            { pos: 6, driver: 'Kimi Antonelli', team: 'Mercedes', points: 3 },
            { pos: 7, driver: 'Lewis Hamilton', team: 'Ferrari', points: 2 },
            { pos: 8, driver: 'Pierre Gasly', team: 'Alpine', points: 1 }
        ],
        race: [
            { pos: 1, driver: 'Kimi Antonelli', team: 'Mercedes', points: 25 },
            { pos: 2, driver: 'Lando Norris', team: 'McLaren', points: 18 },
            { pos: 3, driver: 'Oscar Piastri', team: 'McLaren', points: 15 },
            { pos: 4, driver: 'George Russell', team: 'Mercedes', points: 12 },
            { pos: 5, driver: 'Max Verstappen', team: 'Red Bull', points: 10 },
            { pos: 6, driver: 'Lewis Hamilton', team: 'Ferrari', points: 8 },
            { pos: 7, driver: 'Franco Colapinto', team: 'Alpine', points: 6 },
            { pos: 8, driver: 'Charles Leclerc', team: 'Ferrari', points: 4 },
            { pos: 9, driver: 'Carlos Sainz', team: 'Williams', points: 2 },
            { pos: 10, driver: 'Alexander Albon', team: 'Williams', points: 1 }
        ]
    },
    8: {
        qualifying: [
            { pos: 1, driver: 'Kimi Antonelli', team: 'Mercedes', time: '1:12.051' },
            { pos: 2, driver: 'Max Verstappen', team: 'Red Bull', time: '1:12.094' },
            { pos: 3, driver: 'Lewis Hamilton', team: 'Ferrari', time: '1:12.279' },
            { pos: 4, driver: 'Charles Leclerc', team: 'Ferrari', time: '1:12.351' },
            { pos: 5, driver: 'Isack Hadjar', team: 'Red Bull', time: '1:12.434' },
            { pos: 6, driver: 'George Russell', team: 'Mercedes', time: '1:12.445' },
            { pos: 7, driver: 'Oscar Piastri', team: 'McLaren', time: '1:12.624' },
            { pos: 8, driver: 'Lando Norris', team: 'McLaren', time: '1:12.765' },
            { pos: 9, driver: 'Pierre Gasly', team: 'Alpine', time: '1:13.226' },
            { pos: 10, driver: 'Liam Lawson', team: 'Racing Bulls', time: '1:13.412' }
        ],
        race: [
            { pos: 1, driver: 'Kimi Antonelli', team: 'Mercedes', points: 25 },
            { pos: 2, driver: 'Lewis Hamilton', team: 'Ferrari', points: 18 },
            { pos: 3, driver: 'Isack Hadjar', team: 'Red Bull', points: 15 },
            { pos: 4, driver: 'Oscar Piastri', team: 'McLaren', points: 12 },
            { pos: 5, driver: 'Liam Lawson', team: 'Racing Bulls', points: 10 },
            { pos: 6, driver: 'Arvid Lindblad', team: 'Racing Bulls', points: 8 },
            { pos: 7, driver: 'Pierre Gasly', team: 'Alpine', points: 6 },
            { pos: 8, driver: 'Alexander Albon', team: 'Williams', points: 4 },
            { pos: 9, driver: 'Esteban Ocon', team: 'Haas', points: 2 },
            { pos: 10, driver: 'Fernando Alonso', team: 'Aston Martin', points: 1 }
        ]
    },
    9: {
        qualifying: [
            { pos: 1, driver: 'George Russell', team: 'Mercedes', time: '1:14.679' },
            { pos: 2, driver: 'Lewis Hamilton', team: 'Ferrari', time: '1:14.743' },
            { pos: 3, driver: 'Kimi Antonelli', team: 'Mercedes', time: '1:14.812' },
            { pos: 4, driver: 'Lando Norris', team: 'McLaren', time: '1:14.946' },
            { pos: 5, driver: 'Max Verstappen', team: 'Red Bull', time: '1:15.021' },
            { pos: 6, driver: 'Isack Hadjar', team: 'Red Bull', time: '1:15.184' }
        ],
        race: [
            { pos: 1, driver: 'Lewis Hamilton', team: 'Ferrari', points: 25 },
            { pos: 2, driver: 'George Russell', team: 'Mercedes', points: 18 },
            { pos: 3, driver: 'Lando Norris', team: 'McLaren', points: 15 },
            { pos: 4, driver: 'Max Verstappen', team: 'Red Bull', points: 12 },
            { pos: 5, driver: 'Oscar Piastri', team: 'McLaren', points: 10 },
            { pos: 6, driver: 'Isack Hadjar', team: 'Red Bull', points: 8 },
            { pos: 7, driver: 'Pierre Gasly', team: 'Alpine', points: 6 },
            { pos: 8, driver: 'Franco Colapinto', team: 'Alpine', points: 4 },
            { pos: 9, driver: 'Liam Lawson', team: 'Racing Bulls', points: 2 }
        ]
    }
};

function normalizeRaceText(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/\(.*?\)/g, '')
        .replace(/[（）()\s·.\-]/g, '');
}

function findDriverMatch(left, right) {
    return normalizeRaceText(left) === normalizeRaceText(right);
}

function getLocalMidnight(date = new Date()) {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return target;
}

function parseCalendarDateRange(label) {
    const text = String(label || '').trim();
    if (!text) return { start: null, end: null };
    const normalized = text.replace(/\s+/g, '');
    const sameMonth = normalized.match(/^(\d{1,2})月(\d{1,2})[-—~至](\d{1,2})日$/);
    if (sameMonth) {
        const month = Number(sameMonth[1]);
        const startDay = Number(sameMonth[2]);
        const endDay = Number(sameMonth[3]);
        return {
            start: new Date(2026, month - 1, startDay, 0, 0, 0, 0),
            end: new Date(2026, month - 1, endDay, 23, 59, 59, 999)
        };
    }
    const crossMonth = normalized.match(/^(\d{1,2})月(\d{1,2})日[-—~至](\d{1,2})月(\d{1,2})日$/);
    if (crossMonth) {
        const startMonth = Number(crossMonth[1]);
        const startDay = Number(crossMonth[2]);
        const endMonth = Number(crossMonth[3]);
        const endDay = Number(crossMonth[4]);
        return {
            start: new Date(2026, startMonth - 1, startDay, 0, 0, 0, 0),
            end: new Date(2026, endMonth - 1, endDay, 23, 59, 59, 999)
        };
    }
    return { start: null, end: null };
}

window.parseRaceDateRange = parseCalendarDateRange;

function getCalendarRaceDateRange(race) {
    if (race?.dateRange?.start && race?.dateRange?.end) {
        const start = new Date(race.dateRange.start);
        const end = new Date(race.dateRange.end);
        if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
            return { start, end };
        }
    }
    return parseCalendarDateRange(race?.date);
}

function getCompletedResult(round) {
    return COMPLETED_RACE_RESULTS[Number(round)] || null;
}

function buildRaceDatabase() {
    return (window.F1_CALENDAR || []).map(race => {
        const result = getCompletedResult(race.round);
        const range = getCalendarRaceDateRange(race);
        return {
            round: Number(race.round),
            gp: race.gp,
            name: race.gp,
            location: race.location,
            date: race.date,
            dateRange: range,
            sprintWeekend: Boolean(race.sprint),
            predictionDeadline: race.predictionDeadline || null,
            status: result ? 'completed' : 'scheduled',
            qualifying: result?.qualifying ? result.qualifying.map(item => ({ ...item })) : [],
            sprint: result?.sprint ? result.sprint.map(item => ({ ...item })) : [],
            race: result?.race ? result.race.map(item => ({ ...item })) : []
        };
    });
}

function getRaceDatabase() {
    return buildRaceDatabase();
}

function getCompletedRaces() {
    return getRaceDatabase().filter(race => race.status === 'completed');
}

function getRaceByRound(round) {
    return getRaceDatabase().find(race => Number(race.round) === Number(round)) || null;
}

function getLatestCompletedRace() {
    const races = getCompletedRaces();
    return races.length ? races[races.length - 1] : null;
}

function normalizeStandingTeamName(teamName) {
    const text = String(teamName || '').trim();
    if (!text) return '';
    return text
        .replace(/^梅赛德斯(?:\s*\(Mercedes\))?$/i, 'Mercedes')
        .replace(/^法拉利(?:\s*\(Ferrari\))?$/i, 'Ferrari')
        .replace(/^迈凯伦(?:\s*\(McLaren\))?$/i, 'McLaren')
        .replace(/^红牛(?:\s*\(Red Bull\))?$/i, 'Red Bull')
        .replace(/^阿斯顿马丁(?:\s*\(Aston Martin\))?$/i, 'Aston Martin')
        .replace(/^威廉姆斯(?:\s*\(Williams\))?$/i, 'Williams')
        .replace(/^哈斯(?:\s*\(Haas\))?$/i, 'Haas')
        .replace(/^奥迪(?:\s*\(Audi\))?$/i, 'Audi')
        .replace(/^凯迪拉克(?:\s*\(Cadillac\))?$/i, 'Cadillac');
}

function buildStandingsFromCompletedResults() {
    const driverMap = new Map();
    getCompletedRaces().forEach(race => {
        (race.sprint || []).forEach(item => {
            const current = driverMap.get(item.driver) || { name: item.driver, team: item.team || '', points: 0, wins: 0 };
            current.points += Number(item.points || 0);
            current.team = current.team || item.team || '';
            driverMap.set(item.driver, current);
        });
        (race.race || []).forEach(item => {
            const current = driverMap.get(item.driver) || { name: item.driver, team: item.team || '', points: 0, wins: 0 };
            current.points += Number(item.points || 0);
            current.team = current.team || item.team || '';
            if (Number(item.pos) === 1) current.wins += 1;
            driverMap.set(item.driver, current);
        });
    });

    const drivers = Array.from(driverMap.values())
        .sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.wins !== a.wins) return b.wins - a.wins;
            return a.name.localeCompare(b.name, 'en');
        })
        .map((item, index) => ({
            pos: index + 1,
            name: item.name,
            team: normalizeStandingTeamName(item.team),
            points: item.points,
            wins: item.wins
        }));

    const teamMap = new Map();
    drivers.forEach(item => {
        const team = normalizeStandingTeamName(item.team) || 'Team';
        const current = teamMap.get(team) || { name: team, points: 0 };
        current.points += Number(item.points || 0);
        teamMap.set(team, current);
    });

    const teams = Array.from(teamMap.values())
        .sort((a, b) => b.points - a.points)
        .map((item, index) => ({
            pos: index + 1,
            name: item.name,
            points: item.points
        }));

    return { drivers, teams };
}

function getLiveStandingsPayload() {
    if (typeof window.getCurrentStandingsPayload === 'function') {
        const payload = window.getCurrentStandingsPayload();
        if (Array.isArray(payload?.driverStandings) && payload.driverStandings.length) {
            return payload;
        }
    }
    return null;
}

function buildSeasonStandings() {
    const livePayload = getLiveStandingsPayload();
    if (livePayload) {
        const drivers = livePayload.driverStandings.map((item, index) => ({
            pos: index + 1,
            name: item.name,
            team: normalizeStandingTeamName(item.team),
            points: Number(item.points || 0)
        }));
        const teams = livePayload.teamStandings.map((item, index) => ({
            pos: index + 1,
            name: normalizeStandingTeamName(item.name),
            points: Number(item.points || 0)
        }));
        return { drivers, teams };
    }
    return buildStandingsFromCompletedResults();
}

function getRaceWeekendPhase(referenceDate, race) {
    const current = getLocalMidnight(referenceDate);
    const { start, end } = getCalendarRaceDateRange(race);
    if (!start || !end) return null;
    if (current < start || current > end) return null;
    const dayOffset = Math.round((current.getTime() - start.getTime()) / 86400000);
    if (dayOffset <= 0) {
        return {
            key: 'friday',
            label: '比赛周开启',
            note: race.sprintWeekend
                ? '冲刺周末的信息会来得更快，围场节奏也会更紧。'
                : '围场已经切进比赛周模式，话题会自然围着这一站转。'
        };
    }
    if (dayOffset === 1) {
        return {
            key: 'qualifying',
            label: '排位日前后',
            note: race.sprintWeekend
                ? '冲刺赛和排位相关的话题会叠在一起，情绪通常更绷。'
                : '排位日前后通常最容易把车手和车队的真实状态放大出来。'
        };
    }
    return {
        key: 'race',
        label: '正赛日',
        note: '正赛日的语气通常最集中，公开动态和私聊都会更容易带着本站结果起伏。'
    };
}

function getCurrentRaceWeekendEvent(referenceDate = new Date()) {
    const today = getLocalMidnight(referenceDate);
    const races = window.F1_CALENDAR || [];

    for (const race of races) {
        const { start, end } = getCalendarRaceDateRange(race);
        if (!start || !end) continue;
        if (today >= start && today <= end) {
            return {
                status: 'live',
                race,
                phase: getRaceWeekendPhase(today, race)
            };
        }
    }

    const upcoming = races
        .map(race => ({ race, range: getCalendarRaceDateRange(race) }))
        .filter(item => item.range.start && item.range.start > today)
        .sort((a, b) => a.range.start - b.range.start)[0];

    if (upcoming) {
        const daysUntil = Math.ceil((upcoming.range.start.getTime() - today.getTime()) / 86400000);
        return {
            status: 'countdown',
            race: upcoming.race,
            phase: {
                key: 'countdown',
                label: '赛前倒计时',
                note: daysUntil <= 3
                    ? `${upcoming.race.gp} 已经很近了，围场语气会开始往这一站收。`
                    : `距离 ${upcoming.race.gp} 还有 ${daysUntil} 天，现在更像赛前准备期。`
            },
            daysUntil
        };
    }

    const latest = getLatestCompletedRace();
    if (!latest) return null;
    return {
        status: 'idle',
        race: latest,
        phase: {
            key: 'offweek',
            label: '赛后余波',
            note: '当前不在比赛周里，话题会更偏赛后消化和下一站准备。'
        }
    };
}

function getRaceWeekendHeadline(event) {
    if (!event?.race) return '当前比赛周';
    if (event.status === 'live') return `${event.race.gp} · ${event.phase?.label || '比赛周进行中'}`;
    if (event.status === 'countdown') return `${event.race.gp} · 倒计时`;
    return `${event.race.gp} · 赛后余波`;
}

function getCurrentFocusRace() {
    const event = getCurrentRaceWeekendEvent();
    if (event?.race) return event.race;
    return (window.F1_CALENDAR || [])[0] || null;
}

function initRaceSessionData() {
    const focusRace = getCurrentFocusRace();
    const focusResultRace = focusRace ? getRaceByRound(focusRace.round) : null;
    const weekendEvent = getCurrentRaceWeekendEvent();
    const seasonStandings = buildSeasonStandings();
    const database = {
        currentRound: Number(focusRace?.round || 0),
        currentRaceName: focusRace?.gp || '',
        races: getRaceDatabase()
    };

    window.f1RaceDatabase = database;
    window.raceSessionData = {
        currentRound: database.currentRound,
        currentRaceName: database.currentRaceName,
        qualifying: {
            round: focusRace ? `${focusRace.gp} 排位赛` : '',
            date: focusRace?.date || '',
            location: focusRace?.location || '',
            top10: focusResultRace?.qualifying ? focusResultRace.qualifying.map(item => ({ ...item })) : []
        },
        sprint: {
            round: focusRace ? `${focusRace.gp} 冲刺赛` : '',
            date: focusRace?.date || '',
            top10: focusResultRace?.sprint ? focusResultRace.sprint.map(item => ({ ...item })) : []
        },
        race: {
            round: focusRace ? `${focusRace.gp} 正赛` : '',
            date: focusRace?.date || '',
            distance: '',
            status: weekendEvent?.status === 'live'
                ? '比赛周中'
                : (weekendEvent?.status === 'countdown' ? '待开赛' : '赛后阶段'),
            gridOrder: focusResultRace?.qualifying ? focusResultRace.qualifying.map(item => ({ ...item })) : [],
            raceResult: focusResultRace?.race ? focusResultRace.race.map(item => ({ ...item })) : []
        },
        seasonStandings,
        pastRaces: getCompletedRaces().map(race => ({
            round: `第 ${race.round} 站 ${race.gp}`,
            date: race.date,
            winner: race.race?.[0]?.driver || '待补充',
            top3: (race.race || []).slice(0, 3).map(item => item.driver)
        })),
        cancelledRaces: []
    };

    return window.raceSessionData;
}

function buildRaceFocusSummary() {
    const event = getCurrentRaceWeekendEvent();
    if (!event?.race) {
        return {
            round: 0,
            name: '',
            note: '当前没有可用的比赛周上下文。'
        };
    }
    return {
        round: Number(event.race.round || 0),
        name: event.race.gp || '',
        note: event.phase?.note || ''
    };
}

function getRaceSessionContext() {
    if (!window.raceSessionData) initRaceSessionData();
    const standings = window.raceSessionData.seasonStandings || { drivers: [], teams: [] };
    const topDrivers = (standings.drivers || [])
        .slice(0, 3)
        .map(item => `P${item.pos} ${item.name} - ${item.points} 分`)
        .join('\n');
    const latestRace = getLatestCompletedRace();
    const focus = buildRaceFocusSummary();
    const lines = ['【2026 赛季上下文】'];

    if (focus.round) {
        lines.push(`当前焦点：第 ${focus.round} 站 ${focus.name}`);
    }
    if (focus.note) {
        lines.push(focus.note);
    }
    if (latestRace?.race?.[0]?.driver) {
        lines.push(`最近一站完赛是 ${latestRace.gp}，冠军是 ${latestRace.race[0].driver}。`);
    }
    if (topDrivers) {
        lines.push('当前积分榜前列：');
        lines.push(topDrivers);
    }

    return lines.join('\n');
}

function formatRankingForChat(driverId) {
    const driver = (window.DRIVERS || []).find(item => item.id === driverId);
    if (!driver) return '';
    if (!window.raceSessionData) initRaceSessionData();
    const standing = (window.raceSessionData.seasonStandings?.drivers || [])
        .find(item => findDriverMatch(item.name, driver.name));
    if (!standing) {
        return '我这边的赛季积分还在更新里，但围场现在的注意力已经开始往下一站走了。';
    }
    return `我现在赛季积分是 ${standing.points} 分，排在第 ${standing.pos} 位。围场现在的节奏也会自然带着本站和下一站的语气。`;
}

function getSeasonSummary() {
    const standings = buildSeasonStandings().drivers.slice(0, 3);
    const topText = standings
        .map(item => `${item.pos}. ${item.name} ${item.points}分`)
        .join('，');
    const completedCount = getCompletedRaces().length;
    return `当前积分榜前列是：${topText}。目前已经有 ${completedCount} 站拿到了正式结果。`;
}

function getDriverSeasonSummary(driverName) {
    const races = getCompletedRaces()
        .map(race => {
            const sprintResult = (race.sprint || []).find(item => findDriverMatch(item.driver, driverName));
            const raceResult = (race.race || []).find(item => findDriverMatch(item.driver, driverName));
            return {
                round: race.round,
                name: race.gp,
                sprintPosition: sprintResult?.pos || null,
                position: raceResult?.pos || null,
                points: Number(sprintResult?.points || 0) + Number(raceResult?.points || 0)
            };
        })
        .filter(item => item.position || item.sprintPosition);
    return { races };
}

function getDriverRankingAnalysis(driverName) {
    const summary = getDriverSeasonSummary(driverName);
    const standings = buildSeasonStandings().drivers;
    const standing = standings.find(item => findDriverMatch(item.name, driverName));
    if (!standing) return '';
    const bestRace = summary.races.reduce((best, race) => {
        if (!best) return race;
        const bestPos = Number(best.position || 99);
        const nextPos = Number(race.position || 99);
        return nextPos < bestPos ? race : best;
    }, null);
    const bestRaceText = bestRace
        ? `${bestRace.name} 拿到第 ${bestRace.position} 名`
        : '目前还没有完整完赛样本';
    return `${driverName} 目前赛季第 ${standing.pos}，累计 ${standing.points} 分，最好的一站是 ${bestRaceText}。`;
}

function getCurrentRaceContext() {
    const event = getCurrentRaceWeekendEvent();
    if (!event?.race) return '';
    if (event.status === 'live') {
        return `【当前比赛周】现在是 ${event.race.gp} 比赛周，地点在 ${event.race.location}。${event.phase?.note || ''}`;
    }
    if (event.status === 'countdown') {
        return `【当前比赛周】围场正在朝 ${event.race.gp} 靠拢，地点在 ${event.race.location}。${event.phase?.note || ''}`;
    }
    return `【当前比赛周】${event.race.gp} 已经结束了，现在更像赛后余波和下一站之间的过渡期。`;
}

window.initRaceSessionData = initRaceSessionData;
window.getRaceSessionContext = getRaceSessionContext;
window.formatRankingForChat = formatRankingForChat;
window.getSeasonSummary = getSeasonSummary;
window.getDriverSeasonSummary = getDriverSeasonSummary;
window.getDriverRankingAnalysis = getDriverRankingAnalysis;
window.getCurrentRaceWeekendEvent = getCurrentRaceWeekendEvent;
window.getRaceWeekendHeadline = getRaceWeekendHeadline;
window.getCurrentRaceContext = getCurrentRaceContext;

window.addEventListener('standings:updated', () => {
    initRaceSessionData();
});

initRaceSessionData();
