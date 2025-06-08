import React from 'react'
import { Link, useParams } from 'react-router-dom'

export default function EditSleepEntryPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">수면 기록 수정</h1>
        <Link to="/sleep-entries" className="text-indigo-600 hover:text-indigo-800">
          목록으로 돌아가기
        </Link>
      </div>

      {/* TODO: 수면 기록 수정 폼 구현 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-500">
          수면 기록 #{id} 수정 폼이 곧 구현될 예정입니다.
        </div>
      </div>
    </div>
  )
}
