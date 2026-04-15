// app-pages-settings.js
// 页面渲染、模态框、资料/API/存档与公告

function renderCalendar() {
    const container = document.getElementById('calendarContainer');
    if (!container) return;
    const list = (window.F1_CALENDAR || []).map(race => `
        <li class="calendar-item">
            <span class="calendar-round">${race.round}</span>
            <span class="calendar-date">${race.date}</span>
            <span class="calendar-name">${race.gp}${race.sprint ? '<span class="calendar-sprint"> (Sprint)</span>' : ''}</span>
        </li>
    `).join('');
    container.innerHTML = `<div class="calendar-section"><div class="calendar-header"><div class="calendar-title">?? 2026 F1 赛历</div><button class="calendar-back-btn" id="calendarBackBtn">← 返回</button></div><ul class="calendar-list">${list}</ul></div>`;
    document.getElementById('calendarBackBtn')?.addEventListener('click', () => switchTab('chat'));
}

function exportGameData() {
    const payload = {
        favorability,
        driverDateMemories,
        driverDiaries,
        pinnedDrivers,
        chatHistories,
        driverAvatars,
        userProfile,
        feedPosts,
        apiConfig,
        userCoins,
        signData,
        currentTheme: currentTheme?.id || 'ferrari'
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `f1-paddock-save-${getTodayDateStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('存档已导出', false);
}

function applyLoadedData(saveData) {
    favorability = saveData.favorability || favorability;
    driverDateMemories = saveData.driverDateMemories || driverDateMemories;
    driverDiaries = saveData.driverDiaries || driverDiaries;
    pinnedDrivers = saveData.pinnedDrivers || pinnedDrivers;
    chatHistories = saveData.chatHistories || chatHistories;
    driverAvatars = saveData.driverAvatars || driverAvatars;
    userProfile = { ...userProfile, ...(saveData.userProfile || {}) };
    feedPosts = saveData.feedPosts || feedPosts;
    apiConfig = { ...apiConfig, ...(saveData.apiConfig || {}) };
    userCoins = saveData.userCoins ?? userCoins;
    signData = saveData.signData || signData;
    localStorage.setItem('f1_favorability', JSON.stringify(favorability));
    localStorage.setItem('f1_date_memories', JSON.stringify(driverDateMemories));
    localStorage.setItem('f1_driver_diaries', JSON.stringify(driverDiaries));
    localStorage.setItem('f1_pinned_drivers', JSON.stringify(pinnedDrivers));
    localStorage.setItem('f1_chat_histories', JSON.stringify(chatHistories));
    localStorage.setItem('f1_driver_avatars', JSON.stringify(driverAvatars));
    localStorage.setItem('f1_user_profile', JSON.stringify(userProfile));
    localStorage.setItem('f1_api_config', JSON.stringify(apiConfig));
    localStorage.setItem('f1_user_coins', String(userCoins));
    localStorage.setItem('f1_sign_data', JSON.stringify(signData));
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
}

function importGameDataFromFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
        try {
            applyLoadedData(JSON.parse(reader.result));
            showToast('存档导入成功', false);
        } catch (error) {
            handleApiError(error, '存档导入');
        }
    };
    reader.readAsText(file);
}

function openSaveModal() { document.getElementById('saveModal').style.display = 'flex'; }
function closeSaveModal() { document.getElementById('saveModal').style.display = 'none'; clearSidebarActive(); }

function loadUserProfile() {
    const saved = localStorage.getItem('f1_user_profile');
    if (saved) {
        try { userProfile = { ...userProfile, ...JSON.parse(saved) }; } catch (_) {}
    }
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
    localStorage.setItem('f1_user_profile', JSON.stringify(userProfile));
    closeProfileModal();
    showToast('资料卡已更新', false);
}

function toggleCustomRoleInput() {
    const input = document.getElementById('profileCustomRole');
    input.style.display = document.getElementById('profileRoleSelect').value === '自定义' ? 'block' : 'none';
}

function openProfileModal() { document.getElementById('profileModal').style.display = 'flex'; }
function closeProfileModal() { document.getElementById('profileModal').style.display = 'none'; clearSidebarActive(); }

function loadApiConfig() {
    const saved = localStorage.getItem('f1_api_config');
    if (saved) {
        try { apiConfig = { ...apiConfig, ...JSON.parse(saved) }; } catch (_) {}
    }
    document.getElementById('apiUrl').value = apiConfig.url || '';
    document.getElementById('apiKey').value = apiConfig.key || '';
    setModelOptions(availableApiModels.length ? availableApiModels : [apiConfig.model || 'deepseek-chat'], apiConfig.model || 'deepseek-chat');
    updateCustomModelVisibility();
    useAI = Boolean(apiConfig.key && apiConfig.url && apiConfig.model);
    setApiStatus(useAI ? '当前已启用真实 API' : '当前使用模拟模式', useAI ? 'success' : 'idle');
}

function saveApiConfig() {
    apiConfig = {
        url: document.getElementById('apiUrl').value.trim(),
        key: document.getElementById('apiKey').value.trim(),
        model: getSelectedModelName() || 'deepseek-chat'
    };
    localStorage.setItem('f1_api_config', JSON.stringify(apiConfig));
    useAI = Boolean(apiConfig.key && apiConfig.url && apiConfig.model);
    setApiStatus(useAI ? '已保存并启用真实 API' : '缺少完整配置，仍使用模拟模式', useAI ? 'success' : 'warning');
    showToast('AI 设置已保存', false);
    closeModal();
}

function openApiModal() {
    document.getElementById('apiModal').style.display = 'flex';
    loadApiConfig();
}

function closeModal() { document.getElementById('apiModal').style.display = 'none'; clearSidebarActive(); }

function showDriverProfile(driverId) {
    const profile = window.DRIVER_PROFILES[driverId];
    const driver = window.DRIVERS.find(item => item.id === driverId);
    if (!profile || !driver) return;
    const avatarBg = getDriverAvatarStyle(driverId);
    const favor = favorability[driverId] || 0;
    const mood = getFavorMood(favor);
    document.getElementById('driverProfileContent').innerHTML = `
        <div class="profile-card-header">
            <div class="profile-card-avatar" style="${avatarBg ? `background-image:${avatarBg};background-size:cover;` : `background-color:${window.TEAM_COLORS[driver.team] || '#2a2f3a'};`}">${avatarBg ? '' : driver.avatarLetter}</div>
            <div class="profile-card-title-row"><div class="profile-card-name">${profile.fullName}</div><button class="profile-diary-btn" id="openDiaryBtn">?? 日记</button></div>
            <div class="profile-card-team">${profile.team}</div>
            <div style="margin-top:8px; color:#ffb347; font-size:0.8rem;">?? 好感度: ${favor}/100 (${mood})</div>
        </div>
        <div class="profile-card-section"><div class="profile-card-section-title">基本信息</div><div class="profile-card-info-row"><span>国籍</span><span>${profile.nationality}</span></div><div class="profile-card-info-row"><span>出生日期</span><span>${profile.birthDate}</span></div><div class="profile-card-info-row"><span>身高/体重</span><span>${profile.height} / ${profile.weight}</span></div><div class="profile-card-info-row"><span>F1 首秀</span><span>${profile.f1Debut}</span></div></div>
        <div class="profile-card-section"><div class="profile-card-section-title">生涯数据</div><div class="profile-card-info-row"><span>分站冠军</span><span>${profile.totalWins}</span></div><div class="profile-card-info-row"><span>杆位</span><span>${profile.totalPoles}</span></div><div class="profile-card-info-row"><span>领奖台</span><span>${profile.totalPodiums}</span></div></div>
    `;
    document.getElementById('driverProfileModal').style.display = 'flex';
    document.getElementById('openDiaryBtn')?.addEventListener('click', () => openDiaryModal(driverId));
}

function closeDriverProfile() { document.getElementById('driverProfileModal').style.display = 'none'; }

function showAnnouncements() {
    const content = (window.ANNOUNCEMENTS || []).map(item => `<div style="margin-bottom:16px; border-bottom:1px solid #2a313b; padding-bottom:12px;"><div style="color:#e10600; font-weight:bold;">${item.version}</div><div style="white-space:pre-line; margin-top:6px;">${escapeHtml(item.content)}</div></div>`).join('');
    document.getElementById('announceContent').innerHTML = content;
    document.getElementById('announceModal').style.display = 'flex';
}

function closeAnnounceModal() { document.getElementById('announceModal').style.display = 'none'; }
function getLatestAnnouncementVersion() { return window.ANNOUNCEMENTS?.[0]?.version || ''; }
function getSeenAnnouncementVersion() { return localStorage.getItem('f1_seen_announcement_version') || ''; }
function saveAnnouncementVersion() { localStorage.setItem('f1_seen_announcement_version', getLatestAnnouncementVersion()); }
function checkAndShowNewAnnouncements() { if (getLatestAnnouncementVersion() && getLatestAnnouncementVersion() !== getSeenAnnouncementVersion()) showAnnouncements(); }
