import React, { useState } from 'react'
import { Calendar, Clock } from 'lucide-react'

interface CalendarModalProps {
  onClose: () => void
  onCreateEvent: (event: CalendarEvent) => void
}

export default function CalendarModal({ onClose, onCreateEvent }: CalendarModalProps) {
  const [topic, setTopic] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [error, setError] = useState('')

  const generateJitsiLink = () => {
    const randomString = Math.random().toString(36).substring(2, 15)
    return `https://meet.jit.si/${randomString}`
  }

  const handleCreate = () => {
    const selectedDateTime = new Date(`${date}T${time}`)
    const now = new Date()
    
    if (!topic || !date || !time) {
      setError('All fields are required')
      return
    }
    
    if (selectedDateTime < now) {
      setError('Cannot schedule meetings in the past')
      return
    }
    
    const event: CalendarEvent = {
      id: Date.now().toString(),
      topic,
      date,
      time,
      link: generateJitsiLink(),
      createdAt: Date.now()
    }
    
    onCreateEvent(event)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Schedule Meeting</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Meeting topic"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <div className="relative mt-1">
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <div className="relative mt-1">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                />
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  )
}

export interface CalendarEvent {
  id: string
  topic: string
  date: string
  time: string
  link: string
  createdAt: number
}
