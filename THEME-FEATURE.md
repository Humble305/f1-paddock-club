# 🎨 全局主题颜色功能说明

## 功能介绍
添加了一个**车队配色主题选择器**，允许用户将应用的主题颜色修改为自己喜欢的F1车队代表色。

## 位置
- 位置：**签到页面（🏁 签到）下方**
- 标题：🎨 选择车队配色
- 包含9个F1车队的官方代表色

## 支持的车队配色

| 车队 | 主色 | 辅色 |
|------|------|------|
| 🔴 **法拉利红** (Ferrari) | #e10600 | #ffb347 |
| ⚪ **梅赛德斯银** (Mercedes) | #00d4be | #ffb347 |
| 🔵 **红牛蓝** (Red Bull) | #1e3050 | #ffd700 |
| 🟠 **迈凯轮橙** (McLaren) | #ff8700 | #ffb347 |
| 🔹 **阿尔卑斯蓝** (Alpine) | #0093d0 | #ffc600 |
| 💚 **阿斯顿马丁绿** (Aston Martin) | #00503f | #ffc100 |
| 💙 **AlphaTauri蓝** | #2d3c5c | #ffd700 |
| ⚪ **哈斯黑** (Haas) | #ffffff | #ff0000 |
| 🔵 **威廉姆斯蓝** (Williams) | #005aff | #ffb347 |
| 💚 **索伯绿** (Sauber) | #00633f | #ffd700 |

## 技术实现

### 1. **CSS变量系统**
使用CSS自定义属性实现动态主题切换：
```css
:root {
    --primary-color: #e10600;      /* 主颜色 */
    --primary-dark: #b80500;       /* 主颜色深色（用于hover）*/
    --accent-color: #ffb347;       /* 辅助颜色 */
}
```

### 2. **JavaScript主题管理**
- `applyTheme(themeName)` - 应用指定主题
- `loadTheme()` - 从本地存储加载用户设置的主题
- `initThemeSelector()` - 初始化主题选择器UI

### 3. **数据持久化**
用户选择的主题会自动保存到浏览器的 `localStorage` 中，刷新页面后仍会保留。
- Storage Key: `f1_theme`

## 用户使用流程

1. 打开应用，点击**左侧导航栏**的 **🏁 签到**
2. 向下滚动到**🎨 选择车队配色**部分
3. 点击想要的车队配色按钮
4. 看到确认提示后，整个应用的主题颜色会立即改变
5. 页面刷新后，选择的配色会自动恢复

## 影响范围

主题颜色会影响以下界面元素：
- ✅ 导航栏活动状态
- ✅ 标签页活动状态  
- ✅ 按钮（主要按钮、日期选择等）
- ✅ 聊天消息气泡（用户消息）
- ✅ 动态发布按钮
- ✅ 积分表排名/积分显示
- ✅ 日期约会相关UI
- ✅ 赛历和媒体相关颜色
- ✅ 公告框边框
- ✅ 所有强调文本

## 修改的文件

1. **styles.css**
   - 添加CSS变量定义
   - 替换所有硬编码的#e10600和#ffb347为CSS变量
   - 新增主题选择器样式

2. **index.html**
   - 在signPage中添加主题选择器
   - 更新签到卡片中的颜色引用为CSS变量

3. **main.js**
   - 添加F1_THEMES对象（10个车队配色）
   - 添加applyTheme、loadTheme、initThemeSelector函数
   - 修改init函数以初始化主题系统

## 扩展说明

如需添加更多车队颜色，修改main.js中的F1_THEMES对象：

```javascript
const F1_THEMES = {
    your_team: { 
        name: '🏁 车队名称', 
        primaryColor: '#colorcode', 
        primaryDark: '#darkcolor', 
        accentColor: '#accentcolor' 
    }
};
```

## 默认设置
应用启动时默认使用 **法拉利红** (#e10600) 作为主题颜色。
