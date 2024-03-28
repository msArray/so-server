import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import { server } from "./component/instance";
import { Vec2 } from "./component/vector";

const { upgradeWebSocket, websocket } = createBunWebSocket();

const app = new Hono();
const PORT = 3000;
const Server = new server();

app.get("/", (c) => {
  return c.text("soudesu korega api sa-ba-da");
});

app.get(
  "/ws",
  upgradeWebSocket((c) => {
    let intervalId: any;
    return {
      onOpen(_event, ws) {
        /*intervalId = setInterval(() => {
          const me = Server.spawnPlayer();
          ws.send(JSON.stringify({
            type:"spawn",
            data: me.hash,
          }));
        }, 1000/30);*/
      },
      onMessage(event, ws) {
        const data = JSON.parse(`${event.data}`);
        console.log(`Message from client: ${event.data}`);
        switch (data.type) {
          case "connect":
            const me = Server.spawnPlayer();
            ws.send(JSON.stringify({
              type:"spawn",
              body: me.hash,
            }));
            break;
          case "move":
            Server.update(data.body.hash,new Vec2(data.body.x, data.body.y));
            break;
        }
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