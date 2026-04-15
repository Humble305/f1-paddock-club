// 本地存储、签到、头像、关系记忆与 API 辅助

function loadSignData() {
    const savedCoins = localStorage.getItem('f1_user_coins');
    userCoins = savedCoins !== null && !Number.isNaN(Number(savedCoins)) ? Number(savedCoins) : 100;
    const savedSign = localStorage.getItem('f1_sign_data');
    if (savedSign) {
        try { signData = JSON.parse(savedSign); } catch (_) {}
    }
}

function saveSignData() {
    localStorage.setItem('f1_user_coins', String(userCoins));
    localStorage.setItem('f1_sign_data', JSON.stringify(signData));
}

function performSign() {
    const today = getTodayDateStr();
    if (signData.lastSignDate === today) {
        showToast('今天已经签到过了', true);
        return;
    }
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    signData.consecutiveDays = signData.lastSignDate === yesterday ? signData.consecutiveDays + 1 : 1;
    signData.lastSignDate = today;
    const bonus = Math.min(25, signData.consecutiveDays * 5);
    userCoins += 20 + bonus;
    saveSignData();
    renderSignPage();
    showToast(`签到成功，围场币 +${20 + bonus}`, false);
}

function renderSignPage() {
    const coin = document.getElementById('coinAmountDisplay');
    const consecutive = document.getElementById('consecutiveDaysSpan');
    const status = document.getElementById('signStatusMsg');
    const button = document.getElementById('doSignBtn');
    const today = getTodayDateStr();
    const signed = signData.lastSignDate === today;
    if (coin) coin.innerText = String(userCoins);
    if (consecutive) consecutive.innerText = `连续 ${signData.consecutiveDays} 天`;
    if (status) status.innerText = signed ? '今日已完成签到' : '今日未签到，点击下方按钮领取奖励';
    if (button) {
        button.disabled = signed;
        button.innerText = signed ? '今日已签到' : '立即签到';
    }
}

function getLocalDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
    return new Date(`${dateKey}T00:00:00`);
}

function formatDateKeyLabel(dateKey) {
    const date = parseDateKey(dateKey);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function ensureDriverDiaryStore(driverId) {
    if (!driverDiaries[driverId]) driverDiaries[driverId] = {};
    return driverDiaries[driverId];
}

function saveDriverDiaries() {
    localStorage.setItem('f1_driver_diaries', JSON.stringify(driverDiaries));
}

function loadDriverDiaries() {
    const saved = localStorage.getItem('f1_driver_diaries');
    if (!saved) return;
    try { driverDiaries = JSON.parse(saved) || {}; } catch (_) {}
}

function getDriverDiaryEntry(driverId, dateKey) {
    return driverDiaries[driverId]?.[dateKey] || null;
}

function getDriverDiaryTimeline(driverId, limit = 3) {
    const store = driverDiaries[driverId] || {};
    return Object.keys(store).sort().reverse().slice(0, limit).map(key => ({ dateKey: key, ...store[key] }));
}

function loadDateMemories() {
    const saved = localStorage.getItem('f1_date_memories');
    if (!saved) return;
    try { driverDateMemories = JSON.parse(saved) || {}; } catch (_) {}
}

function getMessagesForDate(driverId, dateKey) {
    return (chatHistories[driverId] || []).filter(msg => msg.dateKey === dateKey && msg.role !== 'system');
}

function getDiaryMemoryContext(driverId, limit = 3) {
    const timeline = getDriverDiaryTimeline(driverId, limit);
    if (!timeline.length) return '';
    return `【关系日记摘要】\n${timeline.map(item => `${item.dateKey}：${item.content || ''}`).join('\n')}`;
}

function getDateMemoryContext(driverId) {
    const memory = driverDateMemories[driverId];
    if (!memory?.summary) return '';
    return `【约会记忆】\n${memory.summary}`;
}

function buildDriverSharedMemoryContext(driverId) {
    return [getDateMemoryContext(driverId), getDiaryMemoryContext(driverId)].filter(Boolean).join('\n');
}

function getUserProfilePriorityPrompt() {
    return `【用户资料，高优先级】\n${getUserProfileSummary()}\n你必须把以上资料当作稳定事实来记住。每次回复前，先核对用户的姓名、性别、身份、性格、爱好和背景，再决定称呼、语气、态度与亲密距离。如果你的临时联想和用户资料冲突，一律以用户资料为准。`;
}

function escapeHtmlAttr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function setApiStatus(message, type = 'idle') {
    const status = document.getElementById('apiModelStatus');
    const badge = document.getElementById('apiStatusBadge');
    if (status) {
        status.innerText = message;
        status.dataset.type = type;
    }
    if (badge) {
        const mapping = { idle: '未连接', loading: '拉取中', success: '已连接', warning: '手动模式', error: '异常' };
        badge.innerText = mapping[type] || mapping.idle;
        badge.dataset.type = type;
    }
}

function updateCustomModelVisibility() {
    const select = document.getElementById('modelName');
    const input = document.getElementById('customModelName');
    if (!select || !input) return;
    input.style.display = select.value === '__custom__' ? 'block' : 'none';
}

function setModelOptions(models = [], selectedModel = '') {
    const select = document.getElementById('modelName');
    const input = document.getElementById('customModelName');
    if (!select || !input) return;
    const normalized = [...new Set(models.map(item => String(item || '').trim()).filter(Boolean))];
    availableApiModels = normalized;
    const options = normalized.map(model => `<option value="${escapeHtmlAttr(model)}">${escapeHtml(model)}</option>`).join('');
    select.innerHTML = `${options}<option value="__custom__">手动填写模型名</option>`;
    if (selectedModel && normalized.includes(selectedModel)) {
        select.value = selectedModel;
    } else if (selectedModel) {
        select.value = '__custom__';
        input.value = selectedModel;
    } else if (normalized.length) {
        select.value = normalized[0];
    } else {
        select.value = '__custom__';
    }
    updateCustomModelVisibility();
}

function getSelectedModelName() {
    const select = document.getElementById('modelName');
    const custom = document.getElementById('customModelName');
    if (!select) return '';
    return select.value === '__custom__' ? (custom?.value || '').trim() : select.value;
}

async function fetchAvailableModels() {
    const baseUrl = (document.getElementById('apiUrl')?.value || '').trim();
    const key = (document.getElementById('apiKey')?.value || '').trim();
    if (!baseUrl || !key) {
        setApiStatus('请先填写接口地址和密钥', 'warning');
        return;
    }
    try {
        setApiStatus('正在拉取模型列表...', 'loading');
        const response = await fetch(`${baseUrl.replace(/\/$/, '')}/models`, {
            headers: { Authorization: `Bearer ${key}` }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const models = Array.isArray(payload?.data)
            ? payload.data.map(item => item.id)
            : Array.isArray(payload?.models)
                ? payload.models.map(item => item.id || item)
                : [];
        if (!models.length) throw new Error('未解析到模型列表');
        setModelOptions(models, getSelectedModelName());
        setApiStatus(`已拉取 ${models.length} 个模型`, 'success');
        showToast('模型列表已更新', false);
    } catch (error) {
        setApiStatus('拉取失败，可手动填写模型名', 'warning');
        setModelOptions([], getSelectedModelName());
        handleApiError(error, '模型列表拉取');
    }
}

function loadFavorability() {
    const saved = localStorage.getItem('f1_favorability');
    if (saved) {
        try { favorability = JSON.parse(saved) || {}; } catch (_) {}
    }
    window.DRIVERS.forEach(driver => {
        if (favorability[driver.id] === undefined) favorability[driver.id] = 0;
    });
    saveFavorability();
}

function saveFavorability() {
    localStorage.setItem('f1_favorability', JSON.stringify(favorability));
}

function saveChatHistories() {
    localStorage.setItem('f1_chat_histories', JSON.stringify(chatHistories));
}

function loadChatHistories() {
    const saved = localStorage.getItem('f1_chat_histories');
    if (!saved) return;
    try { chatHistories = JSON.parse(saved) || {}; } catch (_) {}
}

function addFavorability(driverId, inc) {
    const oldValue = favorability[driverId] || 0;
    const nextValue = Math.min(100, oldValue + inc);
    if (nextValue <= oldValue) return false;
    favorability[driverId] = nextValue;
    saveFavorability();
    const driver = window.DRIVERS.find(item => item.id === driverId);
    showToast(`好感度 +${inc}${driver ? ` (${driver.name})` : ''}`, false);
    return true;
}

function getFavorMood(favor) {
    if (favor >= 90) return '亲密挚友';
    if (favor >= 70) return '好朋友';
    if (favor >= 40) return '熟悉朋友';
    if (favor >= 10) return '普通同事';
    return '冷淡陌生人';
}

function loadPinnedDrivers() {
    const saved = localStorage.getItem('f1_pinned_drivers');
    if (!saved) return;
    try { pinnedDrivers = JSON.parse(saved) || []; } catch (_) {}
}

function savePinnedDrivers() {
    localStorage.setItem('f1_pinned_drivers', JSON.stringify(pinnedDrivers));
}

function togglePinDriver(driverId) {
    const index = pinnedDrivers.indexOf(driverId);
    if (index === -1) pinnedDrivers.push(driverId);
    else pinnedDrivers.splice(index, 1);
    savePinnedDrivers();
    renderDriverList();
}

function isPinned(driverId) {
    return pinnedDrivers.includes(driverId);
}

function loadAvatars() {
    const saved = localStorage.getItem('f1_driver_avatars');
    if (!saved) return;
    try { driverAvatars = JSON.parse(saved) || {}; } catch (_) {}
}

function saveAvatarToLocal(driverId, dataUrl) {
    driverAvatars[driverId] = dataUrl;
    localStorage.setItem('f1_driver_avatars', JSON.stringify(driverAvatars));
}

function getDriverAvatarStyle(driverId) {
    const dataUrl = driverAvatars[driverId];
    return dataUrl ? `url(${dataUrl})` : '';
}

function getUserAvatarStyle() {
    const profileAvatar = userProfile?.avatar || userProfile?.avatarUrl || userProfile?.avatarDataUrl || '';
    const storedAvatar = localStorage.getItem('f1_user_avatar') || '';
    const dataUrl = profileAvatar || storedAvatar;
    return dataUrl ? `url(${dataUrl})` : '';
}

function renderAvatarOnElement(element, driverId, size = '') {
    if (!element) return;
    const driver = window.DRIVERS.find(item => item.id === driverId);
    const avatarBg = getDriverAvatarStyle(driverId);
    if (size) {
        element.style.width = size;
        element.style.height = size;
    }
    if (avatarBg) {
        element.style.backgroundImage = avatarBg;
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center';
        element.innerText = '';
    } else {
        element.style.backgroundImage = '';
        element.style.backgroundColor = window.TEAM_COLORS[driver?.team] || '#2a2f3a';
        element.innerText = driver ? driver.avatarLetter : '🏎️';
    }
}

function openAvatarUpload(driverId) {
    const input = document.getElementById('avatarUploadInput');
    if (!input) return;
    input.onchange = event => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            saveAvatarToLocal(driverId, reader.result);
            renderDriverList();
            if (currentChatDriver?.id === driverId) renderChatHeaderAvatar(driverId);
            showToast('头像已更新', false);
        };
        reader.readAsDataURL(file);
        input.value = '';
    };
    input.click();
}

function getUserAvatarFallbackText() {
    const name = String(userProfile?.name || '我').trim();
    return name ? name.slice(0, 1) : '我';
}
