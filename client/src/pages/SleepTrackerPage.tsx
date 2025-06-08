import React from 'react'
import ChartDashboard from '../components/charts/ChartDashboard'
import SleepAnalysis from '../components/sleep/SleepAnalysis'

export default function SleepTrackerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">수면 트래커</h1>
      <div className="space-y-6">
        <SleepAnalysis />
        <ChartDashboard />
      </div>
    </div>
  )
}
