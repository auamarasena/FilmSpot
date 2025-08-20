import { WebSocketServer } from "ws";
import ShowtimeSeats from "./models/showtimeSeatsModel.js";

let wss;

// In-memory object to track clients in showtime-specific "rooms"
const rooms = {}; // e.g., { "showtimeId123": Set(ws1, ws2), ... }

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("✅ WebSocket Client connected");

    ws.on("close", () => {
      console.log("WebSocket Client disconnected");
      // When a client disconnects, if they were in a seat selection room,
      // we should unlock any seats they had locked.
      if (ws.showtimeId && ws.lockedSeats && ws.lockedSeats.size > 0) {
        const seatIds = Array.from(ws.lockedSeats);
        ShowtimeSeats.updateMany(
          { _id: { $in: seatIds } },
          { $set: { status: "available" } }
        )
          .then(() => {
            seatIds.forEach((seatId) => {
              broadcastToRoom(
                ws.showtimeId,
                { type: "seat_unlocked", showtimeSeatId: seatId },
                ws
              );
            });
          })
          .catch((err) =>
            console.error("Error unlocking seats on disconnect:", err)
          );
      }

      // Also remove them from the room tracking object
      if (ws.showtimeId && rooms[ws.showtimeId]) {
        rooms[ws.showtimeId].delete(ws);
      }
    });

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);

        switch (data.action) {
          case "join_showtime_room":
            if (ws.showtimeId && rooms[ws.showtimeId])
              rooms[ws.showtimeId].delete(ws);
            ws.showtimeId = data.showtimeId;
            ws.lockedSeats = new Set(); // Track seats locked by this specific client
            if (!rooms[data.showtimeId]) rooms[data.showtimeId] = new Set();
            rooms[data.showtimeId].add(ws);
            console.log(`Client joined room: ${data.showtimeId}`);
            break;

          case "lock_seat":
          case "unlock_seat":
            const { showtimeSeatId } = data;
            const newStatus =
              data.action === "lock_seat" ? "locked" : "available";

            const updatedSeat = await ShowtimeSeats.findByIdAndUpdate(
              showtimeSeatId,
              { status: newStatus },
              { new: true }
            );

            if (updatedSeat) {
              if (newStatus === "locked") {
                ws.lockedSeats.add(showtimeSeatId);
              } else {
                ws.lockedSeats.delete(showtimeSeatId);
              }
              const broadcastData = {
                type: newStatus === "locked" ? "seat_locked" : "seat_unlocked",
                showtimeSeatId: updatedSeat._id,
              };
              broadcastToRoom(ws.showtimeId, broadcastData, ws);
            }
            break;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
  });

  console.log("🚀 WebSocket Server initialized");
};

export const broadcastMessage = (messageObject) => {
  if (!wss) return;
  const messageString = JSON.stringify(messageObject);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) client.send(messageString);
  });
};

const broadcastToRoom = (showtimeId, messageObject, senderWs) => {
  const roomClients = rooms[showtimeId];
  if (roomClients) {
    const messageString = JSON.stringify(messageObject);
    roomClients.forEach((client) => {
      if (client !== senderWs && client.readyState === client.OPEN) {
        client.send(messageString);
      }
    });
  }
};
