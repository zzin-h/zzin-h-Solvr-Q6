import React from 'react'
import { Link } from 'react-router-dom'
import SleepEntryItem from './SleepEntryItem'

interface SleepEntry {
  id: number
  date: string
  sleepTime: string
  wakeTime: string
  quality: number
  note?: string
}

interface SleepEntryListProps {
  entries: SleepEntry[]
  onDelete: (id: number) => void
}

export default function SleepEntryList({ entries, onDelete }: SleepEntryListProps) {
  if (entries.length === 0) {
    return (
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
    )
  }

  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <SleepEntryItem key={entry.id} {...entry} onDelete={onDelete} />
      ))}
    </div>
  )
}
