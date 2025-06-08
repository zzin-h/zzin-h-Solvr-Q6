import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import SleepEntryListPage from './pages/SleepEntryListPage'
import NewSleepEntryPage from './pages/NewSleepEntryPage'
import EditSleepEntryPage from './pages/EditSleepEntryPage'

function App() {
  return (
    <Layout>
      <Routes>
        {/* 루트 경로를 수면 기록 목록으로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/sleep-entries" replace />} />

        {/* 수면 기록 관련 라우트 */}
        <Route path="/sleep-entries" element={<SleepEntryListPage />} />
        <Route path="/sleep-entries/new" element={<NewSleepEntryPage />} />
        <Route path="/sleep-entries/:id/edit" element={<EditSleepEntryPage />} />
      </Routes>
    </Layout>
  )
}

export default App
