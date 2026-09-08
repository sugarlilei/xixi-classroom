import type { ReactNode } from 'react'
import { TabBar } from './TabBar'

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: ReactNode
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen justify-center bg-[#e9e2d6] px-3 py-6 max-[420px]:bg-[#fff8ee] max-[420px]:p-0">
      <div className="relative flex min-h-[780px] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-[#fff8ee] shadow-[0_20px_50px_rgba(0,0,0,.12)] max-[420px]:min-h-screen max-[420px]:max-w-none max-[420px]:rounded-none max-[420px]:shadow-none">
        <header className="bg-gradient-to-b from-[#fff6e8] to-[#fff8ee] px-[18px] pb-2 pt-[18px]">
          <h1 className="m-0 text-[22px] tracking-wide text-[#2f2a26]">{title}</h1>
          {subtitle ? <p className="mt-1 text-[13px] text-[#7a7168]">{subtitle}</p> : null}
        </header>
        <main className="flex-1 overflow-auto px-4 pb-24 pt-2">{children}</main>
        <TabBar />
      </div>
    </div>
  )
}
