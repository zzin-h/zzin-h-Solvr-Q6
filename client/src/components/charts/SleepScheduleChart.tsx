import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { ChartData } from './types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: '취침 및 기상 시간 패턴'
    }
  },
  scales: {
    y: {
      type: 'linear' as const,
      min: 0,
      max: 24,
      ticks: {
        callback: (value: number) => `${value}:00`
      }
    }
  }
}

export default function SleepScheduleChart({ entries }: ChartData) {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const getHourFromDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.getHours() + date.getMinutes() / 60
  }

  const data = {
    labels: sortedEntries.map(entry => format(parseISO(entry.date), 'M/d (E)', { locale: ko })),
    datasets: [
      {
        label: '취침 시각',
        data: sortedEntries.map(entry => getHourFromDate(entry.sleepTime)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      },
      {
        label: '기상 시각',
        data: sortedEntries.map(entry => getHourFromDate(entry.wakeTime)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Line options={options} data={data} />
    </div>
  )
}
