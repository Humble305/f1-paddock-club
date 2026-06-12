(function () {
    function getDisplayAnnouncements() {
        const announcementMap = new Map();
        (window.ANNOUNCEMENTS || []).forEach((item) => {
            if (!item?.version || announcementMap.has(item.version)) return;
            announcementMap.set(item.version, item);
        });

        return Array.from(announcementMap.values()).sort((left, right) => {
            const leftVersion = String(left.version || '').replace(/^v/i, '').split('.').map(Number);
            const rightVersion = String(right.version || '').replace(/^v/i, '').split('.').map(Number);
            for (let index = 0; index < Math.max(leftVersion.length, rightVersion.length); index += 1) {
                const diff = (rightVersion[index] || 0) - (leftVersion[index] || 0);
                if (diff !== 0) return diff;
            }
            return 0;
        });
    }

    function showAnnouncements() {
        const content = getDisplayAnnouncements().map((item, index) => {
            const rawLines = String(item.content || '').split('\n').map(line => line.trim()).filter(Boolean);
            const title = rawLines.shift() || '版本更新';
            const bullets = rawLines.map(line => line.replace(/^[鈥-]\s*/, '').trim()).filter(Boolean);
            return `
                <section class="announce-entry${index === 0 ? ' is-latest' : ''}">
                    <div class="announce-entry-top">
                        <div>
                            <div class="announce-entry-version">${escapeHtml(item.version || '')}</div>
                            <h4 class="announce-entry-title">${escapeHtml(title)}</h4>
                        </div>
                        ${index === 0 ? '<span class="announce-entry-badge">LATEST</span>' : ''}
                    </div>
                    ${bullets.length ? `<div class="announce-entry-list">${bullets.map(text => `<div class="announce-entry-item"><span class="announce-entry-dot"></span><span>${escapeHtml(text)}</span></div>`).join('')}</div>` : `<div class="announce-entry-body">${escapeHtml(String(item.content || ''))}</div>`}
                </section>
            `;
        }).join('');
        document.getElementById('announceContent').innerHTML = content;
        document.getElementById('announceModal').style.display = 'flex';
    }

    function closeAnnounceModal() {
        document.getElementById('announceModal').style.display = 'none';
    }

    function getLatestAnnouncementVersion() {
        return getDisplayAnnouncements()?.[0]?.version || '';
    }

    function getSeenAnnouncementVersion() {
        return localStorage.getItem('f1_seen_announcement_version') || '';
    }

    function saveAnnouncementVersion() {
        localStorage.setItem('f1_seen_announcement_version', getLatestAnnouncementVersion());
    }

    function checkAndShowNewAnnouncements() {
        if (getLatestAnnouncementVersion() && getLatestAnnouncementVersion() !== getSeenAnnouncementVersion()) {
            showAnnouncements();
        }
    }

    window.getDisplayAnnouncements = getDisplayAnnouncements;
    window.showAnnouncements = showAnnouncements;
    window.closeAnnounceModal = closeAnnounceModal;
    window.getLatestAnnouncementVersion = getLatestAnnouncementVersion;
    window.getSeenAnnouncementVersion = getSeenAnnouncementVersion;
    window.saveAnnouncementVersion = saveAnnouncementVersion;
    window.checkAndShowNewAnnouncements = checkAndShowNewAnnouncements;
})();
