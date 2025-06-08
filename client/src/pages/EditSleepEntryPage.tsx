import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SleepEntryForm from '../components/sleep/SleepEntryForm'
import type { SleepEntryFormData } from '../components/sleep/SleepEntryForm'

// 임시 데이터
const MOCK_ENTRY = {
  id: 1,
  date: '2024-03-20',
  sleepTime: '2024-03-20T23:00:00',
  wakeTime: '2024-03-21T07:00:00',
  quality: 4,
  note: '편안한 수면'
}

export default function EditSleepEntryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const handleSubmit = (data: SleepEntryFormData) => {
    // TODO: API 연동 후 실제 수정 구현
    console.log(`Update entry ${id}:`, data)
    navigate('/sleep-entries')
  }

  const handleCancel = () => {
    navigate('/sleep-entries')
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
        <SleepEntryForm initialData={MOCK_ENTRY} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  )
}
