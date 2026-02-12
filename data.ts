import { AITool } from './types';

// SVGs recreated as base64 data URIs for clean, professional rendering on the orbital buttons
const TWAIN_GPT_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgNjAiPjx0ZXh0IHg9IjEwIiB5PSI0MiIgZm9udC1mYW1pbHk9Ik91dGZpdCwgc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjYwMCIgZm9udC1zaXplPSIzNCIgZmlsbD0id2hpdGUiPnR3YWluPC90ZXh0PjxyZWN0IHg9IjEwNSIgeT0iMTQiIHdpZHRoPSI1NCIgaGVpZ2h0PSIzOCIgcng9IjgiIGZpbGw9IiMyNTYzZWIiLz48dGV4dCB4PSIxMzIiIHk9IjQwIiBmb250LWZhbWlseT0iT3V0Zml0LCBzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iNzAwIiBmb250LXNpemU9IjIyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R1BUPC90ZXh0Pjwvc3ZnPg==";
const OPAL_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgNjAiPjx0ZXh0IHg9IjYwIiB5PSI0MiIgZm9udC1mYW1pbHk9Ik91dGZpdCwgc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjcwMCIgZm9udC1zaXplPSIzOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk9wYWw8L3RleHQ+PC9zdmc+";

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
  ],
  "Tasks": [
    { id: 't1', name: "Venngage", url: "https://infograph.venngage.com/universal-generator", description: "Infographic Generator", category: "Tasks", icon: "📊" },
    { id: 't2', name: "Visme", url: "https://www.visme.co/", description: "Presentation Maker", category: "Tasks", icon: "📽️" },
    { id: 't3', name: "Gemini Code", url: "https://codeassist.google/", description: "Code Assist", category: "Tasks", icon: "💻" },
    { id: 't4', name: "Wispr Flow", url: "https://wisprflow.ai/", description: "Voice Dictation", category: "Tasks", icon: "🎙️" },
    { id: 't5', name: "Opal", url: "https://opal.google/", description: "Google Experiment", category: "Tasks", icon: "🔮", logoUrl: OPAL_LOGO },
    { id: 't6', name: "MGX", url: "https://mgx.dev/", description: "MetaGPT X Dev Team", category: "Tasks", icon: "🏗️" },
    { id: 't7', name: "Excel AI", url: "https://app.formulabot.com/excel-ai", description: "Formulas & Analysis", category: "Tasks", icon: "📈" },
    { id: 't8', name: "Eraser", url: "https://www.eraser.io/", description: "Technical Design", category: "Tasks", icon: "📐" },
    { id: 't9', name: "DeepL", url: "https://www.deepl.com/en/translator", description: "AI Translation", category: "Tasks", icon: "🌍" },
    { id: 't10', name: "TwainGPT", url: "https://app.twaingpt.com/humanizer", description: "AI Humanizer", category: "Tasks", icon: "✍️", logoUrl: TWAIN_GPT_LOGO },
    { id: 't11', name: "ZeroGPT", url: "https://www.zerogpt.com/", description: "AI Detector", category: "Tasks", icon: "🛡️" }
  ],
  "Business": [
    { id: 'b1', name: "Abacus.AI", url: "https://abacus.ai/", description: "Professional Assistant", category: "Business", icon: "🧮" },
    { id: 'b2', name: "Jeeva AI", url: "https://www.jeeva.ai/", description: "Agentic Sales", category: "Business", icon: "👔" },
    { id: 'b3', name: "Apify", url: "https://apify.com/", description: "Web Scraping", category: "Business", icon: "🕷️" },
    { id: 'b4', name: "Atlas", url: "https://youratlas.com/", description: "Revenue Engine", category: "Business", icon: "🗺️" },
    { id: 'b5', name: "AI Cofounder", url: "https://aicofounder.com/dashboard", description: "Startup Partner", category: "Business", icon: "🤝" },
    { id: 'b6', name: "Jenni", url: "https://app.jenni.ai/", description: "Writing Assistant", category: "Business", icon: "✒️" },
    { id: 'b7', name: "Gamma", url: "https://gamma.app/", description: "Visual Content", category: "Business", icon: "✨" }
  ],
  "Build": [
    { id: 'bd1', name: "Rork", url: "https://rork.com/", description: "Mobile Vibe Coding", category: "Build", icon: "📱" },
    { id: 'bd2', name: "Orchids", url: "https://www.orchids.app/", description: "Fullstack Engineer", category: "Build", icon: "🌸" },
    { id: 'bd3', name: "Tempo", url: "https://www.tempo.new/", description: "Swift Dev", category: "Build", icon: "⏳" },
    { id: 'bd4', name: "Emergent", url: "https://app.emergent.sh/home", description: "App Platform", category: "Build", icon: "⚡" },
    { id: 'bd5', name: "Landingsite", url: "https://www.landingsite.ai/", description: "Quick Landers", category: "Build", icon: "🏠" },
    { id: 'bd6', name: "Tombo", url: "https://www.tombo.io/", description: "Better Software", category: "Build", icon: "🛠️" },
    { id: 'bd7', name: "Natively", url: "https://natively.dev/", description: "Mobile App Builder", category: "Build", icon: "🏗️" },
    { id: 'bd8', name: "Flames", url: "https://flames.blue/", description: "App Builder", category: "Build", icon: "🔥" },
    { id: 'bd9', name: "Dora AI", url: "https://www.dora.run/ai", description: "3D Sites", category: "Build", icon: "🧊" },
    { id: 'bd10', name: "Aura", url: "https://www.aura.build/create", description: "Beautiful Designs", category: "Build", icon: "🕯️" },
    { id: 'bd11', name: "Mocha", url: "https://getmocha.com/", description: "No-Code Builder", category: "Build", icon: "☕" }
  ],
  "Content": [
    { id: 'c1', name: "DALL-E Free", url: "https://www.dall-efree.com/", description: "Image Generator", category: "Content", icon: "🖼️" },
    { id: 'c2', name: "Sora", url: "https://sora.chatgpt.com/explore", description: "OpenAI Video", category: "Content", icon: "🎬" },
    { id: 'c3', name: "Vizard.ai", url: "https://vizard.ai/", description: "Video Editing", category: "Content", icon: "📽️" },
    { id: 'c4', name: "React Bits", url: "https://reactbits.dev/", description: "UI Components", category: "Content", icon: "⚛️" },
    { id: 'c5', name: "Hera", url: "https://hera.video/", description: "Motion Designer", category: "Content", icon: "✨" },
    { id: 'c6', name: "Unsplash", url: "https://unsplash.com/", description: "Free Stock Photos", category: "Content", icon: "📷" },
    { id: 'c7', name: "Higgsfield", url: "https://higgsfield.ai/", description: "Video Generator", category: "Content", icon: "🎥" },
    { id: 'c8', name: "Unicorn", url: "https://www.unicorn.studio/dashboard", description: "No-Code WebGL", category: "Content", icon: "🦄" },
    { id: 'c9', name: "Shader Grad", url: "https://shadergradient.co/", description: "Gradients", category: "Content", icon: "🌈" },
    { id: 'c10', name: "Stitch", url: "https://stitch.withgoogle.com/", description: "Design AI", category: "Content", icon: "🧵" }
  ],
  "Dev Tools": [
    { id: 'd1', name: "Hugging Face", url: "https://huggingface.co/spaces", description: "AI Model Hub", category: "Dev", icon: "🤗" },
    { id: 'd2', name: "GitHub Spark", url: "https://github.com/features/spark", description: "Next-gen AI Apps", category: "Dev", icon: "✨" },
    { id: 'd3', name: "Code Wiki", url: "https://codewiki.google/", description: "Google Code Wiki", category: "Dev", icon: "📖" },
    { id: 'd4', name: "Open Alt", url: "https://openalternative.co/", description: "OS Alternatives", category: "Dev", icon: "📂" },
    { id: 'd5', name: "OpenRouter", url: "https://openrouter.ai/", description: "Unified AI API", category: "Dev", icon: "🔌" },
    { id: 'd6', name: "GroqCloud", url: "https://console.groq.com/home", description: "Fast Inference", category: "Dev", icon: "💨" },
    { id: 'd7', name: "RapidAPI", url: "https://rapidapi.com/hub", description: "API Hub", category: "Dev", icon: "🌐" }
  ],
  "Libraries": [
    { id: 'l1', name: "Rundown", url: "https://www.rundown.ai/tools", description: "AI Tools Directory", category: "Libraries", icon: "📋" },
    { id: 'l2', name: "AI Valley", url: "https://aivalley.ai/", description: "Discovery Platform", category: "Libraries", icon: "🏔️" },
    { id: 'l3', name: "TinyWow", url: "https://tinywow.com/", description: "PDF & Image Tools", category: "Libraries", icon: "📦" },
    { id: 'l4', name: "Latent Box", url: "https://latentbox.com/en", description: "AI Tools Hub", category: "Libraries", icon: "🗃️" },
    { id: 'l5', name: "AiTools.sh", url: "https://aitools.sh/", description: "Free AI Library", category: "Libraries", icon: "🛠️" },
    { id: 'l6', name: "Snack Prompt", url: "https://snackprompt.com/", description: "Community Prompts", category: "Libraries", icon: "🍿" },
    { id: 'l7', name: "PromptBase", url: "https://promptbase.com/", description: "Prompt Marketplace", category: "Libraries", icon: "🏬" },
    { id: 'l8', name: "FlowGPT", url: "https://flowgpt.com/", description: "AI Roleplay", category: "Libraries", icon: "💬" }
  ]
};