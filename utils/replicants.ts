// Delete all replicants for a channel (except 'default')
import { db } from './db';

export function deleteReplicantChannel(channel: string) {
  if (channel === 'default') return;
  replicants.delete(channel);
  db.prepare('DELETE FROM replicants WHERE channel = ?').run(channel);
}

import { defaultConfiguration, defaultExternal, defaultFullscreen, defaultLowerThird, defaultScoreboard } from '~/types/replicants';
import { saveReplicant, loadReplicant } from './db';

type Replicant<T> = {
  value: T;
  listeners: Set<(val: T) => void>;
  set: (val: T) => void;
  subscribe: (cb: (val: T) => void) => void;
};

// Map structure: channel -> name -> Replicant
const replicants = new Map<string, Map<string, Replicant<any>>>();


export function createReplicant<T>(channel: string, name: string, defaultValue: T): Replicant<T> {
  if (!replicants.has(channel)) {
    replicants.set(channel, new Map());
  }
  const channelMap = replicants.get(channel)!;
  if (channelMap.has(name)) return channelMap.get(name)!;

  const value = loadReplicant<T>(channel, name) ?? defaultValue;

  const rep: Replicant<T> = {
    value,
    listeners: new Set(),
    set(val) {
      rep.value = val;
      saveReplicant(channel, name, val);
      rep.listeners.forEach(cb => cb(rep.value));
    },
    subscribe(cb) {
      rep.listeners.add(cb);
      cb(rep.value);
    }
  };
  rep.set(value);
  channelMap.set(name, rep);
  return rep;
}

export function getReplicant<T>(channel: string, name: string): Replicant<T> | undefined {
  return replicants.get(channel)?.get(name);
}

export function createReplicants(channel: string, name?: string) {
  createReplicant(channel, "configuration", defaultConfiguration);
  createReplicant(channel, "external", defaultExternal);
  createReplicant(channel, "fullscreen", defaultFullscreen);
  createReplicant(channel, "lowerThird", defaultLowerThird);
  createReplicant(channel, "scoreboard", defaultScoreboard);
}