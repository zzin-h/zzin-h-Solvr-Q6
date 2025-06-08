import { Router } from 'express'
import type { PrismaClient } from '@prisma/client'
import { subDays } from 'date-fns'
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import dotenv from 'dotenv'
import { PrismaClient as PrismaClientConstructor } from '@prisma/client'

// 환경 변수 로드
dotenv.config()

const router: Router = Router()
const prisma: PrismaClient = new PrismaClientConstructor()

// API 키 검증
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY가 설정되지 않았습니다.')
  process.exit(1)
}

// Gemini AI 초기화
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' })

// AI 분석 엔드포인트
router.get('/ai/:days', async (req, res) => {
  try {
    console.log('AI 분석 요청 받음:', req.params.days, '일')

    const days = parseInt(req.params.days)
    const startDate = subDays(new Date(), days)

    // 최근 N일간의 수면 기록 조회
    const sleepEntries = await prisma.sleepEntry.findMany({
      where: {
        date: {
          gte: startDate.toISOString().split('T')[0]
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    console.log('조회된 수면 기록:', sleepEntries.length, '개')

    if (sleepEntries.length === 0) {
      return res.status(404).json({ error: '분석할 수면 기록이 없습니다.' })
    }

    // AI 분석을 위한 데이터 포맷팅
    const analysisData = sleepEntries.map(entry => ({
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

    console.log('AI 분석 데이터 준비됨:', JSON.stringify(analysisData, null, 2))

    // Gemini AI로 분석 요청
    const prompt = `당신은 수면 전문가입니다. 다음은 최근 ${days}일간의 수면 기록입니다. 이 데이터를 분석하여 수면 패턴의 특징과 개선을 위한 구체적인 조언을 제공해주세요.

수면 기록:
${JSON.stringify(analysisData, null, 2)}

다음 형식으로 분석해주세요:
1. 수면 시간 패턴 분석
- 평균 취침 시간과 기상 시간
- 수면 시간의 일관성
- 주중/주말 패턴 차이

2. 수면 품질 분석
- 평균 수면 품질 점수
- 수면 품질이 좋은/나쁜 날의 패턴
- 수면 품질에 영향을 미치는 요인

3. 주요 문제점
- 불규칙한 수면 패턴
- 수면 부족 또는 과다
- 수면 품질 저하 요인

4. 개선을 위한 구체적인 조언
- 이상적인 수면 스케줄 제안
- 수면 품질 개선을 위한 실천 방법
- 생활 습관 개선 제안`

    console.log('AI 분석 요청 시작')
    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysis = response.text()
    console.log('AI 분석 완료')

    if (!analysis) {
      throw new Error('AI가 분석 결과를 생성하지 못했습니다.')
    }

    res.json({
      sleepData: analysisData,
      analysis
    })
  } catch (error: any) {
    console.error('AI 분석 중 오류 발생:', error)

    // Axios 등 네트워크 에러의 경우, 상세 응답 확인
    if (error.response) {
      console.error('API 응답 오류:', error.response.data)
    }

    // 구체적인 에러 메시지 반환
    const errorMessage = error instanceof Error ? error.message : 'AI 분석 중 오류가 발생했습니다.'
    res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    })
  }
})

export default router
