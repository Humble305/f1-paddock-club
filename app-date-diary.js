// app-date-diary.js
// 约会系统与关系日记

function fallbackDateReply(driver, scene, favor, normalHistory = [], dateHistory = []) {
    const actions = {
        beach: ['（他偏过脸看你，海风把发梢吹得有些乱。）', '（他放慢脚步，和你并肩沿着海边往前走。）'],
        restaurant: ['（他把手边的杯子轻轻转了半圈，目光落回你身上。）', '（他靠在椅背上，语气放得比刚才更缓。）'],
        paddock: ['（他侧身示意你跟上，步子却刻意放慢了一点。）', '（他抬手指了指不远处的赛车，眼神里带着一点认真。）']
    };
    const action = (actions[scene.id] || actions.beach)[Math.floor(Math.random() * 2)];
    const lastUser = [...dateHistory].reverse().find(item => item.role === 'user') || [...normalHistory].reverse().find(item => item.role === 'user');
    const moodText = favor >= 70 ? '和你待在一起的时候，我会比平时放松。' : favor >= 40 ? '至少现在这一刻，我挺愿意继续把时间留给你。' : '我在认真听你说。';
    const continuity = lastUser ? `你刚才提到的“${String(lastUser.content).slice(0, 20)}”，我有在想。` : '继续说吧，我在听。';
    return `${action}\n${moodText}${continuity}`;
}

async function generateDateReply(driver, scene, userAction, userMessage, round, dateHistory = [], normalHistory = []) {
    const favor = favorability[driver.id] || 0;
    const mood = getFavorMood(favor);
    const memoryContext = buildDriverSharedMemoryContext(driver.id);
    const personalityContext = window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : '';
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
        return fallbackDateReply(driver, scene, favor, normalHistory, dateHistory);
    }
    showLoading(true);
    try {
        const chatHistoryText = normalHistory.map(msg => `${msg.role === 'user' ? '用户' : driver.name}: ${msg.content}`).join('\n');
        const dateHistoryText = dateHistory.map(msg => `${msg.role === 'user' ? '用户' : driver.name}: ${msg.content}`).join('\n');
        const systemPrompt = `今天是${getCurrentDateInfo()}。${window.getCurrentRaceContext ? window.getCurrentRaceContext() : ''}\n你是 F1 车手 ${driver.name}（${driver.team}），正在和用户进行一场真实、私密、连续的约会。\n【当前约会场景】${scene.name} - ${scene.desc}\n【当前关系】${mood}（好感度 ${favor}/100）\n${getDateWritingGuide()}\n${getUserProfilePriorityPrompt()}\n【共享记忆】${memoryContext}\n【普通聊天记录】\n${chatHistoryText}\n【本次约会对话】\n${dateHistoryText}\n${personalityContext}\n【用户刚刚的动作/话语】${userAction}：${userMessage || '（无具体话语）'}\n请以 ${driver.name} 的身份回复。回复长度 100-220 字，动作描写必须放在开头单独一行，随后换行继续台词。`;
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiConfig.key}` },
            body: JSON.stringify({ model: apiConfig.model, messages: [{ role: 'user', content: systemPrompt }], temperature: 0.82, max_tokens: 320 })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const content = payload?.choices?.[0]?.message?.content?.trim();
        if (!content) throw new Error('API 返回空内容');
        return content;
    } catch (error) {
        handleApiError(error, '约会回复');
        return fallbackDateReply(driver, scene, favor, normalHistory, dateHistory);
    } finally {
        showLoading(false);
    }
}

async function startDate(driverId, sceneId) {
    const driver = window.DRIVERS.find(item => item.id === driverId);
    const scene = window.DATE_SCENES.find(item => item.id === sceneId);
    if (!driver || !scene) return;
    currentDateDriver = driver;
    currentDateScene = scene;
    currentRound = 0;
    dateMessages = [];
    dateInProgress = true;
    const opening = await generateDateReply(driver, scene, '开始约会', '', currentRound, [], getRecentChatHistory(driver.id, 8));
    dateMessages.push({ role: 'bot', content: opening });
    renderDatePage();
}

async function submitDateAction(action, customText) {
    if (!dateInProgress || !currentDateDriver || !currentDateScene) return;
    if (currentRound >= maxRounds) return endDate();
    const userMessage = customText || action;
    dateMessages.push({ role: 'user', content: userMessage });
    currentRound += 1;
    const reply = await generateDateReply(currentDateDriver, currentDateScene, action, userMessage, currentRound, dateMessages, getRecentChatHistory(currentDateDriver.id, 8));
    dateMessages.push({ role: 'bot', content: reply });
    renderDatePage();
    if (currentRound >= maxRounds) endDate();
}

function updateDriverDateMemory(driverId, sceneName, messages) {
    const userMessages = messages.filter(msg => msg.role === 'user').slice(-3);
    const keyTopics = userMessages.length ? userMessages.map(msg => String(msg.content).slice(0, 40)).join('、') : '愉快的聊天';
    driverDateMemories[driverId] = {
        scene: sceneName,
        date: new Date().toISOString(),
        dateKey: getLocalDateKey(),
        summary: `你们曾在${sceneName}约会，聊到了${keyTopics}。`,
        keyTopics
    };
    localStorage.setItem('f1_date_memories', JSON.stringify(driverDateMemories));
}

function endDate() {
    if (!currentDateDriver || !currentDateScene) return;
    const finishedDriver = currentDateDriver;
    const favorChange = Math.floor(Math.random() * 10) - 2;
    if (favorChange > 0) addFavorability(finishedDriver.id, favorChange);
    updateDriverDateMemory(finishedDriver.id, currentDateScene.name, dateMessages);
    currentDateDriver = null;
    currentDateScene = null;
    dateInProgress = false;
    renderDatePage();
    renderDriverList();
    if (currentChatDriver?.id === finishedDriver.id) renderChatMessages(finishedDriver.id);
    showToast(favorChange > 0 ? `约会结束，好感度 +${favorChange}` : '约会结束', false);
}

function formatDateBubbleContent(text = '', role = 'bot') {
    const safeText = String(text || '');
    if (role !== 'bot') return escapeHtml(safeText);
    const actionPattern = /([（(][^（）()\n]{1,120}[）)])/gu;
    const blocks = [];
    let lastIndex = 0;
    let match;
    const pushDialogue = value => {
        const cleaned = String(value || '').trim();
        if (cleaned) blocks.push(`<div class="date-dialogue-line">${escapeHtml(cleaned)}</div>`);
    };
    while ((match = actionPattern.exec(safeText)) !== null) {
        pushDialogue(safeText.slice(lastIndex, match.index));
        blocks.push(`<div class="date-action-line">${escapeHtml(match[0])}</div>`);
        lastIndex = match.index + match[0].length;
    }
    pushDialogue(safeText.slice(lastIndex));
    return blocks.length ? blocks.join('') : escapeHtml(safeText);
}

function renderDatePage() {
    const container = document.getElementById('dateContainer');
    if (!container) return;
    if (!dateInProgress) {
        const driverCards = window.DRIVERS.map(driver => `
            <button class="date-driver-card" data-driver-id="${driver.id}">
                <div class="driver-avatar-mini">${driver.avatarLetter}</div>
                <div class="driver-info-mini">
                    <div class="driver-name-mini">${driver.name}</div>
                    <div class="driver-team-mini">${driver.team}</div>
                    <div class="driver-favor-mini">?? ${favorability[driver.id] || 0}</div>
                </div>
            </button>
        `).join('');
        const sceneCards = window.DATE_SCENES.map(scene => `
            <button class="date-scene-card" data-scene-id="${scene.id}">
                <div class="scene-icon">${scene.name.split(' ')[0]}</div>
                <div class="scene-name">${scene.name}</div>
                <div class="scene-desc">${scene.desc}</div>
            </button>
        `).join('');
        container.innerHTML = `
            <div class="date-selector">
                <div class="date-driver-section"><h4>选择车手</h4><div class="date-driver-cards">${driverCards}</div></div>
                <div class="date-scene-section"><h4>选择场景</h4><div class="date-scene-cards">${sceneCards}</div></div>
                <button id="startDateBtn" class="date-start-btn">开始约会</button>
            </div>
        `;
        let selectedDriverId = window.DRIVERS[0]?.id || '';
        let selectedSceneId = window.DATE_SCENES[0]?.id || '';
        const updateActive = () => {
            document.querySelectorAll('.date-driver-card').forEach(card => card.classList.toggle('active', card.dataset.driverId === selectedDriverId));
            document.querySelectorAll('.date-scene-card').forEach(card => card.classList.toggle('active', card.dataset.sceneId === selectedSceneId));
        };
        document.querySelectorAll('.date-driver-card').forEach(card => card.addEventListener('click', () => { selectedDriverId = card.dataset.driverId; updateActive(); }));
        document.querySelectorAll('.date-scene-card').forEach(card => card.addEventListener('click', () => { selectedSceneId = card.dataset.sceneId; updateActive(); }));
        updateActive();
        document.getElementById('startDateBtn')?.addEventListener('click', () => startDate(selectedDriverId, selectedSceneId));
        return;
    }
    const messagesHtml = dateMessages.map(msg => `<div class="date-message ${msg.role}"><div class="date-bubble">${formatDateBubbleContent(msg.content, msg.role)}</div></div>`).join('');
    container.innerHTML = `
        <div class="round-counter">第 ${currentRound + 1} / ${maxRounds} 轮 · 与 ${currentDateDriver.name} 的约会</div>
        <div class="date-chat-area" id="dateChatArea">${messagesHtml}</div>
        <div class="date-input-area">
            <input type="text" id="dateUserInput" class="date-input" placeholder="输入你想说的话..." autocomplete="off">
            <button id="dateSendBtn" class="send-msg-btn">发送</button>
        </div>
    `;
    const send = () => {
        const input = document.getElementById('dateUserInput');
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        submitDateAction('自定义', text);
    };
    document.getElementById('dateSendBtn')?.addEventListener('click', send);
    document.getElementById('dateUserInput')?.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            send();
        }
    });
    const chatArea = document.getElementById('dateChatArea');
    if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
}

function getRecentChatHistory(driverId, maxCount = 6) {
    return (chatHistories[driverId] || []).filter(msg => msg.role !== 'system').slice(-maxCount);
}

function openDiaryModal(driverId) {
    currentDiaryDriverId = driverId;
    currentDiaryDateKey = getLocalDateKey();
    renderDiaryModal();
    document.getElementById('diaryModal').style.display = 'flex';
}

function closeDiaryModal() {
    document.getElementById('diaryModal').style.display = 'none';
}

function shiftDiaryDate(offset) {
    currentDiaryDateKey = getLocalDateKey(new Date(parseDateKey(currentDiaryDateKey).getTime() + offset * 86400000));
    renderDiaryModal();
}

function buildDiaryGenerationSource(driverId, dateKey) {
    const messages = getMessagesForDate(driverId, dateKey);
    const dateMemory = driverDateMemories[driverId];
    return {
        messages,
        chatText: messages.map(msg => `${msg.role === 'user' ? userProfile.name : (window.DRIVERS.find(item => item.id === driverId)?.name || '车手')}: ${msg.content}`).join('\n'),
        dateMemoryText: dateMemory?.dateKey === dateKey ? dateMemory.summary : ''
    };
}

async function generateDriverDiary() {
    if (!currentDiaryDriverId || !currentDiaryDateKey) return;
    const source = buildDiaryGenerationSource(currentDiaryDriverId, currentDiaryDateKey);
    const textarea = document.getElementById('diaryEditor');
    if (!textarea) return;
    if (!source.messages.length) {
        showToast('这一天还没有聊天记录可用于生成日记', true);
        return;
    }
    const driver = window.DRIVERS.find(item => item.id === currentDiaryDriverId);
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
        textarea.value = `今天和${driver?.name || '这位车手'}聊了不少。\n\n${source.chatText.slice(0, 300)}`;
        return;
    }
    showLoading(true);
    try {
        const prompt = `请根据下面这一天的聊天内容，写一篇关系日记。要求：第三人称概括、自然细腻、突出关系进展、100-220 字。\n【聊天记录】\n${source.chatText}\n【约会记忆】\n${source.dateMemoryText || '无'}`;
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiConfig.key}` },
            body: JSON.stringify({ model: apiConfig.model, messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 260 })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        textarea.value = payload?.choices?.[0]?.message?.content?.trim() || '';
    } catch (error) {
        handleApiError(error, '关系日记生成');
    } finally {
        showLoading(false);
    }
}

function saveDiaryEntry() {
    if (!currentDiaryDriverId || !currentDiaryDateKey) return;
    const textarea = document.getElementById('diaryEditor');
    const content = textarea?.value?.trim() || '';
    const driverStore = ensureDriverDiaryStore(currentDiaryDriverId);
    if (!content) delete driverStore[currentDiaryDateKey];
    else {
        driverStore[currentDiaryDateKey] = {
            content,
            updatedAt: new Date().toISOString(),
            linkedDateSummary: driverDateMemories[currentDiaryDriverId]?.dateKey === currentDiaryDateKey ? driverDateMemories[currentDiaryDriverId].summary : ''
        };
    }
    saveDriverDiaries();
    renderDiaryModal();
    showToast(content ? '日记已保存' : '这一天的日记已清空', false);
}

function renderDiaryModal() {
    if (!currentDiaryDriverId || !currentDiaryDateKey) return;
    const driver = window.DRIVERS.find(item => item.id === currentDiaryDriverId);
    const entry = getDriverDiaryEntry(currentDiaryDriverId, currentDiaryDateKey);
    const source = buildDiaryGenerationSource(currentDiaryDriverId, currentDiaryDateKey);
    document.getElementById('diaryDriverName').innerText = `${driver?.name || '车手'} 的日记`;
    document.getElementById('diaryDateLabel').innerText = formatDateKeyLabel(currentDiaryDateKey);
    document.getElementById('diaryStatusText').innerText = entry ? `已保存 · ${new Date(entry.updatedAt).toLocaleString('zh-CN', { hour12: false })}` : '这一天还没有日记';
    document.getElementById('diarySourceMeta').innerText = `当日聊天记录 ${source.messages.length} 条`;
    document.getElementById('diaryMemoryHint').innerText = source.dateMemoryText || '这一天没有同步到约会记忆摘要。';
    document.getElementById('diaryEditor').value = entry?.content || '';
}
