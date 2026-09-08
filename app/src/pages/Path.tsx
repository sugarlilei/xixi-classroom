import { Link } from 'react-router-dom'
import catalog from '../data/series.json'
import { PageShell } from '../components/Layout'
import { resolveProgress, useAppStore } from '../store/useAppStore'
import { statusLabel } from '../lib/recommend'
import type { Catalog } from '../types'

const data = catalog as Catalog

export function Path() {
  const progressMap = useAppStore((s) => s.progress)

  return (
    <PageShell title="启蒙路径" subtitle="入门泛听 → 情景输入 → 进阶，避免乱跳">
      {data.stages.map((st, idx) => {
        const items = data.series
          .filter((s) => s.stage === st.id)
          .sort((a, b) => a.orderInStage - b.orderInStage)
        return (
          <section
            key={st.id}
            className="mb-3 rounded-[18px] bg-white p-3.5 shadow-[0_10px_28px_rgba(90,60,20,0.08)]"
          >
            <h3 className="m-0 text-base font-bold">
              {idx + 1}. {st.name}
            </h3>
            <p className="mt-1 mb-2.5 text-xs text-[#7a7168]">{st.desc}</p>
            <div className="grid gap-2">
              {items.map((s) => {
                const p = resolveProgress(progressMap, s.id)
                return (
                  <Link
                    key={s.id}
                    to={`/detail/${s.id}`}
                    className="flex items-center justify-between rounded-xl bg-[#fff3e0] px-3 py-2.5 text-[13px]"
                  >
                    <span>
                      {s.nameZh} · {s.ageLabel}
                    </span>
                    <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[11px] text-[#3f4f9c]">
                      {statusLabel(p.status)}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}

      <section className="rounded-[18px] bg-white p-3.5 shadow-[0_10px_28px_rgba(90,60,20,0.08)]">
        <h3 className="m-0 mb-2 text-[15px] font-bold">顺序提醒</h3>
        <ol className="m-0 list-decimal space-y-1 pl-[18px] text-[13px] leading-relaxed text-[#7a7168]">
          {data.pathGuide.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-2.5 text-[13px] leading-relaxed text-[#7a7168]">{data.pathGuide.note}</p>
      </section>
    </PageShell>
  )
}
