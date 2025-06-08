import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SleepEntryList from '../components/sleep/SleepEntryList'

// 임시 데이터
const MOCK_ENTRIES = [
  {
    id: 1,
    date: '2024-03-20',
    sleepTime: '2024-03-20T23:00:00',
    wakeTime: '2024-03-21T07:00:00',
    quality: 4,
    note: '편안한 수면'
  },
  {
    id: 2,
    date: '2024-03-21',
    sleepTime: '2024-03-21T23:30:00',
    wakeTime: '2024-03-22T07:30:00',
    quality: 3,
    note: '중간에 한 번 깸'
  }
]

export default function SleepEntryListPage() {
  const [entries] = useState(MOCK_ENTRIES)

  const handleDelete = (id: number) => {
    // TODO: API 연동 후 실제 삭제 구현
    console.log(`Delete entry ${id}`)
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
