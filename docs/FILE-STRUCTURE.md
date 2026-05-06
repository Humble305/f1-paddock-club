# 文件结构说明

## 当前正式启用的页面与运行文件

### `/index.html`
- 页面骨架
- 只负责挂载 DOM 结构和脚本加载顺序

### `/styles.css`
- 全局样式
- 页面、弹窗、聊天、赛历、约会、商城等统一视觉

### `/modules/app-entry.js`
- 应用入口
- 页面切换、事件绑定、初始化流程

## Core

### `/modules/app-state-theme.js`
- 全局运行状态
- 主题切换、日期/群约会/预测等共享状态

### `/modules/app-storage-services.js`
- 本地存储与读取
- 用户资料、记忆、日记、API 配置、预测、存档辅助

### `/modules/app-standings-data.js`
- 积分数据唯一入口
- 内置兜底、远程 standings、手动导入三层来源管理

## Chat / Feed

### `/modules/app-conversation.js`
- 私聊与群聊主链路
- 车手列表、消息渲染、发送、回复、好感判定

### `/modules/app-social-feed.js`
- 围场动态
- 媒体页
- 积分榜与本站排名页

## Date

### `/modules/app-date-diary.js`
- 约会页面 UI 与主流程入口
- 单约会 / 群约会开始、结束、页面渲染、关系日记弹窗

### `/modules/date/single-date-runtime.js`
- 单人约会文本生成链路
- prompt、可用性判定、本地 fallback、请求重试

### `/modules/date/date-memory.js`
- 群约会记忆沉淀
- 群约会原始会话记录
- 群约会共享上下文拼装

### `/modules/app-group-date-runtime.js`
- 群约会文本生成链路
- speaker 选择、群约会 prompt、本地 fallback

## Settings

### `/modules/app-pages-settings.js`
- 存档导入导出
- API 设置
- 用户资料设置
- standings 管理入口

### `/modules/settings/announcements.js`
- 公告排序
- 公告弹窗
- 已读版本管理

### `/modules/settings/driver-profile.js`
- 车手主页 / 资料卡渲染
- 动态、礼物、里程碑聚合

## 业务补充模块

### `/modules/app-store.js`
- 商城与送礼

### `/raceSession.js`
- 当前比赛周
- 赛季进度
- 当前站与最近完赛站上下文

### `/racePredictionResults.js`
- 赛前预测结算结果表

### `/standings.live.json`
- 远程积分同步静态源

### `/scripts/update-standings-from-official.js`
- 从 Formula1.com 同步积分并生成 standings JSON

## 静态数据

### `/data.js`
- 车手、赛历、公告、内置积分兜底

### `/driverPersonalities.js`
- 车手人格、兴趣、表达习惯

### `/historyEvents.js`
- F1 历史上的今天

### `/helpers.js`
- 通用工具函数

## 已移除的旧入口

以下旧根目录脚本已经不再参与当前运行：

- `/main.js`
- `/app-main.js`
- `/main.refactored.js`
- 根目录旧版 `/app-*.js`

当前正式运行链路以 `modules/` 目录下的脚本为准。
