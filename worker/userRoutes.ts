import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId);
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
        return agent.fetch(new Request(url.toString(), {
            method: c.req.method,
            headers: c.req.header(),
            body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
        }));
        } catch (error) {
        return c.json({ success: false, error: API_RESPONSES.AGENT_ROUTING_FAILED }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.get('/api/sessions', async (c) => {
        const controller = getAppController(c.env);
        const sessions = await controller.listSessions();
        return c.json({ success: true, data: sessions });
    });
    app.get('/api/fashion', async (c) => {
        return c.json({
            images: [
                { url: 'https://images.unsplash.com/photo-1550928431-ee0ec6db30d3?auto=format&fit=crop&q=80&w=800', label: 'CORE_VEST_V1' },
                { url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800', label: 'NEURAL_HOOD' },
                { url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800', label: 'TECH_CARGO' },
                { url: 'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&q=80&w=800', label: 'VISUAL_INTERFACE' },
                { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800', label: 'SIGNAL_BOOTS' },
                { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', label: 'DATA_STRAP' }
            ]
        });
    });
    app.post('/api/sessions', async (c) => {
        const body = await c.req.json().catch(() => ({}));
        const { title, sessionId: providedSessionId } = body;
        const sessionId = providedSessionId || crypto.randomUUID();
        await registerSession(c.env, sessionId, title || `Node ${sessionId.slice(0,4)}`);
        return c.json({ success: true, data: { sessionId } });
    });
    app.delete('/api/sessions/:sessionId', async (c) => {
        const sessionId = c.req.param('sessionId');
        const deleted = await unregisterSession(c.env, sessionId);
        return c.json({ success: true, data: { deleted } });
    });
}