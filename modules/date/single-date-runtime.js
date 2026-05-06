(function () {
    const DATE_MIN_DIALOGUE_CHARS = 48;
    const DATE_MAX_DIALOGUE_CHARS = 150;

    function getDateSceneAction(sceneId = '') {
        const actions = {
            beach: [
                '（他偏过脸看你，海风把额前碎发吹乱一点，脚步也跟着慢下来。）',
                '（他抬手压了下被风吹乱的发梢，视线落回你脸上时，脚步没再往前赶。）'
            ],
            restaurant: [
                '（他把指尖从杯沿上挪开，抬眼看你，桌面的暖光顺着眼尾落下来。）',
                '（他把杯子往旁边轻轻推了一点，靠回椅背时，视线却还停在你身上。）'
            ],
            paddock: [
                '（他侧过身站得离你近一点，耳边的广播声还没散干净，眼神却先落到了你这边。）',
                '（他把通行证随手按回外套上，脚步停住半拍，像是终于腾出空认真听你说话。）'
            ]
        };
        const pool = actions[sceneId] || actions.beach;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    function extractDateHook(userText = '') {
        const raw = String(userText || '').trim();
        if (!raw) return { isQuestion: false, shortText: '' };
        const first = raw.split(/[。！？!?]/)[0].trim();
        return {
            isQuestion: /[?？]$/.test(raw),
            shortText: first.slice(0, 24)
        };
    }

    function buildSingleDateTone(driver) {
        const toneMap = {
            ver: { opener: ['你都这么说了，我再装没听见就太假了。', '你这句我听见了，所以我才停一下。'] },
            lec: { opener: ['你既然都开口了，我总得认真回你。', '你这句我听见了，所以我不想拿场面话糊弄。'] },
            nor: { opener: ['行，你都把话递过来了，我总不能装傻。', '你这句一出来，我当然会回。'] },
            pia: { opener: ['你都问到这了，我不回反而奇怪。', '你这句我听见了，所以我才停下来。'] },
            rus: { opener: ['你都把话递过来了，我总不能装没听见。', '你这句我听见了，所以我才认真回。'] },
            ham: { opener: ['你既然这么说了，我当然会认真接。', '你这句我听见了，所以我不想敷衍过去。'] }
        };
        return toneMap[driver?.id] || {
            opener: ['你都这么说了，我总得认真回一句。', '你这句我听见了，所以我才停下来。']
        };
    }

    function buildDateSceneFollow(sceneId = '', isQuestion = false) {
        const sceneMap = {
            beach: isQuestion
                ? ['你先别急着往前走，这句我先回你。', '风是有点大，不过不耽误我把这句说清楚。']
                : ['风有点大，不过你刚才那句我还是听清了。', '海边说话会慢一点，但不至于让我装没听见。'],
            restaurant: isQuestion
                ? ['你先别急着端杯子，这句我先回完。', '这里够安静，我反而更想把话说直接一点。']
                : ['这里安静，你刚才那句一出来我就听见了。', '坐下来以后，很多话反而更不好装作没事。'],
            paddock: isQuestion
                ? ['先别急着继续往前走，这句我先接一下。', '这边是有点吵，不过不耽误我先回你。']
                : ['这边声音是有点杂，但你刚才那句我还是听见了。', '围场里难得有这种能慢下来聊两句的时候。']
        };
        const pool = sceneMap[sceneId] || sceneMap.beach;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    function buildDateFavorLine(favor = 0) {
        if (favor >= 75) {
            return [
                '你要是还想往下说，就继续，我会认真听。',
                '你这句我不会拿玩笑带过去。'
            ];
        }
        if (favor >= 45) {
            return [
                '你这句既然递过来了，我就认真回。',
                '你要是还想继续聊，我就在这儿听着。'
            ];
        }
        return [
            '我平时不一定会一下说很多，但这句我还是想接。',
            '我没打算敷衍你，所以才停下来回这句。'
        ];
    }

    function getDateDialogueOnlyText(text = '') {
        return normalizeDateReplyLayout(text)
            .filter(line => !/^（[^（）\n]{1,220}）$/u.test(line))
            .join('')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function hasDateActionLine(text = '') {
        return normalizeDateReplyLayout(text).some(line => /^（[^（）\n]{1,220}）$/u.test(line));
    }

    const DATE_META_LEAK_PATTERN = /(system prompt|chain of thought|内部推理|推理过程|思考过程|<think>|只输出|直接输出|不要解释|不要写标题|我会这样回复|我要先回应|我要把这句接住)/i;
    const DATE_WEIRD_PATTERN = /(至少现在这一刻|真正让我停下来|把这段气氛|把这段感觉|具体的存在感|把该说的东西说完整|对得起你刚刚|不是因为场景漂亮就够了|明明只是很普通的一段|轻飘飘的话|这种时候我不会|注意力留在了你和眼前这个场景上|我想把话说明白一点|我不会躲开|我会认真接住你这句|为什么继续说|为什么会开口)/i;

    function isUsableDateReply(text = '') {
        const source = String(text || '').trim();
        if (!source) return false;
        if (DATE_META_LEAK_PATTERN.test(source) || DATE_WEIRD_PATTERN.test(source)) return false;
        const normalizedLines = normalizeDateReplyLayout(source);
        if (!normalizedLines.length) return false;
        if (!hasDateActionLine(source)) return false;
        const dialogue = getDateDialogueOnlyText(source);
        if (!dialogue) return false;
        const compactLength = dialogue.replace(/\s/g, '').length;
        if (compactLength < DATE_MIN_DIALOGUE_CHARS) return false;
        if (compactLength > DATE_MAX_DIALOGUE_CHARS) return false;
        return true;
    }

    function fallbackDateReply(driver, scene, favor, normalHistory = [], dateHistory = [], options = {}) {
        const action = getDateSceneAction(scene?.id || '');
        const lastUser = [...dateHistory].reverse().find(item => item.role === 'user') || [...normalHistory].reverse().find(item => item.role === 'user');
        const hook = extractDateHook(lastUser?.content || '');
        const tone = buildSingleDateTone(driver);
        const opener = hook.shortText
            ? (hook.isQuestion
                ? '你刚才问的那句，我听见了。真要我现在回，我不会拿场面话糊弄你。'
                : '你刚才那句我听见了，所以我才停了一下。')
            : tone.opener[Math.floor(Math.random() * tone.opener.length)];
        const sceneFollow = buildDateSceneFollow(scene?.id || '', hook.isQuestion);
        const favorPool = buildDateFavorLine(favor);
        const favorLine = favorPool[Math.floor(Math.random() * favorPool.length)];
        const eventLead = options.eventContext ? '刚才那点小插曲过去了，反而更适合把话接下去。' : '';
        return [action, eventLead, opener, sceneFollow, favorLine].filter(Boolean).join('\n');
    }

    function ensureDateReplyText(text, driver, scene, favor, normalHistory = [], dateHistory = [], options = {}) {
        const source = String(text || '').trim();
        if (isUsableDateReply(source)) return source;
        return fallbackDateReply(driver, scene, favor, normalHistory, dateHistory, options);
    }

    async function requestDateReplyText(systemPrompt, options = {}) {
        const REQUEST_TIMEOUT_MS = 18000;
        const minDialogueChars = Number(options.minDialogueChars) || DATE_MIN_DIALOGUE_CHARS;
        const maxDialogueChars = Number(options.maxDialogueChars) || DATE_MAX_DIALOGUE_CHARS;
        const firstPassMaxTokens = Number(options.firstPassMaxTokens) || 260;
        const retryMaxTokens = Number(options.retryMaxTokens) || 380;
        const attempts = [
            {
                systemPrompt,
                userPrompt: `请直接输出这一轮约会回复。
 - 第一行先写一行很短的括号动作。
 - 后面直接开口，先接住用户刚刚那句话里最具体的一点。
 - 正文台词控制在 ${minDialogueChars} 到 ${maxDialogueChars} 字左右，够用就停。
 - 像中文母语者真的会这样说话，顺口一点，像面对面自然接话。
 - 不要写成长篇独白，不要分析自己为什么开口，也不要解释气氛为什么变了。
 - 至少要有一行括号动描。
 - 凡是动作、停顿、视线、环境描写，都必须单独成行，并用括号包起来。
 - 动作描写只要短短一行，重点还是把人话说顺。
 - 少写抽象句，少写“这一刻”“这种时候”“存在感”这类自我说明。
 - 括号外只写台词，不要解释规则，不要输出任何思考过程。`,
                temperature: 0.82,
                maxTokens: firstPassMaxTokens
            },
            {
                systemPrompt: `${systemPrompt}\n【补充修正】\n- 如果上一轮输出太空、格式跑偏，或者没有真正承接场景，这一轮就写一行自然的括号描写，再接顺口的台词。\n- 正文台词保持在 ${minDialogueChars} 到 ${maxDialogueChars} 字左右，不要再往长独白上走。\n- 先回应用户，再顺着场景往下接。\n- 别讲大道理，别自我分析，别把一句简单的话说成旁白。\n- 不要解释规则，不要自我说明，不要暴露任何思考过程。`,
                userPrompt: `请重写这一轮约会回复，确保有自然的台词内容。
 - 不能只有括号描写。
 - 不能空回。
 - 至少保留一行括号动描。
 - 场景感必须更强，回复要像真的发生在眼前，而不是泛用长回复。
 - 正文控制在 ${minDialogueChars} 到 ${maxDialogueChars} 字左右。
 - 不要长篇抒情，不要分析自己为什么会这样说。`,
                temperature: 0.78,
                maxTokens: retryMaxTokens
            }
        ];
        for (const attempt of attempts) {
            const controller = new AbortController();
            const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
            let response;
            try {
                response = await fetch(`${apiConfig.url.replace(/\/$/, '')}/chat/completions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiConfig.key}` },
                    body: JSON.stringify({
                        model: apiConfig.model,
                        messages: [
                            { role: 'system', content: attempt.systemPrompt },
                            { role: 'user', content: attempt.userPrompt }
                        ],
                        temperature: attempt.temperature,
                        max_tokens: attempt.maxTokens
                    }),
                    signal: controller.signal
                });
            } catch (error) {
                window.clearTimeout(timeoutId);
                if (error?.name === 'AbortError') continue;
                throw error;
            }
            window.clearTimeout(timeoutId);
            if (!response.ok) continue;
            const payload = await response.json();
            const content = sanitizeRoleOutput(payload?.choices?.[0]?.message?.content?.trim(), 'date');
            if (isUsableDateReply(content)) return content;
        }
        return '';
    }

    async function generateDateReply(driver, scene, userAction, userMessage, round, dateHistory = [], normalHistory = [], options = {}) {
        const favor = favorability[driver.id] || 0;
        const mood = getFavorMood(favor);
        const memoryContext = buildDriverSharedMemoryContext(driver.id);
        const personalityContext = window.getDriverPersonalityContext ? window.getDriverPersonalityContext(driver.id) : '';
        const eventContext = options.eventContext || null;
        const raceMemoryContext = typeof getCurrentRaceMemoryContext === 'function' ? getCurrentRaceMemoryContext() : '';
        const isOpening = /开始约会/.test(String(userAction || '')) && !String(userMessage || '').trim();
        if (!useAI || !apiConfig.key || !apiConfig.url || !apiConfig.model) {
            return fallbackDateReply(driver, scene, favor, normalHistory, dateHistory, options);
        }
        showLoading(true);
        try {
            const chatHistoryText = normalHistory.map(msg => `${msg.role === 'user' ? '用户' : driver.name}: ${msg.content}`).join('\n');
            const dateHistoryText = dateHistory.map(msg => `${msg.role === 'user' ? '用户' : driver.name}: ${msg.content}`).join('\n');
            const eventPrompt = eventContext ? `\n【刚刚发生的小插曲】${eventContext.title} - ${eventContext.desc}\n【用户刚刚的选择】${eventContext.choiceLabel}：${eventContext.actionText}` : '';
            const memoryBlock = isOpening ? '' : `\n【共享记忆】${memoryContext}\n【普通聊天记录】\n${chatHistoryText}`;
            const openingRule = isOpening ? '\n- 这是约会刚开始的开场，不要一上来就生硬复述之前小窗聊过的具体句子、旧话题或旧事件，除非它是被眼前场景自然勾出来的。' : '';
            const systemPrompt = `今天是${getCurrentDateInfo()}。${window.getCurrentRaceContext ? window.getCurrentRaceContext() : ''}\n你是 F1 车手 ${driver.name}（${driver.team}），正在和用户单独约会。\n【当前约会场景】${scene.name} - ${scene.desc}\n【当前关系】${mood}（好感度 ${favor}/100）\n${getUserProfilePriorityPrompt('date')}\n${raceMemoryContext}${memoryBlock}\n【本次约会里已经发生的小事】\n${typeof getDateEventHistoryText === 'function' ? getDateEventHistoryText() : '无'}\n【本次约会对话】\n${dateHistoryText}\n${personalityContext}${eventPrompt}\n【用户刚刚的动作或话语】${userAction}：${userMessage || '（无具体话语）'}\n【写法要求】\n- 先像中文母语者真的会这样开口，再考虑别的；别写成翻译腔、念稿腔、偶像剧长独白。${openingRule}\n- 第一行必须是一小行动作描写，而且要和${scene.name}这个场景强绑定。\n- 后面只写 2 到 4 句顺口的台词，先回应用户刚刚那句话里最具体的一点，再顺着场景往下接。\n- 这是单独相处，但不是让你写告白独白；比起解释心情，更重要的是把眼前这句接顺。\n- 不要解释自己为什么开口，不要解释为什么注意到对方，也不要把一句简单的话说成大段心理旁白。\n- 少写“这一刻”“这种时候”“存在感”“把气氛留下来”这类抽象自我说明，多写眼前真的能看见、听见、碰到的东西。\n- 当前这站的比赛周状态、本站成绩和你自己在本站的处境也属于稳定上下文；如果话题碰到这站，你不能像忘掉了一样。\n- 凡是动作、停顿、视线、环境描写，都必须单独成行并放在括号里；括号外只能是台词。\n- 不允许把描写混进台词句子里，也不允许出现不带括号的动作描写。\n- 正文台词控制在 ${DATE_MIN_DIALOGUE_CHARS} 到 ${DATE_MAX_DIALOGUE_CHARS} 字左右，够用就停，不要硬撑成长篇独白。\n- 绝对不要输出任何思考链、分析、推理、自我提醒、解释规则或类似“我会这样回复”的元话语。\n请以 ${driver.name} 的身份回复。`;
            const content = await requestDateReplyText(systemPrompt, {
                minDialogueChars: DATE_MIN_DIALOGUE_CHARS,
                maxDialogueChars: DATE_MAX_DIALOGUE_CHARS,
                firstPassMaxTokens: 260,
                retryMaxTokens: 380
            });
            if (!content) throw new Error('API 返回空内容');
            return content;
        } catch (error) {
            console.warn('约会回复生成失败，已回退本地回复。', error);
            showToast('这条约会回复没拉到 API，已回退为本地兜底回复', true);
            return fallbackDateReply(driver, scene, favor, normalHistory, dateHistory, options);
        } finally {
            showLoading(false);
        }
    }

    window.SingleDateRuntime = {
        DATE_MIN_DIALOGUE_CHARS,
        DATE_MAX_DIALOGUE_CHARS,
        isUsableDateReply,
        fallbackDateReply,
        ensureDateReplyText,
        requestDateReplyText,
        generateDateReply
    };
})();
