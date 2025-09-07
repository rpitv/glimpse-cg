import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import { createReplicants, getReplicant } from '~/utils/replicants';
import { migrateReplicantsSchema } from "~/utils/db";

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server();

  io.bind(engine);
  // Initialize the replicants if it doesn't already exist
  createReplicants();
  // Migrate replicants schema if needed
  migrateReplicantsSchema();

  io.on("connection", (socket) => {
    const unsubscribers: (() => void)[] = [];

    // Expecting { name }
    socket.on('replicant:subscribe', ({ name }: { name: string }) => {
      const rep = getReplicant(name);
      if (!rep) return;
      const unsubscribe = rep.subscribe((val) => {
        socket.emit(`replicant:update:${name}`, val);
      });
      unsubscribers.push(unsubscribe);
    });

    // Expecting { name, value }
    socket.on('replicant:set', ({ name, value }: { name: string; value: unknown }) => {
      const rep = getReplicant(name);
      rep?.set(value);
    });

    socket.on("disconnect", () => {
      unsubscribers.forEach((fn) => fn());
      unsubscribers.length = 0;
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