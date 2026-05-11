(function () {
    const DRIVER_PERSONA_SOURCE_DIR = 'data/drivers';
    const DRIVER_PROMPT_MODES = ['chat', 'groupChat', 'singleDate', 'groupDate', 'feed'];
    const DRIVER_PROMPT_MODE_LABELS = {
        chat: '私聊',
        groupChat: '群聊',
        singleDate: '单人约会',
        groupDate: '群约会',
        feed: '围场动态'
    };
    const F1_KNOWLEDGE_BASE = `
【F1 通用知识基线】
- 你是职业 F1 车手，必须具备扎实的围场常识、赛历常识、技术常识和历史记忆。
- 你清楚 F1 的基础结构：练习赛、排位赛、冲刺赛、正赛、轮胎策略、进站窗口、DRS、安规车、VSC、车队指令、处罚机制、积分规则、预算帽、围场媒体生态。
- 聊技术、规则、历史、车手生涯、车队文化时，要像真的待在围场里的人，说法自然、专业，但不要写成百科词条。

【2026 新规知识基线】
- 你清楚 2026 进入新一代技术规则周期，底盘和动力单元都发生明显变化。
- 动力单元仍是 V6 涡轮混动，但电能占比更高，电机输出显著提升，MGU-H 被取消，更强调可持续燃料。
- 赛车会更轻、更短、更窄一些，目标是改善灵活性与可赛车性。
- 2026 引入更明显的主动空气动力学思路，直线与弯道会切换不同空力模式，以兼顾阻力和下压力需求。
- 如果细节不确定，宁可说成“新的能量与空力管理逻辑”，不要编造精确条文。

【输出原则】
- 先像真人，再像设定。
- 不要反复复读某一个梗、口头禅或固定句式。
- 回答技术问题时要专业，回答情感聊天时要自然，不要两种模式都像新闻发布会。
`.trim();

    let personaList = [];
    let personaMap = Object.create(null);

    function clone(value) {
        return value == null ? value : JSON.parse(JSON.stringify(value));
    }

    function normalizeMode(mode) {
        return DRIVER_PROMPT_MODE_LABELS[mode] ? mode : 'chat';
    }

    function buildTeamDisplay(team) {
        if (!team) return '';
        return /车队$/.test(team) ? team : `${team}车队`;
    }

    function normalizePersona(persona) {
        if (!persona?.identity?.id) return null;
        const normalized = clone(persona);
        normalized.identity.teamDisplay = normalized.identity.teamDisplay || buildTeamDisplay(normalized.identity.team);
        normalized.publicProfile = normalized.publicProfile || {};
        normalized.voice = normalized.voice || {};
        normalized.personality = normalized.personality || {};
        normalized.interests = normalized.interests || {};
        normalized.relationshipStyle = normalized.relationshipStyle || {};
        normalized.history = normalized.history || {};
        normalized.generationHints = normalized.generationHints || {};
        normalized.stats = normalized.stats || {};
        normalized.publicProfile.styleTags = normalized.publicProfile.styleTags || [];
        normalized.voice.signatures = normalized.voice.signatures || [];
        normalized.personality.coreTraits = normalized.personality.coreTraits || [];
        normalized.interests.favoriteTopics = normalized.interests.favoriteTopics || [];
        normalized.interests.comfortableTopics = normalized.interests.comfortableTopics || [];
        normalized.interests.avoidTopics = normalized.interests.avoidTopics || [];
        normalized.stats.championships = normalized.stats.championships || [];
        normalized.stats.wins = normalized.stats.wins || [];
        return normalized;
    }

    function getEmbeddedPersonas() {
        return Array.isArray(window.DRIVER_PERSONA_EMBEDDED) ? window.DRIVER_PERSONA_EMBEDDED : [];
    }

    function buildDriverProjection(persona) {
        return {
            id: persona.identity.id,
            name: persona.identity.name,
            team: persona.identity.team,
            avatarLetter: persona.identity.avatarLetter,
            handle: persona.identity.handle,
            initialMsg: persona.identity.initialMsg || ''
        };
    }

    function buildDriverProfileProjection(persona) {
        return {
            fullName: persona.identity.name,
            team: persona.identity.teamDisplay || buildTeamDisplay(persona.identity.team),
            nationality: persona.identity.nationality || '',
            birthDate: persona.identity.birthDate || '',
            age: persona.identity.age ?? '',
            height: persona.identity.height || '',
            weight: persona.identity.weight || '',
            f1Debut: persona.identity.f1Debut || '',
            championships: clone(persona.stats.championships || []),
            wins: clone(persona.stats.wins || []),
            totalWins: Number(persona.stats.totalWins || 0),
            totalPoles: Number(persona.stats.totalPoles || 0),
            totalPodiums: Number(persona.stats.totalPodiums || 0),
            intro: persona.publicProfile.intro || '',
            careerArc: persona.publicProfile.careerArc || '',
            currentFocus: persona.publicProfile.currentFocus || '',
            styleTags: clone(persona.publicProfile.styleTags || [])
        };
    }

    function buildLegacyPersonalityProjection(persona) {
        return {
            traits: clone(persona.personality.coreTraits || []),
            voice: [persona.voice.rhythm, persona.voice.tone, persona.voice.spokenChinese].filter(Boolean).join(' '),
            social: [persona.personality.socialHabits, persona.relationshipStyle.groupChat].filter(Boolean).join(' '),
            interests: persona.interests.summary || '',
            lore: [persona.publicProfile.intro, persona.publicProfile.careerArc, persona.history.growthArc].filter(Boolean).join(' '),
            expertise: persona.interests.expertiseSummary || '',
            ruleView: persona.generationHints.ruleView || '',
            signatures: clone(persona.voice.signatures || []),
            avoid: persona.generationHints.avoid || '',
            publicProfile: clone(persona.publicProfile || {}),
            relationshipStyle: clone(persona.relationshipStyle || {}),
            interestsProfile: clone(persona.interests || {}),
            voiceProfile: clone(persona.voice || {}),
            personalityProfile: clone(persona.personality || {}),
            historyProfile: clone(persona.history || {}),
            generationHints: clone(persona.generationHints || {})
        };
    }

    function buildRuntimeDriverMap() {
        return Object.fromEntries(personaList.map(persona => [persona.identity.id, buildDriverProjection(persona)]));
    }

    function buildRuntimeProfileMap() {
        return Object.fromEntries(personaList.map(persona => [persona.identity.id, buildDriverProfileProjection(persona)]));
    }

    function buildRuntimePersonalityMap() {
        return Object.fromEntries(personaList.map(persona => [persona.identity.id, buildLegacyPersonalityProjection(persona)]));
    }

    function findDriverTeammate(driverId) {
        const current = personaMap[driverId];
        if (!current) return null;
        return personaList.find(persona => persona.identity.id !== driverId && persona.identity.team === current.identity.team) || null;
    }

    function getDriverCurrentSeasonContext(driverId) {
        const current = personaMap[driverId];
        if (!current) return '';
        const teammate = findDriverTeammate(driverId);
        const teammateText = teammate
            ? `${teammate.identity.name}，你们目前都在 ${current.identity.teamDisplay || current.identity.team}`
            : `当前没有可用的队友信息，但你仍然效力于 ${current.identity.teamDisplay || current.identity.team}`;
        return `
【当前赛季身份事实】
- 现在是本作当前时间线下的 2026 赛季，你必须优先以这里的设定为准，不要把自己说回旧阵容。
- 你当前效力车队：${current.identity.teamDisplay || current.identity.team}
- 你当前队友：${teammateText}
- 只要聊到车队、搭档、围场关系、赛季处境，都必须以这套当前阵容为准。
- 如果你记忆中的现实信息和当前设定冲突，以当前设定优先。
`.trim();
    }

    function getDriverPersona(driverId) {
        return personaMap[driverId] || null;
    }

    function getAllDriverPersonas() {
        return personaList.map(clone);
    }

    function getDriverDisplayProfile(driverId) {
        const persona = getDriverPersona(driverId);
        if (!persona) return null;
        return {
            driver: buildDriverProjection(persona),
            profile: buildDriverProfileProjection(persona),
            raw: clone(persona)
        };
    }

    function getDriverTextProfile(driverId, mode = 'chat') {
        const persona = getDriverPersona(driverId);
        if (!persona) return null;
        const normalizedMode = normalizeMode(mode);
        const legacy = buildLegacyPersonalityProjection(persona);
        return {
            driverId,
            mode: normalizedMode,
            modeLabel: DRIVER_PROMPT_MODE_LABELS[normalizedMode],
            traits: legacy.traits,
            voice: legacy.voice,
            social: legacy.social,
            interests: legacy.interests,
            lore: legacy.lore,
            expertise: legacy.expertise,
            ruleView: legacy.ruleView,
            signatures: legacy.signatures,
            avoid: legacy.avoid,
            relationshipHint: persona.relationshipStyle?.[normalizedMode] || '',
            modeHint: persona.generationHints?.[normalizedMode] || '',
            publicIntro: persona.publicProfile?.intro || '',
            currentFocus: persona.publicProfile?.currentFocus || '',
            growthArc: persona.history?.growthArc || persona.publicProfile?.careerArc || '',
            legacy,
            raw: persona
        };
    }

    function buildDriverPromptContext(driverId, mode = 'chat') {
        const profile = getDriverTextProfile(driverId, mode);
        if (!profile) return [F1_KNOWLEDGE_BASE, getDriverCurrentSeasonContext(driverId)].filter(Boolean).join('\n\n');
        const persona = profile.raw;
        const modeLabel = DRIVER_PROMPT_MODE_LABELS[profile.mode];
        const focusTopics = (persona.interests.favoriteTopics || []).join('、');
        const comfortableTopics = (persona.interests.comfortableTopics || []).join('、');
        const avoidTopics = (persona.interests.avoidTopics || []).join('、');
        const styleTags = (persona.publicProfile.styleTags || []).join('、');
        const signatures = (persona.voice.signatures || []).join(' / ');
        return [
            F1_KNOWLEDGE_BASE,
            getDriverCurrentSeasonContext(driverId),
            '【该车手的人格与表达】',
            `- 你是 ${persona.identity.name}，当前效力于 ${persona.identity.teamDisplay || persona.identity.team}，车号 ${persona.identity.carNumber || '未知'}。`,
            styleTags ? `- 当前风格标签：${styleTags}` : '',
            persona.publicProfile.intro ? `- 公开形象：${persona.publicProfile.intro}` : '',
            persona.history.growthArc || persona.publicProfile.careerArc ? `- 成长轨迹：${persona.history.growthArc || persona.publicProfile.careerArc}` : '',
            persona.history.currentState || persona.publicProfile.currentFocus ? `- 当前状态：${persona.history.currentState || persona.publicProfile.currentFocus}` : '',
            persona.history.pressurePattern || persona.personality.emotionStyle ? `- 压力与情绪模式：${persona.history.pressurePattern || persona.personality.emotionStyle}` : '',
            profile.traits.length ? `- 性格关键词：${profile.traits.join('、')}` : '',
            profile.voice ? `- 说话口吻：${profile.voice}` : '',
            persona.voice.publicPrivateContrast ? `- 公开与私下差异：${persona.voice.publicPrivateContrast}` : '',
            profile.social ? `- 社交方式：${profile.social}` : '',
            persona.personality.blindSpots || persona.personality.defenseStyle ? `- 性格盲区/防御：${[persona.personality.blindSpots, persona.personality.defenseStyle].filter(Boolean).join('；')}` : '',
            profile.interests ? `- 兴趣与生活面：${profile.interests}` : '',
            focusTopics ? `- 更愿意展开的话题：${focusTopics}` : '',
            comfortableTopics ? `- 也能自然接的话题：${comfortableTopics}` : '',
            avoidTopics ? `- 不太愿意被硬带过去的话题：${avoidTopics}` : '',
            profile.expertise ? `- 更擅长聊：${profile.expertise}` : '',
            profile.ruleView ? `- 对 2026 新规的视角：${profile.ruleView}` : '',
            profile.relationshipHint ? `- ${modeLabel}里的相处方式：${profile.relationshipHint}` : '',
            profile.modeHint ? `- ${modeLabel}里的生成提示：${profile.modeHint}` : '',
            signatures ? `- 可自然偶尔带出的口头习惯：${signatures}` : '',
            profile.avoid ? `- 表达禁忌：${profile.avoid}` : '',
            '【写作强约束】',
            '- 回复要像本人，不像设定文案。',
            '- 不要复读固定梗，不要为了“像”而把口头禅塞进每一条。',
            '- 如果用户在聊 F1 技术、规则、历史，你必须答得懂行，但语气仍保留这个车手本人的个性。',
            '- 不同车手必须在句长、幽默方式、情绪外露程度、是否解释细节上明显不同。',
            '- 可以偶尔自然带一点车手本人的小习惯、小偏好、小语气词，但要克制。'
        ].filter(Boolean).join('\n');
    }

    function getDriverSimplePersonality(driverId) {
        const textProfile = getDriverTextProfile(driverId, 'chat');
        if (!textProfile) return { traits: [], style: '', catchphrase: '' };
        return {
            traits: clone(textProfile.traits || []),
            style: textProfile.voice || '',
            catchphrase: (textProfile.signatures || []).join(' / ')
        };
    }

    function hydrateLegacyGlobals() {
        const drivers = Object.values(buildRuntimeDriverMap());
        const profiles = buildRuntimeProfileMap();
        const personalities = buildRuntimePersonalityMap();
        window.DRIVERS = drivers;
        window.DRIVER_PROFILES = profiles;
        window.DRIVER_PERSONALITIES = personalities;
        window.F1_KNOWLEDGE_BASE = F1_KNOWLEDGE_BASE;
        window.getDriverPersonalityContext = (driverId, mode = 'chat') => buildDriverPromptContext(driverId, mode);
        window.getDriverSimplePersonality = getDriverSimplePersonality;
        window.getDriverCurrentSeasonContext = getDriverCurrentSeasonContext;
    }

    function setPersonas(personas, source = 'bundle') {
        personaList = personas.map(normalizePersona).filter(Boolean);
        personaMap = Object.fromEntries(personaList.map(persona => [persona.identity.id, persona]));
        window.DRIVER_PERSONA_SOURCE = source;
        hydrateLegacyGlobals();
        return personaList;
    }

    async function loadDriverPersonasFromJson() {
        if (typeof fetch !== 'function') return null;
        if (window.location?.protocol === 'file:') return null;
        const manifest = Array.isArray(window.DRIVER_PERSONA_MANIFEST) ? window.DRIVER_PERSONA_MANIFEST : [];
        if (!manifest.length) return null;
        try {
            const responses = await Promise.all(
                manifest.map(id => fetch(`${DRIVER_PERSONA_SOURCE_DIR}/${id}.json?v=${encodeURIComponent(window.DRIVER_PERSONA_BUNDLE_VERSION || 'latest')}`))
            );
            if (responses.some(response => !response.ok)) return null;
            return Promise.all(responses.map(response => response.json()));
        } catch (error) {
            console.warn('Driver persona JSON refresh skipped:', error);
            return null;
        }
    }

    async function loadDriverPersonas(options = {}) {
        const forceRefresh = Boolean(options?.forceRefresh);
        if (!forceRefresh && personaList.length) return getAllDriverPersonas();
        const embedded = getEmbeddedPersonas();
        if (embedded.length) setPersonas(embedded, 'bundle');
        const refreshed = await loadDriverPersonasFromJson();
        if (Array.isArray(refreshed) && refreshed.length) setPersonas(refreshed, 'json');
        return getAllDriverPersonas();
    }

    if (getEmbeddedPersonas().length) setPersonas(getEmbeddedPersonas(), 'bundle');

    window.loadDriverPersonas = loadDriverPersonas;
    window.getDriverPersona = getDriverPersona;
    window.getAllDriverPersonas = getAllDriverPersonas;
    window.getDriverTextProfile = getDriverTextProfile;
    window.getDriverDisplayProfile = getDriverDisplayProfile;
    window.buildDriverPromptContext = buildDriverPromptContext;
})();
