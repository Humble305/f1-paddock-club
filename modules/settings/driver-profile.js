(function () {
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

    function closeDriverProfile() {
        document.getElementById('driverProfileModal').style.display = 'none';
    }

    const PROFILE_TOPIC_LABELS = {
        technical: '赛车调校、轮胎反馈、模拟器细节',
        sports: '比赛攻防、赛道节奏、竞争局势',
        social: '围场互动、轻松闲聊、接梗',
        battle: '硬刚、对抗、关键时刻的判断',
        fitness: '训练、恢复、身体状态',
        lifestyle: '穿搭、音乐、旅行、生活兴致'
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
        const latestGiftLevel = gifts[0]?.preferenceLevel || (gifts[0]?.matched ? 'favorite' : (gifts[0]?.liked ? 'liked' : 'neutral'));
        if (latestGiftLevel === 'favorite') tags.push('刚收过你认真挑的礼物');
        else if (latestGiftLevel === 'liked') tags.push('最近收过一份挺喜欢的礼物');
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

    function showDriverProfile(driverId) {
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
    }

    window.getDriverRecentFeedPosts = getDriverRecentFeedPosts;
    window.getDriverGiftHistory = getDriverGiftHistory;
    window.getDriverProfileMilestones = getDriverProfileMilestones;
    window.getDriverStatusTags = getDriverStatusTags;
    window.buildDriverProfileViewModel = buildDriverProfileViewModel;
    window.showDriverProfile = showDriverProfile;
    window.closeDriverProfile = closeDriverProfile;
})();
