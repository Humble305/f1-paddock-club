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
    return `【私聊写作要求】
- 你是在手机里和用户一对一聊天，不是在接受采访，也不是在写官宣文案。
- 文风要自然、细腻、克制，像真人刚刚想到什么就回了什么。
- 回复通常控制在 2 到 5 句。
- 用户资料属于高优先级记忆。
- 小窗私聊是纯对话界面，绝对禁止输出任何括号动作描写、旁白、舞台说明或心理活动补注。
${getRoleOutputSafetyPrompt('chat')}`;
}

function getDateWritingGuide() {
    return `【约会写作要求】
- 回复必须承接当前场景、上一轮对话、关系状态和用户资料。
- 动作描写放在最前面单独一行，再换行继续台词。
- 不要突然切场景、切情绪、切话题。
${getRoleOutputSafetyPrompt('date')}`;
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
    let result = sanitizeRoleOutput(text, 'chat');
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

function setChatComposerEnabled(enabled) {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendChatBtn');
    const giftBtn = document.getElementById('openChatGiftBtn');
    const giftAllowed = enabled && currentChatDriver && currentChatDriver.type !== 'group';
    if (input) {
        input.disabled = !enabled;
        input.placeholder = enabled ? '给车手发消息...' : '先从左侧选择一位车手开始聊天';
    }
    if (sendBtn) sendBtn.disabled = !enabled;
    if (giftBtn) giftBtn.disabled = !giftAllowed;
}

function renderDesktopChatPlaceholder() {
    const detail = document.getElementById('chatDetailView');
    const avatar = document.getElementById('chatDetailAvatar');
    const name = document.getElementById('chatDriverName');
    const token = document.getElementById('tokenDisplay');
    const area = document.getElementById('chatMessagesArea');
    if (!detail || !area) return;
    detail.style.removeProperty('display');
    detail.classList.add('desktop-visible');
    if (avatar) {
        avatar.style.backgroundImage = '';
        avatar.textContent = 'PC';
    }
    if (name) name.innerText = 'Paddock Club Chat';
    if (token) token.innerText = '选择左侧车手开始聊天';
    area.innerHTML = `<div class="desktop-chat-empty"><div class="desktop-chat-empty-badge">Desktop Chat</div><h3>把围场聊天铺满整个屏幕</h3><p>左边是车手列表，右边是当前会话。切到电脑界面后，你可以像在桌面聊天软件里一样自然地查看历史消息、切换联系人和继续对话。</p></div>`;
    setChatComposerEnabled(false);
}

function syncMobileChatHeaderVisibility(showChatDetail) {
    const header = document.querySelector('.app-header');
    const mobileDetailOpen = !!showChatDetail && !(typeof isDesktopChatView === 'function' && isDesktopChatView());
    header?.classList.toggle('chat-overlay-hidden', mobileDetailOpen);
}

function syncMobileChatIsolation(showChatDetail) {
    const enabled = !!showChatDetail && !(typeof isDesktopChatView === 'function' && isDesktopChatView());
    document.body?.classList.toggle('mobile-chat-focus', enabled);
    syncMobileChatHeaderVisibility(enabled);
}

function renderChatWorkspaceState() {
    const detail = document.getElementById('chatDetailView');
    const chatPage = document.getElementById('chatPage');
    const avatarClick = document.getElementById('chatAvatarClick');
    const desktopMode = typeof isDesktopChatView === 'function' && isDesktopChatView();
    if (!detail) return;
    if (!chatPage?.classList.contains('active-page')) {
        detail.classList.remove('desktop-visible');
        detail.style.removeProperty('display');
        syncMobileChatIsolation(false);
        if (typeof renderChatGiftPanel === 'function') renderChatGiftPanel();
        return;
    }
    if (!currentChatDriver) {
        if (desktopMode) {
            renderDesktopChatPlaceholder();
        } else {
            detail.classList.remove('desktop-visible');
            detail.style.display = 'none';
            setChatComposerEnabled(false);
        }
        syncMobileChatIsolation(false);
        if (typeof renderChatGiftPanel === 'function') renderChatGiftPanel();
        return;
    }
    detail.classList.toggle('desktop-visible', desktopMode);
    detail.style.display = desktopMode ? '' : 'flex';
    syncMobileChatIsolation(true);
    document.getElementById('chatDriverName').innerText = currentChatDriver.name;
    if (currentChatDriver.type === 'group') {
        const avatarDiv = document.getElementById('chatDetailAvatar');
        if (avatarDiv) renderGroupChatAvatarOnElement(avatarDiv, currentChatDriver.id, '40px');
        const token = document.getElementById('tokenDisplay');
        if (token) token.innerText = `群聊 · ${currentChatDriver.memberIds?.length || 0} 人 · 点头像查看成员`;
        if (avatarClick) avatarClick.title = '查看和编辑群聊成员';
        initGroupChatHistory(currentChatDriver);
    } else {
        if (avatarClick) avatarClick.title = `查看 ${currentChatDriver.name} 的资料`;
        renderChatHeaderAvatar(currentChatDriver.id);
        initDriverHistory(currentChatDriver);
    }
    renderChatMessages(currentChatDriver.id);
    setChatComposerEnabled(true);
    if (typeof renderChatGiftPanel === 'function') renderChatGiftPanel();
}

window.renderChatWorkspaceState = renderChatWorkspaceState;

let groupChatDraftSelection = [];
let groupChatModalMode = 'create';
let editingGroupChatId = null;
let groupChatDraftAvatarDataUrl = '';

function getGroupChatById(groupId) {
    return (groupChats || []).find(group => group.id === groupId) || null;
}

function getGroupChatMembers(group) {
    return (group?.memberIds || [])
        .map(memberId => (window.DRIVERS || []).find(driver => driver.id === memberId))
        .filter(Boolean);
}

function buildGroupAvatarLabel(group) {
    return (group?.name || '群聊').slice(0, 1);
}

function renderGroupChatModalAvatar() {
    const avatar = document.getElementById('groupChatAvatarBtn');
    const resetBtn = document.getElementById('resetGroupChatAvatarBtn');
    if (!avatar) return;
    const currentGroup = editingGroupChatId ? getGroupChatById(editingGroupChatId) : null;
    const fallbackGroup = currentGroup || { name: document.getElementById('groupChatNameInput')?.value.trim() || '群聊' };
    const avatarUrl = groupChatDraftAvatarDataUrl || currentGroup?.avatarDataUrl || '';
    if (avatarUrl) {
        avatar.style.backgroundImage = `url(${avatarUrl})`;
        avatar.style.backgroundSize = 'cover';
        avatar.style.backgroundPosition = 'center';
        avatar.style.backgroundColor = '';
        avatar.innerText = '';
    } else {
        avatar.style.backgroundImage = '';
        avatar.style.backgroundSize = '';
        avatar.style.backgroundPosition = '';
        avatar.style.backgroundColor = 'rgba(23,28,37,0.96)';
        avatar.innerText = buildGroupAvatarLabel(fallbackGroup);
    }
    if (resetBtn) resetBtn.style.display = avatarUrl ? 'inline-flex' : 'none';
}

function getDefaultGroupChatName(memberIds = []) {
    const names = memberIds
        .map(memberId => (window.DRIVERS || []).find(driver => driver.id === memberId)?.name)
        .filter(Boolean);
    return `${names.slice(0, 3).join(' · ')} 群聊`;
}

function getGroupChatSharedMemoryContext(memberIds = []) {
    return memberIds
        .map(memberId => {
            const driver = (window.DRIVERS || []).find(item => item.id === memberId);
            if (!driver) return '';
            const shared = buildDriverSharedMemoryContext(memberId);
            return shared ? `【${driver.name} 的共享记忆】\n${shared}` : '';
        })
        .filter(Boolean)
        .join('\n');
}

function initGroupChatHistory(group) {
    if (chatHistories[group.id]) return;
    const members = getGroupChatMembers(group);
    const memberSummary = members.map(driver => `${driver.name}（${driver.team}）`).join('、');
    const personalitySummary = members
        .map(driver => `【${driver.name}】${window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : ''}`)
        .join('\n');
    const prompt = `你现在在一个 F1 围场群聊里。群名：${group.name}。群成员有：${memberSummary}。\n你要扮演群里的这些车手一起和用户聊天。\n【群聊写作要求】\n- 回复时可以由 1 到 3 位车手接话，不必每个人都强行发言。\n- 每一行都必须以“车手名：内容”的格式输出，只输出群聊正文，不要解释。\n- 车手说话风格必须符合各自性格，不要混成一个人。\n- 同一轮里不要让所有人都说很长，整体保持像真实群聊一样自然。\n${getUserProfilePriorityPrompt()}\n${personalitySummary}\n${getGroupChatSharedMemoryContext(group.memberIds)}`;
    chatHistories[group.id] = [
        { role: 'system', content: prompt },
        { role: 'assistant', content: `${members[0]?.name || '车手们'}：${group.name} 已经建好了，想聊什么？`, timestamp: getCurrentTime(), dateKey: getLocalDateKey(), meta: { type: 'group-reply' } }
    ];
    saveChatHistories();
}

function toggleGroupChatsCollapsed() {
    groupChatsCollapsed = !groupChatsCollapsed;
    saveGroupChatUiState();
    renderDriverList();
}

function updateGroupChatModalState() {
    const summary = document.getElementById('groupChatMemberSummary');
    const createBtn = document.getElementById('createGroupChatBtn');
    const title = document.getElementById('groupChatModalTitle');
    const hint = document.getElementById('groupChatModalHint');
    const deleteBtn = document.getElementById('deleteGroupChatBtn');
    if (summary) summary.innerText = `已选 ${groupChatDraftSelection.length} 位车手`;
    if (createBtn) createBtn.disabled = groupChatDraftSelection.length < 2;
    if (createBtn) createBtn.innerText = groupChatModalMode === 'edit' ? '保存群聊' : '创建群聊';
    if (title) title.innerText = groupChatModalMode === 'edit' ? '编辑群聊' : '新建群聊';
    if (hint) hint.innerText = groupChatModalMode === 'edit' ? '这里可以查看当前群成员，也可以修改群聊名称和成员配置。' : '选择多位车手，把他们拉进同一个群里。';
    if (deleteBtn) deleteBtn.style.display = groupChatModalMode === 'edit' ? 'inline-flex' : 'none';
    renderGroupChatModalAvatar();
}

function renderGroupChatMemberPicker() {
    const mount = document.getElementById('groupChatMemberList');
    if (!mount) return;
    mount.innerHTML = (window.DRIVERS || []).map(driver => `
        <label class="group-chat-member-option${groupChatDraftSelection.includes(driver.id) ? ' active' : ''}">
            <input type="checkbox" data-group-member="${driver.id}" ${groupChatDraftSelection.includes(driver.id) ? 'checked' : ''}>
            <div class="group-chat-member-copy">
                <strong>${escapeHtml(driver.name)}</strong>
                <span>${escapeHtml(driver.team)}</span>
            </div>
        </label>
    `).join('');
    mount.querySelectorAll('.group-chat-member-option').forEach(option => {
        option.addEventListener('click', event => {
            const input = option.querySelector('[data-group-member]');
            if (!(input instanceof HTMLInputElement)) return;
            if (event.target === input) return;
            input.checked = !input.checked;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });
    mount.querySelectorAll('[data-group-member]').forEach(input => {
        input.addEventListener('change', () => {
            const driverId = input.dataset.groupMember;
            const next = new Set(groupChatDraftSelection);
            if (input.checked) next.add(driverId);
            else next.delete(driverId);
            groupChatDraftSelection = [...next];
            renderGroupChatMemberPicker();
            updateGroupChatModalState();
        });
    });
}

function openGroupChatModal() {
    groupChatModalMode = 'create';
    editingGroupChatId = null;
    groupChatDraftSelection = [];
    groupChatDraftAvatarDataUrl = '';
    const input = document.getElementById('groupChatNameInput');
    const modal = document.getElementById('groupChatModal');
    if (input) input.value = '';
    renderGroupChatMemberPicker();
    updateGroupChatModalState();
    if (modal) modal.style.display = 'flex';
}

function closeGroupChatModal() {
    document.getElementById('groupChatModal')?.style.setProperty('display', 'none');
    const input = document.getElementById('groupChatNameInput');
    if (input) input.value = '';
    groupChatDraftSelection = [];
    groupChatDraftAvatarDataUrl = '';
    groupChatModalMode = 'create';
    editingGroupChatId = null;
    renderGroupChatModalAvatar();
}

function createGroupChat() {
    const input = document.getElementById('groupChatNameInput');
    if (groupChatDraftSelection.length < 2) {
        updateGroupChatModalState();
        return;
    }
    const name = (input?.value || '').trim() || getDefaultGroupChatName(groupChatDraftSelection);
    if (groupChatModalMode === 'edit' && editingGroupChatId) {
        const target = getGroupChatById(editingGroupChatId);
        if (!target) return;
        target.name = name;
        target.memberIds = [...groupChatDraftSelection];
        target.avatarDataUrl = groupChatDraftAvatarDataUrl || '';
        saveGroupChats();
        delete chatHistories[target.id];
        initGroupChatHistory(target);
        closeGroupChatModal();
        renderDriverList();
        if (currentChatDriver?.id === target.id) {
            currentChatDriver = { ...target, type: 'group' };
            renderChatWorkspaceState();
        }
        showToast(`已更新群聊：${name}`, false);
        return;
    }
    const group = {
        id: `group_${Date.now()}`,
        type: 'group',
        name,
        memberIds: [...groupChatDraftSelection],
        avatarDataUrl: groupChatDraftAvatarDataUrl || '',
        createdAt: new Date().toISOString()
    };
    groupChats = [group, ...(groupChats || [])];
    saveGroupChats();
    closeGroupChatModal();
    openChat(group);
    showToast(`已创建群聊：${name}`, false);
}

function openEditGroupChatModal(groupId) {
    const group = getGroupChatById(groupId);
    const input = document.getElementById('groupChatNameInput');
    const modal = document.getElementById('groupChatModal');
    if (!group || !input || !modal) return;
    groupChatModalMode = 'edit';
    editingGroupChatId = groupId;
    groupChatDraftSelection = [...(group.memberIds || [])];
    groupChatDraftAvatarDataUrl = group.avatarDataUrl || '';
    input.value = group.name || '';
    renderGroupChatMemberPicker();
    updateGroupChatModalState();
    modal.style.display = 'flex';
}

function deleteGroupChat(groupId = editingGroupChatId) {
    const group = getGroupChatById(groupId);
    if (!group) return;
    const confirmed = confirm(`确定要删除群聊“${group.name}”吗？`);
    if (!confirmed) return;
    groupChats = (groupChats || []).filter(item => item.id !== groupId);
    saveGroupChats();
    delete chatHistories[groupId];
    saveChatHistories();
    if (currentChatDriver?.id === groupId) closeChatDetailView(true);
    closeGroupChatModal();
    renderDriverList();
    showToast(`已删除群聊：${group.name}`, false);
}

window.openGroupChatModal = openGroupChatModal;
window.closeGroupChatModal = closeGroupChatModal;
window.createGroupChat = createGroupChat;
window.updateGroupChatModalState = updateGroupChatModalState;
window.openEditGroupChatModal = openEditGroupChatModal;
window.deleteGroupChat = deleteGroupChat;

function renderGroupChatSection(container) {
    const section = document.createElement('div');
    section.className = 'group-chat-section';
    section.innerHTML = `
        <div class="group-chat-section-head">
            <button type="button" class="group-chat-toggle" id="groupChatToggleBtn">${groupChatsCollapsed ? '▸' : '▾'} 群聊</button>
            <button type="button" class="group-chat-create-btn" id="groupChatCreateBtn">＋</button>
        </div>
        <div class="group-chat-section-body${groupChatsCollapsed ? ' collapsed' : ''}" id="groupChatSectionBody"></div>
    `;
    container.appendChild(section);
    section.querySelector('#groupChatToggleBtn')?.addEventListener('click', toggleGroupChatsCollapsed);
    section.querySelector('#groupChatCreateBtn')?.addEventListener('click', openGroupChatModal);
    const body = section.querySelector('#groupChatSectionBody');
    if (!body || groupChatsCollapsed) return;
    if (!(groupChats || []).length) {
        body.innerHTML = '<div class="group-chat-empty">还没有群聊，点右上角的 ＋ 新建一个小群。</div>';
        return;
    }
    (groupChats || []).forEach(group => {
        const card = document.createElement('div');
        card.className = `driver-card group-chat-card${currentChatDriver?.id === group.id ? ' active' : ''}`;
        card.innerHTML = `
            <div class="group-chat-avatar" data-group-chat-avatar="${escapeHtml(group.id)}">${escapeHtml(buildGroupAvatarLabel(group))}</div>
            <div class="driver-info group-chat-card-copy">
                <div class="driver-name">${escapeHtml(group.name)}</div>
            </div>
        `;
        card.addEventListener('click', () => openChat(group));
        const avatar = card.querySelector('[data-group-chat-avatar]');
        if (avatar) renderGroupChatAvatarOnElement(avatar, group.id, '40px');
        body.appendChild(card);
    });
}

let activeMessageMenuKey = null;
let messageForwardState = {
    sourceDriverId: null,
    selectedIndexes: [],
    targetDriverId: ''
};
let messageEditState = {
    driverId: null,
    messageIndex: -1
};

function buildMessageActionKey(driverId, messageIndex) {
    return `${driverId}:${messageIndex}`;
}

function closeMessageActionMenu() {
    activeMessageMenuKey = null;
    if (currentChatDriver?.id) renderChatMessages(currentChatDriver.id);
}

function toggleMessageActionMenu(driverId, messageIndex) {
    const nextKey = buildMessageActionKey(driverId, messageIndex);
    activeMessageMenuKey = activeMessageMenuKey === nextKey ? null : nextKey;
    if (currentChatDriver?.id === driverId) renderChatMessages(driverId);
}

function updateMessageEditState() {
    const input = document.getElementById('messageEditInput');
    const count = document.getElementById('messageEditCount');
    const saveBtn = document.getElementById('saveMessageEditBtn');
    if (!input || !count || !saveBtn) return;
    const length = String(input.value || '').length;
    const trimmed = input.value.trim();
    count.innerText = `${length}/600`;
    count.classList.toggle('is-over', length > 600);
    saveBtn.disabled = !trimmed || length > 600;
}

function closeMessageEditModal() {
    document.getElementById('messageEditModal')?.style.setProperty('display', 'none');
    const input = document.getElementById('messageEditInput');
    const count = document.getElementById('messageEditCount');
    if (input) input.value = '';
    if (count) {
        count.innerText = '0/600';
        count.classList.remove('is-over');
    }
    messageEditState = { driverId: null, messageIndex: -1 };
}

function openMessageEditModal(driverId, messageIndex) {
    const history = chatHistories[driverId] || [];
    const message = history[messageIndex];
    const modal = document.getElementById('messageEditModal');
    const input = document.getElementById('messageEditInput');
    const hint = document.getElementById('messageEditHint');
    if (!modal || !input || !message || message.role === 'system') return;
    activeMessageMenuKey = null;
    messageEditState = { driverId, messageIndex };
    input.value = message.content || '';
    if (hint) hint.innerText = message.role === 'user' ? '你发出的内容会被直接更新。' : '车手这条回复会被直接更新到当前聊天记录里。';
    modal.style.display = 'flex';
    updateMessageEditState();
    window.setTimeout(() => input.focus(), 40);
}

function saveMessageEdit() {
    const { driverId, messageIndex } = messageEditState;
    const input = document.getElementById('messageEditInput');
    if (!driverId || !input) return;
    const history = chatHistories[driverId] || [];
    const message = history[messageIndex];
    const nextText = input.value.trim();
    if (!message || message.role !== 'user' || !nextText || nextText.length > 600) {
        updateMessageEditState();
        return;
    }
    const nextAssistantIndex = history[messageIndex + 1]?.role === 'assistant' ? messageIndex + 1 : -1;
    message.content = nextText;
    message.timestamp = getCurrentTime();
    saveChatHistories();
    closeMessageEditModal();
    if (nextAssistantIndex >= 0) {
        resetAssistantMessage(driverId, nextAssistantIndex);
        return;
    }
    renderChatMessages(driverId);
    renderDriverList();
    showToast('消息已更新，但后面没有可联动重置的车手回复', false);
}

async function resetAssistantMessage(driverId, messageIndex) {
    const driver = (window.DRIVERS || []).find(item => item.id === driverId);
    const history = chatHistories[driverId] || [];
    const message = history[messageIndex];
    if (!driver || !message || message.role !== 'assistant') return;
    let userIndex = -1;
    for (let idx = messageIndex - 1; idx >= 0; idx -= 1) {
        if (history[idx]?.role === 'user') {
            userIndex = idx;
            break;
        }
    }
    if (userIndex < 0) {
        showToast('这条回复前没有可重生成的用户消息', true);
        return;
    }
    const sourceUserMessage = history[userIndex];
    const trimmedHistory = history
        .slice(0, messageIndex)
        .filter(entry => entry.role !== 'system')
        .map(entry => ({ role: entry.role, content: entry.content }));
    closeMessageActionMenu();
    try {
        const { reply } = await getDriverReplyWithFavor(driver, sourceUserMessage.content, {
            historyOverride: trimmedHistory
        });
        history[messageIndex] = {
            ...message,
            content: reply,
            timestamp: getCurrentTime(),
            regenerated: true
        };
        saveChatHistories();
        renderChatMessages(driverId);
        renderDriverList();
        showToast('已重新生成这条回复', false);
    } catch (error) {
        console.error('重置角色回复失败', error);
        showToast('重置失败，请稍后再试', true);
    }
}

function updateMessageForwardSummary() {
    const summary = document.getElementById('messageForwardSelectionSummary');
    const confirmBtn = document.getElementById('confirmMessageForwardBtn');
    const count = messageForwardState.selectedIndexes.length;
    if (summary) summary.innerText = `已选 ${count} 条消息`;
    if (confirmBtn) confirmBtn.disabled = !count || !messageForwardState.targetDriverId;
}

function closeMessageForwardModal() {
    document.getElementById('messageForwardModal')?.style.setProperty('display', 'none');
    messageForwardState = {
        sourceDriverId: null,
        selectedIndexes: [],
        targetDriverId: ''
    };
}

function renderMessageForwardTargetList() {
    const mount = document.getElementById('messageForwardTargetList');
    if (!mount) return;
    const sourceId = messageForwardState.sourceDriverId;
    const targets = (window.DRIVERS || []).filter(driver => driver.id !== sourceId);
    mount.innerHTML = targets.map(driver => `
        <button type="button" class="message-forward-target${messageForwardState.targetDriverId === driver.id ? ' active' : ''}" data-forward-target="${driver.id}">
            <span>${escapeHtml(driver.name)}</span>
            <small>${escapeHtml(driver.team)}</small>
        </button>
    `).join('');
    mount.querySelectorAll('[data-forward-target]').forEach(button => {
        button.addEventListener('click', () => {
            messageForwardState.targetDriverId = button.dataset.forwardTarget;
            renderMessageForwardTargetList();
            updateMessageForwardSummary();
        });
    });
}

function renderMessageForwardList() {
    const mount = document.getElementById('messageForwardList');
    const hint = document.getElementById('messageForwardHint');
    if (!mount) return;
    const history = chatHistories[messageForwardState.sourceDriverId] || [];
    const items = history
        .map((msg, index) => ({ msg, index }))
        .filter(entry => entry.msg.role !== 'system');
    if (hint && currentChatDriver) {
        hint.innerText = `这些内容会从你和 ${currentChatDriver.name} 的聊天里挑选出来再转发。`;
    }
    mount.innerHTML = items.map(({ msg, index }) => {
        const checked = messageForwardState.selectedIndexes.includes(index);
        const roleLabel = msg.role === 'user' ? '你' : currentChatDriver?.name || '车手';
        const displayText = msg.role === 'assistant' ? stripChatStageDirections(msg.content) : String(msg.content || '');
        return `
            <label class="message-forward-item${checked ? ' active' : ''}">
                <input type="checkbox" data-forward-message="${index}" ${checked ? 'checked' : ''}>
                <div class="message-forward-item-body">
                    <div class="message-forward-item-meta">
                        <span>${escapeHtml(roleLabel)}</span>
                        <small>${escapeHtml(msg.timestamp || '')}</small>
                    </div>
                    <div class="message-forward-item-text">${escapeHtml(displayText)}</div>
                </div>
            </label>
        `;
    }).join('');
    mount.querySelectorAll('[data-forward-message]').forEach(input => {
        input.addEventListener('change', () => {
            const index = Number(input.dataset.forwardMessage);
            const next = new Set(messageForwardState.selectedIndexes);
            if (input.checked) next.add(index);
            else next.delete(index);
            messageForwardState.selectedIndexes = [...next].sort((a, b) => a - b);
            renderMessageForwardList();
            updateMessageForwardSummary();
        });
    });
}

function openMessageForwardModal(driverId, initialMessageIndex = null) {
    const modal = document.getElementById('messageForwardModal');
    if (!modal) return;
    activeMessageMenuKey = null;
    messageForwardState = {
        sourceDriverId: driverId,
        selectedIndexes: initialMessageIndex === null ? [] : [initialMessageIndex],
        targetDriverId: ''
    };
    renderMessageForwardList();
    renderMessageForwardTargetList();
    updateMessageForwardSummary();
    modal.style.display = 'flex';
}

async function confirmMessageForward() {
    const { sourceDriverId, selectedIndexes, targetDriverId } = messageForwardState;
    const targetDriver = (window.DRIVERS || []).find(driver => driver.id === targetDriverId);
    const sourceDriver = (window.DRIVERS || []).find(driver => driver.id === sourceDriverId);
    if (!sourceDriverId || !selectedIndexes.length || !targetDriver) {
        updateMessageForwardSummary();
        return;
    }
    const history = chatHistories[sourceDriverId] || [];
    const lines = selectedIndexes
        .map(index => history[index])
        .filter(msg => msg && msg.role !== 'system')
        .map(msg => {
            const speaker = msg.role === 'user' ? '我' : `${sourceDriver?.name || '对方'}`;
            const content = msg.role === 'assistant' ? stripChatStageDirections(msg.content) : String(msg.content || '');
            return { speaker, content };
        });
    if (!lines.length) return;
    const forwardText = `我想转发几条刚刚的聊天内容给你，来源是我和${sourceDriver?.name || '另一位车手'}的对话：\n${lines.map((line, idx) => `${idx + 1}. ${line.speaker}：${line.content}`).join('\n')}`;
    closeMessageForwardModal();
    closeMessageActionMenu();
    try {
        await sendMessageToDriver(targetDriver, forwardText, {
            messageMeta: {
                type: 'forwarded',
                sourceDriverId,
                sourceDriverName: sourceDriver?.name || '另一位车手',
                sourceDriverTeam: sourceDriver?.team || '',
                lines
            }
        });
        showToast(`已转发给 ${targetDriver.name}`, false);
    } catch (error) {
        console.error('转发消息失败', error);
        showToast('转发失败，请稍后再试', true);
    }
}

function parseGroupReplyLines(group, text) {
    const members = getGroupChatMembers(group);
    return String(text || '')
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
            const parts = line.split('：');
            const speaker = parts.shift() || '车手';
            const content = parts.join('：') || line;
            const driver = members.find(member => member.name === speaker) || (window.DRIVERS || []).find(member => member.name === speaker) || null;
            return { speaker, content, driver };
        });
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
        wrapper.dataset.messageIndex = String(idx);
        const header = document.createElement('div');
        header.className = 'msg-header';
        const timeSpan = document.createElement('span');
        timeSpan.innerText = msg.timestamp || '';
        header.appendChild(timeSpan);
        const tools = document.createElement('div');
        tools.className = 'msg-tools';
        const menuKey = buildMessageActionKey(driverId, idx);
        const menuOpen = activeMessageMenuKey === menuKey;
        const isOwnMessage = msg.role === 'user';
        tools.innerHTML = `
            <button type="button" class="msg-tools-trigger${menuOpen ? ' active' : ''}" aria-label="消息操作">⋯</button>
            <div class="msg-tools-menu${menuOpen ? ' open' : ''}">
                <button type="button" class="msg-tools-action" data-msg-action="forward" title="转发">转</button>
                <button type="button" class="msg-tools-action" data-msg-action="${isOwnMessage ? 'edit' : 'reset'}" title="${isOwnMessage ? '编辑' : '重置'}">${isOwnMessage ? '编' : '重'}</button>
                <button type="button" class="msg-tools-action danger" data-msg-action="delete" title="删除">删</button>
            </div>
        `;
        header.appendChild(tools);
        const bubble = document.createElement('div');
        const isForwarded = msg.role === 'user' && msg.meta?.type === 'forwarded';
        const isGroupReply = msg.role === 'assistant' && msg.meta?.type === 'group-reply';
        bubble.className = `${isGroupReply ? 'group-message-stack' : 'msg-bubble'}${isForwarded ? ' msg-bubble-forwarded' : ''}${msg.regenerated ? ' msg-bubble-regenerated' : ''}`;
        if (isForwarded) {
            const lines = Array.isArray(msg.meta?.lines) ? msg.meta.lines : [];
            bubble.innerHTML = `
                <div class="forwarded-card-head">
                    <div class="forwarded-accent"></div>
                    <div class="forwarded-head-copy">
                        <div class="forwarded-badge">转发聊天</div>
                        <div class="forwarded-source">${escapeHtml(msg.meta?.sourceDriverName || '另一位车手')}${msg.meta?.sourceDriverTeam ? ` · ${escapeHtml(msg.meta.sourceDriverTeam)}` : ''}</div>
                    </div>
                </div>
                <div class="forwarded-lines">
                    ${lines.map(line => `
                        <div class="forwarded-line">
                            <span class="forwarded-speaker">${escapeHtml(line.speaker || '')}</span>
                            <span class="forwarded-text">${escapeHtml(line.content || '')}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (isGroupReply) {
            const group = getGroupChatById(driverId) || currentChatDriver;
            const lines = parseGroupReplyLines(group, msg.content);
            bubble.innerHTML = lines.map(line => `
                <div class="group-message-item">
                    <div class="group-message-avatar" data-group-speaker-id="${escapeHtml(line.driver?.id || '')}">${escapeHtml((line.speaker || '群').slice(0, 1))}</div>
                    <div class="group-message-body">
                        <div class="group-message-meta">
                            <span class="group-message-name">${escapeHtml(line.speaker)}</span>
                            <span class="group-message-id">${escapeHtml(line.driver?.team || '群聊成员')}</span>
                        </div>
                        <div class="group-message-bubble">${escapeHtml(line.content)}</div>
                    </div>
                </div>
            `).join('');
        } else {
            bubble.innerText = msg.role === 'assistant' ? stripChatStageDirections(msg.content) : msg.content;
        }
        wrapper.appendChild(header);
        wrapper.appendChild(bubble);
        tools.querySelector('.msg-tools-trigger')?.addEventListener('click', event => {
            event.stopPropagation();
            toggleMessageActionMenu(driverId, idx);
        });
        tools.querySelectorAll('[data-msg-action]').forEach(button => {
            button.addEventListener('click', event => {
                event.stopPropagation();
                const action = button.dataset.msgAction;
                if (action === 'forward') openMessageForwardModal(driverId, idx);
                if (action === 'edit') openMessageEditModal(driverId, idx);
                if (action === 'reset') resetAssistantMessage(driverId, idx);
                if (action === 'delete') {
                    closeMessageActionMenu();
                    deleteMessage(driverId, idx);
                }
            });
        });
        if (isGroupReply) {
            wrapper.querySelectorAll('[data-group-speaker-id]').forEach(avatar => {
                const speakerId = avatar.dataset.groupSpeakerId;
                if (speakerId) renderAvatarOnElement(avatar, speakerId, '38px');
            });
        }
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

function pickGroupReplyMembers(group, userText) {
    const members = getGroupChatMembers(group);
    if (!members.length) return [];
    const text = String(userText || '').trim();
    const mentionedMembers = members.filter(member => text.includes(member.name));
    if (mentionedMembers.length) return mentionedMembers;
    return [members[Math.floor(Math.random() * members.length)]];
}

function generateLocalReply(driver, msg, options = {}) {
    const giftContext = options.giftContext || null;
    const politeName = getGenderPrefix() === '车迷朋友' ? userProfile.name : `${userProfile.name}${getGenderPrefix()}`;
    const raceContext = window.getCurrentRaceContext ? window.getCurrentRaceContext() : '';
    const rankingInfo = window.formatRankingForChat ? window.formatRankingForChat(driver.id) : '';
    const lower = String(msg || '').toLowerCase();

    if (giftContext) {
        if (giftContext.matched) {
            return `这份 ${giftContext.name} 我一眼就记住了。你居然真的挑到这种东西，害我现在心情好得有点明显。`;
        }
        return `我收到了，${politeName}。${giftContext.name} 还挺有意思的，我会好好放着。`;
    }

    if (lower.includes('排名') || lower.includes('成绩')) {
        return `${rankingInfo} 不过现在还只是阶段性的情况，真正该见分晓的还在后面。`;
    }
    if (lower.includes('下一站') || lower.includes('什么时候比赛')) {
        return `${raceContext} 到时候记得来看，我应该不会让你失望。`;
    }
    if (lower.includes('想你') || lower.includes('喜欢你')) {
        return `这种话我听到了，${politeName}。至少现在，我不想装作没感觉。`;
    }
    if ((favorability[driver.id] || 0) >= 70) return `你一来找我，我这边的心情都会跟着好一点。`;
    if ((favorability[driver.id] || 0) >= 40) return `看到你的消息还挺好的。你想聊什么，我在听。`;
    return `我看到了。你继续说，我听着。`;
}

function generateLocalGroupReply(group, userText) {
    const picked = pickGroupReplyMembers(group, userText);
    const snippets = picked.map(member => `${member.name}：${generateLocalReply(member, userText)}`);
    return snippets.join('\n');
}

async function getGroupReply(group, userText) {
    const members = getGroupChatMembers(group);
    if (!members.length) return { reply: '群里暂时没人接话。', incs: [] };
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
        return { reply: generateLocalGroupReply(group, userText), incs: [] };
    }
    showLoading(true);
    try {
        const history = (chatHistories[group.id] || []).filter(msg => msg.role !== 'system').slice(-10);
        const memberSummary = members.map(driver => `${driver.name}（${driver.team}）`).join('、');
        const personalitySummary = members
            .map(driver => `【${driver.name}】${window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : ''}`)
            .join('\n');
        const pickedMembers = pickGroupReplyMembers(group, userText);
        const text = String(userText || '').trim();
        const pickedNames = pickedMembers.map(driver => driver.name).join('、');
        const mentionRule = text && pickedMembers.length && pickedMembers.every(driver => text.includes(driver.name))
            ? `用户这次明确提到了：${pickedNames}。这次只让这些被点到的车手回复。`
            : '用户这次没有明确点名，请只随机让 1 位最合适的车手回复。';
        const systemMsg = {
            role: 'system',
            content: `今天是${getCurrentDateInfo()}。你正在一个围场群聊里回复用户，群名：${group.name}。群成员：${memberSummary}。\n【群聊输出规则】\n- 默认只输出 1 行，也就是只让 1 位车手回复。\n- 只有当用户明确提到某位或某几位车手名字时，才让对应被点到的车手回复。\n- 每一行必须以“车手名：内容”的格式输出。\n- 不要让所有成员强行都说话，也不要输出解释、旁白或括号动作。\n- 群聊记忆和用户全局资料共通，回复时可以参考各成员已有记忆。\n- ${mentionRule}\n${getUserProfilePriorityPrompt()}\n${personalitySummary}\n${getGroupChatSharedMemoryContext(group.memberIds)}`
        };
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiConfig.key}`
            },
            body: JSON.stringify({ model: apiConfig.model, messages: [systemMsg, ...history], temperature: 0.9, max_tokens: 260 })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const content = sanitizeRoleOutput(payload?.choices?.[0]?.message?.content?.trim(), 'chat');
        if (!content) throw new Error('API 返回空内容');
        return { reply: content, incs: [] };
    } catch (error) {
        handleApiError(error, '群聊回复');
        return { reply: generateLocalGroupReply(group, userText), incs: [] };
    } finally {
        showLoading(false);
    }
}

async function getDriverReplyWithFavor(driver, userMessage, options = {}) {
    const giftContext = options.giftContext || null;
    const historyOverride = Array.isArray(options.historyOverride) ? options.historyOverride : null;
    const baseInc = giftContext ? 0 : localFavorJudgment(userMessage);
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
        return { reply: generateLocalReply(driver, userMessage, options), inc: baseInc };
    }
    showLoading(true);
    try {
        const history = (historyOverride || (chatHistories[driver.id] || []).filter(msg => msg.role !== 'system')).slice(-8);
        const rankingInfo = window.formatRankingForChat ? window.formatRankingForChat(driver.id) : '';
        const raceContext = window.getCurrentRaceContext ? window.getCurrentRaceContext() : '';
        const giftPrompt = giftContext ? `\n【礼物事件】\n- 用户刚刚送来的礼物：${giftContext.name}\n- 礼物描述：${giftContext.description}\n- 这份礼物是否正中你的偏好：${giftContext.matched ? '是' : '否'}\n- 如果正中偏好，请明显更开心、更主动、更有被懂到的感觉，但不要直接说“这就是我最爱的礼物”。\n- 如果没有正中偏好，请礼貌收下、语气自然，不要表现得扫兴，也不要直接说送错了。\n- 这是聊天小窗回复，只输出你对用户说的话。` : '';
        const systemMsg = {
            role: 'system',
            content: `今天是${getCurrentDateInfo()}。${raceContext}\n你是 F1 车手 ${driver.name}（${driver.team}）。\n${getChatWritingGuide()}\n${getUserProfilePriorityPrompt()}\n【当前关系】${getFavorMood(favorability[driver.id] || 0)}\n【赛况参考】${rankingInfo}\n${buildDriverSharedMemoryContext(driver.id)}\n${window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : ''}${giftPrompt}`
        };
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiConfig.key}`
            },
            body: JSON.stringify({ model: apiConfig.model, messages: [systemMsg, ...history], temperature: giftContext ? 0.9 : 0.82, max_tokens: 220 })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const content = sanitizeRoleOutput(payload?.choices?.[0]?.message?.content?.trim(), 'chat');
        if (!content) throw new Error('API 返回空内容');
        return { reply: stripChatStageDirections(content), inc: baseInc };
    } catch (error) {
        handleApiError(error, '消息回复');
        return { reply: generateLocalReply(driver, userMessage, options), inc: baseInc };
    } finally {
        showLoading(false);
    }
}

let messageInProgress = false;

async function sendMessageToDriver(driver, userText, options = {}) {
    if (driver?.type === 'group') {
        return sendMessageToGroup(driver, userText, options);
    }
    if (!userText.trim() || messageInProgress) return;
    messageInProgress = true;
    try {
        initDriverHistory(driver);
        chatHistories[driver.id].push({
            role: 'user',
            content: userText,
            timestamp: getCurrentTime(),
            dateKey: getLocalDateKey(),
            meta: options.messageMeta || null
        });
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

async function sendMessageToGroup(group, userText, options = {}) {
    if (!userText.trim() || messageInProgress) return;
    messageInProgress = true;
    try {
        initGroupChatHistory(group);
        chatHistories[group.id].push({
            role: 'user',
            content: userText,
            timestamp: getCurrentTime(),
            dateKey: getLocalDateKey(),
            meta: options.messageMeta || null
        });
        saveChatHistories();
        renderChatMessages(group.id);
        const { reply } = await getGroupReply(group, userText);
        chatHistories[group.id].push({
            role: 'assistant',
            content: reply,
            timestamp: getCurrentTime(),
            dateKey: getLocalDateKey(),
            meta: { type: 'group-reply', memberIds: group.memberIds || [] }
        });
        trimChatHistory(group.id);
        saveChatHistories();
        renderChatMessages(group.id);
        renderDriverList();
    } finally {
        messageInProgress = false;
    }
}

async function sendGiftToDriver(driver, giftItem, matched) {
    if (!driver || !giftItem || messageInProgress) return false;
    const userText = `我送给你一份礼物：${giftItem.name}`;
    messageInProgress = true;
    try {
        initDriverHistory(driver);
        chatHistories[driver.id].push({ role: 'user', content: userText, timestamp: getCurrentTime(), dateKey: getLocalDateKey() });
        saveChatHistories();
        renderChatMessages(driver.id);
        const { reply } = await getDriverReplyWithFavor(driver, userText, {
            giftContext: {
                name: giftItem.name,
                description: giftItem.description,
                matched
            }
        });
        if (matched) addFavorability(driver.id, 5);
        chatHistories[driver.id].push({ role: 'assistant', content: reply, timestamp: getCurrentTime(), dateKey: getLocalDateKey() });
        trimChatHistory(driver.id);
        saveChatHistories();
        renderChatMessages(driver.id);
        renderDriverList();
        if (typeof renderChatGiftPanel === 'function') renderChatGiftPanel();
        return true;
    } finally {
        messageInProgress = false;
    }
}

window.sendGiftToDriver = sendGiftToDriver;

let hiddenByMobileChatModalEntries = [];
let isMobileChatIsolating = false;

function shouldUseMobileChatIsolation() {
    return !(typeof isDesktopChatView === 'function' && isDesktopChatView());
}

function hideVisibleOverlaysForMobileChat() {
    if (!shouldUseMobileChatIsolation()) return;
    const selector = '.modal, .profile-card-modal';
    const overlays = [...document.querySelectorAll(selector)].filter(element => {
        if (!(element instanceof HTMLElement)) return false;
        if (element.id === 'chatDetailView') return false;
        const computed = window.getComputedStyle(element);
        return computed.display !== 'none';
    });
    hiddenByMobileChatModalEntries = overlays.map(element => ({
        id: element.id,
        display: element.style.display || 'flex'
    }));
    overlays.forEach(element => {
        element.dataset.hiddenByMobileChat = 'true';
        element.style.display = 'none';
    });
    isMobileChatIsolating = hiddenByMobileChatModalEntries.length > 0;
}

function restoreHiddenOverlaysFromMobileChat() {
    if (!isMobileChatIsolating || !hiddenByMobileChatModalEntries.length) return;
    hiddenByMobileChatModalEntries.forEach(entry => {
        const element = document.getElementById(entry.id);
        if (!(element instanceof HTMLElement)) return;
        if (element.dataset.hiddenByMobileChat !== 'true') return;
        delete element.dataset.hiddenByMobileChat;
        if (window.getComputedStyle(element).display === 'none') {
            element.style.display = entry.display || 'flex';
        }
    });
    hiddenByMobileChatModalEntries = [];
    isMobileChatIsolating = false;
}

window.restoreHiddenOverlaysFromMobileChat = restoreHiddenOverlaysFromMobileChat;
window.isMobileChatIsolating = () => isMobileChatIsolating;

function openChat(driver) {
    hideVisibleOverlaysForMobileChat();
    currentChatDriver = driver.type === 'group' ? { ...driver, type: 'group' } : driver;
    renderChatWorkspaceState();
    renderDriverList();
    if (typeof renderChatGiftPanel === 'function') renderChatGiftPanel();
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = '';
        input.focus();
    }
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
    renderGroupChatSection(container);
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
                const cleanedPreview = lastMsg ? stripChatStageDirections(lastMsg.content) : '';
                const preview = cleanedPreview ? `${cleanedPreview.slice(0, 35)}${cleanedPreview.length > 35 ? '...' : ''}` : '点击开始对话';
                const card = document.createElement('div');
                card.className = `driver-card${currentChatDriver?.id === driver.id ? ' active' : ''}`;
                const avatarWrapper = document.createElement('div');
                avatarWrapper.className = 'avatar-wrapper';
                const avatar = document.createElement('div');
                avatar.className = 'driver-avatar';
                renderAvatarOnElement(avatar, driver.id);
                const changeBtn = document.createElement('div');
                changeBtn.className = 'change-avatar-btn';
                changeBtn.innerText = '＋';
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
                favorSpan.innerText = `♥ ${favorability[driver.id] || 0}`;
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
        const group = getGroupChatById(driverId);
        if (driver) history.push({ role: 'assistant', content: driver.initialMsg, timestamp: getCurrentTime(), dateKey: getLocalDateKey() });
        if (group) {
            const fallbackMember = pickGroupReplyMembers(group, '')[0] || getGroupChatMembers(group)[0];
            history.push({ role: 'assistant', content: `${fallbackMember?.name || '车手'}：群里暂时安静了一下。`, timestamp: getCurrentTime(), dateKey: getLocalDateKey(), meta: { type: 'group-reply' } });
        }
    }
    saveChatHistories();
    if (currentChatDriver?.id === driverId) renderChatMessages(driverId);
    renderDriverList();
    showToast('消息已删除', false);
}
