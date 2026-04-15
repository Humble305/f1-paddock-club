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
    if (!detail) return;
    if (!forceHide && typeof isDesktopChatView === 'function' && isDesktopChatView()) {
        currentChatDriver = null;
        if (typeof window.renderChatWorkspaceState === 'function') window.renderChatWorkspaceState();
        if (typeof renderDriverList === 'function') renderDriverList();
        return;
    }
    detail.classList.remove('desktop-visible');
    detail.style.removeProperty('display');
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
    const safeEvents = events.length ? events : [{ year: today.getFullYear(), title: '今日暂无收录事件', desc: '围场历史库还没有这一天的事件记录。' }];
    const container = document.getElementById('historyEventsList');
    if (!container) return;
    container.innerHTML = safeEvents.map(event => `<div class="history-card"><div class="history-year">🏁 ${escapeHtml(String(event.year || ''))}</div><div class="history-title">${escapeHtml(event.title || '')}</div><div class="history-desc">${escapeHtml(event.desc || '')}</div></div>`).join('');
}

function clearCurrentDriverChatHistory() {
    if (!currentChatDriver) return;
    const confirmed = confirm(`确定要清空和 ${currentChatDriver.name} 的聊天记录吗？`);
    if (!confirmed) return;
    delete chatHistories[currentChatDriver.id];
    saveChatHistories();
    initDriverHistory(currentChatDriver);
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

    document.getElementById('closeChatBtn')?.addEventListener('click', () => {
        closeChatDetailView();
        switchTab('chat');
    });

    document.getElementById('chatViewMobileBtn')?.addEventListener('click', () => applyChatViewMode('mobile'));
    document.getElementById('chatViewDesktopBtn')?.addEventListener('click', () => applyChatViewMode('desktop'));

    document.getElementById('refreshFeedBtn')?.addEventListener('click', refreshFeedWithAI);
    document.getElementById('postBtn')?.addEventListener('click', userPost);
    document.getElementById('sidebarApiBtn')?.addEventListener('click', () => { setSidebarActive('sidebarApiBtn'); openApiModal(); });
    document.getElementById('sidebarProfileBtn')?.addEventListener('click', () => { setSidebarActive('sidebarProfileBtn'); openProfileModal(); });
    document.getElementById('sidebarSaveBtn')?.addEventListener('click', () => { setSidebarActive('sidebarSaveBtn'); openSaveModal(); });
    document.getElementById('sidebarCalendarBtn')?.addEventListener('click', () => { setSidebarActive('sidebarCalendarBtn'); switchTab('calendar'); });
    document.getElementById('sidebarMediaBtn')?.addEventListener('click', () => { setSidebarActive('sidebarMediaBtn'); switchTab('media'); });
    document.getElementById('sidebarSignBtn')?.addEventListener('click', () => { setSidebarActive('sidebarSignBtn'); switchTab('sign'); });
    document.getElementById('sidebarThemeBtn')?.addEventListener('click', () => { setSidebarActive('sidebarThemeBtn'); document.getElementById('themeModal').style.display = 'flex'; });
    document.getElementById('historyTodayBtn')?.addEventListener('click', () => { clearSidebarActive(); openHistoryTodayPage(); });
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
    document.getElementById('chatAvatarClick')?.addEventListener('click', () => { if (currentChatDriver) showDriverProfile(currentChatDriver.id); });
    document.getElementById('closeDriverProfileBtn')?.addEventListener('click', closeDriverProfile);
    document.getElementById('clearChatHistoryBtn')?.addEventListener('click', clearCurrentDriverChatHistory);
    document.getElementById('announceBtn')?.addEventListener('click', showAnnouncements);
    document.getElementById('closeAnnounceBtn')?.addEventListener('click', () => { closeAnnounceModal(); saveAnnouncementVersion(); });
    document.getElementById('doSignBtn')?.addEventListener('click', performSign);
    document.getElementById('closeThemeModalBtn')?.addEventListener('click', () => {
        document.getElementById('themeModal').style.display = 'none';
        clearSidebarActive();
    });
    document.getElementById('closeDiaryModalBtn')?.addEventListener('click', closeDiaryModal);
    document.getElementById('saveDiaryBtn')?.addEventListener('click', saveDiaryEntry);
    document.getElementById('generateDiaryBtn')?.addEventListener('click', generateDriverDiary);
    document.getElementById('diaryPrevBtn')?.addEventListener('click', () => shiftDiaryDate(-1));
    document.getElementById('diaryNextBtn')?.addEventListener('click', () => shiftDiaryDate(1));

    window.addEventListener('click', event => {
        const target = event.target;
        if (!(target instanceof HTMLElement) || !target.classList.contains('modal')) return;
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
    loadUserProfile();
    loadApiConfig();
    loadPinnedDrivers();
    loadSignData();
    loadDateMemories();
    loadDriverDiaries();
    initFeedPosts();
    initRaceSessionData();
    raceSessionData = window.raceSessionData;
    bindEvents();
    initThemeSelector();
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
