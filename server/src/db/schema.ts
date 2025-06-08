import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// 사용자 테이블 스키마
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['ADMIN', 'USER', 'GUEST'] })
    .notNull()
    .default('USER'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString())
})

// 수면 기록 테이블 스키마
export const sleepEntries = sqliteTable('sleep_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull(),
  date: text('date').notNull(), // 'YYYY-MM-DD'
  sleepTime: text('sleep_time').notNull(), // 취침시각(ISO)
  wakeTime: text('wake_time').notNull(), // 기상시각(ISO)
  quality: integer('quality').notNull(), // 수면 만족도(1-5)
  note: text('note'), // 특이사항(선택)
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString())
})

// 사용자 타입 정의
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UpdateUser = Partial<Omit<NewUser, 'id' | 'createdAt'>>

// 수면 기록 타입 정의
export type SleepEntry = typeof sleepEntries.$inferSelect
export type NewSleepEntry = typeof sleepEntries.$inferInsert
export type UpdateSleepEntry = Partial<Omit<NewSleepEntry, 'id' | 'createdAt'>>
