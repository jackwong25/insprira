# 灵感熔炉

基于 [RedFox API](https://redfox.hk/) 的本地自媒体工作台。

## 功能

- **热榜与趋势**：全网热点、抖音 / 小红书 / 公众号热榜、AI 公众号 / AI B站 / AI 小红书昨日榜；7/14 天增长、稳定、冷却趋势
- **选题生成**：基于本地热榜证据 + 公众号爆款搜索，调用 OpenAI 兼容 LLM 生成选题
- **账号追踪**：分组订阅、作品同步、公众号诊断、趋势解读
- **知识库**：Obsidian / Notion 双源接入 + WeRss（we-mp-rss）公众号文章同步
- **内容重构**：多平台改写、RedFox `gpt-image-2` 封面生成、违禁词检测
- **本地 Agent**：Codex / Claude Code / Kimi / OpenClaw / Hermes 子进程集成
- **Skill 中心**：从 [redfox-community](https://github.com/redfox-community/skills) 拉取并热更新
- **CRON 调度**：内置每日热榜快照、缓存清理、WeRss 同步等任务，支持自定义

## 启动

要求 Node.js ≥ 20。

```bash
cd insprira
npm install
cp .env.example .env
# 编辑 .env，至少填写 REDFOX_API_KEY 和 KB_ENCRYPTION_KEY
npm start
```

浏览器访问 [http://127.0.0.1:8080](http://127.0.0.1:8080)。

首次启动创建默认账号 `admin / 123456`，登录后请立即在「账户与安全」修改密码。

## 配置

完整字段见 [`.env.example`](.env.example)。必填项：

- `REDFOX_API_KEY` — RedFox 平台 API Key
- `LLM_API_KEY` — OpenAI 兼容 LLM 服务的 Key（用于选题生成、热点分析）
- `KB_ENCRYPTION_KEY` — 加密密钥，用 `openssl rand -hex 32` 生成，配置后请勿修改

## 验证

```bash
npm run check   # 语法检查
npm test        # 回归测试
```

## License

[AGPL-3.0](LICENSE)
