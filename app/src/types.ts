export type StageId = 'listen' | 'scene' | 'advance'
export type ResourceType = 'local' | 'direct' | 'web' | 'folder'
export type ProgressStatus = 'todo' | 'doing' | 'done'

export interface Stage {
  id: StageId
  name: string
  desc: string
}

export interface AgeFilter {
  id: string
  label: string
  min?: number
  max?: number
}

export interface Series {
  id: string
  nameZh: string
  nameEn: string
  ageMin: number
  ageMax: number
  ageLabel: string
  stage: StageId
  orderInStage: number
  goals: string[]
  features: string[]
  tips: string
  summary: string
  accentColor: string
}

export interface PathGuide {
  title: string
  steps: string[]
  note: string
}

export interface Catalog {
  appName: string
  preferredWebPlatform: string
  preferredWebPlatformLabel: string
  stages: Stage[]
  ageFilters: AgeFilter[]
  series: Series[]
  pathGuide: PathGuide
}

export interface Progress {
  seriesId: string
  status: ProgressStatus
  favorite: boolean
  lastWatchedAt?: string | null
  note?: string
}

export interface ResourceItem {
  id: string
  seriesId: string
  type: ResourceType
  title: string
  /** web/direct/folder URI；local 时可为占位说明，真实文件在 IndexedDB */
  uri: string
  note?: string
  priority: number
  createdAt: string
  /** local 类型：文件名展示 */
  fileName?: string
  hasLocalBlob?: boolean
}
