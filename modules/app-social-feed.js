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
                <div class="post-avatar" style="${avatarBg ? `background-image:${avatarBg};background-size:cover;` : ''}">${avatarBg ? '' : (post.avatar || '我')}</div>
                <div>
                    <div class="post-user">${escapeHtml(post.name)}</div>
                    <div class="post-handle">@${escapeHtml(post.handle)}</div>
                </div>
                <div class="post-time">${escapeHtml(post.timeAgo || '刚刚')}</div>
            </div>
            <div class="post-content">${escapeHtml(post.content)}</div>
            <div class="post-stats">
                <button class="like-btn" data-idx="${index}">♥ ${post.likes || 0}</button>
                <button class="comment-btn" data-idx="${index}">评论 ${(post.comments || []).length}</button>
            </div>
            <div class="comment-section" id="commentSection_${index}"></div>
        `;
        container.appendChild(card);
        const commentSection = document.getElementById(`commentSection_${index}`);
        (post.comments || []).slice().reverse().forEach(comment => {
            const line = document.createElement('div');
            line.className = 'comment-item';
            line.innerHTML = `<span class="comment-driver">${escapeHtml(comment.user)}</span><span class="comment-text">：${escapeHtml(comment.text)}</span>${comment.isDriverReply ? '<span class="reply-badge"> 车手回复</span>' : ''}`;
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

function getPostComposerElements() {
    return {
        modal: document.getElementById('postComposerModal'),
        input: document.getElementById('postComposerInput'),
        count: document.getElementById('postComposerCount'),
        submitBtn: document.getElementById('submitPostComposerBtn')
    };
}

function updatePostComposerState() {
    const { input, count, submitBtn } = getPostComposerElements();
    if (!input || !count || !submitBtn) return;
    const rawValue = input.value || '';
    const trimmedValue = rawValue.trim();
    const length = rawValue.length;
    const isTooLong = length > 140;
    count.innerText = `${length}/140`;
    count.classList.toggle('is-over', isTooLong);
    submitBtn.disabled = !trimmedValue || isTooLong;
}

function closePostComposerModal() {
    const { modal, input, count, submitBtn } = getPostComposerElements();
    if (modal) modal.style.display = 'none';
    if (input) input.value = '';
    if (count) {
        count.innerText = '0/140';
        count.classList.remove('is-over');
    }
    if (submitBtn) submitBtn.disabled = true;
}

function openPostComposerModal() {
    const { modal, input } = getPostComposerElements();
    if (!modal || !input) return;
    modal.style.display = 'flex';
    updatePostComposerState();
    window.setTimeout(() => input.focus(), 40);
}

function submitPostComposer() {
    const { input } = getPostComposerElements();
    if (!input) return;
    const content = input.value.trim();
    if (!content) {
        updatePostComposerState();
        return;
    }
    if (content.length > 140) {
        showToast('动态最多 140 字', true);
        updatePostComposerState();
        return;
    }
    feedPosts.unshift({
        id: Date.now(),
        name: userProfile.name,
        handle: 'you',
        avatar: '我',
        content,
        likes: 0,
        comments: [],
        timeAgo: '刚刚'
    });
    closePostComposerModal();
    renderFeed();
    showToast('动态已发布', false);
}

function userPost() {
    openPostComposerModal();
}

window.openPostComposerModal = openPostComposerModal;
window.closePostComposerModal = closePostComposerModal;
window.submitPostComposer = submitPostComposer;
window.updatePostComposerState = updatePostComposerState;

function renderStandings() {
    const container = document.getElementById('standingsContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="standings-section">
            <div class="section-title">车队积分榜</div>
            <table class="standings-table">
                <thead><tr><th>Pos</th><th>车队</th><th>积分</th></tr></thead>
                <tbody>${window.teamStandings.map((team, index) => `<tr><td class="pos">${index + 1}</td><td style="color:${team.color}">${team.name}</td><td class="points">${team.points}</td></tr>`).join('')}</tbody>
            </table>
        </div>
        <div class="standings-section">
            <div class="section-title">车手积分榜</div>
            <table class="standings-table">
                <thead><tr><th>Pos</th><th>车手</th><th>车队</th><th>积分</th></tr></thead>
                <tbody>${window.driverStandings.map((driver, index) => `<tr><td class="pos">${index + 1}</td><td>${driver.name}</td><td style="font-size:0.7rem">${driver.team}</td><td class="points">${driver.points}</td></tr>`).join('')}</tbody>
            </table>
        </div>
    `;
}

const MEDIA_NEWS_FEEDS = [
    { source: 'Crash.net', sourceIcon: 'CR', feedUrl: 'https://www.crash.net/rss/f1', kind: 'rss' },
    { source: 'Motorsport.com', sourceIcon: 'MS', feedUrl: 'https://www.motorsport.com/rss/f1/news/', kind: 'rss' },
    { source: 'Google News F1', sourceIcon: 'GN', feedUrl: 'https://news.google.com/rss/search?q=Formula+1+OR+F1&hl=en-US&gl=US&ceid=US:en', kind: 'rss' },
    { source: 'Google News 中文F1', sourceIcon: '中', feedUrl: 'https://news.google.com/rss/search?q=F1+%E8%B5%9B%E8%BD%A6+OR+F1+%E5%A4%A7%E5%A5%96%E8%B5%9B&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', kind: 'rss' },
    { source: 'Google News 国内报道', sourceIcon: 'CN', feedUrl: 'https://news.google.com/rss/search?q=F1+(site:thepaper.cn+OR+site:xinhuanet.com+OR+site:sina.com.cn+OR+site:163.com+OR+site:people.com.cn)&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', kind: 'rss' }
];

const MEDIA_NEWS_CACHE_KEY = 'f1_media_news_cache';
const MEDIA_NEWS_CACHE_TIME_KEY = 'f1_media_news_cache_time';
const MEDIA_NEWS_STATUS_KEY = 'f1_media_news_status';
const MEDIA_NEWS_FILTER_KEY = 'f1_media_news_filter';
const MEDIA_NEWS_CACHE_TTL = 30 * 60 * 1000;

let mediaNewsRefreshPromise = null;
let hasAttemptedInitialMediaRefresh = false;
let mediaNewsStatus = {
    mode: 'fallback',
    label: '静态资讯',
    detail: '当前显示内置资讯',
    updatedAt: null,
    sourceCount: 0
};
let mediaNewsFilter = { region: 'all', keyword: 'all' };

function decodeHtmlEntities(text = '') {
    const parser = new DOMParser();
    return parser.parseFromString(String(text), 'text/html').documentElement.textContent || '';
}

function stripHtmlTags(text = '') {
    return String(text)
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeMediaText(text = '') {
    return decodeHtmlEntities(stripHtmlTags(text))
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function getMediaKeywordOptions() {
    const base = [
        { id: 'all', label: '全部关键词', patterns: [] },
        { id: 'ferrari', label: '法拉利', patterns: ['ferrari', '法拉利', 'leclerc', 'hamilton', 'charles', 'lewis'] },
        { id: 'verstappen', label: '维斯塔潘', patterns: ['verstappen', 'max', '维斯塔潘'] },
        { id: 'hamilton', label: '汉密尔顿', patterns: ['hamilton', 'lewis', '汉密尔顿'] }
    ];
    const dynamic = (window.DRIVERS || []).map(driver => ({
        id: driver.id,
        label: driver.name,
        patterns: [String(driver.name || '').toLowerCase(), String(driver.team || '').toLowerCase(), ...String(driver.name || '').toLowerCase().split(/\s+/)]
    }));
    const seen = new Set();
    return [...base, ...dynamic].filter(option => {
        if (seen.has(option.id)) return false;
        seen.add(option.id);
        return true;
    });
}

function detectMediaRegion(news) {
    const source = String(news?.source || '');
    const url = String(news?.url || '');
    if (/thepaper\.cn|xinhuanet\.com|sina\.com\.cn|163\.com|people\.com\.cn/i.test(url)) return 'cn';
    if (/Google News 中文F1|Google News 国内报道|中文|国内|澎湃|新华社|新浪|网易|人民网/u.test(source)) return 'cn';
    return 'en';
}

function getMediaSourceTone(news) {
    const source = String(news?.source || '');
    if (/google news/i.test(source)) return 'agg';
    return detectMediaRegion(news);
}

function getMediaSourceToneLabel(news) {
    const tone = getMediaSourceTone(news);
    if (tone === 'cn') return '国内';
    if (tone === 'agg') return '聚合';
    return '英文';
}

function getCurrentMediaKeywordOption() {
    return getMediaKeywordOptions().find(option => option.id === mediaNewsFilter.keyword) || getMediaKeywordOptions()[0];
}

function matchesMediaKeyword(news, option) {
    if (!option || option.id === 'all') return true;
    const haystack = `${news.title || ''} ${news.summary || ''} ${news.source || ''}`.toLowerCase();
    return option.patterns.some(pattern => haystack.includes(String(pattern || '').toLowerCase()));
}

function filterMediaItems(items) {
    const keywordOption = getCurrentMediaKeywordOption();
    return items.filter(item => {
        const regionOk = mediaNewsFilter.region === 'all' ? true : detectMediaRegion(item) === mediaNewsFilter.region;
        return regionOk && matchesMediaKeyword(item, keywordOption);
    });
}

function setMediaNewsFilter(nextFilter = {}) {
    mediaNewsFilter = { ...mediaNewsFilter, ...nextFilter };
    try {
        localStorage.setItem(MEDIA_NEWS_FILTER_KEY, JSON.stringify(mediaNewsFilter));
    } catch (error) {
        console.warn('缓存资讯筛选失败', error);
    }
}

function loadMediaNewsFilter() {
    try {
        const raw = localStorage.getItem(MEDIA_NEWS_FILTER_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') mediaNewsFilter = { ...mediaNewsFilter, ...parsed };
    } catch (error) {
        console.warn('读取资讯筛选失败', error);
    }
}

function getMediaStatusMarkup() {
    const updatedText = mediaNewsStatus.updatedAt ? formatMediaTime(mediaNewsStatus.updatedAt) : '未更新';
    const sourceCount = mediaNewsStatus.sourceCount || 0;
    return `
        <div class="media-news-status" data-media-status-mode="${escapeHtml(mediaNewsStatus.mode || 'fallback')}">
            <div class="media-news-status-main">
                <span class="media-news-status-badge">${escapeHtml(mediaNewsStatus.label || '静态资讯')}</span>
                <span class="media-news-status-text">${escapeHtml(mediaNewsStatus.detail || '')}</span>
            </div>
            <div class="media-news-status-meta">最近更新：${escapeHtml(updatedText)} · 来源数：${sourceCount}</div>
        </div>
    `;
}

function setMediaNewsStatus(nextStatus = {}) {
    mediaNewsStatus = { ...mediaNewsStatus, ...nextStatus };
    try {
        localStorage.setItem(MEDIA_NEWS_STATUS_KEY, JSON.stringify(mediaNewsStatus));
    } catch (error) {
        console.warn('缓存资讯状态失败', error);
    }
}

function loadMediaNewsStatus() {
    try {
        const raw = localStorage.getItem(MEDIA_NEWS_STATUS_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') mediaNewsStatus = { ...mediaNewsStatus, ...parsed };
    } catch (error) {
        console.warn('读取资讯状态失败', error);
    }
}

function buildMediaSummary(item, fallbackSource) {
    const rawDescription = item.querySelector('description')?.textContent || item.querySelector('content\\:encoded')?.textContent || '';
    const cleaned = normalizeMediaText(rawDescription);
    if (cleaned) return cleaned.slice(0, 140) + (cleaned.length > 140 ? '...' : '');
    return `${fallbackSource} 最新 F1 资讯，点击查看全文。`;
}

function extractMediaSourceMeta(item, fallbackFeed) {
    let sourceName = normalizeMediaText(item.querySelector('source')?.textContent || '') || fallbackFeed.source;
    sourceName = sourceName.replace(/\s*-\s*Google News$/i, '').trim();
    const sourceIcon = sourceName
        .split(/[\s./-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase() || '')
        .join('')
        .slice(0, 2) || fallbackFeed.sourceIcon;
    return { source: sourceName, sourceIcon };
}

function parseMediaFeedXml(xmlText, fallbackFeed) {
    const xml = new DOMParser().parseFromString(xmlText, 'text/xml');
    if (xml.querySelector('parsererror')) throw new Error(`${fallbackFeed.source} feed parse failed`);
    return Array.from(xml.querySelectorAll('item')).map((item, index) => {
        const title = normalizeMediaText(item.querySelector('title')?.textContent || '');
        const url = normalizeMediaText(item.querySelector('link')?.textContent || '');
        const timestamp = item.querySelector('pubDate')?.textContent || item.querySelector('published')?.textContent || new Date().toISOString();
        const { source, sourceIcon } = extractMediaSourceMeta(item, fallbackFeed);
        return {
            id: `${fallbackFeed.source}-${index}-${url || title}`,
            source,
            sourceIcon,
            title,
            summary: buildMediaSummary(item, source),
            url,
            timestamp
        };
    }).filter(item => item.title && item.url);
}

async function fetchMediaFeed(feed) {
    const proxyUrls = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(feed.feedUrl)}`,
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.feedUrl)}`
    ];
    let lastError = null;
    for (const proxyUrl of proxyUrls) {
        try {
            const response = await fetch(proxyUrl, { cache: 'no-store' });
            if (!response.ok) throw new Error(`${feed.source} HTTP ${response.status}`);
            if (proxyUrl.includes('rss2json')) {
                const payload = await response.json();
                if (!Array.isArray(payload?.items)) throw new Error(`${feed.source} JSON feed invalid`);
                return payload.items.map((item, index) => {
                    const rawSummary = normalizeMediaText(item.description || '');
                    return {
                        id: `${feed.source}-${index}-${item.link || item.title}`,
                        source: normalizeMediaText(item.author || feed.source),
                        sourceIcon: feed.sourceIcon,
                        title: normalizeMediaText(item.title || ''),
                        summary: rawSummary.slice(0, 140) + (rawSummary.length > 140 ? '...' : ''),
                        url: normalizeMediaText(item.link || ''),
                        timestamp: item.pubDate || new Date().toISOString()
                    };
                }).filter(item => item.title && item.url);
            }
            const xmlText = await response.text();
            return parseMediaFeedXml(xmlText, feed);
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError || new Error(`${feed.source} feed fetch failed`);
}

function dedupeMediaItems(items) {
    const seen = new Set();
    return items.filter(item => {
        const key = `${item.url}::${item.title}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function cacheMediaNews(items) {
    try {
        localStorage.setItem(MEDIA_NEWS_CACHE_KEY, JSON.stringify(items));
        localStorage.setItem(MEDIA_NEWS_CACHE_TIME_KEY, String(Date.now()));
    } catch (error) {
        console.warn('缓存媒体资讯失败', error);
    }
}

function loadCachedMediaNews() {
    try {
        const raw = localStorage.getItem(MEDIA_NEWS_CACHE_KEY);
        const ts = Number(localStorage.getItem(MEDIA_NEWS_CACHE_TIME_KEY) || 0);
        if (!raw || !ts || Date.now() - ts > MEDIA_NEWS_CACHE_TTL) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
    } catch (error) {
        console.warn('读取媒体资讯缓存失败', error);
        return null;
    }
}

async function refreshMediaNews(force = false) {
    if (mediaNewsRefreshPromise && !force) return mediaNewsRefreshPromise;
    mediaNewsRefreshPromise = (async () => {
        const cached = !force ? loadCachedMediaNews() : null;
        if (cached?.length) {
            window.mediaNewsItems = cached;
            setMediaNewsStatus({
                mode: 'cache',
                label: '使用缓存',
                detail: '已从本地缓存恢复最近资讯',
                updatedAt: localStorage.getItem(MEDIA_NEWS_CACHE_TIME_KEY) || new Date().toISOString(),
                sourceCount: new Set(cached.map(item => item.source)).size
            });
            return cached;
        }

        const settled = await Promise.allSettled(MEDIA_NEWS_FEEDS.map(fetchMediaFeed));
        const freshItems = dedupeMediaItems(
            settled
                .filter(result => result.status === 'fulfilled')
                .flatMap(result => result.value)
        );
        if (!freshItems.length) throw new Error('没有拉取到最新资讯');

        const latest = sortMediaNewsByTime(freshItems).slice(0, 12);
        window.mediaNewsItems = latest;
        cacheMediaNews(latest);
        setMediaNewsStatus({
            mode: 'live',
            label: '实时拉取',
            detail: '已联网更新最新媒体报道',
            updatedAt: new Date().toISOString(),
            sourceCount: new Set(latest.map(item => item.source)).size
        });
        return latest;
    })();

    try {
        return await mediaNewsRefreshPromise;
    } finally {
        mediaNewsRefreshPromise = null;
    }
}

function getMediaFilterBarMarkup() {
    const regionMarkup = [
        { id: 'all', label: '全部' },
        { id: 'cn', label: '只看国内' },
        { id: 'en', label: '只看英文' }
    ].map(option => `<button type="button" class="media-filter-chip ${mediaNewsFilter.region === option.id ? 'active' : ''}" data-media-region="${option.id}">${escapeHtml(option.label)}</button>`).join('');
    const keywordMarkup = getMediaKeywordOptions().map(option => `<button type="button" class="media-filter-chip media-filter-chip-keyword ${mediaNewsFilter.keyword === option.id ? 'active' : ''}" data-media-keyword="${option.id}">${escapeHtml(option.label)}</button>`).join('');
    return `
        <div class="media-filter-bar">
            <div class="media-filter-row">${regionMarkup}</div>
            <div class="media-filter-row media-filter-row-head"><div class="media-filter-label">车手 / 车队筛选</div></div>
            <div class="media-filter-row media-filter-row-scroll">${keywordMarkup}</div>
        </div>
    `;
}

function renderMediaPage() {
    const container = document.getElementById('mediaContainer');
    if (!container) return;
    const sorted = sortMediaNewsByTime(window.mediaNewsItems || []);
    const filtered = filterMediaItems(sorted);
    const cards = filtered.length ? filtered.map(news => `
        <div class="media-news-card">
            <div class="media-news-header">
                <div class="media-source-icon">${news.sourceIcon}</div>
                <div class="media-source-stack">
                    <div class="media-source-name">${escapeHtml(news.source)}</div>
                    <div class="media-source-tags">
                        <span class="media-source-tag media-source-tag-${getMediaSourceTone(news)}">${escapeHtml(getMediaSourceToneLabel(news))}</span>
                        <span class="media-source-tag media-source-tag-${detectMediaRegion(news)}">${detectMediaRegion(news) === 'cn' ? '中文/国内' : '英文/海外'}</span>
                    </div>
                </div>
                <div class="media-news-time">${formatMediaTime(news.timestamp)}</div>
            </div>
            <div class="media-news-title">${escapeHtml(news.title)}</div>
            <div class="media-news-summary">${escapeHtml(news.summary)}</div>
            <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="media-read-more">阅读全文 →</a>
        </div>
    `).join('') : `<div class="media-news-card"><div class="media-news-title">当前筛选下没有结果</div><div class="media-news-summary">可以切回“全部”，或者换一个车手关键词试试。</div></div>`;
    container.innerHTML = `<button id="refreshMediaBtn" class="refresh-media">刷新资讯</button>${getMediaStatusMarkup()}${getMediaFilterBarMarkup()}${cards}`;
    document.getElementById('refreshMediaBtn')?.addEventListener('click', async event => {
        const button = event.currentTarget;
        if (button instanceof HTMLButtonElement) {
            button.disabled = true;
            button.innerText = '拉取中...';
        }
        showLoading(true);
        try {
            await refreshMediaNews(true);
            renderMediaPage();
            showToast('最新资讯已更新', false);
        } catch (error) {
            setMediaNewsStatus({
                mode: 'fallback',
                label: '回退静态',
                detail: '联网失败，暂时显示缓存或内置资讯',
                updatedAt: mediaNewsStatus.updatedAt || null,
                sourceCount: new Set((window.mediaNewsItems || []).map(item => item.source)).size
            });
            renderMediaPage();
            handleApiError(error, '媒体资讯刷新');
        } finally {
            showLoading(false);
            if (button instanceof HTMLButtonElement) {
                button.disabled = false;
                button.innerText = '刷新资讯';
            }
        }
    });

    if (!hasAttemptedInitialMediaRefresh) {
        hasAttemptedInitialMediaRefresh = true;
        refreshMediaNews(false)
            .then(() => renderMediaPage())
            .catch(error => {
                setMediaNewsStatus({
                    mode: 'fallback',
                    label: '静态兜底',
                    detail: '首次拉取失败，当前显示内置资讯',
                    updatedAt: null,
                    sourceCount: new Set((window.mediaNewsItems || []).map(item => item.source)).size
                });
                console.warn('初始化媒体资讯失败', error);
                renderMediaPage();
            });
    }
    document.querySelectorAll('[data-media-region]').forEach(button => button.addEventListener('click', event => {
        const target = event.currentTarget;
        if (!(target instanceof HTMLButtonElement)) return;
        setMediaNewsFilter({ region: target.dataset.mediaRegion || 'all' });
        renderMediaPage();
    }));
    document.querySelectorAll('[data-media-keyword]').forEach(button => button.addEventListener('click', event => {
        const target = event.currentTarget;
        if (!(target instanceof HTMLButtonElement)) return;
        setMediaNewsFilter({ keyword: target.dataset.mediaKeyword || 'all' });
        renderMediaPage();
    }));
}

function renderRaceRankings() {
    const container = document.getElementById('raceRankingsContainer');
    if (!container) return;
    const standings = window.raceSessionData?.seasonStandings?.drivers || [];
    if (!standings.length) {
        container.innerHTML = '<div class="rankings-section"><div class="section-title">当前暂无排名数据</div></div>';
        return;
    }
    container.innerHTML = `
        <div class="rankings-section">
            <div class="section-title">当前赛季排名</div>
            <table class="rankings-table">
                <thead><tr><th>Pos</th><th>车手</th><th>车队</th><th>积分</th></tr></thead>
                <tbody>${standings.map((item, index) => `<tr><td class="rank">${index + 1}</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.team)}</td><td class="points">${item.points}</td></tr>`).join('')}</tbody>
            </table>
        </div>
    `;
}

