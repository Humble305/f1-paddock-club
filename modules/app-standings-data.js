// 积分榜数据源：默认远程 JSON + 手动导入覆盖 + 内置兜底

const STANDINGS_DATA_STORAGE_KEY = 'f1_standings_data';
const STANDINGS_CONFIG_STORAGE_KEY = 'f1_standings_config';
const STANDINGS_DATA_VERSION = '2026-official-remote-v1';
const DEFAULT_STANDINGS_REMOTE_URL = 'https://raw.githubusercontent.com/Humble305/f1-paddock-club/main/standings.live.json';
const LOCAL_STANDINGS_MIRROR_URL = './standings.live.json';

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
    lastUpdated: '',
    defaultRemoteUrl: DEFAULT_STANDINGS_REMOTE_URL
};

function cloneStandingsList(list = []) {
    return (Array.isArray(list) ? list : []).map(item => ({ ...item }));
}

const BUILTIN_STANDINGS_SNAPSHOT = {
    teamStandings: [
        { name: 'Mercedes', points: 180, color: '#00D2BE' },
        { name: 'Ferrari', points: 110, color: '#DC0000' },
        { name: 'McLaren', points: 94, color: '#FF8700' },
        { name: 'Red Bull', points: 30, color: '#3671C6' },
        { name: 'Alpine', points: 23, color: '#2293D1' },
        { name: 'Haas', points: 18, color: '#B6BABD' },
        { name: 'Racing Bulls', points: 14, color: '#2B6E9F' },
        { name: 'Williams', points: 5, color: '#005AFF' },
        { name: 'Audi', points: 2, color: '#1A1C2B' },
        { name: 'Cadillac', points: 0, color: '#C1C6D1' },
        { name: 'Aston Martin', points: 0, color: '#229971' }
    ],
    driverStandings: [
        { name: 'Kimi Antonelli', team: 'Mercedes', points: 100 },
        { name: 'George Russell', team: 'Mercedes', points: 80 },
        { name: 'Charles Leclerc', team: 'Ferrari', points: 59 },
        { name: 'Lando Norris', team: 'McLaren', points: 51 },
        { name: 'Lewis Hamilton', team: 'Ferrari', points: 51 },
        { name: 'Oscar Piastri', team: 'McLaren', points: 43 },
        { name: 'Max Verstappen', team: 'Red Bull', points: 26 },
        { name: 'Oliver Bearman', team: 'Haas', points: 17 },
        { name: 'Pierre Gasly', team: 'Alpine', points: 16 },
        { name: 'Liam Lawson', team: 'Racing Bulls', points: 10 },
        { name: 'Franco Colapinto', team: 'Alpine', points: 7 },
        { name: 'Arvid Lindblad', team: 'Racing Bulls', points: 4 },
        { name: 'Isack Hadjar', team: 'Red Bull', points: 4 },
        { name: 'Carlos Sainz', team: 'Williams', points: 4 },
        { name: 'Gabriel Bortoleto', team: 'Audi', points: 2 },
        { name: 'Esteban Ocon', team: 'Haas', points: 1 },
        { name: 'Alexander Albon', team: 'Williams', points: 1 },
        { name: 'Nico Hulkenberg', team: 'Audi', points: 0 },
        { name: 'Valtteri Bottas', team: 'Cadillac', points: 0 },
        { name: 'Sergio Perez', team: 'Cadillac', points: 0 },
        { name: 'Fernando Alonso', team: 'Aston Martin', points: 0 },
        { name: 'Lance Stroll', team: 'Aston Martin', points: 0 }
    ]
};

function normalizeStandingsMeta(meta = {}) {
    return {
        source: String(meta.source || '').trim() || 'builtin',
        season: Number(meta.season || 2026) || 2026,
        raceLabel: String(meta.raceLabel || '').trim() || 'Built-in fallback',
        updatedAt: String(meta.updatedAt || '').trim() || ''
    };
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

function normalizeStandingsPayload(payload = {}) {
    const fallback = getBuiltinStandingsPayload();
    const teamStandings = (Array.isArray(payload.teamStandings) ? payload.teamStandings : fallback.teamStandings)
        .map(normalizeTeamStandingEntry)
        .filter(item => item.name);
    const driverStandings = (Array.isArray(payload.driverStandings) ? payload.driverStandings : fallback.driverStandings)
        .map(normalizeDriverStandingEntry)
        .filter(item => item.name);
    const meta = normalizeStandingsMeta(payload.meta || fallback.meta);
    return { meta, teamStandings, driverStandings };
}

function getCurrentStandingsPayload() {
    return {
        meta: { ...standingsMeta },
        teamStandings: cloneStandingsList(window.teamStandings || []),
        driverStandings: cloneStandingsList(window.driverStandings || [])
    };
}

function saveStandingsData() {
    standingsDataConfig.version = STANDINGS_DATA_VERSION;
    secureStorageSet(STANDINGS_DATA_STORAGE_KEY, getCurrentStandingsPayload());
    secureStorageSet(STANDINGS_CONFIG_STORAGE_KEY, standingsDataConfig);
}

function rerenderStandingsConsumers() {
    if (typeof renderStandings === 'function') renderStandings();
    if (typeof renderRaceRankings === 'function') renderRaceRankings();
    if (typeof renderFeed === 'function' && document.getElementById('feedPage')?.classList.contains('active-page')) renderFeed();
    window.dispatchEvent(new CustomEvent('standings:updated', {
        detail: {
            payload: getCurrentStandingsPayload(),
            config: { ...standingsDataConfig }
        }
    }));
}

function applyStandingsPayload(payload = {}, options = {}) {
    const normalized = normalizeStandingsPayload(payload);
    standingsMeta = {
        ...normalized.meta,
        source: options.source || normalized.meta.source || 'builtin',
        updatedAt: options.lastUpdated || normalized.meta.updatedAt || new Date().toISOString()
    };
    window.teamStandings = normalized.teamStandings;
    window.driverStandings = normalized.driverStandings;
    window.defaultTeamStandings = cloneStandingsList(normalized.teamStandings);
    window.defaultDriverStandings = cloneStandingsList(normalized.driverStandings);
    standingsDataConfig = {
        ...standingsDataConfig,
        version: STANDINGS_DATA_VERSION,
        source: options.source || standingsDataConfig.source || 'builtin',
        remoteUrl: options.remoteUrl ?? standingsDataConfig.remoteUrl ?? DEFAULT_STANDINGS_REMOTE_URL,
        lastUpdated: options.lastUpdated || standingsMeta.updatedAt || new Date().toISOString(),
        defaultRemoteUrl: DEFAULT_STANDINGS_REMOTE_URL
    };
    if (options.persist !== false) saveStandingsData();
    if (options.rerender !== false) rerenderStandingsConsumers();
    return normalized;
}

async function loadStandingsData() {
    const storedConfig = secureStorageGet(STANDINGS_CONFIG_STORAGE_KEY, null) || {};
    const storedPayload = secureStorageGet(STANDINGS_DATA_STORAGE_KEY, null);
    standingsDataConfig = {
        ...standingsDataConfig,
        ...storedConfig,
        version: STANDINGS_DATA_VERSION,
        defaultRemoteUrl: DEFAULT_STANDINGS_REMOTE_URL,
        remoteUrl: String(storedConfig.remoteUrl || DEFAULT_STANDINGS_REMOTE_URL).trim() || DEFAULT_STANDINGS_REMOTE_URL
    };

    const storedSource = String(storedConfig.source || '').trim();
    const storedVersion = String(storedConfig.version || '').trim();
    const isVersionMatch = storedVersion === STANDINGS_DATA_VERSION;

    if (storedSource === 'manual' && storedPayload) {
        return applyStandingsPayload(storedPayload, {
            persist: false,
            rerender: false,
            source: 'manual',
            remoteUrl: standingsDataConfig.remoteUrl,
            lastUpdated: standingsDataConfig.lastUpdated || new Date().toISOString()
        });
    }

    const remoteCandidates = [
        standingsDataConfig.remoteUrl || DEFAULT_STANDINGS_REMOTE_URL,
        LOCAL_STANDINGS_MIRROR_URL
    ].filter((url, index, list) => url && list.indexOf(url) === index);
    for (const remoteUrl of remoteCandidates) {
        try {
            return await refreshStandingsFromUrl(remoteUrl, {
                persist: true,
                rerender: false
            });
        } catch (error) {
            console.warn(`Failed to refresh standings from ${remoteUrl}, trying next fallback:`, error);
        }
    }

    if (storedSource === 'remote' && storedPayload && isVersionMatch) {
        return applyStandingsPayload(storedPayload, {
            persist: false,
            rerender: false,
            source: 'remote',
            remoteUrl: standingsDataConfig.remoteUrl || DEFAULT_STANDINGS_REMOTE_URL,
            lastUpdated: standingsDataConfig.lastUpdated || new Date().toISOString()
        });
    }

    standingsDataConfig = {
        version: STANDINGS_DATA_VERSION,
        source: 'builtin',
        remoteUrl: DEFAULT_STANDINGS_REMOTE_URL,
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
        rerender: options.rerender !== false
    });
}

window.getBuiltinStandingsPayload = getBuiltinStandingsPayload;
window.getCurrentStandingsPayload = getCurrentStandingsPayload;
window.getCurrentStandingsMeta = () => ({ ...standingsMeta });
window.applyStandingsPayload = applyStandingsPayload;
window.loadStandingsData = loadStandingsData;
window.resetStandingsData = resetStandingsData;
window.refreshStandingsFromUrl = refreshStandingsFromUrl;
window.getStandingsDataConfig = () => ({ ...standingsDataConfig });
window.getDefaultStandingsRemoteUrl = () => DEFAULT_STANDINGS_REMOTE_URL;
