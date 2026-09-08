import catalog from '../data/series.json'
import { useAppStore } from '../store/useAppStore'

export function AgeChips({ onChange }: { onChange?: (id: string) => void }) {
  const ageFilterId = useAppStore((s) => s.ageFilterId)
  const setAgeFilter = useAppStore((s) => s.setAgeFilter)

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {catalog.ageFilters.map((f) => {
        const active = f.id === ageFilterId
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => {
              setAgeFilter(f.id)
              onChange?.(f.id)
            }}
            className={`shrink-0 rounded-full border px-3 py-[7px] text-sm whitespace-nowrap ${
              active
                ? 'border-[#3cb89a] bg-[#3cb89a] font-semibold text-white'
                : 'border-[#f0e4d4] bg-white text-[#7a7168]'
            }`}
          >
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
