import { AITool } from './types';

/**
 * HIGH-TECH MINIMALIST LOGO PROTOCOLS:
 * - Direct-on-surface: No gray boxes, borders, or nested backgrounds.
 * - Optimized SVGs: Recreated for maximum sharpness and branding accuracy.
 */

// REFINED BRANDING ASSETS (MATCHING UPLOADED IMAGES)
const ANIMEJS_LOGO = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0OCIgZmlsbD0iIzExMSIvPgogIDxwYXRoIGQ9Ik02NSA3NWgtOHYtNGMtMyAzLTcgNS0xMiA1LTkgMC0xNS01LTE1LTEzczYtMTMgMTUtMTNjNSAwIDkgMiAxMiA1VjQwYzAtNi00LTktMTAtOXMtMTAgMy0xMCA5aC04YzAtMTEgNy0xNyAxOC0xN3MxOCA2IDE4IDE3djM1eiBNNTcgNThjLTItMy01LTQtOS00LTUgMC04IDItOCA1czMgNSA4IDVjNCAwIDctMSA5LTRWNTgiIGZpbGw9IndoaXRlIi8+CiAgPHJlY3QgeD0iNjUiIHk9IjI1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiNGRjRENEQiIHRyYW5zZm9ybT0icm90YXRlKDE1IDcyLjUgMzIuNSkiLz4KPC9zdmc+";
const ONEPAGE_LOGO = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgcng9IjEyMCIgZmlsbD0iIzAwNjhGRiIvPgogIDxwYXRoIGQ9Ik0yNTYgMTI4YzcwIDAgMTI4IDU4IDEyOCAxMjh2NjRjMCA3MC01OCAxMjgtMTI4IDEyOGgtNjR2LTExNWg2NGE0OCA0OCAwIDAgMCAwLTk2aC02NHYxMTVoLTY0VjI1NmMwLTcwIDU4LTEyOCAxMjgtMTI4eiIgZmlsbD0id2hpdGUiLz4KICA8cmVjdCB4PSIzMjAiIHk9IjI1NiIgd2lkdGg9IjY0IiBoZWlnaHQ9IjUxMiIgcng9IjgiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==";

// STRICT ISOLATION: DO NOT TOUCH
const TWAIN_GPT_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgNjAiPjx0ZXh0IHg9IjEwIHg9IjQyIiBmb250LWZhbWlseT0iT3V0Zml0LCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iNjAwIiBmb250LXNpemU9IjM0IiBmaWxsPSJ3aGl0ZSI+dHdhaW48L3RleHQ+PHJlY3QgeD0iMTA1IiB5PSIxNCIgd2lkdGg9IjU0IiBoZWlnaHQ9IjM4IiByeD0iOCIgZmlsbD0iIzI1NjNlYiIvPjx0ZXh0IHg9IjEzMiIgeT0iNDAiIGZvbnQtZmFtaWx5PSJPdXRmaXQsIHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI3MDAiIGZvbnQtc2l6ZT0iMjIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5HUFQ8L3RleHQ+PC9zdmc+";
const OPAL_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgNjAiPjx0ZXh0IHg9IjYwIiB5PSI0MiIgZm9udC1mYW1pbHk9Ik91dGZpdCwgc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjcwMCIgZm9udC1zaXplPSIzOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk9wYWw8L3RleHQ+PC9zdmc+";
const PHYGITAL_PLUS_LOGO = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDMwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM4YjVjZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlYzQ4OTkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48dGV4dCB4PSI1MCUiIHk9IjcwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Ik91dGZpdCwgSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI4MDAiIGZvbnQtc2l6ZT0iNjQiIGZpbGw9InVybCgjZzEpIj5QaHlnaXRhbCs8L3RleHQ+PC9zdmc+";
const KIMI_AI_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjIwIiBmaWxsPSIjMDI3QUZGIi8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAsIDIwKSBzY2FsZSgyLjUpIj48cGF0aCBkPSJNMTkuNzM4IDUuNzc2Yy4xNjMtLjIwOS4zMDYtLjQuNDU3LS41ODUuMDctLjA4Ny4wNjQtLjE1My0uMDA0LS4yNDQtLjY1NS0uODYxLS43MTctMS44MTctLjM0LTIuNzg3LjI4My0uNzMuOTA5LTEuMDcyIDEuNjc0LTEuMTQ1LjQ3Ny0uMDQ1Ljk0NS4wMDQgMS4zNzkuMjM2LjU3LjMwNS45MDIuNzcgMS4wMSAxLjQxMi4wODYuNTEyLjA3IDEuMDEyLS4wNzUgMS41MDgtLjI1N0wyMS40OTIgNi4wMjhjLS43MTguMDk2LTEuNDQ2LjEwOC0yLjE3LjE1Ny0uMDU2LjAwNC0uMTEzIDAtLjE3OCAweiIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMTcuOTYyIDEuODQ0hC00LjMyNmwtMy40MjUgNy44MUg1LjM2OVYxLjg3OEgxLjVWMjJoMy44N3YtOC40NzdoNi44MjRhMy4wMjUgMy4wMjUgMCAwMDIuNzQzLTEuNzVWMjJoMy44N3YtOC40NzdhMy44NyAzLjg3IDAgMDAtMy41ODgtMy44NnYtLjAxaC0yLjEyNWEzLjk0IDMuOTQgMCAwMDIuMzIzLTIuMTJsMi41NDUtNS42ODl6IiBmaWxsPSJ3aGl0ZSIvPjwvZz48L3N2Zz4=";
const FORWARD_FUTURE_LOGO = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJoYWxvR3JhZCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNlZjQ0NDQiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjM2I4MmY2IiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ4IiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjaGFsb0dyYWQpIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuNiIgLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MCwgNTApIHNjYWxlKDAuNikgdHJhbnNsYXRlKC01MCwgLTUwKSI+PHBhdGggZD0iTTM1IDg1IEw2NSA1NSBMNzAgMTAwIEwzMCAxMDAgWiIgZmlsbD0id2hpdGUiIC8+PHBhdGggZD0iTTUwIDE1IEMyNSAxNSAyNSA4MCA1MCA4MCBDNzUgODAgNzUgMTUgNTAgMTUgWiIgZmlsbD0id2hpdGUiIC8+PHBhdGggZD0iTTMyIDM1IEMzMiAyOCA2OCAyOCA2OCAzNSBDNjggNTUgMzIgNTUgMzIgMzUgWiIgZmlsbD0iIzBmMTcyYSIgLz48cmVjdCB4PSI1OCIgeT0iMzIiIHdpZHRoPSI1IiBoZWlnaHQ9IjIiIGZpbGw9IiNlZjQ0NDQiIHJ4PSIxIiB0cmFuc2Zvcm09InJvdGF0ZSgtMTUsIDYwLCAzMykiIC8+PHJlY3QgeD0iNjEiIHk9IjM1IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjZjk3MzE2IiByeD0iMSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1LCA2MywgMzYpIiAvPjwvZz48L3N2Zz4=";
const SPLINE_LOGO = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJzcGxpbmVHcmFkIiBjeD0iMzUlIiBjeT0iMzAlIiByPSI3NSUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmY5YzQiLz48c3RvcCBvZmZzZXQ9IjMwJSIgc3RvcC1jb2xvcj0iI2IyZmVmNyIvPjxzdG9wIG9mZnNldD0iNjUlIiBzdG9wLWNvbG9yPSIjM2I4MmY2Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZjQ3MmI2Ii8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDYiIGZpbGw9InVybCgjc3BsaW5lR3JhZCkiLz48L3N2Zz4=";
const POSTHOG_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMTIwIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCwgMTApIj48ZyB0cmFuc2Zvcm09InJvdGF0ZSgtMjAsIDAsIDApIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTIiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSIjMjU2M2ViIi8+PHJlY3QgeD0iMCIgeT0iNDAiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzMCIgcng9IjQiIGZpbGw9IiMyNTYzZWIiLz48cmVjdCB4PSIwIiB5PSI4MCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjMwIiByeD0iI2Y5NzMxNiIvPjxyZWN0IHg9IjAiIHk9IjgwIiB3aWR0aD0iMTIiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSIjZjk3MzE2Ii8+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcwLCAwKSByb3RhdGUoLTIwLCAwLCAwKSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjMwIiByeD0iI2ZhY2MxNSIvPjxyZWN0IHg9IjAiIHk9IjQwIiB3aWR0aD0iMTIiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSIjZmFjYzE1Ii8+PHJlY3QgeD0iMCIgeT0iODAiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzMCIgcng9IjQiIGZpbGw9IiNmYWNjMTUiLz48L2c+PHBhdGggZD0iTTEwNSAyNSBMMTA1IDg1IEwxNDUgODUgQzE1NSA4NSAxNjAgODAgMTYwIDcwIEwxNjAgNjAgTDE0MCAyNSBaIiBmaWxsPSJibGFjayIvPjxjaXJjbGUgY3g9IjEyMCIgY3k9IjU1IiByPSI0IiBmaWxsPSJ3aGl0ZSIvPjwvZz48L3N2Zz4=";
const GITHUB_COPILOT_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNMTIgMkExMCAxMCAwIDAgMCAyIDEyYzAgNC40MiAyLjg3IDguMTcgNi44NCA5LjUuNS4wOC42Ni0uMjMuNjYtLjV2LTEuNjljLTIuNzcuNi0zLjM2LTEuMzQtMy4zNi0xLjM0LS40Ni0xLjE2LTEuMTEtMS40Ny0xLjExLTEuNDctLjkxLS42Mi4wNy0uNi4wNy0uNiAxIC4wNyAxLjUzIDEuMDMgMS41MyAxLjAzLjg3IDEuNTIgMi4zNCAxLjA3IDIuOTEuODMuMDktLjY1LjM1LTEuMDkuNjMtMS4zNC0yLjIyLS4yNS00LjU1LTEuMTEtNC41NS00LjkyIDAtMS4wOC4zOS0xLjk4IDEuMDMtMi42Ny0uMS0uMjUtLjQ1LTEuMjYuMS0yLjYzIDAgMCAuODQtLjI3IDIuNzUgMS4wMi43OS0uMjIgMS42NS0uMzMgMi41LS4zMy44NSAwIDEuNzEuMTEgMi41LjMzIDEuOTEtMS4yOSAyLjc1LTEuMDIgMi43NS0xLjAyLjU1IDEuMzcuMiAyLjM4LjEgMi42My42NC42OSAxLjAzIDEuNTkgMS4wMyAyLjY3IDAgMy44Mi0yLjM0IDQuNjYtNC41NyA0LjkxLjM2LjMxLjY5LjkyLjY5IDEuODVWMjFjMCAuMjcuMTYuNTkuNjcuNUMxOS4xNCAyMC4xNiAyMiAxNi40MiAyMiAxMkExMCAxMCAwIDAgMCAxMiAyWiIvPjwvc3ZnPg==";
const TWENTY_FIRST_DEV_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBmaWxsPSJ3aGl0ZSIgZD0iTTMwIDQwYzAtNiA0LTEwIDEwLTEwaDEwYzYgMCAxMCA0IDEwIDEwdjZjMCA2LTQgMTAtMTAgMTBoLTEwdjhoMjB2NkgzMFY1MGgyMGMyIDAgNC0yIDQtNHYtNmMwLTItMi00LTQtNEg0MGMtMiAwLTQgMi00IDR6IE02MiAzMGg4djQwaC04eiIvPjwvc3ZnPg==";
const SENTRY_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNMTIgNEwyMCAxOEg0TDEyIDRaIi8+PC9zdmc+";

export const GALAXY_FOLDERS: Record<string, AITool[]> = {
  "Agents": [
    { id: 'a1', name: "Manus", url: "https://manus.im/app", description: "Universal AI Agent", category: "Agents", icon: "M" },
    { id: 'a2', name: "Genspark", url: "https://www.genspark.ai/", description: "All-in-One AI Workspace", category: "Agents", icon: "G" },
    { id: 'a3', name: "Runable", url: "https://runable.com/", description: "AI Execution Platform", category: "Agents", icon: "R" },
    { id: 'a4', name: "Design Arena", url: "https://www.designarena.ai/", description: "Visual Playground", category: "Agents", icon: "D" },
    { id: 'a5', name: "AI Studio", url: "https://aistudio.google.com/prompts/new_chat", description: "Google AI Studio", category: "Agents", icon: "A" },
    { id: 'a6', name: "Claude", url: "https://claude.ai/new", description: "Anthropic's Assistant", category: "Agents", icon: "C" },
    { id: 'a7', name: "Gemini", url: "https://gemini.google.com/u/1/app", description: "Google Gemini", category: "Agents", icon: "G" },
    { id: 'a8', name: "Perplexity", url: "https://www.perplexity.ai/", description: "AI Search Engine", category: "Agents", icon: "P" },
    { id: 'a9', name: "ChatGPT", url: "https://chatgpt.com/", description: "OpenAI ChatGPT", category: "Agents", icon: "C" },
    { id: 'a10', name: "Grok", url: "https://grok.com/", description: "xAI Grok", category: "Agents", icon: "G" },
    { id: 'a11', name: "DeepSeek", url: "https://chat.deepseek.com/", description: "Reasoning AI", category: "Agents", icon: "D" },
    { id: 'a12', name: "Kimi AI", url: "https://www.kimi.com/", description: "Long-context AI", category: "Agents", icon: "K", logoUrl: KIMI_AI_LOGO },
    { id: 'a13', name: "Poe", url: "https://poe.com/", description: "AI Bot Hub", category: "Agents", icon: "P" },
    { id: 'a14', name: "Prompt Master", url: "https://claude.ai/chat/9acc1b35-32b2-4af4-96a3-9cde168251f5", description: "Expert Prompt Assistant", category: "Agents", icon: "P" },
    { id: 'a15', name: "Prompt Engineer", url: "https://chatgpt.com/g/g-5XtVuRE8Y-prompt-engineer", description: "ChatGPT Prompt Specialist", category: "Agents", icon: "P" }
  ],
  "Tasks": [
    { id: 't1', name: "NotebookLM", url: "https://notebooklm.google/", description: "AI Research & Notebook", category: "Tasks", icon: "N" },
    { id: 't2', name: "MGX", url: "https://mgx.dev/", description: "AI Dev Team", category: "Tasks", icon: "M" },
    { id: 't3', name: "Gemini Code Assist", url: "https://codeassist.google/", description: "AI Coding Assistant", category: "Tasks", icon: "G" },
    { id: 't4', name: "Eraser", url: "https://www.eraser.io/", description: "Technical Design Copilot", category: "Tasks", icon: "E" },
    { id: 't5', name: "Excel AI", url: "https://app.formulabot.com/excel-ai", description: "Formulas & Analysis", category: "Tasks", icon: "E" },
    { id: 't6', name: "Venngage", url: "https://infograph.venngage.com/universal-generator", description: "Infographic Software", category: "Tasks", icon: "V" },
    { id: 't7', name: "Visme", url: "https://www.visme.co/", description: "Presentation Maker", category: "Tasks", icon: "V" },
    { id: 't8', name: "DeepL Translate", url: "https://www.deepl.com/en/translator", description: "AI Translation", category: "Tasks", icon: "D" },
    { id: 't9', name: "Wispr Flow", url: "https://wisprflow.ai/", description: "Voice Dictation", category: "Tasks", icon: "W" },
    { id: 't10', name: "Zero GPT", url: "https://www.zerogpt.com/", description: "AI Text Checker", category: "Tasks", icon: "Z" },
    { id: 't11', name: "TwainGPT", url: "https://app.twaingpt.com/humanizer", description: "AI Humanizer", category: "Tasks", icon: "T", logoUrl: TWAIN_GPT_LOGO },
    { id: 't12', name: "Opal", url: "https://opal.google/", description: "Google Experiment", category: "Tasks", icon: "O", logoUrl: OPAL_LOGO },
    { id: 't13', name: "GitHub Copilot", url: "https://github.com/copilot", description: "AI Pair Programmer", category: "Tasks", icon: "G", logoUrl: GITHUB_COPILOT_LOGO }
  ],
  "Business": [
    { id: 'b1', name: "Abacus.AI", url: "https://abacus.ai/", description: "Super Assistant", category: "Business", icon: "A" },
    { id: 'b2', name: "Gamma", url: "https://gamma.app/", description: "Visual Content", category: "Business", icon: "G" },
    { id: 'b3', name: "Jenni", url: "https://app.jenni.ai/", description: "Writing Assistant", category: "Business", icon: "J" },
    { id: 'b4', name: "Apify", url: "https://apify.com/", description: "Web Scraping & Data Extraction", category: "Business", icon: "A" },
    { id: 'b5', name: "Jeeva AI", url: "https://www.jeeva.ai/", description: "Agentic Sales", category: "Business", icon: "J" },
    { id: 'b6', name: "Atlas", url: "https://youratlas.com/", description: "Revenue Engine", category: "Business", icon: "A" },
    { id: 'b7', name: "AI Cofounder", url: "https://aicofounder.com/dashboard", description: "Startup Partner", category: "Business", icon: "A" },
    { id: 'b8', name: "Sentry", url: "https://h-nj6.sentry.io/dashboards/", description: "Error & Performance Monitoring", category: "Business", icon: "S", logoUrl: SENTRY_LOGO }
  ],
  "Build": [
    { id: 'bd0', name: "OnePage", url: "https://app.onepage.io/sites", description: "The easiest website builder", category: "Build", icon: "1", logoUrl: ONEPAGE_LOGO },
    { id: 'bd1', name: "Panda", url: "https://app.usepanda.com/", description: "Discovery & Feed", category: "Build", icon: "P" },
    { id: 'bd2', name: "Vibecode", url: "https://www.vibecodeapp.com/workspace", description: "Vibecode Workspace", category: "Build", icon: "V" },
    { id: 'bd3', name: "Mocha", url: "https://getmocha.com/", description: "No-Code App Builder", category: "Build", icon: "M" },
    { id: 'bd4', name: "Same", url: "https://same.new/", description: "Real-time Collaboration", category: "Build", icon: "S" },
    { id: 'bd5', name: "Landingsite.ai", url: "https://www.landingsite.ai/", description: "Landing Pages", category: "Build", icon: "L" },
    { id: 'bd7', name: "Readdy", url: "https://readdy.ai/project", description: "AI Project Starter", category: "Build", icon: "R" },
    { id: 'bd9', name: "Flames.blue", url: "https://flames.blue/", description: "AI App Builder", category: "Build", icon: "F" },
    { id: 'bd10', name: "Natively", url: "https://natively.dev/", description: "Mobile App Builder", category: "Build", icon: "N" },
    { id: 'bd11', name: "Dora AI", url: "https://www.dora.run/ai", description: "3D Sites", category: "Build", icon: "D" },
    { id: 'bd12', name: "Framer", url: "https://framer.com/projects/", description: "Interactive Design", category: "Build", icon: "F" },
    { id: 'bd13', name: "Webflow", url: "https://webflow.com/", description: "Professional Web Design", category: "Build", icon: "W" },
    { id: 'bd14', name: "Tempo", url: "https://www.tempo.new/", description: "Swift Dev", category: "Build", icon: "T" },
    { id: 'bd15', name: "Orchids", url: "https://www.orchids.app/", description: "AI Fullstack Engineer", category: "Build", icon: "O" },
    { id: 'bd16', name: "Base44", url: "https://app.base44.com/", description: "Web Builder", category: "Build", icon: "B" },
    { id: 'bd17', name: "Rork", url: "https://rork.com/", description: "Mobile Vibe Coding", category: "Build", icon: "R" },
    { id: 'bd18', name: "AI Studio Build", url: "https://aistudio.google.com/apps", description: "App Creator", category: "Build", icon: "A" },
    { id: 'i7', name: "Aura", url: "https://www.aura.build/create", description: "Beautiful Designs", category: "Build", icon: "A" },
    { id: 'bd21', name: "Lovable", url: "https://lovable.dev/", description: "Full-stack AI apps", category: "Build", icon: "L" },
    { id: 'bd8', name: "Emergent", url: "https://app.emergent.sh/home", description: "AI App Platform", category: "Build", icon: "E" },
    { id: 'bd19', name: "Spline", url: "https://app.spline.design/home", description: "Collaborative 3D Design", category: "Build", icon: "S", logoUrl: SPLINE_LOGO },
    { id: 'bd20', name: "21st.dev", url: "https://21st.dev/community/components", description: "React Components Library", category: "Build", icon: "R", logoUrl: TWENTY_FIRST_DEV_LOGO }
  ],
  "Inspirations": [
    { id: 'i1', name: "Mobbin Apps", url: "https://mobbin.com/discover/apps/ios/latest", description: "App Design Library", category: "Inspirations", icon: "M" },
    { id: 'i2', name: "Mobbin Sites", url: "https://mobbin.com/discover/sites/latest", description: "Web Design Library", category: "Inspirations", icon: "M" },
    { id: 'i3', name: "Lapa Ninja", url: "https://www.lapa.ninja/", description: "Landing Page Inspiration", category: "Inspirations", icon: "L" },
    { id: 'i4', name: "Dribbble", url: "https://dribbble.com/", description: "Design Community", category: "Inspirations", icon: "D" },
    { id: 'i5', name: "Figma Templates", url: "https://www.figma.com/community/website-templates", description: "Website Community", category: "Inspirations", icon: "F" },
    { id: 'i6', name: "Framer Templates", url: "https://www.framer.com/marketplace/templates/", description: "HTML Templates", category: "Inspirations", icon: "F" },
    { id: 'i8', name: "Free Faces", url: "https://www.freefaces.gallery/", description: "Typography Library", category: "Inspirations", icon: "F" },
    { id: 'i9', name: "UIColours", url: "https://uicolours.com/", description: "Color Palettes", category: "Inspirations", icon: "U" }
  ],
  "Content": [
    { id: 'c1', name: "Canva", url: "https://www.canva.com/", description: "Graphic Design", category: "Content", icon: "C" },
    { id: 'c2', name: "Sora", url: "https://sora.chatgpt.com/explore", description: "OpenAI Video", category: "Content", icon: "S" },
    { id: 'c3', name: "DALL-E Free", url: "https://www.dall-efree.com/", description: "Image Generator", category: "Content", icon: "D" },
    { id: 'c4', name: "Vizard.ai", url: "https://vizard.ai/", description: "AI Video Editing", category: "Content", icon: "V" },
    { id: 'c5', name: "Higgsfield", url: "https://higgsfield.ai/", description: "Video & Image AI", category: "Content", icon: "H" },
    { id: 'c6', name: "Reve", url: "https://higgsfield.ai/image/reve", description: "Visual AI", category: "Content", icon: "R" },
    { id: 'c7', name: "Hera", url: "https://hera.video/", description: "AI Motion Designer", category: "Content", icon: "H" },
    { id: 'c8', name: "Shader Gradient", url: "https://shadergradient.co/", description: "Mesh Gradients", category: "Content", icon: "S" },
    { id: 'c9', name: "Unicorn Studio", url: "https://www.unicorn.studio/dashboard", description: "No-code WebGL", category: "Content", icon: "U" },
    { id: 'c10', name: "Unsplash", url: "https://unsplash.com/", description: "Free Stock Photos", category: "Content", icon: "U" },
    { id: 'c11', name: "React Bits", url: "https://reactbits.dev/", description: "UI Components", category: "Content", icon: "R" },
    { id: 'c12', name: "Stitch", url: "https://stitch.withgoogle.com/", description: "Design with AI", category: "Content", icon: "S" }
  ],
  "Dev Tools": [
    { id: 'd1', name: "Hugging Face", url: "https://huggingface.co/spaces", description: "AI Community", category: "Dev Tools", icon: "H" },
    { id: 'd2', name: "GitHub Spark", url: "https://github.com/features/spark", description: "AI Apps", category: "Dev Tools", icon: "G", logoUrl: GITHUB_COPILOT_LOGO },
    { id: 'd3', name: "OpenRouter", url: "https://openrouter.ai/", description: "Unified AI API", category: "Dev Tools", icon: "O" },
    { id: 'd4', name: "GroqCloud", url: "https://console.groq.com/home", description: "Fast Inference", category: "Dev Tools", icon: "G" },
    { id: 'd5', name: "Code Wiki", url: "https://codewiki.google/", description: "Google Code Wiki", category: "Dev Tools", icon: "C" },
    { id: 'd6', name: "RapidAPI Hub", url: "https://rapidapi.com/hub", description: "API Marketplace", category: "Dev Tools", icon: "R" },
    { id: 'd7', name: "Open Alternative", url: "https://openalternative.co/", description: "OSS Alternatives", category: "Dev Tools", icon: "O" },
    { id: 'd8', name: "Prompt Cheatsheet", url: "https://docs.google.com/document/d/1hpRTSTLsXr471q7I_YK54", description: "Dan Martell's Guide", category: "Dev Tools", icon: "P" },
    { id: 'd9', name: "Voice AI Easy", url: "https://www.skool.com/aa-academy/classroom/459c05de", description: "Skool Classroom", category: "Dev Tools", icon: "V" },
    { id: 'd10', name: "PostHog", url: "https://posthog.com/", description: "All-in-one Data Platform", category: "Dev Tools", icon: "P", logoUrl: POSTHOG_LOGO },
    { id: 'd11', name: "Anime.js", url: "https://animejs.com/", description: "Lightweight JavaScript animation library", category: "Dev Tools", icon: "A", logoUrl: ANIMEJS_LOGO }
  ],
  "Libraries": [
    { id: 'l1', name: "The Rundown", url: "https://www.rundown.ai/tools", description: "AI Tools Directory", category: "Libraries", icon: "R" },
    { id: 'l2', name: "AI Valley", url: "https://aivalley.ai/", description: "Discovery Platform", category: "Libraries", icon: "A" },
    { id: 'l3', name: "PromptBase", url: "https://promptbase.com/", description: "Prompt Marketplace", category: "Libraries", icon: "P" },
    { id: 'l4', name: "FlowGPT", url: "https://flowgpt.com/", description: "AI Character Roleplay", category: "Libraries", icon: "F" },
    { id: 'l5', name: "AiTools", url: "https://aitools.sh/", description: "Free AI Library", category: "Libraries", icon: "A" },
    { id: 'l6', name: "Snack Prompt", url: "https://snackprompt.com/", description: "Prompt Community", category: "Libraries", icon: "S" },
    { id: 'l7', name: "Prompt Packs", url: "https://academy.openai.com/public/tags/prompt-packs", description: "OpenAI Academy", category: "Libraries", icon: "P" },
    { id: 'l8', name: "Forward Future", url: "https://prompts.forwardfuture.ai/chat-prompts", description: "Future Intelligence Hub", category: "Libraries", icon: "F", logoUrl: FORWARD_FUTURE_LOGO },
    { id: 'l10', name: "TinyWow", url: "https://tinywow.com/", description: "PDF & Image Tools", category: "Libraries", icon: "T" },
    { id: 'l11', name: "Latent Box", url: "https://latentbox.com/en", description: "AI Tools Hub", category: "Libraries", icon: "L" },
    { id: 'l13', name: "Phygital+", url: "https://library.phygital.plus", description: "Digital Design Library", category: "Libraries", icon: "P", logoUrl: PHYGITAL_PLUS_LOGO },
    { id: 'l14', name: "Business AI", url: "https://www.hypotenuse.ai/blog/best-ai-tools-for-small-business", description: "Small Biz Tools", category: "Libraries", icon: "B" }
  ]
};
