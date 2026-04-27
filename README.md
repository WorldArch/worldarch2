# Fable Forge AI Chat

[![Deploy to Cloudflare][cloudflarebutton]]

A production-ready, full-stack AI chat application built on Cloudflare Workers. Features multi-session conversations, streaming responses, tool calling (weather, web search, MCP tools), model switching, and a modern React UI with shadcn/ui components. Powered by Cloudflare Durable Objects, Agents SDK, and AI Gateway for scalable, edge-deployed AI experiences.

## Features

- **Multi-Session Chat**: Create, manage, delete, and switch between chat sessions with automatic title generation.
- **AI Integration**: Supports Gemini models via Cloudflare AI Gateway with streaming and tool calling.
- **Built-in Tools**: Weather lookup, web search (SerpAPI), URL content fetching, and extensible MCP tools.
- **Modern UI**: Responsive design with Tailwind CSS, shadcn/ui, dark mode, sidebar navigation, and toast notifications.
- **Session Management**: List sessions, update titles, clear all, and activity tracking.
- **Type-Safe**: Full TypeScript with Workers types, React Query for state management.
- **Edge-Optimized**: Zero-cold-start Durable Objects for stateful sessions, global deployment.
- **Developer-Friendly**: Hot reload, Bun-powered dev server, one-command deploy.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide icons, React Router, TanStack Query, Sonner (toasts).
- **Backend**: Cloudflare Workers, Hono (routing), Cloudflare Agents SDK, Durable Objects.
- **AI**: Cloudflare AI Gateway, OpenAI SDK (Gemini models), SerpAPI (search), MCP SDK (tools).
- **State**: Durable Objects for chat state and session management.
- **Build Tools**: Bun, Wrangler, esbuild/Vite.

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (package manager)
- [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/install/) CLI
- Cloudflare account with Workers enabled
- AI Gateway setup (for `CF_AI_BASE_URL` and `CF_AI_API_KEY`)
- Optional: SerpAPI key for web search (`SERPAPI_KEY`)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd fable-forge-ai-chat
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure environment variables in `wrangler.jsonc`:
   ```json
   "vars": {
     "CF_AI_BASE_URL": "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai",
     "CF_AI_API_KEY": "{your-api-key}",
     "SERPAPI_KEY": "{optional-serpapi-key}"
   }
   ```

4. Generate Worker types:
   ```bash
   bun run cf-typegen
   ```

### Development

Start the dev server:
```bash
bun dev
```

- App runs at `http://localhost:3000` (or `${PORT:-3000}`).
- Worker API at `/api/*`.
- Edit `src/pages/HomePage.tsx` for custom UI or `worker/userRoutes.ts` for custom endpoints.
- Hot reload enabled for frontend and worker.

### Build & Preview

```bash
bun run build    # Build frontend assets
bun run preview  # Preview production build
```

## Usage

- **Chat Sessions**: Create new sessions via API or UI. Messages stream in real-time.
- **Model Switching**: Select from Gemini 2.5 Flash/Pro/2.0 Flash.
- **Tools**: AI auto-calls tools like `get_weather("London")` or `web_search({query: "Cloudflare Workers"})`.
- **API Endpoints**:
  | Endpoint | Method | Description |
  |----------|--------|-------------|
  | `/api/chat/:sessionId/chat` | POST | Send message `{message: "...", model?: "...", stream?: true}` |
  | `/api/chat/:sessionId/messages` | GET | Get chat state |
  | `/api/chat/:sessionId/clear` | DELETE | Clear messages |
  | `/api/sessions` | GET/POST/DELETE | Manage sessions |
- Frontend hooks: `useChatService()` from `@/lib/chat.ts`.

## Deployment

1. Build assets:
   ```bash
   bun run build
   ```

2. Deploy to Cloudflare:
   ```bash
   bun run deploy
   ```

3. Configure bindings in Wrangler Dashboard:
   - Update `CF_AI_BASE_URL`, `CF_AI_API_KEY`, `SERPAPI_KEY`.
   - Durable Objects auto-migrate via `wrangler.jsonc`.

[![Deploy to Cloudflare][cloudflarebutton]]

Your app will be live at `https://{your-subdomain}.workers.dev` with SPA routing.

## Customization

- **UI**: Replace `src/pages/HomePage.tsx`. Use shadcn CLI: `bunx shadcn@latest add <component>`.
- **Routes**: Add to `worker/userRoutes.ts`.
- **Tools**: Extend `worker/tools.ts` or add MCP servers in `worker/mcp-client.ts`.
- **AI Prompts**: Modify system message in `worker/chat.ts`.
- **Models**: Update `MODELS` in `src/lib/chat.ts`.

## Troubleshooting

- **AI Gateway**: Ensure gateway proxies `@cf/meta/llama-3.1-70b-instruct` or Gemini.
- **Durable Objects**: Check migrations in `wrangler.jsonc`.
- **CORS**: Pre-configured for `/api/*`.
- **Logs**: `wrangler tail` for Worker logs.

## License

MIT. See [LICENSE](LICENSE) for details.