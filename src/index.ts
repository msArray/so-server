import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";

const { upgradeWebSocket, websocket } = createBunWebSocket();

const app = new Hono();
const PORT = 3000;

app.get("/", (c) => {
  return c.text("api");
});

app.get(
  "/ws",
  upgradeWebSocket((c) => {
    let intervalId: any;
    return {
      onOpen(_event, ws) {
        intervalId = setInterval(() => {
          ws.send("あかさたな　はまやらわ");
        }, 1000/30);
      },
      onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`);
        ws.send(`Echo: ${event.data}`);
      },
      onClose() {
        clearInterval(intervalId);
      },
    };
  })
);

Bun.serve({
  fetch: app.fetch,
  websocket,
  port: PORT,
});
console.log(`Server started at ${PORT}`);