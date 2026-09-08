import catalog from '../data/series.json'
import { AgeChips } from '../components/AgeChips'
import { PageShell } from '../components/Layout'
import { SeriesCard } from '../components/SeriesCard'
import { useAppStore } from '../store/useAppStore'
import { filteredSeries } from '../lib/recommend'
import type { AgeFilter, Catalog, Series } from '../types'

const data = catalog as Catalog

export function Library() {
  const ageFilterId = useAppStore((s) => s.ageFilterId)
  const filter = (data.ageFilters.find((a) => a.id === ageFilterId) || data.ageFilters[0]) as AgeFilter
  const list = filteredSeries(data.series as Series[], filter)

  return (
    <PageShell title="全部系列" subtitle="7 套核心启蒙内容，按龄筛选">
      <AgeChips />
      <div className="mt-3.5 mb-2.5 text-[15px] font-bold">共 {list.length} 套</div>
      <div className="grid gap-3">
        {list.length === 0 ? (
          <div className="py-7 text-center text-[13px] text-[#7a7168]">没有匹配的系列</div>
        ) : (
          list.map((s) => <SeriesCard key={s.id} series={s} />)
        )}
      </div>
    </PageShell>
  )
}
