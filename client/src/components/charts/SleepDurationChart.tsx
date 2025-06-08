import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { ChartData } from './types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: '일별 총 수면시간'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: '시간'
      }
    }
  }
}

export default function SleepDurationChart({ entries }: ChartData) {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const calculateDuration = (sleepTime: string, wakeTime: string) => {
    const sleep = new Date(sleepTime)
    const wake = new Date(wakeTime)
    const diff = wake.getTime() - sleep.getTime()
    return diff / (1000 * 60 * 60) // 시간 단위로 변환
  }

  const data = {
    labels: sortedEntries.map(entry => format(parseISO(entry.date), 'M/d (E)', { locale: ko })),
    datasets: [
      {
        label: '수면 시간',
        data: sortedEntries.map(entry => calculateDuration(entry.sleepTime, entry.wakeTime)),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Bar options={options} data={data} />
    </div>
  )
}
