// Roadmap content. Edit this file to change topics; the page renders everything from it.
window.ROADMAP = {
  title: "AI Engineering Roadmap",
  author: "Arunkumar Ravichandran",
  phases: [
    { id: 0, name: "Foundation", blurb: "Engineering and ML basics" },
    { id: 1, name: "Build", blurb: "LLM applications, RAG and agents" },
    { id: 2, name: "Production", blurb: "Measure, secure and ship" }
  ],
  stages: [
    {
      phase: 0, title: "Programming & Software Engineering", short: "Programming",
      summary: "Everything else sits on top of solid engineering. Get comfortable building and running real services.",
      outcome: "You can write a Python backend, store data, and run it in a container.",
      build: "A FastAPI service with a database, tests, and a Dockerfile.",
      takeaway: "AI engineering is software engineering first. The model is one dependency among many.",
      groups: [
        { name: "Python", leaves: ["Syntax and data structures", "Functions and modules", "Classes and OOP", "Async and await", "Type hints", "pytest basics"] },
        { name: "Backend", leaves: ["REST API design", "FastAPI", "Validation with Pydantic"] },
        { name: "Data", leaves: ["SQL", "NoSQL", "Caching with Redis"] },
        { name: "DevOps", leaves: ["Git and GitHub basics", "Docker", "Cloud basics"] }
      ]
    },
    {
      phase: 0, title: "AI/ML Foundations", short: "ML & Deep Learning",
      summary: "From classical machine learning to deep learning and Transformers. You will debug models far better if you know how they work inside.",
      outcome: "You can explain how models learn and why Transformers work.",
      build: "Train a classifier with scikit-learn, then a small neural network in PyTorch.",
      takeaway: "You do not need research-level math. You do need a clear mental model of training and evaluation.",
      groups: [
        { name: "Math and data", leaves: ["NumPy and Pandas", "Linear algebra basics", "Probability and statistics"] },
        { name: "Machine Learning", leaves: ["Supervised learning", "Unsupervised learning", "Overfitting and evaluation", "scikit-learn"] },
        { name: "Deep Learning", leaves: ["Neural networks", "Backpropagation", "PyTorch"] },
        { name: "NLP and Transformers", leaves: ["Tokenization", "Embeddings", "Attention", "Transformer architecture", "Fine-tuning basics"] }
      ]
    },
    {
      phase: 1, title: "Generative AI & LLM Engineering", short: "LLM APIs",
      summary: "Learn to work with large language models through their APIs and to control what goes into the context window.",
      outcome: "You can call an LLM, manage its context, and handle more than text.",
      build: "A chat endpoint that trims history to fit a token budget.",
      takeaway: "Context is the real input. What you put in the window decides the quality of the answer.",
      groups: [
        { name: "Model APIs", leaves: ["Provider APIs", "System prompts", "Sampling parameters"] },
        { name: "Context", leaves: ["Tokens and limits", "Context engineering", "History trimming and summaries"] },
        { name: "Modalities", leaves: ["Vision input", "Audio input and output", "Multimodal prompts"] }
      ]
    },
    {
      phase: 1, title: "LLM Application Engineering", short: "LLM apps",
      summary: "Turn a model call into a feature that is reliable, fast and affordable.",
      outcome: "You can ship an LLM feature that returns typed data, calls tools and controls cost.",
      build: "An extraction API that returns validated JSON and streams partial results.",
      takeaway: "Caching and model routing usually cut cost more than prompt tweaks do.",
      groups: [
        { name: "Reliable output", leaves: ["Structured outputs", "Schema validation", "Retries and fallbacks"] },
        { name: "Interaction", leaves: ["Tool calling", "Streaming responses"] },
        { name: "Efficiency", leaves: ["Semantic caching", "Model routing", "Cost optimization", "Latency tuning"] }
      ]
    },
    {
      phase: 1, title: "RAG Engineering", short: "RAG",
      summary: "Give the model your own data and keep its answers grounded in it.",
      outcome: "You can build retrieval that finds the right passages and improves with re-ranking.",
      build: "Question answering over your own documents with hybrid search and a re-ranker.",
      takeaway: "Bad retrieval is the top cause of bad RAG answers. Fix retrieval before you touch prompts.",
      groups: [
        { name: "Ingestion", leaves: ["Document parsing", "Chunking strategies", "Embeddings", "Vector databases"] },
        { name: "Retrieval", leaves: ["Hybrid search", "Re-ranking", "Query rewriting"] },
        { name: "Advanced", leaves: ["Graph RAG", "Citations and sources", "Handling no-answer cases"] }
      ]
    },
    {
      phase: 1, title: "AI Agents & Orchestration", short: "Agents",
      summary: "Systems that plan, use tools and remember. Learn to keep them controlled.",
      outcome: "You can design an agent with memory and run it as an explicit graph of steps.",
      build: "A research agent in LangGraph that plans, calls tools and keeps notes.",
      takeaway: "Give agents narrow jobs and explicit steps. Open-ended autonomy is hard to trust.",
      groups: [
        { name: "Core loop", leaves: ["Tool use loop", "Reasoning", "Planning"] },
        { name: "Memory", leaves: ["Short-term memory", "Long-term memory"] },
        { name: "Orchestration", leaves: ["LangGraph", "State and checkpoints", "Human in the loop", "Multi-agent patterns"] }
      ]
    },
    {
      phase: 2, title: "Evaluation & Observability", short: "Evals",
      summary: "You cannot improve what you do not measure. Build the habit early.",
      outcome: "You can score RAG and agent quality and trace every request end to end.",
      build: "A test set for your RAG app that runs on every change.",
      takeaway: "Write the evaluation set before you start tuning. Otherwise you are guessing.",
      groups: [
        { name: "Evaluation", leaves: ["Building test datasets", "RAG metrics", "Agent evaluation", "LLM as judge"] },
        { name: "Observability", leaves: ["Tracing with LangSmith", "Structured logs", "Cost and latency monitoring"] }
      ]
    },
    {
      phase: 2, title: "Security & Guardrails", short: "Security",
      summary: "The risks an enterprise will ask about before it lets you launch.",
      outcome: "You can block prompt injection, protect personal data and filter outputs.",
      build: "Add input checks, PII redaction and an output filter to your app.",
      takeaway: "Treat every retrieved document and tool result as untrusted input.",
      groups: [
        { name: "Threats", leaves: ["Prompt injection", "Data exfiltration", "PII leakage"] },
        { name: "Defenses", leaves: ["Input validation", "Output filtering", "Least-privilege tools", "Red teaming"] }
      ]
    },
    {
      phase: 2, title: "Deployment & Cloud Engineering", short: "Deploy",
      summary: "Ship it, keep it running, and scale it when traffic grows.",
      outcome: "You can deploy through CI/CD and scale on a cloud platform.",
      build: "A pipeline that tests, builds a container and deploys on every merge.",
      takeaway: "Deploy early. Production shows you problems that notebooks hide.",
      groups: [
        { name: "Delivery", leaves: ["CI/CD pipelines", "Containerization"] },
        { name: "Platforms", leaves: ["AWS", "GCP", "Azure"] },
        { name: "Operations", leaves: ["Scaling", "Rate limits", "Secrets management", "Rollbacks"] }
      ]
    }
  ]
};
