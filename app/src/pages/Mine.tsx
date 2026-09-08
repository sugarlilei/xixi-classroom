import catalog from '../data/series.json'
import { PageShell } from '../components/Layout'
import { SeriesCard } from '../components/SeriesCard'
import { useAppStore } from '../store/useAppStore'
import type { Catalog, Series } from '../types'

const data = catalog as Catalog

export function Mine() {
  const progress = useAppStore((s) => s.progress)
  const all = (data.series as Series[]).map((s) => ({
    s,
    p: progress[s.id] || { seriesId: s.id, status: 'todo' as const, favorite: false },
  }))
  const doing = all.filter((x) => x.p.status === 'doing')
  const done = all.filter((x) => x.p.status === 'done')
  const fav = all.filter((x) => x.p.favorite)

  function block(title: string, items: typeof all) {
    return (
      <>
        <div className="mb-2.5 mt-2 flex items-center justify-between text-[15px] font-bold">
          <span>{title}</span>
          <span className="font-medium text-[#7a7168]">{items.length}</span>
        </div>
        <div className="mb-3 grid gap-3">
          {items.length === 0 ? (
            <div className="py-5 text-center text-[13px] text-[#7a7168]">暂无</div>
          ) : (
            items.map((x) => <SeriesCard key={x.s.id} series={x.s} />)
          )}
        </div>
      </>
    )
  }

  return (
    <PageShell title="我的" subtitle="进度、收藏都存在本机">
      {block('进行中', doing)}
      {block('已完成', done)}
      {block('收藏', fav)}
      <section className="mt-2 rounded-[18px] bg-white p-3.5 shadow-[0_10px_28px_rgba(90,60,20,0.08)]">
        <h3 className="m-0 mb-2 text-[15px] font-bold">打卡（下版）</h3>
        <p className="m-0 text-[13px] leading-relaxed text-[#7a7168]">
          v1.0 将支持按日期记录观看时长。当前版本请先用「进行中 / 已完成」标记。
        </p>
      </section>
      <div className="mt-3 rounded-xl border border-dashed border-[#f0d7a4] bg-[#fff7e8] px-3 py-2.5 text-xs leading-relaxed text-[#7a7168]">
        数据保存在浏览器本地（进度与资源元数据 + 本地视频 IndexedDB）。清除站点数据会丢失。
      </div>
    </PageShell>
  )
}
