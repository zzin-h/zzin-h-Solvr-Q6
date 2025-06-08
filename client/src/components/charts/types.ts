import type { SleepEntry } from '../../types/sleep'

export interface ChartData {
  entries: SleepEntry[]
  startDate?: Date
  endDate?: Date
}
