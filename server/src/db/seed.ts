import { PrismaClient } from '@prisma/client'
import { addDays, subDays, setHours, setMinutes } from 'date-fns'

const prisma = new PrismaClient()

// 랜덤 시간 생성 함수 (시:분 형식)
const getRandomTime = (minHour: number, maxHour: number, date: Date) => {
  const hour = Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour
  const minute = Math.floor(Math.random() * 4) * 15 // 15분 단위로 생성
  const result = new Date(date)

  // 자정 이후 시간 처리 (예: 25시 -> 다음날 01시)
  if (hour >= 24) {
    result.setDate(result.getDate() + 1)
    result.setHours(hour - 24, minute)
  } else {
    result.setHours(hour, minute)
  }

  return result
}

// 더미 데이터 생성
async function seed() {
  // 기존 데이터 삭제
  await prisma.sleepEntry.deleteMany()

  // 오늘 날짜
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 최근 30일간의 더미 데이터 생성
  const dummyData = Array.from({ length: 30 }).map((_, index) => {
    const date = subDays(today, index)
    date.setHours(0, 0, 0, 0)

    // 취침 시간: 전날 21:00 ~ 다음날 01:00 사이
    const sleepTimeHour =
      Math.random() < 0.3 // 30% 확률로 자정 이후
        ? Math.floor(Math.random() * 2) + 24 // 24-25시 (00-01시)
        : Math.floor(Math.random() * 4) + 21 // 21-24시

    const sleepTime = getRandomTime(sleepTimeHour, sleepTimeHour, date)

    // 기상 시간: 05:00 ~ 09:00 사이
    const wakeTime = getRandomTime(5, 9, date)

    // 수면 품질: 1-5 사이의 랜덤 값
    const quality = Math.floor(Math.random() * 5) + 1

    // 특이사항 메모
    const notes = ['숙면했음', '잠들기 어려웠음', '중간에 깼음', '꿈을 꿨음', '일찍 일어남', null]
    const note = notes[Math.floor(Math.random() * notes.length)]

    return {
      date: date.toISOString().split('T')[0],
      sleepTime: sleepTime.toISOString(),
      wakeTime: wakeTime.toISOString(),
      quality,
      note,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString()
    }
  })

  // 데이터베이스에 더미 데이터 삽입
  for (const data of dummyData) {
    await prisma.sleepEntry.create({
      data
    })
  }

  console.log('✨ 30개의 더미 데이터가 성공적으로 생성되었습니다.')
}

// 시드 스크립트 실행
seed()
  .catch(error => {
    console.error('❌ 시드 스크립트 실행 중 오류가 발생했습니다:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
