import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import { createReplicants, getReplicant } from '~/utils/replicants';

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server();

  io.bind(engine);
  // Initialize the replicants for a default channel (e.g., 'default')
  const defaultChannel = "default";
  createReplicants(defaultChannel);

  io.on("connection", (socket) => {
    
    // Expecting { channel, name }
    socket.on('replicant:subscribe', ({ channel, name }: { channel: string; name: string }) => {
      // Create the channel if it doesn't exist
      let rep = getReplicant(channel, name);
      if (!rep) {
        createReplicants(channel);
        rep = getReplicant(channel, name);
      }
      if (!rep) return;
      rep.subscribe((val) => socket.emit(`replicant:update:${channel}:${name}`, val));
    });

    // Expecting { channel, name, value }
    socket.on('replicant:set', ({ channel, name, value }: { channel: string; name: string; value: unknown }) => {
      const rep = getReplicant(channel, name);
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