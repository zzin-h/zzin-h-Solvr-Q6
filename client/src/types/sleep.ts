export interface SleepEntry {
  id: number
  userId: number
  date: string
  sleepTime: string
  wakeTime: string
  quality: number
  note?: string
  createdAt: string
  updatedAt: string
}

export interface CreateSleepEntryDto {
  date: string
  sleepTime: string
  wakeTime: string
  quality: number
  note?: string
}

export type UpdateSleepEntryDto = CreateSleepEntryDto
