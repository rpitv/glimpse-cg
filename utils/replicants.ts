

import { defaultChannels, defaultConfiguration, defaultExternal, defaultFullscreen, defaultLowerThird, defaultScoreboard } from '~/types/replicants';

import { saveReplicant, loadReplicant } from './db';

type Replicant<T> = {
  value: T;
  listeners: Set<(val: T) => void>;
  set: (val: T) => void;
  subscribe: (cb: (val: T) => void) => (() => void);
};

// Map structure: name -> Replicant
const replicants = new Map<string, Replicant<any>>();


export function createReplicant<T>(name: string, defaultValue: T): Replicant<T> {
  if (replicants.has(name)) return replicants.get(name)!;

  const value = loadReplicant<T>(name) ?? defaultValue;

  const rep: Replicant<T> = {
    value,
    listeners: new Set(),
    set(val) {
      rep.value = val;
      saveReplicant(name, val);
      rep.listeners.forEach(cb => cb(rep.value));
    },
    subscribe(cb) {
      rep.listeners.add(cb);
      cb(rep.value);

      // Return unsubscribe function
      return () => {
        rep.listeners.delete(cb);
      };
    }
  };
  rep.set(value);
  replicants.set(name, rep);
  return rep;
}

export function getReplicant<T>(name: string): Replicant<T> | undefined {
  return replicants.get(name);
}

export function createReplicants() {
  createReplicant("configuration", defaultConfiguration);
  createReplicant("external", defaultExternal);
  createReplicant("fullscreen", defaultFullscreen);
  createReplicant("lowerThird", defaultLowerThird);
  createReplicant("scoreboard", defaultScoreboard);
  createReplicant("channels", defaultChannels);
}