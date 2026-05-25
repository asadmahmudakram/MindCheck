'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { CheckinEntry } from '@/lib/types'

interface MoodChartProps {
  entries: CheckinEntry[]
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number; payload: CheckinEntry }>
  label?: string
}) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload
    return (
      <div className="bg-white border border-sage-200 rounded-xl p-3 shadow-sm text-sm">
        <p className="font-medium text-sage-800">{label}</p>
        <p className="text-sage-600 mt-1">
          <span
            className="inline-block w-2 h-2 rounded-full mr-1"
            style={{ backgroundColor: entry.color }}
          />
          {entry.emotion} — {entry.score}/10
        </p>
      </div>
    )
  }
  return null
}

export default function MoodChart({ entries }: MoodChartProps) {
  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sage-400 text-sm">
        Belum ada data mood. Mulai check-in pertamamu! 🌱
      </div>
    )
  }

  const data = entries.slice(-7).map(e => ({
    ...e,
    day: new Date(e.date).toLocaleDateString('id-ID', { weekday: 'short' }),
  }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7da07d" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7da07d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6ede6" />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: '#5a825a' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 10]}
          tick={{ fontSize: 11, fill: '#5a825a' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#5a825a"
          strokeWidth={2.5}
          fill="url(#moodGradient)"
          dot={{ fill: '#5a825a', strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, fill: '#456745' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
