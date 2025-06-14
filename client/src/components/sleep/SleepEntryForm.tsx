import React, { useState, useEffect } from 'react'

export interface SleepEntryFormData {
  date: string
  sleepTime: string
  wakeTime: string
  quality: number
  note?: string
}

interface SleepEntryFormProps {
  initialData?: SleepEntryFormData
  onSubmit: (data: SleepEntryFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

// ISO 문자열에서 시간만 추출하는 함수
const formatTimeFromISO = (isoString: string) => {
  const date = new Date(isoString)
  return date.toTimeString().slice(0, 5) // "HH:mm" 형식으로 반환
}

export default function SleepEntryForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting
}: SleepEntryFormProps) {
  const [formData, setFormData] = useState<SleepEntryFormData>({
    date: new Date().toISOString().split('T')[0],
    sleepTime: '',
    wakeTime: '',
    quality: 3,
    note: ''
  })

  // initialData가 변경될 때 폼 데이터 업데이트
  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        sleepTime: formatTimeFromISO(initialData.sleepTime),
        wakeTime: formatTimeFromISO(initialData.wakeTime),
        quality: initialData.quality,
        note: initialData.note || ''
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 날짜와 시간을 ISO 문자열로 변환
    const sleepDateTime = new Date(`${formData.date}T${formData.sleepTime}:00`)
    const wakeDateTime = new Date(`${formData.date}T${formData.wakeTime}:00`)

    // 만약 기상 시각이 취침 시각보다 이른 경우, 다음 날로 설정
    if (wakeDateTime <= sleepDateTime) {
      wakeDateTime.setDate(wakeDateTime.getDate() + 1)
    }

    const submissionData = {
      ...formData,
      sleepTime: sleepDateTime.toISOString(),
      wakeTime: wakeDateTime.toISOString()
    }

    onSubmit(submissionData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quality' ? Number(value) : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">날짜</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">취침 시각</label>
        <input
          type="time"
          name="sleepTime"
          value={formData.sleepTime}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">기상 시각</label>
        <input
          type="time"
          name="wakeTime"
          value={formData.wakeTime}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">수면 품질</label>
        <select
          name="quality"
          value={formData.quality}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          <option value={1}>1 - 매우 나쁨</option>
          <option value={2}>2 - 나쁨</option>
          <option value={3}>3 - 보통</option>
          <option value={4}>4 - 좋음</option>
          <option value={5}>5 - 매우 좋음</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">특이사항</label>
        <textarea
          name="note"
          value={formData.note || ''}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="특이사항이 있다면 입력해주세요."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
}
