import { useEffect, useMemo, useState } from 'react'
import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'
import type { ResourceItem, ResourceType, Series } from '../types'
import { sortedResources, useAppStore, uid } from '../store/useAppStore'
import { resourceTypeLabel } from '../lib/recommend'
import { getLocalBlob, saveLocalBlob } from '../lib/idb'

async function openExternalUrl(url: string) {
  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url })
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function ResourcePanel({ series }: { series: Series }) {
  // 只订阅原始数组引用，排序放到 useMemo，避免 selector 每次返回新数组导致死循环白屏
  const rawResources = useAppStore((s) => s.resources[series.id])
  const addResource = useAppStore((s) => s.addResource)
  const removeResource = useAppStore((s) => s.removeResource)
  const setProgress = useAppStore((s) => s.setProgress)

  const [type, setType] = useState<ResourceType>('web')
  const [title, setTitle] = useState('')
  const [uri, setUri] = useState('')
  const [note, setNote] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [playerSrc, setPlayerSrc] = useState<string | null>(null)
  const [playerTip, setPlayerTip] = useState('')
  const [playingId, setPlayingId] = useState<string | null>(null)

  const sorted = useMemo(() => sortedResources(rawResources), [rawResources])

  useEffect(() => {
    return () => {
      if (playerSrc?.startsWith('blob:')) URL.revokeObjectURL(playerSrc)
    }
  }, [playerSrc])

  async function play(res: ResourceItem) {
    setPlayingId(res.id)
    if (res.type === 'web') {
      setPlayerSrc(null)
      setPlayerTip(`已打开 B站/网页入口：${res.title}`)
      try {
        await openExternalUrl(res.uri)
      } catch {
        setPlayerTip('打开外链失败，请检查链接是否有效')
        return
      }
      setProgress(series.id, { status: 'doing', lastWatchedAt: new Date().toISOString() })
      return
    }
    if (res.type === 'folder') {
      setPlayerSrc(null)
      setPlayerTip(`文件夹备忘：${res.uri}`)
      return
    }

    let src = res.uri
    if (res.type === 'local' && res.hasLocalBlob) {
      const blob = await getLocalBlob(res.id)
      if (!blob) {
        setPlayerSrc(null)
        setPlayerTip('本地文件已失效，请重新添加视频文件')
        return
      }
      src = URL.createObjectURL(blob)
    }

    if (playerSrc?.startsWith('blob:')) URL.revokeObjectURL(playerSrc)
    setPlayerSrc(src)
    setPlayerTip(`正在播放：${res.title}（${resourceTypeLabel(res.type)}）`)
    setProgress(series.id, { status: 'doing', lastWatchedAt: new Date().toISOString() })
  }

  async function onAdd() {
    const finalTitle = title.trim() || resourceTypeLabel(type)
    if (type === 'local') {
      if (!file) {
        alert('请选择本地视频文件')
        return
      }
      const id = uid('res')
      await saveLocalBlob(id, file)
      addResource(series.id, {
        id,
        seriesId: series.id,
        type: 'local',
        title: finalTitle,
        uri: file.name,
        note: note.trim(),
        priority: sorted.length + 1,
        createdAt: new Date().toISOString(),
        fileName: file.name,
        hasLocalBlob: true,
      })
    } else {
      if (!uri.trim()) {
        alert('请填写地址或路径')
        return
      }
      addResource(series.id, {
        id: uid('res'),
        seriesId: series.id,
        type,
        title: finalTitle,
        uri: uri.trim(),
        note: note.trim(),
        priority: sorted.length + 1,
        createdAt: new Date().toISOString(),
      })
    }
    setTitle('')
    setUri('')
    setNote('')
    setFile(null)
  }

  return (
    <section className="mt-3 rounded-[18px] bg-white p-3.5 shadow-[0_10px_28px_rgba(90,60,20,0.08)]">
      <h3 className="m-0 mb-2 text-[15px] font-bold">个人资源播放</h3>
      <div className="mb-2.5 rounded-xl border border-dashed border-[#f0d7a4] bg-[#fff7e8] px-3 py-2.5 text-xs leading-relaxed text-[#7a7168]">
        仅添加你自己已有的清晰资源。默认偏好 <strong>B站收藏入口</strong>；也支持本地视频、直链、文件夹备忘。不提供片源。
      </div>

      <div className="grid min-h-[180px] place-items-center overflow-hidden rounded-2xl bg-[#1d1a17] text-[#f5f0e8]">
        {playerSrc ? (
          <video
            key={playerSrc}
            className="max-h-[220px] w-full bg-black"
            controls
            playsInline
            preload="metadata"
            src={playerSrc}
            onError={() => {
              setPlayerTip('页内播放失败，可检查直链或改用 B站入口')
              setPlayerSrc(null)
            }}
          />
        ) : (
          <div className="px-6 py-8 text-center text-[13px] leading-relaxed opacity-90">
            {sorted[0]
              ? playingId
                ? playerTip || '准备播放'
                : '选择下方资源开始播放'
              : '还没有资源，可先添加 B站收藏链接或本地视频'}
            {sorted[0] && playerTip && !playerSrc ? (
              <div className="mt-2 break-all opacity-80">{playerTip}</div>
            ) : null}
          </div>
        )}
      </div>
      {playerTip && playerSrc ? (
        <p className="mt-2 text-xs text-[#7a7168]">{playerTip}</p>
      ) : null}

      <div className="mt-2.5 grid gap-2">
        {sorted.length === 0 ? (
          <div className="py-4 text-center text-[13px] text-[#7a7168]">暂无个人资源</div>
        ) : (
          sorted.map((r) => (
            <div key={r.id} className="rounded-xl border border-[#f0e4d4] bg-white px-3 py-2.5">
              <div className="text-[13px] font-bold">{r.title}</div>
              <div className="text-xs text-[#7a7168]">
                {resourceTypeLabel(r.type)} · 优先级 {r.priority}
                {r.fileName ? ` · ${r.fileName}` : ''}
                {r.note ? ` · ${r.note}` : ''}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  className="rounded-[10px] border border-[#f0e4d4] bg-white px-2.5 py-1.5 text-xs"
                  onClick={() => play(r)}
                >
                  播放/打开
                </button>
                <button
                  type="button"
                  className="rounded-[10px] border border-[#f0e4d4] bg-[#ffe8e4] px-2.5 py-1.5 text-xs text-[#e86a5c]"
                  onClick={() => removeResource(series.id, r.id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-2.5 grid gap-2">
        <label className="text-xs text-[#7a7168]">
          资源类型
          <select
            className="mt-1 w-full rounded-xl border border-[#f0e4d4] bg-white px-3 py-2.5 text-sm text-[#2f2a26]"
            value={type}
            onChange={(e) => setType(e.target.value as ResourceType)}
          >
            <option value="web">B站入口（收藏/正版页外链，默认）</option>
            <option value="local">本地视频（页内播放，可持久）</option>
            <option value="direct">直链（网盘/NAS）</option>
            <option value="folder">文件夹备忘</option>
          </select>
        </label>
        <label className="text-xs text-[#7a7168]">
          标题
          <input
            className="mt-1 w-full rounded-xl border border-[#f0e4d4] bg-white px-3 py-2.5 text-sm"
            placeholder="如：B站收藏夹 · SSS / 本地高清合集"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        {type === 'local' ? (
          <label className="text-xs text-[#7a7168]">
            选择本地视频
            <input
              className="mt-1 w-full rounded-xl border border-[#f0e4d4] bg-white px-3 py-2.5 text-sm"
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        ) : (
          <label className="text-xs text-[#7a7168]">
            地址 / 路径
            <input
              className="mt-1 w-full rounded-xl border border-[#f0e4d4] bg-white px-3 py-2.5 text-sm"
              placeholder="https://www.bilibili.com/… 或 路径备忘"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
            />
          </label>
        )}
        <label className="text-xs text-[#7a7168]">
          备注（可选）
          <input
            className="mt-1 w-full rounded-xl border border-[#f0e4d4] bg-white px-3 py-2.5 text-sm"
            placeholder="清晰度、集数范围等"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <button
          type="button"
          className="rounded-[14px] bg-[#3cb89a] px-3.5 py-3 text-sm font-bold text-white"
          onClick={onAdd}
        >
          添加资源
        </button>
      </div>
    </section>
  )
}
