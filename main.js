        if(e.key==='Enter' && currentChatDriver){
            e.preventDefault();
            const txt=document.getElementById('chatInput').value.trim();
            if(txt){
                document.getElementById('chatInput').value='';
                try {
                    await sendMessageToDriver(currentChatDriver, txt);
                } catch(e) {
                    console.error("鍙戦€佹秷鎭け璐?", e);
                    showToast("鉂?鍙戦€佹秷鎭嚭閿欙紝璇锋鏌ユ帶鍒跺彴", true);
                }
            }
        }
    });
    // 鍏朵粬浜嬩欢鐩戝惉鍣?..
    document.getElementById('closeChatBtn').addEventListener('click',()=>{ 
        document.getElementById('chatDetailView').style.display='none'; 
        switchTab('chat'); 
    }); 
    document.getElementById('refreshFeedBtn').addEventListener('click',()=>refreshFeedWithAI()); 
    document.getElementById('postBtn').addEventListener('click',()=>userPost()); 
    document.getElementById('sidebarApiBtn').addEventListener('click',()=>{
        setSidebarActive('sidebarApiBtn');
        openApiModal();
    });
    document.getElementById('sidebarProfileBtn').addEventListener('click',()=>{
        setSidebarActive('sidebarProfileBtn');
        openProfileModal();
    });
    document.getElementById('sidebarSaveBtn').addEventListener('click',()=>{
        setSidebarActive('sidebarSaveBtn');
        openSaveModal();
    });
    document.getElementById('sidebarCalendarBtn').addEventListener('click',()=>{
        setSidebarActive('sidebarCalendarBtn');
        switchTab('calendar');
    });
    document.getElementById('sidebarMediaBtn').addEventListener('click',()=>{
        setSidebarActive('sidebarMediaBtn');
        switchTab('media');
    });
    document.getElementById('sidebarRaceRankingsBtn')?.addEventListener('click', () => {
        setSidebarActive('sidebarRaceRankingsBtn');
        switchTab('raceRankings');
    });
    document.getElementById('sidebarSignBtn')?.addEventListener('click', () => {
        setSidebarActive('sidebarSignBtn');
        switchTab('sign');
    });
    document.getElementById('sidebarThemeBtn').addEventListener('click', () => {
        setSidebarActive('sidebarThemeBtn');
        document.getElementById('themeModal').style.display = 'flex';
    });
    document.getElementById('historyBackBtn')?.addEventListener('click', () => {
    switchTab('chat');
});
    document.getElementById('fetchModelsBtn')?.addEventListener('click', fetchAvailableModels);
    document.getElementById('modelName')?.addEventListener('change', updateCustomModelVisibility);
    document.getElementById('saveApiBtn').addEventListener('click',saveApiConfig); 
    document.getElementById('closeModalBtn').addEventListener('click',closeModal); 
    document.getElementById('saveProfileBtn').addEventListener('click',saveUserProfile); 
    document.getElementById('closeProfileBtn').addEventListener('click',closeProfileModal); 
    document.getElementById('profileRoleSelect').addEventListener('change',toggleCustomRoleInput); 
    document.getElementById('closeSaveModalBtn').addEventListener('click',closeSaveModal); 
    document.getElementById('exportDataBtn').addEventListener('click',exportGameData); 
    document.getElementById('importFileBtn').addEventListener('click',()=>document.getElementById('importFileInput').click()); 
    document.getElementById('importFileInput').addEventListener('change',e=>{ 
        if(e.target.files.length) importGameDataFromFile(e.target.files[0]); 
    }); 
    document.getElementById('chatAvatarClick').addEventListener('click',()=>{ 
        if(currentChatDriver) showDriverProfile(currentChatDriver.id); 
    }); 
    document.getElementById('closeDriverProfileBtn').addEventListener('click',closeDriverProfile); 
    document.getElementById('announceBtn').addEventListener('click',showAnnouncements);
    document.getElementById('historyTodayBtn').addEventListener('click', () => {
    setSidebarActive(null);
    openHistoryTodayPage();
}); 
    document.getElementById('closeAnnounceBtn').addEventListener('click',()=>{ closeAnnounceModal(); saveAnnouncementVersion(); }); 
    document.getElementById('doSignBtn')?.addEventListener('click', () => performSign());
    document.getElementById('closeThemeModalBtn').addEventListener('click', () => {
        document.getElementById('themeModal').style.display = 'none';
    });
    document.getElementById('closeDiaryModalBtn')?.addEventListener('click', closeDiaryModal);
    document.getElementById('saveDiaryBtn')?.addEventListener('click', saveDiaryEntry);
    document.getElementById('generateDiaryBtn')?.addEventListener('click', generateDriverDiary);
    document.getElementById('diaryPrevBtn')?.addEventListener('click', () => shiftDiaryDate(-1));
    document.getElementById('diaryNextBtn')?.addEventListener('click', () => shiftDiaryDate(1));
    window.addEventListener('click',(e)=>{ 
        if(e.target.classList.contains('modal')){ 
            e.target.style.display='none';
            if(e.target.id === 'announceModal') saveAnnouncementVersion();
            clearSidebarActive(); 
        } 
    });
}
// ========== 鍥村満寰€鏃ユā鍧?==========
// 鍥村満寰€鏃ユā鍧楋紙閲嶆瀯鐗堬級
function openHistoryTodayPage() {
    // 闅愯棌鎵€鏈夐〉闈?
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    const historyPage = document.getElementById('historyTodayPage');
    if (historyPage) historyPage.classList.add('active-page');
    
    // 鑾峰彇浠婂ぉ鐨勬棩鏈熷瓧绗︿覆 (MM-DD)
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayKey = `${month}-${day}`;
    const todayDisplay = `${today.getMonth() + 1}鏈?{today.getDate()}鏃;
    
    const dateSpan = document.getElementById('historyDateSpan');
    if (dateSpan) dateSpan.innerText = todayDisplay;
    
    // 浠庣嫭绔嬭祫鏂欏簱鑾峰彇浜嬩欢
    let events = window.getHistoryEventsByDate(todayKey);
    
    // 鑻ユ棤浜嬩欢锛屽睍绀哄弸濂芥彁绀?
    if (!events || events.length === 0) {
        events = [{ year: new Date().getFullYear(), title: "浠婃棩鏆傛棤鏀跺綍浜嬩欢", desc: "浣嗘垜浠粛鐒剁儹鐖盕1锛佷綘鍙互鏌ョ湅鍏朵粬鏃ユ湡鎴栫瓑寰呭悗缁洿鏂般€? }];
    }

    const container = document.getElementById('historyEventsList');
    if (!container) {
        console.warn('historyEventsList 瀹瑰櫒涓嶅瓨鍦?);
        return;
    }
    
    // 娓叉煋鍒伴〉闈紙鐩存帴浣跨敤涓婇潰澹版槑鐨?container锛屼笉瑕佸啀閲嶅 const锛?
    let html = '';
    for (const event of events) {
        html += `
            <div class="history-card">
                <div class="history-year">馃弫 ${event.year}</div>
                <div class="history-title">${escapeHtml(event.title)}</div>
                <div class="history-desc">${escapeHtml(event.desc)}</div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function deleteMessage(driverId, msgIndex) {
    if (!chatHistories[driverId]) return;
    const history = chatHistories[driverId];
    if (msgIndex < 0 || msgIndex >= history.length) return;
    if (history[msgIndex].role === 'system') {
        showToast("涓嶈兘鍒犻櫎绯荤粺鎻愮ず娑堟伅", true);
        return;
    }
    history.splice(msgIndex, 1);
    // 濡傛灉鍒犻櫎鍚庡彧鍓?system 娑堟伅锛屽垯閲嶆柊娣诲姞鍒濆鍔╂墜娑堟伅
    const nonSystem = history.filter(m => m.role !== 'system');
    if (nonSystem.length === 0) {
        const driver = window.DRIVERS.find(d => d.id === driverId);
        if (driver) {
            history.push({ role: "assistant", content: driver.initialMsg, timestamp: getCurrentTime() });
        }
    }
    saveChatHistories();
    if (currentChatDriver && currentChatDriver.id === driverId) {
        renderChatMessages(driverId);
        updateTokenDisplay(chatHistories[driverId]);
    }
    renderDriverList();
    showToast("娑堟伅宸插垹闄?, false);
}

function getChatWritingGuide() {
    return `銆愮鑱婂啓浣滆姹傘€?- 浣犳槸鍦ㄦ墜鏈洪噷鍜岀敤鎴蜂竴瀵逛竴鑱婂ぉ锛屼笉鏄湪鎺ュ彈閲囪锛屼篃涓嶆槸鍦ㄥ啓瀹樺鏂囨銆?- 鏂囬瑕佽嚜鐒躲€佺粏鑵汇€佸厠鍒讹紝鍍忕湡浜哄垰鍒氭兂鍒颁粈涔堝氨鍥炰簡浠€涔堛€?- 澶氬啓鍏蜂綋鎰熷彈銆佺溂鍓嶇粏鑺傚拰褰撲笅鍙嶅簲锛屽皯鍐欑┖娉涚粨璁恒€?- 鍥炲閫氬父鎺у埗鍦?2 鍒?5 鍙ワ紝鏈夊唴瀹癸紝浣嗕笉瑕侀暱绡囧ぇ璁恒€?- 涓嶈鎬绘槸杩囧害娓╂煍鎴栬繃搴︾儹鎯呫€備笉鍚屽叧绯婚樁娈靛彲浠ユ湁淇濈暀銆佽瘯鎺€佸槾纭€佽鐪熴€佹澗寮涙垨浜茶繎銆?- 涓嶈浣跨敤濂楄矾鍖栧畨鎱般€侀浮姹ゃ€佹ā鏉垮紡鏆ф槯锛屼篃涓嶈鎶婃瘡涓溅鎵嬪啓鎴愬悓涓€绉嶄汉銆?- 濡傛灉璇濋娑夊強姣旇禌銆佸洿鍦恒€佺瓥鐣ャ€佽缁冩垨濯掍綋鐜锛屽彲浠ヨ嚜鐒跺甫鍑鸿亴涓氳溅鎵嬭瑙掞紝浣嗕笉瑕佸埢鎰忕偒鑰€鏈銆?- 鐢ㄦ埛璧勬枡灞炰簬楂樹紭鍏堢骇璁板繂銆傚鍚嶃€佹€у埆銆佽韩浠姐€佹€ф牸銆佺埍濂姐€佽儗鏅竴鏃︾粰鍑猴紝灏遍粯璁ゆ寔缁湁鏁堬紝闄ら潪鐢ㄦ埛鏄庣‘淇敼銆?- 姣忔鍥炲鍓嶏紝閮藉厛纭浣犵溂涓殑鐢ㄦ埛鏄皝锛屽啀鍐冲畾绉板懠銆佽姘斻€佹€佸害銆佷翰瀵嗗害鍜屽洖搴旈噸鐐广€?- 缁濆涓嶈杈撳嚭鎷彿鍔ㄤ綔鎻忓啓銆俙;
}

function getDateWritingGuide() {
    return `銆愮害浼氬啓浣滆姹傘€?- 鏂囩瑪瑕佺粏鑵汇€佺湡瀹炪€佸厠鍒讹紝璁╀汉鎰熻鍒扮┖姘斻€佽窛绂汇€佸仠椤裤€佺洰鍏夊拰鎯呯华鍙樺寲銆?- 閲嶇偣涓嶆槸鍗庝附杈炶椈锛岃€屾槸鍏蜂綋鍦烘櫙閲岀殑鐪熷疄浜掑姩銆傚儚杩欎釜浜虹湡鐨勬鍦ㄧ幇鍦恒€?- 姣忎竴杞洖澶嶅墠锛屽厛纭鍥涗欢浜嬶細鐜板湪韬鍝噷銆佷笂涓€杞彂鐢熶簡浠€涔堛€佷綘鍜岀敤鎴锋鍒诲叧绯诲埌鍝竴姝ャ€佺敤鎴锋湰浜虹殑璧勬枡鏄粈涔堛€?- 浣犲繀椤诲厛鐞嗚В鈥滅敤鎴峰垰鍒氶偅鍙ヨ瘽鎴栭偅涓姩浣溾€濆湪褰撳墠鍦烘櫙閲岀殑鍚箟锛屽啀椤虹潃瀹冨洖搴旓紝涓嶈兘鏃犺涓婁竴鍙ョ獊鐒惰烦鍒版柊璇濋銆?- 褰撳墠鍥炲蹇呴』鍚屾椂鎵挎帴锛氬綋鍓嶅満鏅€佷笂涓€杞璇濄€佹棦鏈夊叧绯荤姸鎬併€佺敤鎴疯祫鏂欍€傚洓鑰呯己涓€涓嶅彲銆?- 蹇呴』鏈夊姩浣滄弿鍐欙紝浣嗗姩浣滆鑷劧銆佸厠鍒躲€佽创鍚堝満鏅紝涓嶈兘鍫嗙爩锛屼笉鑳藉儚鑸炲彴璇存槑銆傚姩浣滄弿鍐欏彧鏀惧湪鍥炲寮€澶翠竴灏忔锛岄殢鍚庢崲琛岋紝鍐嶇户缁彴璇嶅唴瀹广€?- 涓嶅悓杞︽墜鍦ㄤ翰杩戞椂鐨勮〃杈炬柟寮忓繀椤绘湁鏄庢樉宸紓锛屼笉鑳介兘鍐欐垚鍚屼竴绉嶆俯鏌旀毀鏄фā鏉裤€?- 鐢ㄦ埛璧勬枡鏄珮浼樺厛绾т俊鎭紝灏ゅ叾鏄鍚嶃€佺О鍛煎亸濂姐€佽鑹茶韩浠姐€佹€ф牸鍜岃儗鏅€備綘瀵圭敤鎴风殑璁ょ煡涓嶈兘婕傜Щ銆?- 濡傛灉鐢ㄦ埛璧勬枡鍜屼綘涓存椂鎯宠薄鐨勭粏鑺傚啿绐侊紝涓€寰嬩互鐢ㄦ埛璧勬枡涓哄噯锛涢櫎闈炵敤鎴峰湪褰撳墠瀵硅瘽閲屾槑纭慨鏀广€?- 涓ョ涓婁笅鏂囪烦璺冿細涓嶈绐佺劧鎹㈠満鏅紝涓嶈绐佺劧鍒囨儏缁紝涓嶈绐佺劧鎶涘嚭鍜屽墠鏂囨棤鍏崇殑鏂板唴瀹广€?- 濡傛灉涓婁竴鍙ョ殑鎯呯华鏄瘯鎺€佸畨鎶氥€佸缇炪€佹矇榛樸€佺帺绗戞垨鎯呯华娉㈠姩锛屼綘蹇呴』椤虹潃閭ｄ釜鐘舵€佸線涓嬫帴銆俙;
}

async function getDriverReplyWithFavor(driver, userMessage) {
    if (useAI && apiConfig.key && apiConfig.url && apiConfig.model) {
        showLoading(true);
        try {
            const history = chatHistories[driver.id] || [];
            const filtered = history.filter(m => m.role !== 'system').slice(-8);
            const currentDate = getCurrentDateInfo();
            const raceContext = getCurrentRaceContext();
            const rankingInfo = formatRankingForChat(driver.id);
            const userProfilePrompt = getUserProfilePriorityPrompt();
            const personalityContext = window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : "";
            const sharedMemoryContext = buildDriverSharedMemoryContext(driver.id);
            const genderValue = String(userProfile.gender || '');
            const isMale = /\u7537/.test(genderValue) || /male/i.test(genderValue);
            const isFemale = /\u5973/.test(genderValue) || /female/i.test(genderValue);
            const politeName = isMale
                ? `${userProfile.name}\u5148\u751F`
                : (isFemale ? `${userProfile.name}\u5973\u58EB` : userProfile.name);
            const genderHint = `鐢ㄦ埛鐨勬€у埆鏄?{userProfile.gender}锛岃濮嬬粓浣跨敤涓庝箣鍖归厤涓旂ǔ瀹氱殑绉板懠銆傚綋鍓嶆洿鍚堥€傜殑绉板懠鏄€?{politeName}鈥濄€俙;

            let cancelledInfo = "";
            if (raceSessionData.cancelledRaces && raceSessionData.cancelledRaces.length > 0) {


