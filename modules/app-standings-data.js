// 积分榜数据源：默认本地数据 + 本地持久化覆盖 + 远程 JSON 入口

const STANDINGS_DATA_STORAGE_KEY = 'f1_standings_data';
const STANDINGS_CONFIG_STORAGE_KEY = 'f1_standings_config';

let standingsDataConfig = {
    source: 'builtin',
    remoteUrl: '',
    lastUpdated: ''
};

function cloneStandingsList(list = []) {
    return (Array.isArray(list) ? list : []).map(item => ({ ...item }));
}

function getBuiltinStandingsPayload() {
    return {
        teamStandings: cloneStandingsList(window.defaultTeamStandings || window.teamStandings || []),
        driverStandings: cloneStandingsList(window.defaultDriverStandings || window.driverStandings || [])
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
    return { teamStandings, driverStandings };
}

function getCurrentStandingsPayload() {
    return {
        teamStandings: cloneStandingsList(window.teamStandings || []),
        driverStandings: cloneStandingsList(window.driverStandings || [])
    };
}

function saveStandingsData() {
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
    window.teamStandings = normalized.teamStandings;
    window.driverStandings = normalized.driverStandings;
    standingsDataConfig = {
        ...standingsDataConfig,
        source: options.source || standingsDataConfig.source || 'builtin',
        remoteUrl: options.remoteUrl ?? standingsDataConfig.remoteUrl ?? '',
        lastUpdated: options.lastUpdated || new Date().toISOString()
    };
    if (options.persist !== false) saveStandingsData();
    if (options.rerender !== false) rerenderStandingsConsumers();
    return normalized;
}

function loadStandingsData() {
    standingsDataConfig = {
        ...standingsDataConfig,
        ...(secureStorageGet(STANDINGS_CONFIG_STORAGE_KEY, standingsDataConfig) || {})
    };
    const storedPayload = secureStorageGet(STANDINGS_DATA_STORAGE_KEY, null);
    return applyStandingsPayload(storedPayload || getBuiltinStandingsPayload(), {
        persist: false,
        rerender: false,
        source: storedPayload ? (standingsDataConfig.source || 'local') : 'builtin',
        remoteUrl: standingsDataConfig.remoteUrl || '',
        lastUpdated: standingsDataConfig.lastUpdated || ''
    });
}

function resetStandingsData() {
    standingsDataConfig = {
        source: 'builtin',
        remoteUrl: '',
        lastUpdated: new Date().toISOString()
    };
    return applyStandingsPayload(getBuiltinStandingsPayload(), { source: 'builtin' });
}

async function refreshStandingsFromUrl(url = '', options = {}) {
    const targetUrl = String(url || standingsDataConfig.remoteUrl || '').trim();
    if (!targetUrl) throw new Error('缺少积分数据地址');
    const response = await fetch(targetUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    return applyStandingsPayload(payload, {
        source: 'remote',
        remoteUrl: targetUrl,
        lastUpdated: new Date().toISOString(),
        persist: options.persist !== false,
        rerender: options.rerender !== false
    });
}

window.getBuiltinStandingsPayload = getBuiltinStandingsPayload;
window.getCurrentStandingsPayload = getCurrentStandingsPayload;
window.applyStandingsPayload = applyStandingsPayload;
window.loadStandingsData = loadStandingsData;
window.resetStandingsData = resetStandingsData;
window.refreshStandingsFromUrl = refreshStandingsFromUrl;
window.getStandingsDataConfig = () => ({ ...standingsDataConfig });
