import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import SleepEntryList from '../components/sleep/SleepEntryList'
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-600">데이터를 불러오는 중 오류가 발생했습니다.</div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">기록된 수면 데이터가 없습니다</h3>
        <p className="text-gray-500">새로운 수면 기록을 작성해보세요.</p>
      </div>
    )
  }

  return <SleepEntryList entries={entries} onDelete={handleDelete} />
}
