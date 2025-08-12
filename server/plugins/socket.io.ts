import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import { createReplicants, getReplicant } from '~/utils/replicants';

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server();

  io.bind(engine);
  // Initialize the replicants if it doesn't already exist
  createReplicants();

  io.on("connection", (socket) => {
    
    // Expecting { name }
    socket.on('replicant:subscribe', ({ name }: { name: string }) => {
      const rep = getReplicant(name);
      if (!rep) return;
      rep.subscribe((val) => socket.emit(`replicant:update:${name}`, val));
    });

    // Expecting { name, value }
    socket.on('replicant:set', ({ name, value }: { name: string; value: unknown }) => {
      const rep = getReplicant(name);
      rep?.set(value);
    });
  });

  nitroApp.router.use("/socket.io/", defineEventHandler({
    handler(event) {
      // @ts-expect-error
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