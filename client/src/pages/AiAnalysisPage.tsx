import React from 'react'
import SleepAnalysis from '../components/sleep/SleepAnalysis'

export default function AiAnalysisPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">AI 수면 분석</h1>
      <SleepAnalysis />
    </div>
  )
}
