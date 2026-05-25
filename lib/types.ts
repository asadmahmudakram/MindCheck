export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  moodData?: MoodData
}

export interface MoodData {
  score: number
  emotion: string
  color: string
  activities: string[]
}

export interface CheckinEntry {
  id: string
  date: string
  score: number
  emotion: string
  color: string
  summary: string
}
