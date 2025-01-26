import React from 'react'
import { Calendar, Clock, Link } from 'lucide-react'

interface MeetsModalProps {
  events: CalendarEvent[]
  onClose: () => void
}

export default function MeetsModal({ events, onClose }: MeetsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Scheduled Meetings</h2>
        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-gray-500">No meetings scheduled</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{event.topic}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(event.date).toDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:text-blue-600"
                  >
                    <Link className="h-5 w-5 mr-1" />
                    Join
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
