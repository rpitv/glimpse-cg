import { reactive } from "vue"
import type { Replicants } from "~/types/replicants"
import { setDeep, deleteDeep } from "~/utils/pathHelpers"
import { io, Socket } from 'socket.io-client';

let replicants: Replicants | null = null
let socket: Socket | null = null
let state: Replicants | null = null

export async function useReplicants(): Promise<Replicants> {
  if (replicants) return replicants

  state = reactive<Replicants>({} as Replicants)

  // Connect once per tab
  if (!socket) {
    socket = io("http://localhost:3000")

    await new Promise<void>((resolve) => {
      socket!.on("init", (serverState) => {
        Object.assign(state!, serverState)
        resolve()
      })

      socket!.on("patch", ({ path, value }) => {
        setDeep(state!, path, value)
      })

      socket!.on("delete", ({ path }) => {
        deleteDeep(state!, path)
      })
    })
  }

  function makeProxy<T extends object>(obj: T, path: string[] = []): T {
    return new Proxy(obj, {
      get(target, key) {
        const value = Reflect.get(target, key)
        if (typeof value === "object" && value !== null) {
          return makeProxy(value as any, [...path, String(key)])
        }
        return value
      },
      set(target, key, value) {
        const fullPath = [...path, String(key)]
        const result = Reflect.set(target, key, value)
        socket?.emit("patch", { path: fullPath, value })
        return result
      },
      deleteProperty(target, key) {
        const fullPath = [...path, String(key)]
        const result = Reflect.deleteProperty(target, key)
        socket?.emit("delete", { path: fullPath })
        return result
      },
    })
  }

  replicants = makeProxy(state)
  return replicants
}