import React from 'react'
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
      <div className="text-center py-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">아직 기록된 수면 데이터가 없습니다.</p>
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
