---
title: "30 Core Concepts Every AI Engineer Must Know"
date: 2026-03-05 12:00:00
tags:
  - AI
  - Technology
  - Engineering
  - English
categories:
  - English
lang: en
description: From Token to MCP, from RAG to Vector Databases—a quick reference guide to help you rapidly build your AI engineering knowledge framework.
---

## Before We Start

If you're starting as an AI engineer now, you'll find your screen full of new terms:

> "We use RAG to enhance LLM, store via Embedding in vector database, use MCP for tool calling, combine with Few-shot Prompting to optimize output..."

Sounds like alien language.

But these concepts aren't actually hard. What's hard is **lacking a good organizational structure** to understand their relationships.

This article is a knowledge map to help you build a complete AI engineering knowledge framework.

---

## Layer 1: Foundational Concepts (Must Know)

### 1. Token

**Definition**: The smallest unit of text processing, think of it as "word chunks."

**Examples**:
- `"Hello World"` → `["Hello", " World"]` (2 tokens)
- `"你好世界"` → `["你好", "世界"]` (2 tokens, Chinese typically 1 char = 1 token)

**Why Important**:
- Models charge by token (not by word count)
- Models have token limits (e.g., GPT-4 supports 128k tokens)
- Optimizing token usage = reducing costs

**Tools**:
- OpenAI Tokenizer: https://platform.openai.com/tokenizer
- tiktoken (Python library)

---

### 2. Context / Context Window

**Definition**: The length of content a model can "remember" at once.

**Analogy**: Like your "short-term memory" when chatting with friends. Chat too long and you forget what you said earlier—models are the same.

**Examples**:
- GPT-4 Turbo: 128k tokens (~100k Chinese characters)
- Claude 3: 200k tokens
- Gemini 1.5 Pro: 1M tokens

**What happens when context runs out?**
- Early content gets "forgotten"
- Need RAG or summarization techniques to extend memory

---

### 3. Prompt / Prompt Engineering

**Definition**: Instructions and inputs given to AI.

**Advanced Techniques**:

#### Few-shot Prompting
Give the model examples to learn patterns:

```
Examples:
Input: "Great weather today" → Sentiment: Positive
Input: "This product is terrible" → Sentiment: Negative

Now analyze: "This feature is pretty good" → Sentiment: ?
```

#### Chain-of-Thought (CoT)
Make the model "think slowly":

```
Question: Ming has 5 apples, ate 2, bought 3 more. How many now?

Answer (regular): 6

Answer (CoT):
1. Initial: 5
2. Ate 2: 5 - 2 = 3
3. Bought 3: 3 + 3 = 6
Answer: 6
```

#### System Prompt
Define the model's "persona" and behavioral rules:

```
System: You are a rigorous legal assistant. Answers must cite legal provisions.
User: What to do about contract breach?
```

---

### 4. Temperature / Top-p

**Definition**: Controls output "randomness."

**Temperature**:
- 0.0: Completely deterministic, same output every time (good for code)
- 1.0: Standard randomness (good for chat)
- 2.0: Highly creative (good for poetry, brainstorming)

**Top-p (Nucleus Sampling)**:
- 0.1: Only consider top 10% probability options (conservative)
- 0.9: Consider options with cumulative 90% probability (balanced)

**Experience**:
- Code writing: temperature=0, top_p=0.1
- Article writing: temperature=0.7, top_p=0.9
- Creative work: temperature=1.5, top_p=0.95

---

### 5. Embedding / Vectorization

**Definition**: Converting text into numerical vectors (a series of floating-point numbers).

**Why Needed**:
- Computers don't understand similarity between "cat" and "dog"
- But can calculate distance between vectors `[0.2, 0.8, ...]` and `[0.3, 0.7, ...]`

**Example**:
```python
from openai import OpenAI
client = OpenAI()

text = "AI changes the world"
embedding = client.embeddings.create(
    model="text-embedding-3-small",
    input=text
)
# Returns: [0.023, -0.45, 0.78, ..., 0.12]  (1536 dimensions)
```

**Uses**:
- Semantic search
- Recommendation systems
- Foundation of RAG

---

## Layer 2: Architecture & Models

### 6. Transformer

**Definition**: Core architecture of modern LLMs (proposed by Google in 2017).

**Core Innovation**: Self-Attention mechanism
- Traditional RNN: processes word-by-word, slow, can't remember long texts
- Transformer: parallel processing, fast, handles long-distance dependencies

**Components**:
- Encoder: understand input (like BERT)
- Decoder: generate output (like GPT)
- Encoder-Decoder: translation tasks (like T5)

**Why Important**:
- GPT = "Generative Pre-trained Transformer"
- BERT = "Bidirectional Encoder Representations from Transformers"

---

### 7. LLM (Large Language Model)

**Definition**: Language models with extremely large parameter counts.

**Scale Comparison**:
- GPT-3: 175B parameters
- GPT-4: estimated 1.7T parameters
- Llama 2: 7B / 13B / 70B parameters

**Bigger parameters = smarter?**
- Not entirely
- Small model + good data > large model + bad data
- Llama 3 8B outperforms GPT-3.5 175B on certain tasks

---

### 8. Fine-tuning

**Definition**: Continue training on a pre-trained model with specific data.

**Types**:

#### Full Fine-tuning
Adjust all parameters (expensive, slow, best results)

#### LoRA (Low-Rank Adaptation)
Only adjust a small portion of parameters (cheap, fast, near-comparable results)

**Example**:
```python
# Fine-tune GPT-3.5 with your customer service dialogue data
from openai import OpenAI
client = OpenAI()

client.fine_tuning.jobs.create(
    training_file="file-abc123",
    model="gpt-3.5-turbo"
)
```

**When to use Fine-tuning?**
- ✅ You have large amounts of domain-specific data (legal, medical)
- ✅ Need model to learn specific style (mimic a writer)
- ❌ Just want model to know new information → use RAG

---

### 9. Quantization

**Definition**: Reduce model's numerical precision to decrease memory and computation.

**Precision Comparison**:
- FP32 (32-bit float): original precision, 4GB parameters
- FP16 (16-bit float): halved, 2GB
- INT8 (8-bit integer): 1/4, 1GB
- INT4: 1/8, 512MB

**Example**:
- Llama 2 70B originally needs 140GB VRAM
- INT4 quantized only needs 35GB (runs on one A100)

**Tools**:
- GPTQ
- GGML/GGUF (llama.cpp)
- bitsandbytes

---

## Layer 3: Engineering Practice

### 10. RAG (Retrieval-Augmented Generation)

**Definition**: Retrieval-Augmented Generation = Search + Generation.

**Workflow**:
1. User asks: "What's Llama 3's context length?"
2. Retrieve: find relevant docs in knowledge base
3. Generate: give LLM both docs and question, let it answer

**Why Need RAG?**
- Model knowledge has cutoff date (e.g., GPT-4 knowledge to 2023)
- Your enterprise data model hasn't seen
- Fine-tuning too expensive, RAG more flexible

**RAG vs Fine-tuning**:
| Scenario | Use RAG | Use Fine-tuning |
|----------|---------|----------------|
| Frequently updated data | ✅ | ❌ |
| Learn specific style | ❌ | ✅ |
| Cost-sensitive | ✅ | ❌ |
| Need source citations | ✅ | ❌ |

---

### 11. Vector Database

**Definition**: Database specialized for storing and retrieving vectors.

**Why not regular database?**
- High vector dimensions (768/1536/3072 dims)
- Need efficient "similarity search" (KNN/ANN)
- Regular databases can't do it

**Mainstream Products**:
- **Pinecone**: managed service, easy to use
- **Weaviate**: open source, supports hybrid search
- **Qdrant**: open source, Rust-written, high performance
- **Milvus**: open source, Alibaba-developed, large-scale scenarios
- **Chroma**: open source, Python-native, lightweight
- **pgvector**: PostgreSQL plugin

**Example**:
```python
import chromadb

client = chromadb.Client()
collection = client.create_collection("docs")

# Store
collection.add(
    documents=["AI changes world", "Machine learning is cool"],
    ids=["1", "2"]
)

# Retrieve
results = collection.query(
    query_texts=["artificial intelligence"],
    n_results=1
)
# Returns: "AI changes world"
```

---

### 12. Semantic Search

**Definition**: Search based on "meaning" rather than "keywords."

**Comparison**:
| Search Type | Query | Can Find | Can't Find |
|------------|-------|----------|------------|
| Keyword Search | "Apple phone" | "Apple phone" | "iPhone" |
| Semantic Search | "Apple phone" | "iPhone", "Apple mobile" | ✅ |

**Implementation**:
1. Document vectorization stored in vector database
2. Query vectorization
3. Calculate cosine similarity
4. Return most similar Top-K results

---

### 13. Chunking

**Definition**: Split long documents into small chunks for easier retrieval.

**Why Needed**:
- When vector database retrieves, returning entire 100-page PDF is meaningless
- Need to return "the relevant section"

**Strategies**:

#### Fixed Length
```python
chunk_size = 512  # tokens
chunks = split_by_tokens(document, chunk_size)
```

#### By Paragraph
```python
chunks = document.split("\n\n")
```

#### Semantic Chunking (Smart)
Use model to determine "topic transition points"

**Overlap**:
```
Chunk 1: [0:512]
Chunk 2: [400:912]  # overlap 112 tokens
```
Avoid cutting off key information.

---

### 14. Reranking

**Definition**: Second-pass ranking of retrieval results to improve precision.

**Flow**:
1. Vector retrieval: find 100 candidates
2. Reranker precision ranking: use stronger model to re-score
3. Return Top 5

**Tools**:
- Cohere Rerank API
- bge-reranker (open source)

**Effect**:
- Retrieval accuracy improved 20-40%
- Cost: increased latency (100ms → 200ms)

---

### 15. Function Calling / Tool Use

**Definition**: Let LLM call external tools (like API, database, calculator).

**Example**:
```python
from openai import OpenAI
client = OpenAI()

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get weather",
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
    messages=[{"role": "user", "content": "What's Beijing weather?"}],
    tools=tools
)

# LLM returns: tool_calls=[{"function": "get_weather", "arguments": {"location": "Beijing"}}]
```

**Uses**:
- Query real-time data (stocks, weather)
- Execute operations (send email, book tickets)
- Access private data (company database)

---

### 16. MCP (Model Context Protocol)

**Definition**: Standardized tool calling protocol proposed by Anthropic (released Nov 2024).

**What Problem Does It Solve**:
- Previously each AI app had to implement tool calling themselves
- MCP unifies standard, tools can be reused across apps

**Architecture**:
```
AI App ←→ MCP Client ←→ MCP Server ←→ Tools/Data Sources
```

**Example**:
```json
// MCP Server definition
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

**Significance**:
- Like USB protocol: one standard, universal connectivity
- Future infrastructure for AI tool ecosystem

---

## Layer 4: Development Practice

### 17. LangChain / LlamaIndex

**Definition**: AI application development frameworks.

**LangChain**:
- General framework, supports multiple LLMs
- Modular: Prompts, Chains, Agents, Memory

```python
from langchain.chains import RetrievalQA
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings

vectorstore = Chroma(embedding_function=OpenAIEmbeddings())
qa = RetrievalQA.from_chain_type(
    llm=OpenAI(),
    retriever=vectorstore.as_retriever()
)
qa.run("What is RAG?")
```

**LlamaIndex**:
- Focuses on data indexing and retrieval
- Better suited for RAG scenarios

**Choice**:
- Simple RAG: LlamaIndex
- Complex Agent: LangChain

---

### 18. Agent

**Definition**: AI that can autonomously make decisions, call tools, and complete tasks.

**Workflow**:
1. Think: analyze task
2. Act: call tool
3. Observe: check results
4. Repeat: until complete

**Example**:
```
Task: Book me a flight from Beijing to Shanghai tomorrow

Agent:
  Think: need to search flight info
  Act: call search_flights("Beijing", "Shanghai", "tomorrow")
  Observe: found 3 flights
  Think: need user to choose
  Act: ask_user("Which flight?")
  Observe: user chose flight 2
  Act: book_flight(flight_id=2)
  Observe: booking successful
  Complete!
```

**Frameworks**:
- AutoGPT
- BabyAGI
- LangGraph (LangChain's Agent framework)

---

### 19. Streaming

**Definition**: Return results word-by-word instead of waiting for complete generation.

**User Experience**:
- Non-streaming: wait 10s → see complete answer
- Streaming: immediately see first word, display progressively

**Implementation**:
```python
from openai import OpenAI
client = OpenAI()

stream = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Tell me a story"}],
    stream=True
)

for chunk in stream:
    print(chunk.choices[0].delta.content, end="")
```

---

### 20. Caching

**Definition**: Don't repeatedly call model for same input.

**Types**:

#### Prompt Caching
- Anthropic Claude supports
- Long System Prompt only charged once

#### Semantic Caching
- "How's the weather?" and "What's the weather like today?" return same result
- Implemented using vector retrieval

**Tools**:
- GPTCache
- Momento

**Savings**:
- Cost: reduce 50-80% API calls
- Speed: cache hit < 10ms

---

## Layer 5: Advanced Topics

### 21. SDD (Specification-Driven Development)

**Definition**: Define "specification" (Spec) first, then generate code.

**Traditional Development**:
```
Requirements → Design → Write Code → Test
```

**SDD**:
```
Requirements → Write Spec (test cases/constraints) → AI generates code → Auto-validate
```

**Example**:
```python
# Spec
def test_add():
    assert add(1, 2) == 3
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

# AI generates
def add(a, b):
    return a + b
```

**Significance**:
- Development paradigm for AI era
- Humans focus on "what to build," AI handles "how to build"

---

### 22. Vibe Coding

**Definition**: Describe requirements using "feeling," let AI understand your desired "vibe."

**Example**:
```
Traditional: Write a blue button, border-radius 8px, padding 12px 24px

Vibe Coding:
"Give me a button that looks premium and textured, like Apple's website"
```

**Technical Support**:
- GPT-4V (Vision): see image, understand design
- DALL-E / Midjourney: generate images matching "feeling"

**Controversy**:
- Supporters: more natural, more efficient
- Critics: not precise enough, hard to engineer

---

### 23. CoT (Chain-of-Thought) Prompting

**Definition**: Make model show "thinking process."

**Effect**:
- Regular: 60% accuracy
- CoT: 85% accuracy (on math, logic problems)

**Implementation**:
```
Prompt: Let's think step by step.
```

**Variants**:
- **Zero-shot CoT**: just add "Let's think step by step"
- **Few-shot CoT**: give examples, each showing thinking process
- **Self-Consistency**: generate multiple reasoning paths, vote for best

---

### 24. Constitutional AI (CAI)

**Definition**: Constrain AI behavior with "constitution" (set of rules).

**Anthropic's Method**:
1. Write "constitution" (e.g., "don't generate harmful content")
2. AI generates answer
3. AI self-critiques (violate constitution?)
4. AI corrects answer

**Example**:
```
User: Teach me how to steal
AI draft: You can...
AI self-critique: This violates "don't assist in illegal activities"
AI correction: I can't provide illegal advice
```

---

### 25. RLHF (Reinforcement Learning from Human Feedback)

**Definition**: Train model using human feedback.

**Flow**:
1. Model generates multiple answers
2. Human labels: which is better?
3. Train "reward model"
4. Use reinforcement learning to optimize original model

**Why Important**:
- Core technology from GPT-3 → GPT-3.5
- Makes model "more obedient"

---

### 26. Mixture of Experts (MoE)

**Definition**: Combination of multiple "expert" models.

**How It Works**:
- Router: determines task type
- Experts: different tasks call different experts
- Only activate some experts (saves computation)

**Example**:
- GPT-4 speculated to use MoE (8 experts)
- Mixtral 8x7B: open source MoE model

**Advantages**:
- Many parameters, but less computation
- Mixtral 8x7B speed close to 7B, performance close to 70B

---

### 27. Multimodal

**Definition**: Process multiple data types (text, images, audio, video).

**Models**:
- **GPT-4V**: text + images
- **Gemini 1.5**: text + images + audio + video
- **CLIP**: image-text alignment

**Application**:
```python
# Upload image, ask question
response = client.chat.completions.create(
    model="gpt-4-vision-preview",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "What is this?"},
            {"type": "image_url", "image_url": {"url": "https://..."}}
        ]
    }]
)
```

---

### 28. Distillation

**Definition**: Use large model (teacher) to train small model (student).

**Flow**:
1. Large model generates many examples
2. Use these examples to train small model
3. Small model learns to "mimic" large model

**Effect**:
- GPT-4 → GPT-3.5: 10x parameter reduction, 90% performance retained
- Deployment costs drastically reduced

---

### 29. Benchmark

**Definition**: Standardized datasets for testing model capabilities.

**Mainstream Benchmarks**:
- **MMLU**: multidisciplinary multiple choice (57 subjects)
- **HumanEval**: code generation (164 programming problems)
- **GSM8K**: elementary school math word problems
- **MATH**: high-difficulty math problems
- **BBH** (Big-Bench Hard): complex reasoning
- **MT-Bench**: multi-turn dialogue quality

**Pitfalls When Reading Benchmarks**:
- Data leakage: model may have seen test set
- Single metric: only looking at accuracy ignores others
- Doesn't represent real scenarios

---

### 30. Hallucination

**Definition**: Model "confidently making things up."

**Example**:
```
User: Introduce the book "Quantum Buddhism"
AI: This book was published by Zhang San in 2018...
(Actually this book doesn't exist)
```

**Causes**:
- Model "predicts next word," not "queries database"
- Training data has noise

**Mitigation Methods**:
1. **RAG**: provide real documents
2. **Lower Temperature**: reduce randomness
3. **Prompt Constraints**: "If you don't know, say 'I don't know'"
4. **Cite Sources**: require model to cite evidence

---

## How to Learn These Concepts?

### 1. Layered Learning

**Week 1**: Token, Context, Prompt, Temperature (write some prompts and play)

**Week 2**: Embedding, RAG, Vector Database (make simple Q&A system)

**Week 3**: Function Calling, Agent (let AI call weather API)

**Week 4**: Fine-tuning, Quantization (fine-tune a small model)

### 2. Hands-on Practice

**Project Suggestions**:
- **Week 1**: Personal knowledge base Q&A (RAG)
- **Week 2**: Multi-tool AI assistant (Function Calling)
- **Week 3**: Code generator (Few-shot + CoT)
- **Week 4**: Fine-tune a customer service bot

### 3. Follow Cutting Edge

**Must Read**:
- Anthropic Blog
- OpenAI Cookbook
- HuggingFace Blog
- Papers with Code

**Communities**:
- Reddit: r/LocalLLaMA, r/MachineLearning
- Twitter: AI researcher accounts
- Discord: LangChain, LlamaIndex

---

## Conclusion

These 30 concepts are the "periodic table" of AI engineering.

You don't need to learn them all at once. But knowing they exist, their relationships, and where they're used lets you quickly pinpoint issues when encountering problems.

**Remember two points**:
1. **Concepts are static, applications are dynamic**. Don't memorize definitions, understand scenarios.
2. **AI technology iterates rapidly**. Today's best practices may be outdated in six months. Keep learning, embrace change.

Now, choose a concept that interests you and try it hands-on.

The best way to understand AI is to work with AI.
