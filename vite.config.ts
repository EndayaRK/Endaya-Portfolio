import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }

  return {
    plugins: [
      react(),
      {
        name: "local-api-chat-middleware",
        configureServer(server) {
          let cachedChatHandler: any = null;
          server.watcher.on("change", (file) => {
            if (file.includes("api/chat.ts") || file.includes("api\\chat.ts")) {
              cachedChatHandler = null;
            }
          });

          server.middlewares.use(async (req, res, next) => {
            if (req.url === "/api/chat" || req.url?.startsWith("/api/chat?")) {
              if (req.method === "OPTIONS") {
                res.statusCode = 200;
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
                res.setHeader("Access-Control-Allow-Headers", "Content-Type");
                res.end();
                return;
              }

              if (req.method === "POST") {
                const buffers: Buffer[] = [];
                req.on("data", (chunk: Buffer) => buffers.push(chunk));
                req.on("end", async () => {
                  const bodyStr = Buffer.concat(buffers).toString("utf-8");
                  try {
                    if (!cachedChatHandler) {
                      const chatModule = await server.ssrLoadModule("/api/chat.ts");
                      cachedChatHandler = chatModule.default;
                    }
                    const handler = cachedChatHandler;
                    let parsedBody = {};
                    try {
                      parsedBody = JSON.parse(bodyStr);
                    } catch {}
                    const mockReq = {
                      method: req.method,
                      body: parsedBody,
                      headers: req.headers,
                    };
                    await handler(mockReq, res);
                  } catch (err: any) {
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "application/json");
                    res.end(
                      JSON.stringify({
                        error: err?.message || "Internal Server Error",
                      })
                    );
                  }
                });
                return;
              }
            }
            next();
          });
        },
      },
    ],
  };
});
