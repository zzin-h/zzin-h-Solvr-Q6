import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import sleepRouter from './routes/sleep'

const app = express()
const prisma = new PrismaClient()
const port = process.env.PORT || 8000

// CORS 설정
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
  })
)
app.use(express.json())

// 라우터 연결
app.use('/api/sleep-entries', sleepRouter)

// 모든 수면 기록 조회
app.get('/api/sleep-entries', async (req, res) => {
  try {
    const entries = await prisma.sleepEntry.findMany({
      orderBy: {
        date: 'desc'
      }
    })
    res.json(entries)
  } catch (error) {
    console.error('Error fetching sleep entries:', error)
    res.status(500).json({ error: 'Failed to fetch sleep entries' })
  }
})

// 새 수면 기록 생성
app.post('/api/sleep-entries', async (req, res) => {
  try {
    const entry = await prisma.sleepEntry.create({
      data: {
        date: req.body.date,
        sleepTime: new Date(req.body.sleepTime),
        wakeTime: new Date(req.body.wakeTime),
        quality: req.body.quality,
        note: req.body.note
      }
    })
    res.status(201).json(entry)
  } catch (error) {
    console.error('Error creating sleep entry:', error)
    res.status(500).json({ error: 'Failed to create sleep entry' })
  }
})

// 수면 기록 수정
app.put('/api/sleep-entries/:id', async (req, res) => {
  try {
    const entry = await prisma.sleepEntry.update({
      where: { id: parseInt(req.params.id) },
      data: {
        date: req.body.date,
        sleepTime: new Date(req.body.sleepTime),
        wakeTime: new Date(req.body.wakeTime),
        quality: req.body.quality,
        note: req.body.note
      }
    })
    res.json(entry)
  } catch (error) {
    console.error('Error updating sleep entry:', error)
    res.status(500).json({ error: 'Failed to update sleep entry' })
  }
})

// 수면 기록 삭제
app.delete('/api/sleep-entries/:id', async (req, res) => {
  try {
    await prisma.sleepEntry.delete({
      where: { id: parseInt(req.params.id) }
    })
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting sleep entry:', error)
    res.status(500).json({ error: 'Failed to delete sleep entry' })
  }
})

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`)
})
