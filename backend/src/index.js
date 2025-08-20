import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
import { createServer } from "http";
import { initWebSocket } from "./websocket.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5001;

const server = createServer(app);

initWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server -> HTTP & WebSocket is running on port ${PORT}`);
});
