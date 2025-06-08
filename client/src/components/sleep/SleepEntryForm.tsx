import React, { useState } from 'react'

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
}

export default function SleepEntryForm({ initialData, onSubmit, onCancel }: SleepEntryFormProps) {
  const [formData, setFormData] = useState<SleepEntryFormData>(
    initialData || {
      date: new Date().toISOString().split('T')[0],
      sleepTime: '',
      wakeTime: '',
      quality: 3,
      note: ''
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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
          type="datetime-local"
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
          type="datetime-local"
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
          value={formData.note}
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
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          저장
        </button>
      </div>
    </form>
  )
}
