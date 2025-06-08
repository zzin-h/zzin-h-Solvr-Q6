import React from 'react'
import { Link } from 'react-router-dom'

export default function SleepEntryListPage() {
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

      {/* TODO: 수면 기록 목록 구현 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 text-center text-gray-500">수면 기록 목록이 곧 구현될 예정입니다.</div>
      </div>
    </div>
  )
}
