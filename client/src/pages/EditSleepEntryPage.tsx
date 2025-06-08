import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import SleepEntryForm from '../components/sleep/SleepEntryForm'
import type { SleepEntryFormData } from '../components/sleep/SleepEntryForm'
import { sleepEntriesApi } from '../services/api'

export default function EditSleepEntryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // 수면 기록 조회
  const {
    data: entry,
    isLoading,
    error
  } = useQuery({
    queryKey: ['sleep-entries', id],
    queryFn: () => sleepEntriesApi.getById(Number(id)),
    enabled: !!id
  })

  // 수면 기록 수정
  const updateMutation = useMutation({
    mutationFn: (data: SleepEntryFormData) => sleepEntriesApi.update(Number(id), data),
    onSuccess: () => {
      // 수정 후 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['sleep-entries'] })
      navigate('/sleep-entries')
    }
  })

  const handleSubmit = (data: SleepEntryFormData) => {
    updateMutation.mutate(data)
  }

  const handleCancel = () => {
    navigate('/sleep-entries')
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">로딩 중...</div>
      </div>
    )
  }

  if (error || !entry) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">데이터를 불러오는 중 오류가 발생했습니다.</div>
      </div>
    )
  }

  const initialData: SleepEntryFormData = {
    date: entry.date,
    sleepTime: entry.sleepTime,
    wakeTime: entry.wakeTime,
    quality: entry.quality,
    note: entry.note
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">수면 기록 수정</h1>
        <Link to="/sleep-entries" className="text-indigo-600 hover:text-indigo-800">
          목록으로 돌아가기
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <SleepEntryForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={updateMutation.isPending}
        />
        {updateMutation.isError && (
          <div className="mt-4 text-red-600">수정 중 오류가 발생했습니다. 다시 시도해주세요.</div>
        )}
      </div>
    </div>
  )
}
