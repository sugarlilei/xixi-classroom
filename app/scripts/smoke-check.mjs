import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))
const catalog = JSON.parse(readFileSync(join(root, '../src/data/series.json'), 'utf8'))

const STAGE_ORDER = ['listen', 'scene', 'advance']

function matchAge(series, filter) {
  if (filter.min == null && filter.max == null) return true
  if (filter.min == null || filter.max == null) return true
  return series.ageMin <= filter.max && series.ageMax >= filter.min
}

function filteredSeries(series, filter) {
  return series
    .filter((s) => matchAge(s, filter))
    .slice()
    .sort((a, b) => {
      const sa = STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage)
      if (sa !== 0) return sa
      return a.orderInStage - b.orderInStage
    })
}

function recommend(series, filter, progressMap, limit = 2) {
  const list = filteredSeries(series, filter)
  const doing = list.filter((s) => progressMap[s.id]?.status === 'doing')
  if (doing.length) return doing.slice(0, limit)
  const todo = list.filter((s) => progressMap[s.id]?.status !== 'done')
  const picked = []
  for (const stage of STAGE_ORDER) {
    if (picked.length >= limit) break
    const stageItems = todo
      .filter((s) => s.stage === stage)
      .sort((a, b) => a.orderInStage - b.orderInStage)
    for (const item of stageItems) {
      if (picked.length >= limit) break
      picked.push(item)
    }
  }
  return picked
}

const assert = (cond, msg) => {
  if (!cond) throw new Error(msg)
}

assert(catalog.series.length === 7, 'expected 7 series')
assert(catalog.appName === '嘻嘻小课堂', 'app name')
assert(catalog.preferredWebPlatform === 'bilibili', 'bilibili preference')

const all = catalog.ageFilters.find((f) => f.id === 'all')
assert(filteredSeries(catalog.series, all).length === 7, 'all filter')

const rec = recommend(catalog.series, all, {}, 2).map((s) => s.id)
assert(rec.join(',') === 'sss,yakka', `default recommend got ${rec}`)

const doingRec = recommend(catalog.series, all, { wow: { status: 'doing' } }, 2).map((s) => s.id)
assert(doingRec[0] === 'wow', `doing priority got ${doingRec}`)

const afterListen = recommend(
  catalog.series,
  all,
  { sss: { status: 'done' }, yakka: { status: 'done' } },
  2,
).map((s) => s.id)
assert(afterListen[0] === 'maisy', `after listen got ${afterListen}`)

for (const id of ['sss', 'yakka', 'maisy', 'penelope', 'wow', 'muzzy', 'wildkratts']) {
  assert(catalog.series.some((s) => s.id === id), `missing id ${id}`)
}

console.log('smoke-check OK')
