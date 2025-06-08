import { Router } from 'express'
import { PrismaClient, SleepEntry } from '@prisma/client'
import { subDays } from 'date-fns'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()
const prisma = new PrismaClient()

// Gemini AI 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

// AI 분석 엔드포인트
router.get('/analysis/:days', async (req, res) => {
  try {
    const days = parseInt(req.params.days)
    const startDate = subDays(new Date(), days)

    // 최근 N일간의 수면 기록 조회
    const sleepEntries = await prisma.sleepEntry.findMany({
      where: {
        date: {
          gte: startDate.toISOString()
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // AI 분석을 위한 데이터 포맷팅
    const analysisData = sleepEntries.map((entry: SleepEntry) => ({
      date: entry.date,
      sleepTime: new Date(entry.sleepTime).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      wakeTime: new Date(entry.wakeTime).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      quality: entry.quality,
      note: entry.note
    }))

    // Gemini AI로 분석 요청
    const prompt = `다음은 최근 ${days}일간의 수면 기록입니다. 이 데이터를 분석하여 수면 패턴의 특징과 개선을 위한 구체적인 조언을 제공해주세요:

수면 기록:
${JSON.stringify(analysisData, null, 2)}

다음 형식으로 분석해주세요:
1. 수면 시간 패턴 분석
2. 수면 품질 분석
3. 주요 문제점
4. 개선을 위한 구체적인 조언`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysis = response.text()

    res.json({
      sleepData: analysisData,
      analysis
    })
  } catch (error) {
    console.error('AI 분석 중 오류 발생:', error)
    res.status(500).json({ error: 'AI 분석 중 오류가 발생했습니다.' })
  }
})

export default router
