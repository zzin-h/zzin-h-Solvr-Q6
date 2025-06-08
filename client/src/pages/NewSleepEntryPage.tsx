import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import SleepEntryForm from '../components/sleep/SleepEntryForm'
import type { SleepEntryFormData } from '../components/sleep/SleepEntryForm'
import { sleepEntriesApi } from '../services/api'

export default function NewSleepEntryPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: sleepEntriesApi.create,
    onSuccess: () => {
      // 생성 후 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['sleep-entries'] })
      navigate('/sleep-entries')
    }
  })

  const handleSubmit = (data: SleepEntryFormData) => {
    createMutation.mutate(data)
  }

  const handleCancel = () => {
    navigate('/sleep-entries')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">새 수면 기록 작성</h1>
        <Link to="/sleep-entries" className="text-indigo-600 hover:text-indigo-800">
          목록으로 돌아가기
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <SleepEntryForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createMutation.isPending}
        />
        {createMutation.isError && (
          <div className="mt-4 text-red-600">저장 중 오류가 발생했습니다. 다시 시도해주세요.</div>
        )}
      </div>
    </div>
  )
}
