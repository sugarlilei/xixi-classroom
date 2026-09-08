import { Link } from 'react-router-dom'
import type { Series } from '../types'
import { resolveProgress, useAppStore } from '../store/useAppStore'
import { statusLabel } from '../lib/recommend'
import catalog from '../data/series.json'

export function SeriesCard({ series }: { series: Series }) {
  const progressMap = useAppStore((s) => s.progress)
  const progress = resolveProgress(progressMap, series.id)
  const stageName = catalog.stages.find((st) => st.id === series.stage)?.name || series.stage

  return (
    <Link
      to={`/detail/${series.id}`}
      className="grid grid-cols-[64px_1fr] gap-3 rounded-[18px] border border-white/80 bg-white p-3 shadow-[0_10px_28px_rgba(90,60,20,0.08)]"
      style={{ borderLeft: `5px solid ${series.accentColor}` }}
    >
      <div
        className="grid h-16 w-16 place-items-center rounded-[14px] text-2xl font-extrabold text-white"
        style={{ background: series.accentColor }}
      >
        {series.nameZh.slice(0, 1)}
      </div>
      <div>
        <div className="text-[15px] font-bold text-[#2f2a26]">
          {series.nameZh}{' '}
          <span className="text-xs font-medium text-[#7a7168]">{series.nameEn}</span>
          {progress.favorite ? ' ♥' : ''}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#fff3e0] px-2 py-0.5 text-[11px] text-[#8a5a2b]">
            {series.ageLabel}
          </span>
          <span className="rounded-full bg-[#e7f7f1] px-2 py-0.5 text-[11px] text-[#1f7a63]">
            {stageName}
          </span>
          <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[11px] text-[#3f4f9c]">
            {statusLabel(progress.status)}
          </span>
        </div>
        <p className="mt-2 text-xs leading-snug text-[#7a7168]">{series.summary}</p>
      </div>
    </Link>
  )
}
