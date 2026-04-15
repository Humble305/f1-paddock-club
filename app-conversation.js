// app-conversation.js
// 私聊系统与车手列表

function renderChatHeaderAvatar(driverId) {
    const avatarDiv = document.getElementById('chatDetailAvatar');
    if (avatarDiv) renderAvatarOnElement(avatarDiv, driverId, '44px');
}

function trimChatHistory(driverId) {
    const history = chatHistories[driverId];
    if (!history) return;
    const systemMessages = history.filter(msg => msg.role === 'system').slice(0, 1);
    const normalMessages = history.filter(msg => msg.role !== 'system').slice(-60);
    chatHistories[driverId] = [...systemMessages, ...normalMessages];
    saveChatHistories();
}

function getChatWritingGuide() {
    return `【私聊写作要求】\n- 你是在手机里和用户一对一聊天，不是在接受采访，也不是在写官宣文案。\n- 文风要自然、细腻、克制，像真人刚刚想到什么就回了什么。\n- 回复通常控制在 2 到 5 句。\n- 用户资料属于高优先级记忆。\n- 小窗私聊是纯对话界面，绝对禁止输出任何括号动作描写、旁白、舞台说明或心理活动补注。`;
}

function getDateWritingGuide() {
    return `【约会写作要求】\n- 回复必须承接当前场景、上一轮对话、关系状态和用户资料。\n- 动作描写放在最前面单独一行，再换行继续台词。\n- 不要突然切场景、切情绪、切话题。`;
}

function initDriverHistory(driver) {
    if (chatHistories[driver.id]) return;
    const userInfo = getUserProfileSummary();
    const mood = getFavorMood(favorability[driver.id] || 0);
    const personalityContext = window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : '';
    const prompt = `你是 F1 车手 ${driver.name}（${driver.team}）。你正在和用户进行长期一对一私聊。当前关系：${mood}。\n${getChatWritingGuide()}\n${personalityContext}\n${userInfo}`;
    chatHistories[driver.id] = [
        { role: 'system', content: prompt },
        { role: 'assistant', content: driver.initialMsg, timestamp: getCurrentTime(), dateKey: getLocalDateKey() }
    ];
    saveChatHistories();
}

function updateTokenDisplay(history) {
    const totalChars = history.reduce((sum, msg) => msg.role === 'system' ? sum : sum + String(msg.content || '').length, 0);
    const tokenSpan = document.getElementById('tokenDisplay');
    if (tokenSpan) tokenSpan.innerText = `Token: ${Math.ceil(totalChars / 4)}`;
}

function stripChatStageDirections(text = '') {
    let result = String(text || '').trim();
    const patterns = [/^[（(][^（）()\n]{1,80}[）)]\s*/u, /^\[[^\[\]\n]{1,80}\]\s*/u];
    let changed = true;
    while (changed) {
        changed = false;
        patterns.forEach(pattern => {
            if (pattern.test(result)) {
                result = result.replace(pattern, '').trimStart();
                changed = true;
            }
        });
    }
    return result;
}

function renderChatMessages(driverId) {
    const area = document.getElementById('chatMessagesArea');
    if (!area) return;
    const history = chatHistories[driverId] || [];
    area.innerHTML = '';
    history.forEach((msg, idx) => {
        if (msg.role === 'system') return;
        const wrapper = document.createElement('div');
        wrapper.className = `msg ${msg.role === 'user' ? 'user' : 'bot'}`;
        wrapper.oncontextmenu = event => {
            event.preventDefault();
            if (confirm('确定要删除这条消息吗？')) deleteMessage(driverId, idx);
            return false;
        };
        const header = document.createElement('div');
        header.className = 'msg-header';
        const timeSpan = document.createElement('span');
        timeSpan.innerText = msg.timestamp || '';
        header.appendChild(timeSpan);
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.innerText = msg.role === 'assistant' ? stripChatStageDirections(msg.content) : msg.content;
        wrapper.appendChild(header);
        wrapper.appendChild(bubble);
        area.appendChild(wrapper);
    });
    area.scrollTop = area.scrollHeight;
    updateTokenDisplay(history);
}

function localFavorJudgment(message) {
    const lower = String(message || '').toLowerCase();
    const positives = ['加油', '支持', '棒', '厉害', '相信', '喜欢', '爱', '谢谢', '感谢', '冠军', '胜利'];
    let score = positives.reduce((sum, item) => sum + (lower.includes(item) ? 1 : 0), 0);
    if (lower.includes('你好') || lower.includes('嗨')) score += 1;
    return Math.min(3, score);
}

function generateLocalReply(driver, msg) {
    const politeName = getGenderPrefix() === '车迷朋友' ? userProfile.name : `${userProfile.name}${getGenderPrefix()}`;
    const raceContext = window.getCurrentRaceContext ? window.getCurrentRaceContext() : '';
    const rankingInfo = window.formatRankingForChat ? window.formatRankingForChat(driver.id) : '';
    const lower = String(msg || '').toLowerCase();
    if (lower.includes('排名') || lower.includes('成绩')) return `${rankingInfo} 这只是现在的情况，真正的较量还在后面，${politeName}。`;
    if (lower.includes('下一站') || lower.includes('什么时候比赛')) return `${raceContext} 到时候记得来看我。`;
    if ((favorability[driver.id] || 0) >= 70) return `看到你的消息会让我心情不错，${politeName}。`;
    if ((favorability[driver.id] || 0) >= 40) return `谢谢你来找我聊，${politeName}。`;
    return `收到，${politeName}。`;
}

async function getDriverReplyWithFavor(driver, userMessage) {
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
        return { reply: generateLocalReply(driver, userMessage), inc: localFavorJudgment(userMessage) };
    }
    showLoading(true);
    try {
        const history = (chatHistories[driver.id] || []).filter(msg => msg.role !== 'system').slice(-8);
        const rankingInfo = window.formatRankingForChat ? window.formatRankingForChat(driver.id) : '';
        const raceContext = window.getCurrentRaceContext ? window.getCurrentRaceContext() : '';
        const systemMsg = {
            role: 'system',
            content: `今天是${getCurrentDateInfo()}。${raceContext}\n你是 F1 车手 ${driver.name}（${driver.team}）。\n${getChatWritingGuide()}\n${getUserProfilePriorityPrompt()}\n【当前关系】${getFavorMood(favorability[driver.id] || 0)}\n【赛况参考】${rankingInfo}\n${buildDriverSharedMemoryContext(driver.id)}\n${window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : ''}`
        };
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiConfig.key}`
            },
            body: JSON.stringify({ model: apiConfig.model, messages: [systemMsg, ...history], temperature: 0.82, max_tokens: 220 })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const content = payload?.choices?.[0]?.message?.content?.trim();
        if (!content) throw new Error('API 返回空内容');
        return { reply: stripChatStageDirections(content), inc: localFavorJudgment(userMessage) };
    } catch (error) {
        handleApiError(error, '消息回复');
        return { reply: generateLocalReply(driver, userMessage), inc: localFavorJudgment(userMessage) };
    } finally {
        showLoading(false);
    }
}

let messageInProgress = false;

async function sendMessageToDriver(driver, userText) {
    if (!userText.trim() || messageInProgress) return;
    messageInProgress = true;
    try {
        initDriverHistory(driver);
        chatHistories[driver.id].push({ role: 'user', content: userText, timestamp: getCurrentTime(), dateKey: getLocalDateKey() });
        saveChatHistories();
        renderChatMessages(driver.id);
        const { reply, inc } = await getDriverReplyWithFavor(driver, userText);
        if (inc > 0) addFavorability(driver.id, inc);
        chatHistories[driver.id].push({ role: 'assistant', content: reply, timestamp: getCurrentTime(), dateKey: getLocalDateKey() });
        trimChatHistory(driver.id);
        saveChatHistories();
        renderChatMessages(driver.id);
        renderDriverList();
    } finally {
        messageInProgress = false;
    }
}

function openChat(driver) {
    currentChatDriver = driver;
    document.getElementById('chatDriverName').innerText = driver.name;
    renderChatHeaderAvatar(driver.id);
    initDriverHistory(driver);
    renderChatMessages(driver.id);
    document.getElementById('chatDetailView').style.display = 'flex';
    document.getElementById('chatInput').value = '';
    document.getElementById('chatInput').focus();
}

function renderDriverList() {
    const container = document.getElementById('driverList');
    if (!container) return;
    const groups = {};
    window.DRIVERS.forEach(driver => {
        if (!groups[driver.team]) groups[driver.team] = [];
        groups[driver.team].push(driver);
    });
    const teamOrder = ['法拉利', '梅赛德斯', '迈凯伦', '红牛', '阿斯顿马丁', '威廉姆斯', 'Alpine', '哈斯', '奥迪', 'Racing Bulls', '凯迪拉克'];
    container.innerHTML = '';
    teamOrder.forEach(team => {
        if (!groups[team]?.length) return;
        const groupDiv = document.createElement('div');
        groupDiv.className = 'team-group';
        const header = document.createElement('div');
        header.className = 'team-header';
        header.innerText = team;
        groupDiv.appendChild(header);
        groups[team]
            .sort((a, b) => Number(isPinned(b.id)) - Number(isPinned(a.id)) || a.name.localeCompare(b.name))
            .forEach(driver => {
                const history = chatHistories[driver.id] || [];
                const lastMsg = [...history].reverse().find(item => item.role === 'assistant');
                const preview = lastMsg ? `${stripChatStageDirections(lastMsg.content).slice(0, 35)}${stripChatStageDirections(lastMsg.content).length > 35 ? '...' : ''}` : '点击开始对话 ??';
                const card = document.createElement('div');
                card.className = 'driver-card';
                const avatarWrapper = document.createElement('div');
                avatarWrapper.className = 'avatar-wrapper';
                const avatar = document.createElement('div');
                avatar.className = 'driver-avatar';
                renderAvatarOnElement(avatar, driver.id);
                const changeBtn = document.createElement('div');
                changeBtn.className = 'change-avatar-btn';
                changeBtn.innerText = '??';
                changeBtn.addEventListener('click', event => {
                    event.stopPropagation();
                    openAvatarUpload(driver.id);
                });
                avatarWrapper.appendChild(avatar);
                avatarWrapper.appendChild(changeBtn);
                const info = document.createElement('div');
                info.className = 'driver-info';
                info.innerHTML = `<div class="driver-name">${driver.name}</div><div class="driver-team">${driver.team}</div><div class="chat-preview">${escapeHtml(preview)}</div>`;
                const right = document.createElement('div');
                right.className = 'driver-right';
                const pinBtn = document.createElement('button');
                pinBtn.className = `star-btn ${isPinned(driver.id) ? 'pinned' : ''}`;
                pinBtn.innerText = isPinned(driver.id) ? '★' : '☆';
                pinBtn.title = isPinned(driver.id) ? '取消置顶' : '置顶';
                pinBtn.addEventListener('click', event => {
                    event.stopPropagation();
                    togglePinDriver(driver.id);
                });
                const favorSpan = document.createElement('div');
                favorSpan.className = 'favor-preview';
                favorSpan.innerText = `?? ${favorability[driver.id] || 0}`;
                right.appendChild(pinBtn);
                right.appendChild(favorSpan);
                info.appendChild(right);
                card.appendChild(avatarWrapper);
                card.appendChild(info);
                card.addEventListener('click', () => openChat(driver));
                groupDiv.appendChild(card);
            });
        container.appendChild(groupDiv);
    });
}

function deleteMessage(driverId, msgIndex) {
    const history = chatHistories[driverId];
    if (!history || msgIndex < 0 || msgIndex >= history.length) return;
    if (history[msgIndex].role === 'system') return;
    history.splice(msgIndex, 1);
    const nonSystem = history.filter(msg => msg.role !== 'system');
    if (!nonSystem.length) {
        const driver = window.DRIVERS.find(item => item.id === driverId);
        if (driver) history.push({ role: 'assistant', content: driver.initialMsg, timestamp: getCurrentTime(), dateKey: getLocalDateKey() });
    }
    saveChatHistories();
    if (currentChatDriver?.id === driverId) renderChatMessages(driverId);
    renderDriverList();
    showToast('消息已删除', false);
}
