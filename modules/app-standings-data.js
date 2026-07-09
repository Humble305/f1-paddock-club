// 积分榜数据源：默认远程 JSON + 手动导入覆盖 + 内置兜底

const STANDINGS_DATA_STORAGE_KEY = 'f1_standings_data';
const STANDINGS_CONFIG_STORAGE_KEY = 'f1_standings_config';
const STANDINGS_DATA_VERSION = '2026-official-remote-v1';
const DEFAULT_STANDINGS_REMOTE_URL = 'https://raw.githubusercontent.com/Humble305/f1-paddock-club/main/standings.live.json';
const FORMULA1_OFFICIAL_DRIVERS_URL = 'https://www.formula1.com/en/results/2026/drivers';
const FORMULA1_OFFICIAL_TEAMS_URL = 'https://www.formula1.com/en/results/2026/team';
const LOCAL_STANDINGS_MIRROR_URL = './standings.live.json';
const LOCAL_STANDINGS_BUNDLE_URL = './standings.live.bundle.js';

let standingsMeta = {
    source: 'builtin',
    season: 2026,
    raceLabel: 'Built-in fallback',
    updatedAt: ''
};

let standingsDataConfig = {
    version: STANDINGS_DATA_VERSION,
    source: 'builtin',
    remoteUrl: DEFAULT_STANDINGS_REMOTE_URL,
    officialDriversUrl: FORMULA1_OFFICIAL_DRIVERS_URL,
    officialTeamsUrl: FORMULA1_OFFICIAL_TEAMS_URL,
    lastUpdated: '',
    defaultRemoteUrl: DEFAULT_STANDINGS_REMOTE_URL
};

function cloneStandingsList(list = []) {
    return (Array.isArray(list) ? list : []).map(item => ({ ...item }));
}

const BUILTIN_STANDINGS_SNAPSHOT = {
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

const OFFICIAL_TEAM_NAME_MAP = {
    Mercedes: { name: 'Mercedes', color: '#00D2BE' },
    Ferrari: { name: 'Ferrari', color: '#DC0000' },
    McLaren: { name: 'McLaren', color: '#FF8700' },
    'Red Bull Racing': { name: 'Red Bull', color: '#3671C6' },
    'Red Bull': { name: 'Red Bull', color: '#3671C6' },
    Alpine: { name: 'Alpine', color: '#2293D1' },
    'Haas F1 Team': { name: 'Haas', color: '#B6BABD' },
    Haas: { name: 'Haas', color: '#B6BABD' },
    'Racing Bulls': { name: 'Racing Bulls', color: '#2B6E9F' },
    Williams: { name: 'Williams', color: '#005AFF' },
    Audi: { name: 'Audi', color: '#1A1C2B' },
    Cadillac: { name: 'Cadillac', color: '#C1C6D1' },
    'Aston Martin': { name: 'Aston Martin', color: '#229971' }
};

const OFFICIAL_DRIVER_NAME_MAP = {
    'Kimi Antonelli': 'Kimi Antonelli',
    'George Russell': 'George Russell',
    'Charles Leclerc': 'Charles Leclerc',
    'Lando Norris': 'Lando Norris',
    'Lewis Hamilton': 'Lewis Hamilton',
    'Oscar Piastri': 'Oscar Piastri',
    'Max Verstappen': 'Max Verstappen',
    'Oliver Bearman': 'Oliver Bearman',
    'Pierre Gasly': 'Pierre Gasly',
    'Liam Lawson': 'Liam Lawson',
    'Franco Colapinto': 'Franco Colapinto',
    'Arvid Lindblad': 'Arvid Lindblad',
    'Isack Hadjar': 'Isack Hadjar',
    'Carlos Sainz': 'Carlos Sainz',
    'Gabriel Bortoleto': 'Gabriel Bortoleto',
    'Esteban Ocon': 'Esteban Ocon',
    'Alexander Albon': 'Alexander Albon',
    'Nico Hulkenberg': 'Nico Hulkenberg',
    'Nico Hülkenberg': 'Nico Hulkenberg',
    'Valtteri Bottas': 'Valtteri Bottas',
    'Sergio Perez': 'Sergio Perez',
    'Sergio Pérez': 'Sergio Perez',
    'Fernando Alonso': 'Fernando Alonso',
    'Lance Stroll': 'Lance Stroll'
};

function normalizeStandingsMeta(meta = {}) {
    return {
        source: String(meta.source || '').trim() || 'builtin',
        season: Number(meta.season || 2026) || 2026,
        raceLabel: String(meta.raceLabel || '').trim() || 'Built-in fallback',
        updatedAt: String(meta.updatedAt || '').trim() || ''
    };
}

function normalizePredictionResultEntry(entry = {}, fallbackRound = 0) {
    if (!entry || typeof entry !== 'object') return null;
    const round = Number(entry.round || fallbackRound || 0);
    const pole = String(entry.pole || '').trim();
    const winner = String(entry.winner || '').trim();
    const podium = (Array.isArray(entry.podium) ? entry.podium : [])
        .map(name => String(name || '').trim())
        .filter(Boolean)
        .slice(0, 2);
    if (!round || !pole || !winner || podium.length < 2) return null;
    return { round, pole, winner, podium };
}

function normalizeStandingsPredictionResult(payload = {}, meta = {}) {
    const direct = normalizePredictionResultEntry(payload.predictionResult, meta.currentRound);
    if (direct) return direct;

    if (Array.isArray(payload.predictionResults)) {
        const first = payload.predictionResults
            .map(item => normalizePredictionResultEntry(item, meta.currentRound))
            .find(Boolean);
        if (first) return first;
    }

    if (payload.predictionResults && typeof payload.predictionResults === 'object') {
        const entries = Object.entries(payload.predictionResults)
            .map(([roundKey, item]) => normalizePredictionResultEntry({
                round: item?.round || roundKey,
                pole: item?.pole,
                winner: item?.winner,
                podium: item?.podium
            }, meta.currentRound))
            .filter(Boolean)
            .sort((left, right) => right.round - left.round);
        if (entries.length) return entries[0];
    }

    return null;
}

function getBuiltinStandingsPayload() {
    return {
        meta: {
            source: 'builtin',
            season: 2026,
            raceLabel: 'Built-in fallback',
            updatedAt: ''
        },
        teamStandings: cloneStandingsList(BUILTIN_STANDINGS_SNAPSHOT.teamStandings),
        driverStandings: cloneStandingsList(BUILTIN_STANDINGS_SNAPSHOT.driverStandings)
    };
}

function getBundledStandingsPayload() {
    const payload = window.STANDINGS_LIVE_PAYLOAD;
    if (!payload || typeof payload !== 'object') return null;
    return payload;
}

function shouldPreferBundledStandingsPayload() {
    return window.location?.protocol === 'file:';
}

function decodeStandingsHtmlEntities(input) {
    const parser = document.createElement('textarea');
    parser.innerHTML = String(input || '');
    return parser.value;
}

function officialStandingsHtmlToTokens(html) {
    return decodeStandingsHtmlEntities(
        String(html || '')
            .replace(/<script[\s\S]*?<\/script>/gi, ' ')
            .replace(/<style[\s\S]*?<\/style>/gi, ' ')
            .replace(/<(br|\/p|\/div|\/section|\/article|\/header|\/footer|\/li|\/tr|\/td|\/th|\/h1|\/h2|\/h3|\/h4|\/a)>/gi, '\n')
            .replace(/<[^>]+>/g, ' ')
    )
        .split(/\n+/)
        .map(token => token.replace(/\s+/g, ' ').trim())
        .filter(Boolean);
}

function findOfficialStandingsSection(tokens, headingText) {
    const start = tokens.findIndex(token => token.includes(headingText));
    if (start === -1) {
        throw new Error(`F1 官方页面结构变了：找不到 "${headingText}"`);
    }
    const end = tokens.findIndex((token, index) => index > start && token.includes('OUR PARTNERS'));
    return tokens.slice(start, end === -1 ? undefined : end);
}

function stripOfficialDriverAbbreviation(nameToken) {
    return String(nameToken || '').replace(/\s+[A-Z]{3}$/, '').trim();
}

function normalizeOfficialLookupKey(value = '') {
    return String(value || '')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function getOfficialMappedTeam(teamLabel = '') {
    const direct = OFFICIAL_TEAM_NAME_MAP[teamLabel];
    if (direct) return direct;
    const lookupKey = normalizeOfficialLookupKey(teamLabel);
    const match = Object.entries(OFFICIAL_TEAM_NAME_MAP)
        .find(([label]) => normalizeOfficialLookupKey(label) === lookupKey);
    return match ? match[1] : null;
}

function getOfficialMappedDriver(driverLabel = '') {
    const direct = OFFICIAL_DRIVER_NAME_MAP[driverLabel];
    if (direct) return direct;
    const lookupKey = normalizeOfficialLookupKey(driverLabel);
    const match = Object.entries(OFFICIAL_DRIVER_NAME_MAP)
        .find(([label]) => normalizeOfficialLookupKey(label) === lookupKey);
    return match ? match[1] : null;
}

function parseOfficialPoints(pointsToken = '') {
    const normalized = String(pointsToken || '').replace(/,/g, '').trim();
    if (!/^\d+$/.test(normalized)) return null;
    return Number(normalized);
}

function parseOfficialTeams(tokens = []) {
    const section = findOfficialStandingsSection(tokens, "2026 Teams' Standings");
    const entries = [];
    for (let index = 0; index < section.length; index += 1) {
        if (!/^\d+$/.test(section[index])) continue;
        const teamLabel = section[index + 1];
        const points = parseOfficialPoints(section[index + 2]);
        if (!teamLabel || points === null) continue;
        const mappedTeam = getOfficialMappedTeam(teamLabel);
        if (!mappedTeam) {
            throw new Error(`F1 官方车队名称还没有映射：${teamLabel}`);
        }
        entries.push({
            name: mappedTeam.name,
            color: mappedTeam.color,
            points
        });
    }
    if (!entries.length) {
        throw new Error('F1 官方车队积分解析为空，已保留旧积分。');
    }
    return entries;
}

function parseOfficialDrivers(tokens = []) {
    const section = findOfficialStandingsSection(tokens, "2026 Drivers' Standings");
    const entries = [];
    for (let index = 0; index < section.length; index += 1) {
        if (!/^\d+$/.test(section[index])) continue;
        const rawName = section[index + 1];
        const nationality = section[index + 2];
        const teamLabel = section[index + 3];
        const points = parseOfficialPoints(section[index + 4]);
        if (!rawName || !nationality || !teamLabel || points === null) continue;
        const cleanName = stripOfficialDriverAbbreviation(rawName);
        const mappedName = getOfficialMappedDriver(cleanName);
        const mappedTeam = getOfficialMappedTeam(teamLabel);
        if (!mappedName) {
            throw new Error(`F1 官方车手名称还没有映射：${cleanName}`);
        }
        if (!mappedTeam) {
            throw new Error(`F1 官方车队名称还没有映射：${teamLabel}`);
        }
        entries.push({
            name: mappedName,
            team: mappedTeam.name,
            points
        });
    }
    if (!entries.length) {
        throw new Error('F1 官方车手积分解析为空，已保留旧积分。');
    }
    return entries;
}

function normalizeTeamStandingEntry(entry = {}) {
    return {
        name: String(entry.name || '').trim(),
        points: Number(entry.points || 0),
        color: String(entry.color || '#9aa5b5').trim() || '#9aa5b5'
    };
}

function normalizeDriverStandingEntry(entry = {}) {
    return {
        name: String(entry.name || '').trim(),
        team: String(entry.team || '').trim(),
        points: Number(entry.points || 0)
    };
}

function normalizeLatestRaceResult(payload = {}) {
    const raw = payload?.latestRaceResult;
    if (!raw || typeof raw !== 'object') return null;
    const round = Number(raw.round || 0);
    if (!round) return null;
    const normalizeRows = rows => (Array.isArray(rows) ? rows : [])
        .map(item => ({
            pos: Number(item?.pos || 0),
            driver: String(item?.driver || '').trim(),
            team: String(item?.team || '').trim(),
            points: Number(item?.points || 0),
            time: String(item?.time || '').trim()
        }))
        .filter(item => item.pos > 0 && item.driver);
    const race = normalizeRows(raw.race);
    if (!race.length) return null;
    return {
        round,
        raceLabel: String(raw.raceLabel || '').trim() || `Round ${round}`,
        qualifying: normalizeRows(raw.qualifying),
        sprint: normalizeRows(raw.sprint),
        race
    };
}

function normalizeStandingsPayload(payload = {}) {
    const fallback = getBuiltinStandingsPayload();
    const teamStandings = (Array.isArray(payload.teamStandings) ? payload.teamStandings : fallback.teamStandings)
        .map(normalizeTeamStandingEntry)
        .filter(item => item.name);
    const driverStandings = (Array.isArray(payload.driverStandings) ? payload.driverStandings : fallback.driverStandings)
        .map(normalizeDriverStandingEntry)
        .filter(item => item.name);
    const meta = normalizeStandingsMeta(payload.meta || fallback.meta);
    const predictionResult = normalizeStandingsPredictionResult(payload, meta);
    const latestRaceResult = normalizeLatestRaceResult(payload);
    return { meta, predictionResult, latestRaceResult, teamStandings, driverStandings };
}

function getCurrentStandingsPayload() {
    return {
        meta: { ...standingsMeta },
        predictionResult: window.__standingsPredictionResult ? { ...window.__standingsPredictionResult } : null,
        latestRaceResult: window.__standingsLatestRaceResult ? {
            ...window.__standingsLatestRaceResult,
            qualifying: cloneStandingsList(window.__standingsLatestRaceResult.qualifying),
            sprint: cloneStandingsList(window.__standingsLatestRaceResult.sprint),
            race: cloneStandingsList(window.__standingsLatestRaceResult.race)
        } : null,
        teamStandings: cloneStandingsList(window.teamStandings || []),
        driverStandings: cloneStandingsList(window.driverStandings || [])
    };
}

function createStandingsComparisonSignature(payload = {}) {
    const teamSignature = (Array.isArray(payload.teamStandings) ? payload.teamStandings : [])
        .map(item => ({
            name: String(item?.name || '').trim(),
            points: Number(item?.points || 0)
        }));
    const driverSignature = (Array.isArray(payload.driverStandings) ? payload.driverStandings : [])
        .map(item => ({
            name: String(item?.name || '').trim(),
            team: String(item?.team || '').trim(),
            points: Number(item?.points || 0)
        }));
    return JSON.stringify({ teamStandings: teamSignature, driverStandings: driverSignature });
}

function hasStandingsPayloadChanged(previousPayload = {}, nextPayload = {}) {
    return createStandingsComparisonSignature(previousPayload) !== createStandingsComparisonSignature(nextPayload);
}

function saveStandingsData() {
    standingsDataConfig.version = STANDINGS_DATA_VERSION;
    secureStorageSet(STANDINGS_DATA_STORAGE_KEY, getCurrentStandingsPayload());
    secureStorageSet(STANDINGS_CONFIG_STORAGE_KEY, standingsDataConfig);
}

function rerenderStandingsConsumers(changed = false) {
    window.dispatchEvent(new CustomEvent('standings:updated', {
        detail: {
            payload: getCurrentStandingsPayload(),
            config: { ...standingsDataConfig },
            changed: Boolean(changed)
        }
    }));
    if (typeof renderStandings === 'function') renderStandings();
    if (typeof renderRaceRankings === 'function') renderRaceRankings();
    if (typeof renderFeed === 'function' && document.getElementById('feedPage')?.classList.contains('active-page')) renderFeed();
}

function applyStandingsPayload(payload = {}, options = {}) {
    const previousPayload = getCurrentStandingsPayload();
    const normalized = normalizeStandingsPayload(payload);
    const changed = options.changed ?? hasStandingsPayloadChanged(previousPayload, normalized);
    standingsMeta = {
        ...normalized.meta,
        source: options.source || normalized.meta.source || 'builtin',
        updatedAt: options.lastUpdated || normalized.meta.updatedAt || new Date().toISOString()
    };
    window.teamStandings = normalized.teamStandings;
    window.driverStandings = normalized.driverStandings;
    window.defaultTeamStandings = cloneStandingsList(normalized.teamStandings);
    window.defaultDriverStandings = cloneStandingsList(normalized.driverStandings);
    window.__standingsPredictionResult = normalized.predictionResult ? { ...normalized.predictionResult } : null;
    window.__standingsLatestRaceResult = normalized.latestRaceResult ? {
        ...normalized.latestRaceResult,
        qualifying: cloneStandingsList(normalized.latestRaceResult.qualifying),
        sprint: cloneStandingsList(normalized.latestRaceResult.sprint),
        race: cloneStandingsList(normalized.latestRaceResult.race)
    } : null;
    standingsDataConfig = {
        ...standingsDataConfig,
        version: STANDINGS_DATA_VERSION,
        source: options.source || standingsDataConfig.source || 'builtin',
        remoteUrl: options.remoteUrl ?? standingsDataConfig.remoteUrl ?? DEFAULT_STANDINGS_REMOTE_URL,
        officialDriversUrl: FORMULA1_OFFICIAL_DRIVERS_URL,
        officialTeamsUrl: FORMULA1_OFFICIAL_TEAMS_URL,
        lastUpdated: options.lastUpdated || standingsMeta.updatedAt || new Date().toISOString(),
        defaultRemoteUrl: DEFAULT_STANDINGS_REMOTE_URL
    };
    if (window.__standingsPredictionResult && typeof window.applyPredictionResultsFromStandings === 'function') {
        window.applyPredictionResultsFromStandings(window.__standingsPredictionResult, {
            openModal: options.openPredictionModal !== false
        });
    }
    if (options.persist !== false) saveStandingsData();
    if (options.rerender !== false) rerenderStandingsConsumers(changed);
    return { ...normalized, changed };
}

async function loadStandingsData() {
    const storedConfig = secureStorageGet(STANDINGS_CONFIG_STORAGE_KEY, null) || {};
    const storedPayload = secureStorageGet(STANDINGS_DATA_STORAGE_KEY, null);
    standingsDataConfig = {
        ...standingsDataConfig,
        ...storedConfig,
        version: STANDINGS_DATA_VERSION,
        defaultRemoteUrl: DEFAULT_STANDINGS_REMOTE_URL,
        officialDriversUrl: FORMULA1_OFFICIAL_DRIVERS_URL,
        officialTeamsUrl: FORMULA1_OFFICIAL_TEAMS_URL,
        remoteUrl: String(storedConfig.remoteUrl || DEFAULT_STANDINGS_REMOTE_URL).trim() || DEFAULT_STANDINGS_REMOTE_URL
    };

    const storedSource = String(storedConfig.source || '').trim();
    const storedVersion = String(storedConfig.version || '').trim();
    const isVersionMatch = storedVersion === STANDINGS_DATA_VERSION;

    if (shouldPreferBundledStandingsPayload()) {
        const bundledPayload = getBundledStandingsPayload();
        if (bundledPayload) {
            return applyStandingsPayload(bundledPayload, {
                persist: true,
                rerender: false,
                source: 'local',
                remoteUrl: LOCAL_STANDINGS_BUNDLE_URL,
                lastUpdated: bundledPayload?.meta?.updatedAt || new Date().toISOString(),
                openPredictionModal: false
            });
        }
    }

    const localMirrorUrl = LOCAL_STANDINGS_MIRROR_URL;
    if (localMirrorUrl) {
        try {
            return await refreshStandingsFromUrl(localMirrorUrl, {
                source: 'local',
                persist: true,
                rerender: false
            });
        } catch (error) {
            console.warn(`Failed to refresh standings from local mirror ${localMirrorUrl}, trying next fallback:`, error);
        }
    }

    if (storedSource === 'manual' && storedPayload && isVersionMatch) {
        return applyStandingsPayload(storedPayload, {
            persist: false,
            rerender: false,
            source: 'manual',
            remoteUrl: standingsDataConfig.remoteUrl,
            lastUpdated: standingsDataConfig.lastUpdated || new Date().toISOString()
        });
    }

    const remoteCandidates = [
        standingsDataConfig.remoteUrl || DEFAULT_STANDINGS_REMOTE_URL
    ].filter((url, index, list) => url && list.indexOf(url) === index && url !== LOCAL_STANDINGS_MIRROR_URL);
    for (const remoteUrl of remoteCandidates) {
        try {
            return await refreshStandingsFromUrl(remoteUrl, {
                source: 'remote',
                persist: true,
                rerender: false
            });
        } catch (error) {
            console.warn(`Failed to refresh standings from ${remoteUrl}, trying next fallback:`, error);
        }
    }

    if ((storedSource === 'remote' || storedSource === 'local') && storedPayload && isVersionMatch) {
        return applyStandingsPayload(storedPayload, {
            persist: false,
            rerender: false,
            source: storedSource || 'remote',
            remoteUrl: standingsDataConfig.remoteUrl || DEFAULT_STANDINGS_REMOTE_URL,
            lastUpdated: standingsDataConfig.lastUpdated || new Date().toISOString()
        });
    }

    standingsDataConfig = {
        version: STANDINGS_DATA_VERSION,
        source: 'builtin',
        remoteUrl: DEFAULT_STANDINGS_REMOTE_URL,
        officialDriversUrl: FORMULA1_OFFICIAL_DRIVERS_URL,
        officialTeamsUrl: FORMULA1_OFFICIAL_TEAMS_URL,
        lastUpdated: new Date().toISOString(),
        defaultRemoteUrl: DEFAULT_STANDINGS_REMOTE_URL
    };
    return applyStandingsPayload(getBuiltinStandingsPayload(), {
        persist: true,
        rerender: false,
        source: 'builtin',
        remoteUrl: DEFAULT_STANDINGS_REMOTE_URL,
        lastUpdated: standingsDataConfig.lastUpdated
    });
}

function resetStandingsData() {
    standingsMeta = normalizeStandingsMeta(getBuiltinStandingsPayload().meta);
    standingsDataConfig = {
        version: STANDINGS_DATA_VERSION,
        source: 'builtin',
        remoteUrl: DEFAULT_STANDINGS_REMOTE_URL,
        officialDriversUrl: FORMULA1_OFFICIAL_DRIVERS_URL,
        officialTeamsUrl: FORMULA1_OFFICIAL_TEAMS_URL,
        lastUpdated: new Date().toISOString(),
        defaultRemoteUrl: DEFAULT_STANDINGS_REMOTE_URL
    };
    return applyStandingsPayload(getBuiltinStandingsPayload(), {
        source: 'builtin',
        remoteUrl: DEFAULT_STANDINGS_REMOTE_URL,
        lastUpdated: standingsDataConfig.lastUpdated
    });
}

async function refreshStandingsFromUrl(url = '', options = {}) {
    const targetUrl = String(url || standingsDataConfig.remoteUrl || DEFAULT_STANDINGS_REMOTE_URL).trim();
    if (!targetUrl) throw new Error('缺少积分数据地址');
    const response = await fetch(targetUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    return applyStandingsPayload(payload, {
        source: options.source || 'remote',
        remoteUrl: targetUrl,
        lastUpdated: payload?.meta?.updatedAt || new Date().toISOString(),
        persist: options.persist !== false,
        rerender: options.rerender !== false,
        openPredictionModal: options.openPredictionModal
    });
}

async function refreshStandingsFromFallback(options = {}) {
    const errors = [];
    try {
        return await refreshStandingsFromUrl(LOCAL_STANDINGS_MIRROR_URL, {
            source: 'local',
            openPredictionModal: false,
            persist: options.persist !== false,
            rerender: options.rerender !== false
        });
    } catch (error) {
        errors.push(`local JSON: ${error.message || error}`);
    }

    const bundledPayload = getBundledStandingsPayload();
    if (bundledPayload) {
        return applyStandingsPayload(bundledPayload, {
            source: 'local',
            remoteUrl: LOCAL_STANDINGS_BUNDLE_URL,
            lastUpdated: bundledPayload?.meta?.updatedAt || new Date().toISOString(),
            openPredictionModal: false,
            persist: options.persist !== false,
            rerender: options.rerender !== false
        });
    }

    try {
        return await refreshStandingsFromUrl(DEFAULT_STANDINGS_REMOTE_URL, {
            source: 'remote',
            openPredictionModal: false,
            persist: options.persist !== false,
            rerender: options.rerender !== false
        });
    } catch (error) {
        errors.push(`remote JSON: ${error.message || error}`);
    }
    throw new Error(`所有积分镜像均刷新失败：${errors.join('；')}`);
}

async function fetchOfficialStandingsPage(url = '') {
    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
    } catch (error) {
        throw new Error(`无法直接连接 F1 官方积分页。浏览器可能拦截了跨域请求：${error.message || error}`);
    }
}

async function refreshStandingsFromOfficial(options = {}) {
    const [driversHtml, teamsHtml] = await Promise.all([
        fetchOfficialStandingsPage(FORMULA1_OFFICIAL_DRIVERS_URL),
        fetchOfficialStandingsPage(FORMULA1_OFFICIAL_TEAMS_URL)
    ]);
    const currentPayload = getCurrentStandingsPayload();
    const driverStandings = parseOfficialDrivers(officialStandingsHtmlToTokens(driversHtml));
    const teamStandings = parseOfficialTeams(officialStandingsHtmlToTokens(teamsHtml));
    const updatedAt = new Date().toISOString();
    const payload = {
        meta: {
            source: 'formula1.com',
            season: 2026,
            raceLabel: 'Latest official standings',
            updatedAt
        },
        predictionResult: currentPayload.predictionResult || null,
        latestRaceResult: currentPayload.latestRaceResult || null,
        teamStandings,
        driverStandings
    };
    return applyStandingsPayload(payload, {
        source: 'formula1.com',
        remoteUrl: options.remoteUrl ?? standingsDataConfig.remoteUrl ?? DEFAULT_STANDINGS_REMOTE_URL,
        lastUpdated: updatedAt,
        persist: options.persist !== false,
        rerender: options.rerender !== false,
        openPredictionModal: false
    });
}

window.getBuiltinStandingsPayload = getBuiltinStandingsPayload;
window.getCurrentStandingsPayload = getCurrentStandingsPayload;
window.getCurrentStandingsMeta = () => ({ ...standingsMeta });
window.applyStandingsPayload = applyStandingsPayload;
window.loadStandingsData = loadStandingsData;
window.resetStandingsData = resetStandingsData;
window.refreshStandingsFromUrl = refreshStandingsFromUrl;
window.refreshStandingsFromFallback = refreshStandingsFromFallback;
window.refreshStandingsFromOfficial = refreshStandingsFromOfficial;
window.getStandingsDataConfig = () => ({ ...standingsDataConfig });
window.getDefaultStandingsRemoteUrl = () => DEFAULT_STANDINGS_REMOTE_URL;
window.getOfficialStandingsUrls = () => ({
    drivers: FORMULA1_OFFICIAL_DRIVERS_URL,
    teams: FORMULA1_OFFICIAL_TEAMS_URL
});
window.getBundledStandingsPayload = getBundledStandingsPayload;
