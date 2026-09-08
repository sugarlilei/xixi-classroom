import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Path } from './pages/Path'
import { Library } from './pages/Library'
import { Detail } from './pages/Detail'
import { Mine } from './pages/Mine'
import { Guide } from './pages/Guide'

export default function App() {
  // HashRouter：安卓/iOS WebView 更稳，避免原生壳路径刷新 404
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/path" element={<Path />} />
        <Route path="/library" element={<Library />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/mine" element={<Mine />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
