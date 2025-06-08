import { PrismaClient } from '@prisma/client'
import { subDays, setHours, setMinutes } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  // 기존 데이터 삭제
  await prisma.sleepEntry.deleteMany()

  // 최근 7일간의 더미 데이터 생성
  const dummyData = Array.from({ length: 7 }).map((_, index) => {
    const date = subDays(new Date(), index)

    // 취침 시간: 21:00 - 01:00 사이 랜덤
    const sleepHour = Math.floor(Math.random() * 5) + 21 // 21-01시
    const sleepMinute = Math.floor(Math.random() * 60)
    const sleepTime = setMinutes(setHours(date, sleepHour % 24), sleepMinute)

    // 기상 시간: 05:00 - 09:00 사이 랜덤
    const wakeHour = Math.floor(Math.random() * 5) + 5 // 05-09시
    const wakeMinute = Math.floor(Math.random() * 60)
    const wakeTime = setMinutes(setHours(date, wakeHour), wakeMinute)

    // 수면 품질: 1-5 랜덤
    const quality = Math.floor(Math.random() * 5) + 1

    return {
      date: date.toISOString().split('T')[0],
      sleepTime: sleepTime.toISOString(),
      wakeTime: wakeTime.toISOString(),
      quality,
      note: `Day ${index + 1} sleep record`
    }
  })

  // 데이터베이스에 더미 데이터 입력
  for (const data of dummyData) {
    await prisma.sleepEntry.create({
      data
    })
  }

  console.log('Seed data created successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
