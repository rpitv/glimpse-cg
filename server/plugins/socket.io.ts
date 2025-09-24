import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import { replicants, subscribe } from "~/utils/replicants";
import { setDeep, deleteDeep } from "~/utils/pathHelpers";

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server();

  io.bind(engine);

  io.on("connection", (socket) => {
    // Send full state on connect
    socket.emit("init", replicants)

    // Handle patches from client
    socket.on("patch", ({ path, value }) => {
      setDeep(replicants, path, value)
      io.emit("patch", { path, value }) // broadcast to everyone
    })

    // Handle deletes from client
    socket.on("delete", ({ path }) => {
      deleteDeep(replicants, path)
      io.emit("delete", { path }) // broadcast to everyone
    })

  });

  nitroApp.router.use("/socket.io/", defineEventHandler({
    handler(event) {
      engine.handleRequest(event.node.req, event.node.res);
      event._handled = true;
    },
    websocket: {
      open(peer) {
        // @ts-expect-error private method and property
        engine.prepare(peer._internal.nodeReq);
        // @ts-expect-error private method and property
        engine.onWebSocket(peer._internal.nodeReq, peer._internal.nodeReq.socket, peer.websocket);
      }
    }
  }));
});