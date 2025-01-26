import React, { useState, useEffect, useRef } from 'react'
import { Send, Calendar as CalendarIcon } from 'lucide-react'
import CalendarModal from './components/CalendarModal'
import MeetsModal from './components/MeetsModal'

interface GroupChatProps {
  group: Group
  userProfile: UserProfile | null
}

export default function GroupChat({ group, userProfile }: GroupChatProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>(group.messages)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showMeets, setShowMeets] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add welcome message if this is a new group
    if (messages.length === 0 && userProfile) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: `${userProfile.name} has joined the group!`,
        timestamp: Date.now(),
        type: 'system',
        username: 'System'
      }
      setMessages([welcomeMessage])
      
      // Update local storage
      const groups = JSON.parse(localStorage.getItem('groups') || '[]')
      const updatedGroups = groups.map((g: Group) => 
        g.id === group.id ? { ...g, messages: [welcomeMessage] } : g
      )
      localStorage.setItem('groups', JSON.stringify(updatedGroups))
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!message.trim() || !userProfile) return
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      timestamp: Date.now(),
      type: 'user',
      username: userProfile.name,
      isCurrentUser: true
    }
    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    setMessage('')
    
    // Update local storage
    const groups = JSON.parse(localStorage.getItem('groups') || '[]')
    const updatedGroups = groups.map((g: Group) => 
      g.id === group.id ? { ...g, messages: updatedMessages } : g
    )
    localStorage.setItem('groups', JSON.stringify(updatedGroups))
  }

  const handleCreateEvent = (event: CalendarEvent) => {
    if (!userProfile) return
    
    setEvents([...events, event])
    const newMessage: Message = {
      id: Date.now().toString(),
      text: `${userProfile.name} wants to teach you about ${event.topic}, join here: ${event.link}`,
      timestamp: Date.now(),
      type: 'event',
      username: userProfile.name,
      isCurrentUser: true
    }
    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    
    // Update local storage
    const groups = JSON.parse(localStorage.getItem('groups') || '[]')
    const updatedGroups = groups.map((g: Group) => 
      g.id === group.id ? { ...g, messages: updatedMessages } : g
    )
    localStorage.setItem('groups', JSON.stringify(updatedGroups))
  }

  const renderMessage = (msg: Message) => {
    const isCurrentUser = msg.isCurrentUser
    const messageClasses = `p-3 rounded-lg shadow-sm max-w-[80%] ${
      isCurrentUser 
        ? 'bg-blue-500 text-white ml-auto' 
        : 'bg-white text-gray-800 mr-auto'
    }`

    // Convert URLs to clickable links
    const renderTextWithLinks = (text: string) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g
      return text.split(urlRegex).map((part, i) =>
        urlRegex.test(part) ? (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 underline"
          >
            {part}
          </a>
        ) : (
          part
        )
      )
    }

    return (
      <div 
        key={msg.id} 
        className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
      >
        {msg.type === 'user' && (
          <span className="text-sm text-gray-500 mb-1">
            {msg.username}
          </span>
        )}
        <div className={messageClasses}>
          <p>{renderTextWithLinks(msg.text)}</p>
          <p className={`text-xs mt-1 ${
            isCurrentUser ? 'text-blue-200' : 'text-gray-400'
          }`}>
            {new Date(msg.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="bg-white p-4 shadow">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{group.name}</h2>
            <p className="text-gray-500">{group.description}</p>
            <p className="text-sm text-gray-400">Member limit: {group.limit}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCalendar(true)}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              <CalendarIcon className="h-5 w-5" />
              <span className="ml-2">Schedule</span>
            </button>
            <button
              onClick={() => setShowMeets(true)}
              className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
            >
              <CalendarIcon className="h-5 w-5" />
              <span className="ml-2">Meets</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-4 shadow">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showCalendar && (
        <CalendarModal
          onClose={() => setShowCalendar(false)}
          onCreateEvent={handleCreateEvent}
        />
      )}

      {showMeets && (
        <MeetsModal
          events={events}
          onClose={() => setShowMeets(false)}
        />
      )}
    </div>
  )
}

interface Group {
  id: string
  name: string
  description: string
  limit: number
  messages: Message[]
}

interface Message {
  id: string
  text: string
  timestamp: number
  type: 'user' | 'system' | 'event'
  username?: string
  isCurrentUser?: boolean
}

interface CalendarEvent {
  id: string
  topic: string
  date: string
  time: string
  link: string
  createdAt: number
}

interface UserProfile {
  name: string
  teachingInterest: string
}
