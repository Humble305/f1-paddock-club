(function () {
    function getGroupDateKey(driverIds = []) {
        return [...driverIds].filter(Boolean).sort().join('__');
    }

    function updateDriverGroupDateMemory(driver, sceneName, allDrivers, messages, options = {}) {
        const userMessages = messages.filter(msg => msg.role === 'user').slice(-3);
        const keyTopics = userMessages.length ? userMessages.map(msg => String(msg.content).slice(0, 36)).join('、') : '热闹的聊天';
        const otherNames = allDrivers.filter(item => item.id !== driver.id).map(item => item.name);
        driverDateMemories[driver.id] = {
            scene: sceneName,
            date: new Date().toISOString(),
            dateKey: getLocalDateKey(),
            summary: `你们曾和${otherNames.join('、')}一起在${sceneName}出去，聊到了${keyTopics}。`,
            keyTopics,
            type: 'group-date',
            groupDateKey: options.groupDateKey || ''
        };
        secureStorageSet('f1_date_memories', driverDateMemories);
    }

    function updateGroupDateMemory(driverIds, sceneName, messages) {
        const drivers = driverIds.map(id => window.DRIVERS.find(item => item.id === id)).filter(Boolean);
        if (!drivers.length) return;
        const key = getGroupDateKey(driverIds);
        const userMessages = messages.filter(msg => msg.role === 'user').slice(-3);
        const keyTopics = userMessages.length ? userMessages.map(msg => String(msg.content).slice(0, 36)).join('、') : '愉快的相处';
        groupDateMemories[key] = {
            driverIds: drivers.map(driver => driver.id),
            driverNames: drivers.map(driver => driver.name),
            scene: sceneName,
            date: new Date().toISOString(),
            dateKey: getLocalDateKey(),
            summary: `你和${drivers.map(driver => driver.name).join('、')}曾在${sceneName}一起出去，聊到了${keyTopics}。`,
            keyTopics,
            type: 'group-date'
        };
        if (typeof saveGroupDateMemories === 'function') saveGroupDateMemories();
        drivers.forEach(driver => updateDriverGroupDateMemory(driver, sceneName, drivers, messages, { groupDateKey: key }));
    }

    function updateGroupDateSession(driverIds, scene, messages) {
        const sceneName = typeof scene === 'string' ? scene : scene?.name || '约会场景';
        const key = getGroupDateKey(driverIds);
        const dateKey = getLocalDateKey();
        if (!groupDateSessions[key] || typeof groupDateSessions[key] !== 'object') groupDateSessions[key] = {};
        groupDateSessions[key][dateKey] = {
            driverIds: [...driverIds],
            scene: sceneName,
            messages: (messages || []).map(message => ({
                role: message.role,
                speakerId: message.speakerId || '',
                content: String(message.content || ''),
                meta: message.meta || null
            })),
            updatedAt: new Date().toISOString()
        };
        if (typeof saveGroupDateSessions === 'function') saveGroupDateSessions();
    }

    function getGroupDateSharedMemoryContext(driverIds) {
        const key = getGroupDateKey(driverIds);
        const latestMemory = groupDateMemories[key]?.summary ? `【你们这组人的上次群约会记忆】\n${groupDateMemories[key].summary}` : '';
        const sessionMemory = typeof getRecentGroupDateSessionContext === 'function' ? getRecentGroupDateSessionContext(key, 1) : '';
        const personalMemories = driverIds
            .map(driverId => {
                const driver = window.DRIVERS.find(item => item.id === driverId);
                const summary = driverDateMemories?.[driverId]?.summary;
                return driver && summary ? `【${driver.name}和用户的相关记忆】\n${summary}` : '';
            })
            .filter(Boolean)
            .join('\n');
        return [latestMemory, sessionMemory, personalMemories].filter(Boolean).join('\n');
    }

    window.DateMemory = {
        getGroupDateKey,
        updateDriverGroupDateMemory,
        updateGroupDateMemory,
        updateGroupDateSession,
        getGroupDateSharedMemoryContext
    };
})();
