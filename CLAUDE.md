# mdtopdf — Claude Code 规范

## Commit 规范

严格遵守 Conventional Commits，scope 统一用 `mdtopdf`：

```
<type>(mdtopdf): <subject>
```

允许的 type：`feat` / `fix` / `chore` / `docs` / `refactor` / `style` / `test` / `build` / `ci` / `perf` / `revert`

规则：
- subject 小写，不以句点结尾，header 总长 ≤ 100 字符
- 破坏性变更在 footer 添加 `BREAKING CHANGE:` 说明
- 每次 commit 前自查格式，不符合则停下来修正后再提交
- commit 粒度：一个功能点或一个修复 = 一次 commit
- husky + commitlint 会在本地拦截不合规的 commit message

示例：
```
feat(mdtopdf): add --watch flag for live conversion
fix(mdtopdf): handle empty markdown files gracefully
docs(mdtopdf): update README with installation steps
style(mdtopdf): increase body font to 18px
```

## README.md 维护规则

- 每当新增功能或用法变化时，同步更新 README.md
- 面向「在另一台设备 clone 下来能立刻理解怎么用」的标准来写

## CHANGELOG.md 维护规则

遵循 [Keep a Changelog](https://keepachangelog.com/) 格式：
- 每次功能完成或 bug 修复后，在 `[Unreleased]` 区追加记录
- 当用户说"发版"时，将 `[Unreleased]` 归入新版本号（语义化版本），注明日期
- 条目分类：`Added` / `Changed` / `Fixed` / `Removed`

## 转换日志（自动，不可绕过）

每次调用 `convertMdToPdf()` 或 `convertMdToPdfMobile()` 后，必须向 `logs/conversions.log` 追加一行：

```
[ISO 8601 timestamp] [mobile?] SUCCESS|FAILURE input="..." output="..." [error="..."]
```

- `logs/` 已加入 `.gitignore`，不提交到版本库
- 日志只追加，不覆盖
- 修改转换逻辑时，确保所有出口路径（成功与失败）都有日志调用

## 项目结构

```
src/
  index.js    — convertMdToPdf() 标准转换 + writeLog()
  mobile.js   — convertMdToPdfMobile() 手机长页模式 + writeLog()
  cli.js      — CLI 入口，支持 --mobile 标志
logs/         — 运行时自动创建，已 gitignored
.github/
  workflows/
    ci.yml    — PR: commitlint；push: build check
commitlint.config.js
CLAUDE.md     — 本文件（Claude Code 规范）
README.md     — 项目介绍与用法
CHANGELOG.md  — 变更记录
```

## 分支与同步规范

- `main` 受保护，禁止直接 push
- 日常开发在 `dev` 分支，功能分支从 `dev` 切出：`feat/<desc>` / `fix/<desc>`
- 每次完成阶段性工作，主动提醒用户是否要 push
- 如果本地落后于远程，先提醒用户 pull 再继续
- PR 标题必须符合 Conventional Commits 格式，合并前须通过 CI

## Conventional Commits 完整 type 表

| type       | 用途                        |
|------------|-----------------------------|
| `feat`     | 新功能                      |
| `fix`      | Bug 修复                    |
| `docs`     | 文档变更                    |
| `style`    | 格式（不影响逻辑）          |
| `refactor` | 重构（非 feat/fix）         |
| `perf`     | 性能优化                    |
| `test`     | 添加/修改测试               |
| `build`    | 构建系统或外部依赖变更      |
| `ci`       | CI/CD 配置变更              |
| `chore`    | 杂项（不修改 src/test）     |
| `revert`   | 回滚                        |
