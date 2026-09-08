import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Progress, ResourceItem } from '../types'
import { deleteLocalBlob } from '../lib/idb'

interface AppState {
  ageFilterId: string
  progress: Record<string, Progress>
  resources: Record<string, ResourceItem[]>
  setAgeFilter: (id: string) => void
  setProgress: (seriesId: string, patch: Partial<Progress>) => void
  addResource: (seriesId: string, item: ResourceItem) => void
  removeResource: (seriesId: string, resourceId: string) => Promise<void>
}

export function emptyProgress(seriesId: string): Progress {
  return {
    seriesId,
    status: 'todo',
    favorite: false,
    lastWatchedAt: null,
    note: '',
  }
}

/** 从 progress map 取状态；勿在 zustand selector 里每次 new 对象 */
export function resolveProgress(
  progressMap: Record<string, Progress>,
  seriesId: string,
): Progress {
  return progressMap[seriesId] ?? emptyProgress(seriesId)
}

/** 排序资源列表；在组件 useMemo 中调用，避免 selector 每次新引用 */
export function sortedResources(list: ResourceItem[] | undefined): ResourceItem[] {
  return (list || []).slice().sort((a, b) => a.priority - b.priority)
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ageFilterId: 'all',
      progress: {},
      resources: {},

      setAgeFilter: (id) => set({ ageFilterId: id }),

      setProgress: (seriesId, patch) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [seriesId]: {
              ...emptyProgress(seriesId),
              ...state.progress[seriesId],
              ...patch,
              seriesId,
            },
          },
        })),

      addResource: (seriesId, item) =>
        set((state) => {
          const list = [...(state.resources[seriesId] || []), item].sort(
            (a, b) => a.priority - b.priority,
          )
          return { resources: { ...state.resources, [seriesId]: list } }
        }),

      removeResource: async (seriesId, resourceId) => {
        const item = (get().resources[seriesId] || []).find((r) => r.id === resourceId)
        if (item?.hasLocalBlob) {
          try {
            await deleteLocalBlob(resourceId)
          } catch {
            /* ignore */
          }
        }
        set((state) => ({
          resources: {
            ...state.resources,
            [seriesId]: (state.resources[seriesId] || []).filter((r) => r.id !== resourceId),
          },
        }))
      },
    }),
    {
      name: 'enl.xixi-classroom',
      partialize: (state) => ({
        ageFilterId: state.ageFilterId,
        progress: state.progress,
        resources: state.resources,
      }),
    },
  ),
)

export function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}
