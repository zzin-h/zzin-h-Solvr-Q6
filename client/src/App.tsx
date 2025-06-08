import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import SleepEntryListPage from './pages/SleepEntryListPage'
import NewSleepEntryPage from './pages/NewSleepEntryPage'
import EditSleepEntryPage from './pages/EditSleepEntryPage'
import ChartDashboardPage from './pages/ChartDashboardPage'
import AiAnalysisPage from './pages/AiAnalysisPage'

function App() {
  return (
    <Layout>
      <Routes>
        {/* 루트 경로에 차트 대시보드 표시 */}
        <Route path="/" element={<ChartDashboardPage />} />

        {/* 수면 기록 관련 라우트 */}
        <Route path="/sleep-entries" element={<SleepEntryListPage />} />
        <Route path="/sleep-entries/new" element={<NewSleepEntryPage />} />
        <Route path="/sleep-entries/:id/edit" element={<EditSleepEntryPage />} />

        {/* AI 분석 라우트 */}
        <Route path="/ai" element={<AiAnalysisPage />} />
      </Routes>
    </Layout>
  )
}

export default App
