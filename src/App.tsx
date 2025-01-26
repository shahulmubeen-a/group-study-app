import React, { useState, useEffect } from 'react'
import { Home, Plus } from 'lucide-react'
import CreateGroup from './CreateGroup'
import GroupChat from './GroupChat'
import UserProfileModal from './components/UserProfileModal'

function App() {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    }
  }, [])

  const handleGroupJoin = (group: Group) => {
    if (!userProfile) {
      setShowProfileModal(true)
    }
    setCurrentGroup(group)
  }

  const handleProfileSave = (profile: UserProfile) => {
    setUserProfile(profile)
    setShowProfileModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Home className="h-6 w-6 text-gray-500" />
              <span className="ml-2 text-xl font-semibold">Group Chat</span>
            </div>
            {!currentGroup && (
              <button
                onClick={() => setCurrentGroup({ id: 'new', name: '', description: '', limit: 2, messages: [] })}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                <Plus className="h-5 w-5" />
                <span className="ml-2">Create Group</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {currentGroup ? (
          currentGroup.id === 'new' ? (
            <CreateGroup onCreate={handleGroupJoin} />
          ) : (
            <GroupChat 
              group={currentGroup} 
              userProfile={userProfile}
            />
          )
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700">No group selected</h2>
            <p className="mt-2 text-gray-500">Create or join a group to start chatting</p>
          </div>
        )}
      </main>

      {showProfileModal && (
        <UserProfileModal onSave={handleProfileSave} />
      )}
    </div>
  )
}

export default App

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
}

export interface UserProfile {
  name: string
  teachingInterest: string
}
