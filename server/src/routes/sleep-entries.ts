import { FastifyInstance } from 'fastify'
import { getDb } from '../db'
import { sleepEntries } from '../db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// 요청 데이터 검증을 위한 스키마
const createSleepEntrySchema = z.object({
  userId: z.number().default(1), // MVP에서는 기본값 1 사용
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  sleepTime: z.string().datetime(), // ISO 날짜 문자열
  wakeTime: z.string().datetime(), // ISO 날짜 문자열
  quality: z.number().min(1).max(5),
  note: z.string().optional()
})

const updateSleepEntrySchema = createSleepEntrySchema.partial()

export default async function sleepEntriesRoutes(fastify: FastifyInstance) {
  const db = await getDb()

  // 수면 기록 목록 조회 (GET /api/sleep-entries?userId=1)
  fastify.get('/sleep-entries', async (request, reply) => {
    const { userId = 1 } = request.query as { userId?: number }

    try {
      const records = await db
        .select()
        .from(sleepEntries)
        .where(eq(sleepEntries.userId, userId))
        .orderBy(sleepEntries.date)

      return reply.send(records)
    } catch (error) {
      return reply.code(500).send({ error: '수면 기록 조회에 실패했습니다.' })
    }
  })

  // 수면 기록 상세 조회 (GET /api/sleep-entries/:id)
  fastify.get('/sleep-entries/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const record = await db
        .select()
        .from(sleepEntries)
        .where(eq(sleepEntries.id, parseInt(id)))
        .limit(1)

      if (record.length === 0) {
        return reply.code(404).send({ error: '수면 기록을 찾을 수 없습니다.' })
      }

      return reply.send(record[0])
    } catch (error) {
      return reply.code(500).send({ error: '수면 기록 조회에 실패했습니다.' })
    }
  })

  // 새 수면 기록 추가 (POST /api/sleep-entries)
  fastify.post('/sleep-entries', async (request, reply) => {
    try {
      const data = createSleepEntrySchema.parse(request.body)

      const result = await db.insert(sleepEntries).values(data).returning()

      return reply.code(201).send(result[0])
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: '잘못된 입력 데이터입니다.', details: error.errors })
      }
      console.error('Error creating sleep entry:', error)
      return reply.code(500).send({ error: '수면 기록 생성에 실패했습니다.' })
    }
  })

  // 수면 기록 수정 (PUT /api/sleep-entries/:id)
  fastify.put('/sleep-entries/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const updates = updateSleepEntrySchema.parse(request.body)

      const result = await db
        .update(sleepEntries)
        .set({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .where(eq(sleepEntries.id, parseInt(id)))
        .returning()

      if (result.length === 0) {
        return reply.code(404).send({ error: '수면 기록을 찾을 수 없습니다.' })
      }

      return reply.send(result[0])
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: '잘못된 입력 데이터입니다.', details: error.errors })
      }
      return reply.code(500).send({ error: '수면 기록 수정에 실패했습니다.' })
    }
  })

  // 수면 기록 삭제 (DELETE /api/sleep-entries/:id)
  fastify.delete('/sleep-entries/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const result = await db
        .delete(sleepEntries)
        .where(eq(sleepEntries.id, parseInt(id)))
        .returning()

      if (result.length === 0) {
        return reply.code(404).send({ error: '수면 기록을 찾을 수 없습니다.' })
      }

      return reply.send({ message: '수면 기록이 삭제되었습니다.' })
    } catch (error) {
      return reply.code(500).send({ error: '수면 기록 삭제에 실패했습니다.' })
    }
  })
}
