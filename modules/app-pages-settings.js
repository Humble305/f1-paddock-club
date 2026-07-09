// 椤甸潰娓叉煋銆佹ā鎬佹銆佽祫鏂欍€丄PI銆佸瓨妗ｄ笌鍏憡

function exportGameData() {
    const payload = {
        favorability,
        driverDateMemories,
        groupDateMemories,
        groupDateSessions,
        driverDiaries,
        groupDiaries,
        pinnedDrivers,
        chatHistories,
        groupChats,
        groupChatsCollapsed,
        teamSectionsCollapsed,
        driverAvatars,
        userProfile,
        feedPosts,
        apiConfig,
        apiConfigProfiles,
        userCoins,
        signData,
        dateLimitState: typeof ensureDateLimitState === 'function' ? ensureDateLimitState() : dateLimitState,
        rewardInbox,
        giftInventory,
        giftHistory,
        standingsData: typeof getCurrentStandingsPayload === 'function' ? getCurrentStandingsPayload() : null,
        standingsDataConfig: typeof window.getStandingsDataConfig === 'function' ? window.getStandingsDataConfig() : null,
        currentTheme: currentTheme?.id || 'ferrari'
    };
    const blob = new Blob([exportSecureSavePayload(payload)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `f1-paddock-save-${getTodayDateStr()}.f1save`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('\u5b58\u6863\u5df2\u5bfc\u51fa', false);
}

function applyLoadedData(saveData) {
    favorability = saveData.favorability || favorability;
    driverDateMemories = saveData.driverDateMemories || driverDateMemories;
    groupDateMemories = saveData.groupDateMemories || groupDateMemories;
    groupDateSessions = saveData.groupDateSessions || groupDateSessions;
    driverDiaries = saveData.driverDiaries || driverDiaries;
    groupDiaries = saveData.groupDiaries || groupDiaries;
    pinnedDrivers = saveData.pinnedDrivers || pinnedDrivers;
    chatHistories = saveData.chatHistories || chatHistories;
    groupChats = saveData.groupChats || groupChats;
    groupChatsCollapsed = saveData.groupChatsCollapsed ?? groupChatsCollapsed;
    teamSectionsCollapsed = saveData.teamSectionsCollapsed || teamSectionsCollapsed;
    driverAvatars = saveData.driverAvatars || driverAvatars;
    userProfile = { ...userProfile, ...(saveData.userProfile || {}) };
    feedPosts = saveData.feedPosts || feedPosts;
    apiConfig = { ...apiConfig, ...(saveData.apiConfig || {}) };
    apiConfigProfiles = saveData.apiConfigProfiles || apiConfigProfiles;
    userCoins = saveData.userCoins ?? userCoins;
    signData = saveData.signData || signData;
    dateLimitState = saveData.dateLimitState || dateLimitState;
    rewardInbox = typeof normalizeRewardInbox === 'function' ? normalizeRewardInbox(saveData.rewardInbox || rewardInbox) : (saveData.rewardInbox || rewardInbox);
    giftInventory = saveData.giftInventory || giftInventory;
    giftHistory = saveData.giftHistory || giftHistory;
    if (saveData.standingsData && typeof applyStandingsPayload === 'function') {
        applyStandingsPayload(saveData.standingsData, {
            persist: true,
            rerender: false,
            source: saveData.standingsDataConfig?.source || 'manual',
            remoteUrl: saveData.standingsDataConfig?.remoteUrl || '',
            lastUpdated: saveData.standingsDataConfig?.lastUpdated || new Date().toISOString()
        });
    }
    secureStorageSet('f1_favorability', favorability);
    secureStorageSet('f1_date_memories', driverDateMemories);
    secureStorageSet('f1_group_date_memories', groupDateMemories);
    secureStorageSet('f1_group_date_sessions', groupDateSessions);
    secureStorageSet('f1_driver_diaries', driverDiaries);
    secureStorageSet('f1_group_diaries', groupDiaries);
    secureStorageSet('f1_pinned_drivers', pinnedDrivers);
    secureStorageSet('f1_chat_histories', chatHistories);
    secureStorageSet('f1_group_chats', groupChats);
    secureStorageSet('f1_group_chats_collapsed', groupChatsCollapsed);
    secureStorageSet('f1_team_sections_collapsed', teamSectionsCollapsed);
    secureStorageSet('f1_driver_avatars', driverAvatars);
    secureStorageSet('f1_user_profile', userProfile);
    secureStorageSet('f1_api_config', apiConfig);
    secureStorageSet('f1_api_config_profiles', apiConfigProfiles);
    secureStorageSet('f1_user_coins', userCoins);
    secureStorageSet('f1_sign_data', signData);
    if (typeof ensureDateLimitState === 'function') ensureDateLimitState();
    if (typeof saveDateLimitState === 'function') saveDateLimitState();
    else secureStorageSet('f1_date_limit_state', dateLimitState);
    if (typeof saveRewardInbox === 'function') saveRewardInbox();
    else secureStorageSet('f1_reward_inbox', rewardInbox);
    secureStorageSet('f1_gift_inventory', giftInventory);
    secureStorageSet('f1_gift_history', giftHistory);
    if (saveData.currentTheme) applyTheme(saveData.currentTheme);
    loadUserProfile();
    loadApiConfig();
    renderDriverList();
    renderFeed();
    renderStandings();
    renderDatePage();
    renderCalendar();
    renderMediaPage();
    renderRaceRankings();
    renderSignPage();
    if (typeof renderInboxPage === 'function') renderInboxPage();
    if (typeof renderPaddockStore === 'function') renderPaddockStore();
}

function importGameDataFromFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
        try {
            applyLoadedData(importSecureSavePayload(reader.result));
            showToast('存档导入成功', false);
        } catch (error) {
            handleApiError(error, '存档导入');
        }
    };
    reader.readAsText(file);
}

function formatStandingsSourceLabel(source = '') {
    const value = String(source || '').trim();
    if (value === 'formula1.com') return 'F1 官方积分页';
    if (value === 'remote') return '项目远程 JSON';
    if (value === 'local') return '本地直开数据包';
    if (value === 'manual') return '手动导入';
    return '内置兜底';
}

function formatStandingsSourceBadge(source = '') {
    const value = String(source || '').trim();
    if (value === 'formula1.com') return 'F1';
    if (value === 'remote') return 'REMOTE';
    if (value === 'local') return 'LOCAL';
    if (value === 'manual') return 'MANUAL';
    return 'BUILTIN';
}

function formatStandingsUpdatedText(value = '') {
    if (!value) return '待同步';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString('zh-CN', {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function renderStandingsAdminPanel() {
    const config = typeof window.getStandingsDataConfig === 'function' ? window.getStandingsDataConfig() : {};
    const meta = typeof window.getCurrentStandingsMeta === 'function' ? window.getCurrentStandingsMeta() : {};
    const source = config.source || meta.source || 'builtin';
    const officialUrls = typeof window.getOfficialStandingsUrls === 'function' ? window.getOfficialStandingsUrls() : {};
    const remoteUrl = config.remoteUrl || config.defaultRemoteUrl || (typeof window.getDefaultStandingsRemoteUrl === 'function' ? window.getDefaultStandingsRemoteUrl() : '');
    const sourceUrlText = source === 'formula1.com'
        ? `${officialUrls.drivers || config.officialDriversUrl || ''} + ${officialUrls.teams || config.officialTeamsUrl || ''}`
        : remoteUrl;
    const updatedAt = meta.updatedAt || config.lastUpdated || '';
    const sourceBadge = document.getElementById('standingsSourceBadge');
    const sourceText = document.getElementById('standingsSourceText');
    const updatedText = document.getElementById('standingsUpdatedText');
    const remoteUrlText = document.getElementById('standingsRemoteUrlText');
    if (sourceBadge) {
        sourceBadge.textContent = formatStandingsSourceBadge(source);
        sourceBadge.dataset.source = source;
    }
    if (sourceText) sourceText.textContent = formatStandingsSourceLabel(source);
    if (updatedText) updatedText.textContent = formatStandingsUpdatedText(updatedAt);
    if (remoteUrlText) remoteUrlText.textContent = sourceUrlText || '未配置远程地址';
}

async function refreshStandingsFromDefaultRemote() {
    const refreshButton = document.getElementById('refreshStandingsBtn');
    const originalText = refreshButton?.textContent || '';
    if (refreshButton) {
        refreshButton.disabled = true;
        refreshButton.textContent = '正在连接 F1 官方积分页';
    }
    try {
        if (typeof window.refreshStandingsFromOfficial !== 'function') {
            throw new Error('当前版本没有加载官方积分刷新模块');
        }
        const refreshResult = await window.refreshStandingsFromOfficial();
        const settled = typeof window.maybeSettlePredictionAfterStandingsRefresh === 'function'
            ? window.maybeSettlePredictionAfterStandingsRefresh(refreshResult)
            : false;
        renderStandingsAdminPanel();
        if (!settled) showToast('积分数据已从 F1 官方刷新', false);
    } catch (error) {
        try {
            if (typeof window.refreshStandingsFromFallback !== 'function') {
                throw new Error('当前版本没有加载积分镜像兜底模块');
            }
            const refreshResult = await window.refreshStandingsFromFallback();
            const settled = typeof window.maybeSettlePredictionAfterStandingsRefresh === 'function'
                ? window.maybeSettlePredictionAfterStandingsRefresh(refreshResult)
                : false;
            renderStandingsAdminPanel();
            if (!settled) showToast('F1 官方直连失败，已改用最新积分镜像', false);
        } catch (fallbackError) {
            const message = `${error.message || error}；积分镜像兜底也刷新失败：${fallbackError.message || fallbackError}`;
            handleApiError(new Error(message), '积分数据刷新');
        }
    } finally {
        if (refreshButton) {
            refreshButton.disabled = false;
            refreshButton.textContent = originalText || '从 F1 官方刷新';
        }
    }
}

function importStandingsJsonFromFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const payload = JSON.parse(reader.result);
            applyStandingsPayload(payload, {
                source: 'manual',
                remoteUrl: typeof window.getDefaultStandingsRemoteUrl === 'function' ? window.getDefaultStandingsRemoteUrl() : '',
                lastUpdated: payload?.meta?.updatedAt || new Date().toISOString()
            });
            renderStandingsAdminPanel();
            showToast('积分 JSON 已导入', false);
        } catch (error) {
            handleApiError(error, '积分 JSON 导入');
        }
    };
    reader.readAsText(file);
}

function restoreBuiltinStandings() {
    if (typeof resetStandingsData === 'function') resetStandingsData();
    renderStandingsAdminPanel();
    showToast('已切回内置积分兜底', false);
}

function openSaveModal() {
    document.getElementById('saveModal').style.display = 'flex';
    renderStandingsAdminPanel();
}
function closeSaveModal() { document.getElementById('saveModal').style.display = 'none'; clearSidebarActive(); }

function loadUserProfile() {
    userProfile = { ...userProfile, ...(secureStorageGet('f1_user_profile', {}) || {}) };
    document.getElementById('profileName').value = userProfile.name;
    document.getElementById('profileGender').value = userProfile.gender;
    document.getElementById('profileAge').value = userProfile.age;
    document.getElementById('profileHeight').value = userProfile.height;
    document.getElementById('profileWeight').value = userProfile.weight;
    document.getElementById('profileNationality').value = userProfile.nationality;
    document.getElementById('profileRoleSelect').value = userProfile.roleType;
    document.getElementById('profileCustomRole').value = userProfile.customRole || '';
    document.getElementById('profilePersonality').value = userProfile.personality;
    document.getElementById('profileHobby').value = userProfile.hobby;
    document.getElementById('profileBackground').value = userProfile.background || '';
    toggleCustomRoleInput();
}

function saveUserProfile() {
    userProfile = {
        name: document.getElementById('profileName').value.trim() || '车迷',
        gender: document.getElementById('profileGender').value,
        age: document.getElementById('profileAge').value.trim() || '?',
        height: document.getElementById('profileHeight').value.trim() || '?',
        weight: document.getElementById('profileWeight').value.trim() || '?',
        nationality: document.getElementById('profileNationality').value.trim() || '未知',
        roleType: document.getElementById('profileRoleSelect').value,
        customRole: document.getElementById('profileCustomRole').value.trim(),
        personality: document.getElementById('profilePersonality').value.trim() || '热情',
        hobby: document.getElementById('profileHobby').value.trim() || '赛车',
        background: document.getElementById('profileBackground').value.trim()
    };
    secureStorageSet('f1_user_profile', userProfile);
    closeProfileModal();
    showToast('资料卡已更新', false);
}

function toggleCustomRoleInput() {
    const input = document.getElementById('profileCustomRole');
    input.style.display = document.getElementById('profileRoleSelect').value === '\u81ea\u5b9a\u4e49' ? 'block' : 'none';
}

function openProfileModal() { document.getElementById('profileModal').style.display = 'flex'; }
function closeProfileModal() { document.getElementById('profileModal').style.display = 'none'; clearSidebarActive(); }

let apiConfigProfiles = [];

function loadApiConfigProfiles() {
    apiConfigProfiles = secureStorageGet('f1_api_config_profiles', apiConfigProfiles) || [];
}

function saveApiConfigProfiles() {
    secureStorageSet('f1_api_config_profiles', apiConfigProfiles);
}

function buildApiProfileDraft() {
    return {
        url: document.getElementById('apiUrl')?.value.trim() || '',
        key: document.getElementById('apiKey')?.value.trim() || '',
        model: getSelectedModelName() || 'deepseek-chat'
    };
}

function buildApiProfileDisplayName(draft) {
    const customName = document.getElementById('apiProfileName')?.value.trim();
    if (customName) return customName;
    try {
        const hostname = draft.url ? new URL(draft.url).hostname.replace(/^www\./, '') : '';
        return hostname ? `${hostname} · ${draft.model || 'default'}` : `API 站点 · ${draft.model || 'default'}`;
    } catch {
        return draft.url ? `${draft.url.replace(/^https?:\/\//, '')} · ${draft.model || 'default'}` : `API 站点 · ${draft.model || 'default'}`;
    }
}

function renderApiProfileList() {
    const mount = document.getElementById('apiProfileList');
    if (!mount) return;
    const currentDraft = buildApiProfileDraft();
    if (!apiConfigProfiles.length) {
        mount.innerHTML = '<div class="api-profile-empty">还没有保存站点。常用的 API 站子可以先存一份，后面切换会轻很多。</div>';
        return;
    }
    mount.innerHTML = apiConfigProfiles.map(profile => {
        const isActive = profile.url === currentDraft.url && profile.key === currentDraft.key && profile.model === currentDraft.model;
        const maskedKey = profile.key ? `${profile.key.slice(0, 4)}••••${profile.key.slice(-4)}` : '未保存密钥';
        return `
            <div class="api-profile-card${isActive ? ' is-active' : ''}">
                <div class="api-profile-card-copy">
                    <div class="api-profile-card-name">${escapeHtml(profile.name || '未命名站点')}</div>
                    <div class="api-profile-card-meta">${escapeHtml(profile.url || '未填写地址')}</div>
                    <div class="api-profile-card-submeta">${escapeHtml(profile.model || 'deepseek-chat')} · ${escapeHtml(maskedKey)}</div>
                </div>
                <div class="api-profile-card-actions">
                    <button type="button" class="api-profile-card-btn" data-api-profile-apply="${escapeHtmlAttr(profile.id)}">套用</button>
                    <button type="button" class="api-profile-card-btn is-danger" data-api-profile-delete="${escapeHtmlAttr(profile.id)}">删除</button>
                </div>
            </div>
        `;
    }).join('');
    mount.querySelectorAll('[data-api-profile-apply]').forEach(button => button.addEventListener('click', () => applyApiProfile(button.getAttribute('data-api-profile-apply') || '')));
    mount.querySelectorAll('[data-api-profile-delete]').forEach(button => button.addEventListener('click', () => deleteApiProfile(button.getAttribute('data-api-profile-delete') || '')));
}

function applyApiProfile(profileId) {
    const profile = apiConfigProfiles.find(item => item.id === profileId);
    if (!profile) return;
    document.getElementById('apiUrl').value = profile.url || '';
    document.getElementById('apiKey').value = profile.key || '';
    setModelOptions(availableApiModels.length ? availableApiModels : [profile.model || 'deepseek-chat'], profile.model || 'deepseek-chat');
    updateCustomModelVisibility();
    const nameInput = document.getElementById('apiProfileName');
    if (nameInput) nameInput.value = profile.name || '';
    renderApiProfileList();
    setApiStatus(`已载入 ${profile.name || '已保存站点'}`, 'loading');
}

function saveCurrentApiProfile() {
    const draft = buildApiProfileDraft();
    if (!draft.url || !draft.key || !draft.model) {
        showToast('先把 URL、Key 和模型填完整，再保存站点', true);
        return;
    }
    const name = buildApiProfileDisplayName(draft);
    const existing = apiConfigProfiles.find(item => item.name === name || (item.url === draft.url && item.model === draft.model));
    if (existing) {
        existing.name = name;
        existing.url = draft.url;
        existing.key = draft.key;
        existing.model = draft.model;
    } else {
        apiConfigProfiles.unshift({
            id: `api_${Date.now()}`,
            name,
            url: draft.url,
            key: draft.key,
            model: draft.model
        });
    }
    apiConfigProfiles = apiConfigProfiles.slice(0, 12);
    saveApiConfigProfiles();
    renderApiProfileList();
    showToast('当前 API 站点已保存', false);
}

function deleteApiProfile(profileId) {
    const before = apiConfigProfiles.length;
    apiConfigProfiles = apiConfigProfiles.filter(item => item.id !== profileId);
    if (apiConfigProfiles.length === before) return;
    saveApiConfigProfiles();
    renderApiProfileList();
    showToast('已删除这套站点配置', false);
}

function loadApiConfig() {
    apiConfig = { ...apiConfig, ...(secureStorageGet('f1_api_config', {}) || {}) };
    document.getElementById('apiUrl').value = apiConfig.url || '';
    document.getElementById('apiKey').value = apiConfig.key || '';
    setModelOptions(availableApiModels.length ? availableApiModels : [apiConfig.model || 'deepseek-chat'], apiConfig.model || 'deepseek-chat');
    updateCustomModelVisibility();
    const profileNameInput = document.getElementById('apiProfileName');
    if (profileNameInput) profileNameInput.value = '';
    renderApiProfileList();
    useAI = Boolean(apiConfig.key && apiConfig.url && apiConfig.model);
    setApiStatus(useAI ? '当前已启用真实 API' : '当前使用模拟模式', useAI ? 'success' : 'idle');
}

function saveApiConfig() {
    apiConfig = {
        url: document.getElementById('apiUrl').value.trim(),
        key: document.getElementById('apiKey').value.trim(),
        model: getSelectedModelName() || 'deepseek-chat'
    };
    secureStorageSet('f1_api_config', apiConfig);
    useAI = Boolean(apiConfig.key && apiConfig.url && apiConfig.model);
    setApiStatus(useAI ? '已保存并启用真实 API' : '缺少完整配置，仍使用模拟模式', useAI ? 'success' : 'warning');
    showToast('AI \u8bbe\u7f6e\u5df2\u4fdd\u5b58', false);
    closeModal();
}

function openApiModal() {
    document.getElementById('apiModal').style.display = 'flex';
    loadApiConfig();
}

function closeModal() { document.getElementById('apiModal').style.display = 'none'; clearSidebarActive(); }

function closeDriverProfile() { document.getElementById('driverProfileModal').style.display = 'none'; }

const DRIVER_NUMBERS = {
    nor: '1',
    pia: '81',
    lec: '16',
    ham: '44',
    rus: '63',
    ant: '12',
    ver: '3',
    hadjar: '6',
    alo: '14',
    str: '18',
    alb: '23',
    sai: '55',
    gas: '10',
    col: '43',
    oco: '31',
    bea: '87',
    hul: '27',
    bor: '5',
    law: '30',
    lin: '41',
    per: '11',
    bot: '77'
};

function showDriverProfile(driverId) {
    const displayProfile = typeof window.getDriverDisplayProfile === 'function' ? window.getDriverDisplayProfile(driverId) : null;
    const profile = displayProfile?.profile || null;
    const driver = displayProfile?.driver || window.DRIVERS.find(item => item.id === driverId);
    if (!profile || !driver) return;
    const avatarBg = getDriverAvatarStyle(driverId);
    const favor = favorability[driverId] || 0;
    const mood = getFavorMood(favor);
    const teamColor = window.TEAM_COLORS[driver.team] || '#2a2f3a';
    const driverNumber = DRIVER_NUMBERS[driverId] || '--';
    const safe = value => escapeHtml(String(value ?? ''));
    document.getElementById('driverProfileContent').innerHTML = `
        <div class="profile-card-header profile-license-card" style="--profile-team-color:${teamColor}; --profile-driver-number:'${driverNumber}';">
            <div class="profile-license-topline">
                <div class="profile-license-label">PADDOCK ID</div>
                <div class="profile-license-number">#${driverNumber}</div>
            </div>
            <div class="profile-license-main">
                <div class="profile-card-avatar-row">
                    <button type="button" class="profile-card-avatar profile-card-avatar-button" id="driverProfileAvatarBtn" style="${avatarBg ? `background-image:${avatarBg};background-size:cover;` : `background-color:${teamColor};`}">${avatarBg ? '' : driver.avatarLetter}</button>
                    <button type="button" class="profile-avatar-reset-btn" id="resetDriverAvatarBtn" title="恢复初始头像" aria-label="恢复初始头像"><span class="profile-avatar-reset-icon" aria-hidden="true"></span></button>
                </div>
                <div class="profile-license-identity">
                    <div class="profile-card-name">${safe(profile.fullName)}</div>
                    <div class="profile-card-team">${safe(profile.team)}</div>
                    <div class="profile-license-meta">
                        <span class="profile-license-chip">车手资料页</span>
                        <span class="profile-license-chip profile-license-chip-accent">好感 ${favor}/100</span>
                    </div>
                    <div class="profile-favor-line">当前关系：${safe(mood)}</div>
                </div>
            </div>
            <div class="profile-avatar-hint">鐐瑰嚮澶村儚鍗冲彲鏇存崲</div>
        </div>
        <div class="profile-card-section profile-card-section-identity">
            <div class="profile-card-section-title">基本信息</div>
            <div class="profile-card-info-row"><span>鍥界睄</span><strong>${safe(profile.nationality)}</strong></div>
            <div class="profile-card-info-row"><span>鍑虹敓鏃ユ湡</span><strong>${safe(profile.birthDate)}</strong></div>
            <div class="profile-card-info-row"><span>韬珮 / 浣撻噸</span><strong>${safe(profile.height)} / ${safe(profile.weight)}</strong></div>
            <div class="profile-card-info-row"><span>F1 棣栫</span><strong>${safe(profile.f1Debut)}</strong></div>
        </div>
        <div class="profile-card-section profile-card-section-stats">
            <div class="profile-card-section-title">鐢熸动鏁版嵁</div>
            <div class="profile-card-info-row"><span>分站冠军</span><strong>${safe(profile.totalWins)}</strong></div>
            <div class="profile-card-info-row"><span>杆位</span><strong>${safe(profile.totalPoles)}</strong></div>
            <div class="profile-card-info-row"><span>领奖台</span><strong>${safe(profile.totalPodiums)}</strong></div>
        </div>`;
    document.getElementById('driverProfileModal').style.display = 'flex';
    document.getElementById('driverProfileAvatarBtn')?.addEventListener('click', () => openAvatarUpload(driverId));
    document.getElementById('resetDriverAvatarBtn')?.addEventListener('click', () => {
        resetDriverAvatar(driverId);
        showDriverProfile(driverId);
    });
}

const PROFILE_TOPIC_LABELS = {
    technical: '\u8d5b\u8f66\u8c03\u6821\u3001\u8f6e\u80ce\u53cd\u9988\u3001\u6a21\u62df\u5668\u7ec6\u8282',
    sports: '\u6bd4\u8d5b\u653b\u9632\u3001\u8d5b\u9053\u8282\u594f\u3001\u7ade\u4e89\u5c40\u52bf',
    social: '\u56f4\u573a\u4e92\u52a8\u3001\u8f7b\u677e\u95f2\u804a\u3001\u63a5\u6897',
    battle: '\u786c\u521a\u3001\u5bf9\u6297\u3001\u5173\u952e\u65f6\u523b\u7684\u5224\u65ad',
    fitness: '\u8bad\u7ec3\u3001\u6062\u590d\u3001\u8eab\u4f53\u72b6\u6001',
    lifestyle: '\u7a7f\u642d\u3001\u97f3\u4e50\u3001\u65c5\u884c\u3001\u751f\u6d3b\u5174\u81f4'
};

function formatProfileTimeLabel(value) {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return String(value).replaceAll('-', '.');
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
}

function shortenProfileText(text = '', limit = 90) {
    const normalized = String(text || '').replace(/\s+/g, ' ').trim();
    if (!normalized) return '';
    return normalized.length > limit ? `${normalized.slice(0, limit).trim()}...` : normalized;
}

function getDriverRecentFeedPosts(driverId, limit = 5) {
    const driver = (window.DRIVERS || []).find(item => item.id === driverId);
    if (!driver) return [];
    return (feedPosts || [])
        .filter(post => post?.name === driver.name || post?.handle === driver.handle)
        .slice()
        .reverse()
        .slice(0, limit)
        .map(post => ({
            id: post.id,
            content: post.content || '',
            timeAgo: post.timeAgo || '刚刚',
            likes: Number(post.likes || 0),
            commentCount: Number((post.comments || []).length + (post.circleMeta?.autoComments || []).length)
        }));
}

function getDriverGiftHistory(driverId, limit = 6) {
    return (giftHistory || []).filter(entry => entry.driverId === driverId).slice(0, limit);
}

function getDriverProfileMilestones(driverId) {
    const driver = (window.DRIVERS || []).find(item => item.id === driverId);
    const history = (chatHistories[driverId] || []).filter(msg => msg.role !== 'system');
    const diaryTimeline = typeof getDriverDiaryTimeline === 'function' ? getDriverDiaryTimeline(driverId, 2) : [];
    const dateMemory = driverDateMemories?.[driverId] || null;
    const gifts = getDriverGiftHistory(driverId, 3);
    const milestones = [];
    if (history.length) {
        const first = history[0];
        const last = history[history.length - 1];
        milestones.push({
            title: '互动轨迹',
            body: `你们已经累计聊过 ${history.length} 条消息。${last?.dateKey ? `最近一次互动停在 ${formatProfileTimeLabel(last.dateKey)}。` : ''}`
        });
        if (first?.dateKey) {
            milestones.push({
                title: '熟悉感正在累积',
                body: `${driver?.name || '这位车手'} 从 ${formatProfileTimeLabel(first.dateKey)} 起开始记住你的节奏。`
            });
        }
    }
    if (dateMemory?.summary) {
        milestones.push({
            title: '最近一次约会记忆',
            body: shortenProfileText(dateMemory.summary, 86)
        });
    }
    if (diaryTimeline[0]?.content) {
        milestones.push({
            title: '最近一篇关系日记',
            body: shortenProfileText(diaryTimeline[0].content, 86)
        });
    }
    if (gifts[0]?.giftName) {
        const giftLevel = gifts[0].preferenceLevel || (gifts[0].matched ? 'favorite' : (gifts[0].liked ? 'liked' : 'neutral'));
        milestones.push({
            title: giftLevel === 'favorite' ? '最近那份礼物被认真记住了' : (giftLevel === 'liked' ? '最近那份礼物他确实挺喜欢' : '最近收到过你的礼物'),
            body: `${driver?.name || '他'} 最近收下了 ${gifts[0].giftName}${giftLevel === 'favorite' ? '，而且反应明显更柔和。' : (giftLevel === 'liked' ? '，看得出来心情有被你哄好一点。' : '。')}`
        });
    }
    return milestones.slice(0, 4);
}

function getDriverStatusTags(driverId) {
    const driver = (window.DRIVERS || []).find(item => item.id === driverId);
    if (!driver) return [];
    const tags = [];
    const event = window.getCurrentRaceWeekendEvent ? window.getCurrentRaceWeekendEvent() : null;
    const favor = favorability?.[driverId] || 0;
    const gifts = getDriverGiftHistory(driverId, 1);
    const dateMemory = driverDateMemories?.[driverId] || null;
    const recentPosts = getDriverRecentFeedPosts(driverId, 2);
    if (event?.status === 'live') tags.push(event.phase?.label || '比赛周模式');
    else if (event?.status === 'countdown') tags.push('下一站准备中');
    if (favor >= 75) tags.push('在你面前会明显放松');
    else if (favor >= 45) tags.push('已经记住你的节奏');
    else tags.push('还在慢慢熟悉你');
    if ((gifts[0]?.preferenceLevel || (gifts[0]?.matched ? 'favorite' : (gifts[0]?.liked ? 'liked' : 'neutral'))) === 'favorite') tags.push('刚收过你认真挑的礼物');
    else if ((gifts[0]?.preferenceLevel || (gifts[0]?.matched ? 'favorite' : (gifts[0]?.liked ? 'liked' : 'neutral'))) === 'liked') tags.push('最近收过一份挺喜欢的礼物');
    else if (gifts[0]) tags.push('最近收过你的心意');
    if (dateMemory?.summary) tags.push('保留着和你的约会记忆');
    if (recentPosts.length) tags.push('最近公开发声比较频繁');
    const topics = typeof getDriverFavorTopics === 'function' ? getDriverFavorTopics(driver) : [];
    if (topics[0]?.id && PROFILE_TOPIC_LABELS[topics[0].id]) tags.push(`最近更愿意聊${PROFILE_TOPIC_LABELS[topics[0].id].split('、')[0]}`);
    return [...new Set(tags)].slice(0, 4);
}

function buildDriverProfileViewModel(driverId) {
    const displayProfile = typeof window.getDriverDisplayProfile === 'function' ? window.getDriverDisplayProfile(driverId) : null;
    const profile = displayProfile?.profile || null;
    const driver = displayProfile?.driver || (window.DRIVERS || []).find(item => item.id === driverId);
    if (!profile || !driver) return null;
    const favor = favorability?.[driverId] || 0;
    const avatarBg = getDriverAvatarStyle(driverId);
    const teamColor = window.TEAM_COLORS?.[driver.team] || '#2a2f3a';
    const driverNumber = DRIVER_NUMBERS[driverId] || '--';
    const recentPosts = getDriverRecentFeedPosts(driverId, 5);
    const gifts = getDriverGiftHistory(driverId, 6);
    const matchedGiftCount = gifts.filter(entry => (entry.preferenceLevel || (entry.matched ? 'favorite' : (entry.liked ? 'liked' : 'neutral'))) === 'favorite').length;
    const likedGiftCount = gifts.filter(entry => (entry.preferenceLevel || (entry.matched ? 'favorite' : (entry.liked ? 'liked' : 'neutral'))) === 'liked').length;
    const history = (chatHistories[driverId] || []).filter(msg => msg.role !== 'system');
    return {
        identity: {
            driver,
            profile,
            avatarBg,
            favor,
            mood: getFavorMood(favor),
            teamColor,
            driverNumber,
            statusTags: getDriverStatusTags(driverId)
        },
        recentPosts,
        memoryProfile: {
            milestones: getDriverProfileMilestones(driverId),
            totalMessages: history.length
        },
        giftProfile: {
            entries: gifts,
            total: gifts.length,
            matchedCount: matchedGiftCount,
            likedCount: likedGiftCount
        }
    };
}

showDriverProfile = function showDriverProfileHomepage(driverId) {
    const viewModel = buildDriverProfileViewModel(driverId);
    if (!viewModel) return;
    const { identity, recentPosts, memoryProfile, giftProfile } = viewModel;
    const { driver, profile, avatarBg, favor, mood, teamColor, driverNumber, statusTags } = identity;
    const safe = value => escapeHtml(String(value ?? ''));
    const postMarkup = recentPosts.length
        ? recentPosts.map(post => `
            <article class="driver-home-post-card">
                <div class="driver-home-post-copy">${safe(post.content)}</div>
                <div class="driver-home-post-meta">
                    <span>${safe(post.timeAgo)}</span>
                    <span>&hearts; ${post.likes}</span>
                    <span>评论 ${post.commentCount}</span>
                </div>
            </article>
        `).join('')
        : `<div class="driver-home-empty">他最近没有在公开主页留下新动态，这会儿更像是在把注意力收回车里和车库里。</div>`;
    const milestoneMarkup = memoryProfile.milestones.length
        ? memoryProfile.milestones.map(item => `
            <article class="driver-home-memory-item">
                <div class="driver-home-memory-title">${safe(item.title)}</div>
                <div class="driver-home-memory-body">${safe(item.body)}</div>
            </article>
        `).join('')
        : `<div class="driver-home-empty">你们之间还没有太多被写进主页的故事，先多聊几句，或者找个合适的时机送一份礼物。</div>`;
    const giftMarkup = giftProfile.entries.length
        ? giftProfile.entries.slice(0, 4).map(entry => `
            <article class="driver-home-gift-card${(entry.preferenceLevel || (entry.matched ? 'favorite' : (entry.liked ? 'liked' : 'neutral'))) === 'favorite' ? ' is-match' : ((entry.preferenceLevel || (entry.matched ? 'favorite' : (entry.liked ? 'liked' : 'neutral'))) === 'liked' ? ' is-like' : '')}">
                <div class="driver-home-gift-top">
                    <span class="driver-home-gift-name">${safe(entry.giftName)}</span>
                    <span class="driver-home-gift-badge">${(entry.preferenceLevel || (entry.matched ? 'favorite' : (entry.liked ? 'liked' : 'neutral'))) === 'favorite' ? '很对味' : ((entry.preferenceLevel || (entry.matched ? 'favorite' : (entry.liked ? 'liked' : 'neutral'))) === 'liked' ? '挺喜欢' : '已收下')}</span>
                </div>
                <div class="driver-home-gift-meta">${safe(formatProfileTimeLabel(entry.timestamp))}</div>
            </article>
        `).join('')
        : `<div class="driver-home-empty">主页里还没有你的送礼痕迹。等你挑到一份真正对味的礼物，这一栏会先亮起来。</div>`;
    document.getElementById('driverProfileContent').innerHTML = `
        <div class="profile-card-header profile-license-card driver-home-hero" style="--profile-team-color:${teamColor}; --profile-driver-number:'${driverNumber}';">
            <div class="profile-license-topline">
                <div class="profile-license-label">PADDOCK ID</div>
                <div class="profile-license-number">#${driverNumber}</div>
            </div>
            <div class="profile-license-main">
                <div class="profile-card-avatar-row">
                    <button type="button" class="profile-card-avatar profile-card-avatar-button" id="driverProfileAvatarBtn" style="${avatarBg ? `background-image:${avatarBg};background-size:cover;` : `background-color:${teamColor};`}">${avatarBg ? '' : driver.avatarLetter}</button>
                    <button type="button" class="profile-avatar-reset-btn" id="resetDriverAvatarBtn" title="恢复初始头像" aria-label="恢复初始头像"><span class="profile-avatar-reset-icon" aria-hidden="true"></span></button>
                </div>
                <div class="profile-license-identity">
                    <div class="profile-card-name">${safe(profile.fullName)}</div>
                    <div class="profile-card-team">${safe(profile.team)}</div>
                    <div class="profile-license-meta">
                        <span class="profile-license-chip">Driver Page</span>
                        <span class="profile-license-chip profile-license-chip-accent">好感 ${favor}/100</span>
                        <button type="button" class="profile-license-chip profile-license-chip-button" id="openDiaryBtn">关系日记</button>
                    </div>
                    <div class="profile-favor-line">当前关系：${safe(mood)}</div>
                </div>
            </div>
            <div class="profile-home-status-tags">
                ${statusTags.map(tag => `<span class="profile-home-status-tag">${safe(tag)}</span>`).join('')}
            </div>
            <div class="profile-avatar-hint">点击头像即可更换。主页会同步记住你们之间留下来的动态、礼物和关系痕迹。</div>
        </div>
        <div class="profile-home-grid">
            <section class="profile-card-section profile-home-panel">
                <div class="profile-card-section-title">基本信息</div>
                <div class="profile-card-info-row"><span>国籍</span><strong>${safe(profile.nationality)}</strong></div>
                <div class="profile-card-info-row"><span>出生日期</span><strong>${safe(profile.birthDate)}</strong></div>
                <div class="profile-card-info-row"><span>身高 / 体重</span><strong>${safe(profile.height)} / ${safe(profile.weight)}</strong></div>
                <div class="profile-card-info-row"><span>F1 首秀</span><strong>${safe(profile.f1Debut)}</strong></div>
            </section>
            <section class="profile-card-section profile-home-panel">
                <div class="profile-card-section-title">生涯数据</div>
                <div class="profile-card-info-row"><span>分站冠军</span><strong>${safe(profile.totalWins)}</strong></div>
                <div class="profile-card-info-row"><span>杆位</span><strong>${safe(profile.totalPoles)}</strong></div>
                <div class="profile-card-info-row"><span>领奖台</span><strong>${safe(profile.totalPodiums)}</strong></div>
                <div class="profile-card-info-row"><span>互动总量</span><strong>${memoryProfile.totalMessages ? `${memoryProfile.totalMessages} 条消息` : '刚开始认识'}</strong></div>
            </section>
        </div>
        <section class="profile-card-section profile-home-panel">
            <div class="profile-card-section-title">最近动态</div>
            <div class="driver-home-post-list">${postMarkup}</div>
        </section>
        <section class="profile-card-section profile-home-panel">
            <div class="profile-card-section-title">互动里程碑</div>
            <div class="driver-home-memory-list">${milestoneMarkup}</div>
        </section>
        <section class="profile-card-section profile-home-panel">
            <div class="profile-card-section-title">收到的礼物</div>
            <div class="driver-home-gift-summary">
                <span>累计收下 ${giftProfile.total} 份礼物</span>
                <span>${giftProfile.matchedCount ? `${giftProfile.matchedCount} 次明显被送到心坎上` : (giftProfile.likedCount ? `${giftProfile.likedCount} 次送得挺合他心意` : '还没有特别命中的礼物记录')}</span>
            </div>
            <div class="driver-home-gift-list">${giftMarkup}</div>
        </section>`;
    document.getElementById('driverProfileModal').style.display = 'flex';
    document.getElementById('driverProfileAvatarBtn')?.addEventListener('click', () => openAvatarUpload(driverId));
    document.getElementById('resetDriverAvatarBtn')?.addEventListener('click', () => {
        resetDriverAvatar(driverId);
        showDriverProfile(driverId);
    });
    document.getElementById('openDiaryBtn')?.addEventListener('click', () => openDiaryModal(driverId));
};

window.getDriverRecentFeedPosts = getDriverRecentFeedPosts;
window.getDriverGiftHistory = getDriverGiftHistory;
window.getDriverProfileMilestones = getDriverProfileMilestones;
window.getDriverStatusTags = getDriverStatusTags;
window.buildDriverProfileViewModel = buildDriverProfileViewModel;

// 公告逻辑已拆分到 modules/settings/announcements.js。

const CALENDAR_RACE_DETAILS = {
    1: { circuit: 'Albert Park Circuit', lapLength: '5.278 km', laps: '58', distance: '306.124 km', firstHeld: '1996', signature: '街道感很强，但节奏并不碎。制动区、牵引和出弯稳定性一起决定周末上限。', sectorNote: 'T1-T3 的落位、后半段连续方向变化和墙边容错都很考验信心。', hero: '更适合敢在进弯时直接压住前轴、又能稳稳把车送出弯的人。', note: '围场气质偏赛季揭幕感，速度是新的，压力也是新的。' },
    2: { circuit: 'Shanghai International Circuit', lapLength: '5.451 km', laps: '56', distance: '305.066 km', firstHeld: '2004', signature: '典型的前段缠斗加长直道终结者，轮胎管理和尾速会一直挂在工程师嘴边。', sectorNote: '超长 T1-T2 会把前胎温度、转向耐心和节奏感一起拽出来。', hero: '擅长一边护胎一边把刹车点越推越深的车手，在这里通常很有戏。', note: '如果是冲刺周末，信息密度会更高，车队节奏也会更紧。' },
    3: { circuit: 'Suzuka Circuit', lapLength: '5.807 km', laps: '53', distance: '307.471 km', firstHeld: '1987', signature: '高速、老派、讲究连贯感，像一条会直接审判车手节奏纯度的赛道。', sectorNote: 'S 弯到 Degner 的连续节拍，决定你到底是在驾驶，还是在被赛道拽着走。', hero: '越是愿意信车头、敢把动作做小做干净的人，越容易在这里发光。', note: '这类赛道最容易把“车手状态”这四个字放大到人尽皆知。' },
    4: { circuit: 'Bahrain International Circuit', lapLength: '5.412 km', laps: '57', distance: '308.238 km', firstHeld: '2004', signature: '重刹车、强牵引、后胎热衰减，整站像一场对出弯效率和轮胎管理的持续审问。', sectorNote: '低速出弯之后的长直道收益很直接，差一点就是整段都在亏。', hero: '会慢慢把轮胎状态攥在手里，再突然提速的人，在这里很危险。', note: '夜赛灯光和沙漠底色会让围场看起来格外冷静，也格外残酷。' },
    5: { circuit: 'Jeddah Corniche Circuit', lapLength: '6.174 km', laps: '50', distance: '308.450 km', firstHeld: '2021', signature: '极快、极窄、极贴墙，节奏像在夜里掠过一整串发亮的刀锋。', sectorNote: '连续高速变向和盲角很多，方向盘每一点修正都会被放大。', hero: '那种天生敢贴墙、又能把车放得很准的车手，会让这一站看起来像另一项运动。', note: '在这里，信心几乎总会比设定表更先写在圈速里。' },
    6: { circuit: 'Miami International Autodrome', lapLength: '5.412 km', laps: '57', distance: '308.326 km', firstHeld: '2022', signature: '慢弯抓地、长直道尾速和混合赛段节奏都要在线，外场热度也很高。', sectorNote: '中后段的低速拼接和长直道前的出弯质量，对整圈价值很大。', hero: '既能处理热衰减，又能在关键超车点果断下手的人，会很吃香。', note: '这站自带秀场感，但真正决定结果的还是那几段很务实的出弯。' },
    7: { circuit: 'Circuit Gilles Villeneuve', lapLength: '4.361 km', laps: '70', distance: '305.270 km', firstHeld: '1978', signature: '减速弯、牵引和攻路肩是主旋律，圈速听起来像不断地吸气再爆发。', sectorNote: '墙很多、缓冲少，最后那道出口永远在提醒人不要太贪。', hero: '敢在减速弯里直接把车立住、再把动力很早交出去的人，会很有存在感。', note: '这条赛道总有种“下一次进攻就会出事或出彩”的悬念感。' },
    8: { circuit: 'Circuit de Monaco', lapLength: '3.337 km', laps: '78', distance: '260.286 km', firstHeld: '1950', signature: '墙边、慢速、精度和神经，一切都被压到离失误只有几厘米的范围里。', sectorNote: '这里只要方向盘多给半度，或者刹车少给半寸，画面就会立刻改变。', hero: '真正能把街道赛开成绣花的人，在这站总会被看见。', note: '排位的重要性在这里几乎像规则本身一样真实。' },
    9: { circuit: 'Circuit de Barcelona-Catalunya', lapLength: '4.657 km', laps: '66', distance: '307.236 km', firstHeld: '1991', signature: '高速长弯、空气动力学平衡和轮胎工作窗都藏不住，是很标准的综合体检。', sectorNote: '长弯里只要前轴信心稍微不够，后面一连串节拍都会跟着塌。', hero: '那种能把基础设定和驾驶节奏都做得特别“正”的车手，在这里通常很稳。', note: '很多车队都会把这里当成升级件和真实竞争力的照妖镜。' },
    10: { circuit: 'Red Bull Ring', lapLength: '4.318 km', laps: '71', distance: '306.452 km', firstHeld: '1970', signature: '海拔、短圈、长直道和硬制动点让一切都很浓缩，失误也会被反复看到。', sectorNote: '前三个重刹车区和后段高速收尾，是这站节奏最鲜明的骨架。', hero: '能把圈速做得很利落、每个重刹点都不浪费的人，会把这里跑得很凶。', note: '短圈意味着排位和正赛里一点点差距都会被看得特别清楚。' },
    11: { circuit: 'Silverstone Circuit', lapLength: '5.891 km', laps: '52', distance: '306.198 km', firstHeld: '1950', signature: '真正的高速信心赛道，空气动力学平台和驾驶胆量会一起被放大。', sectorNote: 'Maggotts-Becketts-Chapel 一段就是整条赛道的性格本体。', hero: '越是敢把转向做成一口气、敢高速信任赛车的人，越容易在这里飞起来。', note: '这里的快不是数字感的快，是人能直接看出来的那种快。' },
    12: { circuit: 'Spa-Francorchamps', lapLength: '7.004 km', laps: '44', distance: '308.052 km', firstHeld: '1950', signature: '长、快、起伏巨大，而且天气经常自己写剧本，是典型的史诗赛道。', sectorNote: '从山脚一路拉上去的那段勇气测试，总能替一整圈定调。', hero: '擅长在不确定里继续压节奏的人，在这里通常会显得特别像赛车手。', note: '只要天气一动，这站的情绪和策略就会立刻全场改写。' },
    13: { circuit: 'Hungaroring', lapLength: '4.381 km', laps: '70', distance: '306.630 km', firstHeld: '1986', signature: '连续中低速节拍很多，像在一条几乎没空喘气的技术带里反复拧圈速。', sectorNote: '流畅与否特别关键，动作一旦碎掉，时间会在每个小出口里慢慢流走。', hero: '擅长把赛车转得很圆、节奏很稳的人，会在这里非常舒服。', note: '超车难度通常会把排位和起步表现的重要性推得更高。' },
    14: { circuit: 'Circuit Zandvoort', lapLength: '4.259 km', laps: '72', distance: '306.587 km', firstHeld: '1952', signature: '沙丘地形、倾角弯和很有过山车感的节拍，让这站看起来又紧又快。', sectorNote: '节奏变化很密，尤其需要赛车在载荷转移里保持听话。', hero: '敢在带倾角的高速段继续保持节奏、又不让车头乱掉的人，会很有统治力。', note: '视觉上很轻快，但其实对赛车平衡的要求一点都不轻松。' },
    15: { circuit: 'Monza Circuit', lapLength: '5.793 km', laps: '53', distance: '306.720 km', firstHeld: '1950', signature: '低下压力、超长全油门和几次决定生死的制动，是速度信仰最直接的一站。', sectorNote: '如果你在第一套减速弯和最后两段出口处理不好，整圈都会显得不够锋利。', hero: '敢在直线末端把刹车点压到很晚、又能把车迅速扶正的人，在这里总很抢眼。', note: '这站的快非常纯粹，像把一切装饰都撕掉之后留下来的骨架。' },
    16: { circuit: 'Madring', lapLength: '5.470 km', laps: '56', distance: '306.320 km', firstHeld: '2026', signature: '作为全新城市赛道，节奏会更看重连续制动、低速牵引和贴墙信心，很多判断都还在被这一站自己写出来。', sectorNote: '新赛道最容易把车手的适应速度放大出来，前几次正式跑法往往比既有经验更重要。', hero: '那种很快就能把参考点记进身体里、又愿意贴着墙把线路压窄的人，会更容易先站稳。', note: '全新分站的魅力就在于没有既定答案，围场会边跑边重新定义它的脾气。' },
    17: { circuit: 'Baku City Circuit', lapLength: '6.003 km', laps: '51', distance: '306.049 km', firstHeld: '2016', signature: '最慢的城堡段和极长的主直道被硬拴在一起，赛道性格很分裂，也很好看。', sectorNote: '狭窄技术区容错极低，最后一路把车放上直线时又要求你特别干脆。', hero: '能在墙边低速段保持冷静，又愿意在直线尽头狠狠干进去的人，会有很强存在感。', note: '这站很擅长把稳态周末突然改写成戏剧周末。' },
    18: { circuit: 'Marina Bay Street Circuit', lapLength: '4.940 km', laps: '62', distance: '306.143 km', firstHeld: '2008', signature: '夜赛、湿热、慢弯和长时间专注，像一场耐力和精度同时在线的城市战。', sectorNote: '长时间不断方向输入会把体能、散热和注意力一起拖出来。', hero: '越能在高压环境里把每个低速弯都处理得不急不躁的人，越容易后程发力。', note: '它的疲劳感是真实存在的，所以后半程经常比前半程更像较量。' },
    19: { circuit: 'Circuit of the Americas', lapLength: '5.513 km', laps: '56', distance: '308.405 km', firstHeld: '2012', signature: '上坡进一号弯、仿经典赛道的节奏拼接、再加上长直道，是很完整的一条综合赛道。', sectorNote: '前段的连续高速变向和后段的强牵引区，对平衡设定要求都很明确。', hero: '能够快速切换节奏模式的车手，往往会在这里显得很全面。', note: '这条赛道很少给单一类型赛车留下太舒服的偷懒方式。' },
    20: { circuit: 'Autodromo Hermanos Rodriguez', lapLength: '4.304 km', laps: '71', distance: '305.354 km', firstHeld: '1963', signature: '高海拔让空气和刹车都变得很特别，尾速、冷却和机械抓地都要重新平衡。', sectorNote: '最后进入球场段之前的整段布局，经常决定这圈看起来是不是够完整。', hero: '能在低空气密度条件下仍然把制动和牵引做得很利索的人，会占上风。', note: '高原会悄悄改写很多直觉，所以工程团队通常格外忙。' },
    21: { circuit: 'Interlagos', lapLength: '4.309 km', laps: '71', distance: '305.879 km', firstHeld: '1973', signature: '短、起伏大、节奏浓，天气和轮胎都很容易把这站推向高波动。', sectorNote: '上上下下的地形会让赛车姿态一直在变化，动作太大就很难顺。', hero: '擅长在混乱感里继续把节奏收拢的人，在这里特别容易被喜欢。', note: '很多经典周末都证明了，这条赛道很懂得怎么制造结尾。' },
    22: { circuit: 'Las Vegas Strip Circuit', lapLength: '6.201 km', laps: '50', distance: '309.958 km', firstHeld: '2023', signature: '低温夜赛、长直道、高速制动和城市灯墙一起出现，视觉和性能都很锋利。', sectorNote: '轮胎升温节奏和长直道后的刹车稳定性，是这里最现实的两道题。', hero: '能在抓地不完全稳定的时候继续把速度立住的人，会很有存在感。', note: '看起来很像秀场，但真正难的是把低温窗口和制动信心同时保住。' },
    23: { circuit: 'Lusail International Circuit', lapLength: '5.419 km', laps: '57', distance: '308.611 km', firstHeld: '2021', signature: '中高速连续弯很多，对空气动力学平台和轮胎热状态都不算友好。', sectorNote: '如果赛车在长时间侧向载荷里不稳定，整圈会很难顺下来。', hero: '擅长在长持续弯里把车稳稳压住、又不把轮胎过度烧掉的人，会很强。', note: '夜赛会让画面很干净，但驾驶上的负担并不会因此减少。' },
    24: { circuit: 'Yas Marina Circuit', lapLength: '5.281 km', laps: '58', distance: '306.183 km', firstHeld: '2009', signature: '长直道后的减速弯、低速技术区和夜场收官感，让这站很有“结尾气质”。', sectorNote: '后半段如果节奏断了，整圈就会从锋利变成拖沓。', hero: '越能在赛季尾声里保持出弯干净和心态稳定的人，越容易把这里收好。', note: '很多时候，这站跑的不只是圈速，也是一个赛季最后的情绪管理。' }
};

const CALENDAR_PANEL_ACCENTS = {
    1: '86, 174, 255',
    2: '255, 103, 77',
    3: '241, 108, 82',
    4: '255, 196, 106',
    5: '86, 219, 255',
    6: '81, 177, 255',
    7: '112, 154, 255',
    8: '215, 168, 108',
    9: '116, 160, 255',
    10: '228, 92, 92',
    11: '255, 149, 72',
    12: '92, 182, 255',
    13: '77, 148, 255',
    14: '243, 128, 96',
    15: '231, 166, 92',
    16: '255, 104, 69',
    17: '92, 206, 255',
    18: '85, 196, 169',
    19: '255, 132, 86',
    20: '125, 204, 255',
    21: '255, 210, 100',
    22: '255, 121, 74',
    23: '96, 170, 255',
    24: '92, 188, 255'
};

const CALENDAR_HISTORY_DRIVERS = {
    1: { name: 'Michael Schumacher', tag: '墨尔本 4 胜纪录', note: 'Albert Park 时代胜场最多的车手，揭幕战气压和稳定性都很像他的节奏。' },
    2: { name: 'Lewis Hamilton', tag: '上海 6 胜纪录', note: '长弯护胎和长直道终结能力，在这条赛道上被他长期做成了模板。' },
    3: { name: 'Michael Schumacher', tag: '铃鹿 6 胜纪录', note: '高速连贯、节拍完整的赛道，正好适合那种能把整圈压成一口气的人。' },
    4: { name: 'Lewis Hamilton', tag: 'Sakhir 5 胜纪录', note: '巴林这类讲究轮胎与出弯效率的夜赛，他长期都是最典型的参考答案。' },
    5: { name: 'Max Verstappen', tag: '吉达领跑胜场', note: '在这条快而窄的街道夜赛里，他的贴墙信心和节奏推进感非常有代表性。' },
    6: { name: 'Max Verstappen', tag: '迈阿密早期代表', note: '这条新世代分站的前几季里，他是最早把这里“跑成主场感”的人。' },
    7: { name: 'Lewis Hamilton / Michael Schumacher', tag: '蒙特利尔并列 7 胜', note: '加拿大奖励那种能在减速弯和直线之间把风险算得很清的人。' },
    8: { name: 'Ayrton Senna', tag: '摩纳哥 6 胜纪录', note: '蒙特卡洛和塞纳几乎是绑定的：墙边精度、神经强度和排位魔法。' },
    9: { name: 'Lewis Hamilton / Michael Schumacher', tag: '巴塞罗那并列 6 胜', note: '这条综合试车场一样的赛道，同时留下了两个时代的满分解法。' },
    10: { name: 'Max Verstappen', tag: 'Spielberg 5 胜纪录', note: '短圈、重刹、重复进攻窗口很多的地方，他的节奏压制感非常明显。' },
    11: { name: 'Lewis Hamilton', tag: '银石 9 胜纪录', note: '这条高速信心赛道几乎已经被他写成了自己的主场传记。' },
    12: { name: 'Michael Schumacher', tag: 'Spa 6 胜纪录', note: 'Spa 这种长、快、天气又难测的地方，最容易留下真正的赛道型车手。' },
    13: { name: 'Lewis Hamilton', tag: 'Hungaroring 8 胜纪录', note: '在这条“没有太多喘息位”的技术赛道上，他把耐心和控制感拉到了极致。' },
    14: { name: 'Jim Clark', tag: '赞德沃特 4 胜纪录', note: '老赞德沃特时代最有代表性的名字之一，节奏轻快又极具海岸速度感。' },
    15: { name: 'Lewis Hamilton / Michael Schumacher', tag: 'Monza 并列 5 胜', note: '速度圣殿最终留下的是两位不同时代王者对直线末端制动的同样统治。' },
    16: { name: 'Still Writing', tag: '全新分站', note: '马德里这一站是新赛历成员，真正能先把名字留在这里的人，还要等赛道自己把历史写出来。' },
    17: { name: 'Sergio Perez', tag: '巴库代表胜者', note: '巴库这种又窄又长的城市赛道，他那种在混乱里找窗口的能力特别显眼。' },
    18: { name: 'Sebastian Vettel', tag: '新加坡 5 胜纪录', note: '夜赛、新加坡、维特尔，这三个关键词放在一起就自带整站的历史画面。' },
    19: { name: 'Lewis Hamilton', tag: '奥斯汀 5 胜纪录', note: '这条现代综合赛道里，他很长时间都是最会切换节奏模式的那个人。' },
    20: { name: 'Max Verstappen', tag: '墨西哥城 5 胜纪录', note: '高原低阻的窗口下，他把制动、尾速和位置感压得非常凶。' },
    21: { name: 'Michael Schumacher', tag: 'Interlagos 4 胜纪录', note: '尽管这里总让人想到巴西英雄，但纪录层面仍是舒马赫留下的名字最醒目。' },
    22: { name: 'Max Verstappen', tag: '拉斯维加斯早期纪录', note: '这条新夜赛城市赛道的最初篇章，首先被他用速度和控制感写了下来。' },
    23: { name: 'Max Verstappen', tag: 'Lusail 领跑胜场', note: '高速长持续弯很多的卡塔尔夜赛，目前最鲜明的胜者印记还是他。' },
    24: { name: 'Lewis Hamilton / Max Verstappen', tag: 'Yas Marina 并列 5 胜', note: '收官站的历史情绪很重，所以这里现在也留下了两位时代焦点的并列纪录。' }
};

const CALENDAR_UNHELD_RACE_NOTES = {};

const CALENDAR_TRACK_MAP_SLUGS = {
    1: ['melbourne', 'albertpark', 'australia'],
    2: ['shanghai', 'china'],
    3: ['suzuka', 'japan'],
    6: ['miami'],
    7: ['montreal', 'canada'],
    8: ['monaco', 'montecarlo'],
    9: ['barcelona', 'catalunya', 'spain'],
    10: ['spielberg', 'austria', 'redbullring'],
    11: ['silverstone', 'greatbritain', 'britain'],
    12: ['spa', 'spafrancorchamps', 'belgium'],
    13: ['hungaroring', 'budapest', 'hungary'],
    14: ['zandvoort', 'netherlands', 'dutch'],
    15: ['monza', 'italy'],
    16: ['madring', 'madrid', 'spain'],
    17: ['baku', 'azerbaijan'],
    18: ['singapore', 'marinabay'],
    19: ['cota', 'austin', 'unitedstates', 'usa'],
    20: ['mexicocity', 'mexico', 'rodriguez'],
    21: ['interlagos', 'saopaulo', 'brazil'],
    22: ['lasvegas', 'vegas'],
    23: ['lusail', 'qatar'],
    24: ['yasmarina', 'abudhabi', 'abu-dhabi']
};

function buildOfficialTrackMapCandidates(slugs = []) {
    const unique = [];
    const pushCandidate = (url) => {
        if (!url || unique.includes(url)) return;
        unique.push(url);
    };
    slugs.forEach(slug => {
        const clean = String(slug || '').trim();
        if (!clean) return;
        [2026, 2025].forEach(year => {
            ['webp', 'png'].forEach(ext => {
                pushCandidate(`https://media.formula1.com/image/upload/c_fit,h_704/q_auto/common/f1/${year}/track/${year}track${clean}detailed.${ext}`);
            });
        });
    });
    return unique;
}

function getCalendarTrackMap(round, gp = '') {
    const slugs = CALENDAR_TRACK_MAP_SLUGS[round] || [];
    if (!slugs.length) return null;
    const candidates = buildOfficialTrackMapCandidates(slugs);
    if (!candidates.length) return null;
    return {
        src: candidates[0],
        fallbacks: candidates.slice(1),
        alt: `${gp || '大奖赛'}官方赛道图`,
        kicker: 'OFFICIAL CIRCUIT MAP',
        note: '官方赛道图，含扇区、弯角编号与起终点。'
    };
}

let activeCalendarRound = null;
let calendarPredictionCountdownTimer = null;

function clearCalendarPredictionCountdown() {
    if (!calendarPredictionCountdownTimer) return;
    window.clearInterval(calendarPredictionCountdownTimer);
    calendarPredictionCountdownTimer = null;
}

function getRacePredictionDeadline(race) {
    const fixedDeadline = race?.predictionDeadline || race?.deadline || null;
    if (fixedDeadline) {
        const exact = new Date(fixedDeadline);
        if (!Number.isNaN(exact.getTime())) return exact;
    }
    const dateRange = window.parseRaceDateRange ? window.parseRaceDateRange(race?.date) : null;
    if (!dateRange?.start) return null;
    const deadline = new Date(dateRange.start);
    deadline.setHours(0, 0, 0, 0);
    return deadline;
}

function getCalendarRaceDateRange(race) {
    const override = race?.dateRange || race?.range || null;
    if (override?.start && override?.end) {
        const start = new Date(override.start);
        const end = new Date(override.end);
        if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
            return { start, end };
        }
    }
    return window.parseRaceDateRange ? window.parseRaceDateRange(race?.date) : null;
}

function formatRacePredictionDeadline(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '待补充';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `北京时间 ${year}-${month}-${day} ${hour}:${minute}`;
}

function formatRacePredictionCountdown(targetDate, referenceDate = new Date()) {
    if (!(targetDate instanceof Date) || Number.isNaN(targetDate.getTime())) return '封盘时间待定';
    const diff = targetDate.getTime() - referenceDate.getTime();
    if (diff <= 0) return '预测已截止';
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (days > 0) {
        return `距离封盘 ${days}天 ${String(hours).padStart(2, '0')}时 ${String(minutes).padStart(2, '0')}分`;
    }
    return `距离封盘 ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function mountCalendarPredictionCountdown() {
    clearCalendarPredictionCountdown();
    const countdownNode = document.querySelector('#calendarDetailPanelWrap .calendar-predict-countdown');
    if (!countdownNode) return;
    const deadlineValue = countdownNode.dataset.deadline;
    if (!deadlineValue) return;
    const deadline = new Date(deadlineValue);
    if (Number.isNaN(deadline.getTime())) return;
    const update = () => {
        const now = new Date();
        const diff = deadline.getTime() - now.getTime();
        if (diff <= 0) {
            countdownNode.textContent = '预测已截止';
            countdownNode.dataset.countdownState = 'closed';
            clearCalendarPredictionCountdown();
            return;
        }
        countdownNode.textContent = formatRacePredictionCountdown(deadline, now);
        countdownNode.dataset.countdownState = 'running';
    };
    update();
    calendarPredictionCountdownTimer = window.setInterval(update, 1000);
}

function getCalendarRaceState(race, referenceDate = new Date()) {
    if (race?.status === 'completed') return 'completed';
    if (race?.status === 'cancelled') return 'upcoming';
    const current = new Date(referenceDate);
    current.setHours(0, 0, 0, 0);
    const dateRange = getCalendarRaceDateRange(race);
    const raceStart = dateRange?.start || null;
    const raceEnd = dateRange?.end || null;
    const isCurrent = Boolean(raceStart && raceEnd && current >= raceStart && current <= raceEnd);
    const isCompleted = Boolean(raceEnd && current > raceEnd);
    return isCurrent ? 'current' : (isCompleted ? 'completed' : 'upcoming');
}

function getPredictionDriverOptions() {
    return (window.driverStandings || [])
        .map(item => String(item?.name || '').trim())
        .filter(Boolean);
}

function getRacePredictionEntry(round) {
    return racePredictions?.[String(round)] || null;
}

function normalizePredictionResultFromStandings(result) {
    if (!result || typeof result !== 'object') return null;
    const round = Number(result.round || 0);
    const pole = String(result.pole || '').trim();
    const winner = String(result.winner || '').trim();
    const podium = (Array.isArray(result.podium) ? result.podium : [])
        .map(name => String(name || '').trim())
        .filter(Boolean)
        .slice(0, 2);
    if (!round || !pole || !winner || podium.length < 2) return null;
    return { round, pole, winner, podium };
}

function applyPredictionResultsFromStandings(result, options = {}) {
    const normalized = normalizePredictionResultFromStandings(result);
    if (!normalized) return null;
    if (!window.CALENDAR_PREDICTION_RESULTS || typeof window.CALENDAR_PREDICTION_RESULTS !== 'object') {
        window.CALENDAR_PREDICTION_RESULTS = {};
    }
    window.CALENDAR_PREDICTION_RESULTS[normalized.round] = {
        pole: normalized.pole,
        winner: normalized.winner,
        podium: [...normalized.podium]
    };
    window.__standingsPredictionResult = { ...normalized };

    const race = (window.F1_CALENDAR || []).find(item => Number(item.round) === normalized.round);
    if (!race || typeof settleRacePredictionIfNeeded !== 'function') return normalized;

    const beforeEntry = typeof getRacePredictionEntry === 'function' ? getRacePredictionEntry(normalized.round) : null;
    const wasSettled = Boolean(beforeEntry?.settled);
    settleRacePredictionIfNeeded(race);
    const afterEntry = typeof getRacePredictionEntry === 'function' ? getRacePredictionEntry(normalized.round) : null;
    const didSettle = !wasSettled && Boolean(afterEntry?.settled);

    if (didSettle) {
        if (typeof renderCalendar === 'function' && document.getElementById('calendarPage')?.classList.contains('active-page')) {
            renderCalendar();
        }
        if (options.openModal !== false && typeof openPredictionSettlementModal === 'function') {
            openPredictionSettlementModal();
        }
    }

    return normalized;
}

function calculateRacePredictionScore(prediction, result) {
    if (!prediction || !result) return { score: 0, reward: 0, breakdown: [] };
    let score = 0;
    let hitCount = 0;
    const breakdown = [];
    if (prediction.pole === result.pole) {
        score += 12;
        hitCount += 1;
        breakdown.push('杆位命中 +12');
    }
    if (prediction.winner === result.winner) {
        score += 18;
        hitCount += 1;
        breakdown.push('冠军命中 +18');
    }
    (prediction.podium || []).forEach((name, index) => {
        const exact = result.podium?.[index] === name;
        const included = result.podium?.includes(name);
        if (exact) {
            score += 12;
            hitCount += 1;
            breakdown.push(`P${index + 2} 精准命中 +12`);
        } else if (included) {
            score += 6;
            hitCount += 1;
            breakdown.push(`领奖台成员命中 +6`);
        }
    });
    return { score, reward: score > 0 ? 20 + score * 2 : 8, breakdown, hitCount };
}

function settleRacePredictionIfNeeded(race) {
    if (!race) return;
    const key = String(race.round);
    const entry = getRacePredictionEntry(key);
    const result = window.CALENDAR_PREDICTION_RESULTS?.[race.round];
    if (!entry || !result || entry.settled) return;
    const outcome = calculateRacePredictionScore(entry, result);
    racePredictions[key] = {
        ...entry,
        settled: true,
        settledAt: new Date().toISOString(),
        score: outcome.score,
        reward: outcome.reward,
        rewardMailId: `prediction-${key}`,
        hitCount: outcome.hitCount,
        result,
        breakdown: outcome.breakdown,
        feedbackPending: true
    };
    if (typeof createRewardMail === 'function') {
        const raceName = race.gp || `第 ${race.round} 站`;
        createRewardMail({
            id: `prediction-${key}`,
            source: 'prediction',
            amount: outcome.reward,
            title: `${raceName} 预测结算`,
            body: `命中 ${outcome.hitCount || 0} 项，本站得分 ${outcome.score || 0}。奖励已经放进邮箱，等你来领取。`,
            meta: {
                round: race.round,
                raceName,
                score: outcome.score,
                hitCount: outcome.hitCount,
                breakdown: outcome.breakdown
            }
        });
    }
    saveRacePredictions();
}

function settleAllRacePredictions() {
    (window.F1_CALENDAR || []).forEach(race => settleRacePredictionIfNeeded(race));
}

function getLatestPendingPredictionFeedback() {
    const calendar = window.F1_CALENDAR || [];
    const entries = Object.entries(racePredictions || {})
        .map(([round, entry]) => ({ round: Number(round), entry }))
        .sort((left, right) => {
            const byRound = right.round - left.round;
            if (byRound !== 0) return byRound;
            return new Date(right.entry.settledAt || 0).getTime() - new Date(left.entry.settledAt || 0).getTime();
        })
        .map(item => ({
            ...item,
            race: calendar.find(race => race.round === item.round) || null
        }));
    return entries.find(item => item.entry?.settled && item.entry?.feedbackPending)
        || entries.find(item => item.entry?.settled && !item.entry?.feedbackShownAt)
        || null;
}

function openPredictionSettlementModal() {
    const pending = getLatestPendingPredictionFeedback();
    const modal = document.getElementById('predictionSettlementModal');
    const content = document.getElementById('predictionSettlementContent');
    if (!pending || !modal || !content) return;
    const raceName = pending.race?.gp || `第 ${pending.round} 站`;
    const hitCount = Number(pending.entry?.hitCount || 0);
    const reward = Number(pending.entry?.reward || 0);
    const score = Number(pending.entry?.score || 0);
    const breakdown = Array.isArray(pending.entry?.breakdown) ? pending.entry.breakdown : [];
    content.innerHTML = `
        <div class="prediction-settlement-shell">
            <div class="prediction-settlement-kicker">PREDICTION SETTLED</div>
            <div class="prediction-settlement-race">${escapeHtml(raceName)}</div>
            <div class="prediction-settlement-summary">
                <div class="prediction-settlement-stat">
                    <span>命中项</span>
                    <strong>${hitCount}</strong>
                </div>
                <div class="prediction-settlement-stat">
                    <span>本站得分</span>
                    <strong>${score}</strong>
                </div>
                <div class="prediction-settlement-stat is-reward">
                    <span>围场币</span>
                    <strong>+${reward}</strong>
                </div>
            </div>
            <div class="prediction-settlement-copy">这站预测已经自动结算，奖励已经放进围场邮箱，打开邮箱就能自己领取。</div>
            <div class="prediction-settlement-breakdown">
                ${breakdown.length ? breakdown.map(item => `<span>${escapeHtml(item)}</span>`).join('') : '<span>这次没有命中项，保底奖励已发放。</span>'}
            </div>
        </div>
    `;
    modal.dataset.predictionRound = String(pending.round);
    modal.style.display = 'flex';
}

function acknowledgePredictionSettlementFeedback() {
    const modal = document.getElementById('predictionSettlementModal');
    const round = modal?.dataset.predictionRound || '';
    const shownAt = new Date().toISOString();
    if (racePredictions && typeof racePredictions === 'object') {
        Object.keys(racePredictions).forEach(key => {
            const entry = racePredictions[key];
            if (!entry?.settled || !entry?.feedbackPending) return;
            racePredictions[key] = {
                ...entry,
                feedbackPending: false,
                feedbackShownAt: key === round ? shownAt : (entry.feedbackShownAt || shownAt)
            };
        });
        saveRacePredictions();
    }
    closePredictionSettlementModal();
}

function closePredictionSettlementModal() {
    const modal = document.getElementById('predictionSettlementModal');
    if (!modal) return;
    modal.style.display = 'none';
    delete modal.dataset.predictionRound;
}

window.applyPredictionResultsFromStandings = applyPredictionResultsFromStandings;
if (window.__standingsPredictionResult) {
    applyPredictionResultsFromStandings(window.__standingsPredictionResult, { openModal: false });
}

function buildRacePredictionPanel(profile) {
    const roundKey = String(profile.round);
    const entry = getRacePredictionEntry(roundKey);
    const result = window.CALENDAR_PREDICTION_RESULTS?.[profile.round] || null;
    const options = getPredictionDriverOptions();
    const isSubmitted = Boolean(entry && !entry.settled);
    const isCancelled = Boolean(profile.isCancelled);
    const canPredict = profile.stateKey === 'upcoming' && !isSubmitted && !isCancelled;
    const resolvedDeadlineSource = profile.predictionDeadline
        || getRacePredictionDeadline({
            round: profile.round,
            date: profile.date,
            dateRange: profile.dateRange,
            deadline: profile.deadline
        });
    const resolvedDeadline = resolvedDeadlineSource instanceof Date
        ? resolvedDeadlineSource
        : (resolvedDeadlineSource ? new Date(resolvedDeadlineSource) : null);
    const safeDeadline = resolvedDeadline instanceof Date && !Number.isNaN(resolvedDeadline.getTime()) ? resolvedDeadline : null;
    const deadlineText = safeDeadline ? formatRacePredictionDeadline(safeDeadline) : '待补充';
    const countdownText = isCancelled
        ? '该站未举行，不开放预测'
        : profile.stateKey === 'upcoming'
        ? formatRacePredictionCountdown(safeDeadline, new Date())
        : (profile.stateKey === 'current' ? '比赛周已开始，预测入口已关闭' : '本场比赛已结束，预测已封盘');
    const optionMarkup = (selected = '') => options.map(name => `<option value="${escapeHtml(name)}"${name === selected ? ' selected' : ''}>${escapeHtml(name)}</option>`).join('');
    const settledMeta = entry?.settled ? `
        <div class="calendar-predict-settlement">
            <div class="calendar-predict-settlement-score">本场得分 ${entry.score || 0}</div>
            <div class="calendar-predict-settlement-reward">围场币 +${entry.reward || 0}</div>
            <div class="calendar-predict-settlement-lines">${(entry.breakdown || []).map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>
        </div>
    ` : '';
    const pendingMeta = isSubmitted ? `
        <div class="calendar-predict-pending">
            <div class="calendar-predict-pending-title">预测已锁定</div>
            <div class="calendar-predict-pending-copy">这站的答案已经记进浏览器数据里，等正赛结束后会自动结算围场币。</div>
        </div>
    ` : '';
    const resultMarkup = result && profile.stateKey === 'completed' ? `
        <div class="calendar-predict-result">
            <div class="calendar-predict-result-title">实际结果</div>
            <div class="calendar-predict-result-grid">
                <span>杆位 · ${escapeHtml(result.pole)}</span>
                <span>冠军 · ${escapeHtml(result.winner)}</span>
                <span>领奖台 · ${escapeHtml((result.podium || []).join(' / '))}</span>
            </div>
        </div>
    ` : '';
    return `
        <section class="calendar-predict-panel${profile.stateKey === 'current' ? ' is-live' : ''}">
            <div class="calendar-predict-top">
                <div>
                    <div class="calendar-predict-kicker">PREDICTION GAME</div>
                    <div class="calendar-predict-title">赛前预测</div>
                </div>
                <div class="calendar-predict-pill">${isCancelled ? '未举行' : (profile.stateKey === 'completed' ? '已封盘' : (profile.stateKey === 'current' ? '比赛周中' : (isSubmitted ? '已锁定' : '可预测')))}</div>
            </div>
            <div class="calendar-predict-timing">
                <div class="calendar-predict-timing-line"><span>封盘时间</span><strong>${escapeHtml(deadlineText)}</strong></div>
                <div class="calendar-predict-timing-line is-countdown"><span>当前倒计时</span><strong class="calendar-predict-countdown" data-deadline="${safeDeadline ? escapeHtml(safeDeadline.toISOString()) : ''}" data-countdown-state="${profile.stateKey === 'upcoming' ? 'running' : 'closed'}">${escapeHtml(countdownText)}</strong></div>
            </div>
            <div class="calendar-predict-copy">${isCancelled
                ? profile.cancelledNote
                : profile.stateKey === 'completed'
                ? '这一站已经结束，这里会显示你当时的预测和自动结算结果。'
                : (profile.stateKey === 'current'
                    ? '比赛周已经开始，预测入口会自动关闭。下一站开放前，你还能继续提前下注。'
                    : (isSubmitted
                        ? '你的预测已经锁档，比赛开始前不会再允许改动，等这站结束后系统会自动结算。'
                        : '猜这站的杆位、冠军和领奖台。比赛开始前可以提交一次，比赛结束后会自动按结果结算。'))}</div>
            ${resultMarkup}
            ${pendingMeta}
            ${settledMeta}
            <div class="calendar-predict-form">
                <label class="calendar-predict-field"><span>杆位</span><select id="predictionPoleSelect" ${canPredict ? '' : 'disabled'}><option value="">选择车手</option>${optionMarkup(entry?.pole || '')}</select></label>
                <label class="calendar-predict-field"><span>冠军</span><select id="predictionWinnerSelect" ${canPredict ? '' : 'disabled'}><option value="">选择车手</option>${optionMarkup(entry?.winner || '')}</select></label>
                <div class="calendar-predict-podium">
                    <label class="calendar-predict-field"><span>P2</span><select id="predictionPodium2Select" ${canPredict ? '' : 'disabled'}><option value="">选择车手</option>${optionMarkup(entry?.podium?.[0] || '')}</select></label>
                    <label class="calendar-predict-field"><span>P3</span><select id="predictionPodium3Select" ${canPredict ? '' : 'disabled'}><option value="">选择车手</option>${optionMarkup(entry?.podium?.[1] || '')}</select></label>
                </div>
                <div class="calendar-predict-actions">
                    ${canPredict ? `<button type="button" class="calendar-predict-btn" id="saveRacePredictionBtn" data-round="${profile.round}">提交并锁定预测</button>` : `<div class="calendar-predict-lock">${isCancelled ? '本场未举行，不会开放预测，也不会产生结算。' : (profile.stateKey === 'completed' ? '比赛已结束，本场预测已经封盘。' : (isSubmitted ? '这站预测已经提交并锁定，不能再改。' : '比赛周已经开始，周五到周日不再开放预测。'))}</div>`}
                    <div class="calendar-predict-hint">计分：杆位 +12，冠军 +18，领奖台精准位置 +12，猜中领奖台成员但位置不完全一致也会给分。</div>
                </div>
            </div>
        </section>
    `;
}

function buildCalendarRaceProfile(race, stateKey) {
    const details = CALENDAR_RACE_DETAILS[race?.round] || {};
    const history = CALENDAR_HISTORY_DRIVERS[race?.round] || {};
    const trackMap = getCalendarTrackMap(race?.round, race?.gp);
    const isCancelled = race?.status === 'cancelled' || Boolean(CALENDAR_UNHELD_RACE_NOTES[race.round]);
    const stateLabel = isCancelled
        ? '未举行'
        : (stateKey === 'current' ? '进行中' : (stateKey === 'completed' ? '已完赛' : '即将到站'));
    const stateKicker = isCancelled
        ? 'ROUND UPDATE'
        : (stateKey === 'current' ? 'TRACK LIVE DOSSIER' : (stateKey === 'completed' ? 'POST-RACE DOSSIER' : 'CIRCUIT PRELOAD'));
    const stateNote = isCancelled
        ? '这一站在 2026 赛季未举行，因此这里只保留赛道档案，不开放结果展示和预测结算。'
        : (stateKey === 'current'
            ? '这一站正处在真实比赛周节奏里，赛道特征会直接放大调校、轮胎和车手状态。'
            : (stateKey === 'completed'
                ? '这一站已经跑完，更适合当作赛后回看：看赛道脾气、看比赛窗口，也看谁最适合这里。'
                : '这站还在发车线之前，赛道档案更像一份赛前工程简报，强调节奏、难点和比赛窗口。'));
    return {
        round: race.round,
        gp: race.gp,
        date: race.displayDate || race.date,
        location: race.location || 'F1 World Championship',
        sprint: Boolean(race.sprint),
        stateKey,
        stateLabel,
        stateKicker,
        accentRgb: CALENDAR_PANEL_ACCENTS[race.round] || 'var(--primary-color-rgb)',
        predictionDeadline: getRacePredictionDeadline(race),
        isCancelled,
        cancelledNote: race.note || CALENDAR_UNHELD_RACE_NOTES[race.round] || '',
        circuit: details.circuit || 'Grand Prix Circuit',
        lapLength: details.lapLength || 'Data pending',
        laps: details.laps || '--',
        distance: details.distance || '--',
        firstHeld: details.firstHeld || '--',
        signature: details.signature || '这条赛道的性格更适合在比赛周里亲自感受，重点通常落在节奏转换、抓地窗口和出弯质量上。',
        sectorNote: details.sectorNote || '关键区段通常会把一台车的平衡、轮胎温度和车手信心一起暴露出来。',
        hero: details.hero || '真正适合这里的人，往往能在看似普通的弯里提前把时间抠出来。',
        note: details.note || stateNote,
        historyDriver: history.name || 'Still Writing',
        historyTag: history.tag || '历史名片待续',
        historyNote: history.note || '这条赛道的故事还在继续，下一位把名字刻进去的人也许就在这个周末。',
        trackMap,
        stateNote,
        predictionPanel: buildRacePredictionPanel({
            round: race.round,
            stateKey,
            isCancelled,
            date: race.date,
            dateRange: race.dateRange,
            predictionDeadline: getRacePredictionDeadline(race),
            deadline: race.deadline
        })
    };
}

function renderCalendarDetailPanel(profile) {
    const stateBadge = profile.isCancelled
        ? '<span class="calendar-detail-status is-upcoming">UNHELD FILE</span>'
        : (profile.stateKey === 'current'
            ? '<span class="calendar-detail-status is-live">LIVE WINDOW</span>'
            : (profile.stateKey === 'completed'
                ? '<span class="calendar-detail-status is-completed">FINISHED FILE</span>'
                : '<span class="calendar-detail-status is-upcoming">GRID PRELOAD</span>'));
    const sprintBadge = profile.sprint ? '<span class="calendar-detail-chip">Sprint Weekend</span>' : '';
    const trackMapMarkup = profile.trackMap ? `
        <article class="calendar-track-map-card">
            <div class="calendar-track-map-top">
                <span class="calendar-track-map-kicker">${escapeHtml(profile.trackMap.kicker || 'TRACK MAP')}</span>
                <span class="calendar-track-map-chip">官方图</span>
            </div>
            <div class="calendar-track-map-frame">
                <img
                    class="calendar-track-map-image"
                    src="${escapeHtml(profile.trackMap.src)}"
                    data-track-fallbacks="${escapeHtml((profile.trackMap.fallbacks || []).join('|'))}"
                    alt="${escapeHtml(profile.trackMap.alt || `${profile.gp} 赛道图`)}"
                    loading="eager"
                    decoding="async"
                    referrerpolicy="no-referrer"
                />
            </div>
            <div class="calendar-track-map-note">${escapeHtml(profile.trackMap.note || '')}</div>
        </article>
    ` : '';
    return `
        <section class="calendar-detail-panel is-${profile.stateKey}" data-calendar-panel-state="${profile.stateKey}" style="--calendar-panel-rgb:${profile.accentRgb};">
            <span class="calendar-detail-speedline" aria-hidden="true"></span>
            <span class="calendar-detail-sheen" aria-hidden="true"></span>
            <div class="calendar-detail-top">
                <div class="calendar-detail-copy">
                    <div class="calendar-detail-kicker">${escapeHtml(profile.stateKicker)}</div>
                    <h3 class="calendar-detail-title">${escapeHtml(profile.gp)}</h3>
                    <div class="calendar-detail-subtitle">${escapeHtml(profile.circuit)}</div>
                </div>
                <div class="calendar-detail-badges">
                    ${stateBadge}
                    ${sprintBadge}
                </div>
            </div>
            <div class="calendar-detail-meta">
                <span>Round ${escapeHtml(String(profile.round))}</span>
                <span>${escapeHtml(profile.date)}</span>
                <span>${escapeHtml(profile.location)}</span>
            </div>
            ${trackMapMarkup}
            <div class="calendar-detail-grid">
                <article class="calendar-detail-stat">
                    <span class="calendar-detail-label">单圈长度</span>
                    <strong>${escapeHtml(profile.lapLength)}</strong>
                </article>
                <article class="calendar-detail-stat">
                    <span class="calendar-detail-label">正赛圈数</span>
                    <strong>${escapeHtml(profile.laps)}</strong>
                </article>
                <article class="calendar-detail-stat">
                    <span class="calendar-detail-label">比赛距离</span>
                    <strong>${escapeHtml(profile.distance)}</strong>
                </article>
                <article class="calendar-detail-stat">
                    <span class="calendar-detail-label">首办年份</span>
                    <strong>${escapeHtml(profile.firstHeld)}</strong>
                </article>
            </div>
            <div class="calendar-detail-briefs">
                <article class="calendar-detail-legend">
                    <div class="calendar-detail-legend-head">
                        <span class="calendar-detail-brief-label">历史名片</span>
                        <span class="calendar-detail-legend-tag">${escapeHtml(profile.historyTag)}</span>
                    </div>
                    <div class="calendar-detail-legend-name">${escapeHtml(profile.historyDriver)}</div>
                    <p>${escapeHtml(profile.historyNote)}</p>
                </article>
                <article class="calendar-detail-brief">
                    <span class="calendar-detail-brief-label">赛道性格</span>
                    <p>${escapeHtml(profile.signature)}</p>
                </article>
                <article class="calendar-detail-brief">
                    <span class="calendar-detail-brief-label">关键区段</span>
                    <p>${escapeHtml(profile.sectorNote)}</p>
                </article>
                <article class="calendar-detail-brief">
                    <span class="calendar-detail-brief-label">更适合谁</span>
                    <p>${escapeHtml(profile.hero)}</p>
                </article>
                <article class="calendar-detail-brief is-emphasis">
                    <span class="calendar-detail-brief-label">周末气压</span>
                    <p>${escapeHtml(profile.note)}</p>
                </article>
            </div>
            ${profile.predictionPanel || ''}
        </section>
    `;
}

function hydrateCalendarTrackMaps(scope = document) {
    const images = Array.from(scope.querySelectorAll('.calendar-track-map-image'));
    images.forEach(image => {
        if (image.dataset.trackMapHydrated === 'true') return;
        image.dataset.trackMapHydrated = 'true';
        const fallbacks = String(image.dataset.trackFallbacks || '')
            .split('|')
            .map(item => item.trim())
            .filter(Boolean);
        let fallbackIndex = 0;
        image.addEventListener('error', () => {
            if (fallbackIndex < fallbacks.length) {
                image.src = fallbacks[fallbackIndex];
                fallbackIndex += 1;
                return;
            }
            const card = image.closest('.calendar-track-map-card');
            if (card) {
                card.classList.add('is-track-map-unavailable');
                const note = card.querySelector('.calendar-track-map-note');
                if (note) {
                    note.textContent = '这站的官方赛道图暂时未接通，稍后可以继续重试。';
                }
            }
            image.remove();
        });
    });
}

renderCalendar = function renderCalendarOverride() {
    const container = document.getElementById('calendarContainer');
    if (!container) return;
    const weekendEvent = window.getCurrentRaceWeekendEvent ? window.getCurrentRaceWeekendEvent() : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const calendarData = window.F1_CALENDAR || [];
    calendarData.forEach(race => settleRacePredictionIfNeeded(race));
    const buildCalendarRacePreview = (race, stateKey) => {
        const sprintText = race.sprint ? ' · Sprint Weekend' : '';
        const isCancelled = race.status === 'cancelled' || Boolean(CALENDAR_UNHELD_RACE_NOTES[race.round]);
        if (isCancelled) {
            return {
                kicker: 'ROUND CANCELLED',
                title: `${race.gp} 本赛季未举行`,
                meta: `Round ${race.round} · ${race.location || '赛程调整'}${sprintText}`,
                note: race.note || '这一站不会进入结果展示，也不会开放预测。',
                cardState: 'completed'
            };
        }
        if (stateKey === 'current') {
            return {
                kicker: 'LIVE PREVIEW',
                title: `${race.gp} 正在进入围场焦点`,
                meta: `Round ${race.round} · ${race.location || '赛道待命'}${sprintText}`,
                note: '\u5f53\u524d\u8fd9\u4e00\u7ad9\u4f1a\u66f4\u7a81\u51fa\u8d5b\u9053\u72b6\u6001\u3001\u8f66\u961f\u8282\u594f\u548c\u56f4\u573a\u5b9e\u65f6\u6c14\u6c1b\u3002',
                cardState: 'current'
            };
        }
        if (stateKey === 'completed') {
            return {
                kicker: 'FINISHED ROUND',
                title: `${race.gp} \u5df2\u5b8c\u8d5b`,
                meta: `Round ${race.round} · ${race.location || '已完赛'}${sprintText}`,
                note: '\u8fd9\u4e00\u7ad9\u5df2\u7ecf\u8dd1\u5b8c\uff0c\u663e\u793a\u4f1a\u66f4\u504f\u5411\u8d5b\u540e\u56de\u770b\u548c\u6536\u675f\u72b6\u6001\u3002',
                cardState: 'completed'
            };
        }
        return {
            kicker: 'NEXT TARGET',
            title: `${race.gp} \u5373\u5c06\u5230\u7ad9`,
            meta: `Round ${race.round} · ${race.location || '待命中'}${sprintText}`,
            note: '\u8fd9\u4e00\u7ad9\u8fd8\u6ca1\u5f00\u59cb\uff0c\u6c14\u6c1b\u4f1a\u66f4\u50cf\u8f66\u5e93\u9884\u70ed\u548c\u51fa\u53d1\u524d\u7684\u84c4\u529b\u9636\u6bb5\u3002',
            cardState: 'upcoming'
        };
    };
    const initialRace = calendarData.find(race => race.status !== 'cancelled' && getCalendarRaceState(race, today) === 'current')
        || calendarData.find(race => race.status !== 'cancelled' && getCalendarRaceState(race, today) === 'upcoming')
        || calendarData[calendarData.length - 1]
        || null;
    if (initialRace && !calendarData.some(race => race.round === activeCalendarRound)) {
        activeCalendarRound = initialRace.round;
    }
    const selectedRace = calendarData.find(race => race.round === activeCalendarRound) || initialRace;
    const selectedState = selectedRace ? getCalendarRaceState(selectedRace, today) : 'upcoming';
    const selectedProfile = selectedRace ? buildCalendarRaceProfile(selectedRace, selectedState) : null;
    const selectedPreview = selectedRace ? buildCalendarRacePreview(selectedRace, selectedState) : null;
    const list = calendarData.map(race => {
        const stateKey = getCalendarRaceState(race, today);
        const displayDate = race.displayDate || race.date;
        const isCurrent = stateKey === 'current';
        const isCompleted = stateKey === 'completed';
        const isCancelled = race.status === 'cancelled' || Boolean(CALENDAR_UNHELD_RACE_NOTES[race.round]);
        const stateClass = isCurrent ? ' is-current' : (isCompleted ? ' is-completed' : ' is-upcoming');
        const selectedClass = race.round === activeCalendarRound ? ' is-selected' : '';
        const stateBadge = isCancelled
            ? '<span class="calendar-state-pill is-upcoming">UNHELD</span>'
            : (isCurrent
                ? '<span class="calendar-live-badge">LIVE</span>'
                : (isCompleted ? '<span class="calendar-state-pill">FINISHED</span>' : '<span class="calendar-state-pill is-upcoming">LOCKED IN</span>'));
        return `
        <li class="calendar-item${stateClass}${selectedClass}" data-round="${race.round}" data-calendar-state="${stateKey}" tabindex="0">
            <span class="calendar-item-glow" aria-hidden="true"></span>
            <span class="calendar-item-stripe" aria-hidden="true"></span>
            <div class="calendar-item-main">
                    <span class="calendar-round">R${race.round}</span>
                <div class="calendar-item-copy">
                    <span class="calendar-date">${displayDate}</span>
                    <span class="calendar-name">${race.gp}${race.sprint ? '<span class="calendar-sprint">Sprint</span>' : ''}${stateBadge}</span>
                </div>
            </div>
        </li>
    `;
    }).join('');
    const weekendCard = weekendEvent ? `
        <div class="calendar-event-card${weekendEvent.status === 'live' ? ' is-live' : ''}" id="calendarEventCard">
            <div class="calendar-event-kicker">${weekendEvent.status === 'live' ? 'RACE WEEK' : (weekendEvent.status === 'countdown' ? 'COUNTDOWN' : 'SEASON STATUS')}</div>
            <div class="calendar-event-title">${escapeHtml(window.getRaceWeekendHeadline ? window.getRaceWeekendHeadline(weekendEvent) : '\u5f53\u524d\u6bd4\u8d5b\u5468')}</div>
            <div class="calendar-event-meta">Round ${escapeHtml(String(weekendEvent.race.round || ''))} · ${escapeHtml(weekendEvent.race.location || '')}${weekendEvent.race.sprint ? ' · Sprint' : ''}</div>
            <div class="calendar-event-note">${escapeHtml(weekendEvent.phase?.note || '')}</div>
        </div>
    ` : (selectedPreview ? `
        <div class="calendar-event-card${selectedState === 'current' ? ' is-live' : ''}" id="calendarEventCard">
            <div class="calendar-event-kicker">${escapeHtml(selectedPreview.kicker)}</div>
            <div class="calendar-event-title">${escapeHtml(selectedPreview.title)}</div>
            <div class="calendar-event-meta">${escapeHtml(selectedPreview.meta)}</div>
            <div class="calendar-event-note">${escapeHtml(selectedPreview.note)}</div>
        </div>
    ` : '');
    container.innerHTML = `
        <div class="calendar-section">
            <div class="calendar-header">
                <div class="calendar-title">2026 F1 赛历</div>
                <button class="calendar-back-btn icon-text-btn" id="calendarBackBtn">${window.getUiIconMarkup ? window.getUiIconMarkup('chevronLeft', 'calendar-back-icon', '返回') : ''}<span>返回</span></button>
            </div>
            <div class="calendar-shell">
                <div class="calendar-list-wrap">
                    ${weekendCard}
                    <ul class="calendar-list">${list}</ul>
                </div>
                <div class="calendar-detail-panel-wrap" id="calendarDetailPanelWrap">
                    ${selectedProfile ? renderCalendarDetailPanel(selectedProfile) : ''}
                </div>
            </div>
        </div>
    `;
    clearCalendarPredictionCountdown();
    document.getElementById('calendarBackBtn')?.addEventListener('click', () => switchTab('chat'));
    const eventCard = document.getElementById('calendarEventCard');
    const detailPanelWrap = document.getElementById('calendarDetailPanelWrap');
    const kickerEl = eventCard?.querySelector('.calendar-event-kicker');
    const titleEl = eventCard?.querySelector('.calendar-event-title');
    const metaEl = eventCard?.querySelector('.calendar-event-meta');
    const noteEl = eventCard?.querySelector('.calendar-event-note');
    let basePreview = eventCard && kickerEl && titleEl && metaEl && noteEl ? {
        kicker: kickerEl.textContent || '',
        title: titleEl.textContent || '',
        meta: metaEl.textContent || '',
        note: noteEl.textContent || ''
    } : null;
    const applyPreview = (payload) => {
        if (!eventCard || !kickerEl || !titleEl || !metaEl || !noteEl) return;
        kickerEl.textContent = payload.kicker;
        titleEl.textContent = payload.title;
        metaEl.textContent = payload.meta;
        noteEl.textContent = payload.note;
        eventCard.classList.add('is-hover-preview');
        eventCard.dataset.previewState = payload.cardState;
    };
    const resetPreview = () => {
        if (!eventCard || !kickerEl || !titleEl || !metaEl || !noteEl || !basePreview) return;
        kickerEl.textContent = basePreview.kicker;
        titleEl.textContent = basePreview.title;
        metaEl.textContent = basePreview.meta;
        noteEl.textContent = basePreview.note;
        eventCard.classList.remove('is-hover-preview');
        delete eventCard.dataset.previewState;
    };
    const setSelectedRound = (round) => {
        activeCalendarRound = round;
        Array.from(container.querySelectorAll('.calendar-item')).forEach((node) => {
            node.classList.toggle('is-selected', Number(node.dataset.round) === round);
        });
    };
    const bindCalendarPredictionActions = (round) => {
        document.getElementById('saveRacePredictionBtn')?.addEventListener('click', () => {
            const pole = document.getElementById('predictionPoleSelect')?.value || '';
            const winner = document.getElementById('predictionWinnerSelect')?.value || '';
            const podium2 = document.getElementById('predictionPodium2Select')?.value || '';
            const podium3 = document.getElementById('predictionPodium3Select')?.value || '';
            if (!pole || !winner || !podium2 || !podium3) {
                showToast('先把杆位、冠军和领奖台猜完整', true);
                return;
            }
            if (new Set([pole, winner, podium2, podium3]).size < 4) {
                showToast('四个位置请尽量选择不同车手', true);
                return;
            }
            racePredictions[String(round)] = {
                pole,
                winner,
                podium: [podium2, podium3],
                submittedAt: new Date().toISOString(),
                settled: false
            };
            saveRacePredictions();
            showToast('这站预测已锁定，等正赛结束后自动结算', false);
            const selectedRaceEntry = calendarData.find(entry => entry.round === round);
            if (!selectedRaceEntry) return;
            updateDetailPanel(buildCalendarRaceProfile(selectedRaceEntry, getCalendarRaceState(selectedRaceEntry, today)));
        });
    };
    const updateDetailPanel = (profile) => {
        if (!detailPanelWrap || !profile) return;
        detailPanelWrap.innerHTML = renderCalendarDetailPanel(profile);
        detailPanelWrap.classList.remove('is-panel-refresh');
        window.requestAnimationFrame(() => detailPanelWrap.classList.add('is-panel-refresh'));
        hydrateCalendarTrackMaps(detailPanelWrap);
        bindCalendarPredictionActions(profile.round);
        mountCalendarPredictionCountdown();
    };
    Array.from(container.querySelectorAll('.calendar-item')).forEach((item, index) => {
        const race = calendarData[index];
        if (!race) return;
        const stateKey = item.dataset.calendarState || 'upcoming';
        const payload = buildCalendarRacePreview(race, stateKey);
        const profile = buildCalendarRaceProfile(race, stateKey);
        const activate = (persist = false) => {
            if (persist) {
                setSelectedRound(race.round);
                basePreview = payload;
            }
            updateDetailPanel(profile);
            applyPreview(payload);
        };
        item.addEventListener('mouseenter', () => activate(false));
        item.addEventListener('mouseleave', () => {
            const persistedRace = calendarData.find(entry => entry.round === activeCalendarRound);
            const persistedState = persistedRace ? getCalendarRaceState(persistedRace, today) : null;
            if (persistedRace && persistedState) {
                updateDetailPanel(buildCalendarRaceProfile(persistedRace, persistedState));
            }
            resetPreview();
        });
        item.addEventListener('focus', () => activate(false));
        item.addEventListener('blur', () => {
            const persistedRace = calendarData.find(entry => entry.round === activeCalendarRound);
            const persistedState = persistedRace ? getCalendarRaceState(persistedRace, today) : null;
            if (persistedRace && persistedState) {
                updateDetailPanel(buildCalendarRaceProfile(persistedRace, persistedState));
            }
            resetPreview();
        });
        item.addEventListener('click', () => activate(true));
    });
    if (selectedProfile) {
        hydrateCalendarTrackMaps(detailPanelWrap);
        bindCalendarPredictionActions(selectedProfile.round);
        mountCalendarPredictionCountdown();
    }
};
