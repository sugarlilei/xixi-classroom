import { Link } from 'react-router-dom'
import catalog from '../data/series.json'
import { PageShell } from '../components/Layout'
import type { Catalog } from '../types'

const data = catalog as Catalog

export function Guide() {
  return (
    <PageShell title="使用建议" subtitle="顺序规划 · 个人资源清晰流畅">
      <section className="mb-3 rounded-[18px] bg-white p-3.5 shadow-[0_10px_28px_rgba(90,60,20,0.08)]">
        <h3 className="m-0 mb-2 text-[15px] font-bold">推荐顺序</h3>
        {data.pathGuide.steps.map((step, i) => (
          <div key={step} className="mb-3 grid grid-cols-[28px_1fr] gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-[#3cb89a] text-[13px] font-extrabold text-white">
              {i + 1}
            </div>
            <p className="m-0 mt-1 text-[13px] leading-relaxed">{step}</p>
          </div>
        ))}
        <div className="rounded-xl border border-dashed border-[#f0d7a4] bg-[#fff7e8] px-3 py-2.5 text-xs leading-relaxed text-[#7a7168]">
          {data.pathGuide.note}
        </div>
      </section>

      <section className="mb-3 rounded-[18px] bg-white p-3.5 shadow-[0_10px_28px_rgba(90,60,20,0.08)]">
        <h3 className="m-0 mb-2 text-[15px] font-bold">播放说明</h3>
        <ul className="m-0 list-disc space-y-1 pl-[18px] text-[13px] leading-relaxed">
          <li>
            在系列详情中添加你自己的资源：本地视频、网盘/NAS 直链、
            <strong>B站收藏入口（默认偏好）</strong>、文件夹备忘。
          </li>
          <li>本地与直链优先页内播放，保证你自备清晰片源的流畅体验。</li>
          <li>B站等网页入口以外链打开，不内嵌不明来源。</li>
          <li>本工具不提供、不聚合任何片源，仅做导航与进度。</li>
        </ul>
      </section>

      <section className="mb-3 rounded-[18px] bg-white p-3.5 shadow-[0_10px_28px_rgba(90,60,20,0.08)]">
        <h3 className="m-0 mb-2 text-[15px] font-bold">怎么用更稳</h3>
        <ul className="m-0 list-disc space-y-1 pl-[18px] text-[13px] leading-relaxed">
          <li>先把 SSS + Yakka Dee 听熟，再进情景动画。</li>
          <li>情景阶段可并行 Wow English 提兴趣，但不替代日常情景输入。</li>
          <li>进阶片语速与词汇更大，听力吃力就退回上一阶多听几周。</li>
        </ul>
      </section>

      <Link
        to="/"
        className="mt-3 block rounded-[14px] bg-[#3cb89a] px-3.5 py-3 text-center text-sm font-bold text-white"
      >
        返回首页
      </Link>
    </PageShell>
  )
}
