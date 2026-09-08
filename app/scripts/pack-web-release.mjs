/**
 * 将 app/dist 打包为 release/xixi-classroom-web-v0.2.zip
 * （不再把 web-dist 目录纳入 git）
 */
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const dist = join(root, 'app/dist')
const zipPath = join(root, 'release/xixi-classroom-web-v0.2.zip')

if (!existsSync(dist)) {
  console.error('missing app/dist — run npm run build first')
  process.exit(1)
}

mkdirSync(join(root, 'release'), { recursive: true })
if (existsSync(zipPath)) rmSync(zipPath)

const q = (p) => p.replace(/'/g, "''")
const ps = `
$ErrorActionPreference = 'Stop'
Compress-Archive -Path '${q(dist)}\\*' -DestinationPath '${q(zipPath)}' -Force
Write-Host "packed: ${q(zipPath)}"
`
execFileSync('powershell.exe', ['-NoProfile', '-Command', ps], { stdio: 'inherit' })
