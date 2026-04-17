const GIFT_BLUEPRINTS = {
    nor: { name: '限量版电竞方向盘', subtitle: '直播间同款', icon: '🎮', price: 25, description: '磨砂碳纤外壳，按键手感轻快，像是刚从直播机位旁边拆下来。' },
    pia: { name: '单品瑰夏手冲套组', subtitle: '工程师清醒包', icon: '☕', price: 25, description: '带滤杯、电子秤和参数卡，一看就是会认真研究萃取曲线的人会喜欢的东西。' },
    lec: { name: '摩纳哥海盐钢琴雪球', subtitle: '海风纪念品', icon: '🎹', price: 25, description: '轻轻一晃会落下银白细雪，底座是低调的黑金配色，带一点旧港口的浪漫。' },
    ham: { name: '高定植鞣皮手套', subtitle: '秀场后台款', icon: '🧤', price: 35, description: '剪裁利落，皮面柔软，包装盒里还塞了一张环保面料说明卡。' },
    rus: { name: '私人酒庄醒酒器', subtitle: '晚餐桌主角', icon: '🍷', price: 35, description: '线条锋利得像风洞模型，摆在桌上就很像会被认真点评年份。' },
    ant: { name: '冠军肉酱千层面', subtitle: '赛后补给', icon: '🍝', price: 20, description: '热气腾腾的一大份，芝士拉丝很夸张，年轻车手看一眼就会胃口大开。' },
    ver: { name: '红牛饮料冰镇整箱', subtitle: '围场经典梗', icon: '🥤', price: 20, description: '整整一箱塞满碎冰和拉环罐，简单粗暴，像把赛道休息区直接搬了过来。' },
    hadjar: { name: '巴黎深夜黑胶唱片', subtitle: '耳机音量拉满', icon: '🎧', price: 25, description: '封套是偏冷调的街头设计，拿在手里有点“别管了先放歌”的劲。' },
    alo: { name: '环西骑行补给礼盒', subtitle: '老狐狸耐力包', icon: '🚴', price: 25, description: '里头有能量胶、骑行袜和一只复古水壶，实用得过分，也很阿隆索。' },
    str: { name: '北境冰球纪念杆', subtitle: '休赛日藏品', icon: '🏒', price: 25, description: '银灰色杆身很冷，边角打磨得一丝不苟，看起来就不便宜。' },
    alb: { name: '曼谷椰香冬阴功杯面', subtitle: '热气腾腾的一碗', icon: '🍜', price: 20, description: '打开就有酸辣香气，属于深夜吃一口会立刻心情变好的类型。' },
    sai: { name: '马德里王牌雪茄盒', subtitle: '慢慢开盒的那种', icon: '🎁', price: 35, description: '胡桃木盒盖压着烫金纹章，光是拿出来就很有场面。' },
    gas: { name: '午夜法语电影胶片灯', subtitle: '旧片场气氛组', icon: '🎬', price: 25, description: '灯罩里卷着一圈仿旧胶片，亮起来像巴黎老电影院的散场时刻。' },
    col: { name: '博卡蓝黄烤肉围裙', subtitle: '阿根廷烧烤局', icon: '🔥', price: 20, description: '前面印着夸张口号，背带是球迷配色，像是下一秒就要开始烤肉和起哄。' },
    oco: { name: '山路骑行风切外套', subtitle: '硬派训练装', icon: '🧥', price: 25, description: '版型紧实，反光条低调克制，一看就不是拿来摆拍的。' },
    bea: { name: '黑胶摇滚随身音箱', subtitle: '露营歌单专用', icon: '🔊', price: 25, description: '体积不大，音色却很厚，适合夜里把英摇放得刚刚好。' },
    hul: { name: '德式精酿小麦啤礼篮', subtitle: '终于能松口气', icon: '🍺', price: 20, description: '木提篮里塞着杯垫和开瓶器，带一点老派机械迷的讲究。' },
    bor: { name: '海滩桑巴便携音箱', subtitle: '巴西太阳味', icon: '🌴', price: 20, description: '颜色明亮得像节庆海报，打开就自带一股周末聚会的热闹。' },
    law: { name: '全黑队复古橄榄球', subtitle: '新西兰硬汉套装', icon: '🏉', price: 25, description: '皮纹扎实，黑银配色很干净，像随时可以抱着去草地上来一场。' },
    lin: { name: '瑞典机械键盘套件', subtitle: '程序员快乐板', icon: '⌨️', price: 25, description: '轴体、键帽和外壳都能自己搭，安静又利落，像极了技术宅的浪漫。' },
    per: { name: '墨西哥辣酱玉米片塔', subtitle: '派对桌中央', icon: '🌮', price: 20, description: '一大盒热量炸弹，酱料香得离谱，适合热闹场面和朋友一起分。' },
    bot: { name: '芬兰桑拿石香薰桶', subtitle: '慢慢升温', icon: '🪵', price: 20, description: '木桶里有桦木香和桑拿石，朴素得很北欧，也莫名有点松弛幽默。' }
};

let paddockStoreFilter = 'all';

function getGiftInventoryCount(giftId) {
    return Math.max(0, Number(giftInventory[giftId] || 0));
}

function saveGiftStoreState() {
    localStorage.setItem('f1_gift_inventory', JSON.stringify(giftInventory));
    localStorage.setItem('f1_gift_history', JSON.stringify(giftHistory));
}

function loadGiftStoreState() {
    try {
        giftInventory = JSON.parse(localStorage.getItem('f1_gift_inventory') || '{}') || {};
    } catch (_) {
        giftInventory = {};
    }
    try {
        giftHistory = JSON.parse(localStorage.getItem('f1_gift_history') || '[]') || [];
    } catch (_) {
        giftHistory = [];
    }
}

function createFallbackGift(driverId) {
    const driver = window.DRIVERS.find(item => item.id === driverId);
    return {
        id: `signature-gift-${driverId}`,
        driverId,
        driverName: driver?.name || driverId,
        name: '围场限定神秘礼盒',
        subtitle: '意外惊喜款',
        icon: '🎁',
        price: 20,
        description: '包装得很像真的知道对方会喜欢什么，但答案只能靠你自己慢慢试出来。'
    };
}

function getDriverSignatureGift(driverId) {
    const driver = window.DRIVERS.find(item => item.id === driverId);
    const blueprint = GIFT_BLUEPRINTS[driverId];
    const gift = blueprint || createFallbackGift(driverId);
    return {
        id: `signature-gift-${driverId}`,
        driverId,
        driverName: driver?.name || driverId,
        name: gift.name,
        subtitle: gift.subtitle,
        icon: gift.icon,
        price: gift.price,
        description: gift.description
    };
}

function getPaddockStoreCatalog() {
    return (window.DRIVERS || []).map(driver => getDriverSignatureGift(driver.id));
}

function getGiftById(giftId) {
    return getPaddockStoreCatalog().find(item => item.id === giftId) || null;
}

function getOwnedGiftList() {
    return getPaddockStoreCatalog()
        .map(item => ({ ...item, stock: getGiftInventoryCount(item.id) }))
        .filter(item => item.stock > 0)
        .sort((a, b) => b.stock - a.stock || a.price - b.price);
}

function getStoreFilteredCatalog() {
    const catalog = getPaddockStoreCatalog();
    if (paddockStoreFilter === 'owned') return catalog.filter(item => getGiftInventoryCount(item.id) > 0);
    if (paddockStoreFilter === 'affordable') return catalog.filter(item => item.price <= userCoins);
    return catalog;
}

function refreshGiftUi() {
    renderSignPage();
    renderPaddockStore();
    if (typeof renderChatGiftPanel === 'function') renderChatGiftPanel();
    if (typeof renderDriverList === 'function') renderDriverList();
}

function buyStoreGift(giftId) {
    const item = getGiftById(giftId);
    if (!item) return;
    if (userCoins < item.price) {
        showToast(`围场币不够，还差 ${item.price - userCoins} 币`, true);
        return;
    }
    userCoins -= item.price;
    giftInventory[giftId] = getGiftInventoryCount(giftId) + 1;
    saveGiftStoreState();
    refreshGiftUi();
    showToast(`已购入 ${item.name}`, false);
}

function recordGiftHistory(driverId, item, matched) {
    const driver = window.DRIVERS.find(entry => entry.id === driverId);
    giftHistory = [
        {
            id: Date.now(),
            driverId,
            driverName: driver?.name || item.driverName,
            giftId: item.id,
            giftName: item.name,
            matched,
            timestamp: new Date().toISOString()
        },
        ...giftHistory
    ].slice(0, 18);
}

async function giftStoreItemToDriver(giftId, driverId) {
    const item = getGiftById(giftId);
    const driver = window.DRIVERS.find(entry => entry.id === driverId);
    if (!item || !driver) return false;
    if (getGiftInventoryCount(giftId) < 1) {
        showToast('库存不足，先去商店买下来再说', true);
        return false;
    }

    giftInventory[giftId] = getGiftInventoryCount(giftId) - 1;
    if (giftInventory[giftId] <= 0) delete giftInventory[giftId];

    const matched = item.driverId === driverId;
    recordGiftHistory(driverId, item, matched);
    saveGiftStoreState();
    refreshGiftUi();

    if (typeof sendGiftToDriver === 'function') {
        await sendGiftToDriver(driver, item, matched);
    }

    if (typeof showDriverProfile === 'function') {
        const profileModal = document.getElementById('driverProfileModal');
        if (profileModal?.style.display === 'flex') showDriverProfile(driverId);
    }

    if (matched) {
        showToast(`${driver.name}收下礼物时明显更开心了，好感 +5`, false);
    } else {
        showToast(`${driver.name}收下了 ${item.name}，反应还算自然`, false);
    }
    return true;
}

function closeChatGiftModal() {
    const modal = document.getElementById('chatGiftModal');
    if (modal) modal.style.display = 'none';
}

function openChatGiftModal() {
    if (!currentChatDriver) {
        showToast('先打开一位车手的聊天窗口', true);
        return;
    }
    renderChatGiftPanel();
    document.getElementById('chatGiftModal')?.style.setProperty('display', 'flex');
}

function renderChatGiftPanel() {
    const trigger = document.getElementById('openChatGiftBtn');
    const title = document.getElementById('chatGiftDriverName');
    const meta = document.getElementById('chatGiftMeta');
    const mount = document.getElementById('chatGiftList');
    if (trigger) trigger.disabled = !currentChatDriver;
    if (!mount) return;

    if (!currentChatDriver) {
        if (title) title.innerText = '送礼';
        if (meta) meta.innerText = '先选中一位车手，再从库存里挑礼物。';
        mount.innerHTML = '<div class="chat-gift-empty">当前还没有聊天对象，送礼入口会在你打开聊天后可用。</div>';
        return;
    }

    if (title) title.innerText = `送给 ${currentChatDriver.name}`;
    const totalOwned = Object.values(giftInventory || {}).reduce((sum, count) => sum + Number(count || 0), 0);
    if (meta) meta.innerText = `当前库存 ${totalOwned} 份礼物，挑一件送给 ${currentChatDriver.name}。`;

    const owned = getOwnedGiftList();
    if (!owned.length) {
        mount.innerHTML = '<div class="chat-gift-empty">库存里还没有礼物。先去商店买几件，再回来挑一份心意。</div>';
        return;
    }

    mount.innerHTML = owned.map(item => `
        <article class="chat-gift-card">
            <div class="chat-gift-card-top">
                <span class="chat-gift-card-icon">${item.icon}</span>
                <span class="chat-gift-card-stock">库存 ${item.stock}</span>
            </div>
            <div class="chat-gift-card-title">${escapeHtml(item.name)}</div>
            <div class="chat-gift-card-subtitle">${escapeHtml(item.subtitle)}</div>
            <div class="chat-gift-card-desc">${escapeHtml(item.description)}</div>
            <button type="button" class="chat-gift-send-btn" data-chat-gift-send="${item.id}">送出这份礼物</button>
        </article>
    `).join('');

    mount.querySelectorAll('[data-chat-gift-send]').forEach(button => {
        button.addEventListener('click', async () => {
            button.disabled = true;
            await giftStoreItemToDriver(button.dataset.chatGiftSend, currentChatDriver.id);
            closeChatGiftModal();
        });
    });
}

function renderPaddockStore() {
    const mount = document.getElementById('paddockStoreSection');
    if (!mount) return;

    const recentHistory = (giftHistory || []).slice(0, 5);
    const catalog = getStoreFilteredCatalog();
    const ownedCount = Object.values(giftInventory || {}).reduce((sum, count) => sum + Number(count || 0), 0);

    mount.innerHTML = `
        <section class="paddock-store-panel">
            <div class="paddock-store-hero">
                <div class="paddock-store-copy">
                    <div class="paddock-store-eyebrow">Paddock Club Collection</div>
                    <h4 class="paddock-store-title">围场礼品柜</h4>
                    <p class="paddock-store-desc">这里只摆礼物，不公布标准答案。每位车手都有自己真正会被打动的那一件，你得在聊天里慢慢摸出来。</p>
                </div>
                <div class="paddock-store-wallet">
                    <span class="paddock-store-wallet-label">当前围场币</span>
                    <strong class="paddock-store-wallet-value">${userCoins}</strong>
                    <span class="paddock-store-wallet-meta">库存 ${ownedCount} 份</span>
                </div>
            </div>
            <div class="paddock-store-spotlight">
                <div class="paddock-store-spotlight-card">
                    <span class="paddock-store-spotlight-label">送礼方式</span>
                    <strong>先买下来，再去聊天窗口送。</strong>
                    <span>车手会根据礼物本身给你不同反应，但不会直接把答案写在脸上。</span>
                </div>
                <div class="paddock-store-spotlight-card">
                    <span class="paddock-store-spotlight-label">定价逻辑</span>
                    <strong>20 / 25 / 35 币</strong>
                    <span>延续签到奖励梯度，普通随手礼、限定小物和收藏级礼物分层定价。</span>
                </div>
            </div>
            <div class="paddock-store-toolbar">
                <div class="paddock-store-filter-group">
                    <button type="button" class="paddock-store-filter${paddockStoreFilter === 'all' ? ' active' : ''}" data-store-filter="all">全部礼物</button>
                    <button type="button" class="paddock-store-filter${paddockStoreFilter === 'owned' ? ' active' : ''}" data-store-filter="owned">只看库存</button>
                    <button type="button" class="paddock-store-filter${paddockStoreFilter === 'affordable' ? ' active' : ''}" data-store-filter="affordable">当前买得起</button>
                </div>
                <div class="paddock-store-pricing-note">答案不会在商店里被直接公布</div>
            </div>
            <div class="paddock-store-grid">
                ${catalog.length ? catalog.map(item => `
                    <article class="paddock-gift-card">
                        <div class="paddock-gift-card-top">
                            <span class="paddock-gift-icon">${item.icon}</span>
                            <span class="paddock-gift-stock">库存 ${getGiftInventoryCount(item.id)}</span>
                        </div>
                        <div class="paddock-gift-title">${escapeHtml(item.name)}</div>
                        <div class="paddock-gift-subtitle">${escapeHtml(item.subtitle)}</div>
                        <div class="paddock-gift-desc">${escapeHtml(item.description)}</div>
                        <div class="paddock-gift-footer">
                            <div class="paddock-gift-price">${item.price} 币</div>
                            <div class="paddock-gift-actions">
                                <button type="button" class="paddock-gift-buy" data-store-buy="${item.id}">购买</button>
                            </div>
                        </div>
                    </article>
                `).join('') : '<div class="paddock-store-empty">当前筛选下没有可展示的礼物。</div>'}
            </div>
            <div class="paddock-store-history">
                <div class="paddock-store-history-title">最近送礼</div>
                ${recentHistory.length ? recentHistory.map(entry => `
                    <div class="paddock-store-history-item">
                        <span>${escapeHtml(entry.driverName)}</span>
                        <span>${escapeHtml(entry.giftName)}</span>
                        <strong class="${entry.matched ? 'is-match' : 'is-miss'}">${entry.matched ? '惊喜命中' : '普通收下'}</strong>
                    </div>
                `).join('') : '<div class="paddock-store-history-empty">还没有送礼记录，去聊天窗口试试第一份礼物吧。</div>'}
            </div>
        </section>
    `;

    mount.querySelectorAll('[data-store-filter]').forEach(button => {
        button.addEventListener('click', () => {
            paddockStoreFilter = button.dataset.storeFilter || 'all';
            renderPaddockStore();
        });
    });

    mount.querySelectorAll('[data-store-buy]').forEach(button => {
        button.addEventListener('click', () => buyStoreGift(button.dataset.storeBuy));
    });
}

window.loadGiftStoreState = loadGiftStoreState;
window.renderPaddockStore = renderPaddockStore;
window.renderChatGiftPanel = renderChatGiftPanel;
window.openChatGiftModal = openChatGiftModal;
window.closeChatGiftModal = closeChatGiftModal;
window.giftStoreItemToDriver = giftStoreItemToDriver;
