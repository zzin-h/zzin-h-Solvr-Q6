import React from 'react'
import { Link } from 'react-router-dom'
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
        <h1 className="text-2xl font-bold">수면 기록 목록</h1>
        <Link
          to="/sleep-entries/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          새 기록 작성
        </Link>
      </div>

      <SleepEntryList entries={entries} onDelete={handleDelete} />
    </div>
  )
}
