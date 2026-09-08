import { Link, useParams } from 'react-router-dom'
import catalog from '../data/series.json'
import { PageShell } from '../components/Layout'
import { ResourcePanel } from '../components/ResourcePanel'
import { useAppStore } from '../store/useAppStore'
import { statusLabel } from '../lib/recommend'
import type { Catalog, ProgressStatus, Series } from '../types'

const data = catalog as Catalog

export function Detail() {
  const { id } = useParams()
  const series = (data.series as Series[]).find((s) => s.id === id)
  const progress = useAppStore((s) => (series ? s.getProgress(series.id) : null))
  const setProgress = useAppStore((s) => s.setProgress)

  if (!series || !progress) {
    return (
      <PageShell title="系列详情" subtitle="未找到">
        <div className="py-8 text-center text-[13px] text-[#7a7168]">
          未找到该系列。
          <Link to="/library" className="text-[#2a9a7f]">
            返回系列库
          </Link>
        </div>
      </PageShell>
    )
  }

  const stageName = data.stages.find((st) => st.id === series.stage)?.name || series.stage

  return (
    <PageShell
      title={
        <span>
          <Link to="/library" className="font-semibold text-[#2a9a7f]">
            ←
          </Link>{' '}
          系列详情
        </span>
      }
      subtitle="特点 · 建议 · 个人资源播放"
    >
      <section
        className="rounded-2xl p-[18px] text-white shadow-[0_10px_28px_rgba(90,60,20,0.08)]"
        style={{
          background: `linear-gradient(135deg, ${series.accentColor}, ${series.accentColor}99)`,
        }}
      >
        <h2 className="m-0 text-[22px] font-bold">{series.nameZh}</h2>
        <div className="text-[13px] opacity-90">{series.nameEn}</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs">{series.ageLabel}</span>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs">{stageName}</span>
          {series.goals.map((g) => (
            <span key={g} className="rounded-full bg-white/20 px-2.5 py-1 text-xs">
              {g}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-3 rounded-[18px] bg-white p-3.5 shadow-[0_10px_28px_rgba(90,60,20,0.08)]">
        <h3 className="m-0 mb-2 text-[15px] font-bold">特点</h3>
        <ul className="m-0 list-disc space-y-1 pl-[18px] text-[13px] leading-snug">
          {series.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="mt-3 rounded-[18px] bg-white p-3.5 shadow-[0_10px_28px_rgba(90,60,20,0.08)]">
        <h3 className="m-0 mb-2 text-[15px] font-bold">使用建议</h3>
        <p className="m-0 text-[13px] leading-relaxed text-[#7a7168]">{series.tips}</p>
      </section>

      <ResourcePanel series={series} />

      <section className="mt-3 rounded-[18px] bg-white p-3.5 shadow-[0_10px_28px_rgba(90,60,20,0.08)]">
        <h3 className="m-0 mb-2 text-[15px] font-bold">学习状态</h3>
        <p className="mb-2.5 text-[13px] text-[#7a7168]">
          当前：
          <strong className="text-[#2f2a26]">{statusLabel(progress.status)}</strong>
          {progress.favorite ? ' · 已收藏' : ''}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="rounded-[14px] bg-[#3cb89a] px-3 py-3 text-sm font-bold text-white"
            onClick={() =>
              setProgress(series.id, {
                status: 'doing' as ProgressStatus,
                lastWatchedAt: new Date().toISOString(),
              })
            }
          >
            标为进行中
          </button>
          <button
            type="button"
            className="rounded-[14px] border border-[#f0e4d4] bg-white px-3 py-3 text-sm font-bold"
            onClick={() =>
              setProgress(series.id, {
                status: 'done' as ProgressStatus,
                lastWatchedAt: new Date().toISOString(),
              })
            }
          >
            标为已完成
          </button>
          <button
            type="button"
            className="rounded-[14px] border border-[#f0e4d4] bg-white px-3 py-3 text-sm font-bold"
            onClick={() => setProgress(series.id, { favorite: !progress.favorite })}
          >
            {progress.favorite ? '取消收藏' : '加入收藏'}
          </button>
          <button
            type="button"
            className="rounded-[14px] border border-[#f0e4d4] bg-white px-3 py-3 text-sm font-bold"
            onClick={() => setProgress(series.id, { status: 'todo' as ProgressStatus })}
          >
            重置为未开始
          </button>
        </div>
      </section>
    </PageShell>
  )
}
