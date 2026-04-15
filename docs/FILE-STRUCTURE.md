# 文件结构说明

## 当前正式启用的文件

### `/index.html`
- 页面骨架
- 只负责挂载页面结构和引入脚本

### `/styles.css`
- 全局样式
- 所有页面、按钮、弹窗、主题视觉都在这里

### `/modules/app-entry.js`
- 应用入口
- 页面切换、事件绑定、初始化流程

### `/modules/app-state-theme.js`
- 全局状态
- 主题系统与配色切换

### `/modules/app-storage-services.js`
- 本地存档
- 签到、头像、记忆、日记、API 模型列表辅助

### `/modules/app-conversation.js`
- 私聊系统
- 车手列表、消息渲染、消息发送、私聊回复

### `/modules/app-social-feed.js`
- 围场动态
- 评论、媒体资讯、积分榜、赛季排名

### `/modules/app-date-diary.js`
- 约会系统
- 关系日记
- 约会记忆与日记生成

### `/modules/app-pages-settings.js`
- 赛历页
- 个人资料
- API 设置
- 存档导入导出
- 车手资料卡
- 公告弹窗

## 原始数据文件

### `/data.js`
- 车手数据
- 资料卡数据
- 赛历、公告、媒体资讯

### `/driverPersonalities.js`
- 车手性格、人设、表达风格

### `/historyEvents.js`
- F1 历史上的今天

### `/raceSession.js`
- 赛季进度与积分上下文

### `/helpers.js`
- 通用工具函数

## 目前可以忽略的旧文件

下面这些文件不是当前页面实际加载的版本，只是重构过程中留下的旧副本：

- `/main.js`
- `/app-main.js`
- `/main.refactored.js`
- 根目录下旧的 `/app-*.js`

如果后续你愿意继续做第三轮清理，可以把这些旧副本统一移到 `legacy/` 目录里。
