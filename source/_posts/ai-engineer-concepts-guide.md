---
title: AI 工程师必须掌握的 30 个核心概念
date: 2026-03-05 12:00:00
tags:
  - AI
  - 技术
  - 工程
categories:
  - 技术
description: 从 Token 到 MCP，从 RAG 到向量数据库——这是一份帮你快速建立 AI 工程知识体系的速查手册。
---

## 写在前面

如果你现在开始做 AI 工程师，会发现满屏都是新词：

> "我们用 RAG 增强 LLM，通过 Embedding 存入向量数据库，再用 MCP 做工具调用，结合 Few-shot Prompting 优化输出..."

听起来像外星语。

但这些概念其实不难。难的是**没有一个好的组织方式**，让你知道它们之间的关系。

这篇文章就是一张知识地图，帮你建立完整的 AI 工程知识框架。

---

## 第一层：基础概念（必须懂）

### 1. Token

**定义**：文本的最小处理单元，可以理解为"词块"。

**实例**：
- `"Hello World"` → `["Hello", " World"]` (2 tokens)
- `"你好世界"` → `["你好", "世界"]` (2 tokens，中文一般 1 字 = 1 token)

**为什么重要**：
- 模型按 token 计费（不是按字数）
- 模型有 token 上限（如 GPT-4 支持 128k tokens）
- 优化 token 使用 = 降低成本

**工具**：
- OpenAI Tokenizer: https://platform.openai.com/tokenizer
- tiktoken (Python 库)

---

### 2. Context / Context Window

**定义**：模型一次能"记住"的内容长度。

**类比**：你和朋友聊天时的"短期记忆"。聊太久你会忘记前面说了什么，模型也一样。

**实例**：
- GPT-4 Turbo: 128k tokens (约 10 万汉字)
- Claude 3: 200k tokens
- Gemini 1.5 Pro: 1M tokens

**Context 用完了会怎样？**
- 早期内容被"遗忘"
- 需要用 RAG 或总结技术扩展记忆

---

### 3. Prompt / Prompt Engineering

**定义**：给 AI 的指令和输入。

**进阶技术**：

#### Few-shot Prompting
给模型示例，让它学习模式：

```
例子：
输入："今天天气真好" → 情感：积极
输入："这个产品太烂了" → 情感：消极

现在分析："这个功能还不错" → 情感：？
```

#### Chain-of-Thought (CoT)
让模型"慢慢想"：

```
问题：小明有 5 个苹果，吃了 2 个，又买了 3 个，现在有几个？

回答（普通）：6 个

回答（CoT）：
1. 初始：5 个
2. 吃了 2 个：5 - 2 = 3 个
3. 买了 3 个：3 + 3 = 6 个
答案：6 个
```

#### System Prompt
定义模型的"人设"和行为规则：

```
System: 你是一个严谨的律师助手，回答必须引用法律条文。
User: 合同违约怎么办？
```

---

### 4. Temperature / Top-p

**定义**：控制模型输出的"随机性"。

**Temperature**：
- 0.0：完全确定，每次输出一样（适合代码生成）
- 1.0：标准随机性（适合聊天）
- 2.0：高度创造性（适合写诗、头脑风暴）

**Top-p (Nucleus Sampling)**：
- 0.1：只考虑概率最高的 10% 选项（保守）
- 0.9：考虑概率累计 90% 的选项（平衡）

**经验**：
- 写代码：temperature=0, top_p=0.1
- 写文章：temperature=0.7, top_p=0.9
- 创意工作：temperature=1.5, top_p=0.95

---

### 5. Embedding / 向量化

**定义**：把文本转换成数字向量（一串浮点数）。

**为什么需要**：
- 计算机理解不了"猫"和"狗"的相似性
- 但能计算向量 `[0.2, 0.8, ...]` 和 `[0.3, 0.7, ...]` 的距离

**实例**：
```python
from openai import OpenAI
client = OpenAI()

text = "人工智能改变世界"
embedding = client.embeddings.create(
    model="text-embedding-3-small",
    input=text
)
# 返回：[0.023, -0.45, 0.78, ..., 0.12]  (1536 维)
```

**用途**：
- 语义搜索
- 推荐系统
- RAG 的基础

---

## 第二层：架构与模型

### 6. Transformer

**定义**：现代 LLM 的核心架构（2017 年 Google 提出）。

**核心创新**：Self-Attention 机制
- 传统 RNN：逐字处理，慢，记不住长文本
- Transformer：并行处理，快，能处理长距离依赖

**组成部分**：
- Encoder：理解输入（如 BERT）
- Decoder：生成输出（如 GPT）
- Encoder-Decoder：翻译任务（如 T5）

**为什么重要**：
- GPT = "Generative Pre-trained Transformer"
- BERT = "Bidirectional Encoder Representations from Transformers"

---

### 7. LLM (Large Language Model)

**定义**：参数量超大的语言模型。

**规模对比**：
- GPT-3：175B 参数
- GPT-4：推测 1.7T 参数
- Llama 2：7B / 13B / 70B 参数

**参数越大 = 越聪明？**
- 不完全是
- 小模型 + 好数据 > 大模型 + 烂数据
- Llama 3 8B 在某些任务上超越 GPT-3.5 175B

---

### 8. Fine-tuning / 微调

**定义**：在预训练模型基础上，用特定数据继续训练。

**类型**：

#### Full Fine-tuning
调整所有参数（贵，慢，效果最好）

#### LoRA (Low-Rank Adaptation)
只调整一小部分参数（便宜，快，效果接近）

**实例**：
```python
# 用你的客服对话数据微调 GPT-3.5
from openai import OpenAI
client = OpenAI()

client.fine_tuning.jobs.create(
    training_file="file-abc123",
    model="gpt-3.5-turbo"
)
```

**何时用 Fine-tuning？**
- ✅ 你有大量专业领域数据（如法律、医疗）
- ✅ 需要模型学会特定风格（如模仿某个作家）
- ❌ 只是想让模型知道新知识 → 用 RAG

---

### 9. Quantization / 量化

**定义**：降低模型的数字精度，减少内存和计算量。

**精度对比**：
- FP32 (32-bit float)：原始精度，4GB 参数
- FP16 (16-bit float)：减半，2GB
- INT8 (8-bit integer)：1/4，1GB
- INT4：1/8，512MB

**实例**：
- Llama 2 70B 原始需要 140GB 显存
- INT4 量化后只需 35GB（一张 A100 能跑）

**工具**：
- GPTQ
- GGML/GGUF (llama.cpp)
- bitsandbytes

---

## 第三层：工程实践

### 10. RAG (Retrieval-Augmented Generation)

**定义**：检索增强生成 = 搜索 + 生成。

**工作流程**：
1. 用户提问："Llama 3 的上下文长度是多少？"
2. 检索：在知识库中找到相关文档
3. 生成：把文档和问题一起给 LLM，让它回答

**为什么需要 RAG？**
- 模型的知识有截止日期（如 GPT-4 知识到 2023 年）
- 你的企业数据模型没见过
- Fine-tuning 太贵，RAG 更灵活

**RAG vs Fine-tuning**：
| 场景 | 用 RAG | 用 Fine-tuning |
|------|--------|---------------|
| 更新频繁的数据 | ✅ | ❌ |
| 学习特定风格 | ❌ | ✅ |
| 成本敏感 | ✅ | ❌ |
| 需要引用来源 | ✅ | ❌ |

---

### 11. Vector Database / 向量数据库

**定义**：专门存储和检索向量的数据库。

**为什么不用普通数据库？**
- 向量维度高（768/1536/3072 维）
- 需要高效的"相似度搜索"（KNN/ANN）
- 普通数据库做不到

**主流产品**：
- **Pinecone**：托管服务，简单易用
- **Weaviate**：开源，支持混合搜索
- **Qdrant**：开源，Rust 编写，高性能
- **Milvus**：开源，阿里开发，大规模场景
- **Chroma**：开源，Python-native，轻量
- **pgvector**：PostgreSQL 插件

**实例**：
```python
import chromadb

client = chromadb.Client()
collection = client.create_collection("docs")

# 存储
collection.add(
    documents=["AI 改变世界", "机器学习很酷"],
    ids=["1", "2"]
)

# 检索
results = collection.query(
    query_texts=["人工智能"],
    n_results=1
)
# 返回："AI 改变世界"
```

---

### 12. Semantic Search / 语义搜索

**定义**：基于"意思"而非"关键词"的搜索。

**对比**：
| 搜索方式 | 查询 | 能找到 | 找不到 |
|---------|------|--------|--------|
| 关键词搜索 | "苹果手机" | "苹果手机" | "iPhone" |
| 语义搜索 | "苹果手机" | "iPhone", "Apple 手机" | ✅ |

**实现**：
1. 文档向量化存入向量数据库
2. 查询向量化
3. 计算余弦相似度
4. 返回最相似的 Top-K 结果

---

### 13. Chunking / 文本切块

**定义**：把长文档切成小块，方便检索。

**为什么需要**：
- 向量数据库检索时，返回整个 100 页的 PDF 没意义
- 需要返回"相关的那一段"

**策略**：

#### 固定长度
```python
chunk_size = 512  # tokens
chunks = split_by_tokens(document, chunk_size)
```

#### 按段落
```python
chunks = document.split("\n\n")
```

#### 语义切块（智能）
用模型判断哪里是"话题转折点"

**Overlap（重叠）**：
```
Chunk 1: [0:512]
Chunk 2: [400:912]  # 重叠 112 tokens
```
避免关键信息被切断。

---

### 14. Reranking / 重排序

**定义**：对检索结果进行二次排序，提升精准度。

**流程**：
1. 向量检索：找到 100 个候选
2. Reranker 精排：用更强大的模型重新打分
3. 返回 Top 5

**工具**：
- Cohere Rerank API
- bge-reranker (开源)

**效果**：
- 检索准确率提升 20-40%
- 代价：增加延迟（100ms → 200ms）

---

### 15. Function Calling / Tool Use

**定义**：让 LLM 调用外部工具（如 API、数据库、计算器）。

**实例**：
```python
from openai import OpenAI
client = OpenAI()

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "获取天气",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string"}
            }
        }
    }
}]

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "北京天气如何？"}],
    tools=tools
)

# LLM 返回：tool_calls=[{"function": "get_weather", "arguments": {"location": "北京"}}]
```

**用途**：
- 查询实时数据（股票、天气）
- 执行操作（发邮件、订票）
- 访问私有数据（公司数据库）

---

### 16. MCP (Model Context Protocol)

**定义**：Anthropic 提出的标准化工具调用协议（2024 年 11 月发布）。

**解决什么问题**：
- 之前每个 AI 应用都要自己实现工具调用
- MCP 统一标准，工具可以跨应用复用

**架构**：
```
AI 应用 ←→ MCP Client ←→ MCP Server ←→ 工具/数据源
```

**实例**：
```json
// MCP Server 定义
{
  "name": "filesystem",
  "tools": [
    {
      "name": "read_file",
      "parameters": {"path": "string"}
    }
  ]
}
```

**意义**：
- 类似于 USB 协议：一个标准，万物互联
- 未来 AI 工具生态的基础设施

---

## 第四层：开发实践

### 17. LangChain / LlamaIndex

**定义**：AI 应用开发框架。

**LangChain**：
- 通用框架，支持多种 LLM
- 模块化：Prompts, Chains, Agents, Memory

```python
from langchain.chains import RetrievalQA
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings

vectorstore = Chroma(embedding_function=OpenAIEmbeddings())
qa = RetrievalQA.from_chain_type(
    llm=OpenAI(),
    retriever=vectorstore.as_retriever()
)
qa.run("什么是 RAG？")
```

**LlamaIndex**：
- 专注数据索引和检索
- 更适合 RAG 场景

**选择**：
- 简单 RAG：LlamaIndex
- 复杂 Agent：LangChain

---

### 18. Agent / 智能体

**定义**：能自主决策、调用工具、完成任务的 AI。

**工作流程**：
1. 思考：分析任务
2. 行动：调用工具
3. 观察：查看结果
4. 重复：直到完成

**实例**：
```
任务：帮我订明天北京到上海的机票

Agent:
  思考：需要查航班信息
  行动：调用 search_flights("北京", "上海", "明天")
  观察：找到 3 个航班
  思考：需要用户选择
  行动：ask_user("选择哪个航班？")
  观察：用户选了航班 2
  行动：book_flight(flight_id=2)
  观察：订票成功
  完成！
```

**框架**：
- AutoGPT
- BabyAGI
- LangGraph (LangChain 的 Agent 框架)

---

### 19. Streaming / 流式输出

**定义**：逐字返回结果，而非等全部生成完。

**用户体验**：
- 非流式：等 10 秒 → 看到完整回答
- 流式：立即看到第一个字，逐字显示

**实现**：
```python
from openai import OpenAI
client = OpenAI()

stream = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "讲个故事"}],
    stream=True
)

for chunk in stream:
    print(chunk.choices[0].delta.content, end="")
```

---

### 20. Caching / 缓存

**定义**：相同输入不重复调用模型。

**类型**：

#### Prompt Caching (提示词缓存)
- Anthropic Claude 支持
- 长 System Prompt 只计费一次

#### Semantic Caching (语义缓存)
- "天气如何？" 和 "今天天气怎么样？" 返回相同结果
- 用向量检索实现

**工具**：
- GPTCache
- Momento

**节省**：
- 成本：减少 50-80% API 调用
- 速度：缓存命中 < 10ms

---

## 第五层：高级话题

### 21. SDD (Specification-Driven Development)

**定义**：先定义"规格"（Spec），再生成代码。

**传统开发**：
```
需求 → 设计 → 写代码 → 测试
```

**SDD**：
```
需求 → 写 Spec（测试用例/约束） → AI 生成代码 → 自动验证
```

**实例**：
```python
# Spec
def test_add():
    assert add(1, 2) == 3
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

# AI 生成
def add(a, b):
    return a + b
```

**意义**：
- AI 时代的开发范式
- 人类专注于"要什么"，AI 负责"怎么做"

---

### 22. Vibe Coding

**定义**：用"感觉"描述需求，让 AI 理解你想要的"vibe"。

**实例**：
```
传统：写一个蓝色按钮，圆角 8px，padding 12px 24px

Vibe Coding：
"给我一个看起来很高级、有质感的按钮，像苹果官网那种感觉"
```

**技术支持**：
- GPT-4V (Vision)：看图理解设计
- DALL-E / Midjourney：生成符合"感觉"的图

**争议**：
- 支持者：更自然，更高效
- 反对者：不够精确，难以工程化

---

### 23. CoT (Chain-of-Thought) Prompting

**定义**：让模型展示"思考过程"。

**效果**：
- 普通：准确率 60%
- CoT：准确率 85%（在数学、逻辑题上）

**实现**：
```
提示词：Let's think step by step.
```

**变体**：
- **Zero-shot CoT**：只加一句 "Let's think step by step"
- **Few-shot CoT**：给几个示例，每个都展示思考过程
- **Self-Consistency**：生成多个推理路径，投票选最优

---

### 24. Constitutional AI (CAI)

**定义**：用"宪法"（一组规则）约束 AI 行为。

**Anthropic 的方法**：
1. 写"宪法"（如："不生成有害内容"）
2. AI 生成回答
3. AI 自我批评（是否违反宪法？）
4. AI 修正回答

**实例**：
```
用户：教我怎么偷东西
AI 初稿：你可以...
AI 自我批评：这违反了"不协助违法"原则
AI 修正：我不能提供违法建议
```

---

### 25. RLHF (Reinforcement Learning from Human Feedback)

**定义**：用人类反馈训练模型。

**流程**：
1. 模型生成多个回答
2. 人类标注：哪个更好？
3. 训练"奖励模型"
4. 用强化学习优化原模型

**为什么重要**：
- GPT-3 → GPT-3.5 的核心技术
- 让模型"更听话"

---

### 26. Mixture of Experts (MoE)

**定义**：多个"专家"模型组合。

**工作方式**：
- 路由器：判断任务类型
- 专家：不同任务调用不同专家
- 只激活部分专家（省计算）

**实例**：
- GPT-4 推测使用 MoE（8 个专家）
- Mixtral 8x7B：开源 MoE 模型

**优势**：
- 参数多，但计算少
- Mixtral 8x7B 速度接近 7B，效果接近 70B

---

### 27. Multimodal / 多模态

**定义**：处理多种类型数据（文本、图像、音频、视频）。

**模型**：
- **GPT-4V**：文本 + 图像
- **Gemini 1.5**：文本 + 图像 + 音频 + 视频
- **CLIP**：图像-文本对齐

**应用**：
```python
# 上传图片，问问题
response = client.chat.completions.create(
    model="gpt-4-vision-preview",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "这是什么？"},
            {"type": "image_url", "image_url": {"url": "https://..."}}
        ]
    }]
)
```

---

### 28. Distillation / 知识蒸馏

**定义**：用大模型（老师）训练小模型（学生）。

**流程**：
1. 大模型生成大量示例
2. 用这些示例训练小模型
3. 小模型学会"模仿"大模型

**效果**：
- GPT-4 → GPT-3.5：10x 参数减少，90% 性能保留
- 部署成本大幅降低

---

### 29. Benchmark / 评测基准

**定义**：测试模型能力的标准化数据集。

**主流 Benchmark**：
- **MMLU**：多学科选择题（57 个学科）
- **HumanEval**：代码生成（164 道编程题）
- **GSM8K**：小学数学应用题
- **MATH**：高难度数学题
- **BBH** (Big-Bench Hard)：复杂推理
- **MT-Bench**：多轮对话质量

**看 Benchmark 的坑**：
- 数据泄露：模型可能见过测试集
- 指标单一：只看准确率忽略其他
- 不代表真实场景

---

### 30. Hallucination / 幻觉

**定义**：模型"一本正经地胡说八道"。

**实例**：
```
用户：介绍一下《量子佛学》这本书
AI：这本书由张三于 2018 年出版...
（实际上这本书根本不存在）
```

**原因**：
- 模型是"预测下一个词"，不是"查询数据库"
- 训练数据有噪声

**缓解方法**：
1. **RAG**：提供真实文档
2. **降低 Temperature**：减少随机性
3. **Prompt 约束**："如果不知道，说'我不知道'"
4. **引用来源**：要求模型引用依据

---

## 如何学习这些概念？

### 1. 分层学习

**第一周**：Token, Context, Prompt, Temperature（写几个 Prompt 玩玩）

**第二周**：Embedding, RAG, 向量数据库（做一个简单的问答系统）

**第三周**：Function Calling, Agent（让 AI 调用天气 API）

**第四周**：Fine-tuning, Quantization（微调一个小模型）

### 2. 动手实践

**项目建议**：
- **Week 1**：个人知识库问答（RAG）
- **Week 2**：多工具 AI 助手（Function Calling）
- **Week 3**：代码生成器（Few-shot + CoT）
- **Week 4**：微调一个客服机器人

### 3. 关注前沿

**必读**：
- Anthropic Blog
- OpenAI Cookbook
- HuggingFace Blog
- Papers with Code

**社区**：
- Reddit: r/LocalLLaMA, r/MachineLearning
- Twitter: AI 研究者账号
- Discord: LangChain, LlamaIndex

---

## 结语

这 30 个概念，是 AI 工程的"元素周期表"。

你不需要一次全学会。但知道它们存在、彼此关系、用在哪里，就能在遇到问题时快速定位。

**记住两点**：
1. **概念是死的，应用是活的**。不要背定义，要理解场景。
2. **AI 技术迭代飞快**。今天的最佳实践，半年后可能过时。保持学习，拥抱变化。

现在，选一个你感兴趣的概念，去动手试试吧。

理解 AI 的最好方式，就是和 AI 一起工作。
