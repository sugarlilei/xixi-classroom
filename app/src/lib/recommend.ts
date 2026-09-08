import type { AgeFilter, Progress, Series, StageId } from '../types'

const STAGE_ORDER: StageId[] = ['listen', 'scene', 'advance']

export function matchAge(series: Series, filter: AgeFilter): boolean {
  // 「全部」等无区间过滤器直接放行
  if (filter.min == null || filter.max == null) return true
  // 区间有重叠即匹配（如 0-3 与 1.5-3）
  return series.ageMin <= filter.max && series.ageMax >= filter.min
}

export function filteredSeries(
  series: Series[],
  filter: AgeFilter,
): Series[] {
  return series
    .filter((s) => matchAge(s, filter))
    .slice()
    .sort((a, b) => {
      const sa = STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage)
      if (sa !== 0) return sa
      return a.orderInStage - b.orderInStage
    })
}

export function recommend(
  series: Series[],
  filter: AgeFilter,
  progressMap: Record<string, Progress>,
  limit = 2,
): Series[] {
  const list = filteredSeries(series, filter)
  const doing = list.filter((s) => progressMap[s.id]?.status === 'doing')
  if (doing.length) return doing.slice(0, limit)

  const todo = list.filter((s) => progressMap[s.id]?.status !== 'done')
  const picked: Series[] = []
  for (const stage of STAGE_ORDER) {
    if (picked.length >= limit) break
    const stageItems = todo
      .filter((s) => s.stage === stage)
      .sort((a, b) => a.orderInStage - b.orderInStage)
    for (const item of stageItems) {
      if (picked.length >= limit) break
      picked.push(item)
    }
  }
  return picked
}

export function statusLabel(status: string): string {
  return ({ todo: '未开始', doing: '进行中', done: '已完成' } as Record<string, string>)[status] || status
}

export function resourceTypeLabel(type: string): string {
  return (
    {
      local: '本地视频',
      direct: '直链播放',
      web: 'B站入口',
      folder: '文件夹备忘',
    } as Record<string, string>
  )[type] || type
}
