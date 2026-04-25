// 椤甸潰娓叉煋銆佹ā鎬佹銆佽祫鏂欍€丄PI銆佸瓨妗ｄ笌鍏憡

function renderCalendar() {
    const container = document.getElementById('calendarContainer');
    if (!container) return;
    const weekendEvent = window.getCurrentRaceWeekendEvent ? window.getCurrentRaceWeekendEvent() : null;
    const list = (window.F1_CALENDAR || []).map(race => `
        <li class="calendar-item${weekendEvent?.race?.round === race.round && weekendEvent?.status !== 'season_complete' ? ' is-current' : ''}">
            <span class="calendar-round">${race.round}</span>
            <span class="calendar-date">${race.date}</span>
            <span class="calendar-name">${race.gp}${race.sprint ? '<span class="calendar-sprint"> (Sprint)</span>' : ''}${weekendEvent?.race?.round === race.round && weekendEvent?.status !== 'season_complete' ? '<span class="calendar-live-badge">LIVE</span>' : ''}</span>
        </li>
    `).join('');
    const weekendCard = weekendEvent ? `
        <div class="calendar-event-card${weekendEvent.status === 'live' ? ' is-live' : ''}" id="calendarEventCard">
            <div class="calendar-event-kicker" id="calendarEventKicker">${weekendEvent.status === 'live' ? 'RACE WEEK' : (weekendEvent.status === 'countdown' ? 'COUNTDOWN' : 'SEASON STATUS')}</div>
            <div class="calendar-event-title">${escapeHtml(window.getRaceWeekendHeadline ? window.getRaceWeekendHeadline(weekendEvent) : '\u5f53\u524d\u6bd4\u8d5b\u5468')}</div>
            <div class="calendar-event-meta">Round ${escapeHtml(String(weekendEvent.race.round || ''))} 路 ${escapeHtml(weekendEvent.race.location || '')}${weekendEvent.race.sprint ? ' 路 Sprint' : ''}</div>
            <div class="calendar-event-note">${escapeHtml(weekendEvent.phase?.note || '')}</div>
        </div>
    ` : '';
    container.innerHTML = `<div class="calendar-section"><div class="calendar-header"><div class="calendar-title">2026 F1 璧涘巻</div><button class="calendar-back-btn icon-text-btn" id="calendarBackBtn">${window.getUiIconMarkup ? window.getUiIconMarkup('chevronLeft', 'calendar-back-icon', '杩斿洖') : ''}<span>杩斿洖</span></button></div>${weekendCard}<ul class="calendar-list">${list}</ul></div>`;
    document.getElementById('calendarBackBtn')?.addEventListener('click', () => switchTab('chat'));
}

function exportGameData() {
    const payload = {
        favorability,
        driverDateMemories,
        driverDiaries,
        pinnedDrivers,
        chatHistories,
        groupChats,
        groupChatsCollapsed,
        teamSectionsCollapsed,
        driverAvatars,
        userProfile,
        feedPosts,
        apiConfig,
        userCoins,
        signData,
        giftInventory,
        giftHistory,
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
    driverDiaries = saveData.driverDiaries || driverDiaries;
    pinnedDrivers = saveData.pinnedDrivers || pinnedDrivers;
    chatHistories = saveData.chatHistories || chatHistories;
    groupChats = saveData.groupChats || groupChats;
    groupChatsCollapsed = saveData.groupChatsCollapsed ?? groupChatsCollapsed;
    teamSectionsCollapsed = saveData.teamSectionsCollapsed || teamSectionsCollapsed;
    driverAvatars = saveData.driverAvatars || driverAvatars;
    userProfile = { ...userProfile, ...(saveData.userProfile || {}) };
    feedPosts = saveData.feedPosts || feedPosts;
    apiConfig = { ...apiConfig, ...(saveData.apiConfig || {}) };
    userCoins = saveData.userCoins ?? userCoins;
    signData = saveData.signData || signData;
    giftInventory = saveData.giftInventory || giftInventory;
    giftHistory = saveData.giftHistory || giftHistory;
    secureStorageSet('f1_favorability', favorability);
    secureStorageSet('f1_date_memories', driverDateMemories);
    secureStorageSet('f1_driver_diaries', driverDiaries);
    secureStorageSet('f1_pinned_drivers', pinnedDrivers);
    secureStorageSet('f1_chat_histories', chatHistories);
    secureStorageSet('f1_group_chats', groupChats);
    secureStorageSet('f1_group_chats_collapsed', groupChatsCollapsed);
    secureStorageSet('f1_team_sections_collapsed', teamSectionsCollapsed);
    secureStorageSet('f1_driver_avatars', driverAvatars);
    secureStorageSet('f1_user_profile', userProfile);
    secureStorageSet('f1_api_config', apiConfig);
    secureStorageSet('f1_user_coins', userCoins);
    secureStorageSet('f1_sign_data', signData);
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
    if (typeof renderPaddockStore === 'function') renderPaddockStore();
}

function importGameDataFromFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
        try {
            applyLoadedData(importSecureSavePayload(reader.result));
            showToast('瀛樻。瀵煎叆鎴愬姛', false);
        } catch (error) {
            handleApiError(error, '瀛樻。瀵煎叆');
        }
    };
    reader.readAsText(file);
}

function openSaveModal() { document.getElementById('saveModal').style.display = 'flex'; }
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
        name: document.getElementById('profileName').value.trim() || '杞﹁糠',
        gender: document.getElementById('profileGender').value,
        age: document.getElementById('profileAge').value.trim() || '?',
        height: document.getElementById('profileHeight').value.trim() || '?',
        weight: document.getElementById('profileWeight').value.trim() || '?',
        nationality: document.getElementById('profileNationality').value.trim() || '鏈煡',
        roleType: document.getElementById('profileRoleSelect').value,
        customRole: document.getElementById('profileCustomRole').value.trim(),
        personality: document.getElementById('profilePersonality').value.trim() || '鐑儏',
        hobby: document.getElementById('profileHobby').value.trim() || '璧涜溅',
        background: document.getElementById('profileBackground').value.trim()
    };
    secureStorageSet('f1_user_profile', userProfile);
    closeProfileModal();
    showToast('璧勬枡鍗″凡鏇存柊', false);
}

function toggleCustomRoleInput() {
    const input = document.getElementById('profileCustomRole');
    input.style.display = document.getElementById('profileRoleSelect').value === '\u81ea\u5b9a\u4e49' ? 'block' : 'none';
}

function openProfileModal() { document.getElementById('profileModal').style.display = 'flex'; }
function closeProfileModal() { document.getElementById('profileModal').style.display = 'none'; clearSidebarActive(); }

function loadApiConfig() {
    apiConfig = { ...apiConfig, ...(secureStorageGet('f1_api_config', {}) || {}) };
    document.getElementById('apiUrl').value = apiConfig.url || '';
    document.getElementById('apiKey').value = apiConfig.key || '';
    setModelOptions(availableApiModels.length ? availableApiModels : [apiConfig.model || 'deepseek-chat'], apiConfig.model || 'deepseek-chat');
    updateCustomModelVisibility();
    useAI = Boolean(apiConfig.key && apiConfig.url && apiConfig.model);
    setApiStatus(useAI ? '褰撳墠宸插惎鐢ㄧ湡瀹?API' : '褰撳墠浣跨敤妯℃嫙妯″紡', useAI ? 'success' : 'idle');
}

function saveApiConfig() {
    apiConfig = {
        url: document.getElementById('apiUrl').value.trim(),
        key: document.getElementById('apiKey').value.trim(),
        model: getSelectedModelName() || 'deepseek-chat'
    };
    secureStorageSet('f1_api_config', apiConfig);
    useAI = Boolean(apiConfig.key && apiConfig.url && apiConfig.model);
    setApiStatus(useAI ? '宸蹭繚瀛樺苟鍚敤鐪熷疄 API' : '缂哄皯瀹屾暣閰嶇疆锛屼粛浣跨敤妯℃嫙妯″紡', useAI ? 'success' : 'warning');
    showToast('AI \u8bbe\u7f6e\u5df2\u4fdd\u5b58', false);
    closeModal();
}

function openApiModal() {
    document.getElementById('apiModal').style.display = 'flex';
    loadApiConfig();
}

function closeModal() { document.getElementById('apiModal').style.display = 'none'; clearSidebarActive(); }

function deprecatedShowDriverProfileLegacyA(driverId) {
    const profile = window.DRIVER_PROFILES[driverId];
    const driver = window.DRIVERS.find(item => item.id === driverId);
    if (!profile || !driver) return;
    const avatarBg = getDriverAvatarStyle(driverId);
    const favor = favorability[driverId] || 0;
    const mood = getFavorMood(favor);
    document.getElementById('driverProfileContent').innerHTML = `<div class="profile-card-header"><div class="profile-card-avatar" style="${avatarBg ? `background-image:${avatarBg};background-size:cover;` : `background-color:${window.TEAM_COLORS[driver.team] || '#2a2f3a'};`}">${avatarBg ? '' : driver.avatarLetter}</div><div class="profile-card-title-row"><div class="profile-card-name">${profile.fullName}</div><button class="profile-diary-btn" id="openDiaryBtn">\u65e5\u8bb0</button></div><div class="profile-card-team">${profile.team}</div><div style="margin-top:8px; color:#ffb347; font-size:0.8rem;">\u597d\u611f\u5ea6\uff1a${favor}/100\uff08${mood}\uff09</div></div><div class="profile-card-section"><div class="profile-card-section-title">\u57fa\u672c\u4fe1\u606f</div><div class="profile-card-info-row"><span>\u56fd\u7c4d</span><span>${profile.nationality}</span></div><div class="profile-card-info-row"><span>\u51fa\u751f\u65e5\u671f</span><span>${profile.birthDate}</span></div><div class="profile-card-info-row"><span>\u8eab\u9ad8/\u4f53\u91cd</span><span>${profile.height} / ${profile.weight}</span></div><div class="profile-card-info-row"><span>F1 \u9996\u79c0</span><span>${profile.f1Debut}</span></div></div><div class="profile-card-section"><div class="profile-card-section-title">\u751f\u6daf\u6570\u636e</div><div class="profile-card-info-row"><span>\u5206\u7ad9\u51a0\u519b</span><span>${profile.totalWins}</span></div><div class="profile-card-info-row"><span>\u6746\u4f4d</span><span>${profile.totalPoles}</span></div><div class="profile-card-info-row"><span>\u9886\u5956\u53f0</span><span>${profile.totalPodiums}</span></div></div>`;
    document.getElementById('driverProfileModal').style.display = 'flex';
    document.getElementById('openDiaryBtn')?.addEventListener('click', () => openDiaryModal(driverId));
}

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

function deprecatedShowDriverProfileLegacyB(driverId) {
    const profile = window.DRIVER_PROFILES[driverId];
    const driver = window.DRIVERS.find(item => item.id === driverId);
    if (!profile || !driver) return;
    const avatarBg = getDriverAvatarStyle(driverId);
    const favor = favorability[driverId] || 0;
    const mood = getFavorMood(favor);
    document.getElementById('driverProfileContent').innerHTML = `<div class="profile-card-header"><div class="profile-card-avatar-row"><button type="button" class="profile-card-avatar profile-card-avatar-button" id="driverProfileAvatarBtn" style="${avatarBg ? `background-image:${avatarBg};background-size:cover;` : `background-color:${window.TEAM_COLORS[driver.team] || '#2a2f3a'};`}">${avatarBg ? '' : driver.avatarLetter}</button><button type="button" class="profile-avatar-reset-btn" id="resetDriverAvatarBtn" title="\u6062\u590d\u521d\u59cb\u5934\u50cf" aria-label="\u6062\u590d\u521d\u59cb\u5934\u50cf"><span class="profile-avatar-reset-icon" aria-hidden="true"></span></button></div><div class="profile-avatar-hint">\u70b9\u51fb\u5934\u50cf\u5373\u53ef\u66f4\u6362</div><div class="profile-card-title-row"><div class="profile-card-name">${profile.fullName}</div><button class="profile-diary-btn" id="openDiaryBtn">\u65e5\u8bb0</button></div><div class="profile-card-team">${profile.team}</div><div style="margin-top:8px; color:#ffb347; font-size:0.8rem;">\u597d\u611f\u5ea6\uff1a${favor}/100\uff08${mood}\uff09</div></div><div class="profile-card-section"><div class="profile-card-section-title">\u57fa\u672c\u4fe1\u606f</div><div class="profile-card-info-row"><span>\u56fd\u7c4d</span><span>${profile.nationality}</span></div><div class="profile-card-info-row"><span>\u51fa\u751f\u65e5\u671f</span><span>${profile.birthDate}</span></div><div class="profile-card-info-row"><span>\u8eab\u9ad8/\u4f53\u91cd</span><span>${profile.height} / ${profile.weight}</span></div><div class="profile-card-info-row"><span>F1 \u9996\u79c0</span><span>${profile.f1Debut}</span></div></div><div class="profile-card-section"><div class="profile-card-section-title">\u751f\u6daf\u6570\u636e</div><div class="profile-card-info-row"><span>\u5206\u7ad9\u51a0\u519b</span><span>${profile.totalWins}</span></div><div class="profile-card-info-row"><span>\u6746\u4f4d</span><span>${profile.totalPoles}</span></div><div class="profile-card-info-row"><span>\u9886\u5956\u53f0</span><span>${profile.totalPodiums}</span></div></div>`;
    document.getElementById('driverProfileModal').style.display = 'flex';
    document.getElementById('openDiaryBtn')?.addEventListener('click', () => openDiaryModal(driverId));
    document.getElementById('driverProfileAvatarBtn')?.addEventListener('click', () => openAvatarUpload(driverId));
    document.getElementById('resetDriverAvatarBtn')?.addEventListener('click', () => {
        resetDriverAvatar(driverId);
        showDriverProfile(driverId);
    });
}

function showDriverProfile(driverId) {
    const profile = window.DRIVER_PROFILES[driverId];
    const driver = window.DRIVERS.find(item => item.id === driverId);
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
                    <button type="button" class="profile-avatar-reset-btn" id="resetDriverAvatarBtn" title="鎭㈠鍒濆澶村儚" aria-label="鎭㈠鍒濆澶村儚"><span class="profile-avatar-reset-icon" aria-hidden="true"></span></button>
                </div>
                <div class="profile-license-identity">
                    <div class="profile-card-name">${safe(profile.fullName)}</div>
                    <div class="profile-card-team">${safe(profile.team)}</div>
                    <div class="profile-license-meta">
                        <span class="profile-license-chip">杞︽墜璧勬枡鍗?/span>
                        <span class="profile-license-chip profile-license-chip-accent">濂芥劅 ${favor}/100</span>
                    </div>
                    <div class="profile-favor-line">褰撳墠鍏崇郴锛?{safe(mood)}</div>
                </div>
            </div>
            <div class="profile-avatar-hint">鐐瑰嚮澶村儚鍗冲彲鏇存崲</div>
        </div>
        <div class="profile-card-section profile-card-section-identity">
            <div class="profile-card-section-title">鍩烘湰淇℃伅</div>
            <div class="profile-card-info-row"><span>鍥界睄</span><strong>${safe(profile.nationality)}</strong></div>
            <div class="profile-card-info-row"><span>鍑虹敓鏃ユ湡</span><strong>${safe(profile.birthDate)}</strong></div>
            <div class="profile-card-info-row"><span>韬珮 / 浣撻噸</span><strong>${safe(profile.height)} / ${safe(profile.weight)}</strong></div>
            <div class="profile-card-info-row"><span>F1 棣栫</span><strong>${safe(profile.f1Debut)}</strong></div>
        </div>
        <div class="profile-card-section profile-card-section-stats">
            <div class="profile-card-section-title">鐢熸动鏁版嵁</div>
            <div class="profile-card-info-row"><span>鍒嗙珯鍐犲啗</span><strong>${safe(profile.totalWins)}</strong></div>
            <div class="profile-card-info-row"><span>鏉嗕綅</span><strong>${safe(profile.totalPoles)}</strong></div>
            <div class="profile-card-info-row"><span>棰嗗鍙?/span><strong>${safe(profile.totalPodiums)}</strong></div>
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
        milestones.push({
            title: gifts[0].matched ? '最近那份礼物被认真记住了' : '最近收到过你的礼物',
            body: `${driver?.name || '他'} 最近收下了 ${gifts[0].giftName}${gifts[0].matched ? '，而且反应明显更柔和。' : '。'}`
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
    if (gifts[0]?.matched) tags.push('刚收过你认真挑的礼物');
    else if (gifts[0]) tags.push('最近收过你的心意');
    if (dateMemory?.summary) tags.push('保留着和你的约会记忆');
    if (recentPosts.length) tags.push('最近公开发声比较频繁');
    const topics = typeof getDriverFavorTopics === 'function' ? getDriverFavorTopics(driver) : [];
    if (topics[0]?.id && PROFILE_TOPIC_LABELS[topics[0].id]) tags.push(`最近更愿意聊${PROFILE_TOPIC_LABELS[topics[0].id].split('、')[0]}`);
    return [...new Set(tags)].slice(0, 4);
}

function buildDriverProfileViewModel(driverId) {
    const profile = window.DRIVER_PROFILES?.[driverId];
    const driver = (window.DRIVERS || []).find(item => item.id === driverId);
    if (!profile || !driver) return null;
    const favor = favorability?.[driverId] || 0;
    const avatarBg = getDriverAvatarStyle(driverId);
    const teamColor = window.TEAM_COLORS?.[driver.team] || '#2a2f3a';
    const driverNumber = DRIVER_NUMBERS[driverId] || '--';
    const recentPosts = getDriverRecentFeedPosts(driverId, 5);
    const gifts = getDriverGiftHistory(driverId, 6);
    const matchedGiftCount = gifts.filter(entry => entry.matched).length;
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
            matchedCount: matchedGiftCount
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
            <article class="driver-home-gift-card${entry.matched ? ' is-match' : ''}">
                <div class="driver-home-gift-top">
                    <span class="driver-home-gift-name">${safe(entry.giftName)}</span>
                    <span class="driver-home-gift-badge">${entry.matched ? '很对味' : '已收下'}</span>
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
                <span>${giftProfile.matchedCount ? `${giftProfile.matchedCount} 次明显被送到心坎上` : '还没有特别命中的礼物记录'}</span>
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

function showAnnouncements() {
    const content = (window.ANNOUNCEMENTS || []).map((item, index) => {
        const rawLines = String(item.content || '').split('\n').map(line => line.trim()).filter(Boolean);
        const title = rawLines.shift() || '鐗堟湰鏇存柊';
        const bullets = rawLines.map(line => line.replace(/^[鈥-]\s*/, '').trim()).filter(Boolean);
        return `
            <section class="announce-entry${index === 0 ? ' is-latest' : ''}">
                <div class="announce-entry-top">
                    <div>
                        <div class="announce-entry-version">${escapeHtml(item.version || '')}</div>
                        <h4 class="announce-entry-title">${escapeHtml(title)}</h4>
                    </div>
                    ${index === 0 ? '<span class="announce-entry-badge">LATEST</span>' : ''}
                </div>
                ${bullets.length ? `<div class="announce-entry-list">${bullets.map(text => `<div class="announce-entry-item"><span class="announce-entry-dot"></span><span>${escapeHtml(text)}</span></div>`).join('')}</div>` : `<div class="announce-entry-body">${escapeHtml(String(item.content || ''))}</div>`}
            </section>
        `;
    }).join('');
    document.getElementById('announceContent').innerHTML = content;
    document.getElementById('announceModal').style.display = 'flex';
}

function closeAnnounceModal() { document.getElementById('announceModal').style.display = 'none'; }
function getLatestAnnouncementVersion() { return window.ANNOUNCEMENTS?.[0]?.version || ''; }
function getSeenAnnouncementVersion() { return localStorage.getItem('f1_seen_announcement_version') || ''; }
function saveAnnouncementVersion() { localStorage.setItem('f1_seen_announcement_version', getLatestAnnouncementVersion()); }
function checkAndShowNewAnnouncements() { if (getLatestAnnouncementVersion() && getLatestAnnouncementVersion() !== getSeenAnnouncementVersion()) showAnnouncements(); }

renderCalendar = function renderCalendarOverride() {
    const container = document.getElementById('calendarContainer');
    if (!container) return;
    const weekendEvent = window.getCurrentRaceWeekendEvent ? window.getCurrentRaceWeekendEvent() : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const buildCalendarRacePreview = (race, stateKey) => {
        const sprintText = race.sprint ? ' 路 Sprint Weekend' : '';
        if (stateKey === 'current') {
            return {
                kicker: 'LIVE PREVIEW',
                title: `${race.gp} 姝ｅ湪杩涘叆鍥村満鐒︾偣`,
                meta: `Round ${race.round} 路 ${race.location || '璧涢亾寰呭懡'}${sprintText}`,
                note: '\u5f53\u524d\u8fd9\u4e00\u7ad9\u4f1a\u66f4\u7a81\u51fa\u8d5b\u9053\u72b6\u6001\u3001\u8f66\u961f\u8282\u594f\u548c\u56f4\u573a\u5b9e\u65f6\u6c14\u6c1b\u3002',
                cardState: 'current'
            };
        }
        if (stateKey === 'completed') {
            return {
                kicker: 'FINISHED ROUND',
                title: `${race.gp} \u5df2\u5b8c\u8d5b`,
                meta: `Round ${race.round} 路 ${race.location || '\u5df2\u5b8c\u8d5b'}${sprintText}`,
                note: '\u8fd9\u4e00\u7ad9\u5df2\u7ecf\u8dd1\u5b8c\uff0c\u663e\u793a\u4f1a\u66f4\u504f\u5411\u8d5b\u540e\u56de\u770b\u548c\u6536\u675f\u72b6\u6001\u3002',
                cardState: 'completed'
            };
        }
        return {
            kicker: 'NEXT TARGET',
            title: `${race.gp} \u5373\u5c06\u5230\u7ad9`,
            meta: `Round ${race.round} 路 ${race.location || '\u5f85\u547d\u4e2d'}${sprintText}`,
            note: '\u8fd9\u4e00\u7ad9\u8fd8\u6ca1\u5f00\u59cb\uff0c\u6c14\u6c1b\u4f1a\u66f4\u50cf\u8f66\u5e93\u9884\u70ed\u548c\u51fa\u53d1\u524d\u7684\u84c4\u529b\u9636\u6bb5\u3002',
            cardState: 'upcoming'
        };
    };
    const list = (window.F1_CALENDAR || []).map(race => {
        const dateRange = window.parseRaceDateRange ? window.parseRaceDateRange(race.date) : null;
        const raceStart = dateRange?.start || null;
        const raceEnd = dateRange?.end || null;
        const isCurrent = Boolean(raceStart && raceEnd && today >= raceStart && today <= raceEnd);
        const isCompleted = Boolean(raceEnd && today > raceEnd);
        const stateKey = isCurrent ? 'current' : (isCompleted ? 'completed' : 'upcoming');
        const stateClass = isCurrent ? ' is-current' : (isCompleted ? ' is-completed' : ' is-upcoming');
        const stateBadge = isCurrent
            ? '<span class="calendar-live-badge">LIVE</span>'
            : (isCompleted ? '<span class="calendar-state-pill">FINISHED</span>' : '<span class="calendar-state-pill is-upcoming">LOCKED IN</span>');
        return `
        <li class="calendar-item${stateClass}" data-round="${race.round}" data-calendar-state="${stateKey}" tabindex="0">
            <span class="calendar-item-glow" aria-hidden="true"></span>
            <span class="calendar-item-stripe" aria-hidden="true"></span>
            <div class="calendar-item-main">
                <span class="calendar-round">R${race.round}</span>
                <div class="calendar-item-copy">
                    <span class="calendar-date">${race.date}</span>
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
            <div class="calendar-event-meta">Round ${escapeHtml(String(weekendEvent.race.round || ''))} 路 ${escapeHtml(weekendEvent.race.location || '')}${weekendEvent.race.sprint ? ' 路 Sprint' : ''}</div>
            <div class="calendar-event-note">${escapeHtml(weekendEvent.phase?.note || '')}</div>
        </div>
    ` : '';
    container.innerHTML = `<div class="calendar-section"><div class="calendar-header"><div class="calendar-title">2026 F1 璧涘巻</div><button class="calendar-back-btn icon-text-btn" id="calendarBackBtn">${window.getUiIconMarkup ? window.getUiIconMarkup('chevronLeft', 'calendar-back-icon', '杩斿洖') : ''}<span>杩斿洖</span></button></div>${weekendCard}<ul class="calendar-list">${list}</ul></div>`;
    document.getElementById('calendarBackBtn')?.addEventListener('click', () => switchTab('chat'));
    const eventCard = document.getElementById('calendarEventCard');
    const kickerEl = eventCard?.querySelector('.calendar-event-kicker');
    const titleEl = eventCard?.querySelector('.calendar-event-title');
    const metaEl = eventCard?.querySelector('.calendar-event-meta');
    const noteEl = eventCard?.querySelector('.calendar-event-note');
    if (!eventCard || !kickerEl || !titleEl || !metaEl || !noteEl) return;
    const defaultSnapshot = {
        kicker: kickerEl.textContent || '',
        title: titleEl.textContent || '',
        meta: metaEl.textContent || '',
        note: noteEl.textContent || ''
    };
    const applyPreview = (payload) => {
        kickerEl.textContent = payload.kicker;
        titleEl.textContent = payload.title;
        metaEl.textContent = payload.meta;
        noteEl.textContent = payload.note;
        eventCard.classList.add('is-hover-preview');
        eventCard.dataset.previewState = payload.cardState;
    };
    const resetPreview = () => {
        kickerEl.textContent = defaultSnapshot.kicker;
        titleEl.textContent = defaultSnapshot.title;
        metaEl.textContent = defaultSnapshot.meta;
        noteEl.textContent = defaultSnapshot.note;
        eventCard.classList.remove('is-hover-preview');
        delete eventCard.dataset.previewState;
    };
    Array.from(container.querySelectorAll('.calendar-item')).forEach((item, index) => {
        const race = (window.F1_CALENDAR || [])[index];
        if (!race) return;
        const payload = buildCalendarRacePreview(race, item.dataset.calendarState || 'upcoming');
        item.addEventListener('mouseenter', () => applyPreview(payload));
        item.addEventListener('mouseleave', resetPreview);
        item.addEventListener('focus', () => applyPreview(payload));
        item.addEventListener('blur', resetPreview);
    });
};
