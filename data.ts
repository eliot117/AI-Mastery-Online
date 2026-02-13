import { AITool } from './types';

// High-quality brand assets recreated as base64 data URIs for the 'Clean Logo' aesthetic.
const TWAIN_GPT_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgNjAiPjx0ZXh0IHg9IjEwIiB5PSI0MiIgZm9udC1mYW1pbHk9Ik91dGZpdCwgc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjYwMCIgZm9udC1zaXplPSIzNCIgZmlsbD0id2hpdGUiPnR3YWluPC90ZXh0PjxyZWN0IHg9IjEwNSIgeT0iMTQiIHdpZHRoPSI1NCIgaGVpZ2h0PSIzOCIgcng9IjgiIGZpbGw9IiMyNTYzZWIiLz48dGV4dCB4PSIxMzIiIHk9IjQwIiBmb250LWZhbWlseT0iT3V0Zml0LCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iNzAwIiBmb250LXNpemU9IjIyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R1BUPC90ZXh0Pjwvc3ZnPg==";
const OPAL_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgNjAiPjx0ZXh0IHg9IjYwIiB5PSI0MiIgZm9udC1mYW1pbHk9Ik91dGZpdCwgc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjcwMCIgZm9udC1zaXplPSIzOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk9wYWw8L3RleHQ+PC9zdmc+";

export const GALAXY_FOLDERS: Record<string, AITool[]> = {
  "Agents": [
    { id: 'a1', name: "Manus", url: "https://manus.im/app", description: "Universal AI Agent", category: "Agents", icon: "🧠" },
    { id: 'a2', name: "Genspark", url: "https://www.genspark.ai/", description: "All-in-One AI Workspace", category: "Agents", icon: "💫" },
    { id: 'a3', name: "Runable", url: "https://runable.com/", description: "AI Execution Platform", category: "Agents", icon: "🏃" },
    { id: 'a4', name: "Design Arena", url: "https://www.designarena.ai/", description: "AI Visual Playground", category: "Agents", icon: "🎨" },
    { id: 'a5', name: "AI Studio", url: "https://aistudio.google.com/prompts/new_chat", description: "Google AI Studio", category: "Agents", icon: "🛠️" },
    { id: 'a6', name: "Claude", url: "https://claude.ai/new", description: "Anthropic's Assistant", category: "Agents", icon: "🤖" },
    { id: 'a7', name: "Gemini", url: "https://gemini.google.com/u/1/app", description: "Google Gemini", category: "Agents", icon: "💎" },
    { id: 'a8', name: "Perplexity", url: "https://www.perplexity.ai/", description: "AI Search Engine", category: "Agents", icon: "🔍" },
    { id: 'a9', name: "ChatGPT", url: "https://chatgpt.com/", description: "OpenAI ChatGPT", category: "Agents", icon: "💬" },
    { id: 'a10', name: "Grok", url: "https://grok.com/", description: "xAI Grok", category: "Agents", icon: "🐦" },
    { id: 'a11', name: "DeepSeek", url: "https://chat.deepseek.com/", description: "Reasoning AI", category: "Agents", icon: "🌊" },
    { id: 'a12', name: "Kimi AI", url: "https://www.kimi.com/", description: "Long-context AI", category: "Agents", icon: "🐉" },
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
    { id: 't12', name: "Opal", url: "https://opal.google/", description: "Google Experiment", category: "Tasks", icon: "🔮", logoUrl: OPAL_LOGO }
  ],
  "Business": [
    { id: 'b1', name: "Abacus.AI", url: "https://abacus.ai/", description: "Super Assistant", category: "Business", icon: "🧮" },
    { id: 'b2', name: "Gamma", url: "https://gamma.app/", description: "Visual Content", category: "Business", icon: "✨" },
    { id: 'b3', name: "Jenni", url: "https://app.jenni.ai/", description: "Writing Assistant", category: "Business", icon: "✒️" },
    { id: 'b4', name: "Apify", url: "https://apify.com/", description: "Web Scraping & Data", category: "Business", icon: "🕷️" },
    { id: 'b5', name: "Jeeva AI", url: "https://www.jeeva.ai/", description: "Agentic Sales", category: "Business", icon: "👔" },
    { id: 'b6', name: "Atlas", url: "https://youratlas.com/", description: "Revenue Engine", category: "Business", icon: "🗺️" },
    { id: 'b7', name: "AI Cofounder", url: "https://aicofounder.com/dashboard", description: "Startup Partner", category: "Business", icon: "🤝" }
  ],
  "Build": [
    { id: 'bd1', name: "AI Studio Build", url: "https://aistudio.google.com/apps", description: "App Creator", category: "Build", icon: "🛠️" },
    { id: 'bd2', name: "Rork", url: "https://rork.com/", description: "Mobile Vibe Coding", category: "Build", icon: "📱" },
    { id: 'bd3', name: "Base44", url: "https://app.base44.com/", description: "Web Builder", category: "Build", icon: "📦" },
    { id: 'bd4', name: "Orchids", url: "https://www.orchids.app/", description: "Fullstack Engineer", category: "Build", icon: "🌸" },
    { id: 'bd5', name: "Tempo", url: "https://www.tempo.new/", description: "Swift Dev", category: "Build", icon: "⏳" },
    { id: 'bd6', name: "Webflow", url: "https://webflow.com/", description: "Professional Web Design", category: "Build", icon: "🌐" },
    { id: 'bd7', name: "Framer", url: "https://framer.com/projects/", description: "Interactive Design", category: "Build", icon: "🎨" },
    { id: 'bd8', name: "Dora AI", url: "https://www.dora.run/ai", description: "3D Sites", category: "Build", icon: "🧊" },
    { id: 'bd9', name: "Natively", url: "https://natively.dev/", description: "Mobile App Builder", category: "Build", icon: "🏗️" },
    { id: 'bd10', name: "Flames.blue", url: "https://flames.blue/", description: "App Builder", category: "Build", icon: "🔥" },
    { id: 'bd11', name: "Emergent", url: "https://app.emergent.sh/home", description: "App Platform", category: "Build", icon: "⚡" },
    { id: 'bd12', name: "Readdy", url: "https://readdy.ai/project", description: "Quick Projects", category: "Build", icon: "🚀" },
    { id: 'bd13', name: "Tombo", url: "https://www.tombo.io/", description: "Better Software", category: "Build", icon: "🛠️" },
    { id: 'bd14', name: "Landingsite.ai", url: "https://www.landingsite.ai/", description: "Landing Pages", category: "Build", icon: "🏠" },
    { id: 'bd15', name: "Same", url: "https://same.new/", description: "Collaboration", category: "Build", icon: "🔗" },
    { id: 'bd16', name: "Mocha", url: "https://getmocha.com/", description: "No-Code App Builder", category: "Build", icon: "☕" },
    { id: 'bd17', name: "Vibecode", url: "https://www.vibecodeapp.com/workspace", description: "Development Space", category: "Build", icon: "💻" },
    { id: 'bd18', name: "Panda", url: "https://app.usepanda.com/", description: "Feed & Discovery", category: "Build", icon: "🐼" },
    { id: 'bd19', name: "Mobbin Apps", url: "https://mobbin.com/discover/apps/ios/latest", description: "App Design Library", category: "Build", icon: "📱" },
    { id: 'bd20', name: "Mobbin Sites", url: "https://mobbin.com/discover/sites/latest", description: "Web Design Library", category: "Build", icon: "🌐" },
    { id: 'bd21', name: "Lapa Ninja", url: "https://www.lapa.ninja/", description: "Landing Page Inspiration", category: "Build", icon: "🥷" },
    { id: 'bd22', name: "Dribbble", url: "https://dribbble.com/", description: "Design Inspiration", category: "Build", icon: "🏀" },
    { id: 'bd23', name: "Figma Templates", url: "https://www.figma.com/community/website-templates", description: "Design Community", category: "Build", icon: "🎨" },
    { id: 'bd24', name: "Framer Templates", url: "https://www.framer.com/marketplace/templates/", description: "Website Templates", category: "Build", icon: "🖼️" },
    { id: 'bd25', name: "Aura", url: "https://www.aura.build/create", description: "Beautiful Designs", category: "Build", icon: "🕯️" },
    { id: 'bd26', name: "Free Faces", url: "https://www.freefaces.gallery/", description: "Typography Library", category: "Build", icon: "🔡" },
    { id: 'bd27', name: "UIColours", url: "https://uicolours.com/", description: "Color Palettes", category: "Build", icon: "🌈" }
  ],
  "Content": [
    { id: 'c1', name: "Canva", url: "https://www.canva.com/", description: "Graphic Design", category: "Content", icon: "🎨" },
    { id: 'c2', name: "Sora", url: "https://sora.chatgpt.com/explore", description: "OpenAI Video", category: "Content", icon: "🎬" },
    { id: 'c3', name: "DALL-E Free", url: "https://www.dall-efree.com/", description: "Image Generator", category: "Content", icon: "🖼️" },
    { id: 'c4', name: "Vizard.ai", url: "https://vizard.ai/", description: "Video Editing", category: "Content", icon: "📽️" },
    { id: 'c5', name: "Higgsfield", url: "https://higgsfield.ai/", description: "Video & Image AI", category: "Content", icon: "🎥" },
    { id: 'c6', name: "Reve", url: "https://higgsfield.ai/image/reve", description: "AI Visuals", category: "Content", icon: "🌟" },
    { id: 'c7', name: "Hera", url: "https://hera.video/", description: "AI Motion Designer", category: "Content", icon: "✨" },
    { id: 'c8', name: "Shader Gradient", url: "https://shadergradient.co/", description: "Mesh Gradients", category: "Content", icon: "🌈" },
    { id: 'c9', name: "Unicorn Studio", url: "https://www.unicorn.studio/dashboard", description: "No-code WebGL", category: "Content", icon: "🦄" },
    { id: 'c10', name: "Unsplash", url: "https://unsplash.com/", description: "High-res Photos", category: "Content", icon: "📷" },
    { id: 'c11', name: "React Bits", url: "https://reactbits.dev/", description: "UI Components", category: "Content", icon: "⚛️" },
    { id: 'c12', name: "Stitch", url: "https://stitch.withgoogle.com/", description: "Design with AI", category: "Content", icon: "🧵" }
  ],
  "Dev Tools": [
    { id: 'd1', name: "Hugging Face", url: "https://huggingface.co/spaces", description: "AI Community Hub", category: "Dev Tools", icon: "🤗" },
    { id: 'd2', name: "GitHub Spark", url: "https://github.com/features/spark", description: "AI Apps", category: "Dev Tools", icon: "✨" },
    { id: 'd3', name: "OpenRouter", url: "https://openrouter.ai/", description: "Unified AI API", category: "Dev Tools", icon: "🔌" },
    { id: 'd4', name: "GroqCloud", url: "https://console.groq.com/home", description: "Fast Inference", category: "Dev Tools", icon: "💨" },
    { id: 'd5', name: "Code Wiki", url: "https://codewiki.google/", description: "Google Code Wiki", category: "Dev Tools", icon: "📖" },
    { id: 'd6', name: "RapidAPI Hub", url: "https://rapidapi.com/hub", description: "API Ecosystem", category: "Dev Tools", icon: "🌐" },
    { id: 'd7', name: "Open Alternative", url: "https://openalternative.co/", description: "Open Source Apps", category: "Dev Tools", icon: "📂" },
    { id: 'd8', name: "Prompt Cheatsheet", url: "https://docs.google.com/document/d/1hpRTSTLsXr471q7I_YK54", description: "Dan Martell's Guide", category: "Dev Tools", icon: "📄" },
    { id: 'd9', name: "Voice AI Easy", url: "https://www.skool.com/aa-academy/classroom/459c05de", description: "Skool Course", category: "Dev Tools", icon: "🎙️" }
  ],
  "Libraries": [
    { id: 'l1', name: "Rundown", url: "https://www.rundown.ai/tools", description: "AI Tools Directory", category: "Libraries", icon: "📋" },
    { id: 'l2', name: "AI Valley", url: "https://aivalley.ai/", description: "Discovery Platform", category: "Libraries", icon: "🏔️" },
    { id: 'l3', name: "PromptBase", url: "https://promptbase.com/", description: "Prompt Marketplace", category: "Libraries", icon: "🏬" },
    { id: 'l4', name: "FlowGPT", url: "https://flowgpt.com/", description: "AI Character Roleplay", category: "Libraries", icon: "💬" },
    { id: 'l5', name: "AiTools", url: "https://aitools.sh/", description: "Free AI Library", category: "Libraries", icon: "🛠️" },
    { id: 'l6', name: "Snack Prompt", url: "https://snackprompt.com/", description: "Prompt Community", category: "Libraries", icon: "🍿" },
    { id: 'l7', name: "Prompt Packs", url: "https://academy.openai.com/public/tags/prompt-packs", description: "OpenAI Academy", category: "Libraries", icon: "📦" },
    { id: 'l8', name: "Chat Prompts", url: "https://prompts.forwardfuture.ai/chat-prompts", description: "Forward Future", category: "Libraries", icon: "🗣️" },
    { id: 'l9', name: "AI Toolkit", url: "https://tidal-celery-e12.notion.site/129db48aa22b801790adf1a87", description: "Notion Directory", category: "Libraries", icon: "🗂️" },
    { id: 'l10', name: "TinyWow", url: "https://tinywow.com/", description: "PDF & Image Tools", category: "Libraries", icon: "📦" },
    { id: 'l11', name: "Latent Box", url: "https://latentbox.com/en", description: "AI Tools Hub", category: "Libraries", icon: "🗃️" },
    { id: 'l12', name: "Coding Rundown", url: "https://www.google.com/search?q=https%3A%2F%2Frundown.ai", description: "Coding AI Search", category: "Libraries", icon: "🔍" },
    { id: 'l13', name: "Phygital Plus", url: "https://www.google.com/search?q=https%3A%2F%2Flibrary.phygital.plus", description: "Design AI Library", category: "Libraries", icon: "🎨" },
    { id: 'l14', name: "Business AI", url: "https://www.hypotenuse.ai/blog/best-ai-tools-for-small-business", description: "Hypotenuse Guide", category: "Libraries", icon: "💼" }
  ]
};