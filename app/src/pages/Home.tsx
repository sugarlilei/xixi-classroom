import { Link } from 'react-router-dom'
import catalog from '../data/series.json'
import { AgeChips } from '../components/AgeChips'
import { PageShell } from '../components/Layout'
import { useAppStore } from '../store/useAppStore'
import { recommend } from '../lib/recommend'
import type { AgeFilter, Catalog, Series } from '../types'

const data = catalog as Catalog

export function Home() {
  const ageFilterId = useAppStore((s) => s.ageFilterId)
  const progress = useAppStore((s) => s.progress)
  const filter = (data.ageFilters.find((a) => a.id === ageFilterId) || data.ageFilters[0]) as AgeFilter
  const rec = recommend(data.series as Series[], filter, progress, 2)

  return (
    <PageShell title={data.appName} subtitle="今天播哪套？按年龄与路径给你建议">
      <div className="mb-2.5 flex items-center justify-between text-[15px] font-bold">
        <span>孩子年龄</span>
        <Link to="/guide" className="text-[13px] font-semibold text-[#2a9a7f]">
          使用建议
        </Link>
      </div>
      <AgeChips />

      <div className="mt-3.5 mb-2.5 text-[15px] font-bold">今日推荐</div>
      <div className="grid gap-3">
        {rec.length === 0 ? (
          <div className="py-7 text-center text-[13px] text-[#7a7168]">当前年龄暂无匹配系列，试试「全部」</div>
        ) : (
          rec.map((s) => {
            const stageName = data.stages.find((st) => st.id === s.stage)?.name
            return (
              <Link
                key={s.id}
                to={`/detail/${s.id}`}
                className="grid grid-cols-[72px_1fr] gap-3 rounded-[18px] border border-white/80 bg-white p-3.5 shadow-[0_10px_28px_rgba(90,60,20,0.08)]"
                style={{ borderLeft: `6px solid ${s.accentColor}` }}
              >
                <div
                  className="grid h-[72px] w-[72px] place-items-center rounded-2xl text-[28px] font-extrabold text-white"
                  style={{ background: s.accentColor }}
                >
                  {s.nameZh.slice(0, 1)}
                </div>
                <div>
                  <h3 className="m-0 text-base font-bold">
                    {s.nameZh} <span className="text-xs font-medium text-[#7a7168]">{s.nameEn}</span>
                  </h3>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#fff3e0] px-2 py-0.5 text-[11px] text-[#8a5a2b]">
                      {s.ageLabel}
                    </span>
                    <span className="rounded-full bg-[#e7f7f1] px-2 py-0.5 text-[11px] text-[#1f7a63]">
                      {stageName}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-snug text-[#7a7168]">
                    {stageName} · {s.ageLabel} · {s.summary}
                  </p>
                </div>
              </Link>
            )
          })
        )}
      </div>

      <div className="mt-3.5 mb-2.5 flex items-center justify-between text-[15px] font-bold">
        <span>路径进度</span>
        <Link to="/path" className="text-[13px] font-semibold text-[#2a9a7f]">
          查看全部
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {data.stages.map((st) => {
          const items = data.series.filter((s) => s.stage === st.id)
          const done = items.filter((s) => progress[s.id]?.status === 'done').length
          const allDone = done === items.length && items.length > 0
          return (
            <div
              key={st.id}
              className={`rounded-[14px] bg-white px-2 py-3 text-center shadow-[0_10px_28px_rgba(90,60,20,0.08)] ${
                allDone ? 'outline outline-2 outline-[#3cb89a]' : ''
              }`}
            >
              <strong className="block text-[13px]">{st.name}</strong>
              <span className="text-[11px] text-[#7a7168]">
                {done}/{items.length} 完成
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-[#f0d7a4] bg-[#fff7e8] px-3 py-2.5 text-xs leading-relaxed text-[#7a7168]">
        播放仅使用你自己准备的清晰资源（本地 / 直链 / B站收藏入口优先）。本工具不做片源分发。
      </div>
    </PageShell>
  )
}
