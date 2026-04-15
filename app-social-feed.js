// app-social-feed.js
// 围场动态、媒体、积分与排名视图

async function generateAIPost() {
    if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) return null;
    const driver = window.DRIVERS[Math.floor(Math.random() * window.DRIVERS.length)];
    const systemPrompt = `你是 F1 车手 ${driver.name}，请写一条适合围场动态流的简短近况，长度控制在 40-90 字。语气符合本人，不要带括号动作。`;
    try {
        const response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiConfig.key}` },
            body: JSON.stringify({ model: apiConfig.model, messages: [{ role: 'user', content: systemPrompt }], temperature: 0.9, max_tokens: 120 })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const content = payload?.choices?.[0]?.message?.content?.trim();
        if (!content) throw new Error('API 返回空内容');
        return {
            id: Date.now(),
            name: driver.name,
            handle: driver.handle,
            avatar: driver.avatarLetter,
            content,
            likes: Math.floor(Math.random() * 800) + 100,
            comments: [],
            timeAgo: '刚刚'
        };
    } catch (error) {
        handleApiError(error, '围场动态生成');
        return null;
    }
}

async function userPost() {
    const content = prompt('想发一条什么动态？');
    if (!content) return;
    feedPosts.unshift({
        id: Date.now(),
        name: userProfile.name,
        handle: 'you',
        avatar: '??',
        content,
        likes: 0,
        comments: [],
        timeAgo: '刚刚'
    });
    renderFeed();
    showToast('动态已发布', false);
}

async function commentOnPost(post, commentText) {
    if (!post.comments) post.comments = [];
    post.comments.push({ user: userProfile.name, text: commentText, isDriverReply: false });
    const driver = window.DRIVERS.find(item => item.name === post.name);
    if (driver) {
        const reply = await getDriverReplyWithFavor(driver, commentText);
        post.comments.push({ user: driver.name, text: reply.reply, isDriverReply: true });
    }
    renderFeed();
}

function renderFeed() {
    const container = document.getElementById('feedContainer');
    if (!container) return;
    container.innerHTML = '';
    feedPosts.forEach((post, index) => {
        const driver = window.DRIVERS.find(item => item.name === post.name);
        const avatarBg = driver ? getDriverAvatarStyle(driver.id) : null;
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
            <div class="post-header">
                <div class="post-avatar" style="${avatarBg ? `background-image:${avatarBg};background-size:cover;` : ''}">${avatarBg ? '' : (post.avatar || '??')}</div>
                <div>
                    <div class="post-user">${escapeHtml(post.name)}</div>
                    <div class="post-handle">@${escapeHtml(post.handle)}</div>
                </div>
                <div class="post-time">${escapeHtml(post.timeAgo || '刚刚')}</div>
            </div>
            <div class="post-content">${escapeHtml(post.content)}</div>
            <div class="post-stats">
                <button class="like-btn" data-idx="${index}">?? ${post.likes || 0}</button>
                <button class="comment-btn" data-idx="${index}">?? ${(post.comments || []).length}</button>
            </div>
            <div class="comment-section" id="commentSection_${index}"></div>
        `;
        container.appendChild(card);
        const commentSection = document.getElementById(`commentSection_${index}`);
        (post.comments || []).slice().reverse().forEach(comment => {
            const line = document.createElement('div');
            line.className = 'comment-item';
            line.innerHTML = `<span class="comment-driver">?? ${escapeHtml(comment.user)}</span><span class="comment-text">：${escapeHtml(comment.text)}</span>${comment.isDriverReply ? '<span class="reply-badge"> 车手回复</span>' : ''}`;
            commentSection.appendChild(line);
        });
        const inputWrap = document.createElement('div');
        inputWrap.style.marginTop = '8px';
        inputWrap.style.display = 'flex';
        inputWrap.style.gap = '8px';
        inputWrap.innerHTML = `<input type="text" id="commentInput_${index}" class="chat-input" style="flex:1; padding:6px 12px;" placeholder="写评论..."><button id="submitComment_${index}" class="send-msg-btn" style="padding:6px 12px;">回复</button>`;
        commentSection.appendChild(inputWrap);
    });
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', () => {
            const index = Number(button.dataset.idx);
            if (feedPosts[index]) feedPosts[index].likes = (feedPosts[index].likes || 0) + 1;
            renderFeed();
        });
    });
    document.querySelectorAll('[id^="submitComment_"]').forEach(button => {
        button.addEventListener('click', async () => {
            const index = Number(button.id.split('_')[1]);
            const input = document.getElementById(`commentInput_${index}`);
            const text = input.value.trim();
            if (!text) return;
            input.value = '';
            await commentOnPost(feedPosts[index], text);
        });
    });
}

async function refreshFeedWithAI() {
    showLoading(true);
    const generated = await generateAIPost();
    if (generated) feedPosts.unshift(generated);
    renderFeed();
    showLoading(false);
}

function renderStandings() {
    const container = document.getElementById('standingsContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="standings-section">
            <div class="section-title">?? 车队积分榜</div>
            <table class="standings-table">
                <thead><tr><th>Pos</th><th>车队</th><th>积分</th></tr></thead>
                <tbody>${window.teamStandings.map((team, index) => `<tr><td class="pos">${index + 1}</td><td style="color:${team.color}">${team.name}</td><td class="points">${team.points}</td></tr>`).join('')}</tbody>
            </table>
        </div>
        <div class="standings-section">
            <div class="section-title">??? 车手积分榜</div>
            <table class="standings-table">
                <thead><tr><th>Pos</th><th>车手</th><th>车队</th><th>积分</th></tr></thead>
                <tbody>${window.driverStandings.map((driver, index) => `<tr><td class="pos">${index + 1}</td><td>${driver.name}</td><td style="font-size:0.7rem">${driver.team}</td><td class="points">${driver.points}</td></tr>`).join('')}</tbody>
            </table>
        </div>
    `;
}

function renderMediaPage() {
    const container = document.getElementById('mediaContainer');
    if (!container) return;
    const sorted = sortMediaNewsByTime(window.mediaNewsItems || []);
    const cards = sorted.map(news => `
        <div class="media-news-card">
            <div class="media-news-header">
                <div class="media-source-icon">${news.sourceIcon}</div>
                <div class="media-source-name">${escapeHtml(news.source)}</div>
                <div class="media-news-time">${formatMediaTime(news.timestamp)}</div>
            </div>
            <div class="media-news-title">${escapeHtml(news.title)}</div>
            <div class="media-news-summary">${escapeHtml(news.summary)}</div>
            <a href="${news.url}" target="_blank" class="media-read-more">阅读全文 →</a>
        </div>
    `).join('');
    container.innerHTML = `<button id="refreshMediaBtn" class="refresh-media">?? 刷新最新资讯</button>${cards}`;
    document.getElementById('refreshMediaBtn')?.addEventListener('click', () => {
        renderMediaPage();
        showToast('资讯已刷新', false);
    });
}

function renderRaceRankings() {
    const container = document.getElementById('raceRankingsContainer');
    if (!container) return;
    const standings = window.raceSessionData?.seasonStandings?.drivers || [];
    if (!standings.length) {
        container.innerHTML = '<div class="rankings-section"><div class="section-title">?? 当前暂无排名数据</div></div>';
        return;
    }
    container.innerHTML = `
        <div class="rankings-section">
            <div class="section-title">?? 当前赛季排名</div>
            <table class="rankings-table">
                <thead><tr><th>Pos</th><th>车手</th><th>车队</th><th>积分</th></tr></thead>
                <tbody>${standings.map((item, index) => `<tr><td class="rank">${index + 1}</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.team)}</td><td class="points">${item.points}</td></tr>`).join('')}</tbody>
            </table>
        </div>
    `;
}
