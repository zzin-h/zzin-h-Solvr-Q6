import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface AnalysisResponse {
  sleepData: {
    date: string
    sleepTime: string
    wakeTime: string
    quality: number
    note?: string
  }[]
  analysis: string
}

const API_BASE_URL = 'http://localhost:8000'

export default function SleepAnalysis() {
  const [selectedDays, setSelectedDays] = useState<number>(7)

  const {
    data: analysisData,
    isLoading,
    error
  } = useQuery<AnalysisResponse>({
    queryKey: ['sleepAnalysis', selectedDays],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/api/sleep-entries/ai/${selectedDays}`)
      return response.data
    },
    retry: 1
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    console.error('AI 분석 에러:', error)
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600">
          분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 text-sm">{(error as any)?.message}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">AI 수면 분석</h2>
        <select
          value={selectedDays}
          onChange={e => setSelectedDays(Number(e.target.value))}
          className="border rounded px-3 py-1"
        >
          <option value={7}>최근 7일</option>
          <option value={14}>최근 14일</option>
          <option value={30}>최근 30일</option>
        </select>
      </div>

      {analysisData && (
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap">{analysisData.analysis}</div>
        </div>
      )}
    </div>
  )
}
