import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SleepEntryForm from '../components/sleep/SleepEntryForm'
import type { SleepEntryFormData } from '../components/sleep/SleepEntryForm'

export default function NewSleepEntryPage() {
  const navigate = useNavigate()

  const handleSubmit = (data: SleepEntryFormData) => {
    // TODO: API 연동 후 실제 저장 구현
    console.log('Submit new entry:', data)
    navigate('/sleep-entries')
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
        <SleepEntryForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  )
}
