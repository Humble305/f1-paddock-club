// 直接双击打开 index.html 时，积分页优先读取这份本地数据包。
// 后面如果你还是用本地直开方式玩，手改积分就改这个文件。

window.STANDINGS_LIVE_PAYLOAD = {
    meta: {
        source: 'local',
        season: 2026,
        raceLabel: 'British Grand Prix',
        updatedAt: '2026-07-06T20:58:02+08:00'
    },
    predictionResult: {
        round: 11,
        pole: 'Kimi Antonelli',
        winner: 'Charles Leclerc',
        podium: [
            'George Russell',
            'Lewis Hamilton'
        ]
    },
    latestRaceResult: {
        round: 11,
        raceLabel: 'British Grand Prix',
        qualifying: [
            { pos: 1, driver: 'Kimi Antonelli', team: 'Mercedes', time: '1:28.111' }
        ],
        sprint: [
            { pos: 1, driver: 'Kimi Antonelli', team: 'Mercedes', points: 8 },
            { pos: 2, driver: 'Lewis Hamilton', team: 'Ferrari', points: 7 },
            { pos: 3, driver: 'Lando Norris', team: 'McLaren', points: 6 },
            { pos: 4, driver: 'George Russell', team: 'Mercedes', points: 5 },
            { pos: 5, driver: 'Charles Leclerc', team: 'Ferrari', points: 4 },
            { pos: 6, driver: 'Max Verstappen', team: 'Red Bull', points: 3 },
            { pos: 7, driver: 'Oscar Piastri', team: 'McLaren', points: 2 },
            { pos: 8, driver: 'Liam Lawson', team: 'Racing Bulls', points: 1 }
        ],
        race: [
            { pos: 1, driver: 'Charles Leclerc', team: 'Ferrari', points: 25 },
            { pos: 2, driver: 'George Russell', team: 'Mercedes', points: 18 },
            { pos: 3, driver: 'Lewis Hamilton', team: 'Ferrari', points: 15 },
            { pos: 4, driver: 'Lando Norris', team: 'McLaren', points: 12 },
            { pos: 5, driver: 'Isack Hadjar', team: 'Red Bull', points: 10 },
            { pos: 6, driver: 'Liam Lawson', team: 'Racing Bulls', points: 8 },
            { pos: 7, driver: 'Arvid Lindblad', team: 'Racing Bulls', points: 6 },
            { pos: 8, driver: 'Gabriel Bortoleto', team: 'Audi', points: 4 },
            { pos: 9, driver: 'Franco Colapinto', team: 'Alpine', points: 2 },
            { pos: 10, driver: 'Pierre Gasly', team: 'Alpine', points: 1 }
        ]
    },
    teamStandings: [
        { name: 'Mercedes', points: 333, color: '#00D2BE' },
        { name: 'Ferrari', points: 255, color: '#DC0000' },
        { name: 'McLaren', points: 179, color: '#FF8700' },
        { name: 'Red Bull', points: 128, color: '#3671C6' },
        { name: 'Alpine', points: 60, color: '#2293D1' },
        { name: 'Racing Bulls', points: 59, color: '#2B6E9F' },
        { name: 'Haas', points: 21, color: '#B6BABD' },
        { name: 'Williams', points: 11, color: '#005AFF' },
        { name: 'Audi', points: 6, color: '#1A1C2B' },
        { name: 'Aston Martin', points: 1, color: '#229971' },
        { name: 'Cadillac', points: 0, color: '#C1C6D1' }
    ],
    driverStandings: [
        { name: 'Kimi Antonelli', team: 'Mercedes', points: 179 },
        { name: 'George Russell', team: 'Mercedes', points: 154 },
        { name: 'Lewis Hamilton', team: 'Ferrari', points: 147 },
        { name: 'Charles Leclerc', team: 'Ferrari', points: 108 },
        { name: 'Lando Norris', team: 'McLaren', points: 97 },
        { name: 'Oscar Piastri', team: 'McLaren', points: 82 },
        { name: 'Max Verstappen', team: 'Red Bull', points: 76 },
        { name: 'Isack Hadjar', team: 'Red Bull', points: 52 },
        { name: 'Pierre Gasly', team: 'Alpine', points: 42 },
        { name: 'Liam Lawson', team: 'Racing Bulls', points: 39 },
        { name: 'Arvid Lindblad', team: 'Racing Bulls', points: 20 },
        { name: 'Oliver Bearman', team: 'Haas', points: 18 },
        { name: 'Franco Colapinto', team: 'Alpine', points: 18 },
        { name: 'Gabriel Bortoleto', team: 'Audi', points: 6 },
        { name: 'Carlos Sainz', team: 'Williams', points: 6 },
        { name: 'Alexander Albon', team: 'Williams', points: 5 },
        { name: 'Esteban Ocon', team: 'Haas', points: 3 },
        { name: 'Fernando Alonso', team: 'Aston Martin', points: 1 },
        { name: 'Nico Hulkenberg', team: 'Audi', points: 0 },
        { name: 'Valtteri Bottas', team: 'Cadillac', points: 0 },
        { name: 'Sergio Perez', team: 'Cadillac', points: 0 },
        { name: 'Lance Stroll', team: 'Aston Martin', points: 0 }
    ]
};
