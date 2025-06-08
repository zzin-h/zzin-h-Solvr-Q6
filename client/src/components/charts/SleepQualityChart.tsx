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
      text: '수면 품질 추이'
    }
  },
  scales: {
    y: {
      min: 1,
      max: 5,
      ticks: {
        stepSize: 1
      }
    }
  }
}

// 이동 평균 계산 함수
const calculateMovingAverage = (data: number[], windowSize: number) => {
  const result = []
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1)
    const window = data.slice(start, i + 1)
    const average = window.reduce((sum, val) => sum + val, 0) / window.length
    result.push(Number(average.toFixed(2)))
  }
  return result
}

export default function SleepQualityChart({ entries }: ChartData) {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const qualityData = sortedEntries.map(entry => entry.quality)
  const movingAverageData = calculateMovingAverage(qualityData, 7) // 7일 이동 평균

  const data = {
    labels: sortedEntries.map(entry => format(parseISO(entry.date), 'M/d (E)', { locale: ko })),
    datasets: [
      {
        label: '수면 품질',
        data: qualityData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointStyle: 'circle'
      },
      {
        label: '7일 이동 평균',
        data: movingAverageData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderDash: [5, 5],
        pointStyle: 'dash'
      }
    ]
  }

  const averageQuality = (
    qualityData.reduce((sum, val) => sum + val, 0) / qualityData.length
  ).toFixed(2)

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4 text-center">
        <span className="text-lg font-semibold">평균 수면 품질: {averageQuality}</span>
      </div>
      <Line options={options} data={data} />
    </div>
  )
}
