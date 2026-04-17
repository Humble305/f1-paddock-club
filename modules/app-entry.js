// 应用入口、页面切换与事件绑定

const PAGE_IDS = {
    chat: 'chatPage',
    feed: 'feedPage',
    standings: 'standingsPage',
    raceRankings: 'standingsPage',
    date: 'datePage',
    calendar: 'calendarPage',
    media: 'mediaPage',
    sign: 'signPage'
};

function clearSidebarActive() {
    document.querySelectorAll('.sidebar-btn.active').forEach(button => button.classList.remove('active'));
}

function setSidebarActive(buttonId) {
    clearSidebarActive();
    if (!buttonId) return;
    document.getElementById(buttonId)?.classList.add('active');
}

function closeChatDetailView(forceHide = false) {
    const detail = document.getElementById('chatDetailView');
    const header = document.querySelector('.app-header');
    if (!detail) return;
    if (!forceHide && typeof isDesktopChatView === 'function' && isDesktopChatView()) {
        currentChatDriver = null;
        header?.classList.remove('chat-overlay-hidden');
        document.body?.classList.remove('mobile-chat-focus');
        if (typeof window.renderChatWorkspaceState === 'function') window.renderChatWorkspaceState();
        if (typeof renderDriverList === 'function') renderDriverList();
        return;
    }
    currentChatDriver = null;
    detail.classList.remove('desktop-visible');
    detail.style.removeProperty('display');
    header?.classList.remove('chat-overlay-hidden');
    document.body?.classList.remove('mobile-chat-focus');
    if (typeof window.restoreHiddenOverlaysFromMobileChat === 'function') {
        window.restoreHiddenOverlaysFromMobileChat();
    }
    if (typeof renderDriverList === 'function') renderDriverList();
}

function renderPageByKey(pageKey) {
    if (pageKey === 'chat') renderDriverList();
    if (pageKey === 'feed') renderFeed();
    if (pageKey === 'standings') renderStandings();
    if (pageKey === 'raceRankings') renderRaceRankings();
    if (pageKey === 'date') renderDatePage();
    if (pageKey === 'calendar') renderCalendar();
    if (pageKey === 'media') renderMediaPage();
    if (pageKey === 'sign') renderSignPage();
}

function switchTab(pageKey) {
    const targetPageId = PAGE_IDS[pageKey] || PAGE_IDS.chat;
    document.querySelectorAll('.page').forEach(page => page.classList.toggle('active-page', page.id === targetPageId));
    document.querySelectorAll('.tab-btn').forEach(button => button.classList.toggle('active', button.dataset.page === pageKey));
    if (pageKey !== 'chat') closeChatDetailView(true);
    renderPageByKey(pageKey);
    if (pageKey === 'chat' && typeof window.renderChatWorkspaceState === 'function') window.renderChatWorkspaceState();
}

function openHistoryTodayPage() {
    closeChatDetailView(true);
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active-page'));
    document.getElementById('historyTodayPage')?.classList.add('active-page');
    document.querySelectorAll('.tab-btn').forEach(button => button.classList.remove('active'));

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const monthDayKey = `${month}-${day}`;
    document.getElementById('historyDateSpan').innerText = `${today.getMonth() + 1}月${today.getDate()}日`;

    const events = window.getHistoryEventsByDate?.(monthDayKey) || [];
    const safeEvents = events.length
        ? events
        : [{ year: today.getFullYear(), title: '今日暂无收录事件', desc: '围场历史库还没有这一天的事件记录。' }];
    const container = document.getElementById('historyEventsList');
    if (!container) return;
    container.innerHTML = safeEvents
        .map(event => `<div class="history-card"><div class="history-year">🏁 ${escapeHtml(String(event.year || ''))}</div><div class="history-title">${escapeHtml(event.title || '')}</div><div class="history-desc">${escapeHtml(event.desc || '')}</div></div>`)
        .join('');
}

function clearCurrentDriverChatHistory() {
    if (!currentChatDriver) return;
    const confirmed = confirm(`确定要清空${currentChatDriver.type === 'group' ? '群聊' : `和 ${currentChatDriver.name}`}的聊天记录吗？`);
    if (!confirmed) return;
    delete chatHistories[currentChatDriver.id];
    saveChatHistories();
    if (currentChatDriver.type === 'group') initGroupChatHistory(currentChatDriver);
    else initDriverHistory(currentChatDriver);
    renderChatMessages(currentChatDriver.id);
    renderDriverList();
    showToast('聊天记录已清空', false);
}

function bindEvents() {
    document.querySelectorAll('.tab-btn[data-page]').forEach(button => button.addEventListener('click', () => {
        clearSidebarActive();
        switchTab(button.dataset.page);
    }));

    document.getElementById('sendChatBtn')?.addEventListener('click', async () => {
        if (!currentChatDriver) return;
        const input = document.getElementById('chatInput');
        const text = input?.value.trim() || '';
        if (!text) return;
        input.value = '';
        try {
            await sendMessageToDriver(currentChatDriver, text);
        } catch (error) {
            console.error('发送消息失败', error);
            showToast('发送消息失败，请稍后再试', true);
        }
    });

    document.getElementById('chatInput')?.addEventListener('keydown', event => {
        if (event.key !== 'Enter' || !currentChatDriver) return;
        event.preventDefault();
        document.getElementById('sendChatBtn')?.click();
    });

    document.getElementById('openChatGiftBtn')?.addEventListener('click', () => {
        if (typeof openChatGiftModal === 'function') openChatGiftModal();
    });

    document.getElementById('closeChatBtn')?.addEventListener('click', () => {
        closeChatDetailView();
        switchTab('chat');
    });

    document.getElementById('chatViewMobileBtn')?.addEventListener('click', () => applyChatViewMode('mobile'));
    document.getElementById('chatViewDesktopBtn')?.addEventListener('click', () => applyChatViewMode('desktop'));

    document.getElementById('refreshFeedBtn')?.addEventListener('click', refreshFeedWithAI);
    document.getElementById('postBtn')?.addEventListener('click', userPost);
    document.getElementById('closePostComposerBtn')?.addEventListener('click', () => {
        if (typeof closePostComposerModal === 'function') closePostComposerModal();
    });
    document.getElementById('submitPostComposerBtn')?.addEventListener('click', () => {
        if (typeof submitPostComposer === 'function') submitPostComposer();
    });
    document.getElementById('postComposerInput')?.addEventListener('input', () => {
        if (typeof updatePostComposerState === 'function') updatePostComposerState();
    });
    document.getElementById('sidebarApiBtn')?.addEventListener('click', () => { setSidebarActive('sidebarApiBtn'); openApiModal(); });
    document.getElementById('sidebarProfileBtn')?.addEventListener('click', () => { setSidebarActive('sidebarProfileBtn'); openProfileModal(); });
    document.getElementById('sidebarSaveBtn')?.addEventListener('click', () => { setSidebarActive('sidebarSaveBtn'); openSaveModal(); });
    document.getElementById('sidebarCalendarBtn')?.addEventListener('click', () => { setSidebarActive('sidebarCalendarBtn'); switchTab('calendar'); });
    document.getElementById('sidebarMediaBtn')?.addEventListener('click', () => { setSidebarActive('sidebarMediaBtn'); switchTab('media'); });
    document.getElementById('sidebarSignBtn')?.addEventListener('click', () => { setSidebarActive('sidebarSignBtn'); switchTab('sign'); });
    document.getElementById('sidebarThemeBtn')?.addEventListener('click', () => {
        setSidebarActive('sidebarThemeBtn');
        document.getElementById('themeModal').style.display = 'flex';
    });
    document.getElementById('sidebarStoreBtn')?.addEventListener('click', () => {
        setSidebarActive('sidebarStoreBtn');
        if (typeof renderPaddockStore === 'function') renderPaddockStore();
        document.getElementById('storeModal').style.display = 'flex';
    });
    document.getElementById('historyTodayBtn')?.addEventListener('click', () => {
        clearSidebarActive();
        openHistoryTodayPage();
    });
    document.getElementById('historyBackBtn')?.addEventListener('click', () => switchTab('chat'));
    document.getElementById('fetchModelsBtn')?.addEventListener('click', fetchAvailableModels);
    document.getElementById('modelName')?.addEventListener('change', updateCustomModelVisibility);
    document.getElementById('saveApiBtn')?.addEventListener('click', saveApiConfig);
    document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
    document.getElementById('saveProfileBtn')?.addEventListener('click', saveUserProfile);
    document.getElementById('closeProfileBtn')?.addEventListener('click', closeProfileModal);
    document.getElementById('profileRoleSelect')?.addEventListener('change', toggleCustomRoleInput);
    document.getElementById('closeSaveModalBtn')?.addEventListener('click', closeSaveModal);
    document.getElementById('exportDataBtn')?.addEventListener('click', exportGameData);
    document.getElementById('importFileBtn')?.addEventListener('click', () => document.getElementById('importFileInput')?.click());
    document.getElementById('importFileInput')?.addEventListener('change', event => {
        const file = event.target.files?.[0];
        if (file) importGameDataFromFile(file);
    });
    document.getElementById('chatAvatarClick')?.addEventListener('click', () => {
        if (!currentChatDriver) return;
        if (currentChatDriver.type === 'group') {
            if (typeof openEditGroupChatModal === 'function') openEditGroupChatModal(currentChatDriver.id);
            return;
        }
        showDriverProfile(currentChatDriver.id);
    });
    document.getElementById('closeDriverProfileBtn')?.addEventListener('click', closeDriverProfile);
    document.getElementById('clearChatHistoryBtn')?.addEventListener('click', clearCurrentDriverChatHistory);
    document.getElementById('announceBtn')?.addEventListener('click', showAnnouncements);
    document.getElementById('closeAnnounceBtn')?.addEventListener('click', () => {
        closeAnnounceModal();
        saveAnnouncementVersion();
    });
    document.getElementById('doSignBtn')?.addEventListener('click', performSign);
    document.getElementById('closeThemeModalBtn')?.addEventListener('click', () => {
        document.getElementById('themeModal').style.display = 'none';
        clearSidebarActive();
    });
    document.getElementById('closeStoreModalBtn')?.addEventListener('click', () => {
        document.getElementById('storeModal').style.display = 'none';
        clearSidebarActive();
    });
    document.getElementById('closeChatGiftModalBtn')?.addEventListener('click', () => {
        if (typeof closeChatGiftModal === 'function') closeChatGiftModal();
    });
    document.getElementById('closeMessageForwardBtn')?.addEventListener('click', () => {
        if (typeof closeMessageForwardModal === 'function') closeMessageForwardModal();
    });
    document.getElementById('confirmMessageForwardBtn')?.addEventListener('click', async () => {
        if (typeof confirmMessageForward === 'function') await confirmMessageForward();
    });
    document.getElementById('closeMessageEditBtn')?.addEventListener('click', () => {
        if (typeof closeMessageEditModal === 'function') closeMessageEditModal();
    });
    document.getElementById('saveMessageEditBtn')?.addEventListener('click', () => {
        if (typeof saveMessageEdit === 'function') saveMessageEdit();
    });
    document.getElementById('messageEditInput')?.addEventListener('input', () => {
        if (typeof updateMessageEditState === 'function') updateMessageEditState();
    });
    document.getElementById('closeGroupChatBtn')?.addEventListener('click', () => {
        if (typeof closeGroupChatModal === 'function') closeGroupChatModal();
    });
    document.getElementById('createGroupChatBtn')?.addEventListener('click', () => {
        if (typeof createGroupChat === 'function') createGroupChat();
    });
    document.getElementById('deleteGroupChatBtn')?.addEventListener('click', () => {
        if (typeof deleteGroupChat === 'function') deleteGroupChat();
    });
    document.getElementById('groupChatNameInput')?.addEventListener('input', () => {
        if (typeof updateGroupChatModalState === 'function') updateGroupChatModalState();
    });
    document.getElementById('groupChatAvatarBtn')?.addEventListener('click', () => {
        if (typeof openGroupChatAvatarUpload === 'function') openGroupChatAvatarUpload(editingGroupChatId);
    });
    document.getElementById('resetGroupChatAvatarBtn')?.addEventListener('click', () => {
        if (typeof resetGroupChatAvatar === 'function') resetGroupChatAvatar(editingGroupChatId);
    });
    document.getElementById('closeDiaryModalBtn')?.addEventListener('click', closeDiaryModal);
    document.getElementById('saveDiaryBtn')?.addEventListener('click', saveDiaryEntry);
    document.getElementById('generateDiaryBtn')?.addEventListener('click', generateDriverDiary);
    document.getElementById('diaryPrevBtn')?.addEventListener('click', () => shiftDiaryDate(-1));
    document.getElementById('diaryNextBtn')?.addEventListener('click', () => shiftDiaryDate(1));

    document.addEventListener('click', event => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (!target.closest('.msg-tools')) {
            if (typeof closeMessageActionMenu === 'function') closeMessageActionMenu();
        }
    });

    window.addEventListener('click', event => {
        const target = event.target;
        if (!(target instanceof HTMLElement) || !target.classList.contains('modal')) return;
        if (target.id === 'postComposerModal' && typeof closePostComposerModal === 'function') {
            closePostComposerModal();
            clearSidebarActive();
            return;
        }
        if (target.id === 'messageForwardModal' && typeof closeMessageForwardModal === 'function') {
            closeMessageForwardModal();
            return;
        }
        if (target.id === 'messageEditModal' && typeof closeMessageEditModal === 'function') {
            closeMessageEditModal();
            return;
        }
        if (target.id === 'groupChatModal' && typeof closeGroupChatModal === 'function') {
            closeGroupChatModal();
            return;
        }
        target.style.display = 'none';
        if (target.id === 'announceModal') saveAnnouncementVersion();
        clearSidebarActive();
    });
}

function initFeedPosts() {
    if (feedPosts.length) return;
    feedPosts = window.DRIVERS.slice(0, 6).map((driver, index) => ({
        id: Date.now() + index,
        name: driver.name,
        handle: driver.handle,
        avatar: driver.avatarLetter,
        content: stripChatStageDirections(driver.initialMsg),
        likes: 80 + index * 17,
        comments: [],
        timeAgo: `${index + 1} 小时前`
    }));
}

function init() {
    startStatusBarClock();
    loadTheme();
    loadChatViewMode();
    loadFavorability();
    loadAvatars();
    loadChatHistories();
    loadGroupChats();
    loadGroupChatUiState();
    loadUserProfile();
    loadApiConfig();
    loadPinnedDrivers();
    loadSignData();
    if (typeof loadGiftStoreState === 'function') loadGiftStoreState();
    loadDateMemories();
    loadDriverDiaries();
    initFeedPosts();
    initRaceSessionData();
    raceSessionData = window.raceSessionData;
    bindEvents();
    initThemeSelector();
    if (typeof renderPaddockStore === 'function') renderPaddockStore();
    if (typeof renderChatGiftPanel === 'function') renderChatGiftPanel();
    renderDriverList();
    renderFeed();
    renderStandings();
    renderDatePage();
    renderCalendar();
    renderMediaPage();
    renderRaceRankings();
    renderSignPage();
    switchTab('chat');
    if (typeof window.renderChatWorkspaceState === 'function') window.renderChatWorkspaceState();
    checkAndShowNewAnnouncements();
}

document.addEventListener('DOMContentLoaded', init);
