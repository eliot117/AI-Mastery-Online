import { AITool } from './types';

/**
 * HIGH-TECH MINIMALIST LOGO PROTOCOLS:
 * - Direct-on-surface: No gray boxes, borders, or nested backgrounds.
 * - Optimized SVGs: Recreated for maximum sharpness and branding accuracy.
 */

const TWAIN_GPT_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgNjAiPjx0ZXh0IHg9IjEwIiB5PSI0MiIgZm9udC1mYW1pbHk9Ik91dGZpdCwgc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjYwMCIgZm9udC1zaXplPSIzNCIgZmlsbD0id2hpdGUiPnR3YWluPC90ZXh0PjxyZWN0IHg9IjEwNSIgeT0iMTQiIHdpZHRoPSI1NCIgaGVpZ2h0PSIzOCIgcng9IjgiIGZpbGw9IiMyNTYzZWIiLz48dGV4dCB4PSIxMzIiIHk9IjQwIiBmb250LWZhbWlseT0iT3V0Zml0LCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iNzAwIiBmb250LXNpemU9IjIyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R1BUPC90ZXh0Pjwvc3ZnPg==";

const OPAL_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgNjAiPjx0ZXh0IHg9IjYwIiB5PSI0MiIgZm9udC1mYW1pbHk9Ik91dGZpdCwgc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjcwMCIgZm9udC1zaXplPSIzOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk9wYWw8L3RleHQ+PC9zdmc+";

const PHYGITAL_PLUS_LOGO = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDMwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM4YjVjZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlYzQ4OTkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48dGV4dCB4PSI1MCUiIHk9IjcwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Ik91dGZpdCwgSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI4MDAiIGZvbnQtc2l6ZT0iNjQiIGZpbGw9InVybCgjZzEpIj5QaHlnaXRhbCs8L3RleHQ+PC9zdmc+";

const KIMI_AI_LOGO = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHJ4PSIxNDAiIGZpbGw9ImJsYWNrIi8+PHBhdGggZD0iTTE2NSAxMTBWNDAyTTE2NSAyNTZMMzA1IDExME0xNjUgMjU2TDMwNSA0MDIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMTE1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48Y2lyY2xlIGN4PSIzOTUiIGN5PSIxMjUiIHI9Ijc1IiBmaWxsPSIjM2I4MmY2Ii8+PC9zdmc+";

const FORWARD_FUTURE_LOGO = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJoYWxvR3JhZCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNlZjQ0NDQiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjM2I4MmY2IiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ4IiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjaGFsb0dyYWQpIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuNiIgLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MCwgNTApIHNjYWxlKDAuNikgdHJhbnNsYXRlKC01MCwgLTUwKSI+PHBhdGggZD0iTTM1IDg1IEw2NSA1NSBMNzAgMTAwIEwzMCAxMDAgWiIgZmlsbD0id2hpdGUiIC8+PHBhdGggZD0iTTUwIDE1IEMyNSAxNSAyNSA4MCA1MCA4MCBDNzUgODAgNzUgMTUgNTAgMTUgWiIgZmlsbD0id2hpdGUiIC8+PHBhdGggZD0iTTMyIDM1IEMzMiAyOCA2OCAyOCA2OCAzNSBDNjggNTUgMzIgNTUgMzIgMzUgWiIgZmlsbD0iIzBmMTcyYSIgLz48cmVjdCB4PSI1OCIgeT0iMzIiIHdpZHRoPSI1IiBoZWlnaHQ9IjIiIGZpbGw9IiNlZjQ0NDQiIHJ4PSIxIiB0cmFuc2Zvcm09InJvdGF0ZSgtMTUsIDYwLCAzMykiIC8+PHJlY3QgeD0iNjEiIHk9IjM1IiB3aWR0aD0iNCIgaGVpZ2h0PSIyIiBmaWxsPSIjZjk3MzE2IiByeD0iMSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1LCA2MywgMzYpIiAvPjwvZz48L3N2Zz4=";

const SPLINE_LOGO = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJzcGxpbmVHcmFkIiBjeD0iMzUlIiBjeT0iMzAlIiByPSI3NSUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmY5YzQiLz48c3RvcCBvZmZzZXQ9IjMwJSIgc3RvcC1jb2xvcj0iI2IyZmVmNyIvPjxzdG9wIG9mZnNldD0iNjUlIiBzdG9wLWNvbG9yPSIjM2I4MmY2Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZjQ3MmI2Ii8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDYiIGZpbGw9InVybCgjc3BsaW5lR3JhZCkiLz48L3N2Zz4=";

const POSTHOG_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMTIwIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCwgMTApIj48ZyB0cmFuc2Zvcm09InJvdGF0ZSgtMjAsIDAsIDApIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTIiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSIjMjU2M2ViIi8+PHJlY3QgeD0iMCIgeT0iNDAiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzMCIgcng9IjQiIGZpbGw9IiMyNTYzZWIiLz48cmVjdCB4PSIwIiB5PSI4MCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjMwIiByeD0iI2Y5NzMxNiIvPjxyZWN0IHg9IjAiIHk9IjgwIiB3aWR0aD0iMTIiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSIjZjk3MzE2Ii8+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcwLCAwKSByb3RhdGUoLTIwLCAwLCAwKSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjMwIiByeD0iI2ZhY2MxNSIvPjxyZWN0IHg9IjAiIHk9IjQwIiB3aWR0aD0iMTIiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSIjZmFjYzE1Ii8+PHJlY3QgeD0iMCIgeT0iODAiIHdpZHRoPSIxMiIgaGVpZ2h0PSIzMCIgcng9IjQiIGZpbGw9IiNmYWNjMTUiLz48L2c+PHBhdGggZD0iTTEwNSAyNSBMMTA1IDg1IEwxNDUgODUgQzE1NSA4NSAxNjAgODAgMTYwIDcwIEwxNjAgNjAgTDE0MCAyNSBaIiBmaWxsPSJibGFjayIvPjxjaXJjbGUgY3g9IjEyMCIgY3k9IjU1IiByPSI0IiBmaWxsPSJ3aGl0ZSIvPjwvZz48L3N2Zz4=";

const GITHUB_COPILOT_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNMTIgMkExMCAxMCAwIDAgMCAyIDEyYzAgNC40MiAyLjg3IDguMTcgNi44NCA5LjUuNS4wOC42Ni0uMjMuNjYtLjV2LTEuNjljLTIuNzcuNi0zLjM2LTEuMzQtMy4zNi0xLjM0LS40Ni0xLjE2LTEuMTEtMS40Ny0xLjExLTEuNDctLjkxLS42Mi4wNy0uNi4wNy0uNiAxIC4wNyAxLjUzIDEuMDMgMS41MyAxLjAzLjg3IDEuNTIgMi4zNCAxLjA3IDIuOTEuODMuMDktLjY1LjM1LTEuMDkuNjMtMS4zNC0yLjIyLS4yNS00LjU1LTEuMTEtNC41NS00LjkyIDAtMS4wOC4zOS0xLjk4IDEuMDMtMi42Ny0uMS0uMjUtLjQ1LTEuMjYuMS0yLjYzIDAgMCAuODQtLjI3IDIuNzUgMS4wMi43OS0uMjIgMS42NS0uMzMgMi41LS4zMy44NSAwIDEuNzEuMTEgMi41LjMzIDEuOTEtMS4yOSAyLjc1LTEuMDIgMi43NS0xLjAyLjU1IDEuMzcuMiAyLjM4LjEgMi42My42NC42OSAxLjAzIDEuNTkgMS4wMyAyLjY3IDAgMy44Mi0yLjM0IDQuNjYtNC41NyA0LjkxLjM2LjMxLjY5LjkyLjY5IDEuODVWMjFjMCAuMjcuMTYuNTkuNjcuNUMxOS4xNCAyMC4xNiAyMiAxNi40MiAyMiAxMkExMCAxMCAwIDAgMCAxMiAyWiIvPjwvc3ZnPg==";

const TWENTY_FIRST_DEV_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBmaWxsPSJ3aGl0ZSIgZD0iTTMwIDQwYzAtNiA0LTEwIDEwLTEwaDEwYzYgMCAxMCA0IDEwIDEwdjZjMCA2LTQgMTAtMTAgMTBoLTEwdjhoMjB2NkgzMFY1MGgyMGMyIDAgNC0yIDQtNHYtNmMwLTItMi00LTQtNEg0MGMtMiAwLTQgMi00IDR6IE02MiAzMGg4djQwaC04eiIvPjwvc3ZnPg==";

const SENTRY_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNMTIgNEwyMCAxOEg0TDEyIDRaIi8+PC9zdmc+";

export const GALAXY_FOLDERS: Record<string, AITool[]> = {
  "Agents": [
    { id: 'a1', name: "Manus", url: "https://manus.im/app", description: "Universal AI Agent", category: "Agents", icon: "🧠" },
    { id: 'a2', name: "Genspark", url: "https://www.genspark.ai/", description: "All-in-One AI Workspace", category: "Agents", icon: "💫" },
    { id: 'a3', name: "Runable", url: "https://runable.com/", description: "AI Execution Platform", category: "Agents", icon: "🏃" },
    { id: 'a4', name: "Design Arena", url: "https://www.designarena.ai/", description: "Visual Playground", category: "Agents", icon: "🎨" },
    { id: 'a5', name: "AI Studio", url: "https://aistudio.google.com/prompts/new_chat", description: "Google AI Studio", category: "Agents", icon: "🛠️" },
    { id: 'a6', name: "Claude", url: "https://claude.ai/new", description: "Anthropic's Assistant", category: "Agents", icon: "🤖" },
    { id: 'a7', name: "Gemini", url: "https://gemini.google.com/u/1/app", description: "Google Gemini", category: "Agents", icon: "💎" },
    { id: 'a8', name: "Perplexity", url: "https://www.perplexity.ai/", description: "AI Search Engine", category: "Agents", icon: "🔍" },
    { id: 'a9', name: "ChatGPT", url: "https://chatgpt.com/", description: "OpenAI ChatGPT", category: "Agents", icon: "💬" },
    { id: 'a10', name: "Grok", url: "https://grok.com/", description: "xAI Grok", category: "Agents", icon: "🐦" },
    { id: 'a11', name: "DeepSeek", url: "https://chat.deepseek.com/", description: "Reasoning AI", category: "Agents", icon: "🌊" },
    { id: 'a12', name: "Kimi AI", url: "https://www.kimi.com/", description: "Long-context AI", category: "Agents", icon: "🐉", logoUrl: KIMI_AI_LOGO },
    { id: 'a13', name: "Poe", url: "https://poe.com/", description: "AI Bot Hub", category: "Agents", icon: "📜" },
    { id: 'a14', name: "Prompt Master", url: "https://claude.ai/chat/9fcc0bb7-a387-47e1-821a-ed788b2bd10a", description: "Expert Prompt Assistant", category: "Agents", icon: "🎭" },
    { id: 'a15', name: "Prompt Engineer", url: "https://chatgpt.com/g/g-5XtVuRE8Y-prompt-engineer", description: "ChatGPT Prompt Specialist", category: "Agents", icon: "📐" }
  ],
  "Tasks": [
    { id: 't1', name: "NotebookLM", url: "https://notebooklm.google/", description: "AI Research & Notebook", category: "Tasks", icon: "📓" },
    { id: 't2', name: "MGX", url: "https://mgx.dev/", description: "AI Dev Team", category: "Tasks", icon: "🏗️" },
    { id: 't3', name: "Gemini Code Assist", url: "https://codeassist.google/", description: "AI Coding Assistant", category: "Tasks", icon: "💻" },
    { id: 't4', name: "Eraser", url: "https://www.eraser.io/", description: "Technical Design Copilot", category: "Tasks", icon: "📐" },
    { id: 't5', name: "Excel AI", url: "https://app.formulabot.com/excel-ai", description: "Formulas & Analysis", category: "Tasks", icon: "📈" },
    { id: 't6', name: "Venngage", url: "https://infograph.venngage.com/universal-generator", description: "Infographic Software", category: "Tasks", icon: "📊" },
    { id: 't7', name: "Visme", url: "https://www.visme.co/", description: "Presentation Maker", category: "Tasks", icon: "📽️" },
    { id: 't8', name: "DeepL Translate", url: "https://www.deepl.com/en/translator", description: "AI Translation", category: "Tasks", icon: "🌍" },
    { id: 't9', name: "Wispr Flow", url: "https://wisprflow.ai/", description: "Voice Dictation", category: "Tasks", icon: "🎙️" },
    { id: 't10', name: "AI Detector", url: "https://www.zerogpt.com/", description: "AI Text Checker", category: "Tasks", icon: "🛡️" },
    { id: 't11', name: "TwainGPT", url: "https://app.twaingpt.com/humanizer", description: "AI Humanizer", category: "Tasks", icon: "✍️", logoUrl: TWAIN_GPT_LOGO },
    { id: 't12', name: "Opal", url: "https://opal.google/", description: "Google Experiment", category: "Tasks", icon: "🔮", logoUrl: OPAL_LOGO },
    { id: 't13', name: "GitHub Copilot", url: "https://github.com/copilot", description: "AI Pair Programmer", category: "Tasks", icon: "🤖", logoUrl: GITHUB_COPILOT_LOGO }
  ],
  "Business": [
    { id: 'b1', name: "Abacus.AI", url: "https://abacus.ai/", description: "Super Assistant", category: "Business", icon: "🧮" },
    { id: 'b2', name: "Gamma", url: "https://gamma.app/", description: "Visual Content", category: "Business", icon: "✨" },
    { id: 'b3', name: "Jenni", url: "https://app.jenni.ai/", description: "Writing Assistant", category: "Business", icon: "✒️" },
    { id: 'b4', name: "Apify", url: "https://apify.com/", description: "Web Scraping & Data Extraction", category: "Business", icon: "🕷️" },
    { id: 'b5', name: "Jeeva AI", url: "https://www.jeeva.ai/", description: "Agentic Sales", category: "Business", icon: "👔" },
    { id: 'b6', name: "Atlas", url: "https://youratlas.com/", description: "Revenue Engine", category: "Business", icon: "🗺️" },
    { id: 'b7', name: "AI Cofounder", url: "https://aicofounder.com/dashboard", description: "Startup Partner", category: "Business", icon: "🤝" },
    { id: 'b8', name: "Sentry", url: "https://h-nj6.sentry.io/dashboards/", description: "Error & Performance Monitoring", category: "Business", icon: "🛡️", logoUrl: SENTRY_LOGO }
  ],
  "Build": [
    { id: 'bd19', name: "Spline", url: "https://app.spline.design/home", description: "Collaborative 3D Design", category: "Build", icon: "🧊", logoUrl: SPLINE_LOGO },
    { id: 'bd20', name: "21st.dev", url: "https://21st.dev/community/components", description: "React Components Library", category: "Build", icon: "⚛️", logoUrl: TWENTY_FIRST_DEV_LOGO }
    { id: 'bd1', name: "Panda", url: "https://app.usepanda.com/", description: "Discovery & Feed", category: "Build", icon: "🐼" },
    { id: 'bd2', name: "Vibecode", url: "https://www.vibecodeapp.com/workspace", description: "Vibecode Workspace", category: "Build", icon: "💻" },
    { id: 'bd3', name: "Mocha", url: "https://getmocha.com/", description: "No-Code App Builder", category: "Build", icon: "☕" },
    { id: 'bd4', name: "Same", url: "https://same.new/", description: "Real-time Collaboration", category: "Build", icon: "🔗" },
    { id: 'bd5', name: "Landingsite.ai", url: "https://www.landingsite.ai/", description: "Landing Pages", category: "Build", icon: "🏠" },
    { id: 'bd7', name: "Readdy", url: "https://readdy.ai/project", description: "AI Project Starter", category: "Build", icon: "🚀" },
    { id: 'bd8', name: "Emergent", url: "https://app.emergent.sh/home", description: "AI App Platform", category: "Build", icon: "⚡" },
    { id: 'bd9', name: "Flames.blue", url: "https://flames.blue/", description: "AI App Builder", category: "Build", icon: "🔥" },
    { id: 'bd10', name: "Natively", url: "https://natively.dev/", description: "Mobile App Builder", category: "Build", icon: "🏗️" },
    { id: 'bd11', name: "Dora AI", url: "https://www.dora.run/ai", description: "3D Sites", category: "Build", icon: "🧊" },
    { id: 'bd12', name: "Framer", url: "https://framer.com/projects/", description: "Interactive Design", category: "Build", icon: "🎨" },
    { id: 'bd13', name: "Webflow", url: "https://webflow.com/", description: "Professional Web Design", category: "Build", icon: "🌐" },
    { id: 'bd14', name: "Tempo", url: "https://www.tempo.new/", description: "Swift Dev", category: "Build", icon: "⏳" },
    { id: 'bd15', name: "Orchids", url: "https://www.orchids.app/", description: "AI Fullstack Engineer", category: "Build", icon: "🌸" },
    { id: 'bd16', name: "Base44", url: "https://app.base44.com/", description: "Web Builder", category: "Build", icon: "📦" },
    { id: 'bd17', name: "Rork", url: "https://rork.com/", description: "Mobile Vibe Coding", category: "Build", icon: "📱" },
    { id: 'bd18', name: "AI Studio Build", url: "https://aistudio.google.com/apps", description: "App Creator", category: "Build", icon: "🛠️" },
  ],
  "Inspirations": [
    { id: 'i1', name: "Mobbin Apps", url: "https://mobbin.com/discover/apps/ios/latest", description: "App Design Library", category: "Inspirations", icon: "📱" },
    { id: 'i2', name: "Mobbin Sites", url: "https://mobbin.com/discover/sites/latest", description: "Web Design Library", category: "Inspirations", icon: "🌐" },
    { id: 'i3', name: "Lapa Ninja", url: "https://www.lapa.ninja/", description: "Landing Page Inspiration", category: "Inspirations", icon: "🥷" },
    { id: 'i4', name: "Dribbble", url: "https://dribbble.com/", description: "Design Community", category: "Inspirations", icon: "🏀" },
    { id: 'i5', name: "Figma Templates", url: "https://www.figma.com/community/website-templates", description: "Website Community", category: "Inspirations", icon: "🎨" },
    { id: 'i6', name: "Framer Templates", url: "https://www.framer.com/marketplace/templates/", description: "HTML Templates", category: "Inspirations", icon: "🖼️" },
    { id: 'i7', name: "Aura", url: "https://www.aura.build/create", description: "Beautiful Designs", category: "Inspirations", icon: "🕯️" },
    { id: 'i8', name: "Free Faces", url: "https://www.freefaces.gallery/", description: "Typography Library", category: "Inspirations", icon: "🔡" },
    { id: 'i9', name: "UIColours", url: "https://uicolours.com/", description: "Color Palettes", category: "Inspirations", icon: "🌈" }
  ],
  "Content": [
    { id: 'c1', name: "Canva", url: "https://www.canva.com/", description: "Graphic Design", category: "Content", icon: "🎨" },
    { id: 'c2', name: "Sora", url: "https://sora.chatgpt.com/explore", description: "OpenAI Video", category: "Content", icon: "🎬" },
    { id: 'c3', name: "DALL-E Free", url: "https://www.dall-efree.com/", description: "Image Generator", category: "Content", icon: "🖼️" },
    { id: 'c4', name: "Vizard.ai", url: "https://vizard.ai/", description: "AI Video Editing", category: "Content", icon: "📽️" },
    { id: 'c5', name: "Higgsfield", url: "https://higgsfield.ai/", description: "Video & Image AI", category: "Content", icon: "🎥" },
    { id: 'c6', name: "Reve", url: "https://higgsfield.ai/image/reve", description: "Visual AI", category: "Content", icon: "🌟" },
    { id: 'c7', name: "Hera", url: "https://hera.video/", description: "AI Motion Designer", category: "Content", icon: "✨" },
    { id: 'c8', name: "Shader Gradient", url: "https://shadergradient.co/", description: "Mesh Gradients", category: "Content", icon: "🌈" },
    { id: 'c9', name: "Unicorn Studio", url: "https://www.unicorn.studio/dashboard", description: "No-code WebGL", category: "Content", icon: "🦄" },
    { id: 'c10', name: "Unsplash", url: "https://unsplash.com/", description: "Free Stock Photos", category: "Content", icon: "📷" },
    { id: 'c11', name: "React Bits", url: "https://reactbits.dev/", description: "UI Components", category: "Content", icon: "⚛️" },
    { id: 'c12', name: "Stitch", url: "https://stitch.withgoogle.com/", description: "Design with AI", category: "Content", icon: "🧵" }
  ],
  "Dev Tools": [
    { id: 'd1', name: "Hugging Face", url: "https://huggingface.co/spaces", description: "AI Community", category: "Dev Tools", icon: "🤗" },
    { id: 'd2', name: "GitHub Spark", url: "https://github.com/features/spark", description: "AI Apps", category: "Dev Tools", icon: "✨", logoUrl: GITHUB_COPILOT_LOGO },
    { id: 'd3', name: "OpenRouter", url: "https://openrouter.ai/", description: "Unified AI API", category: "Dev Tools", icon: "🔌" },
    { id: 'd4', name: "GroqCloud", url: "https://console.groq.com/home", description: "Fast Inference", category: "Dev Tools", icon: "💨" },
    { id: 'd5', name: "Code Wiki", url: "https://codewiki.google/", description: "Google Code Wiki", category: "Dev Tools", icon: "📖" },
    { id: 'd6', name: "RapidAPI Hub", url: "https://rapidapi.com/hub", description: "API Marketplace", category: "Dev Tools", icon: "🌐" },
    { id: 'd7', name: "Open Alternative", url: "https://openalternative.co/", description: "OSS Alternatives", category: "Dev Tools", icon: "📂" },
    { id: 'd8', name: "Prompt Cheatsheet", url: "https://docs.google.com/document/d/1hpRTSTLsXr471q7I_YK54", description: "Dan Martell's Guide", category: "Dev Tools", icon: "📄" },
    { id: 'd9', name: "Voice AI Easy", url: "https://www.skool.com/aa-academy/classroom/459c05de", description: "Skool Classroom", category: "Dev Tools", icon: "🎙️" },
    { id: 'd10', name: "PostHog", url: "https://posthog.com/", description: "All-in-one Data Platform", category: "Dev Tools", icon: "🦔", logoUrl: POSTHOG_LOGO }
  ],
  "Libraries": [
    { id: 'l1', name: "The Rundown", url: "https://www.rundown.ai/tools", description: "AI Tools Directory", category: "Libraries", icon: "📋" },
    { id: 'l2', name: "AI Valley", url: "https://aivalley.ai/", description: "Discovery Platform", category: "Libraries", icon: "🏔️" },
    { id: 'l3', name: "PromptBase", url: "https://promptbase.com/", description: "Prompt Marketplace", category: "Libraries", icon: "🏬" },
    { id: 'l4', name: "FlowGPT", url: "https://flowgpt.com/", description: "AI Character Roleplay", category: "Libraries", icon: "💬" },
    { id: 'l5', name: "AiTools", url: "https://aitools.sh/", description: "Free AI Library", category: "Libraries", icon: "🛠️" },
    { id: 'l6', name: "Snack Prompt", url: "https://snackprompt.com/", description: "Prompt Community", category: "Libraries", icon: "🍿" },
    { id: 'l7', name: "Prompt Packs", url: "https://academy.openai.com/public/tags/prompt-packs", description: "OpenAI Academy", category: "Libraries", icon: "📦" },
    { id: 'l8', name: "Forward Future", url: "https://prompts.forwardfuture.ai/chat-prompts", description: "Future Intelligence Hub", category: "Libraries", icon: "👨‍🚀", logoUrl: FORWARD_FUTURE_LOGO },
    { id: 'l10', name: "TinyWow", url: "https://tinywow.com/", description: "PDF & Image Tools", category: "Libraries", icon: "📦" },
    { id: 'l11', name: "Latent Box", url: "https://latentbox.com/en", description: "AI Tools Hub", category: "Libraries", icon: "🗃️" },
    { id: 'l13', name: "Phygital+", url: "https://library.phygital.plus", description: "Digital Design Library", category: "Libraries", icon: "🎨", logoUrl: PHYGITAL_PLUS_LOGO },
    { id: 'l14', name: "Business AI", url: "https://www.hypotenuse.ai/blog/best-ai-tools-for-small-business", description: "Small Biz Tools", category: "Libraries", icon: "💼" }
  ]
};
