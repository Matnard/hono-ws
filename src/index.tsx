import { Hono } from "hono";
import { html } from "hono/html";
import { createBunWebSocket } from "hono/bun";

const { upgradeWebSocket, websocket } = createBunWebSocket();

const app = new Hono();

const View = () => {
  return (
    <html>
      <body id={"swipe-area"}>
        {html`
          <script src="https://cdn.jsdelivr.net/npm/hammerjs@2.0.8/hammer.min.js"></script>
          <style>
            #swipe-area {
              width: 100vw;
              height: 100vh;
            }
          </style>
          <script>
            // Establish WebSocket connection
            const ws = new WebSocket("ws://localhost:3000/ws");
            ws.addEventListener("open", function () {
              console.log("WebSocket connection established");
            });

            // Initialize Hammer.js on the swipe-area element
            var swipeArea = document.getElementById("swipe-area");
            var hammer = new Hammer(swipeArea);

            // Listen for swipe events
            hammer.on("swipeleft", function (event) {
              // Alert when swiped left
              ws.send(JSON.stringify({ angle: 90 }));
            });

            hammer.on("swiperight", function (event) {
              // Alert when swiped right
              ws.send(JSON.stringify({ angle: 270 }));
            });
          </script>
        `}
      </body>
    </html>
  );
};

app.get("/", (c) => {
  return c.html(<View />);
});

const ws = app.get(
  "/ws",
  upgradeWebSocket((_c) => {
    return {
      onMessage: (event) => {
        console.log(event.data);
      },
    };
  })
);

Bun.serve({
  fetch: app.fetch,
  websocket,
});
export default app;
