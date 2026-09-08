import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: '首页', icon: '🏠', end: true },
  { to: '/path', label: '路径', icon: '🗺️' },
  { to: '/library', label: '系列', icon: '📚' },
  { to: '/mine', label: '我的', icon: '👤' },
]

export function TabBar() {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 grid h-16 grid-cols-4 border-t border-[#f0e4d4] bg-white/95 backdrop-blur">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 text-[11px] ${
              isActive ? 'font-bold text-[#2a9a7f]' : 'text-[#7a7168]'
            }`
          }
        >
          <span className="text-lg leading-none">{t.icon}</span>
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
