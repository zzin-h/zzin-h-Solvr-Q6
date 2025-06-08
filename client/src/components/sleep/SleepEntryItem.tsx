import React from 'react'
import { Link } from 'react-router-dom'
import { differenceInMinutes } from 'date-fns'

interface SleepEntryItemProps {
  id: number
  date: string
  sleepTime: string
  wakeTime: string
  quality: number
  note?: string
  onDelete: (id: number) => void
}

export default function SleepEntryItem({
  id,
  date,
  sleepTime,
  wakeTime,
  quality,
  note,
  onDelete
}: SleepEntryItemProps) {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getQualityText = (quality: number) => {
    const qualities = ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음']
    return qualities[quality - 1] || '알 수 없음'
  }

  const calculateDuration = (sleepTime: string, wakeTime: string) => {
    const sleep = new Date(sleepTime)
    const wake = new Date(wakeTime)

    // 날짜가 바뀌는 경우를 처리
    let diffMinutes = differenceInMinutes(wake, sleep)
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60 // 24시간을 더해줌
    }

    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    return `${hours}시간 ${minutes}분`
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="text-lg font-semibold">
            {new Date(date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="text-sm text-gray-600">
            취침: {formatTime(sleepTime)} / 기상: {formatTime(wakeTime)}
          </div>
          <div className="text-sm text-gray-600">
            수면 시간: {calculateDuration(sleepTime, wakeTime)}
          </div>
          <div className="text-sm text-gray-600">수면 품질: {getQualityText(quality)}</div>
          {note && <div className="text-sm text-gray-600">특이사항: {note}</div>}
        </div>
        <div className="flex space-x-2">
          <Link to={`/sleep-entries/${id}/edit`} className="text-indigo-600 hover:text-indigo-800">
            수정
          </Link>
          <button onClick={() => onDelete(id)} className="text-red-600 hover:text-red-800">
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}
