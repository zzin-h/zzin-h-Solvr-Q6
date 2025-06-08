import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import SleepEntryList from '../components/sleep/SleepEntryList'
import SleepScheduleChart from '../components/charts/SleepScheduleChart'
import SleepDurationChart from '../components/charts/SleepDurationChart'
import SleepQualityChart from '../components/charts/SleepQualityChart'
import { sleepEntriesApi } from '../services/api'

export default function SleepEntryListPage() {
  const queryClient = useQueryClient()

  // 수면 기록 목록 조회
  const {
    data: entries = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['sleep-entries'],
    queryFn: sleepEntriesApi.getAll
  })

  // 수면 기록 삭제
  const deleteMutation = useMutation({
    mutationFn: sleepEntriesApi.delete,
    onSuccess: () => {
      // 삭제 후 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['sleep-entries'] })
    }
  })

  const handleDelete = (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">데이터를 불러오는 중 오류가 발생했습니다.</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">수면 분석</h1>
        <Link
          to="/sleep-entries/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          새 기록 작성
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">기록된 수면 데이터가 없습니다</h3>
          <p className="mt-1 text-sm text-gray-500">새로운 수면 기록을 작성해보세요.</p>
          <div className="mt-6">
            <Link
              to="/sleep-entries/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              새 기록 작성하기
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SleepScheduleChart entries={entries} />
            <SleepDurationChart entries={entries} />
          </div>
          <SleepQualityChart entries={entries} />
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">상세 기록</h2>
            <SleepEntryList entries={entries} onDelete={handleDelete} />
          </div>
        </div>
      )}
    </div>
  )
}
