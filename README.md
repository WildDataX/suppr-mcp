# Suppr MCP - Usage Guide | 提供文档翻译及中文搜Pubmed的MCP服务 | Suppr超能文献

## Quick Start

### 1. 安装

全局安装：
```bash
npm install -g suppr-mcp
```

或者使用 npx（无需安装）：
```bash
npx suppr-mcp
```

### 2. 获取 API Key

访问 [Suppr API](https://suppr.wilddata.cn/api-keys) 获取您的 API 密钥。

### 3. 配置环境变量

```bash
export SUPPR_API_KEY=your_api_key_here
```

### 4. 在 MCP 客户端中使用

#### Claude Desktop 配置

编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`（macOS）或相应配置文件：

```json
{
  "mcpServers": {
    "suppr": {
      "command": "npx",
      "args": ["-y", "suppr-mcp"],
      "env": {
        "SUPPR_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

或者使用全局安装：

```json
{
  "mcpServers": {
    "suppr": {
      "command": "suppr-mcp",
      "env": {
        "SUPPR_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## 可用工具

### 1. create_translation - 创建翻译任务

创建文档翻译任务。

**参数：**
- `file_path` (file_path 和 file_url 二选一): 源文件路径
- `file_url` (file_path 和 file_url 二选一): 要翻译的文档 URL
- `to_lang` (必填): 目标语言代码
- `from_lang` (可选): 源语言代码（默认自动检测）
- `optimize_math_formula` (可选): 优化数学公式（仅 PDF）

**示例：**
```json
{
  "file_url": "https://example.com/document.pdf",
  "to_lang": "en",
  "from_lang": "zh",
  "optimize_math_formula": true
}
```

**返回：**
```json
{
  "task_id": "02a6c6d1-3f70-4a5a-80bc-971d53a37bb1",
  "status": "INIT",
  "consumed_point": 453,
  "source_lang": "zh",
  "target_lang": "en",
  "optimize_math_formula": true
}
```

### 2. get_translation - 获取翻译详情

获取翻译任务的详细信息和状态。

**参数：**
- `task_id` (必填): 翻译任务 ID

**示例：**
```json
{
  "task_id": "02a6c6d1-3f70-4a5a-80bc-971d53a37bb1"
}
```

**返回：**
```json
{
  "task_id": "02a6c6d1-3f70-4a5a-80bc-971d53a37bb1",
  "status": "DONE",
  "progress": 1.0,
  "consumed_point": 453,
  "source_file_name": "document.pdf",
  "source_file_url": "https://example.com/source.pdf",
  "target_file_url": "https://example.com/translated.pdf",
  "source_lang": "zh",
  "target_lang": "en",
  "error_msg": null,
  "optimize_math_formula": true
}
```

**任务状态说明：**
- `INIT`: 初始化
- `PROGRESS`: 进行中
- `DONE`: 已完成
- `ERROR`: 错误

### 3. list_translations - 列出翻译任务

获取翻译任务列表，支持分页。

**参数：**
- `offset` (可选): 分页偏移量，默认 0
- `limit` (可选): 每页数量，默认 20

**示例：**
```json
{
  "offset": 0,
  "limit": 10
}
```

**返回：**
```json
{
  "total": 42,
  "offset": 0,
  "limit": 10,
  "list": [
    {
      "task_id": "...",
      "status": "DONE",
      "progress": 1.0,
      ...
    }
  ]
}
```

### 4. search_documents - 文献搜索

AI 驱动的文献语义搜索。

**参数：**
- `query` (必填): 自然语言查询
- `topk` (可选): 最大返回数量（1-100，默认 20）
- `return_doc_keys` (可选): 指定返回字段
- `auto_select` (可选): 自动选择最优结果（默认 true）

**示例：**
```json
{
  "query": "糖尿病最新研究进展",
  "topk": 5,
  "return_doc_keys": ["title", "abstract", "doi", "authors"],
  "auto_select": true
}
```

**可用的返回字段：**
- `title`: 标题
- `abstract`: 摘要
- `authors`: 作者列表
- `doi`: DOI
- `pmid`: PubMed ID
- `link`: 链接
- `publication`: 出版物
- `pub_year`: 出版年份
- 更多字段请参考 API 文档

**返回：**
```json
{
  "search_items": [
    {
      "doc": {
        "title": "...",
        "abstract": "...",
        "authors": [...],
        "doi": "...",
        ...
      },
      "search_gateway": "pubmed"
    }
  ],
  "consumed_points": 20
}
```

## 支持的语言

常用语言代码：
- `en`: English (英语)
- `zh`: Chinese (中文)
- `ko`: Korean (韩语)
- `ja`: Japanese (日语)
- `fr`: French (法语)
- `de`: German (德语)
- `es`: Spanish (西班牙语)
- `ru`: Russian (俄语)
- `ar`: Arabic (阿拉伯语)
- `pt`: Portuguese (葡萄牙语)
- `it`: Italian (意大利语)
- `auto`: 自动检测

## 错误处理

所有错误都会返回标准格式：

```json
{
  "code": 非零错误码,
  "msg": "错误信息",
  "data": null
}
```

常见错误：
- **401**: API 密钥无效或未提供
- **400**: 请求参数错误
- **404**: 资源不存在

## 使用示例

### 在 Claude Desktop 中使用

1. 配置好 API 密钥后重启 Claude Desktop

2. 在对话中使用工具：

**翻译文档：**
> 请帮我翻译这个文档：https://example.com/paper.pdf，翻译成英文

**搜索文献：**
> 帮我搜索关于"深度学习在医学影像中的应用"的最新文献

**查询翻译状态：**
> 查看任务 02a6c6d1-3f70-4a5a-80bc-971d53a37bb1 的翻译进度

## 常见问题

### Q: 如何获取 API 密钥？
A: 访问 https://suppr.wilddata.cn/api-keys 注册并获取 API 密钥。

### Q: 支持哪些文档格式？
A: 支持 PDF, DOCX, PPTX, XLSX, HTML, TXT, EPUB等常见格式。

### Q: 翻译需要多长时间？
A: 取决于文档大小，通常几分钟到十几分钟不等。可以使用 `get_translation` 查询进度。

### Q: 如何下载翻译后的文档？
A: 翻译完成后，`get_translation` 会返回 `target_file_url`，直接访问该链接下载。

### Q: npx 运行失败？
A: 确保 Node.js 版本 >= 18.0.0，并且设置了 SUPPR_API_KEY 环境变量。


## 🔗 Suppr超能文献产品

- **Zotero插件** : https://github.com/WildDataX/suppr-zotero-plugin
- **官方网站**：[https://suppr.wilddata.cn](https://suppr.wilddata.cn)
- **AI文档翻译**:https://suppr.wilddata.cn/translate/upload
- **API服务**:https://openapi.suppr.wilddata.cn/introduction
- **中文搜Pubmed**: https://suppr.wilddata.cn/
- **深度研究**：[https://suppr.wilddata.cn/deep-research](https://suppr.wilddata.cn/deep-research)  
- **GitHub组织**：[WildDataX](https://github.com/WildDataX)

## 技术支持

如需帮助，请联系：IT@wilddata.cn

Made with ❤️ by [WildData](https://wilddata.cn)
