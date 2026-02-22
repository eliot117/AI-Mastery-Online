import { AITool } from './types';

export const GALAXY_FOLDERS: Record<string, AITool[]> = {
  "Agents": [
    { id: 'm1', name: "Prompt Master", url: "https://claude.ai/chat/9fcc0bb7-a387-47e1-821a-ed788b2bd10a", description: "Prompt Master", category: "Main", icon: "🎭" },
    { id: 'm2', name: "Manus", url: "https://manus.im/app", description: "Universal Agent", category: "Main", icon: "🧠" },
    { id: 'm3', name: "Genspark", url: "https://www.genspark.ai/", description: "All-in-One Workspace", category: "Main", icon: "💫" },
    { id: 'm4', name: "Runable", url: "https://runable.com/", description: "AI Execution", category: "Main", icon: "🏃" },
    { id: 'm5', name: "Design Arena", url: "https://www.designarena.ai/", description: "Visual Playground", category: "Main", icon: "🎨" },
    { id: 'm6', name: "AI Studio", url: "https://aistudio.google.com/prompts/new_chat", description: "Google AI Studio", category: "Main", icon: "🛠️" },
    { id: 'm7', name: "Claude", url: "https://claude.ai/new", description: "Anthropic's Assistant", category: "Main", icon: "🤖" },
    { id: 'm8', name: "Gemini", url: "https://gemini.google.com/u/1/app", description: "Google Gemini", category: "Main", icon: "💎" },
    { id: 'm9', name: "Perplexity", url: "https://www.perplexity.ai/", description: "AI Search Engine", category: "Main", icon: "🔍" },
    { id: 'm10', name: "ChatGPT", url: "https://chatgpt.com/", description: "OpenAI ChatGPT", category: "Main", icon: "💬" },
    { id: 'm11', name: "Grok", url: "https://grok.com/", description: "xAI Grok", category: "Main", icon: "🐦" },
    { id: 'm12', name: "DeepSeek", url: "https://chat.deepseek.com/", description: "Reasoning AI", category: "Main", icon: "🌊" }
  ]
};