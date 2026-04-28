// 全局状态与主题系统

let raceSessionData = null;
let favorability = {};
let driverDateMemories = {};
let driverDiaries = {};
let groupDiaries = {};
let pinnedDrivers = [];
let chatHistories = {};
let driverAvatars = {};
let userProfile = {
    name: '车迷',
    gender: '男',
    age: '25',
    height: '175',
    weight: '70',
    nationality: '中国',
    roleType: '赛车手',
    customRole: '',
    personality: '热情开朗',
    hobby: '赛车',
    background: ''
};
let currentChatDriver = null;
let feedPosts = [];
let apiConfig = { url: 'https://api.deepseek.com/v1', key: '', model: 'deepseek-chat' };
let availableApiModels = [];
let useAI = false;
let currentDateDriver = null;
let currentDateScene = null;
let currentRound = 0;
let maxRounds = 20;
let dateMessages = [];
let dateInProgress = false;
let currentDateEvent = null;
let dateEventHistory = [];
let dateEventCooldown = 0;
let currentDiaryDriverId = null;
let currentDiaryGroupId = null;
let currentDiaryTargetType = 'driver';
let currentDiaryDateKey = null;
let userCoins = 0;
let signData = { lastSignDate: null, consecutiveDays: 0 };
let giftInventory = {};
let giftHistory = [];
let racePredictions = {};
let currentTheme = null;
let chatViewMode = 'mobile';
let groupChats = [];
let groupChatsCollapsed = false;
let teamSectionsCollapsed = {};

const F1_THEMES = {
    ferrari: { id: 'ferrari', name: '法拉利', primary: '#D92E2B', dark: '#8F1412', accent: '#F5C542', phoneBg: '#13090A', text: '#FFF8F5' },
    mercedes: { id: 'mercedes', name: '梅赛德斯', primary: '#00C2A8', dark: '#0A7F74', accent: '#D7F4EE', phoneBg: '#071517', text: '#F2FFFB' },
    redbull: { id: 'redbull', name: '红牛', primary: '#274B8E', dark: '#152A53', accent: '#F05A4A', phoneBg: '#08101F', text: '#F5F7FF' },
    mclaren: { id: 'mclaren', name: '迈凯伦', primary: '#FF7A18', dark: '#B64A05', accent: '#9CD8FF', phoneBg: '#180D07', text: '#FFF8F2' },
    alpine: { id: 'alpine', name: 'Alpine', primary: '#1676D2', dark: '#0E4C92', accent: '#FF8BC1', phoneBg: '#071129', text: '#EEF6FF' },
    aston_martin: { id: 'aston_martin', name: '阿斯顿马丁', primary: '#0D7C5F', dark: '#084D3A', accent: '#B8E8D8', phoneBg: '#07130F', text: '#F4FFF9' },
    racingbulls: { id: 'racingbulls', name: 'Racing Bulls', primary: '#355D92', dark: '#1E3457', accent: '#E7EEF9', phoneBg: '#0A1420', text: '#F2F7FF' },
    haas: { id: 'haas', name: '哈斯', primary: '#D8DEE5', dark: '#929AA3', accent: '#E63946', phoneBg: '#101214', text: '#FAFCFF' },
    williams: { id: 'williams', name: '威廉姆斯', primary: '#1867FF', dark: '#0D3EA6', accent: '#A9CBFF', phoneBg: '#071128', text: '#F4F8FF' },
    audi: { id: 'audi', name: '奥迪', primary: '#20232D', dark: '#0D1016', accent: '#C8CED8', phoneBg: '#090A0D', text: '#F5F7FA' },
    cadillac: { id: 'cadillac', name: '凯迪拉克', primary: '#D6DCE6', dark: '#8F97A3', accent: '#153A64', phoneBg: '#0B1015', text: '#F7FAFF' }
};

const F1_THEME_DETAILS = {
    ferrari: { code: 'SF-25', vibe: 'Scarlet apex / gold sparks' },
    mercedes: { code: 'W16', vibe: 'Teal pulse / silver precision' },
    redbull: { code: 'RB21', vibe: 'Night charge / hot pursuit' },
    mclaren: { code: 'MCL39', vibe: 'Papaya flash / cool aero' },
    alpine: { code: 'A526', vibe: 'Blue force / neon edge' },
    aston_martin: { code: 'AMR25', vibe: 'British racing / velvet green' },
    racingbulls: { code: 'VCARB 02', vibe: 'Steel blue / sharp orbit' },
    haas: { code: 'VF-26', vibe: 'Titanium cut / redline mark' },
    williams: { code: 'FW48', vibe: 'Electric slipstream / crisp blue' },
    audi: { code: 'A-Proto', vibe: 'Carbon noir / clean metal' },
    cadillac: { code: 'CDL-01', vibe: 'Chrome luxe / deep navy' }
};

function hexToRgb(hex) {
    const safe = String(hex || '#000000').replace('#', '').padEnd(6, '0');
    const r = parseInt(safe.slice(0, 2), 16);
    const g = parseInt(safe.slice(2, 4), 16);
    const b = parseInt(safe.slice(4, 6), 16);
    return `${r}, ${g}, ${b}`;
}

function setCssVars(theme) {
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--primary-dark', theme.dark);
    document.documentElement.style.setProperty('--accent-color', theme.accent);
    document.documentElement.style.setProperty('--phone-bg', theme.phoneBg);
    document.documentElement.style.setProperty('--phone-contrast', theme.text);
    document.documentElement.style.setProperty('--phone-surface', theme.phoneSurface || '#13161c');
    document.documentElement.style.setProperty('--phone-border', theme.phoneBorder || '#262d36');
    document.documentElement.style.setProperty('--phone-muted', theme.muted || '#9aa5b5');
    document.documentElement.style.setProperty('--surface-strong', theme.surfaceStrong || 'rgba(12, 15, 20, 0.92)');
    document.documentElement.style.setProperty('--surface-soft', theme.surfaceSoft || 'rgba(255, 255, 255, 0.05)');
    document.documentElement.style.setProperty('--glass-edge', theme.glassEdge || 'rgba(255, 255, 255, 0.08)');
    document.documentElement.style.setProperty('--track-line', theme.trackLine || 'rgba(255, 255, 255, 0.035)');
    document.documentElement.style.setProperty('--shadow-heavy', theme.shadowHeavy || '0 34px 80px rgba(0, 0, 0, 0.5)');
    document.documentElement.style.setProperty('--shadow-card', theme.shadowCard || '0 14px 34px rgba(0, 0, 0, 0.22)');
    document.documentElement.style.setProperty('--primary-color-rgb', hexToRgb(theme.primary));
}

function getThemeDetails(themeId) {
    return F1_THEME_DETAILS[themeId] || { code: 'F1', vibe: 'Race tuned palette' };
}

function updateThemeShowcase(theme) {
    const heroName = document.getElementById('themeHeroName');
    const heroDesc = document.getElementById('themeHeroDesc');
    const heroStatus = document.getElementById('themeHeroStatus');
    if (!heroName || !heroDesc || !heroStatus || !theme) return;
    const details = getThemeDetails(theme.id);
    heroName.textContent = `${theme.name} / ${details.code}`;
    heroDesc.textContent = details.vibe;
    heroStatus.textContent = '当前配色';
}

function applyTheme(themeId) {
    const theme = F1_THEMES[themeId] || F1_THEMES.ferrari;
    currentTheme = theme;
    document.documentElement.dataset.themeMode = 'dark';
    setCssVars(theme);
    updateThemeShowcase(theme);
    localStorage.setItem('f1_theme', theme.id);
}

function loadTheme() {
    const saved = localStorage.getItem('f1_theme') || 'ferrari';
    const normalized = F1_THEMES[saved] ? saved : 'ferrari';
    if (normalized !== saved) localStorage.setItem('f1_theme', normalized);
    applyTheme(normalized);
    return normalized;
}

function initThemeSelector() {
    const container = document.getElementById('themeOptionsGrid');
    if (!container) return;
    const currentSaved = localStorage.getItem('f1_theme') || 'ferrari';
    updateThemeShowcase(F1_THEMES[currentSaved] || F1_THEMES.ferrari);
    container.innerHTML = '';
    Object.values(F1_THEMES).forEach(theme => {
        const details = getThemeDetails(theme.id);
        const btn = document.createElement('button');
        btn.className = `theme-option-btn${theme.id === currentSaved ? ' active' : ''}`;
        btn.type = 'button';
        btn.setAttribute('aria-label', `${theme.name} ${details.code}`.trim());
        btn.dataset.themeId = theme.id;
        btn.innerHTML = `<div class="theme-option-topline"><span class="theme-option-code">${details.code}</span><span class="theme-option-badge">${theme.id === currentSaved ? 'LIVE' : 'READY'}</span></div><div class="theme-color-preview" style="background: linear-gradient(135deg, ${theme.dark}, ${theme.primary} 58%, ${theme.accent}); border-color: ${theme.primary};"></div><div class="theme-option-copy"><div class="label">${theme.name}</div><div class="theme-option-vibe">${details.vibe}</div></div>`;
        btn.addEventListener('click', () => {
            applyTheme(theme.id);
            document.querySelectorAll('.theme-option-btn').forEach(node => node.classList.remove('active'));
            document.querySelectorAll('.theme-option-badge').forEach(node => { node.textContent = 'READY'; });
            btn.classList.add('active');
            btn.querySelector('.theme-option-badge').textContent = 'LIVE';
            showToast(`已切换至 ${theme.name} 配色`, false);
        });
        container.appendChild(btn);
    });
}

function shadeColor(hex, percent) {
    const safe = String(hex || '#000000').replace('#', '');
    const num = parseInt(safe, 16);
    let r = (num >> 16) + Math.round(255 * (percent / 100));
    let g = ((num >> 8) & 0xff) + Math.round(255 * (percent / 100));
    let b = (num & 0xff) + Math.round(255 * (percent / 100));
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function syncChatViewToggleUI() {
    document.querySelectorAll('[data-chat-view-mode]').forEach(button => {
        button.classList.toggle('active', button.dataset.chatViewMode === chatViewMode);
    });
}

function isDesktopChatView() {
    return chatViewMode === 'desktop' && window.innerWidth >= 1100;
}

function applyChatViewMode(mode, options = {}) {
    chatViewMode = mode === 'desktop' ? 'desktop' : 'mobile';
    document.body.dataset.chatView = chatViewMode;
    if (!options.skipSave) localStorage.setItem('f1_chat_view_mode', chatViewMode);
    syncChatViewToggleUI();
    if (typeof window.renderChatWorkspaceState === 'function') window.renderChatWorkspaceState();
    if (typeof renderDriverList === 'function') renderDriverList();
}

function loadChatViewMode() {
    const saved = localStorage.getItem('f1_chat_view_mode') || 'mobile';
    applyChatViewMode(saved, { skipSave: true });
    return chatViewMode;
}

window.addEventListener('resize', () => {
    if (!document.body) return;
    document.body.dataset.chatView = chatViewMode;
    if (typeof window.renderChatWorkspaceState === 'function') window.renderChatWorkspaceState();
});
