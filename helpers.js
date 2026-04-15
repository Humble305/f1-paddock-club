// helpers.js - 通用工具函数
function showLoading(show) { const el=document.getElementById('loadingToast'); if(el) el.style.display = show ? 'block' : 'none'; }
function showToast(msg, isError=false) { const toast = document.createElement('div'); toast.className = 'loading-toast'; toast.innerText = msg; toast.style.background = isError ? '#b91c1c' : '#2a5f5f'; toast.style.display = 'block'; document.body.appendChild(toast); setTimeout(() => toast.remove(), 2000); }
function escapeHtml(str) { return String(str).replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]); }
function getCurrentTime() { return new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }); }
function getGenderPrefix() { return userProfile && userProfile.gender === '男' ? "先生" : (userProfile && userProfile.gender === '女' ? "女士" : "车迷朋友"); }
function getUserRoleText() { return userProfile && userProfile.roleType === '自定义' && userProfile.customRole ? userProfile.customRole : (userProfile && userProfile.roleType === '赛车手' ? "赛车手" : (userProfile && userProfile.roleType === '车队经理' ? "车队经理" : "车迷")); }
function getUserProfileSummary() { return `用户资料：姓名 ${userProfile.name}，性别 ${userProfile.gender}，年龄 ${userProfile.age}岁，国籍 ${userProfile.nationality}，角色 ${getUserRoleText()}，性格 ${userProfile.personality}，爱好 ${userProfile.hobby}。背景：${userProfile.background || "暂无"}`; }
function getTodayDateStr() { const today = new Date(); return today.toISOString().slice(0,10); }
function handleApiError(error, context = "API 调用") {
    let errorMsg = "❌ ";
    if (error.message === "Failed to fetch" || error instanceof TypeError) {
        errorMsg += "网络连接失败，请检查网络和 API 地址是否正确";
    } else if (error.message && (error.message.includes("401") || error.message.includes("Unauthorized"))) {
        errorMsg += "API Key 无效或已过期，请检查 API 设置";
    } else if (error.message && error.message.includes("429")) {
        errorMsg += "请求过于频繁，API 已限流，请稍后再试";
    } else if (error.message && (error.message.includes("500") || error.message.includes("503"))) {
        errorMsg += "API 服务暂时不可用，请稍后重试";
    } else if (error instanceof SyntaxError) {
        errorMsg += "API 返回数据格式错误，可能是模型配置问题";
    } else {
        errorMsg += `${context}失败: ${error.message || "未知错误"}`;
    }
    showToast(errorMsg, true);
    console.error(`[${context}]`, error);
}
function sortMediaNewsByTime(news){ return [...news].sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp)); }
function formatMediaTime(ts){ const date=new Date(ts); const now=new Date(); const diff=now-date; const mins=Math.floor(diff/60000); if(mins<1) return "刚刚"; if(mins<60) return `${mins}分钟前`; const hours=Math.floor(diff/3600000); if(hours<24) return `${hours}小时前`; return `${Math.floor(diff/86400000)}天前`; }
function getCurrentDateInfo() { const now = new Date(); const year = now.getFullYear(); const month = now.getMonth() + 1; const day = now.getDate(); const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']; const weekday = weekdays[now.getDay()]; return `${year}年${month}月${day}日 ${weekday}`; }
let statusClockTimer = null;
function updateStatusBarTime() {
    const timeEl = document.getElementById('systemStatusTime');
    if (!timeEl) return;
    timeEl.innerText = getCurrentTime();
}
function startStatusBarClock() {
    updateStatusBarTime();
    if (statusClockTimer) clearInterval(statusClockTimer);
    statusClockTimer = setInterval(updateStatusBarTime, 1000);
}

// 导出到全局（浏览器环境）
window.showLoading = showLoading;
window.showToast = showToast;
window.escapeHtml = escapeHtml;
window.getCurrentTime = getCurrentTime;
window.getGenderPrefix = getGenderPrefix;
window.getUserRoleText = getUserRoleText;
window.getUserProfileSummary = getUserProfileSummary;
window.getTodayDateStr = getTodayDateStr;
window.handleApiError = handleApiError;
window.sortMediaNewsByTime = sortMediaNewsByTime;
window.formatMediaTime = formatMediaTime;
window.getCurrentDateInfo = getCurrentDateInfo;
window.updateStatusBarTime = updateStatusBarTime;
window.startStatusBarClock = startStatusBarClock;
